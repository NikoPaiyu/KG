import { Component, OnInit, Input } from "@angular/core";
import { Router } from "@angular/router";
import { QuestionService } from "../../shared/question.service";
import { AuthService } from "src/app/auth/shared/services/auth.service";
import { UserData } from "src/app/auth/shared/models";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-question-dept-dashboard",
  templateUrl: "./question-dept-dashboard.component.html",
  styleUrls: ["./question-dept-dashboard.component.scss"],
})
export class QuestionDeptDashboardComponent implements OnInit {
  @Input() fromMainDash;
  role: string;
  dashBoardMenuList;
  currentUser: UserData;
  constructor(
    private question: QuestionService,
    private auth: AuthService,
    private router: Router,
    private translate: TranslateService
  ) {
    this.currentUser = this.auth.getCurrentUser();
  }

  ngOnInit() {
    this.role = this.auth.getCurrentUser().authorities[0];
    if (this.role) {
      this.getDashboardCount();
    }
  }
  getDashboardCount() {
    if (this.auth.getCurrentUser().authorities.indexOf("speaker") > 0) {
      this.role = "speaker";
    }
    this.question
      .getDeptDashboardCount(this.role, this.auth.getCurrentUser().userId)
      .subscribe((res) => {
        this.dashBoardMenuList = res;
        this.dashBoardMenuList = this.dashBoardMenuList.filter(
          (x) => !x.processDefKey.match("NOTICE_") && x.displayName !== null
        );
      });
  }
  loadPage(processDefKey) {
    let routerLink;
    localStorage.clear();
    switch (processDefKey) {
      case "SETTING_UP":
        routerLink = ["business-dashboard/question/question-ballot-approve"];
        break;
      case "QuestionWithdrawalProcessing":
        routerLink = [
          "business-dashboard/question/list-dept-qus",
          "PENDING_FOR_WITHDRAWAL",
        ];
        break;
      case "QUESTION_WITHDRAW_LOB":
        routerLink = [
          "business-dashboard/question/list-dept-qus",
          "PENDING_FOR_WITHDRAWAL",
        ];
        break;
      case "QUESTION_WITHDRAW_NOTICE":
        routerLink = [
          "business-dashboard/question/list-dept-ntc",
          "PENDING_FOR_WITHDRAWAL",
        ];
        break;
      case "RevokeAdmittedNotice":
        routerLink = ["business-dashboard/question/list-dept", "REVOKED"];
        break;
      case "ShortNoticeQuestion":
        routerLink = ["business-dashboard/question/list-dept", "SHORT_NOTICE"];
        break;
      case "RequestCorrectionOfStatement":
        routerLink = [
          "business-dashboard/question/list-dept",
          "CORRECTION_REQUEST",
        ];
        break;
      case "QUESTION_CLUBBED_MEMBER_WITHDRAW_NOTICE":
        routerLink = [
          "business-dashboard/question/list-dept-clubw",
          "CLUBBING_REMOVE",
        ];
        break;
      case "QUESTION_CLUBBED_MEMBER_WITHDRAW_QUESTION":
        routerLink = [
          "business-dashboard/question/list-dept-clubw",
          "CLUBBING_REMOVE_QUESTION",
        ];
        break;
      case "REQUEST_CORRECTION_AFTER_SABHA":
        routerLink = [
          "business-dashboard/question/list-dept",
          "CORRECTION_AFTER",
        ];
        break;
      case "Approve Correction Request": //for speaker list
        routerLink = ["business-dashboard/question/list-dept", "CORRECTION"];
        break;
      case "QUESTION_ANSWER_ASSURANCE":
        routerLink = ["business-dashboard/question/draft-assurance"];
        break;
      case "QUESTION_ANSWER_ASSURANCE_LIST":
        routerLink = ["business-dashboard/question/assured-list", "LIST"];
        break;
      case "CLAIMED_BY_ME":
        routerLink = ["business-dashboard/question/list-dept", "CLAIMED"];
        break;
      default:
        routerLink = ["business-dashboard/question/list-dept", "NORMAL"];
        break;
    }
    this.router.navigate(routerLink);
  }
  returnTile(menu) {
    let langSelectId = this.translate.getDefaultLang();
    let displayName = '';
    switch (langSelectId) {
      case 'mal':
        displayName = menu.ml_Disply ?  menu.ml_Disply : menu.displayName;
        break;
      case 'en':
        displayName = menu.en_Display ? menu.en_Display : menu.displayName;
        break;
      case 'kan':
        displayName = menu.en_Display ? menu.en_Display : menu.displayName;
        break;
      case 'hin':
        displayName = menu.en_Display ? menu.en_Display : menu.displayName;
        break;
      case 'tam':
        displayName = menu.en_Display ? menu.en_Display : menu.displayName;
        break;
      default:
        displayName = menu.en_Display ? menu.en_Display : menu.displayName;
        break;
    }
    return displayName;
  }
}
