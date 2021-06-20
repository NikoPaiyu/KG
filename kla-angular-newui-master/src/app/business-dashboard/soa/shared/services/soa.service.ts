import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AssemblyList, SessionList } from 'src/app/business-dashboard/calender-of-sitting/shared/models/cobmodel';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SoaService {
  rbsJson;
  constructor(private http: HttpClient) { }


  // soa refresh
  refreshSoa(assemblyId, sessionId) {
    const url = environment.aod_api_url + `soa/refresh?assemblyId=${assemblyId}&sessionId=${sessionId}`;
    return this.http.get<any>(url);
  }
  // save soa data
  saveSoa(body) {
    const url = environment.aod_api_url + 'soa';
    return this.http.post<any>(url, body);
  }
  // get soa data
  getSoaData(assemblyId, sessionId, userId) {
    const url = environment.aod_api_url + `soa/getForSession?assemblyId=${assemblyId}&sessionId=${sessionId}&userId=${userId}`;
    return this.http.get<any>(url);
  }
  // get soa pending data
  getPendingSoaData(assemblyId, sessionId, userId) {
    const url = environment.aod_api_url + `soa/getPendingSoaForSession?assemblyId=${assemblyId}&sessionId=${sessionId}&userId=${userId}`;
    return this.http.get<any>(url);
  }
  // get soa data by id
  getSoaDataById(soaId, userId) {
    const url = environment.aod_api_url + `soa/getById?id=${soaId}&userId=${userId}`;
    return this.http.get<any>(url);
  }
  // approve soa
  approveSoa(soaId) {
    const url = environment.aod_api_url + `soa/approve?soaId=${soaId}`;
    return this.http.put(url, {});
  }
  // submit soa
  submitSoa(soaId) {
    const url = environment.aod_api_url + `soa/submit?soaId=${soaId}`;
    return this.http.put(url, {});
  }
  getAllAssembly() {
    const url = `${environment.calendar_api_url}/mock/getAllAssembly`;
    return this.http.get<AssemblyList[]>(url);
  }
  getAllSession() {
    const url = `${environment.calendar_api_url}/mock/getAllSession`;
    return this.http.get<SessionList[]>(url);
  }
  getallrules() {
    const url = environment.notice_processing_api + `rule/getAll`;
    return this.http.get<any>(url);
  }
  // get permission details
  // getAODPermissions(userId) {
  //   if (userId) {
  //     const url = environment.user_mgmnt_api_url + `/rbs/getUserRoleDetails?userId=${userId}`;
  //     this.http.get(url).subscribe(Response => {
  //       this.rbsJson = Response as any;
  //       console.log(this.rbsJson);
  //     });
  //   }
  // }
  getQuestionPermissions(userId) {
    if (userId) {
     this.http.get(environment.rbs_api_url + `getUserRoleDetails?userId=${userId}`).subscribe(res => {
          this.rbsJson = res;
        }
     );
    }
  }
  // check for permission
  doIHaveAnAccess(pCategory, permission) {
    let permObj;
    if (this.rbsJson) {
    permObj = this.rbsJson.modules.SCHEDULE_OF_ACTIVITY;
    if (permObj) {
      if (permObj.categorys) {
        const permCategorys = permObj.categorys;
        if (permCategorys[pCategory]) {
          const permCat = permCategorys[pCategory];
          return permCat.includes(permission);
        }
      }
    }
  }
    return false;
  }
  getlist(userId) {
    const url = environment.aod_api_url + `soa/get/pending?userId=${userId}`;
    return this.http.get(url);
  }
  forwardSoa(soaId, role) {
    const url = environment.aod_api_url + `soa/forward?soaId=${soaId}`;
    const body = {
        fromGroup: role
    };
    return this.http.put(url, body);
  }
  getSOAReportPermission(AssemblyID, SessionId) {
    const url = `${environment.aod_api_url}soa/get/published?assemblyId=${AssemblyID}&sessionId=${SessionId}`;
    return this.http.get(url);
  }
  getSoaNoteById(soaId) {
    const url = environment.aod_api_url + `soa/note/getAll/${soaId}`;
    return this.http.get(url);
  }
  addSoaNote(body, soaId) {
    const url = environment.aod_api_url + `soa/note/addNote?scheduleMasterId=${soaId}`;
    return this.http.post(url, body);
  }
  deleteNoteById(noteId) {
    const url = environment.aod_api_url + `soa/note/${noteId}`;
    return this.http.delete(url);
  }
}
