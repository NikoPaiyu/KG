import { Component, OnInit } from "@angular/core";
import { QuestionService } from "../../shared/question.service";
import { QuestionMenus } from "../../question.menus";
import { NzModalService } from "ng-zorro-antd/modal";
import { BookletPreviewComponent } from "../../shared/component/booklet-preview/booklet-preview.component";
import { forkJoin } from "rxjs";

@Component({
  selector: "app-unstarred-booklet",
  templateUrl: "./unstarred-booklet.component.html",
  styleUrls: ["./unstarred-booklet.component.scss"],
})
export class UnStarredBookletComponent implements OnInit {
  questionDates: any = [];
  dateFormat = "dd/MM/yyyy";
  dashBoardUrl;
  questionDate;
  componentParams = { booklet: {}, assembly: 14, session: 19 };
  assemblySession: object = [];
  buttonList: any = [];
  constructor(
    private question: QuestionService,
    private questionMenus: QuestionMenus,
    private modalService: NzModalService
  ) {}

  ngOnInit() {
    this.dashBoardUrl = this.questionMenus.getDashBoardUrl();
    this.getAssemblySession();
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
    if(this.assemblySession['session'].currentsession) {
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
        if (res && res.length > 0) {
          let today = new Date().toISOString().split("T")[0];
          this.questionDates = res.filter((d) => d.date > today);
        }
      });
  }
  showPreview() {
    this.modalService.create({
      nzContent: BookletPreviewComponent,
      nzWidth: "800",
      nzFooter: null,
      nzComponentParams: {
        previewData: this.componentParams["booklet"],
        assembly: this.componentParams["assembly"],
        session: this.componentParams["session"],
        hidePrint: true
      },
    });
  }

  getStarredBookletData() {
    this.componentParams["booklet"] = {};
    if (
      !this.questionDate ||
      this.assemblySession["session"].currentsession !== 3
    ) {
      return;
    }
    this.question
      .getStarredPreviewData(this.questionDate)
      .subscribe((res: any) => {
        this.componentParams["booklet"] = res ? res : {};
        this.componentParams["assembly"] = this.assemblySession[
          "assembly"
        ].find(
          (element) =>
            element.id == this.assemblySession["assembly"].currentassembly
        ).assemblyId;
        this.componentParams["session"] = this.assemblySession["session"].find(
          (element) =>
            element.id == this.assemblySession["session"].currentsession
        ).sessionId;
      });
  }
  isEmpty() {
    if (Object.keys(this.componentParams["booklet"]).length === 0) {
      return true;
    }
    return false;
  }
}
