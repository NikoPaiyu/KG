export interface IDiaryResponse {
    assemblyValue: any,
    sessionValue: any,
    date: Date,
    id: any,
    lobLines: ILobLinesResponse[],
    status: string,
    description: string,
    isEdit: boolean,
    userId: any,
    currentAssignee: boolean,
    wfStatus: string,
    workflowId: any
}
export interface ILobLinesResponse {
    businessId: any,
    businessLines: IBusinessLineResponse[],
    businessName: string,
    businessNameMalayalam: string,
    active: boolean,
    disable: boolean
}
export interface IBusinessLineResponse {
    allotedTime: any,
    id: any,
    description: string,
    businessId: any,
    businessName: string,
    businessNameMalayalam: string,
    primaryMemberMalayalamFullName: string,
    primaryMemberName: string,
    secondaryMemberMalayalamFullName: string,
    secondaryMemberName: string,
    speakerNoteUrl: string,
    title: string,
    proceedingReporterLines: reportDiaryResponse[]
}
export interface reportDiaryResponse {
    id: any,
    description: any,
    startTime: Date,
    endTime: Date,
    lobAgendaBusinessLineId: any,
    type: string,
    time: string,
    isEdit: boolean,
    userName: string
}

export const buttonList = [
    { title: "Diary Note", code: "DIARY_NOTE", id: 5, color: "magenta" },
    { title: "Point of Order", code: "POINT_OF_ORDER", id: 11, color: "cyan" },
    { title: "Personal Explanation", code: "EXPLANATION", id: 12, color: "geekblue" },
    { title: "Intervention", code: "INTERVENTION", id: 13, color: "purple" }
];

export interface saveDiaryDto {
    id: any;
    description: string;
    type: string;
    startTime: Date;
    endTime: Date;
    proceedingReporterMasterId: any;
    lobAgendaBusinessLineId: any;
}

export interface saveProceedingDiaryDto {
    id: any;
    description: string;
}

export interface reportDiaryResponseDto {
    id: any;
    assemblyId: number;
    assemblyValue: string;
    sessionId: number;
    sessionValue: string;
    date: any;
    status: string;
    userId: any;
    tabType: string;
}
export interface IWorkFlowUsers {
    actionCol: any,
    actionGroup: any,
    actionId: any,
    actionName: any,
    actionRow: any,
    catagory: any,
    code: any,
    firstName: string,
    fullName: string,
    klaSectionId: any,
    klaSectionName: string,
    name: string,
    userId: any
}
export interface forwardProceedingDiaryDto {
    proceedigDiaryMasterId: any,
    groupId: string,
    fromGroup: string,
    assignee: any
}
export interface IForwardusers {
    actionCol: any,
    actionGroup: string,
    actionId: any,
    actionName: string,
    actionRow: any,
    catagory: any,
    code: any,
    firstName: string,
    fullName: string,
    klaSectionId: any,
    klaSectionName: string,
    name: string,
    userId: any,
}

export class IPermissionProceedings {
    allowForactionTab: boolean = false;
    allowMyListTab: boolean = false;
    allowForwardOption: boolean = false;
    allowApproveOption: boolean = false;
    allowDownloadOption: boolean = false;
    allowCreateOption: boolean = false;
    allowPublishOption: boolean = false;
}