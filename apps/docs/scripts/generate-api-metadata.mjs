import { readdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import ts from "typescript"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const root = resolve(__dirname, "..", "..", "..")

const componentsDir = join(root, "packages", "ui", "src", "components")
const outputFile = join(root, "apps", "docs", "src", "lib", "generated-api-metadata.ts")

function tryParseExistingMetadata() {
  try {
    const source = readFileSync(outputFile, "utf8")
    const match = source.match(/export const generatedApiMetadata = (\{[\s\S]*\}) as const satisfies/)
    if (!match) {
      return null
    }
    return JSON.parse(match[1])
  } catch {
    return null
  }
}

function isExported(node) {
  return Array.isArray(node.modifiers) && node.modifiers.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)
}

function normalizeTypeText(typeText) {
  return typeText.replace(/\s+/g, " ").trim()
}

function normalizeInlineText(text) {
  return text.replace(/\s+/g, " ").trim()
}

function getPropertyName(nameNode) {
  if (!nameNode) return null
  if (ts.isIdentifier(nameNode)) return nameNode.text
  if (ts.isStringLiteral(nameNode)) return nameNode.text
  return null
}

function extractJSDocComment(node, sourceFile) {
  const fullText = node.getFullText(sourceFile)
  const match = fullText.match(/\/\*\*([\s\S]*?)\*\//)
  if (!match) {
    return undefined
  }

  const comment = match[1]
    .split("\n")
    .map((line) => line.replace(/^\s*\*\s?/, "").trim())
    .filter((line) => line.length > 0)
    .join(" ")

  return comment ? normalizeInlineText(comment) : undefined
}

function collectProperty(member, sourceFile) {
  if (!ts.isPropertySignature(member)) return null
  const name = getPropertyName(member.name)
  if (!name) return null
  return {
    name,
    type: normalizeTypeText(member.type ? member.type.getText(sourceFile) : "unknown"),
    optional: Boolean(member.questionToken),
    description: extractJSDocComment(member, sourceFile)
  }
}

function mergeFields(fields) {
  const merged = new Map()

  for (const field of fields) {
    const existing = merged.get(field.name)
    if (!existing) {
      merged.set(field.name, field)
      continue
    }

    const next = {
      name: field.name,
      optional: existing.optional && field.optional,
      type: existing.type === "unknown" ? field.type : existing.type,
      description: existing.description ?? field.description,
      defaultValue: existing.defaultValue ?? field.defaultValue
    }
    merged.set(field.name, next)
  }

  return Array.from(merged.values()).sort((a, b) => a.name.localeCompare(b.name))
}

function getObjectPropertyInitializer(objectNode, propertyName) {
  for (const property of objectNode.properties) {
    if (!ts.isPropertyAssignment(property)) continue
    if (getPropertyName(property.name) !== propertyName) continue
    return property.initializer
  }
  return null
}

function extractLiteralKeyNames(node) {
  if (!ts.isObjectLiteralExpression(node)) {
    return []
  }

  const keys = []
  for (const property of node.properties) {
    if (ts.isPropertyAssignment(property) || ts.isMethodDeclaration(property)) {
      const key = getPropertyName(property.name)
      if (key) keys.push(key)
    }
  }
  return keys
}

function formatDefaultValue(node, sourceFile) {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    return JSON.stringify(node.text)
  }
  return normalizeInlineText(node.getText(sourceFile))
}

function extractCvaSchemas(sourceFile) {
  const schemas = new Map()

  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) continue
    for (const declaration of statement.declarationList.declarations) {
      if (!ts.isIdentifier(declaration.name)) continue
      if (!declaration.initializer || !ts.isCallExpression(declaration.initializer)) continue
      if (!ts.isIdentifier(declaration.initializer.expression) || declaration.initializer.expression.text !== "cva") continue

      const schemaName = declaration.name.text
      const optionsArg = declaration.initializer.arguments[1]
      if (!optionsArg || !ts.isObjectLiteralExpression(optionsArg)) continue

      const variantsInitializer = getObjectPropertyInitializer(optionsArg, "variants")
      const defaultVariantsInitializer = getObjectPropertyInitializer(optionsArg, "defaultVariants")

      const variants = {}
      if (variantsInitializer && ts.isObjectLiteralExpression(variantsInitializer)) {
        for (const variantProperty of variantsInitializer.properties) {
          if (!ts.isPropertyAssignment(variantProperty)) continue
          const variantName = getPropertyName(variantProperty.name)
          if (!variantName) continue
          variants[variantName] = extractLiteralKeyNames(variantProperty.initializer)
        }
      }

      const defaultVariants = {}
      if (defaultVariantsInitializer && ts.isObjectLiteralExpression(defaultVariantsInitializer)) {
        for (const defaultProperty of defaultVariantsInitializer.properties) {
          if (!ts.isPropertyAssignment(defaultProperty)) continue
          const variantName = getPropertyName(defaultProperty.name)
          if (!variantName) continue
          defaultVariants[variantName] = formatDefaultValue(defaultProperty.initializer, sourceFile)
        }
      }

      schemas.set(schemaName, { variants, defaultVariants })
    }
  }

  return schemas
}

