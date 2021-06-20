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
  apiBaseURI3: string;
  fileStatus = null;
  electionBaseURI: string;

  constructor(@Inject("environment") environment, private http: HttpClient) {
    this.environment = environment;
    this.apiBaseURI = this.environment.table_api_url + ApiConfig.basePathExt;
    this.apiBaseURI3 = this.environment.file_api + ApiConfig.basePathFile;
    this.electionBaseURI = this.environment.table_api_url + ApiConfig.basePathElection;
  }
  getFileById(fileId, userId) {
    const url = this.apiBaseURI + `/file/getByFileId?fileId=${fileId}&userId=${userId}`;
    return this.http.get(url);
  }
  getFileByElectionFileId(fileId, userId) {
    const url =  this.environment.table_api_url +`:8074/kla/service/v1/election/file/getByFileId?fileId=${fileId}&userId=${userId}`;
    return this.http.get(url);
  }
  createNote(body) {
    const url = this.environment.file_api + `:8078/kla/service/v1/files/${body.fileId}/notes`;
    return this.http.post(url, body);
  }
  // update notes
  updateNote(body) {
    const url = this.environment.file_api + `:8078/kla/service/v1/files/${body.fileId}/notes`;
    return this.http.put(url, body);
  }
  // get notes
  getAllNotes(fileId) {
    const url = this.environment.file_api + `:8078/kla/service/v1/files/${fileId}/notes`;
    return this.http.get(url);
  }

  deleteNoteById(reqBody) {
    return this.http.request('DELETE', this.environment.file_api + `:8078/kla/service/v1/files/${reqBody.fileId}/notes/byId`, { body: reqBody });
  }
  checkWorkFlowStatus(workFlowId) {
    const url =
      this.environment.file_api + `:9000/kla/workflow/service/v1/task/tracking?processInstanceId=${workFlowId}`;
    return this.http.get<any>(url);
  }
  getPendingFiles(userId, assembly, session, type) {
    if(assembly=== null || assembly === null && session === null) {
      return this.http.get(this.apiBaseURI3 +
        `/pending/type?userId=${userId}&assemblyId=&sessionId=&type=${type}`);
    } else {
      return this.http.get(this.apiBaseURI3 +
        `/pending/type?userId=${userId}&assemblyId=${assembly}&sessionId=${session}&type=${type}`);
    }
  }
  getWorkflowActionUsers(workFlowId, fileId) {
    return this.http.get(
      this.environment.file_api + `:8078/kla/service/v1/files/getWorkflowActionUsers?workflowId=${workFlowId}&fileId=${fileId}`
    );
  }
  forwardFile(body, fileId) {
    return this.http.put(this.apiBaseURI3 + `/${fileId}/forward`, body).pipe(
      map((res) => {
        return res;
      })
    );
  }
  approveFile(body = {}) {
    const url = this.apiBaseURI + `/file/approve`;
    return this.http.put(url, body);
  }
  approveElectionFile(body) {
    const url = this.environment.table_api_url + `:8074/kla/service/v1/election/file/approve`;
    return this.http.put(url, body);
  }
  getAllFiles(body) {
    return this.http.post(this.apiBaseURI3 + `/getAll`, body);
  }
  approvedByHigherOfficial(userId) {
    return this.http.get(this.apiBaseURI3 + `/all/ownerId?userId=${userId}`);
  }
  createFile(body) {
    return this.http.post(this.apiBaseURI + `/file/createFile`, body);
  }
  attachToFile(body) {
    return this.http.post(this.apiBaseURI + `/file/resubmitFile`, body);
  }
  reSubmitFile(body){
    const url = this.apiBaseURI + `/file/resubmitFile`;
    return this.http.post(url, body);
  }
  getPendingRatification(body) {
    return this.http.post(this.environment.file_api + `:8078/kla/service/v1/files/get/ratification/pending`, body);
  }
  pullFile(body, fileId) {
    return this.http.put(this.environment.file_api + `:8078/kla/service/v1/files/${fileId}/pull`, body);
  }
  getAllFileLogs(fileId) {
    const url = this.environment.file_api + `:8078/kla/service/v1/files/${fileId}/logs`;
    return this.http.get(url);
  }
  attachActiveSubtype(body) {
    const url = this.apiBaseURI + `/file/addSubType`;
    return this.http.post(url, body);
  }
  updateFile(fileId, body) {
    return this.http.put(this.environment.file_api + `:8078/kla/service/v1/files/${fileId}`, body);
  }
  fileClosure(id, userId) {
    return this.http.get(this.environment.file_api +  `:8078/kla/service/v1/files/fileClosure?fileId=${id}&userId=${userId}`);
  }
  approveClosure(body, id) {
    return this.http.put( this.environment.file_api + `:8078/kla/service/v1/files/fileClosure/${id}/closure`, body);
  }
  getNoticeTemplateData(noticeId, userId) {
    const url = this.environment.notice_processing_api + `byId?noticeId=${noticeId}&userId=${userId}`;
    return this.http.get<any>(url);
  }

  getSubmittedM2MProcession() {
    const url = this.apiBaseURI + ApiConfig.governersAddress.m2mProcession;
    return this.http.get<any>(url);
  }

  createProtemSpeakerFile(body) {
    return this.http.post(this.electionBaseURI + ApiConfig.election.createFile, body);
  }

  resubmitProtemFile(body) {
    return this.http.post(this.electionBaseURI + ApiConfig.election.resubmitFile, body);
  }

  addSubtypeToProtemFile(body) {
    return this.http.post(this.electionBaseURI + ApiConfig.election.addSubtype, body);
  }
  createProtemAuth(body) {
    return this.http.post(this.electionBaseURI + ApiConfig.election.createProtemSpeakerAuth, body);
  }

  getFileByResumeFileId(fileId, userId){
    const url =  this.environment.table_api_url + ApiConfig.basePathFileTableDiary + `/file/getByFileId?fileId=${fileId}&userId=${userId}`;
    return this.http.get(url);
  }
  createResumeAndBulletinPart1File(body){
    return this.http.post(this.environment.table_api_url + ApiConfig.basePathFileTableDiary + "/file/createFile", body);
  }
  approveResumeAndBulletinPart1(body){
    return this.http.put(this.environment.table_api_url + ApiConfig.basePathFileTableDiary + "/file/approve", body);
  }
}
