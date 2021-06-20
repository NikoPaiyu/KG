import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import * as _ from "lodash";
@Injectable({
  providedIn: "root",
})
export class NoticeProcessService {
  constructor(private http: HttpClient) { }

  // submit notice notice processing
  submitNotice(body) {
    const url = environment.notice_processing_api + "submit";
    return this.http.post<any>(url, body);
  }
  // get all pending notice
  getAllPendingNotice() {
    const url = environment.notice_processing_api + "getAll/pending";
    return this.http.get<any>(url);
  }
  // get notice by workflow id
  getNoticeByWorkflowId() {
    const url = environment.notice_processing_api + "getByWorkflow";
    return this.http.get<any>(url);
  }
  // admit notice
  admitNotice(body) {
    const url = environment.notice_processing_api + "approve/admit";
    return this.http.post<any>(url, body);
  }
  // forward notice
  forwardNotice(body, role, userId) {
    const url =
      environment.notice_processing_api +
      `approve/forward?group=${role}&userId=${userId}`;
    return this.http.put<any>(url, body);
  }
  // withdraw notice
  withdrawNotice(noticeId) {
    const url =
      environment.notice_processing_api + `witdraw?noticeId=${noticeId}`;
    return this.http.put<any>(url, {});
  }
  // disallow
  disallowNotice(body, noticeId) {
    console.log(body);
    const url =
      environment.notice_processing_api + `disAllow?noticeId=${noticeId}`;
    return this.http.put<any>(url, body);
  }
  // revoke
  revokeNotice(body) {
    const url =
      environment.notice_processing_api + 'revoke';
    return this.http.put<any>(url, body);
  }
  // check workflow status
  checkWorkFlowStatus(workFlowId) {
    const url =
      environment.workflow_api +
      `/task/tracking?processInstanceId=${workFlowId}`;
    return this.http.get<any>(url);
  }
  // get workflow role
  getWorkFlowRole(noticeId, userId) {
    const url =
      environment.notice_processing_api +
      `workflowRole/get?noticeId=${noticeId}&userId=${userId}`;
    return this.http.get<any>(url);
  }
  // get notice consentslist
  getNoticeConsentsList(userId) {
    const url =
      environment.notice_processing_api +
      `getConsentListForUser?userId=${userId}`;
    return this.http.get<any>(url);
  }
  // notice give consents
  giveConsent(body) {
    const url = environment.notice_processing_api + `giveConsent`;
    return this.http.put(url, body);
  }
  // get notices which are in bac queue
  getPendingBacNotices() {
    const url = environment.notice_processing_api + `bac/pending`;
    return this.http.get<any>(url);
  }
  // set lob date
  setLobDate(body) {
    const url = environment.notice_processing_api + 'bac/addToLob';
    return this.http.post<any>(url, body);
  }
  addConsentMember(body) {
    const url = environment.notice_processing_api + 'addConsentMember';
    return this.http.post<any>(url, body);
  }

  approveNotice(templatId, noticeId = null) {
    let url = environment.notice_processing_api + `perApproveCondtion?templateId=${templatId}`;
    if (noticeId) {
      url += `&noticeId=${noticeId}`;
    }
    return this.http.get<any>(url);
  }

  saveTag(noticeId, body) {
    const url = environment.notice_processing_api + `tags?noticeId=${noticeId}`;
    return this.http.put<any>(url, body);
  }

  checkQuesstionDuplication(parameters: any) {
    return this.http.post(
      `${environment.question_api_url}/question/tags/duplication?assemblyId=${parameters.assemblyId}&sessionId=${parameters.sessionId}`, parameters.tags
    );
  }

  //Duplicate Check
  getHeadingDuplicates(keywords: any[]) {
    let body = {
      "keywords": keywords,
      "searchCategory": "HEADING"
    }
    return this.http.post(`${environment.question_api_url}question/duplicate`, body).map(res => {
      return { keywords: _.clone(keywords), matches: res ? res : [] }
    });;
  }

  getClauseDuplicates(keywords: any[]) {
    let body = {
      "keywords": keywords,
      "searchCategory": "CLAUSE"
    }
    return this.http.post(`${environment.question_api_url}question/duplicate`, body).map(res => {
      return { keywords: keywords, matches: res ? res : [] }
    });
  }

  getSubsubjectDuplicates(keywords: any[], subIds: any[]) {
    let body = {
      "keywords": keywords,
      "searchCategory": "SUB_SUBJECT",
      "subSubjectIds": subIds
    }
    return this.http.post(`${environment.question_api_url}question/duplicate`, body).map(res => {
      return { keywords: keywords, matches: res ? res : [] }
    });;
  }

  getTagDuplicates(keywords: any[]) {
    let body = {
      "keywords": keywords,
      "searchCategory": "TAG"
    }
    return this.http.post(`${environment.question_api_url}question/duplicate`, body).map(res => {
      return { keywords: keywords, matches: res ? res : [] }
    });;
  }

  getPreViewquestionWithAnswer(questionId: number) {
    return this.http.get(
      `${environment.question_api_url}question/preview/questionWithAnswer/${questionId}`
    );
  }
  // get copy of notices in table section
  getNoticeTableSectionCopy() {
    const url = environment.notice_processing_api + 'copyToTable';
    return this.http.get(url);
  }
  // get copy of notices in minister login
  getNoticeMinisterCopy() {
    const url = environment.notice_processing_api + 'getAllByRespondent';
    return this.http.get(url);
  }
}
