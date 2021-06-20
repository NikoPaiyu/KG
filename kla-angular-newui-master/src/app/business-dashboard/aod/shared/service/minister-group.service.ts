import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MinisterGroupService {
  rbsJson;
  constructor(private http: HttpClient) { }

  // get minister group details
  getPendingMinisterGroups(userId) {
    const url = environment.aod_api_url + `aod/group/fetchPendingMinisterGroups?userId=${userId}`;
    return this.http.get<any>(url);
  }
  // get approved group details
  getApprovedMinisterGroup() {
    const url = environment.aod_api_url + `aod/group/fetchActiveMinisterGroups`;
    return this.http.get<any>(url);
  }
  // save minister group
  saveMinisterGroup(body) {
    const url = environment.aod_api_url + 'aod/group';
    return this.http.post(url, body);
  }
  // forward minister group
  forwardMinisterGroup(ministerMasterId, body) {
    const url = environment.aod_api_url + `aod/group/forward?ministerMasterId=${ministerMasterId}`;
    return this.http.put<any>(url, body);
  }
  // approve minister group
  approveMinisterGroup(ministerMasterId, body) {
    const url = environment.aod_api_url + `aod/group/approve?ministerMasterId=${ministerMasterId}`;
    return this.http.put<any>(url, body);
  }
  // get minister group by id
  getMinisterGroupById(ministerMasterId) {
    const url = environment.aod_api_url + `aod/group/getById?ministerMasterId=${ministerMasterId}`;
    return this.http.get(url);
  }
  // get permission details
  getMgPermissions(userId) {
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
    if (this.rbsJson) {
      permObj = this.rbsJson.modules['MINISTER_GROUP'];
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
}
