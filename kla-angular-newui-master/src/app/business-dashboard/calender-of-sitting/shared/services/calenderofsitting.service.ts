import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AssemblyList, SessionList } from '../models/cobmodel';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalenderofsittingService {
  months = [
    'ജനുവരി',
  'ഫെബ്രുവരി',
  'മാർച്ച്' ,
  'ഏപ്രിൽ' ,
  'മെയ്' ,
  'ജൂൺ' ,
  'ജൂലൈ' ,
  'ഓഗസ്റ്റ്' ,
  'സെപ്റ്റംബർ' ,
  'ഒക്ടോബർ' ,
  'നവംബർ' ,
  'ഡിസംബർ'];
  days = [
    'ഞായർ',
    'തിങ്കൾ',
    'ചൊവ്വ' ,
    'ബുധൻ' ,
    'വ്യാഴം' ,
    'വെള്ളി' ,
    'ശനി'
  ];
  constructor(private http: HttpClient) { }
  rbsJson = {
    modules: {}
  };
  getBusinessByDate(currentDate: any, assemblyId, sessionId) {
    const url = `${environment.calendar_api_url}/get/itemByDate?cosDate=${currentDate}&assemblyId=${assemblyId}&sessionId=${sessionId}`;
    return this.http.get(url);
  }

  creatCos(data) {
    const url = `${environment.calendar_api_url}/create/item`;
    return this.http.post(url, data);
  }

  getFileById(fileId, userId) {
    const url = environment.calendar_api_url + `/file/getByFileId/?fileId=${fileId}&userId=${userId}`;
    return this.http.get<any>(url);
  }
  getCobListFile(id) {
    const url = `${environment.calendar_api_url}file/getByFileId?fileId=${id}`;
    return this.http.get(url);
  }
  updateCos(data) {
    const url = `${environment.calendar_api_url}/edit/item`;
    return this.http.put(url, data);
  }
  getCobList(AssemblyID, SessionId,) {
    const url = `${environment.calendar_api_url}/get/sittings?assemblyId=${AssemblyID}&sessionId=${SessionId}`;
    return this.http.get(url);
  }
  getCodlist(AssemblyId, SessionId, status) {
    const url = `${environment.calendar_api_url}/get/sittings/byStatus?assemblyId=${AssemblyId}&sessionId=${SessionId}&status=${status}`;
    return this.http.get(url);
  }

  getSessionByDate(SessionId, Date) {
    const url = `${environment.calendar_api_url}/get/${SessionId}/${Date}`;
    return this.http.get(url);
  }
  deleteCosPerticularGroup(calenderGroupId, assemblyId, SessionID) {
    const url = `${environment.calendar_api_url}/delete/item/${calenderGroupId}?assemblyId=${assemblyId}&sessionId=${SessionID}`;
    return this.http.delete(url);
  }
  getAllAssembly() {
    const url = `${environment.calendar_api_url}/mock/getAllAssembly`;
    return this.http.get<any>(url);
  }
  getAllSession() {
    const url = `${environment.calendar_api_url}/mock/getAllSession`;
    return this.http.get<any>(url);
  }
  getActiveAssemblySession(){
    const url = `${environment.calendar_api_url}/getActiveSession`;
    return this.http.get<any>(url);
 
  }
  getBusinessgroup() {
    const url = `${environment.calendar_api_url}/get/lobBusinessGroup`;
    return this.http.get<SessionList>(url);
  }
  getCosById(cosId) {
    const url = `${environment.calendar_api_url}/get/byId?calendarofSittingId=${cosId}`;
    return this.http.get<any>(url);
  }

  createfileflow(fileflowdata) {
    const url = `${environment.calendar_api_url}/file/createFile`;
    return this.http.post<any>(url, fileflowdata);
  }

  approveFile(body = {}) {
    const url = `${environment.calendar_api_url}/file/approve`;
    return this.http.put(url, body);
  }
  // get approved cos
  getApprovedCos(assemblyId, sessionId, status) {
    const url = `${environment.calendar_api_url}/get/item?assemblyId=${assemblyId}&sessionId=${sessionId}&status=${status}`;
    return this.http.get(url);
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
  updateFile(fileId, body) {
    const url = environment.file_flow_api + `${fileId}`;
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
    const url = environment.file_flow_api + `${reqBody.fileId}/notes/byId`;
    return this.http.request('DELETE', url, { body: reqBody });
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

  getCosList(userId, assemblyId, sessionId) {
    const url = environment.file_flow_api + `pending?userId=${userId}&sessionId=${sessionId}&assemblyId=${assemblyId}`;
    console.log(url);
    return this.http.get(url);
  }
  

  getCOSPermissions(userId): Observable<boolean> {
    const check = new Subject<boolean>();
    if (userId) {
      const url = environment.user_mgmnt_api_url + `/rbs/getUserRoleDetails?userId=${userId}`;
      this.http.get(url).subscribe(Response => {
        this.rbsJson = Response as any;
        check.next(true);
      });
    }
    return check.asObservable();
  }

  // check for permission
  doIHaveAnAccess(pCategory, permission) {
    let permObj;
    permObj = this.rbsJson.modules['CALENDAR_OF_SITTING'];
    if (permObj) {
      if (permObj.categorys) {
        const permCategorys = permObj.categorys;
        if (permCategorys[pCategory]) {
          const permCat = permCategorys[pCategory];
          return permCat.includes(permission);
        }
      }
    }
    return false;
  }
  getList(AssemblyID, SessionID, Type) {
    const url = `${environment.file_flow_api}getAllByType?assemblyId=${AssemblyID}&sessionId=${SessionID}&type=${Type}`;
    return this.http.get(url);
  }
  getAllFiles(assemblyId, sessionId, userId) {
    const url = environment.file_flow_api + `pending/type?assemblyId=${assemblyId}&sessionId=${sessionId}&userId=${userId}&type=COS`;
    return this.http.get(url);
  }
  deleteBusinessById(id) {
    const url = environment.calendar_api_url + `/delete/days?calenderOfDaysId=${id}`;
    return this.http.delete(url);
  }
  getWorkFlowRole(workflowId, fileId) {
    const url =
      environment.file_flow_api +
      `getWorkflowActionUsers?workflowId=${workflowId}&fileId=${fileId}`;
    return this.http.get<any>(url);
  }
  pullFile(body, fileId) {
    return this.http.put(environment.file_flow_api + `/${fileId}/pull`, body);
  }
   // sent cos report to members/ppo
  sendTOMembers(body) {
    return this.http.put(environment.calendar_api_url + `/publish?calendarofSittingId=${body.calendarofSittingId}`, body.calendarofSittingId);
  }
  getCosReportPermission(AssemblyID, SessionId) {
    const url = `${environment.calendar_api_url}/get/sittings/published?assemblyId=${AssemblyID}&sessionId=${SessionId}`;
    return this.http.get(url);  
  }
  // get malayalam date
  getMalayalamDate(date) {
     date = new Date(date);
     const dayNumber = date.getDay();
     const month = date.getMonth();
     return `${this.months[month]} ${date.getDate()}, ${this.days[dayNumber]}`;
  }
  // get malayalam month
  getMalayalamMonth(date) {
    date = new Date(date);
    const month = date.getMonth();
    return `${this.months[month]} ${date.getFullYear()}`;
  }
  // show malayalam business
  ShowMalyalamBusiness(item) {
    if (item && item.lobBusinessGroupId === 3) {
      return item.descriptionMal;
    }
    return item.lobBusinessDescriptionMal;
  }
  getAssemblySessionDetails() {
    const url = environment.calendar_api_url + '/getAllAssemblyAndSession';
    return this.http.get<AssemblyList>(url);
  }
}



