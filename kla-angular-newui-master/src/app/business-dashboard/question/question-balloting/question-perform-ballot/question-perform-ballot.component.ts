import { Component, OnInit } from "@angular/core";
import { QuestionService } from "../../shared/question.service";
import { NotificationCustomService } from "../../../../shared/services/notification.service";
import { AuthService } from "src/app/auth/shared/services/auth.service";
import { QuestionRBSService } from "../../shared/question-rbs.service";
@Component({
  selector: "app-question-perform-ballot",
  templateUrl: "./question-perform-ballot.component.html",
  styleUrls: ["./question-perform-ballot.component.scss"],
})
export class QuestionPerformBallotComponent implements OnInit {
  questionDates: any = [];
  dateFormat = "dd/MM/yyyy";
  ballotingDetails: any = [];
  memberList: any = [];
  ballotResult: any = [];
  questionDate;
  buttonList;
  canPerformBallot = false;
  canCancelBallot = false;
  assemblySession: object = [];
  persntage = 0;
  showProgress: boolean = false;
  constructor(
    private questionSerivce: QuestionService,
    private notify: NotificationCustomService,
    private auth: AuthService,
    private rbsService: QuestionRBSService
  ) { }

  ngOnInit() {
    this.getAssemblySession();
    this.loadRBSPermissions();
  }

  loadRBSPermissions() {
    this.rbsService
      .getQuestionPermissions(this.auth.getCurrentUser().userId)
      .subscribe(() => {
        this.buttonList = this.rbsService.getrbsPermissionForBallot();
      });
  }
  getAssemblySession() {
    this.questionSerivce.getAllAssemblyAndSession().subscribe((res) => {
      if (res) {
        this.assemblySession = res;
          this.getQuestionDate();
        }
    });
  }
  getQuestionDate() {
    this.questionSerivce
      .getBallotDates(
        this.assemblySession["assembly"].currentassembly,
        this.assemblySession["session"].currentsession
      )
      .subscribe((res: any) => {
        if (res) {
          let today = new Date().toISOString().split("T")[0];
          this.questionDates = res.filter((date) => date > today);
          this.questionDates = this.questionDates.filter(
            (v, i, a) => a.findIndex((t) => t === v) === i
          );
          this.questionDate = this.questionDates[0];
          this.questionDates.sort();
          this.getBallotInitialData();
        }
      });
  }
  getBallotInitialData() {
    this.memberList = this.ballotResult = [];
    this.canPerformBallot = false;
    this.canCancelBallot = false;
    this.showProgress = false;
    this.questionSerivce
      .getBallotInitialData(this.questionDate)
      .subscribe((res: any) => {
        this.ballotResult = [];
        if (res) {
          if (res.ballotResult == null || (res.ballotResult && res.ballotResult.status !== "FINAL")) {
            this.canPerformBallot = true;
          }
          if (res.ballotResult) {
            this.canCancelBallot = true;
            if (res.ballotResult.status === "FINAL" || res.ballotResult.status === "SENT") {
              this.canCancelBallot = false;
            }
          }
          this.memberList = res.memberList;
          this.ballotResult = res.ballotResult ? res.ballotResult.lines : [];
          this.ballotResult.sort((a, b) =>
            a.ballotingOrder > b.ballotingOrder ? 1 : -1
          );
        }
      });
  }
  performBallot() {
    this.persntage = 10;
    const timeDuration = 100 * this.memberList.length;
    this.questionSerivce
      .performBallot(this.questionDate, this.assemblySession["assembly"].currentassembly,
        this.assemblySession["session"].currentsession)
      .subscribe((res: any) => {
        if (res && res.lines) {
          this.showProgress = true;
          const timerId = setInterval(
            () => (this.persntage = this.persntage + 10),
            timeDuration
          );
          setTimeout(() => {
            clearInterval(timerId);
            this._showSuccess(null);
            this.canCancelBallot = true;
            this.showProgress = false;
            this.ballotResult = res.lines ? res.lines : [];
            this.ballotResult.sort((a, b) =>
              a.ballotingOrder > b.ballotingOrder ? 1 : -1
            );
          }, timeDuration * 10);
        }
      });
  }
  cancelBallot() {
    this.questionSerivce
      .cancelBallot(this.questionDate)
      .subscribe((res: any) => {
        this.showProgress = false;
        this.canCancelBallot = false;
        this._showSuccess(res.body);
        this.ballotResult = [];
      });
  }
  isMLA() {
    return this.auth.getCurrentUser().authorities.includes("MLA");
  }
  _showSuccess(msg) {
    msg = msg ? msg : "Success";
    this.notify.showSuccess("Success", msg);
  }
}
