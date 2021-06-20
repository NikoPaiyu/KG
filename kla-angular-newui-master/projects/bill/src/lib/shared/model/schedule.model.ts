export interface CategoryData {
    description: "",
    descriptionMal: "",
    id: null,
    priorityList :priorityListData[]
}
export interface priorityListData {
    billId: null,
    billTitle: "",
    id: null,
    disableDatePicker : boolean,
    scheduleDtoForm : scheduleDtoFormData
}
export interface scheduleDtoFormData {
    billId: null,
    billIntroduction: null,
    calusebyClause: null,
    generalAmendmentI: null,
    generalAmendmentII: null,
    ordinanceDisapprovalMotion: null,
    referToCommittee: null,
    secondReading: null,
}