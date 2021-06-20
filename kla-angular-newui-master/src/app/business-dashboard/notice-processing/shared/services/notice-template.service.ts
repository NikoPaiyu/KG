import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { debounceTime } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class NoticeTemplateService {
  constructor(private http: HttpClient) { }
  // get all category
  getNoticeCategories() {
    const url = environment.notice_processing_api + "category/getAll";
    return this.http.get(url);
  }
  // get all input types
  getNoticeTemplateInputTypes() {
    const url = environment.notice_processing_api + "inputType/getAll";
    return this.http.get(url);
  }
  // save template inputs
  saveTemplateWithInputs(body) {
    const url =
      environment.notice_processing_api + "template/createTemplateWithInput";
    return this.http.post(url, body);
  }
  // update template inputs
  updateTemplateWithInputs(body) {
    const url =
      environment.notice_processing_api + "template/updateTemplateInputs";
    return this.http.put(url, body);
  }
  // get all templates
  getAllTemplates() {
    const url = environment.notice_processing_api + "template/getAllTemplates";
    return this.http.get(url);
  }
  // get template with id'
  getTemplateById(templateId) {
    const url =
      environment.notice_processing_api +
      `template/getTemplate?templateId=${templateId}`;
    return this.http.get<any>(url);
  }
  // get template inputs
  getTemplateInputs(templateId) {
    const url =
      environment.notice_processing_api +
      `template/getTemplateInputs?templateId=${templateId}`;
    return this.http.get(url);
  }
  // get template data by  id
  getTemplateData(templateId, primaryMemberId) {
    const url =
      environment.notice_processing_api +
      `getTemplateForm?templateId=${templateId}&primaryMemberId=${primaryMemberId}`;
    return this.http.get<any>(url);
  }
  changetPrimaryOwner(noticeId, primaryMemberId) {
    let body = {
      "noticeId": noticeId,
      "userId": primaryMemberId
    }
    const url =
      environment.notice_processing_api +
      `changePrimaryOwner`;
    return this.http.put<any>(url, body);
  }
  getTemplateListGroupByCategory() {
    const url =
      environment.notice_processing_api +
      `template/getTemplateListGroupByCategory`;
    return this.http.get(url);
  }
  getTemplateListByUser() {
    const url = environment.notice_processing_api + 'template/getAllForUser';
    return this.http.get(url);
  }
  // delete template input
  deleteTemplateInput(body) {
    const url =
      environment.notice_processing_api + `template/deleteTemplateInput`;
    return this.http.request("delete", url, { body: body });
  }
  // save notice
  saveNotice(body) {
    const url = environment.notice_processing_api;
    return this.http.post<any>(url, body);
  }
  // update notice details
  updateNoticeDetails(body) {
    const url = environment.notice_processing_api + "noticeInputValue";
    return this.http.put(url, body);
  }
  getNotice(startId = 0) {
    const url = environment.notice_processing_api + "page";
    return this.http.post<any>(url, { startPage: startId, numberOfItem: 10 });
  }

  getNoticeByUserId(body) {
    const url = environment.notice_processing_api + "page/getByUser";
    return this.http.post<any>(url, body);
  }

  getAllPendingNotice(body) {
    const url = environment.notice_processing_api + "page/getAll/pending";
    return this.http.post<any>(url, body);
  }
  getAllAssembly() {
    return this.http.get<any>(
      `${environment.calendar_api_url}/mock/getAllAssembly`
    );
  }
  getAllSession() {
    return this.http.get<any>(
      `${environment.calendar_api_url}/mock/getAllSession`
    );
  }
  saveNote(body) {
    const url = environment.notice_processing_api + "note";
    return this.http.post(url, body);
  }
  updateNote(body) {
    const url = environment.notice_processing_api + "note";
    return this.http.put(url, body);
  }
  getNoteData(noticeId) {
    const url = environment.notice_processing_api + `note?noticeId=${noticeId}`;
    return this.http.get<any>(url);
  }
  getData(noticeId, userId) {
    const url = environment.notice_processing_api + `byId?noticeId=${noticeId}&userId=${userId}`;
    return this.http.get<any>(url);
  }
  deleteNoteById(noteId) {
    const url =
      environment.notice_processing_api + `note/byId?noteId=${noteId}`;
    return this.http.delete<any>(url);
  }
  // get dashboard data
  getDashboardData(userId) {
    if (userId) {
      const url =
        environment.notice_processing_api + `dashboard/member?userId=${userId}`;
      return this.http.get<any>(url);
    }
  }
  // get all rules
  getallrules() {
    const url = environment.notice_processing_api + `rule/getAll`;
    return this.http.get<any>(url);
  }
  getallWorkflow() {
    const url = environment.notice_processing_api + `workflow/getAll`;
    return this.http.get<any>(url);
  }

  getParicularInputTemplate(inputTypeId, connectedInputTypeId, inputValue) {
    const url =
      environment.notice_processing_api +
      `getTemplateForm?templateId=${inputTypeId}&primaryMemberId=${connectedInputTypeId}`;
    return this.http.get<any>(url);
  }
  // version creation api
  versionCreation(body) {
    const url =
      environment.notice_processing_api + "noticeInputValue";
    return this.http.put(url, body);
  }
}
