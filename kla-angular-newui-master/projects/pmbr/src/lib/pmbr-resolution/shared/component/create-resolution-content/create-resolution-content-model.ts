export const createResolutionModel = {
    languageList: [
        { code: "MAL", language: "Malayalam" },
        { code: "ENG", language: "English" },
    ],

};

export const types = [
    { title: "Paragraph", code: "TEXT", id: 30, color: "purple" },
]

export class resolutionDetails {
    billId: any;
    content: any;
    id: any;
    index: any;
    parentId: any;
    typeId: any
}