export const createBillModel = {
  marginalHeading: [
    { title: "Clause", code: "CLAUSE", id: 3, color: "volcano" },
    { title: "Sub Clause", code: "SUB_CLAUSE", id: 4, color: "blue" },
    { title: "Section", code: "SECTION", id: 8, color: "green" },
    { title: "Details", code: "DETAILS", id: 9, color: "orange" },
  ],
  section: [
    { title: "Section", code: "SECTION", id: 8, color: "green" },
    { title: "Sub Section", code: "SUB_SECTION", id: 10, color: "gold" },
    { title: "Details", code: "DETAILS", id: 9, color: "orange" },
  ],
  subSection: [
    { title: "Section", code: "SECTION", id: 8, color: "green" },
    { title: "Sub Section", code: "SUB_SECTION", id: 10, color: "gold" },
    { title: "Details", code: "DETAILS", id: 9, color: "orange" },
    { title: "Proviso", code: "PROVISO", id: 11, color: "cyan" },
    { title: "Explanation", code: "EXPLANATION", id: 12, color: "geekblue" },
    { title: "Note", code: "NOTE", id: 13, color: "purple" },
  ],
  clause: [
    { title: "Clause", code: "CLAUSE", id: 3, color: "volcano" },
    { title: "Sub Clause", code: "SUB_CLAUSE", id: 4, color: "blue" },
    { title: "Table", code: "TABLE", id: 27, color: "red" },
    { title: "Schedule", code: "SCHEDULE", id: 28, color: "cyan" },
    { title: "Section", code: "SECTION", id: 8, color: "green" },
    { title: "Item", code: "ITEM", id: 5, color: "magenta" },
    { title: "Details", code: "DETAILS", id: 9, color: "orange" },
  ],
  subClause: [
    { title: "Clause", code: "CLAUSE", id: 3, color: "volcano" },
    { title: "Sub Clause", code: "SUB_CLAUSE", id: 4, color: "blue" },
    { title: "Table", code: "TABLE", id: 27, color: "red" },
    { title: "Schedule", code: "SCHEDULE", id: 28, color: "cyan" },
    { title: "Details", code: "DETAILS", id: 9, color: "orange" },
    { title: "Proviso", code: "PROVISO", id: 11, color: "cyan" },
    { title: "Explanation", code: "EXPLANATION", id: 12, color: "geekblue" },
    { title: "Note", code: "NOTE", id: 13, color: "purple" },
  ],
  item: [
    { title: "Details", code: "DETAILS", id: 9, color: "orange" },
    { title: "Sub Item", code: "SUB_ITEM", id: 6, color: "green" },
  ],
  subItem: [
    { title: "Item", code: "ITEM", id: 5, color: "magenta" },
    { title: "Sub Item", code: "SUB_ITEM", id: 6, color: "green" },
    { title: "Details", code: "DETAILS", id: 9, color: "orange" },
    { title: "Proviso", code: "PROVISO", id: 11, color: "cyan" },
    { title: "Explanation", code: "EXPLANATION", id: 12, color: "geekblue" },
    { title: "Note", code: "NOTE", id: 13, color: "purple" },
  ],
  proviso: [
    { title: "Details", code: "DETAILS", id: 9, color: "orange" },
    { title: "Proviso", code: "PROVISO", id: 11, color: "cyan" },
    { title: "Explanation", code: "EXPLANATION", id: 12, color: "geekblue" },
    { title: "Note", code: "NOTE", id: 13, color: "purple" },
  ],
  explanation: [
    { title: "Details", code: "DETAILS", id: 9, color: "orange" },
    { title: "Proviso", code: "PROVISO", id: 11, color: "cyan" },
    { title: "Explanation", code: "EXPLANATION", id: 12, color: "geekblue" },
    { title: "Note", code: "NOTE", id: 13, color: "purple" },
  ],
  note: [
    { title: "Details", code: "DETAILS", id: 9, color: "orange" },
    { title: "Proviso", code: "PROVISO", id: 11, color: "cyan" },
    { title: "Explanation", code: "EXPLANATION", id: 12, color: "geekblue" },
    { title: "Note", code: "NOTE", id: 13, color: "purple" },
  ],
  extract: [
    { title: "Sub Extract", code: "SUB_EXTRACT", id: 26, color: 'geekblue' }
  ],
  addButtonsNotRequiredBlocks: [
    "TITLE",
    "LONG_TITLE",
    "BEIT",
    "ENACTING_FORMULA",
    "STATEMENT_OF_OBJECTS_AND_REASONS",
    "FINANCIAL_MEMORANDUM",
    "MEMORANDUM_REGARDING_DELEGATED_LEGISLATION"
  ],
  removeButtonsNotRequiredBlocks: [
    "TITLE",
    "LONG_TITLE",
    "PREAMBLE",
    "BEIT",
    "ENACTING_FORMULA",
    "MARGINAL_HEADING",
    "STATEMENT_OF_OBJECTS_AND_REASONS",
    "FINANCIAL_MEMORANDUM",
    "MEMORANDUM_REGARDING_DELEGATED_LEGISLATION"
  ],
  contentOptionalBlock: [
    "LONG_TITLE",
    "PREAMBLE",
    "BEIT",
    "ENACTING_FORMULA",
    "STATEMENT_OF_OBJECTS_AND_REASONS",
    "FINANCIAL_MEMORANDUM",
    "MEMORANDUM_REGARDING_DELEGATED_LEGISLATION"
  ],
  headerRequiredBlock: [
    "STATEMENT_OF_OBJECTS_AND_REASONS",
    "FINANCIAL_MEMORANDUM",
    "MEMORANDUM_REGARDING_DELEGATED_LEGISLATION",
    "EXTRACT"
  ],
  typeNameNotRequiredBlock: [
    "STATEMENT_OF_OBJECTS_AND_REASONS",
    "FINANCIAL_MEMORANDUM",
    "MEMORANDUM_REGARDING_DELEGATED_LEGISLATION",
    "SUB_EXTRACT"
  ],
  textAreaDisabledBlock: [
    "EXTRACT",
    "SUB_EXTRACT"
  ],
  languageList: [
    { code: "MAL", language: "Malayalam" },
    { code: "ENG", language: "English" },
  ],
  tableRequiredBlock: [
    "TABLE",
    "SCHEDULE"
  ]
};
