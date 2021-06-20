import { Component, OnInit } from "@angular/core";
import { QuestionService } from "../../shared/question.service";
import { Router } from "@angular/router";
import { AuthService } from "src/app/auth/shared/services/auth.service";
import { QuestionRBSService } from "../../shared/question-rbs.service";

@Component({
  selector: "app-question-culling-assurance",
  templateUrl: "./question-culling-assurance.component.html",
  styleUrls: ["./question-culling-assurance.component.scss"],
})
export class QuestionCullingAssuranceComponent implements OnInit {
  tablefiltrParams: any = { show: {}, data: {} };
  filterSelected: object;
  listOfData = [];
  listOfDisplayData = [];
  listOfAllData = [];
  assemblySession: object = [];
  answers;
  keywords = [];
  newKeyWord;
  isVisibleFilter = false;
  filterCheckboxes: any = [];
  constructor(
    private question: QuestionService,
    private router: Router,
    private auth: AuthService,
    private rbsService: QuestionRBSService
  ) {
    this.getKeyWordsFromRoutes();
  }

  ngOnInit() {
    this.getAssemblySession();
    this.loadRBSPermissions();
    this._setFilterValue();
  }
  loadRBSPermissions() {
    this.rbsService
      .getQuestionPermissions(this.auth.getCurrentUser().userId)
      .subscribe((response) => {});
  }
  getKeyWordsFromRoutes() {
    if (
      this.router.getCurrentNavigation() &&
      this.router.getCurrentNavigation().extras &&
      this.router.getCurrentNavigation().extras.state
    ) {
      this.keywords = this.router.getCurrentNavigation().extras.state.data;
    }
  }
  getAssemblySession() {
    this.question.getAllAssemblyAndSession().subscribe((res) => {
      if (res) {
        this.assemblySession = res;
          //this.keywords.length > 0 ? this.getQuestionListToAssure() : "";
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
        this.assemblySession['session'].currentsession = session.find(
          (element) => element.id === this.assemblySession['activeAssemblySession'].sessionId).id;      }
    }
  }
  addKeyWord(word) {
    if (word) {
      this.keywords ? "" : (this.keywords = []);
      this.keywords.push(word);
    }
    this.newKeyWord = null;
  }
  removeKeyWord(index) {
    this.keywords.splice(index, 1);
  }
  getQuestionListToAssure() {
    this.listOfDisplayData = this.listOfData = this.listOfAllData = [];
    this.question
      .getQuestionListToAssure(
        this.assemblySession["assembly"].currentassembly,
        this.assemblySession["session"].currentsession,
        this.keywords ? this.keywords : []
      )
      .subscribe((res: any) => {
        this.listOfDisplayData = this.listOfData = this.listOfAllData = res;
      });
  }

  viewQuestion(id) {
    this.router.navigate(["business-dashboard/question/mark-assurance", id], {
      state: {
        data: this.keywords,
      },
    });
  }

  showFilterModal() {
    this.isVisibleFilter = true;
  }

  _hideFilter() {
    this.isVisibleFilter = false;
  }

  _showFilter(): void {
    this.isVisibleFilter = false;
    const tablefilter = this.tablefiltrParams.show;
    tablefilter.showQNo = this.filterCheckboxes.find(
      (element) => element.label === "QNo"
    ).checked;
    tablefilter.showheading = this.filterCheckboxes.find(
      (element) => element.label === "Heading"
    ).checked;
    tablefilter.showmember = this.filterCheckboxes.find(
      (element) => element.label === "Member"
    ).checked;
    this._loadSelectedfilterData();
  }
  disableFilter(fliterNum) {
    const tablefilter = this.tablefiltrParams.show;
    switch (fliterNum) {
      case 1:
        tablefilter.showQNo = false;
        this.filterSelected["questionNumber"] = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label === "QNo") {
            element.checked = false;
          }
        });
      case 2:
        tablefilter.showheading = false;
        this.filterSelected["questionheading"] = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label === "Heading") {
            element.checked = false;
          }
        });
        break;
      case 3:
        tablefilter.showmember = false;
        this.filterSelected["member"] = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label == "Member") {
            element.checked = false;
          }
        });
        break;
      default:
        break;
    }
    this.searchCol(this.filterSelected);
    this._loadSelectedfilterData();
  }
  _chooseFilter(box) {
    box.checked = !box.checked;
  }
  searchCol(filterSelected) {}
  _loadSelectedfilterData() {
    const tablefilter = this.tablefiltrParams.show;
    const tablefiltrData = this.tablefiltrParams.data;
    const self = this;
    tablefilter.showQNo ? (tablefiltrData.questionNumber = []) : "";
    tablefilter.showheading ? (tablefiltrData.questionheading = []) : "";
    tablefilter.showmember ? (tablefiltrData.member = []) : "";
  }

  _setFilterValue() {
    this.tablefiltrParams.show = {
      showQNo: false,
      showmember: false,
      showheading: false,
    };
    this.tablefiltrParams.disable = {
      qNodisable: true,
      memberdisable: true,
      questionheadingdisable: true,
    };
    this.tablefiltrParams.data = {
      questionNumber: [],
      member: [],
      questionheading: [],
      questiondate: [],
    };
    this.filterCheckboxes = [
      { label: "QNo", checked: false },
      { label: "Heading", checked: false },
      { label: "Member", checked: false },
    ];
    this.filterSelected = {
      questionNumber: null,
      member: null,
      questionheading: null,
      questiondate: null,
    };
  }
}
