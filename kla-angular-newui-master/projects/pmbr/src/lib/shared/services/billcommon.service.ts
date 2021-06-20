import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConfig } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class BillcommonService {
  apiBaseURI: string;
  portfolioURI: string;
  departmentURI: string;
  apiCommitteeURI: string
  environment: any;
  rbsJson = {
    modules: {}
  };
  constructor(@Inject("environment") environment, private http: HttpClient, @Inject('authService') private AuthService) {
    this.environment = environment;
    this.apiBaseURI = this.environment.bill_api_url + ApiConfig.billBasePathExt;
    this.portfolioURI = this.environment.portfolio_mock_api_url + ApiConfig.portfolio;
    this.departmentURI = this.environment.portfolio_mock_api_url + ApiConfig.department;
    this.apiCommitteeURI = this.environment.bill_api_url + ApiConfig.basePathCommittee;
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
      console.log(permission);
    }
  }
  doIHaveAnAccess(pCategory, permission) {
    let permObj;
    // tslint:disable-next-line:no-string-literal
    permObj = this.rbsJson['PMBR'];
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
  getDepartmentsByportfolioId(portfolioId) {
    return this.http.get(this.departmentURI + `/getDepartmentsByPortfolioId?portfolioId=${portfolioId}`);
  }
  getSubjectByDepartmentId(deptId) {
    return this.http.get(this.departmentURI + `/getAllSubjectByDepartmentId?departmentId=${deptId}`);
  }

  getCurrentAssemblyAndSession() {
    return this.http.get(`${this.environment.calendar_api_url}/getActiveSession`);
  }
  getCommitteeMeetingReportPreview(reportId) {
    return this.http.get(`${this.apiCommitteeURI}/meeting/report/${reportId}`);
  }
}
