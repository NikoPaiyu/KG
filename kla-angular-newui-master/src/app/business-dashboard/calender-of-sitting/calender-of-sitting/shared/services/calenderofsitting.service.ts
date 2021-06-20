import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { AssemblyList, SessionList } from "../models/cobmodel";
@Injectable({
  providedIn: "root"
})
export class CalenderofsittingService {
  constructor(private http: HttpClient) { }
  creatCos(data) {
    return this.http
      .post(
        `${environment.calendar_api_url}/create/item`, data
      )
      .pipe(
        map(res => {
          return res;
        })
      );
  }


  getCobListFile(fileId) {



    return this.http
      .get(`${environment.calendar_api_url}/file/getByFileId?fileId=${fileId}`)
      .pipe(
        map(res => { 
          return res;
        })
      );

  }
  updateCos(data) {
    return this.http
      .put(
        `${environment.calendar_api_url}/create/item`, data
      )

      .pipe(
        map(res => {
          return res;
        })
      );
  }
  getCobList(AssemblyID, SessionId) {
    return this.http
      .get(
        `${environment.calendar_api_url}/get/item?assemblyId=${AssemblyID}&sessionId=${SessionId}`
      )
      .pipe(
        map(res => {
          return res;
        })
      );
  }
  getSessionByDate(SessionId, Date) {
    return this.http
      .get(`${environment.calendar_api_url}/get/${SessionId}/${Date}`)
      .pipe(
        map(res => {
          return res;
        })
      );
  }
  deleteCosPerticularGroup(calenderGroupId, assemblyId, SessionID) {
    return this.http
      .delete(
        `${environment.calendar_api_url}/delete/item/${calenderGroupId}?assemblyId=${assemblyId}&sessionId=${SessionID}`
      )
      .pipe(
        map(res => {
          return res;
        })
      );
  }
  getAllAssembly() {
    return this.http
      .get<AssemblyList>(`${environment.calendar_api_url}/mock/getAllAssembly`)
      .pipe(
        map(res => {
          return res;
        })
      );
  }
  getAllSession() {
    return this.http
      .get<SessionList>(`${environment.calendar_api_url}/mock/getAllSession`)
      .pipe(
        map(res => {
          return res;
        })
      );
  }
  getBusinessgroup() {
    return this.http
      .get<SessionList>(`${environment.calendar_api_url}/get/lobBusinessGroup`)
      .pipe(
        map(res => {
          return res;
        })
      );
  }
  getFileById(fileId) {
    const url = environment.calendar_api_url + `file/getByFileId?fileId=${fileId}`;
    return this.http.get<any>(url);
  }
  createfileflow(fileflowdata) {
    return this.http
      .post(
        `${environment.calendar_api_url}/file/createFile`, fileflowdata
      )
      .pipe(
        map(res => {
          return res;
        })
      );
  }
  approveFile(body = {}) {
    const url = environment.calendar_api_url + `file/approve`;
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
  getPendingFile(assemblyId, sessionId, userId) {
    const url = environment.file_flow_api + `pending?assemblyId=${assemblyId}&sessionId=${sessionId}&userId=${userId}`;
    return this.http.get(url);
  }
  // get bac pending notices
  getPendingBacNotices() {
    const url = environment.calendar_api_url + `bac/pending`;
    return this.http.get<any>(url);
  }
  // set lob date for bac notices
  setToLob(body = {}) {
    const url = environment.calendar_api_url + `bac/addToLob`;
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
    const url = environment.calendar_api_url + `getAllMemberAuthorisedNotice`;
    return this.http.get<any>(url);
  }
  getList(AssemblyID, SessionID, UserID, Type) {
    const url = environment.file_flow_api + `pending/type?assemblyId=${AssemblyID}&sessionId=${SessionID}&userId=${UserID}&type=${Type}`;
    return this.http.get(url);
  }
}
