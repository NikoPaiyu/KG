import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root"
})

export class AodService {

  rbsJson = {
    modules: {}
  };

  flag: Boolean;
  constructor(private http: HttpClient) { }

  // get all dates
  getAllDates(AssemblyID: number, SessionID: number) {
    const url = environment.calendar_api_url + `/get/itemForQuestions?assemblyId=${AssemblyID}&sessionId=${SessionID}`;
    return this.http.get(url);
  }

  // get aod
  getAllaod(id) {
    const url = `${environment.calendar_api_url}get/itemForQuestions`;
    return this.http.get(url);
  }

  // get minister groups
  getAllMinisterGroups() {
    const url = `${environment.aod_api_url}minister-group/details`;
    return this.http.get(url);
  }

  // get minister group subjects
  getAllMinisterGroupSubjects(groupId) {
    const url = `${environment.portfolio_mock_api_url}mock/portfolio/${groupId}`;
    return this.http.get(url);
  }

  postAod(aodData) {
    return this.http.post(`${environment.aod_api_url}aod`, aodData);
  }
  // resubmit aod
  resubmitAod(body) {
    const url = `${environment.aod_api_url}aod/resubmit`;
    return this.http.post(url, body);
  }

  // get aod list
  getAODList(assemblyId, sessionId) {
    const url = `${environment.aod_api_url}aod?assemblyId=${assemblyId}&&sessionId=${sessionId}`;
    return this.http.get<any>(url);
  }
  getAodApprovedList(assemblyId,sessionId,status) {
    const url = `${environment.aod_api_url}aod/get/by/status?assemblyId=${assemblyId}&&sessionId=${sessionId}&&status=${status}`;
    return this.http.get<any>(url);
  }

  // create file flow
  createfileflow(data) {
    const url = `${environment.aod_api_url}file/createFile`;
    return this.http.post(url, data);
  }

  // get all ministers
  getAllministers() {
    const url = `${environment.portfolio_mock_api_url}/mock/portfolio/getAll `;
    return this.http.get<any>(url);
  }

  postministergroups(data) {
    const url = environment.aod_api_url + '/aod/group';
    return this.http.post(url, data);
  }

  // fetch minister group
  fetchAllAodMinisterGroups() {
    const url = `${environment.aod_api_url}aod/group/fetchAllAodMinisterGroups`;
    return this.http.get<any>(url);
  }

  // get all data
  getalldata() {
    const url = `${environment.portfolio_mock_api_url}/mock/portfolio/getAll `;
    return this.http.get(url);
  }

  // create refresh
  createrefresh(assemblyId, sessionId) {
    const url = `${environment.aod_api_url}aod/group/${assemblyId}/${sessionId}`;
    return this.http.get(url);
  }

  // refresh aod dates
  refreshAodDates(assemblyId, sessionId) {
    const url = `${environment.aod_api_url}aod/group/refreshAod?assemblyId=${assemblyId}&sessionId=${sessionId}`;
    return this.http.get(url);
  }

  // get aod list file
  getAodListFile(fileId, userId) {
    const url = `${environment.aod_api_url}file/getByFileId/?fileId=${fileId}&userId=${userId}`;
    return this.http.get(url);
  }

  // approve file
  approveFile(body = {}) {
    const url = environment.aod_api_url + `file/approve`;
    return this.http.put(url, body);
  }

  // disallow file
  disallowFile(fileId) {
    const url = environment.file_flow_api + `${fileId}/disallow`;
    return this.http.put(url, {});
  }

  // return file
  returnFile(fileId, body = {}) {
    const url = environment.file_flow_api + `${fileId}/return`;
    return this.http.put(url, body);
  }

  // forward file
  forwardFile(fileId, body = {}) {
    const url = environment.file_flow_api + `${fileId}/forward`;
    return this.http.put(url, body);
  }

  getList(AssemblyID, SessionID, Type) {
    const url = environment.file_flow_api + `getAllByType?assemblyId=${AssemblyID}&sessionId=${SessionID}&type=${Type}`;
    return this.http.get<any>(url);
  }
  getAllFiles(assemblyId, sessionId, userId ) {
    const url = environment.file_flow_api + `pending/type?assemblyId=${assemblyId}&sessionId=${sessionId}&userId=${userId}&type=AOD`;
    return this.http.get(url);
  }

  // get permission details
  getAODPermissions(userId) {
    if (userId) {
      const url = environment.user_mgmnt_api_url + `/rbs/getUserRoleDetails?userId=${userId}`;
      this.http.get(url).subscribe(Response => {
        this.rbsJson = Response as any;
      });
    }
  }

  // check for permission
  doIHaveAnAccess(pCategory, permission) {
    let permObj;
    permObj = this.rbsJson.modules['ALLOTMENT_OF_DAYS'];
    if (permObj) {
      if (permObj.categorys) {
        let permCategorys = permObj.categorys;
        if (permCategorys[pCategory]) {
          let permCat = permCategorys[pCategory];
          return permCat.includes(permission);
        }
      }
    }
    return false;
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
  // get all notes
  getAllNotes(fileId) {
    const url = environment.file_flow_api + `${fileId}/notes`;
    return this.http.get(url);
  }

  deleteNoteById(reqBody) {
    return this.http.request('DELETE', environment.file_flow_api + `${reqBody.fileId}/notes/byId`, {body: reqBody});
  }

  convertTONormal(body) {
    const url = environment.file_flow_api + `${body.fileId}/notes/temporary`;
    return this.http.put<any>(url, body);
  }

  getAllFileLogs(fileId) {
    const url = environment.file_flow_api + `${fileId}/logs`;
    return this.http.get(url);
  }
  checkWorkFlowStatus(workFlowId) {
    const url =
      environment.workflow_api +
      `/task/tracking?processInstanceId=${workFlowId}`;
    return this.http.get<any>(url);
  }
  getAllRules() {
    const url = environment.notice_processing_api + `rule/getAll`;
    return this.http.get<any>(url);
  }
   // sent cos report to members/ppo
  sendTOMembers(body) {
    return this.http.put(environment.aod_api_url + `aod/publish?allotmentId=${body.allotmentId}`, body.allotmentId);
  }
  getAODReportPermission(AssemblyID, SessionId) {
    const url = `${environment.aod_api_url}aod/get/published?assemblyId=${AssemblyID}&sessionId=${SessionId}`;
    return this.http.get(url);  }
  getDateShiftType(dateShiftType) {
      if (dateShiftType === 'SERIAL') {
        return 'Serially';
      } else {
        return 'from one date to another';
      }
  }
}



