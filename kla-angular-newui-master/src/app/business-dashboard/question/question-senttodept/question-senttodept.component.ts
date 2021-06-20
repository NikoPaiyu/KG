import { Component, OnInit } from "@angular/core";
import { QuestionService } from "../shared/question.service";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from "../../../auth/shared/services/auth.service";
import { UserData } from "../../../auth/shared/models";
import { NzModalService } from "ng-zorro-antd/modal";
import { NotificationCustomService } from "../../../shared/services/notification.service";
import { forkJoin } from "rxjs";

@Component({
  selector: "app-question-senttodept",
  templateUrl: "./question-senttodept.component.html",
  styleUrls: ["./question-senttodept.component.scss"],
})
export class QuestionSenttoDeptComponent implements OnInit {
  assembly;
  session;
  searchParam = "";
  approvedShortNotices: any = [];
  allapprovedShortNotices: any = [];
  questionDate = "";
  currentUser: UserData;
  assemblySession: object = [];
  numberOfChecked = [];
  questionDates = [];
  shownotice = false;
  showVersion = false;
  questionVersion;
  selectedVersion = null;
  currentVersion = null;
  editable = false;
  clauseNo = ["A", "B", "C", "D", "E", "F", "G", "H"];
  versionsCombo = [];
  ClubbedMembers = { show: false, data: [] };
  mapOfCheckedId: { [key: string]: boolean } = {};
  isAllDisplayDataChecked = false;

  constructor(
    private question: QuestionService,
    private auth: AuthService,
    private modalService: NzModalService,
    private notify: NotificationCustomService
  ) {
  }

  ngOnInit() {
    this.getAssemblySession();
  }
  getApprovedShortNotices() {
    this.approvedShortNotices = [];
    this.question
      .getApprovedShortNotices(
        this.assemblySession["assembly"].currentassembly,
        this.assemblySession["session"].currentsession
      )
      .subscribe((res: any) => {
        this.allapprovedShortNotices = this.approvedShortNotices = res;
        this.filterByQdate();
        this.approvedShortNotices.forEach((value, index) => {
          this.questionDates.push(value.questionDate);
          value.slNo = index + 1;
        });
        const today = new Date().toISOString().split("T")[0];
        this.questionDates = this.questionDates.filter((date) => date > today);
        this.questionDates = this.questionDates.filter(
          (v, i, a) => a.findIndex((t) => t === v) === i
        );
        this.questionDates.sort();
      });
  }
  filterByQdate() {
    if (this.questionDate) {
      this.approvedShortNotices = this.allapprovedShortNotices.filter(
        (item) => this.questionDate === item.questionDate
      );
    }
  }
  sort(sort: { key: string; value: string }): void {
    const data = this.approvedShortNotices.filter((item) => item);
    if (sort.key && sort.value) {
      this.approvedShortNotices = data.sort((a, b) =>
        sort.value === "ascend"
          ? this._sortQuestionAsc(a, b, sort)
            ? 1
            : -1
          : this._sortQuestionDesc(a, b, sort)
            ? 1
            : -1
      );
    } else {
      this.approvedShortNotices = data;
    }
  }

