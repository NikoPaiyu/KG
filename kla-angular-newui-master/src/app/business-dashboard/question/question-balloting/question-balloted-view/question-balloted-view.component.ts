import { Component, OnInit } from "@angular/core";
import { QuestionService } from "../../shared/question.service";
import { QuestionMenus } from "../../question.menus";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from "../../../../auth/shared/services/auth.service";
import { QuestionRBSService } from "../../shared/question-rbs.service";
import { NzModalService } from "ng-zorro-antd/modal";
import { NotificationCustomService } from "../../../../shared/services/notification.service";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: "app-question-balloted-view",
  templateUrl: "./question-balloted-view.component.html",
  styleUrls: ["./question-balloted-view.component.scss"],
})
export class QuestionBallotedViewComponent implements OnInit {
  questionDates: any = [];
  dateFormat = "dd/MM/yyyy";
  dashBoardUrl;
  questionDate;
  ballotList: any = [];
  allBallotList: any = [];
  assemblySession: object = [];
  buttonList: any = [];
  searchParam = "";
  ballotId: number;
  showSetTolob = false;
  isBallotApproved = true;
  constructor(
    private question: QuestionService,
    private questionMenus: QuestionMenus,
    private router: Router,
    private auth: AuthService,
    private rbsService: QuestionRBSService,
    private modalService: NzModalService,
    private notify: NotificationCustomService,
    private translate: TranslateService

  ) { }

