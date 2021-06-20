import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { ApiConfig } from "../config/api.config";

@Injectable({
  providedIn: "root",
})
export class GenericfileService {
  environment: any;
  apiBaseURI3: string;
  apiBaseURI4: string;
  apiBaseURI5: string;
  constructor(@Inject("environment") environment, private http: HttpClient) {
    this.environment = environment;
    this.apiBaseURI3 = this.environment.file_api + ApiConfig.basePathFile;
    this.apiBaseURI4 = this.environment.file_api + ApiConfig.basePathWrkflow;
    this.apiBaseURI5 =
      this.environment.generic_file_host + ApiConfig.basedocUpload;
  }

  // getPendingFiles(userId, assembly, session, type) {
  //   if (assembly === null && session === null) {
  //     return this.http.get(
  //       this.apiBaseURI3 +
  //         `/pending/type?userId=${userId}&assemblyId=&sessionId=&type=${type}`
  //     );
  //   } else {
  //     return this.http.get(
  //       this.apiBaseURI3 +
  //         `/pending/type?userId=${userId}&assemblyId=${assembly}&sessionId=${session}&type=${type}`
  //     );
  //   }
  // }
  getPendingFiles(body) {
    return this.http.post(this.apiBaseURI3 + ApiConfig.file.pendingFiles, body);
  }
  approvedByHigherOfficial(body) {
    // return this.http.get(this.apiBaseURI3 + `/all/ownerId?userId=${userId}`);
    return this.http.post(this.apiBaseURI3 + ApiConfig.file.myFiles, body);
  }
  getAllFiles(body) {
    // return this.http.post(this.apiBaseURI3 + ApiConfig.file.getAll, body);
    return this.http.post(this.apiBaseURI3 + ApiConfig.file.allFiles, body);
  }
  createFile(body) {
    return this.http.post(this.apiBaseURI3 + ApiConfig.file.createFile, body);
  }
  forwardFile(fileId, body) {
    const url = this.apiBaseURI3 + `/${fileId}` + ApiConfig.file.forwardFile;
    return this.http.put(url, body);
  }
  approveFile(fileId, body) {
    const url =
      this.apiBaseURI3 +
      ApiConfig.file.approveFile.type +
      `/${fileId}` +
      ApiConfig.file.approveFile.action;
    return this.http.put(url, body);
  }
  getGenericFileById(genericFIleId) {
    if (genericFIleId) {
      return this.http.get(
        this.apiBaseURI3 + ApiConfig.file.viewById + `${genericFIleId}`
      );
    }
  }
  createNote(body) {
    const url = this.apiBaseURI3 + `/${body.fileId}` + ApiConfig.note.create;
    return this.http.post(url, body);
  }
  updateNote(body) {
    const url = this.apiBaseURI3 + `/${body.fileId}` + ApiConfig.note.update;
    return this.http.put(url, body);
  }
  deleteNoteById(reqBody) {
    return this.http.request(
      "DELETE",
      this.apiBaseURI3 + `/${reqBody.fileId}` + ApiConfig.note.delete,
      { body: reqBody }
    );
  }
  checkWorkFlowStatus(workFlowId) {
    const url = this.apiBaseURI4 + ApiConfig.workFlow.workFlowById + workFlowId;
    return this.http.get<any>(url);
  }
  createBlock(reqBody) {
    const url = this.apiBaseURI3 + ApiConfig.file.block.create;
    return this.http.post(url, reqBody);
  }
  deleteBlock(fileId, blockId) {
    const url =
      this.apiBaseURI3 +
      ApiConfig.file.block.delete +
      fileId +
      `/block/${blockId}`;
    return this.http.delete(url);
  }
  createDocument(reqBody) {
    const url = this.apiBaseURI3 + ApiConfig.file.block.document.create;
    return this.http.post(url, reqBody);
  }
  shareDocument(reqBody) {
    const url = this.apiBaseURI3 + ApiConfig.file.block.document.share;
    return this.http.post(url, reqBody);
  }
  getAllFileBlockByFIleId(fileId) {
    const url = this.apiBaseURI3 + ApiConfig.file.block.list + fileId;
    return this.http.get(url);
  }
  updateFile(fileId, body) {
    return this.http.put(
      this.apiBaseURI3 + ApiConfig.file.updateFile + `/${fileId}`,
      body
    );
  }
  attachmentFileUpload(file) {
    const formData = new FormData();
    formData.append("file", file);
    const url = this.apiBaseURI5 + ApiConfig.file.upload;

    return this.http.post(url, formData);
  }

  deleteAttachment(id, fileId) {
    const url =
      this.apiBaseURI3 +
      ApiConfig.file.block.document.create +
      `/${id}/file/${fileId}`;
    return this.http.delete(url);
  }

  partiallyApproveFile(fileId, body) {
    const url =
      this.apiBaseURI3 +
      ApiConfig.file.approveFile.type +
      `/${fileId}` +
      ApiConfig.file.approveFile.partialApprove;
    return this.http.put(url, body);
  }

  getAllMasterFiles(body) {
    return this.http.post(this.apiBaseURI3 + ApiConfig.file.getAll, body);
  }
  getAllSharedDocuments() {
    const url = this.apiBaseURI3 + ApiConfig.file.block.document.sharedWithMe;
    return this.http.get(url);
  }
  getAllSubTypes(type) {
    const url = this.apiBaseURI3 + ApiConfig.file.block.document.subType + type;
    return this.http.get(url);
  }
}
