import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/Rx';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private assemblyId = new BehaviorSubject(1);
  sharedAssemblyId = this.assemblyId.asObservable();
  private sessionId = new BehaviorSubject(3);
  sharedSessionId = this.sessionId.asObservable();
  rbsJson = {
    modules: {}
  };
  environment: any;

  constructor(@Inject('environment') environment, private http: HttpClient) {
    this.environment = environment;
  }
  newAssemblyId(id) {
    this.assemblyId.next(id);
  }

  newSessionId(id) {
    this.sessionId.next(id);
  }

  // get all assembly and session
  getAllAssemblyandSession() {
    return this.http.get(`${this.environment.calendar_api_url}/getAllAssemblyAndSession`);
  }

  getPermissions(permission) {
    if (permission) {
      this.rbsJson = permission;
    }
  }

  doIHaveAnAccess(pCategory, permission) {
    let permObj;
    // tslint:disable-next-line:no-string-literal
    permObj = this.rbsJson['CPL_PROCESSING'];
    if (permObj) {
      if (permObj.categorys) {
        const permCategorys = permObj.categorys;
        if(permCategorys[pCategory]){
         const permCat = permCategorys[pCategory];
         return permCat.includes(permission);
        }
      }
    }
    return false;
  }
  doIHaveAnAccessToOfficePermissions(pCategory, permission) {
    let permObj;
    // tslint:disable-next-line:no-string-literal
    permObj = this.rbsJson['OFFICE_MANAGEMENT'];
    if (permObj) {
      if (permObj.categorys) {
        const permCategorys = permObj.categorys;
        if(permCategorys[pCategory]){
         const permCat = permCategorys[pCategory];
         return permCat.includes(permission);
        }
      }
    }
    return false;
  }

  doIHaveAnAccessToTablePermissions(pCategory, permission) {
    let permObj;
    // tslint:disable-next-line:no-string-literal
    permObj = this.rbsJson['TABLE'];
    if (permObj) {
      if (permObj.categorys) {
        const permCategorys = permObj.categorys;
        if(permCategorys[pCategory]){
         const permCat = permCategorys[pCategory];
         return permCat.includes(permission);
        }
      }
    }
    return false;
  }

  getNonMembers() {
    const url = this.environment.user_mgmnt_api_url + '/v1/users/getBasedOnUserType/NON_MEMBER';
    return this.http.get(url);
  }

  getSectionId() {
    return this.environment.cpl_section_id;
  }

  getKlaSections() {
    return this.http
      .get(`${this.environment.departmentmangement_api_url}/getsection`)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  getCurrentAssemblyAndSession() {
    return this.http.get(`${this.environment.calendar_api_url}/getActiveSession`);
  }

  getAssisstantList(body) {
    return this.http.post(`${this.environment.user_mgmnt_api_url}/rbs/getUsersWithSectionRoles`, body);
  }
  getAssistants(body){
    return this.http.post(`${this.environment.user_mgmnt_api_url}/v1/users/member/getNonMembers`, body);
  }
  getSubjectById(id) {
    return this.http.get(this.environment.portfolio_mock_api_url + `/mock/subject/getDepartmentById?departmentId=${id}`);
  }

}
