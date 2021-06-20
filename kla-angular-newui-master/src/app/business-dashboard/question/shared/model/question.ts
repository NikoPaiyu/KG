import { member } from "./member";
export class MemberPerformanceReportDto {
  qDate: Date;

  starredNoticeCount: number;

  unstarredNoticeCount: number;

  disallowedNoticeCount: number;
  tdTo: number;

  tdFrom: number;

  withdrawnNoticeCount: number;

  totalNoticeCount: number;

  starredQuestionCount: number;

  unstarredQuestionCount: number;

  disallowedQuestionCount: number;

  withdrawnQuestionCount: number;

  totalQuestions: number;
}

export class MlaNoticeReportDto {
  MemberForm: member;
  noticeDetail: NoticeDetailDtos[];
  total: number;
}
export class NoticeDetailDtos {
  QuestionCategory: string;
  noticeNumber: string;
}
export class ClubbedMemberDetailDto {
  createdAt: Date;
  updatedAt: Date;
  id: number;
  member: Member;
  noticeNumber: string;
  status: string;
  firstMemberFlag: number;
}

export class QuestionClauseDto {
  id: number;
  ministerSubSubject: MinisterSubsubjectDto;
  clause: string;
  answer: AnswerDto[];
}
export class mlaDetails {
  id: number;
  profilePhoto: string;
  keralaConstituencyName: string;
  keralaConstituencyId: number;
  keralaPolicticalPartyid: number;
  fullName: string;
  malayalamFullName: string;
  slNo: number = 0;
}
export class AnswerDto {
  id: number;
  answer: string;
  status: string;
}
export class Minister {
  id: number;
  name: string;
}
export class MinisterSubject {
  id: number;
  name: string;
}
export class MinisterSubsubjectDto {
  id: number;
  name: string;
}
export class Member {
  id: number;
  name: string;
}

export class NoteDto {
  createdAt: Date;
  updatedAt: Date;
  id: number;
  comment: any;
  userId: any;
  versionId: any;
  questionId: any;
}

export class Question {
  createdAt: Date;
  updatedAt: Date;
  id: number;
  assemblyId: number;
  sessionId: number;
  workflowId: string;
  questionDetails: QuestionDetailDto[];
  clubbedMemberDetails: ClubbedMemberDetailDto[];
  notes: NoteDto[];
  questionStatus: string;
  tdStatus: number;
  tmStatus: number;
}
export class memberIdToDetail {
  id: number;
}
export class QuestionDetailDto {
  id: number;
  questionDate: string;
  category: string;
  priority: string;
  type: string;
  title: string;
  minister: Minister;
  ministerSubject: MinisterSubject;
  submittedStatus: number;
  version: string;
  questionClauses: QuestionClauseDto[];
}

export class QuestionList {
  createdAt: Date;
  updatedAt: Date;
  id: number;
  assemblyId: number;
  sessionId: number;
  workflowId: string;
  questionDate: Date;
  clubbedMemberDetails: ClubbedMemberDetailDto[];
  notes: NoteDto[];
  status: string;
  tdStatus: number;
  tmStatus: number;
  category: string;
  priority: string;
  type: string;
  title: string;
  minister: string;
  ministerSubject: string;
  questionClauses: QuestionClauseDto[];
  submittedStatus: string;
  version: string;
  statusClr: string;
  questionId: string;
  memberId: string
}

export interface ViewButtons{
  Delete: boolean,
  Withdraw: boolean,      
  ForwardTo: boolean,
  BackwardTo: boolean,
  Approve:boolean,
  Revoke: boolean,
  Disallow: boolean,
  Edit: boolean,
  Back: boolean,
  ChangeReply:boolean
}