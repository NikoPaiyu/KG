export interface CommitteData {
  id: string;
  addedMembersIds: addedMembersIds[];
  assemblyId: number;
  assemblyValue: number;
  categoryId: number;
  categoryName: string;
  committeeDto: committeeDto[];
  fileId: string;
  fileNumber: string;
  name: string;
  nomineeDto: nomineeDto[];
  status: string;
  memberFileStatus : string;
}
export interface addedMembersIds {}
export interface committeeDto {
  assemblyId: number;
  assemblyValue: number;
  categoryId: number;
  categoryName: string;
  contacts: contacts[];
  id: number;
  memberDtoResponse: memberDtoResponse;
  memberDtos : MEMBER[];
  name: string;
  status: string;
  subjectId: number;
  subjectName: string;
}
export interface memberDtoResponse{
  MEMBER : MEMBER[];
  CHAIRMAN : MEMBER[];
  EX_OFFICIO : MEMBER[];
}
export interface nomineeDto {
  assemblyId: number;
  assemblyValue: number;
  categoryId: number;
  categoryName: string;
  contacts: contacts[];
  id: number;
  memberDtoResponse: memberDtoResponse;
  name: string;
  status: string;
  subjectId: number;
  subjectName: string;
}
export interface contacts {}
export interface MEMBER {
    delete:boolean;
    id:number;
    memberId:number;
    memberName:string;
    roleId:number;
    // roleName:string;
    member:{
        details:{
          memberGroup:string;
          portfolioName:string;
        }
      }
    ;
    partySide :string;
    portfolioName:string
}
export interface AttachmentConfig {
  name: string;
  attachmentUrl: string;
  type: string;
  delete:boolean;
}