  ngOnInit() {
    this.dashBoardUrl = this.questionMenus.getDashBoardUrl();
    this.loadRBSPermissions();
    this.getAssemblySession();
  }
  loadRBSPermissions() {
    this.rbsService
      .getQuestionPermissions(this.auth.getCurrentUser().userId)
      .subscribe(() => {
        this.buttonList = this.rbsService.getrbsPermissionForBallot();
      });
  }
  getAssemblySession() {
    this.question.getAllAssemblyAndSession().subscribe((res) => {
      if (res) {
        this.assemblySession = res;
        this.findSessionListByAssembly(this.assemblySession['assembly'].currentassembly)
      }
    });
  }
  findSessionListByAssembly(selAssembly) {
    if (this.assemblySession) {
      if (this.assemblySession['sessionByAssembly'].
        find(
          (element) => element.id === selAssembly)) {
        let session = this.assemblySession['sessionByAssembly'].find(
          (element) => element.id === selAssembly).session;
        this.assemblySession['session'] = session;
        this.assemblySession['session'].currentsession = session.slice(-1).pop().id
      }
    }
    if (this.assemblySession['session'].currentsession) {
      this.getBallotedDates();
    }
  }
  getBallotedDates() {
    this.question
      .getBallotedDates(
        this.assemblySession["assembly"].currentassembly,
        this.assemblySession["session"].currentsession
      )
      .subscribe((res: any) => {
        this.questionDates = [];
        if (res && res.length > 0) {
          let today = new Date().toISOString().split("T")[0];
          this.questionDates = res.filter((d) => d.date > today);
        }
      });
  }
  getBallotResult(e) {
    if (e === 1 || e === 2) {
      this.ballotList = this.allBallotList = [];
      return;
    }
    if (
      this.router.url === "/business-dashboard/question/question-ballot-list"
    ) {
      this.getBallotDateResult();
    } else if (
      this.router.url === "/business-dashboard/question/question-settolob" &&
      this.buttonList.AddToLOB
    ) {
      this.getquestionsForTheDay();
    }
  }
  getquestionsForTheDay() {
    this.question
      .getquestionsForTheDay(this.questionDate)
      .subscribe((res: any) => {
        if (res && res.lines) {
          this.ballotId = res.id;
          this.isBallotApproved = res.status === "FINAL" ? true : false;
          this._setBallotResultResult(res.lines, res.status);
        }
      });
  }
  getBallotDateResult() {
    this.question.getBallotResult(this.questionDate).subscribe((res: any) => {
      if (res && res.lines) {
        res.lines.sort((a, b) =>
          a.ballotingOrder > b.ballotingOrder ? 1 : -1
        );
        res.lines.forEach((value, index) => {
          value.slNo = index + 1;
        });
        this.ballotList = this.allBallotList = res.lines;
      }
    });
  }
  sentToDept() {
    this.question.sentToDepartment("").subscribe((res: any) => { });
  }
  _setBallotResultResult(ballotRes, status) {
    const ballotData = [];
    ballotRes.forEach((value, index) => {
      value.heading = "";
      value.takentoLOB = false;
      if (value.questionId && value.question) {
        value.heading = value.question.heading;
        value.takentoLOB = (value.question.stage === 'TAKEN') ? true : false;
        value.cansettoLOB = (value.question.stage === 'ANSWERED' || value.question.stage === 'TAKEN') ? true : false;
        this.showSetTolob =
          status === "SENT" || status === "FINAL" ? true : false;
        ballotData.push(value);
      } else {
        status === "INTERIM" ? ballotData.push(value) : "";
      }
    });
    ballotData.sort((a, b) => (a.ballotingOrder > b.ballotingOrder ? 1 : -1));
    ballotData.forEach((value, index) => {
      value.slNo = index + 1;
    });
    this.ballotList = this.allBallotList = ballotData;
  }
  _confrmLOB(index, question) {
    if (question.cansettoLOB) {
      this.modalService.confirm({
        nzClassName: "pdng",
        nzContent: "Do you want to add this question to LOB?",
        nzOkText: "OK",
        nzCancelText: "Cancel",
        nzOnOk: () => this._setQuestionsForLOB(question),
        nzOnCancel: () => this._removeSelection(question),
      });
    }
  }
  _setQuestionsForLOB(question) {
    this.question.setToLob(question.questionId).subscribe((res: any) => {
      this.notify.showSuccess("Success", "Question added to LOB succesfully");
      question.takentoLOB = true;
    });
  }
  _removeSelection(question) {
    question.takentoLOB = false;
  }
  sort(sort: { key: string; value: string }): void {
    const data = this.ballotList.filter((item) => item);
    if (sort.key && sort.value) {
      this.ballotList = data.sort((a, b) =>
        sort.value === "ascend"
          ? (typeof a[sort.key!] === "number"
            ? a[sort.key!]
            : a[sort.key!].toLowerCase()) >
            (typeof b[sort.key!] === "number"
              ? b[sort.key!]
              : b[sort.key!].toLowerCase())
            ? 1
            : -1
          : (typeof b[sort.key!] === "number"
            ? b[sort.key!]
            : b[sort.key!].toLowerCase()) >
            (typeof a[sort.key!] === "number"
              ? a[sort.key!]
              : a[sort.key!].toLowerCase())
            ? 1
            : -1
      );
    } else {
      this.ballotList = data;
    }
  }
  _drawPageTitle() {
    if (
      this.router.url === "/business-dashboard/question/question-ballot-list"
    ) {
      return this.translate.instant('business-dashboard.question.balloting');
    } else if (
      this.router.url === "/business-dashboard/question/question-settolob"
    ) {
      return this.translate.instant('business-dashboard.question.settolob');
    }
  }
  _canShow(key) {
    const url1 = "/business-dashboard/question/question-ballot-list";
    const url2 = "/business-dashboard/question/question-settolob";
    let status = false;
    switch (key) {
      case "party":
        status = this.router.url === url1 ? true : false;
        break;
      case "setToLOB":
        status =
          this.router.url === url2 &&
            this.buttonList.AddToLOB &&
            this.showSetTolob
            ? true
            : false;
        break;
      case "heading":
        status =
          this.router.url === url2 && this.buttonList.AddToLOB ? true : false;
        break;
      default:
        break;
    }
    return status;
  }
}
