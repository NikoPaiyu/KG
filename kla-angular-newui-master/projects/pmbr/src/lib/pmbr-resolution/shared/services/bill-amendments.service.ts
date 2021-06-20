import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConfig } from '../../../shared/config/api.config';


@Injectable({
  providedIn: 'root'
})
export class BillAmendmentsService {

  apiBaseURI: string;
  apiBaseURI1: string;
  portfolioURI: string;
  environment: any;
  constructor(@Inject('environment') environment, private http: HttpClient) {
    this.environment = environment;
    this.apiBaseURI = this.environment.bill_api_url + ApiConfig.pmbrBasePathExt;
    this.apiBaseURI1 = this.environment.bill_api_url + ApiConfig.billBasePathExt;
    this.portfolioURI =
      this.environment.portfolio_mock_api_url + ApiConfig.portfolio;
  }
  getobj_introduction() {
    const url = this.apiBaseURI + `/objection/introduction/report`;
    return this.http.get(url);
  }

  getBillByBillId(billId) {
    const url = this.apiBaseURI + `/objection/introduction/getByBill/${billId}`;
    return this.http.get(url);
  }

  getord_disapprovaldata() {
    const url = this.apiBaseURI + `/ordinanceDisapproval/report`;
    return this.http.get(url);
  }

  getOrdByBillId(billId) {
    const url = this.apiBaseURI + `/ordinanceDisapproval/getByBill/${billId}`;
    return this.http.get(url);
  }
 // obj-intro services
  getAllPendingObjections() {
    const url = this.apiBaseURI + `/objection/introduction/pending`;
    return this.http.get(url);
  }
  getObjectionsByStatus(status) {
    const url = this.apiBaseURI + `/objection/introduction/getAll?status=${status}`;
    return this.http.get(url);
  }
  getPublishedObjections() {
    const url = this.apiBaseURI + `/objection/introduction/getPublished`;
    return this.http.get(url);
  }
  getObjectionById(noticeId) {
    const url = this.apiBaseURI + `/objection/introduction/getById/${noticeId}`;
    return this.http.get(url);
  }
  forwardObjNotice(body, noticeId) {
    const url = this.apiBaseURI + `/objection/introduction/forward?noticeId=${noticeId}`;
    return this.http.put(url, body);
  }
  approveObjNotice(body, noticeId) {
    const url = this.apiBaseURI + `/objection/introduction/approve?noticeId=${noticeId}`;
    return this.http.put(url, body);
  }
  rejectObjNotice(noticeId) {
    const url = this.apiBaseURI + `/objection/introduction/reject?noticeId=${noticeId}`;
    return this.http.put(url, noticeId);
  }
  disallowObjNotice(noticeId) {
    const url = this.apiBaseURI + `/objection/introduction/disallow?noticeId=${noticeId}`;
    return this.http.put(url, noticeId);
  }
  getWorkflowActionUsers(noticeId, workflowId) {
    const url = this.apiBaseURI + `/objection/introduction/getWorkflowActionUsers?noticeId=${noticeId}&workflowId=${workflowId}`;
    return this.http.get(url);
  }
  getNoticeInfo(workflowId) {
    const url = this.apiBaseURI + `/objection/introduction/tracking?processInstanceId=${workflowId}`;
    return this.http.get(url, workflowId);
  }
  sendNotice(noticeId) {
    const url = this.apiBaseURI + `/objection/introduction/send/${noticeId}`;
    return this.http.post(url, noticeId);
  }
  getAllNote(noticeId) {
    const url = this.apiBaseURI + `/objection/introduction/allNote?noticeId=${noticeId}`;
    return this.http.get(url);
  }
  createNote(reqBody) {
    const url = this.apiBaseURI + `/objection/introduction/addNote`;
    return this.http.post(url, reqBody);
  }
  updateNote(reqBody) {
    const url = this.apiBaseURI + `/objection/introduction/editNote`;
    return this.http.put(url, reqBody);
  }
  deleteNote(noteId) {
    const url = this.apiBaseURI + `/objection/introduction/deleteNote/byId?noteId=${noteId}`;
    return this.http.delete(url);
  }
  addMemberResponseOnObjection(body) {
    const url = this.apiBaseURI + `/objection/introduction/addResponse`;
    return this.http.post(url, body);
  }
 // obj-intro services
  submitClauseByClauseAmendments(amendment) {
    const url = this.apiBaseURI + `/resolution/amendment`;
    return this.http.post(url, amendment);
  }
  getAmendmentsOfBillByMember(billId, memberId) {
    const url = this.apiBaseURI + `/resolution/amendment/getByMemberId?memberId=${memberId}&billId=${billId}`;
    return this.http.get(url);
  }

submitAmendments(body) {
  const url = this.apiBaseURI + `/resolution/amendment/submit`;
  return this.http.post(url, body);
}
updateAmendmentStatus(billId, body) {
  const url = this.apiBaseURI + `/resolution/amendment/amendment/section/update`;
  return this.http.put(url, body);
}
deleteAmendments(amendmentId) {
  const url = this.apiBaseURI1 + `/clause/deleteByClauseId?clauseId=${amendmentId}`;
  return this.http.delete(url);
}
getClauseBymemberId() {
    const url = this.apiBaseURI + `/resolution/amendment/getByMemberId`;
    return this.http.get(url);
}
getClauseByuserIdandStatus(body= {}, isAssistant) {
  isAssistant = true;
  if (isAssistant) {
    const url = this.apiBaseURI + `/resolution/amendment/getAll/Section`;
    return this.http.post(url, body);
  } else {
    const url = this.apiBaseURI + `/clause/getAllBillByFilterForSO`;
    return this.http.post(url, body);
  }
}
getClauseNoticesListByBillId(body) {
  const url = this.apiBaseURI + ApiConfig.resolutionList.getByBillId;
  return this.http.post(url, body);
  }

