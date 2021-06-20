export const RBS = {
  MLA: {
    userName: null,
    roles: ["mla"],
    modules: {
      QUESTION_PROCESSING: {
        categories: {
          QUESTION: ["CREATE", "READ", "UPDATE", "DELETE"],
          CLUBBING: ["CREATE", "READ", "UPDATE", "DELETE"],
          STARRED: ["WITHDRAW"],
          UNSTARRED: ["WITHDRAW"],
          QCREATE_CLUBMLA: ["CREATE"],
          ADD_REASON: ["CREATE", "READ", "UPDATE", "DELETE"],
          CREATE_QUESTION: ["CREATE"],
        },
      },
    },
  },
  PPO: {
    userName: null,
    roles: ["parliamentaryPartySecretary"],
    modules: {
      QUESTION_PROCESSING: {
        categories: {
          QUESTION: ["CREATE", "READ", "UPDATE", "DELETE"],
          CLUBBING: ["CREATE", "READ", "UPDATE", "DELETE"],
          ADD_MLA: ["CREATE", "UPDATE"],
          PARTY: ["CREATE", "UPDATE"],
          CREATE_QUESTION: ["CREATE"],
        },
      },
    },
  },
  OA: {
    roles: ["OA"],
    modules: {
      QUESTION_PROCESSING: {
        categories: {
          QUESTION: ["CREATE", "READ", "UPDATE", "DELETE"],
          QUESTION_HEADING: ["UPDATE"],
          ADD_MLA: ["CREATE", "UPDATE"],
          PARTY: ["CREATE", "UPDATE"],
          STARRED: [
            "FORWARD",
            "BACKWARD",
            "CHECK_DUPLICATE",
            "WITHDRAW_FORWARD",
            "CORRECTION_FORWARD",
            "DRAFT"
          ],
          UNSTARRED: [
            "FORWARD",
            "BACKWARD",
            "CHECK_DUPLICATE",
            "WITHDRAW_FORWARD",
            "CORRECTION_FORWARD",
            "DRAFT"
          ],
          CLAUSE: ["CREATE", "READ", "UPDATE", "DELETE"],
          QUESTION_TAG: ["CREATE", "READ", "UPDATE", "DELETE"],
          NOTES: ["CREATE", "READ", "UPDATE", "DELETE"],
          VERSION: ["READ"],
          ANSWER_VERSION: ["READ"],
          CREATE_QUESTION: ["CREATE"],
        },
      },
    },
  },
  SO: {
    userName: null,
    roles: ["SO"],
    modules: {
      QUESTION_PROCESSING: {
        categories: {
          QUESTION: ["READ"],
          QUESTION_HEADING: ["UPDATE"],
          STARRED: [
            "FORWARD",
            "BACKWARD",
            "CHECK_DUPLICATE",
            "WITHDRAW_FORWARD",
            "CORRECTION_FORWARD",
            "DRAFT"
          ],
          UNSTARRED: [
            "FORWARD",
            "BACKWARD",
            "CHECK_DUPLICATE",
            "WITHDRAW_FORWARD",
            "CORRECTION_FORWARD",
            "DRAFT"
          ],
          CLAUSE: ["CREATE", "READ", "UPDATE", "DELETE"],
          QUESTION_TAG: ["CREATE", "READ", "UPDATE", "DELETE"],
          NOTES: ["CREATE", "READ", "UPDATE", "DELETE"],
          VERSION: ["READ"],
          ANSWER_VERSION: ["READ"],
        },
      },
    },
  },
  US: {
    userName: null,
    roles: ["US"],
    modules: {
      QUESTION_PROCESSING: {
        categories: {
          QUESTION: ["READ"],
          QUESTION_HEADING: ["UPDATE"],
          STARRED: [
            "FORWARD",
            "BACKWARD",
            "CHECK_DUPLICATE",
            "WITHDRAW_FORWARD",
            "CORRECTION_FORWARD",
            "DRAFT"
          ],
          UNSTARRED: [
            "FORWARD",
            "BACKWARD",
            "CHECK_DUPLICATE",
            "WITHDRAW_FORWARD",
            "CORRECTION_FORWARD",
            "DRAFT"
          ],
          CLAUSE: ["CREATE", "READ", "UPDATE", "DELETE"],
          QUESTION_TAG: ["CREATE", "READ", "UPDATE", "DELETE"],
          NOTES: ["CREATE", "READ", "UPDATE", "DELETE"],
          TRANSFER_DATE: ["CREATE", "UPDATE"],
          VERSION: ["READ"],
          ANSWER_VERSION: ["READ"],
          CANCEL_BALLOT: ["READ"],
          ADD_TO_LOB: ["READ"]
        },
      },
    },
  },
  DS: {
    userName: null,
    roles: ["DS"],
    modules: {
      QUESTION_PROCESSING: {
        categories: {
          QUESTION: ["READ"],
          QUESTION_HEADING: ["UPDATE"],
          STARRED: [
            "FORWARD",
            "BACKWARD",
            "CHECK_DUPLICATE",
            "WITHDRAW_FORWARD",
            "CORRECTION_FORWARD",
            "DRAFT"
          ],
          UNSTARRED: [
            "FORWARD",
            "BACKWARD",
            "APPROVE",
            "CHECK_DUPLICATE",
            "WITHDRAW_FORWARD",
            "CORRECTION_FORWARD",
            "DRAFT"
          ],
          SUB_SUBJECT: ["CREATE", "READ", "UPDATE", "DELETE"],
          QUESTION_TAG: ["CREATE", "READ", "UPDATE", "DELETE"],
          CLAUSE: ["CREATE", "READ", "UPDATE", "DELETE"],
          CLAUSE_TAG: ["CREATE", "READ", "UPDATE", "DELETE"],
          NOTES: ["CREATE", "READ", "UPDATE", "DELETE"],
          TRANSFER_DATE: ["CREATE", "UPDATE"],
          VERSION: ["READ"],
          ANSWER_VERSION: ["READ"],
          CANCEL_BALLOT: ["READ"],
          ADD_TO_LOB: ["READ"]
        },
      },
    },
  },
  JS: {
    userName: null,
    roles: ["JS", "AS", "SS"],
    modules: {
      QUESTION_PROCESSING: {
        categories: {
          QUESTION: ["READ"],
          QUESTION_HEADING: ["UPDATE"],
          CLUBBING: ["READ", "UPDATE"],
          STARRED: [
            "FORWARD",
            "BACKWARD",
            "CHANGEREPLY",
            "CHECK_DUPLICATE",
            "WITHDRAW_FORWARD",
            "CORRECTION_FORWARD",
            "WITHDRAW_APPROVE",
            "DRAFT"
          ],
          UNSTARRED: [
            "FORWARD",
            "BACKWARD",
            "APPROVE",
            "CHANGEREPLY",
            "CHECK_DUPLICATE",
            "WITHDRAW_FORWARD",
            "CORRECTION_FORWARD",
            "WITHDRAW_APPROVE",
            "DRAFT"
          ],
          SUB_SUBJECT: ["CREATE", "READ", "UPDATE", "DELETE"],
          QUESTION_TAG: ["CREATE", "READ", "UPDATE", "DELETE"],
          CLAUSE: ["CREATE", "READ", "UPDATE", "DELETE"],
          CLAUSE_TAG: ["CREATE", "READ", "UPDATE", "DELETE"],
          NOTES: ["CREATE", "READ", "UPDATE", "DELETE"],
          TRANSFER_DATE: ["CREATE", "UPDATE"],
          VERSION: ["READ"],
          ANSWER_VERSION: ["READ"],
          CANCEL_BALLOT: ["READ"],
          ADD_TO_LOB: ["READ"]
        },
      },
    },
  },
  Secretary: {
    userName: null,
    role: ["Secretary"],
    modules: {
      QUESTION_PROCESSING: {
        categories: {
          QUESTION: ["READ"],
          CLUBBING: ["READ", "UPDATE"],
          QUESTION_HEADING: ["UPDATE"],
          QUESTION_CATEGORY: ["UPDATE"],
          STARRED: [
            "FORWARD",
            "BACKWARD",
            "APPROVE",
            "DISALLOW",
            "CHECK_DUPLICATE",
            "WITHDRAW_FORWARD",
            "CORRECTION_FORWARD",
            "WITHDRAW_APPROVE",
            "DRAFT"
          ],
          UNSTARRED: [
            "FORWARD",
            "BACKWARD",
            "APPROVE",
            "DISALLOW",
            "CHECK_DUPLICATE",
            "WITHDRAW_FORWARD",
            "CORRECTION_FORWARD",
            "WITHDRAW_APPROVE",
            "DRAFT"
          ],
          SUB_SUBJECT: ["CREATE", "READ", "UPDATE", "DELETE"],
          QUESTION_TAG: ["CREATE", "UPDATE"],
          CLAUSE: ["CREATE", "READ", "UPDATE", "DELETE"],
          "CLAUSE-TAG": ["CREATE", "READ", "UPDATE", "DELETE"],
          NOTES: ["CREATE", "READ", "UPDATE", "DELETE"],
          QUESTION_PRIORITY: ["CREATE", "READ", "UPDATE", "DELETE"],
          RULE: ["READ"],
          TRANSFER_DATE: ["CREATE", "UPDATE"],
          VERSION: ["READ"],
          ANSWER_VERSION: ["READ"],
          CANCEL_BALLOT: ["READ"],
          APPROVE_BALLOT: ["READ"],
        },
      },
    },
  },
  Speaker: {
    userName: null,
    role: ["Speaker"],
    modules: {
      QUESTION_PROCESSING: {
        categories: {
          QUESTION: ["READ"],
          CLUBBING: ["READ", "UPDATE"],
          QUESTION_HEADING: ["UPDATE"],
          QUESTION_CATEGORY: ["UPDATE"],
          STARRED: [
            "FORWARD",
            "BACKWARD",
            "APPROVE",
            "SHORT_NOTICE",
            "DISALLOW",
            "CHECK_DUPLICATE",
            "WITHDRAW_FORWARD",
            "WITHDRAW_APPROVE",
            "CORRECTION_FORWARD",
            "CORRECTION_APPROVE",
            "DRAFT"
          ],
          UNSTARRED: [
            "FORWARD",
            "BACKWARD",
            "APPROVE",
            "SHORT_NOTICE",
            "DISALLOW",
            "CHECK_DUPLICATE",
            "WITHDRAW_FORWARD",
            "WITHDRAW_APPROVE",
            "CORRECTION_FORWARD",
            "CORRECTION_APPROVE",
            "DRAFT"
          ],
          SUB_SUBJECT: ["CREATE", "READ", "UPDATE", "DELETE"],
          QUESTION_TAG: ["CREATE", "UPDATE"],
          CLAUSE: ["CREATE", "READ", "UPDATE", "DELETE"],
          "CLAUSE-TAG": ["CREATE", "READ", "UPDATE", "DELETE"],
          NOTES: ["CREATE", "READ", "UPDATE", "DELETE"],
          VERSION: ["READ"],
          QUESTION_PRIORITY: ["CREATE", "READ", "UPDATE", "DELETE"],
          RULE: ["READ"],
          TRANSFER_DATE: ["CREATE", "UPDATE"],
          ANSWER_VERSION: ["READ"],
          CANCEL_BALLOT: ["READ"],
        },
      },
    },
  },
};
