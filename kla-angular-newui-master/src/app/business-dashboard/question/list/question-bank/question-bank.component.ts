import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { QuestionList } from '../../shared/model/question';
import { Router, ActivatedRoute } from '@angular/router';
import { QuestionService } from '../../shared/question.service';
import { QuestionRBSService } from '../../shared/question-rbs.service';
import { AuthService } from 'src/app/auth/shared/services/auth.service';

@Component({
  selector: 'app-question-bank',
  templateUrl: './question-bank.component.html',
  styleUrls: ['./question-bank.component.scss']
})
export class QuestionBankComponent implements OnInit {
  isChecked = true;
  isAllDisplayDataChecked = false;
  tablefiltrParams: any = { disable: {}, data: {} };
  isVisibleFilter = false;
  listOfData = [];
  listOfDisplayData = [];
  listOfAllData = [];
  numberOfChecked = 0;
  sortName: string | null = null;
  sortValue: string | null = null;
  mapOfCheckedId: { [key: string]: boolean } = {};
  searchParam: string;
  searchAddress: string;
  listOfSearchName: string[] = [];
  filterCheckboxes: any = [];
  filterSelected: object;
  role: string;
  isChanged = false;
  statusParam: any;
  primaryFlag = false;
  sortbyId = false;
  assemblySession: object = [];
  showmemberfilter = false;
  @ViewChild("inputElement", { static: false }) inputElement: ElementRef;
  buttonList: any;
  constructor(
    private router: Router,
    private question: QuestionService,
    private route: ActivatedRoute,
    private auth: AuthService,
    public rbsService: QuestionRBSService
  ) {
    this._setFilterValue();
  }
  ngOnInit() {
    this.role = this.auth.getCurrentUser().authorities[0];
    this.loadRBSPermissions();
    this.route.params.subscribe((params) => {
      this.statusParam = params && params.status ? params.status : "";
      this.primaryFlag = params && params.isp ? params.isp : this.primaryFlag;
      this.getAssemblySession();
      this.clearFilter();
      if (params.isp === "true") {
        this.showmemberfilter = true;
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
  getAssemblySession() {
    this.question.getAllAssemblyAndSession().subscribe((res) => {
      if (res) {
        this.assemblySession = res;
      }
        this._redirectToList();
    });
  }
  getNoticesListByOwner() {
    this.question
      .getQuestionBankListByOwner(
        this.assemblySession["assembly"].currentassembly,
        this.assemblySession["session"].currentsession,
        this.auth.getCurrentUser().userId,
        this.primaryFlag
      )
      .subscribe((res: any) => {
        this.listOfDisplayData = this.listOfAllData = res;
        this.sortbyAssemblyAndSessionId(res);
      });
  }

  sortbyAssemblyAndSessionId(res) {
    this.listOfDisplayData = this.listOfAllData;
    this._applyFilterForAssembly(this.listOfDisplayData);
    this.sortbyId = true;
  }
  loadQuestionByAssemblySession() {
    this.getNoticesListByOwner();

  }
  viewQuestion(list: QuestionList) {
    this.statusParam = this.statusParam ? this.statusParam : "";
    if (list.status === "SAVED" || list.status === "QUESTION_BANK") {
      this.router.navigate(["question-edit", list.id, this.statusParam],
        { relativeTo: this.route.parent });
      // this.router.navigate([
      //   "business-dashboard/question/question-edit",
      //   list.id,
      //   this.statusParam,
      // ]);
    } else if (this.primaryFlag) {
      this.router.navigate(["question-view", list.id,
        this.statusParam,
        this.primaryFlag],
        { relativeTo: this.route.parent });
      // this.router.navigate([
      //   "business-dashboard/question/question-view",
      //   list.id,
      //   this.statusParam,
      //   this.primaryFlag,
      // ]);
    } else {
      this.router.navigate(["question-view", list.id, this.statusParam],
        { relativeTo: this.route.parent });
      // this.router.navigate([
      //   "business-dashboard/question/question-view",
      //   list.id,
      //   this.statusParam,
      // ]);
    }
  }
  currentPageDataChange($event): void {
    this.listOfDisplayData = $event;
    this.refreshStatus();
  }
  refreshStatus(): void {
    this.numberOfChecked = this.listOfDisplayData.filter(
      (item) => this.mapOfCheckedId[item.id]
    ).length;
    this.isAllDisplayDataChecked = this.listOfDisplayData.every(
      (item) => this.mapOfCheckedId[item.id]
    );
  }
  _applyFilterForAssembly(res) {
    if (this.filterSelected) {
      this.searchCol(this.filterSelected);
    } else {
      if (this.sortbyId) {
        this.listOfData;
      } else {
        this.listOfData = res;
      }
    }
    this.sortbyId = false;
  }
  _checkAllRows(value: boolean): void {
    this.listOfDisplayData.forEach(
      (item) => (this.mapOfCheckedId[item.id] = value)
    );
    this.refreshStatus();
  }
  _chooseFilter(box) {
    box.checked = !box.checked;
  }
  _showFilter(): void {
    this.isVisibleFilter = false;
    const tablefilter = this.tablefiltrParams.disable;
    tablefilter.questionheadingdisable = this.filterCheckboxes.find(
      (element) =>
        element.label === "Question Heading" ||
        element.label === "Notice Heading"
    ).checked;
    tablefilter.subjectdisable = this.filterCheckboxes.find(
      (element) => element.label === "Subject"
    ).checked;
    // tablefilter.designationdisable = this.filterCheckboxes.find(
    //   (element) => element.label === "Designation"
    // ).checked;
    // tablefilter.prioritydisable = this.filterCheckboxes.find(
    //   (element) => element.label === "Priority"
    // ).checked;
    // tablefilter.statusdisable = this.filterCheckboxes.find(
    //   (element) => element.label === "Status"
    // ).checked;
    this._loadSelectedfilterData();
  }
  _hideFilter(): void {
    this.isVisibleFilter = false;
    if (this.isVisibleFilter == false) {
      this.clearFilter();
    }
  }
  sort(sort: { key: string; value: string }): void {
    this.sortName = sort.key;
    this.sortValue = sort.value;
    this.search();
  }
  search(): void {
    const filterFunc = (item: { name: string; age: number; address: string }) =>
      (this.searchAddress
        ? item.address.indexOf(this.searchAddress) !== -1
        : true) &&
      (this.listOfSearchName.length
        ? this.listOfSearchName.some((name) => item.name.indexOf(name) !== -1)
        : true);
    const data = this.listOfData.filter((item) => filterFunc(item));
    /** sort data **/
    if (this.sortName && this.sortValue) {
      this.listOfData = data.sort((a, b) =>
        this.sortValue === "ascend"
          ? a[this.sortName!] > b[this.sortName!]
            ? 1
            : -1
          : b[this.sortName!] > a[this.sortName!]
            ? 1
            : -1
      );
    } else {
      this.listOfData = data;
    }
  }
  DoNothing() {
    return false;
  }
  clearFilter() {
    this.searchParam = "";
    this._setFilterValue();
    this.searchCol(this.filterSelected);
    this._loadSelectedfilterData();
  }
  onSearchUser() {
    if (this.searchParam) {
      this.listOfData = this.listOfAllData.filter(
        (element) =>
          (element.heading &&
            element.heading
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.subjectName &&
            element.subjectName
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.portfolioName &&
            element.portfolioName
              .toLowerCase()
              .includes(this.searchParam.toLowerCase()))
      );
    } else {
      this.listOfData = this.listOfAllData;
    }
  }
  disableFilter(fliterNum) {
    const tablefilter = this.tablefiltrParams.disable;
    switch (fliterNum) {
      case 1:
        tablefilter.submittedbydisable = false;
        this.filterSelected["primaryMemberName"] = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label === "Submitted By") {
            element.checked = false;
          }
        });
      case 2:
        tablefilter.categorydisable = false;
        this.filterSelected["category"] = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label === "Category") {
            element.checked = false;
          }
        });
        break;
      case 3:
        tablefilter.questionheadingdisable = false;
        this.filterSelected["heading"] = null;
        this.filterCheckboxes.forEach((element) => {
          if (
            element.label === "Question Heading" ||
            element.label === "Notice Heading"
          ) {
            element.checked = false;
          }
        });
        break;
      case 4:
        tablefilter.subjectdisable = false;
        this.filterSelected["subjectName"] = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label == "Subject") {
            element.checked = false;
          }
        });
        break;
      case 5:
        tablefilter.questiondatedisable = false;
        this.filterSelected["questionDate"] = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label == "Question Date") {
            element.checked = false;
          }
        });
        break;
      case 6:
        tablefilter.regdatedisable = false;
        this.filterSelected["registrationDate"] = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label == "Created Date") {
            element.checked = false;
          }
        });
        break;
      case 7:
        tablefilter.prioritydisable = false;
        this.filterSelected["priority"] = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label == "Priority") {
            element.checked = false;
          }
        });
        break;
      case 8:
        tablefilter.statusdisable = false;
        this.filterSelected["status"] = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label == "Status") {
            element.checked = false;
          }
        });
        break;
      case 9:
        tablefilter.noticenumberdisable = false;
        this.filterSelected["noticeNumber"] = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label == "Notice Number") {
            element.checked = false;
          }
        });
        break;
      // case 10:
      //   tablefilter.designationdisable = false;
      //   this.filterSelected["designation"] = null;
      //   this.filterCheckboxes.forEach((element) => {
      //     if (element.label == "Designation") {
      //       element.checked = false;
      //     }
      //   });
      //   break;
      default:
        break;
    }
    this.searchCol(this.filterSelected);
    this._loadSelectedfilterData();
  }
  _loadSelectedfilterData() {
    const tablefilter = this.tablefiltrParams.disable;
    const tablefiltrData = this.tablefiltrParams.data;
    const self = this;
    let counter1 = 0;
    let counter2 = 0;
    let counter3 = 0;
    let counter4 = 0;
    let counter5 = 0;
    let counter6 = 0;
    let counter7 = 0;
    let counter8 = 0;
    let counter9 = 0;
    let counter10 = 0;
    tablefilter.submittedbydisable
      ? Object.keys(self.listOfAllData).forEach(function (key) {
        counter1++;
        tablefiltrData.submittedBy.push(
          self.listOfAllData[key].primaryMemberName
        );
        if (counter1 == self.listOfAllData.length) {
          tablefiltrData.submittedBy = tablefiltrData.submittedBy.filter(
            (v, i, a) => a.indexOf(v) === i
          );
          tablefiltrData.submittedBy.forEach((element) => {
            if (element) {
              element = element.trim();
              element = element.replace(/\s+/g, " ");
            }
          });
          tablefiltrData.submittedBy.sort((a, b) =>
            a.toLowerCase() > b.toLowerCase() ? 1 : -1
          );
        }
      })
      : "";
    tablefilter.questionheadingdisable
      ? Object.keys(self.listOfAllData).forEach(function (key) {
        counter2++;
        tablefiltrData.questionheading.push(self.listOfAllData[key].heading);
        if (counter2 == self.listOfAllData.length) {
          tablefiltrData.questionheading = tablefiltrData.questionheading.filter(
            (v, i, a) => a.indexOf(v) === i
          );
        }
      })
      : "";
    tablefilter.subjectdisable
      ? Object.keys(self.listOfAllData).forEach(function (key) {
        counter3++;
        tablefiltrData.subject.push(self.listOfAllData[key].subjectName);
        if (counter3 == self.listOfAllData.length) {
          tablefiltrData.subject = tablefiltrData.subject.filter(
            (v, i, a) => a.indexOf(v) === i
          );
        }
      })
      : "";
    tablefilter.questiondatedisable
      ? Object.keys(self.listOfAllData).forEach(function (key) {
        counter4++;
        tablefiltrData.questiondate.push(
          self.listOfAllData[key].questionDate
        );
        if (counter4 == self.listOfAllData.length) {
          tablefiltrData.questiondate = tablefiltrData.questiondate.filter(
            (v, i, a) => a.indexOf(v) === i
          );
          tablefiltrData.questiondate.sort();
        }
      })
      : "";
    tablefilter.regdatedisable
      ? Object.keys(self.listOfAllData).forEach(function (key) {
        counter5++;
        tablefiltrData.regdate.push(self.listOfAllData[key].registrationDate);
        if (counter5 == self.listOfAllData.length) {
          tablefiltrData.regdate = tablefiltrData.regdate.filter(
            (v, i, a) => a.indexOf(v) === i
          );
          tablefiltrData.regdate.sort();
        }
      })
      : "";
    tablefilter.prioritydisable
      ? Object.keys(self.listOfAllData).forEach(function (key) {
        counter6++;
        tablefiltrData.priority.push(self.listOfAllData[key].priority);
        if (counter6 == self.listOfAllData.length) {
          tablefiltrData.priority = tablefiltrData.priority.filter(
            (v, i, a) => a.indexOf(v) === i
          );
        }
      })
      : "";
    tablefilter.statusdisable
      ? Object.keys(self.listOfAllData).forEach(function (key) {
        counter7++;
        tablefiltrData.status.push(self.listOfAllData[key].status);
        if (counter7 == self.listOfAllData.length) {
          tablefiltrData.status = tablefiltrData.status.filter(
            (v, i, a) => a.indexOf(v) === i
          );
        }
      })
      : "";
    tablefilter.categorydisable
      ? Object.keys(self.listOfAllData).forEach(function (key) {
        counter8++;
        tablefiltrData.category.push(self.listOfAllData[key].category);
        if (counter8 == self.listOfAllData.length) {
          tablefiltrData.category = tablefiltrData.category.filter(
            (v, i, a) => a.indexOf(v) === i
          );
        }
      })
      : "";
    tablefilter.noticenumberdisable
      ? Object.keys(self.listOfAllData).forEach(function (key) {
        counter9++;
        const clubbedMemberDetails = self.listOfAllData[key].clubbingDetails;
        clubbedMemberDetails.forEach(function (key) {
          tablefiltrData.noticeNumbers.push(key.noticeNumber);
        });
        if (counter1 === self.listOfAllData.length) {
          tablefiltrData.noticeNumbers = tablefiltrData.noticeNumbers.filter(
            (v, i, a) => a.indexOf(v) === i
          );
        }
      })
      : "";

    // tablefilter.designationdisable
    //   ? Object.keys(self.listOfAllData).forEach(function (key) {
    //     counter10++;
    //     tablefiltrData.questionheading.push(self.listOfAllData[key].portfolioName);
    //     if (counter10 == self.listOfAllData.length) {
    //       tablefiltrData.designations = tablefiltrData.designations.filter(
    //         (v, i, a) => a.indexOf(v) === i
    //       );
    //     }
    //   })
    //   : "";
  }
  searchCol(filter: any) {
    if (!filter) {
      this.listOfData = this.listOfAllData;
    } else {
      this.listOfData = this.listOfAllData.filter((item: any) =>
        this.applyFilter(item, filter)
      );
    }
  }
  applyFilter(element: any, filter: any): boolean {
    for (const field in filter) {
      if (filter[field]) {
        if (field === "noticeNumber") {
          element.clubbingDetails.forEach(function (clubbed) {
            if (
              !clubbed[field] ||
              clubbed[field].toLowerCase() !== filter[field].toLowerCase()
            ) {
              console.log(!clubbed[field]);
              console.log(
                clubbed[field].toLowerCase() !== filter[field].toLowerCase()
              );
              return false;
            } else if (typeof filter[field] === "number") {
              if (clubbed[field] !== filter[field]) {
                return false;
              }
            }
          });
        } else if (field === "heading") {
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
        } else if (field === "subjectName") {
          if (typeof filter[field] === "string") {
            if (
              !element[field] ||
              element[field].toLowerCase() !== filter[field].toLowerCase()
            ) {
              return false;
            }
          } else if (typeof filter[field] === "number") {
            if (element[field] !== filter[field]) {
              return false;
            }
          }
        } else if (field === "category") {
          if (
            !element[field] ||
            element[field].toLowerCase() !== filter[field].toLowerCase()
          ) {
            return false;
          }
        } else if (field === "type") {
          if (
            !element[field] ||
            element[field].toLowerCase() !== filter[field].toLowerCase()
          ) {
            return false;
          }
        } else {
          if (typeof filter[field] === "string") {
            if (
              !element[field] ||
              element[field]
                .toLowerCase()
                .indexOf(filter[field].toLowerCase()) === -1
            ) {
              return false;
            }
          } else if (typeof filter[field] === "number") {
            if (element[field] !== filter[field]) {
              return false;
            }
          }
        }
      }
    }
    return true;
  }
  showModal(): void {
    this.isVisibleFilter = true;
  }
  _redirectToList() {
    this.getNoticesListByOwner();

  }
  _IslistNotice() {
    if (this.router.url.includes("list-mla-ntc") || this.router.url.includes("question-bank")) {
      return true;
    }
    return false;
  }
  _defineRoles() {
    return ["MLA", "parliamentaryPartySecretary", "assistant"];
  }
  isMLA() {
    if (
      this.auth.getCurrentUser().authorities.includes(this._defineRoles()[10])
    ) {
      return false;
    }
    return this.auth
      .getCurrentUser()
      .authorities.includes(this._defineRoles()[0]);
  }
  _setFilterValue() {
    this.tablefiltrParams.disable = {
      categorydisable: true,
      questionheadingdisable: false,
      subjectdisable: false,
      questiondatedisable: true,
      regdatedisable: false,
      prioritydisable: false,
      submittedbydisable: true,
      statusdisable: false,
      noticenumberdisable: false,
      designationdisable: false
    };
    this.tablefiltrParams.data = {
      noticeNumbers: [],
      category: [],
      questionheading: [],
      submittedBy: [],
      subject: [],
      questiondate: [],
      regdate: [],
      priority: [],
      status: [],
      minister: [],
      designations: []
    };
    this.filterCheckboxes = [
      // { label: "Designation", checked: false },
      //{ label: "Category", checked: false },
      { label: "Question Heading", checked: false },
      { label: "Subject", checked: false },
      // { label: "Question Date", checked: false },
      // { label: "Created Date", checked: false },
      // { label: "Priority", checked: false },
      // { label: "Status", checked: false },
    ];
    this.filterSelected = {
      noticeNumber: null,
      category: null,
      heading: null,
      subjectName: null,
      questionDate: null,
      registrationDate: null,
      priority: null,
      status: null,
      type: null,
      primaryMemberName: null,
      designation: null
    };
    if (this._IslistNotice()) {
      let find = this.filterCheckboxes[
        this.filterCheckboxes.findIndex((x) => x.label === "Question Heading")
      ];
      find.label = "Notice Heading";
    }
  }
  addtobank() {
    this.router.navigate(["addtobank"], { relativeTo: this.route.parent });
  }
}
