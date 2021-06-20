import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Entity } from 'src/app/shared/models/entity';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) { }

  // attach to file
  attachToFile(body) {
    const url = environment.notice_processing_api + 'file/createFile';
    return this.http.post(url, body);
  }
  // get file details by id
  getFileById(fileId, userId) {
    const url = environment.notice_processing_api + `file/getByFileId?fileId=${fileId}&userId=${userId}`;
    return this.http.get<any>(url);
  }
  // list files
  getAllFiles(assemblyId, sessionId) {
    const url = environment.notice_processing_api + `file/listFiles?assemblyId=${assemblyId}&sessionId=${sessionId}`;
    return this.http.get<any>(url);
  }
  getFileByOwner(userId) {
    const url = environment.file_flow_api + `all/ownerId?userId=${userId}&type=NOTICE`;
    return this.http.get(url);
  }
  // approve file
  approveFile(body = {}) {
    const url = environment.notice_processing_api + `file/approve`;
    return this.http.put(url, body);
  }
  // disallow file
  disallowFile(fileId) {
    const url = environment.file_flow_api + `${fileId}/disallow`;
    return this.http.put(url, {});
  }
  // get document in the file
  getDocuments(fileId) {
    const url = environment.file_flow_api + `${fileId}/document`;
    return this.http.get(url);
  }
  // create document to the file
  creatFileDocument(fileId, body = {}) {
    const url = environment.file_flow_api + `${fileId}document`;
    return this.http.post(url, body);
  }
  // forward file
  forwardFile(fileId, body = {}) {
    const url = environment.file_flow_api + `${fileId}/forward`;
    return this.http.put(url, body);
  }
  // get all file logs
  getAllFileLogs(fileId) {
    const url = environment.file_flow_api + `${fileId}/logs`;
    return this.http.get(url);
  }
  // create file logs
  createFileLogs(fileId, body) {
    const url = environment.file_flow_api + `${fileId}/logs`;
    return this.http.post(url, body);
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
  // get notes
  getAllNotes(fileId) {
    const url = environment.file_flow_api + `${fileId}/notes`;
    return this.http.get(url);
  }
  // delete note by id
  // deleteNoteById( fileId) {
  //   const url = environment.file_flow_api + `${fileId}/notes/ById`;
  //   return this.http.delete(url);
  // }
  deleteNoteById(reqBody) {
    return this.http.request('DELETE', environment.file_flow_api + `${reqBody.fileId}/notes/byId`, { body: reqBody });
  }
  // return file
  returnFile(fileId, body = {}) {
    const url = environment.file_flow_api + `${fileId}/return`;
    return this.http.put(url, body);
  }
  // submit file
  submitFile(fileId, body = {}) {
    const url = environment.file_flow_api + `${fileId}/submit`;
    return this.http.put(url, body);
  }
  // get pending file
  getPendingFile(assemblyId, sessionId, userId, Type) {
    const url = environment.file_flow_api + `pending/type?assemblyId=${assemblyId}&sessionId=${sessionId}&userId=${userId}&type=${Type}`;
    return this.http.get(url);
  }
  // get file by userId
  getFileByUserId(userId) {
    const url = `${environment.file_flow_api}/all/ownerId?userId=${userId}`;
    return this.http.get(url);
  }
  // get bac pending notices
  getPendingBacNotices() {
    const url = environment.notice_processing_api + `bac/pending`;
    return this.http.get<any>(url);
  }
  // set lob date for bac notices
  setToLob(body = {}) {
    const url = environment.notice_processing_api + `bac/addToLob`;
    return this.http.post<any>(url, body);
  }
  // get arising file number
  getArisingFileNumber() {
    const url = environment.file_flow_api + 'number';
    return this.http.get<any>(url);
  }
  convertTONormal(body) {
    const url = environment.file_flow_api + `${body.fileId}/notes/temporary`;
    return this.http.put<any>(url, body);
  }
  getAuthorisedNoticeList() {
    const url = environment.notice_processing_api + `getAllMemberAuthorisedNotice`;
    return this.http.get<any>(url);
  }
  getUsersBasedOnUserType() {
    const url = environment.user_mgmnt_api_url + `/v1/users/getBasedOnUserType/NON_MEMBER`;
    return this.http.get(url);
  }
  assignFile(fileId, body = {}) {
    const url = environment.file_flow_api + `${fileId}/assign`;
    return this.http.put<any>(url, body);
  }
  getUsersList(workflowId, fileId) {
    const url = environment.file_flow_api + `getWorkflowActionUsers?workflowId=${workflowId}&fileId=${fileId}`;
    return this.http.get<any>(url);
  }
  forwardWithAssignee(body = {}) {
    const url = environment.workflow_api + `/task/forwardWithAssignee`;
    return this.http.put<any>(url, body);
  }
  forwardAllWithAssignee(body = {}) {
     const url = environment.workflow_api +  `/task/forwardAllWithAssignee`;
     return this.http.put<any>(url, body);
  }
  preFileApprovalCheck(noticeId) {
    const url = environment.notice_processing_api + `/getPreApprovalValidationList?noticeId=${noticeId}`;
    return this.http.get<any>(url);
  }
  getWorkFlowRole(workflowId, fileId) {
    const url =
      environment.file_flow_api +
      `getWorkflowActionUsers?workflowId=${workflowId}&fileId=${fileId}`;
    return this.http.get<any>(url);
  }

// update File
updateFile(fileId, data) {
    const url = environment.file_flow_api + `${fileId}`;
    return this.http.put<any>(url, data);
}
pullFile(body, fileId) {
  return this.http.put(environment.file_flow_api + `/${fileId}/pull`, body);
}
// get list of files that can attach to the notice
getFilesToAttachByNoticeId(assemblyId, sessionId, noticeId) {
  const url = environment.notice_processing_api + 
  `file/listFilesForAttaching?assemblyId=${assemblyId}&sessionId=${sessionId}&noticeId=${noticeId}`;
  return this.http.get<any>(url);
}
// forward for convienience
forwardConvenience(body) {
  const url = environment.notice_processing_api + 'convenience/forword';
  return this.http.post(url, body);
}
// respond to notice
respondConvienience(body) {
  const url = environment.notice_processing_api + 'convenience/notice/respond';
  return this.http.post(url, body);
}
listPendingConveniences(userId) {
  const url = `${environment.notice_processing_api}convenience/pending/list?userId=${userId}`;
  return this.http.get(url);
}
listAllConveniences(userId) {
  const url = `${environment.notice_processing_api}convenience/list?userId=${userId}`;
  return this.http.get<any>(url);
}
listConveniencesByNoticeId(noticeId) {
  const url = `${environment.notice_processing_api}convenience/notice?noticeId=${noticeId}`;
  return this.http.get<any>(url);
}

getAllSections() {
  return this.http.get<any>(
    environment.departmentmangement_api_url + '/getsection'
  );
}

getAllNonMemberUsers(data) {
  return this.http.post<any>(
    environment.generic_file_api_urlx + '/users/member/getNonMembers',
    data
  );
}

getDesignation() {
  return this.http.get<any>(
    environment.departmentmangement_api_url +
      '/getdesignation'
  );
}

editBulletinContent(body) {
  const url = `${environment.notice_processing_api}addBulletin`;
  return this.http.post<any>(url, body);
}

postBulletinPreview(body) {
  const url = `${environment.notice_processing_api}bulletin/preview`;
  return this.http.post(url, body, {responseType: 'text'});
}

getBulletinPreview(noticeId) {
  const url = `${environment.notice_processing_api}bulletin/preview?noticeId=${noticeId}`;
  return this.http.get(url, {responseType: 'text'});
}

publishBulletin(noticeId) {
  const url = `${environment.notice_processing_api}bulletin/publish?noticeId=${noticeId}`;
  return this.http.post(url, null);
}

getBulletinList() {
  const url = `${environment.bullettin_list_api}getByBusinessType?businessType=NOTICE`;
  return this.http.get(url);
}

}