  _sortQuestionAsc(a, b, sort) {
    if (a[sort.key] && b[sort.key]) {
      return (
        (typeof a[sort.key!] === "number"
          ? a[sort.key!]
          : a[sort.key!].toLowerCase()) >
        (typeof b[sort.key!] === "number"
          ? b[sort.key!]
          : b[sort.key!].toLowerCase())
      );
    }
  }
  _sortQuestionDesc(a, b, sort) {
    if (a[sort.key] && b[sort.key]) {
      return (
        (typeof b[sort.key!] === "number"
          ? b[sort.key!]
          : b[sort.key!].toLowerCase()) >
        (typeof a[sort.key!] === "number"
          ? a[sort.key!]
          : a[sort.key!].toLowerCase())
      );
    }
  }
  onSearch() {
    this.approvedShortNotices = this.allapprovedShortNotices;
    if (this.searchParam) {
      this.approvedShortNotices = this.allapprovedShortNotices.filter(
        (element) =>
          element.primaryMemberName
            .toLowerCase()
            .includes(this.searchParam.toLowerCase()) ||
          element.slNo.toString().includes(this.searchParam) ||
          element.heading.toLowerCase().includes(this.searchParam.toLowerCase())
      );
    } else {
      this.approvedShortNotices = this.allapprovedShortNotices;
    }
  }
  sendToDept() {
    let questionIds = [];
    if (this.numberOfChecked.length === 0) {
      this.notify.showWarning("Warning", "Please Select One");
      return;
    }
    this.numberOfChecked.forEach((q) => {
      questionIds.push(q.id);
    });
    this.question
      .sendToDeptSNQ(
        this.assemblySession["assembly"].currentassembly,
        this.assemblySession["session"].currentsession,
        questionIds
      )
      .subscribe((res: any) => {
        this.notify.showSuccess("Success", "Success");
        this.getApprovedShortNotices();
      });
  }
  _showClubbedMembers(clubbedMembers) {
    this.ClubbedMembers.show = true;
    this.ClubbedMembers.data = clubbedMembers;
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
      this.getApprovedShortNotices();
    }
  }
  showVersionModal(question) {
    this.getCurrentVersionDetails(question.id);
    this.editable = false;
    this.showVersion = true;
  }
  getCurrentVersionDetails(id) {
    if (id) {
      this.question.getVersionsList(id).subscribe((res: any) => {
        this.versionsCombo = res.versionDtails;
        this.versionsCombo.forEach((element) => {
          if (element.owner.roles.length > 1) {
            element.owner.roles.forEach((ele) => {
              if (ele.roleName == "speaker") {
                element.ROLE = "Speaker";
              }
            });
          } else {
            element.ROLE = element.owner.roles[0].roleName;
          }
        });
        this.questionVersion = res.current;
        this.questionVersion.question.primaryMemberNameInMalayalam = (this.questionVersion.question.primaryMemberNameInMalayalam) ? this.questionVersion.question.primaryMemberNameInMalayalam : this.questionVersion.question.primaryMemberName;
        this.questionVersion.question.nameInMalayalam = (this.questionVersion.question.portfolioNameInMalayalam) ? this.questionVersion.question.portfolioNameInMalayalam : this.questionVersion.question.portfolioName;
        this.selectedVersion = res.current.id;
        this.currentVersion = res.current.id;
        if (this.questionVersion.category === "UNSTARRED") {
          this.questionVersion.priority = null;
        }
        if (
          this.questionVersion.question.assemblyId &&
          this.questionVersion.question.sessionId &&
          this.assemblySession
        ) {
          this.questionVersion.assemblyId = this.assemblySession[
            "assembly"
          ].find(
            (item) => item.id === this.questionVersion.question.assemblyId
          ).assemblyId;
          this.questionVersion.sessionId = this.assemblySession["session"].find(
            (item) => item.id === this.questionVersion.question.sessionId
          ).sessionId;
        }
      });
    }
  }
  getVersionDetailsById(versionId) {
    if (this.currentVersion != versionId) {
      this.editable = false;
    }
    this.question.getVersionById(versionId).subscribe((res) => {
      this.questionVersion = {};
      this.questionVersion = res;
      this.questionVersion.question.primaryMemberNameInMalayalam = (this.questionVersion.question.primaryMemberNameInMalayalam) ? this.questionVersion.question.primaryMemberNameInMalayalam : this.questionVersion.question.primaryMemberName;
      this.questionVersion.question.nameInMalayalam = (this.questionVersion.question.portfolioNameInMalayalam) ? this.questionVersion.question.portfolioNameInMalayalam : this.questionVersion.question.portfolioName;
      if (
        this.questionVersion.question.assemblyId &&
        this.questionVersion.question.sessionId &&
        this.assemblySession
      ) {
        this.questionVersion.assemblyId = this.assemblySession["assembly"].find(
          (item) => item.id === this.questionVersion.question.assemblyId
        ).assemblyId;
        this.questionVersion.sessionId = this.assemblySession["session"].find(
          (item) => item.id === this.questionVersion.question.sessionId
        ).sessionId;
      }
    });
  }
  cancelVersion() {
    this.showVersion = false;
    this.editable = false;
    this.questionVersion = {};
  }
  _checkAllRows(value: boolean): void {
    this.approvedShortNotices.forEach(
      (item) => (this.mapOfCheckedId[item.id] = value)
    );
    this.selectSNQ();
  }
  selectSNQ() {
    this.isAllDisplayDataChecked = this.approvedShortNotices.every(
      (item) => this.mapOfCheckedId[item.id]
    );
    this.numberOfChecked = this.approvedShortNotices.filter(
      (item) => this.mapOfCheckedId[item.id]
    );
  }
}
