import { Injectable, Inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ApiConfig } from "../config/api.config";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class FilesService {
  environment: any;
  apiBaseURI: any;
  apiBaseURI2: any;
  apiBaseURI3: any;
  apiBaseURI4: any;
  apiWFBaseURI: any;

  constructor(@Inject("environment") environment, private http: HttpClient) {
    this.environment = environment;
    this.apiBaseURI = this.environment.cpl_api_url + ApiConfig.basePathFile;
    this.apiBaseURI2 = this.environment.cpl_api_url + ApiConfig.basePathExt;
    this.apiBaseURI3 =
      this.environment.cpl_api_url + ApiConfig.basePathNotification;
    this.apiWFBaseURI = this.environment.workflow_api;
    this.apiBaseURI4 =
      this.environment.cpl_api_url + ApiConfig.basePathCurrespondence;
  }

  createRegistrationList(body) {
    return this.http.post(this.apiBaseURI2 + ApiConfig.files.create, body);
  }

  getAllLogs(fileId) {
    return this.http.get(this.apiBaseURI + `/${fileId}/logs`);
  }

  addNote(body) {
    return this.http.post(this.apiBaseURI + `/${body.fileId}/notes`, body);
  }

  getNotes(fileId) {
    return this.http.get(this.apiBaseURI + `/${fileId}/notes`);
  }

  updateNote(body) {
    return this.http.put(this.apiBaseURI + `/${body.fileId}/notes`, body);
  }

  deleteNoteById(reqBody) {
    return this.http.request(
      "DELETE",
      this.apiBaseURI + `/${reqBody.fileId}/notes/byId`,
      { body: reqBody }
    );
  }

  convertNote(fileId, body) {
    return this.http.put(
      this.apiBaseURI + `/${fileId}/notes/temporary?noteId=${body.noteId}`,
      body
    );
  }

  getAllFileList(body) {
    // return this.http.get(this.apiBaseURI + ApiConfig.files.list +
    //   `?assemblyId=${assembly}&&sessionId=${session}&&type=${type}`);
    return this.http.post(this.apiBaseURI2 + ApiConfig.files.getAll, body);
  }
  // getFileNumber() {
  //   return this.http.get(this.apiBaseURI + "/number");
  // }

  updateFile(body, fileId) {
    return this.http.put(this.apiBaseURI + `/${fileId}`, body);
  }

  getPendingFiles(body) {
    // if (assemblyId === null || sessionId === null) {
    //   return this.http.get(
    //     this.apiBaseURI +
    //       `/pending?assemblyId=&sessionId=&userId=${userId}`
    //   );
    // } else {
    //   return this.http.get(
    //     this.apiBaseURI +
    //       `/pending?assemblyId=${assemblyId}&sessionId=${sessionId}&userId=${userId}`
    //   );
    // }
    return this.http.post(this.apiBaseURI2 + ApiConfig.files.getPending, body);
  }

  getDocumentsByFileId(fileId) {
    return this.http.get(
      this.apiBaseURI2 + `/file/getByFileId?fileId=${fileId}`
    );
  }

  forwardFile(body, fileId) {
    //return this.http.put(this.apiBaseURI + `/${fileId}/forward`, body);
    return this.http.put(this.apiBaseURI + `/${fileId}/forward`, body).pipe(
      map((res) => {
        return res;
      })
    );
  }

  checkWorkFlowStatus(workFlowId) {
    const url =
      this.environment.cpl_api_url +
      `:9000/kla/workflow/service/v1/task/tracking?processInstanceId=${workFlowId}`;
    return this.http.get<any>(url);
  }

  approveFile(body, fileId) {
    return this.http.put(
      this.apiBaseURI2 + `/file/approve?fileId=${fileId}`,
      body
    );
  }

  createDocumentList(body) {
    return this.http.post(
      this.apiBaseURI2 + ApiConfig.files.createDocumentList,
      body
    );
  }

  getAllRules() {
    const url = this.environment.notice_processing_api + `rule/getAll`;
    return this.http.get<any>(url);
  }

  addNewDocument(body) {
    return this.http.post(this.apiBaseURI + `/${body.fileId}/document`, body);
  }

  getNewDocs(fileId) {
    return this.http.get(this.apiBaseURI + `/${fileId}/document`);
  }
  getTemplateForEdit(fileId, documentId) {
    return this.http.get(this.apiBaseURI + `/${fileId}/document/${documentId}`);
  }
  returnFile(body, fileId) {
    return this.http.put(this.apiBaseURI + `/${fileId}/return`, body);
  }

  getFileForPortfolio(body) {
    return this.http.post(
      this.apiBaseURI2 + "/file/pendingFileForDepartment",
      body
    );
  }

  getWorkflowActionUsers(workFlowId, fileId) {
    return this.http.get(
      this.apiBaseURI +
        ApiConfig.files.workFlowUsers +
        `?workflowId=${workFlowId}&fileId=${fileId}`
    );
  }
  pendingFilesForUser(body) {
    return this.http.post(
      this.apiBaseURI + ApiConfig.files.pendingFilesForUser,
      body
    );
  }
  pendingFilesForSection(body) {
    return this.http.post(
      this.apiBaseURI + ApiConfig.files.pendingFilesForSection,
      body
    );
  }
  aaprovedByHigherOfficial(userId) {
    return this.http.get(
      this.apiBaseURI +
        ApiConfig.files.aaprovedByHigherOfficial +
        `?userId=${userId}`
    );
  }
  getAllTemplate() {
    return this.http.get(this.apiBaseURI + ApiConfig.files.getAllTemplateList);
  }
  getTemplateFormByTemplateId(templateId) {
    return this.http.get(
      this.apiBaseURI +
        ApiConfig.files.getTemplateFormByTemplateId +
        `?templateId=${templateId}`
    );
  }
  sendCorrespondence(body, fileId, fileDocumentId) {
    return this.http.put(
      this.apiBaseURI +
        `/${fileId}/document/${fileDocumentId}/sendCorrespondence `,
      body
    );
  }
  changeSubmitStatus(body) {
    return this.http.put(
      this.apiBaseURI + `/${body.fileId}` + ApiConfig.files.changeSubmitStatus,
      body
    );
  }
  getCorrespondenceDepartmentrecieved(departmentId) {
    return this.http.get(
      this.apiBaseURI3 +
        ApiConfig.notification.getCurrespondenceDepartmentRecieved +
        `=${departmentId}`
    );
  }
  addAttachment(body) {
    return this.http.put(this.apiBaseURI2 + `/addAttachment `, body);
  }
  changeUploadStatus(currespondenceId) {
    return this.http.get(
      this.apiBaseURI3 +
        ApiConfig.notification.chnageUploadStatus +
        `=${currespondenceId}`
    );
  }
  uploadDocuments(body) {
    return this.http.put(
      this.apiBaseURI4 + `/${body.correspondenceId}/uploadeCplAttachment`,
      body
    );
  }

  uploadPDF(body) {
    return this.http.post(this.environment.cpl_api_url + ApiConfig.uploadFile, body);
  }

  updateFileStatus(id, status) {
    return this.http.put(
      this.apiBaseURI +
        `/${id}` +
        ApiConfig.files.statusUpdate +
        `?status=${status}`,
      null
    );
  }

  getPendingRatification(body) {
    // if (assemblyId === null || sessionId === null) {
    //   return this.http.get(this.apiBaseURI +
    //     ApiConfig.files.ratification + `?userId=${userId}&assemblyId=&sessionId=`);
    // } else {
    //   return this.http.get(this.apiBaseURI +
    //     ApiConfig.files.ratification + `?userId=${userId}&assemblyId=${assemblyId}&sessionId=${sessionId}`);
    // }
    return this.http.post(
      this.apiBaseURI2 + ApiConfig.files.ratification,
      body
    );
  }

  pullFile(body, fileId) {
    return this.http.put(this.apiBaseURI + `/${fileId}/pull`, body);
  }

  getTemplateById(id) {
    return this.http.get( this.apiBaseURI4 + `/template/getById?templateId=${id}`
    );
  }

  getSpeakerNote(fileId) {
    return this.http.get( this.apiBaseURI2 + ApiConfig.files.speakerNote + `?fileId=${fileId}`, { responseType: 'blob' }).pipe(
      map((res) => {
        return res;
      }));
  }

  fileClosure(fileId, userId) {
    return this.http.get(this.apiBaseURI2 + ApiConfig.files.fileClosure + `?fileId=${fileId}&userId=${userId}`);
  }

  getPendingFileClosure(sessionId, assemblyId, type, userId) {
    let tempSessionId;
    let tempAssesmblyId;
    if (sessionId === null) {
      tempSessionId = '';
    } else {
      tempSessionId = sessionId;
    }
    if (assemblyId === null) {
      tempAssesmblyId = '';
    } else {
      tempAssesmblyId = assemblyId;
    }
    // tslint:disable-next-line:max-line-length
    return this.http.get(this.apiBaseURI + `/fileClosure/pending?sessionId=${tempSessionId}&assemblyId=${tempAssesmblyId}&type=${type}&userId=${userId}`);
  }

  forwardFileClosure(body, id) {
    return this.http.put(this.apiBaseURI + `/fileClosure/${id}/forward`, body).pipe(
      map((res) => {
        return res;
      })
    );
  }

  approveClosure(body, id) {
    return this.http.put(
      this.apiBaseURI + `/fileClosure/${id}/closure`,
      body
    );
  }

  getPdfList(fileId) {
    return this.http.get(
      this.apiBaseURI2 + `/file/getListPdf?fileId=${fileId}`, { responseType: 'blob' }).pipe(
        map((res) => {
          return res;
        }));
  }
}
