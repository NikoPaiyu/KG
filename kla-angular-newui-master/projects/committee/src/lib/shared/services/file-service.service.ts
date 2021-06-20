import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConfig } from '../config/api.config';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FileServiceService {
  environment: any;
  committeeApiBaseURI: string;
  fileApiBaseURI: string;
  workFlowApiBaseURI:string
  fileStatus = null;
  constructor(@Inject("environment") environment, private http: HttpClient) {
    this.environment = environment;
    this.committeeApiBaseURI = this.environment.committee_api_url + ApiConfig.basePathExt;
    this.fileApiBaseURI = this.environment.file_api + ApiConfig.basePathFile;
    this.workFlowApiBaseURI = this.environment.file_api + ApiConfig.basePathWorkflow;
  }
  getFileById(fileId, userId) {
    const url = this.committeeApiBaseURI + `/file/getByFileId?fileId=${fileId}&userId=${userId}`;
    return this.http.get(url);
  }
  createNote(body) {
    const url = this.fileApiBaseURI + `/${body.fileId}/notes`;
    return this.http.post(url, body);
  }
  // update notes
  updateNote(body) {
    const url = this.fileApiBaseURI + `/${body.fileId}/notes`;
    return this.http.put(url, body);
  }
  // get notes
  getAllNotes(fileId) {
    const url = this.fileApiBaseURI + `/${fileId}/notes`;
    return this.http.get(url);
  }

  deleteNoteById(reqBody) {
    return this.http.request('DELETE', this.fileApiBaseURI + `/${reqBody.fileId}/notes/byId`, { body: reqBody });
  }
  checkWorkFlowStatus(workFlowId) {
    const url =
      // this.environment.file_api + `:9000/kla/workflow/service/v1/task/tracking?processInstanceId=${workFlowId}`;
      this.workFlowApiBaseURI+ `/tracking?processInstanceId=${workFlowId}`;
      return this.http.get<any>(url);
  }
  getPendingFiles(userId, assembly, session, type) {
    return this.http.get(this.fileApiBaseURI +
      `/pending/type?userId=${userId}&assemblyId=${assembly}&sessionId=${session}&type=${type}`);
  }
  getWorkflowActionUsers(workFlowId, fileId) {
    return this.http.get(
      this.fileApiBaseURI + `/getWorkflowActionUsers?workflowId=${workFlowId}&fileId=${fileId}`
    );
  }
  forwardFile(body, fileId) {
    return this.http.put(this.fileApiBaseURI + `/${fileId}/forward`, body).pipe(
      map((res) => {
        return res;
      })
    );
  }
  approveFile(body = {}) {
    const url = this.committeeApiBaseURI + `/file/approve`;
    return this.http.put(url, body);
  }
  getAllFiles(body) {
    return this.http.post(this.fileApiBaseURI + `/getAll`, body);
  }
  approvedByHigherOfficial(userId) {
    return this.http.get(this.fileApiBaseURI + `/all/ownerId?userId=${userId}`);
  }
  createFile(body) {
    return this.http.post(this.committeeApiBaseURI + `/file/createFile`, body);
  }
  attachToFile(body) {
    return this.http.post(this.committeeApiBaseURI + `/file/resubmitFile`, body);
  }
  reSubmitFile(body){
    const url = this.committeeApiBaseURI + `/file/resubmitFile`;
    return this.http.post(url, body);
  }
  getPendingRatification(body) {
    return this.http.post(this.fileApiBaseURI + `/get/ratification/pending`, body);
  }
  pullFile(body, fileId) {
    return this.http.put(this.fileApiBaseURI + `/${fileId}/pull`, body);
  }
  getAllFileLogs(fileId) {
    const url = this.fileApiBaseURI + `/${fileId}/logs`;
    return this.http.get(url);
  }
  attachActiveSubtype(body) {
    const url = this.committeeApiBaseURI + `/file/addSubType`;
    return this.http.post(url, body);
  }
  updateFile(fileId, body) {
    return this.http.put(this.fileApiBaseURI+ `/${fileId}`, body);
  }
  fileClosure(id, userId) {
    return this.http.get(this.fileApiBaseURI +  `/fileClosure?fileId=${id}&userId=${userId}`);
  }
  approveClosure(body, id) {
    return this.http.put( this.fileApiBaseURI + `/fileClosure/${id}/closure`, body);
  }
  uploadUrl() {
    return  this.environment.committee_api_url + ApiConfig.uploadFile;
  }
}
