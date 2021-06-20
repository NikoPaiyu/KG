import { Inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { ApiConfig } from "../config/api.config";
@Injectable({
  providedIn: "root",
})
export class GenericfilesCommonService {
  apiGenericFilesBaseURI: string;
  apiUserNonmemberURI: string;
  environment: any;
  rbsJson: any = null;
  constructor(
    @Inject("environment") environment,
    private http: HttpClient,
    @Inject("authService") private AuthService
  ) {
    this.environment = environment;
    this.apiUserNonmemberURI =
      this.environment.generic_file_api_url + ApiConfig.UserNonMember;
  }

  getAllAssembly() {
    return this.http.get<any>(
      this.environment.calendar_api_url + ApiConfig.klaInfo.assembly
    );
  }
  getAllSession() {
    return this.http.get<any>(
      this.environment.calendar_api_url + ApiConfig.klaInfo.session
    );
  }

  getAllAssemblyandSession() {
    return this.http.get(`${this.environment.calendar_api_url}/getAllAssemblyAndSession`);
  }
  
  getAllDepartments() {
    return this.http.get<any>(
      this.environment.generic_file_api_url + ApiConfig.klaInfo.departments
    );
  }
  getAllSections() {
    return this.http.get<any>(
      this.environment.departmentmangement_api_url + ApiConfig.klaInfo.sections
    );
  }
  getDesignation() {
    return this.http.get<any>(
      this.environment.departmentmangement_api_url +
        ApiConfig.klaInfo.designations
    );
  }
  getAllNonMemberUsers(data) {
    return this.http.post<any>(
      this.environment.generic_file_api_urlx + ApiConfig.klaInfo.nonmembers,
      data
    );
  }

  getCurrentAssemblySession() {
    return this.http.get(
      `${this.environment.calendar_api_url}/getActiveSession`
    );
  }

  getKlaSections() {
    return this.http.get(
      `${this.environment.departmentmangement_api_url}/getsection`
    );
  }

  getassignseat(sectionId) {
    return this.http.get(
      `${this.environment.seat_management_url}/section/seat/byId?sectionId=${sectionId}`
    );
  }

  setPermissions(permission) {
    if (permission) {
      this.rbsJson = permission;
    }
  }

  doIHaveAnAccess(pCategory, permission) {
    let permObj;
    // tslint:disable-next-line:no-string-literal
    permObj = this.rbsJson["GENERIC_FILES"];
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
  getTemplates() {
    return this.http.get(
      this.environment.generic_file_api_url + ApiConfig.template.templateList
    );
  }
  createTemplate(body) {
    return this.http.post<any>(
      this.environment.generic_file_api_url + ApiConfig.template.createTemplate,
      body
    );
  }
  stringToPDF(data) {
    let Url = this.environment.generic_file_host + ApiConfig.stringToPDF;
    return this.http.post(Url, data, { responseType: "blob" }).pipe(
      map((res) => {
        return res;
      })
    );
  }
  listAllTemplates() {
    return this.http.get(
      this.environment.generic_file_api_url +
        ApiConfig.baseTemplate +
        ApiConfig.template.list
    );
  }
}
