/**
 * Pledge wording for /docs/free-forever. These sentences are the legally reviewed wording from the
 * license audit. Edit them only together with that audit, and keep them in sync with the tests.
 */
export const PLEDGE_SENTENCES: readonly string[] = [
  "The code in this repository is MIT-licensed today.",
  "We intend to keep the open source code in this repository under the MIT License.",
  "Anyone who has received a copy of Glin UI under the MIT License can keep using, modifying and redistributing that copy under those terms. A version that has already been released cannot be revoked.",
  "Components that we adapt from other projects keep their original notices, listed in THIRD_PARTY_NOTICES.md.",
  "Third party dependencies keep their own licenses, which we list for each component.",
  "If we ever offer paid services, they will be separate products. They will not change the license of code already published under MIT."
]

export const TAKEDOWN_CONTACT_URL = "https://github.com/GLINCKER/glinui/issues"

export type FaqEntry = { id: string; question: string; answer: string[] }

export const FAQ: readonly FaqEntry[] = [
  {
    id: "take-back",
    question: "Can the original authors take it back?",
    answer: [
      "Not for code we already took under their MIT License. MIT grants a copy of the software to everyone who receives it, and a released version cannot be revoked. An author can change the license of their own later versions, stop maintaining the project, or delete the repository, and none of that reaches back to the version we adapted.",
      "What an author can ask is that we remove their work from our future releases. We take those requests seriously and handle them as described under removal below."
    ]
  },
  {
    id: "upstream-paid",
    question: "What if an upstream goes paid?",
    answer: [
      "We pin every source to an exact commit and store a copy of its license text in this repository. If the upstream later changes its license or moves to a paid model, our copy stays under the license it had when we took it, and the original link on the component page shows the changed status.",
      "We do not merge later upstream changes unless the license at that newer commit has been re-verified first. A weekly automated check compares each upstream license to our snapshot and opens an issue when anything differs."
    ]
  },
  {
    id: "removal",
    question: "How do I request removal?",
    answer: [
      `Open an issue at ${TAKEDOWN_CONTACT_URL} with the component name, what you want changed and, if you are the author, a way for us to confirm that. We have no dedicated mailbox yet, so the issue tracker is the contact point.`,
      "Takedown policy: we acknowledge a request within seven days. If you are the rights holder and the request is valid, we remove or rewrite the component in the next release and update the attribution page. Where the work was released under MIT and we followed its terms, we may keep it, but we will always correct missing or wrong credit right away."
    ]
  },
  {
    id: "assets",
    question: "What is your asset policy?",
    answer: [
      "We adapt code only. Upstream demo images, videos, fonts, 3D models, textures and brand logos are not copied. Our demos use our own or generated assets, and we do not use upstream names or logos as our own."
    ]
  }
]

export const PINNING_POINTS: readonly string[] = [
  "Each source is pinned to one commit SHA, recorded in the registry and in the header of every adapted file.",
  "The upstream LICENSE text at that commit is stored in the repository with a sha256 hash that tests verify.",
  "Before merging any change from an upstream, we re-read its license at the new commit and update the snapshot only if the terms are still permissive.",
  "A scheduled check runs weekly against each upstream repository and reports license changes, renames, archiving or deletion."
]
