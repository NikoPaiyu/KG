export interface IAssemblySessionResponseDto {
    assembly: IAssembly[];
    session: ISession[];
    assemblySession: IAssemblySession[];
    activeAssemblySession: any;
}

export interface IAssemblySession {
    id: any;
    assemblyId: any;
    session: ISession[]
}
export interface IAssembly {
    id: any;
    assemblyId: any;
    startDate: string;
    endDate: string;
    status: string;
}

export interface ISession {
    id: any;
    sessionId: any
}
export interface IDocumentTypeResponseDto {
    id: any;
    code: string;
    createdDate: Date;
    name: string;
    updatedDate: Date
}

export interface IDocumentSubTypeResponseDto {
    id: any;
    code: string;
    createdDate: Date;
    name: string;
    updatedDate: Date
}

export interface IKlaSectionResponseDto {
    klaSectionId: any;
    klaSectionName: string;
    code: string;
}

export interface IDepartmentResponseDto {
    createdAt: any,
    updatedAt: any,
    createdBy: any,
    id: any,
    departmentName: string,
    departmentNameMalayalam: string,
    code: string
}

export interface IAccessLevelResponseDto {
    id: any;
    code: string;
    createdDate: Date;
    name: string;
    updatedDate: Date
}
