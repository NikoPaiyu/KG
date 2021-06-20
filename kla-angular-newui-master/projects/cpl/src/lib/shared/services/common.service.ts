import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from "rxjs/operators";
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

  // getCurrentUser() {
  //    return JSON.parse(sessionStorage.getItem('ls_currentuser'));
  // }

  newAssemblyId(id) {
    this.assemblyId.next(id);
  }

  newSessionId(id) {
    this.sessionId.next(id);
  }

  // getCPLPermissions(userId) {
  //   if (userId) {
  //     const url = this.environment.user_mgmnt_api_url + `/rbs/getUserRoleDetails?userId=${userId}`;
  //     this.http.get(url).subscribe(Response => {
  //       this.rbsJson = Response as any;
  //     });
  //   }
  // }

  getCPLPermissions(permission) {
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

  doIHaveCorrespondenceAccess(pCategory, permission) {
    let permObj;
    // tslint:disable-next-line:no-string-literal
    permObj = this.rbsJson['CORRESPONDENCE'];
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
 
  // getKlaDepartments() {
  //   return this.http
  //     .get(`${this.environment.departmentmangement_api_url}/getsection`)
  //     .map((res: any) => {
  //          return res;
  //     });
  // }
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

  getSubjectById(id) {
    return this.http.get(this.environment.portfolio_mock_api_url + `/mock/subject/getDepartmentById?departmentId=${id}`);
  }

}
