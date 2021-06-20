import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { RbsRoles } from "../model/rbsroles";


@Injectable({
  providedIn: "root",
})
export class SpeakerRBSService {
  rbsJson: any;

  constructor(private http: HttpClient) { }

  getQuestionPermissions(userId) {
    if (userId) {
      return this.http
        .get(environment.rbs_api_url + `getUserRoleDetails?userId=${userId}`)
        .pipe(
          map((res) => {
            this.rbsJson = res;
            return res;
          })
        );
    }
  }

  getrbsrole(userId) {
    if (userId) {
      return this.http
        .get(environment.rbs_api_url + `getUserRoleNameDetails?userId=${userId}`)
        .map((res) => {
          this.rbsJson = res;
          return res;
        })

    }
  }
  mapChatData(users) {
    return users.map(user => {
      return this.mapUserchatData(user);
    });
  }
  mapUserchatData(user) {
    let userelement = new RbsRoles();
    userelement.roleId = user.roles.roleId;
    userelement.roleName = user.roles.roleName;
    return userelement;
  }


  doIHaveAnAccess(pCategory, permission) {
    let permObj;
    if (this.rbsJson) {
      permObj = this.rbsJson.modules.DASHBOARD;
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

  getButtonsInList() {
    const buttons = this._getButtonsInList();
    if (this.doIHaveAnAccess("CREATE", "UPDATE")) {
      buttons.create = true;
    }
    return buttons;
  }
  _getButtonsInList() {
    return {
      create: false,
    };
  }
}