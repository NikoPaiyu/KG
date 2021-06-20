import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConfig } from '../config/api.config';
import { map } from "rxjs/operators";
import { AssemblyList, SessionList } from '../models/tablemodel';
@Injectable({
  providedIn: 'root'
})
export class TablescommonService {
  apiBaseURI: string;
  apiCommitteeURI: string
  reportApiUrl: string;
  environment: any;
  apiBaseURICorrespondence;
  rbsJson = {
    modules: {}
  };
  constructor(@Inject("environment") environment, private http: HttpClient, @Inject('authService') private AuthService) {
    this.environment = environment;
    this.apiBaseURI = this.environment.table_api_url + ApiConfig.basePathExt;
    this.apiBaseURICorrespondence =
      this.environment.cpl_api_url + ApiConfig.basePathCorrespondence;
    this.reportApiUrl = this.environment.report_api_url;
  }

  getCurrentAssemblyAndSession() {
    return this.http.get(`${this.environment.calendar_api_url}/getActiveSession`);
  }
  getAllAssembly() {
    return this.http.get<any>(
      `${this.environment.calendar_api_url}/mock/getAllAssembly`
    );
  }

  getAllSession() {
    return this.http.get<any>(
      `${this.environment.calendar_api_url}/mock/getAllSession`
    );
  }
  getAllAssemblyandSession() {
    const url = this.environment.calendar_api_url + '/getAllAssemblyAndSession';
    return this.http.get<AssemblyList>(url);
  }

  uploadUrl() {
    return this.environment.table_api_url +  ApiConfig.uploadFile;
  }
  uploadFile(file) {
    const formData = new FormData();
    formData.append("file", file);
    // formData.append("assemblyId", body.assemblyId);
    // formData.append("sessionId", body.sessionId);
    // formData.append("business", body.business);
    return this.http.post(
      this.environment.table_api_url +  ApiConfig.uploadFile,
      formData
    );
  }
  uploadDocument() {
    return (this.environment.table_api_url + ApiConfig.uploadFile);
  }

  getAllCode(type) {
    return this.http.get(
      this.apiBaseURICorrespondence +
      ApiConfig.currespondenceTemplate.getAllCode +
      `?type=${type}`
    );
  }
  getCorrespondenceById(id, code) {
    return this.http.get(
      this.apiBaseURICorrespondence + `/${id}?code=${code}`
    );
  }
  // RBS  functions
  setTablePermissions(permission) {
    if (permission) {
      this.rbsJson = permission;
    }
  }
  doIHaveAnAccess(pCategory, permission) {
    let permObj;
    // tslint:disable-next-line:no-string-literal
    permObj = this.rbsJson['TABLE'];
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

  doIHaveAnAccessWithCategory(pCategory, permission, category) {
    let permObj;
    // tslint:disable-next-line:no-string-literal
    permObj = this.rbsJson[category];
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
  getMappingList() {
    return this.http
      .get(`${this.environment.seat_plan_url}/allocation`)
      .pipe(
        map(res => {
          return res;
        })
      );
  }
  getAllocationById(allocationId) {
    return this.http
      .get(`${this.environment.seat_plan_url}/allocation/getByAllocationId?allocationId=${allocationId}`)
      .pipe(
        map(res => {
          return res;
        })
      );
  }
  getAllMembersList() {
    const url = this.environment.user_mgmnt_api_url + `/v1/users/member/getAll`;
    return this.http
      .get(url);
  }
  getMemberByPpo(userId) {
    const url = `${this.environment.user_mgmnt_api_url}/v1/users/member/getAllMemberForAParty?userId=${userId}`;
    return this.http.get(url);
  }
  getDates(assembly, session) {
    return this.http.get(
      `${this.environment.calendar_api_url}/get/allCalenderDates?assemblyId=${assembly}&sessionId=${session}`
    );
  }
  createSeatAllocation(body) {
    return this.http
      .post(`${this.environment.seat_plan_url}/allocation/createSeatAllocation`, body)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  getCOSId(assemblyId, sessionId) {
    return this.http.get(`${this.environment.calendar_api_url}/get/item?assemblyId=${assemblyId}&sessionId=${sessionId}&status=APPROVED`);
  }

  getCosById(cosId) {
    const url = `${this.environment.calendar_api_url}/get/byId?calendarofSittingId=${cosId}`;
    return this.http.get<any>(url);
  }
  downloadReport(htmlContent) {
    const body = {
      htmlString: htmlContent
    }
    const url = this.reportApiUrl + `/string-to-pdf`;
    return this.http.post(url, body, { responseType: 'blob' }).pipe(
      map((res) => {
        return res;
      })
    );
  }

  getCOSById(id) {
    return this.http.get(
      `${this.environment.calendar_api_url}/get/byId?calendarofSittingId=${id}`
    );
  }

}
