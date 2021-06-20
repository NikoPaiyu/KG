import { Component, OnInit, Input } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { QuestionService } from "../../shared/question.service";
import { AuthService } from "src/app/auth/shared/services/auth.service";
import { UserData } from "src/app/auth/shared/models";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-question-dashboard",
  templateUrl: "./question-dashboard.component.html",
  styleUrls: ["./question-dashboard.component.scss"],
})
export class QuestionDashboardComponent implements OnInit {
  @Input() fromMainDash;
  role: string;
  dashBoardMenuList;
  currentUser: UserData;
  constructor(
    private question: QuestionService,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService
  ) {
    this.currentUser = this.auth.getCurrentUser();
  }

  ngOnInit() {
    this.role = this.auth.getCurrentUser().authorities[0];
    if (this.auth.getCurrentUser().userId) {
      this.getDashboardCount();
    }
  }
  getDashboardCount() {
    if (this.isMLA()) {
      this.question
        .getMLADashboardCount(this.auth.getCurrentUser().userId)
        .subscribe((res) => {
          if (Array.isArray(res)) {
            this.dashBoardMenuList = res.filter((x) => x.displayName !== null);
          }
        });
      return;
    }
    this.question
      .getPPODashboardCount(this.auth.getCurrentUser().userId)
      .subscribe((res) => {
        if (Array.isArray(res)) {
          this.dashBoardMenuList = res.filter((x) => x.displayName !== null);
        }
      });
  }
  loadPage(status, submittedBy, isQuestion, type) {
    localStorage.clear();
    let statusAsNotice = [
      "SAVED",
      "SUBMITTED",
      "WITHDRAWN",
      "PENDING_FOR_WITHDRAWAL",
      "DISALLOWED",
      "QUESTION_BANK",
      "SUBMITTED_TO_PPO",
    ];
    let statusAsQuestion = [
      "PENDING_FOR_WITHDRAWAL",
      "WITHDRAWN",
      "ANSWERED",
    ];
    if (status === "QUESTION_BANK") {
      this.router.navigate(["question-bank"], { relativeTo: this.route.parent });
    } else if (statusAsNotice.includes(status) && !isQuestion) {
      this.router.navigate(["list-mla-ntc", status, submittedBy ? submittedBy : 'NR',
        type], { relativeTo: this.route.parent });
      return;
    }
    if (statusAsQuestion.includes(status) && isQuestion) {
      this.router.navigate(["list-mla-qus", status, submittedBy ? submittedBy : 'NR',
        type], { relativeTo: this.route.parent });
      return;
    }
  }
  isMLA() {
    return this.auth.getCurrentUser().authorities.includes("MLA");
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
