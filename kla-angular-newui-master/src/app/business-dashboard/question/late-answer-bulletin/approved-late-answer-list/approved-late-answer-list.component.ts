import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { QuestionService } from "../../shared/question.service";
import { AuthService } from "../../../../auth/shared/services/auth.service";
import { UserData } from "../../../../auth/shared/models";
import { QuestionRBSService } from "../../shared/question-rbs.service";
@Component({
  selector: 'app-approved-late-answer-list',
  templateUrl: './approved-late-answer-list.component.html',
  styleUrls: ['./approved-late-answer-list.component.scss']
})
export class ApprovedLateAnswerListComponent implements OnInit {


  role = null;
  checked = true;
  searchParam: string = "";
  approvedList: any = [];
  allapprovedList: any = [];
  buttonList: any = [];
  currentUser: UserData;
  action: string = "";
  pageTitle: string = "Late Answer Bulletin";
  assemblySession: object = [];
  numberOfItem = 10;
  pageIndex = 0;
  total= 0;
  constructor(
    private question: QuestionService,
    private router: Router,
    private auth: AuthService,
    private rbsService: QuestionRBSService
  ) {
    this.role = this.auth.getCurrentUser().authorities[0];
    this.currentUser = this.auth.getCurrentUser();
  }

  ngOnInit() {
    this.getAssemblySession();
    this.loadRBSPermissions();
    if (
      this.auth.getCurrentUser().authorities.includes(this._defineRoles()[10])
    ) {
      this.role = this._defineRoles()[10];
    }
  }
  getAssemblySession() {
    this.question.getAllAssemblyAndSession().subscribe((res) => {
      if (res) {
        this.assemblySession = res;
          this.getApprovedAnswerStatuslist();
        }
    });
  }
  loadRBSPermissions() {
    if (this.auth.getCurrentUser().userId) {
      this.rbsService
        .getQuestionPermissions(this.auth.getCurrentUser().userId)
        .subscribe(() => {
          this.buttonList = this.rbsService.getButtonsInList(this.auth.getCurrentUser().authorities);
        });
    }
  }
  getApprovedAnswerStatuslist() {
    this.approvedList = this.allapprovedList = [];
    this.question
      .getApprovedLateAnswerBulletin(this.assemblySession["assembly"].currentassembly, this.assemblySession["session"].currentsession, this.pageIndex, this.numberOfItem)
      .subscribe((res: any) => {
        if (res && res.length > 0) {
          this._rebuildData(res);
        }
      });
  }
  sort(sort: { key: string; value: string }): void {
    const data = this.approvedList.filter((item) => item);
    if (sort.key && sort.value) {
      this.approvedList = data.sort((a, b) =>
        sort.value === "ascend"
          ? a[sort.key!].toLowerCase() > b[sort.key!].toLowerCase()
            ? 1
            : -1
          : b[sort.key!].toLowerCase() > a[sort.key!].toLowerCase()
            ? 1
            : -1
      );
    } else {
      this.approvedList = data;
    }
  }
  searchCol(filter: any) {
    if (!filter) {
      this.approvedList = this.allapprovedList;
    } else
      this.approvedList = this.allapprovedList.filter((item: any) =>
        this.applyFilter(item, filter)
      );
  }
  applyFilter(element: any, filter: any) {
    for (const field in filter) {
      if (filter[field]) {
        if (typeof filter[field] === "string") {
          if (
            !element[field] ||
            element[field].toLowerCase() !== filter[field].toLowerCase()
          ) {
            return false;
          }
        } else if (typeof filter[field] === "number") {
          if (!element[field] || element[field] !== filter[field]) {
            return false;
          }
        }
      }
    }
    return true;
  }
  onCheckBoxChange(box) {
    box.checked = !box.checked;
  }
  onSearch() {
    this.approvedList = this.allapprovedList;
    if (this.searchParam)
      this.approvedList = this.allapprovedList.filter(
        (element) =>
          element.date.toLowerCase().includes(this.searchParam.toLowerCase()) ||
          element.status.toLowerCase().includes(this.searchParam.toLowerCase())
      );
    else this.approvedList = this.allapprovedList;
  }
  viewBulletin(list) {
      this.router.navigate([
        "business-dashboard/question/process-late-answer-bulletin",
        list.id
      ]);
  }
  _rebuildData(res) {
    this.total = res.length;
    res.forEach(element => {
      element.date = this.question.formatDateDDMMYYYY(new Date(Date.parse(element.createDateTime)));
      element.bulletinNo = element.id
    });
    this.approvedList = this.allapprovedList = res;
  }

  _defineRoles() {
    return [
      "MLA",
      "parliamentaryPartySecretary",
      "assistant",
      "sectionOfficer",
      "underSecretary",
      "deputySecretary",
      "jointSecretary",
      "specialSecretary",
      "additionalSecretary",
      "secretary",
      "speaker",
      "Department",
    ];
  }
  pageSizeChange(numberOfItem) {
    this.pageIndex = 0;
    this.numberOfItem = numberOfItem;
    this.getApprovedAnswerStatuslist();
  }
  pageIndexChange(index) {
    this.pageIndex = index;
    this.getApprovedAnswerStatuslist();
  }
}