  getClauseNoticesListByAssistantId(body) {
    const url = this.apiBaseURI + `/clause/getByAssistantId`;
    return this.http.post(url, body);
    }
  
  assignToAssistant(body) {
    const url = this.apiBaseURI + ApiConfig.resolutionList.assignToAssistant;
    return this.http.post(url, body);
  }
  intitialList(body, billId, listType) {
    const url = this.apiBaseURI + ApiConfig.resolutionList.initialList + `?billId=${billId}&type=${listType}`;
    return this.http.post(url, body);
  }
  createClauseList(body) {
    const url = this.apiBaseURI + ApiConfig.resolutionList.createClauseList;
    return this.http.put(url, body);

  }
  // getByBillIdList(body) {
  //   const url = this.apiBaseURI + `/clause/getByBillIdList`;
  //   return this.http.post(url, body);
  // }
  getClauseList(listId) {
    const url = this.apiBaseURI + ApiConfig.resolutionList.getClauseList + `?listId=${listId}`;
    return this.http.get(url);
  }
  publishList(listId) {
    const body = {};
    const url = this.apiBaseURI + ApiConfig.resolutionList.publishList +  `?listId=${listId}`;
    return this.http.put(url, body);
  }
  resubmitFile(body) {
    const url = this.apiBaseURI1 + ApiConfig.resolutionList.resubmit;
    return this.http.post(url, body);
  }
  getBillDetails(billId) {
    const url = this.apiBaseURI + `/${billId}`;
    return this.http.get(url);
  }
  applyAmendment(clauseId, userId) {
    const url = this.apiBaseURI + `/resolution/amendment/applyClauseAfterSabha?clauseId=${clauseId}`;
    return this.http.get(url);
  }
  applyOralAmendment(body) {
    const url = this.apiBaseURI + `/amendment/oralAmendmentReport`;
    return this.http.post(url, body);
  }
  getAmendmentReport(billId) {
    const url = this.apiBaseURI + `/amendment/getOralAmendmentReportByBill/${billId}`;
    return this.http.get<any>(url);
  }
  markAmendmentAsAccepted(body) {
    const url = this.apiBaseURI + `/clause/markAsAccepted`;
    return this.http.post(url, body);
  }
  markAmendmentAsRejected(body) {
    const url = this.apiBaseURI + `/clause/markAsRejected`;
    return this.http.post(url, body);
  }
  convertToOfficialAmendment(body) {
    const url = this.apiBaseURI + `/clause/convertToOfficialAmendment`;
    return this.http.post(url, body);
  }
  getListByNoticeType(body) {
    const url = this.apiBaseURI + ApiConfig.resolutionList.getListByNoticeType;
    return this.http.post(url, body);
  }
}
