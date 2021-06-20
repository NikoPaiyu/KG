import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConfig } from '../config/api.config';
import { map } from "rxjs/operators";
import { AssemblyList, SessionList } from '../models/budgetmodel';

@Injectable({
  providedIn: 'root'
})
export class BudgetCommonService {
  apiBaseURI: string;
  apiCommitteeURI: string
  reportApiUrl: string;
  environment: any;
  apiBaseURICorrespondence;
  rbsJson = {
    modules: {}
  };
  apiBaseURIBill:string;
  constructor(@Inject("environment") environment, private http: HttpClient, @Inject('authService') private AuthService) {
    this.environment = environment;
    this.apiBaseURI = this.environment.budget_api_url + ApiConfig.basePathExt;
    this.apiBaseURICorrespondence =
      this.environment.cpl_api_url + ApiConfig.basePathCorrespondence;
    this.reportApiUrl = this.environment.report_api_url;
    this.apiBaseURIBill = this.environment.budget_api_url + ApiConfig.basePathBillFile;
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
  uploadUrl() {
    return "http://45.249.111.246" + ApiConfig.uploadFile;
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
  setBudgetPermissions(permission) {
    if (permission) {
      this.rbsJson = permission;
    }
  }
  doIHaveAnAccess(pCategory, permission) {
    let permObj;
    // tslint:disable-next-line:no-string-literal
    permObj = this.rbsJson['BUDGET'];
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
  getMemberByPpo(userId) {
    const url = `${this.environment.user_mgmnt_api_url}/v1/users/member/getAllMemberForAParty?userId=${userId}`;
    return this.http.get(url);
  }
  getDates(assembly, session) {
    return this.http.get(
      `${this.environment.calendar_api_url}/get/itemForQuestions?assemblyId=${assembly}&sessionId=${session}`
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
  validatePassword(id,type,password){
    const url = this.apiBaseURI +  ApiConfig.budegtdocument.validatePasswd +`?id=${id}&type=${type}&password=${password}`;
    return this.http.get<any>(url);
    }
  claimFile(pId, userId) {
    const url = this.apiBaseURI + ApiConfig.budegtdocument.claim + `?processInstanceId=${pId}&userId=${userId}`;
    return this.http.put<any>(url, pId, userId);
  }
  getApprovedAPBills(type){
    const url = this.apiBaseURIBill + `/apBill/listValues/approved?type=${type}`;
    return this.http
      .get(url)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }  
  getApprovedAppropriationBills(type){
    const url = this.apiBaseURI + ApiConfig.appropriation.getapprovedbills+`?type=${type}`;
    return this.http.get<any>(url);
  }  
  getAllWithMinisterName() {
    const url = this.environment.portfolio_mock_api_url  +`mock/portfolio/getAllWithMinisterName`;
    return this.http.get<any>(url);
  }
  getAllAssemblyAndSession() {
    const url = this.environment.calendar_api_url + '/getAllAssemblyAndSession';
    return this.http.get<AssemblyList>(url);
  }
}
