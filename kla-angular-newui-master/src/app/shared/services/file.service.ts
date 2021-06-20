import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) { }

  // get file by id
  getFileById(fileId, userId) {
    const url = environment.bulletin_api + `getByFileId?fileId=${fileId}&userId=${userId}`;
    return this.http.get<any>(url);
  }
  // get pending file list
  getPendingFileList(params) {
    const url = environment.file_flow_api + `pending/type?assemblyId=${params.assemblyId}&sessionId=${params.sessionId}&userId=${params.userId}&type=${params.type}`;
    return this.http.get<any>(url);
  }
  // get all file list by type
  getAllFilesByType(params) {
    const url = environment.file_flow_api + `getAllByType?assemblyId=${params.assemblyId}&sessionId=${params.sessionId}&userId=${params.userId}&type=${params.type}`;
    return this.http.get<any>(url);
  }
  // get workflow status
  checkWorkFlowStatus(workFlowId) {
    const url = environment.workflow_api + `/task/tracking?processInstanceId=${workFlowId}`;
    return this.http.get<any>(url);
  }
  // get question workflow status
  checkQuestionWorkFlowStatus(workFlowId) {
    const url = environment.question_wrkflw_api_url + `/task/tracking?processInstanceId=${workFlowId}`;
    return this.http.get<any>(url);
  }
  // create note
  createNote(fileId, body) {
    const url = environment.file_flow_api + `${fileId}/notes`;
    return this.http.post(url, body);
  }
  // update notes
  updateNote(fileId, body) {
    const url = environment.file_flow_api + `${fileId}/notes`;
    return this.http.put(url, body);
  }
  deleteNoteById(reqBody) {
    return this.http.request('DELETE', environment.file_flow_api + `${reqBody.fileId}/notes/byId`, { body: reqBody });
  }
  // get all notes
  getAllNotes(fileId) {
    const url = environment.file_flow_api + `${fileId}/notes`;
    return this.http.get(url);
  }
  convertTONormal(body) {
    const url = environment.file_flow_api + `${body.fileId}/notes/temporary`;
    return this.http.put<any>(url, body);
  }
  updateFile(fileId, body) {
    const url = environment.file_flow_api + `${fileId}`;
    return this.http.put(url, body);
  }
  getCurrentNumber(body) {
    const url = environment.office_api_url + `:8078/kla/service/v1/files/currentNumber`
    return this.http.post(url, body);
  }
  getKlaSections() {
    return this.http.get(`${environment.departmentmangement_api_url}/getsection`);
  }
  currentNumberList(body){
    const url = environment.office_api_url + `:8078/kla/service/v1/files/getcurrentNumber/details`
    return this.http.post(url, body);
  }
}