function extractTypeKeyLiterals(node) {
  if (!node) return []

  if (ts.isUnionTypeNode(node)) {
    return node.types.flatMap((part) => extractTypeKeyLiterals(part))
  }

  if (ts.isLiteralTypeNode(node)) {
    if (ts.isStringLiteral(node.literal)) return [node.literal.text]
    if (ts.isNumericLiteral(node.literal)) return [node.literal.text]
  }

  return []
}

function buildVariantFields(schemaName, schema) {
  const fields = []
  for (const [variantName, optionKeys] of Object.entries(schema.variants)) {
    fields.push({
      name: variantName,
      type: optionKeys.length > 0 ? optionKeys.map((key) => JSON.stringify(key)).join(" | ") : "unknown",
      optional: true,
      description: `Variant option from ${schemaName}.`,
      defaultValue: schema.defaultVariants[variantName]
    })
  }
  return fields
}

function extractFieldsFromReference(
  referenceName,
  typeArguments,
  declarationMap,
  cvaSchemas,
  sourceFile,
  seenTypes
) {
  if (referenceName === "VariantProps") {
    const typeArgument = typeArguments?.[0]
    if (!typeArgument || !ts.isTypeQueryNode(typeArgument) || !ts.isIdentifier(typeArgument.exprName)) {
      return []
    }

    const schemaName = typeArgument.exprName.text
    const schema = cvaSchemas.get(schemaName)
    if (!schema) return []
    return buildVariantFields(schemaName, schema)
  }

  if (referenceName === "Omit") {
    const baseType = typeArguments?.[0]
    const omittedKeysType = typeArguments?.[1]
    if (!baseType) return []
    const baseFields = extractFieldsFromTypeNode(baseType, declarationMap, cvaSchemas, sourceFile, seenTypes)
    const omittedKeys = new Set(extractTypeKeyLiterals(omittedKeysType))
    return baseFields.filter((field) => !omittedKeys.has(field.name))
  }

  if (referenceName === "Pick") {
    const baseType = typeArguments?.[0]
    const pickedKeysType = typeArguments?.[1]
    if (!baseType) return []
    const baseFields = extractFieldsFromTypeNode(baseType, declarationMap, cvaSchemas, sourceFile, seenTypes)
    const pickedKeys = new Set(extractTypeKeyLiterals(pickedKeysType))
    return baseFields.filter((field) => pickedKeys.has(field.name))
  }

  if (referenceName === "Partial" || referenceName === "Readonly") {
    const baseType = typeArguments?.[0]
    if (!baseType) return []
    return extractFieldsFromTypeNode(baseType, declarationMap, cvaSchemas, sourceFile, seenTypes).map((field) => ({
      ...field,
      optional: true
    }))
  }

  return null
}

let engineControlFieldsCache = null

