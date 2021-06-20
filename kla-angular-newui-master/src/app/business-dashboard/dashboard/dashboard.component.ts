import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/auth/shared/services/auth.service";
import { Router } from "@angular/router";
import { FileuploadService } from "../fileupload/shared/services/fileupload.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  dashboard = {
    questionSection: false,
    cplSection: false,
    cplDept: false,
    qstnMember: false
  };
  currentUser: any;

  constructor(private auth: AuthService, private router: Router, private translate: TranslateService,
    private fileUploadService: FileuploadService,) {
    this.currentUser = this.auth.getCurrentUser();
    if (this.currentUser) {
      this.getPermissions();
    }
  }

  ngOnInit() {
  }
  isMLA() {
    if (this.auth.getCurrentUser().authorities.indexOf("speaker") !== -1) {
      return false;
    }
    return (
      this.auth.getCurrentUser().authorities.includes("MLA")
    );
  }
  isPPO() {
    return this.auth
      .getCurrentUser()
      .authorities.includes("parliamentaryPartySecretary");
  }
  getPermissions() {
    if (this.doIHaveAnAccessWithModule('QUESTION_SECTION_DASHBOARD', 'READ', 'QUESTION_PROCESSING')) {
      this.dashboard.questionSection = true;
    }
    if (this.doIHaveAnAccessWithModule('CPL_SECTION_DASHBOARD', 'READ', 'CPL_PROCESSING')) {
      this.dashboard.cplSection = true;
    }
    if (this.doIHaveAnAccessWithModule('CPL_DEPT_DASHBOARD', 'READ', 'CPL_PROCESSING')) {
      this.dashboard.cplDept = true;
    }
    if (this.doIHaveAnAccessWithModule('QUESTION_MEMBER_DASHBOARD', 'READ', 'QUESTION_PROCESSING')) {
      this.dashboard.qstnMember = true;
    }
  }

  doIHaveAnAccessWithModule(pCategory, permission, module) {
    let permObj;
    // tslint:disable-next-line:no-string-literal
    if (this.currentUser && this.currentUser.rbsPermissions) {
      permObj = this.currentUser.rbsPermissions[module];
    }
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

  retunUserName(data) {
    const langSelectId = this.translate.getDefaultLang();
    if (langSelectId === 'en') {
      if (data.fullName.includes('Smt')) {
        return data.fullName.replace('Smt', '').replace('.', ' ');
      } else {
        return data.fullName.replace('Shri', '').replace('.', ' ');
      }
    } else {
      if (data.malayalamFullName) {
        if (data.fullName.includes('Smt')) {
          return data.malayalamFullName.replace('ശ്രീമതി', '').replace('.', ' ');
        } else {
          return data.malayalamFullName.replace('ശ്രീ', '').replace('.', ' ');
        }
      } else {
        if (data.fullName.includes('Smt')) {
          return data.fullName.replace('Smt', '').replace('.', ' ');
        } else {
          return data.fullName.replace('Shri', '').replace('.', ' ');
        }
      }
    }
  }

}
