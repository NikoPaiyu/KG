import { Component, OnInit } from "@angular/core";
import { QuestionService } from "../../shared/question.service";
import { QuestionMenus } from "../../question.menus";

@Component({
  selector: "app-ballot-date-report",
  templateUrl: "./question-ballot-date-report.component.html",
  styleUrls: ["./question-ballot-date-report.component.scss"],
})
export class QuestionBallotDateReportComponent implements OnInit {
  questionDates: any = [];
  dateFormat = "dd/MM/yyyy";
  dashBoardUrl;
  questionDate;
  ballotList: any = [];
  allBallotList: any = [];
  assemblySession: object = [];
  constructor(
    private questionSerivce: QuestionService,
    private questionMenus: QuestionMenus
  ) {}

  ngOnInit() {
    this.dashBoardUrl = this.questionMenus.getDashBoardUrl();
    this.getAssemblySession();
  }
  getAssemblySession() {
    this.questionSerivce.getAllAssemblyAndSession().subscribe((res) => {
      if (res) {
        this.assemblySession = res;
        this.findSessionListByAssembly(this.assemblySession['assembly'].currentassembly);
        this.assemblySession['session'].currentsession = this.assemblySession['session'].find(
          (element) => element.id === this.assemblySession['activeAssemblySession'].sessionId).id;
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
      }
    }
    if(this.assemblySession['session'].currentsession) {
      this.getQuestionDate();
    }
  }
  getQuestionDate() {
    this.questionSerivce
      .getDate(
        this.assemblySession["assembly"].currentassembly,
        this.assemblySession["session"].currentsession
      )
      .subscribe((res: any) => {
        if (res) {
          let today = new Date().toISOString().split("T")[0];
          this.questionDates = res.filter((date) => date > today);
        }
      });
  }
  getBallotResult() {
    this.questionSerivce
      .getBallotResult(this.questionDate)
      .subscribe((res: any) => {
        this.ballotList = this.allBallotList = [];
        //res.status === "FINAL"
        if (res && res.lines) {
          this._setBallotResultResult(res.lines);
        }
      });
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
  _setBallotResultResult(ballotRes) {
    // tslint:disable-next-line: forin
    ballotRes.sort((a, b) => (a.ballotingOrder > b.ballotingOrder ? 1 : -1));
    ballotRes.forEach((value, index) => {
      value.slNo = index + 1;
    });
    this.ballotList = this.allBallotList = ballotRes;
  }
}