/** Fields of the shared `EngineControlProps` (declared in reveal.tsx, imported by other components). */
function getEngineControlFields() {
  if (engineControlFieldsCache) return engineControlFieldsCache
  engineControlFieldsCache = []
  try {
    const file = join(componentsDir, "reveal.tsx")
    const sf = ts.createSourceFile(file, readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
    for (const statement of sf.statements) {
      if (ts.isTypeAliasDeclaration(statement) && statement.name.text === "EngineControlProps" && ts.isTypeLiteralNode(statement.type)) {
        engineControlFieldsCache = statement.type.members.map((m) => collectProperty(m, sf)).filter((f) => f !== null)
      }
    }
  } catch {
    // reveal.tsx missing: leave empty
  }
  return engineControlFieldsCache
}

function extractFieldsFromTypeNode(typeNode, declarationMap, cvaSchemas, sourceFile, seenTypes) {
  if (ts.isTypeLiteralNode(typeNode)) {
    return typeNode.members
      .map((member) => collectProperty(member, sourceFile))
      .filter((field) => field !== null)
  }

  if (ts.isIntersectionTypeNode(typeNode)) {
    return typeNode.types.flatMap((part) =>
      extractFieldsFromTypeNode(part, declarationMap, cvaSchemas, sourceFile, seenTypes)
    )
  }

  if (ts.isParenthesizedTypeNode(typeNode)) {
    return extractFieldsFromTypeNode(typeNode.type, declarationMap, cvaSchemas, sourceFile, seenTypes)
  }

  if (ts.isTypeReferenceNode(typeNode) && ts.isIdentifier(typeNode.typeName)) {
    const name = typeNode.typeName.text
    const utilityFields = extractFieldsFromReference(
      name,
      typeNode.typeArguments,
      declarationMap,
      cvaSchemas,
      sourceFile,
      seenTypes
    )
    if (utilityFields) {
      return utilityFields
    }

    const declaration = declarationMap.get(name)
    if (!declaration && name === "EngineControlProps") return getEngineControlFields()
    if (!declaration || seenTypes.has(name)) {
      return []
    }

    seenTypes.add(name)
    const fields = extractFieldsFromDeclaration(declaration, declarationMap, cvaSchemas, sourceFile, seenTypes)
    seenTypes.delete(name)
    return fields
  }

  return []
}

function extractFieldsFromInterface(node, declarationMap, cvaSchemas, sourceFile, seenTypes) {
  const ownFields = node.members
    .map((member) => collectProperty(member, sourceFile))
    .filter((field) => field !== null)

  const inheritedFields = []
  for (const clause of node.heritageClauses ?? []) {
    if (clause.token !== ts.SyntaxKind.ExtendsKeyword) continue
    for (const inheritedType of clause.types) {
      if (!ts.isIdentifier(inheritedType.expression)) continue
      const inheritedName = inheritedType.expression.text

      const utilityFields = extractFieldsFromReference(
        inheritedName,
        inheritedType.typeArguments,
        declarationMap,
        cvaSchemas,
        sourceFile,
        seenTypes
      )
      if (utilityFields) {
        inheritedFields.push(...utilityFields)
        continue
      }

      const declaration = declarationMap.get(inheritedName)
      if (!declaration && inheritedName === "EngineControlProps") {
        inheritedFields.push(...getEngineControlFields())
        continue
      }
      if (!declaration || seenTypes.has(inheritedName)) continue
      seenTypes.add(inheritedName)
      inheritedFields.push(...extractFieldsFromDeclaration(declaration, declarationMap, cvaSchemas, sourceFile, seenTypes))
      seenTypes.delete(inheritedName)
    }
  }

  return [...inheritedFields, ...ownFields]
}

function extractFieldsFromDeclaration(node, declarationMap, cvaSchemas, sourceFile, seenTypes) {
  if (ts.isInterfaceDeclaration(node)) {
    return extractFieldsFromInterface(node, declarationMap, cvaSchemas, sourceFile, seenTypes)
  }
  if (ts.isTypeAliasDeclaration(node)) {
    return extractFieldsFromTypeNode(node.type, declarationMap, cvaSchemas, sourceFile, seenTypes)
  }
  return []
}

function collectDefaultsFromBindingPattern(pattern, sourceFile, defaultsMap) {
  for (const element of pattern.elements) {
    if (element.dotDotDotToken) {
      continue
    }

    const localName = getPropertyName(element.name)
    const propName = getPropertyName(element.propertyName) ?? localName
    if (!propName) {
      continue
    }

    if (element.initializer) {
      defaultsMap.set(propName, normalizeInlineText(element.initializer.getText(sourceFile)))
    }
  }
}

function collectDefaultsFromFunctionLike(fnNode, sourceFile, defaultsMap) {
  const firstParam = fnNode.parameters[0]
  if (!firstParam || !ts.isObjectBindingPattern(firstParam.name)) {
    return
  }
  collectDefaultsFromBindingPattern(firstParam.name, sourceFile, defaultsMap)
}

function collectFunctionLikeCandidates(node, collected) {
  if (ts.isArrowFunction(node) || ts.isFunctionExpression(node)) {
    collected.push(node)
    return
  }

  if (ts.isCallExpression(node)) {
    for (const arg of node.arguments) {
      collectFunctionLikeCandidates(arg, collected)
    }
  }
}

function extractDefaultValues(sourceFile) {
  const defaultsMap = new Map()

  for (const statement of sourceFile.statements) {
    if (!isExported(statement)) {
      continue
    }

    if (ts.isFunctionDeclaration(statement)) {
      collectDefaultsFromFunctionLike(statement, sourceFile, defaultsMap)
      continue
    }

    if (!ts.isVariableStatement(statement)) {
      continue
    }

    for (const declaration of statement.declarationList.declarations) {
      if (!declaration.initializer) {
        continue
      }

      const functionLikeCandidates = []
      collectFunctionLikeCandidates(declaration.initializer, functionLikeCandidates)
      for (const functionLike of functionLikeCandidates) {
        collectDefaultsFromFunctionLike(functionLike, sourceFile, defaultsMap)
      }
    }
  }

  return defaultsMap
}

function toComponentIdentity(componentId) {
  return componentId.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()
}

function toTypeIdentity(typeName) {
  return typeName
    .replace(/Props$/i, "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase()
}

function pickPrimaryPropsType(componentId, propTypeNames) {
  if (propTypeNames.length === 0) return null
  const componentIdentity = toComponentIdentity(componentId)

  const scored = propTypeNames
    .map((name) => {
      const identity = toTypeIdentity(name)
      let score = 0
      if (identity === componentIdentity) score = 4
      else if (identity.startsWith(componentIdentity)) score = 3
      else if (componentIdentity.startsWith(identity)) score = 2
      else if (identity.includes(componentIdentity)) score = 1

      return { name, score }
    })
    .sort((a, b) => {
      if (a.score !== b.score) return b.score - a.score
      if (a.name.length !== b.name.length) return a.name.length - b.name.length
      return a.name.localeCompare(b.name)
    })

  return scored[0]?.name ?? propTypeNames[0]
}

function extractMetadataFromFile(source, file) {
  const sourceFile = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  const declarationMap = new Map()
  const defaultsMap = extractDefaultValues(sourceFile)
  const cvaSchemas = extractCvaSchemas(sourceFile)

  for (const statement of sourceFile.statements) {
    if ((ts.isTypeAliasDeclaration(statement) || ts.isInterfaceDeclaration(statement)) && statement.name) {
      declarationMap.set(statement.name.text, statement)
    }
  }

  const propsTypes = []
  for (const statement of sourceFile.statements) {
    if (!isExported(statement)) continue
    if (!("name" in statement) || !statement.name || !("text" in statement.name)) continue

    const typeName = statement.name.text
    if (!typeName.endsWith("Props")) continue
    if (!ts.isTypeAliasDeclaration(statement) && !ts.isInterfaceDeclaration(statement)) continue

    const fields = mergeFields(
      extractFieldsFromDeclaration(statement, declarationMap, cvaSchemas, sourceFile, new Set([typeName]))
    ).map((field) => ({
      ...field,
      defaultValue: defaultsMap.get(field.name) ?? field.defaultValue
    }))
    propsTypes.push({ name: typeName, fields })
  }

  if (propsTypes.length === 0) return null

  propsTypes.sort((a, b) => a.name.localeCompare(b.name))
  const componentId = file.replace(/\.tsx$/, "")
  const primaryPropsType = pickPrimaryPropsType(componentId, propsTypes.map((entry) => entry.name))
  const explicitProps = Array.from(
    new Set(propsTypes.flatMap((propsType) => propsType.fields.map((field) => field.name)))
  ).sort()

  return {
    primaryPropsType,
    propsTypes,
    explicitProps,
    sourceFile: `packages/ui/src/components/${file}`
  }
}

function build() {
  const files = readdirSync(componentsDir)
    .filter((file) => file.endsWith(".tsx"))
    .sort()

  const metadata = {}
  for (const file of files) {
    const source = readFileSync(join(componentsDir, file), "utf8")
    const entry = extractMetadataFromFile(source, file)
    if (!entry) continue

    const componentId = file.replace(/\.tsx$/, "")
    metadata[componentId] = entry
  }

  const existingMetadata = tryParseExistingMetadata()
  const nextMetadataJson = JSON.stringify(metadata, null, 2)
  const existingMetadataJson = existingMetadata ? JSON.stringify(existingMetadata, null, 2) : null

  if (existingMetadataJson === nextMetadataJson) {
    // eslint-disable-next-line no-console
    console.log(`generated ${Object.keys(metadata).length} entries (no changes) -> ${outputFile}`)
    return
  }

  const generatedAt = new Date().toISOString()
  const output = `/* eslint-disable */
// Auto-generated by apps/docs/scripts/generate-api-metadata.mjs
// Do not edit manually.

export type GeneratedApiPropField = {
  name: string
  type: string
  optional: boolean
  description?: string
  defaultValue?: string
}

export type GeneratedApiPropsType = {
  name: string
  fields: readonly GeneratedApiPropField[]
}

export type GeneratedApiComponentEntry = {
  primaryPropsType: string | null
  propsTypes: readonly GeneratedApiPropsType[]
  explicitProps: readonly string[]
  sourceFile: string
}

export const generatedApiMetadata = ${nextMetadataJson} as const satisfies Record<string, GeneratedApiComponentEntry>
export const generatedApiMetadataGeneratedAt = "${generatedAt}" as const
`

  writeFileSync(outputFile, output, "utf8")
  // eslint-disable-next-line no-console
  console.log(`generated ${Object.keys(metadata).length} entries -> ${outputFile}`)
}

build()
