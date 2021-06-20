import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConfig } from '../config/api.config';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FileServiceService {
  environment: any;
  apiBaseURI: string;
  apiBaseURIFile: string;
  apiBaseURIWorkflow: string;
  fileStatus = null;
  constructor(@Inject("environment") environment, private http: HttpClient) {
    this.environment = environment;
    this.apiBaseURI = this.environment.budget_api_url + ApiConfig.basePathExt;
    this.apiBaseURIFile = this.environment.file_api + ApiConfig.basePathFile;
    this.apiBaseURIWorkflow = this.environment.file_api + ApiConfig.basePathWorkflow;
  }
  getFileById(fileId, userId) {
    const url = this.apiBaseURI + `/file/getByFileId?fileId=${fileId}&userId=${userId}`;
    return this.http.get(url);
  }
  createNote(body) {
    const url = this.apiBaseURIFile + `/${body.fileId}/notes`;
    return this.http.post(url, body);
  }
  // update notes
  updateNote(body) {
    const url = this.apiBaseURIFile + `/${body.fileId}/notes`;
    return this.http.put(url, body);
  }
  // get notes
  getAllNotes(fileId) {
    const url = this.apiBaseURIFile + `/${fileId}/notes`;
    return this.http.get(url);
  }

  deleteNoteById(reqBody) {
    return this.http.request('DELETE', this.apiBaseURIFile + `/${reqBody.fileId}/notes/byId`, { body: reqBody });
  }
  checkWorkFlowStatus(workFlowId) {
    const url =
      this.apiBaseURIWorkflow + `/tracking?processInstanceId=${workFlowId}`;
    return this.http.get<any>(url);
  }
  getPendingFiles(userId, assembly, session, type) {
    return this.http.get(this.apiBaseURIFile +
      `/pending/type?userId=${userId}&assemblyId=${assembly}&sessionId=${session}&type=${type}`);
  }
  getWorkflowActionUsers(workFlowId, fileId) {
    return this.http.get(
      this.apiBaseURIFile + `/getWorkflowActionUsers?workflowId=${workFlowId}&fileId=${fileId}`
    );
  }
  forwardFile(body, fileId) {
    return this.http.put(this.apiBaseURIFile + `/${fileId}/forward`, body).pipe(
      map((res) => {
        return res;
      })
    );
  }
  approveFile(body = {}) {
    const url = this.apiBaseURI + `/file/approve`;
    return this.http.put(url, body);
  }
  getAllFiles(body) {
    return this.http.post(this.apiBaseURIFile + `/getAll`, body);
  }
  approvedByHigherOfficial(userId) {
    return this.http.get(this.apiBaseURIFile + `/all/ownerId?userId=${userId}`);
  }
  createFile(body) {
    return this.http.post(this.apiBaseURI + `/file/createFile`, body);
  }
  attachToFile(body) {
    return this.http.post(this.apiBaseURI + `/file/resubmitFile`, body);
  }
  reSubmitFile(body) {
    const url = this.apiBaseURI + `/file/resubmitFile`;
    return this.http.post(url, body);
  }
  getPendingRatification(body) {
    return this.http.post(this.apiBaseURIFile + `/get/ratification/pending`, body);
  }
  pullFile(body, fileId) {
    return this.http.put(this.apiBaseURIFile + `/${fileId}/pull`, body);
  }
  getAllFileLogs(fileId) {
    const url = this.apiBaseURIFile + `/${fileId}/logs`;
    return this.http.get(url);
  }
  attachActiveSubtype(body) {
    const url = this.apiBaseURI + `/file/addSubType`;
    return this.http.post(url, body);
  }
  updateFile(fileId, body) {
    return this.http.put(this.apiBaseURIFile + `/${fileId}`, body);
  }
  fileClosure(id, userId) {
    return this.http.get(this.apiBaseURIFile + `/fileClosure?fileId=${id}&userId=${userId}`);
  }
  approveClosure(body, id) {
    return this.http.put(this.apiBaseURIFile + `/fileClosure/${id}/closure`, body);
  }
  claimFile(pId, userId) {
    const url =
      this.apiBaseURIWorkflow + `/claimTask?processInstanceId=${pId}&userId=${userId}`;
    return this.http.put<any>(url, pId, userId);
  }
}
