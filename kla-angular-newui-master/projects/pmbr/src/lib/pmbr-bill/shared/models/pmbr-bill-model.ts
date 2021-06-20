export interface billMetaData {
    id: number,
    articalNo: string,
    departmentId: number,
    governerRecommendation: boolean,
    governerRecommendationUrl: string,
    language: string,
    ministerId: number,
    natureOfBill: string,
    oldOrdinance: boolean,
    oldReferenceAct: any,
    ordinance: boolean,
    ordinanceNumber: string,
    referenceAct: any,
    statementOnRule: string,
    subjectId: number,
    title: string,
    type: string
}

export interface billTypes {
    id: number,
    code: string,
    createdDate: any,
    name: string,
    updatedDate: any,
}

export const languages = [
    {
        label: "MALAYALAM",
        value: "MAL",
    },
    {
        label: "ENGLISH",
        value: "ENG",
    },
];
export const priorities = [
    {
        label: "P1",
        value: "P1",
    },
    {
        label: "P2",
        value: "P2",
    },
    {
        label: "P3",
        value: "P3",
    },
]
export interface InoticeDetails {
    billId: any,
    noticeId: any,
    noticeType: string,
    billStatus: any
}