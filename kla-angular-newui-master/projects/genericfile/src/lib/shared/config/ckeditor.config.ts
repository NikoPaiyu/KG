export const CKEConfig: any = {
  toolbar: [
    "bold",
    "italic",
    "underline",
    "bulletedList",
    "numberedList",
    "alignment",
    "heading",
    "|",
    "link",
    "blockQuote",
    "insertTable",
    // "imageUpload",
  ],
  // image: {
  //   toolbar: [
  //     "imageStyle:full",
  //     "imageStyle:side",
  //     "|",
  //     "imageTextAlternative",
  //   ],
  // },
  table: {
    contentToolbar: [
      "tableColumn",
      "tableRow",
      "mergeTableCells",
      "tableProperties",
      "tableCellProperties",
    ],
  },
  heading: {
    options: [
      {
        model: "paragraph",
        title: "Paragraph",
        class: "ck-heading_paragraph",
      },
      {
        model: "heading1",
        view: "h1",
        title: "Heading 1",
        class: "ck-heading_heading1",
      },
      {
        model: "heading2",
        view: "h2",
        title: "Heading 2",
        class: "ck-heading_heading2",
      },
    ],
  },
  title: {
    isEnabled: false,
  },

  uiColor: "#66AB16",
};
