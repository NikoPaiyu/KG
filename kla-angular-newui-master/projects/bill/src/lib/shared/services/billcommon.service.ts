import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConfig } from '../config/api.config';
import { map } from "rxjs/operators";
@Injectable({
  providedIn: 'root'
})
export class BillcommonService {
  apiBaseURI: string;
  portfolioURI: string;
  departmentURI:string;
  apiCommitteeURI :string
  reportApiUrl:string;
  environment: any;
  rbsJson = {
    modules: {}
  };
  constructor(@Inject("environment") environment, private http: HttpClient, @Inject('authService') private AuthService) {
    this.environment = environment;
    this.apiBaseURI = this.environment.bill_api_url + ApiConfig.basePathExt;
    this.portfolioURI = this.environment.portfolio_mock_api_url + ApiConfig.portfolio;
    this.departmentURI = this.environment.portfolio_mock_api_url + ApiConfig.department;
    this.apiCommitteeURI = this.environment.committee_api_url + ApiConfig.basePathCommittee;
    this.reportApiUrl = this.environment.report_api_url;
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

  getBillTypes() {
    return this.http.get(this.apiBaseURI + `/type`);
  }

  getBillReferences() {
    return this.http.get(``);
  }

  getBillLanguages() {
    return this.http.get(``);
  }
  getDepartments(portfolioId) {
    return this.http.get(this.portfolioURI + `/getSubjects/${portfolioId}`);
  }
  getMinisters() {
    return this.http.get(this.portfolioURI + "/getAllWithMinisterName");
  }
  uploadUrl() {
    return "http://45.249.111.246" + ApiConfig.uploadFile;
  }
  createBill(body) {
    return this.http.post(this.apiBaseURI, body);
  }
  getBillById(billId) {
    if (billId) {
      return this.http.get(this.apiBaseURI + `/${billId}`);
    }
  }
  // RBS  functions

  setBillPermissions(permission) {
    // if (userId) {
    //   const url = this.environment.user_mgmnt_api_url + `/rbs/getUserRoleDetails?userId=${userId}`;
    //   this.http.get(url).subscribe(Response => {
    //     this.rbsJson = Response as any;
    //     console.log(this.rbsJson);
    //   });
    // }
    if (permission) {
      this.rbsJson = permission;
    }
  }
  doIHaveAnAccess(pCategory, permission) {
    let permObj;
    // tslint:disable-next-line:no-string-literal
    permObj = this.rbsJson['BILL_PROCESSING'];
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
  getAssisstantList(body) {
    return this.http.post(`${this.environment.user_mgmnt_api_url}/rbs/getUsersWithSectionRoles`, body);
  }

  isMLA() {
    return this.AuthService.getCurrentUser().authorities.includes('MLA');
  }

  isPPO() {
    return this.AuthService.getCurrentUser().authorities.includes("ppo") || this.AuthService.getCurrentUser().authorities.includes("parliamentaryPartySecretary");
  }
  getDepartmentsByportfolioId(portfolioId){
    return this.http.get(this.departmentURI + `/getDepartmentsByPortfolioId?portfolioId=${portfolioId}`);
  }
  getSubjectByDepartmentId(deptId){
    return this.http.get(this.departmentURI + `/getAllSubjectByDepartmentId?departmentId=${deptId}`);
  }

  getCurrentAssemblyAndSession() {
    return this.http.get(`${this.environment.calendar_api_url}/getActiveSession`);
  }
  getCommitteeMeetingReportPreview(reportId){
    return this.http.get(`${this.apiCommitteeURI}/meeting/report/${reportId}`);
  }
  downloadReport(htmlContent){
    const url = this.reportApiUrl + `/string-to-pdf`;
    return this.http.post(url, htmlContent, { responseType: "blob" }).pipe(
      map((res) => {
        return res;
      })
    );
  }
  getCategoryBySectionId(sectionId){
    const url = this.apiCommitteeURI +`/category/section/${sectionId}`;
        return this.http.get(url);
  }
  createCommitteeFile(body) {
    return this.http.post(this.apiCommitteeURI, body);
  }
  getAllActreferences() {
    const url = this.apiBaseURI + '/act/getAllActs';
    return this.http.get(url);
  }
  uploadStatementOnRule(body) {
    const url = this.apiBaseURI + '/uploadStatementOnRule';
    return this.http.post(url, body);
  }

  getAllAssemblyAndSession() {
    return this.http.get<any>(
      `${this.environment.calendar_api_url}/getAllAssemblyAndSession`
    );
  }
}
