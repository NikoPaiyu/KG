import { Component, OnInit, Inject } from "@angular/core";
import { FileServiceService } from "../../shared/services/file-service.service";
import { Router, ActivatedRoute } from "@angular/router";
import { forkJoin } from "rxjs";
import { CommitteecommonService } from "../../shared/services/committeecommon.service";

@Component({
  selector: "committee-file-list",
  templateUrl: "./file-list.component.html",
  styleUrls: ["./file-list.component.css"],
})
export class FileListComponent implements OnInit {
  fileHeading;
  isAllDisplayDataChecked = false;
  tablefiltrParams: any = { disable: {}, data: {} };
  isVisibleFilter = false;
  listOfData = [];
  listOfDisplayData = [];
  listOfAllData = [];
  sortName: string | null = null;
  sortValue: string | null = null;
  searchParam = "";
  searchAddress: string;
  listOfSearchName: string[] = [];
  filterCheckboxes: any = [];
  filterSelected: object;
  statusParam: any;

  type = "COMMITTEE";
  typeLabel = "";
  fileCreateModel;
  buttonList: any;
  ratification = false;
  ratificationList: any;
  tempRatificationList: any;
  showPullModal = false;
  subType = null;
  subTypeLabel = "";
  assemblyId = null; // Active Assembly
  assembly = null;
  sessionId = null; //Active session
  session = null;
  assemblyList = [];
  sessionList = [];
  assemblySession: any;
  constructor(
    private file: FileServiceService,
    private router: Router,
    private route: ActivatedRoute,
    public common: CommitteecommonService,
    @Inject("authService") private auth
  ) {
    this._setFilterValue();
    this.common.setCommitteePermissions(auth.getCurrentUser().rbsPermissions);
  }
  ngOnInit() {
    if (this.router.url.includes("files/meeting-files")) {
      this.fileHeading = "MEETING FILES";
      this.type = "COMMITTEE_MEETING";
      this.subType = "COMMITTEE_MEETING";
      this.subTypeLabel = "COMMITTEE MEETING";
    } else if (this.router.url.includes("files/report-files")) {
      this.fileHeading = "REPORT FILES";
      this.type = "COMMITTEE_MEETING";
      this.subType = "MEETING_REPORT";
      this.subTypeLabel = "MEETING REPORT";
    } else {
      this.fileHeading = "COMMITTEE FILES";
      this.type = "COMMITTEE";
      this.subType = "COMMITTEE_FILE";
      this.subTypeLabel = "COMMITTEE";
    }
    this.getAssemblySession();
  }
  isAssistant() {
    return this.auth.getCurrentUser().authorities.includes("assistant");
  }
  getAssemblySession() {
    this.common.getAllAssemblyandSession().subscribe((Response: any) => {
      if (Response) {
        this.assemblySession = Response.assemblySession;
        this.assemblyList = Response.assembly;
        this.assemblyList.push({
          id: 0,
          assemblyId: "No Assembly",
        });
        this.assemblyId = Response.activeAssemblySession.assemblyId;
        this.getSessionList();
        this.sessionId = Response.activeAssemblySession.sessionId;
        this.getPendingFiles();
        // this.getAllFiles();
      }
      if (this.common.doIHaveAnAccess("FILE_RATIFICATION", "APPROVE")) {
        this.ratification = true;
        this.getPendingRatification();
      }
    });
  }
  // get session for assembly
  getSessionList() {
    this.sessionId = null;
    if (
      this.assemblyId === 0 ||
      !(
        this.assemblyId &&
        this.assemblySession.find((x) => x.id === this.assemblyId)
      )
    ) {
      this.sessionList = [
        {
          id: 0,
          sessionId: "No Session",
        },
      ];
    } else if (
      this.assemblyId &&
      this.assemblySession.find((x) => x.id === this.assemblyId)
    ) {
      this.sessionList = this.assemblySession.find(
        (x) => x.id === this.assemblyId
      ).session;
    }
  }

  getPendingFiles() {
    // tslint:disable-next-line: max-line-length
    this.file
      .getPendingFiles(
        this.auth.getCurrentUser().userId,
        this.assemblyId,
        this.sessionId,
        this.type
      )
      .subscribe((Res: any) => {
        if(this.type === "COMMITTEE"){
          this.listOfData = this.listOfAllData = Res.filter(
            (x) => x.type === this.type
          );
        }else{
          this.listOfData = this.listOfAllData = Res.filter(
            (x) => x.subtype === this.subType
          );
        }
      });
  }
  getAllFiles() {
    const body = {
      assemblyId: this.assemblyId,
      sessionId: this.sessionId,
      status: null,
      type: this.type,
      userId: this.auth.getCurrentUser().userId,
    };
    this.file.getAllFiles(body).subscribe((Res: any) => {
      if(this.type === "COMMITTEE"){
        this.listOfData = this.listOfAllData = Res.filter(
          (x) => x.type === this.type
        );
      }else{
        this.listOfData = this.listOfAllData = Res.filter(
          (x) => x.subtype === this.subType
        );
      }
    });
  }
  getMyFiles() {
    this.file
      .approvedByHigherOfficial(this.auth.getCurrentUser().userId)
      .subscribe((Res: any) => {
        if(this.type === "COMMITTEE"){
          this.listOfData = this.listOfAllData = Res.filter(
            (x) => x.type === this.type
          );
        }else{
          this.listOfData = this.listOfAllData = Res.filter(
            (x) => x.subtype === this.subType
          );
        }
      });
  }
  getPendingRatification() {
    const body = {
      type: this.type,
      assemblyId: this.assemblyId,
      sessionId: this.sessionId,
      userId: this.auth.getCurrentUser().userId,
      // subtype: this.subType,
      // status: 'APPROVED',
    };
    this.file.getPendingRatification(body).subscribe((Res: any) => {
      if (this.fileHeading === "REPORT FILES") {
        this.ratificationList = Res.filter(
          (x) => x.subtype === "MEETING_REPORT"
        );
      } else if (this.fileHeading === "MEETING FILES") {
        this.ratificationList = Res.filter(
          (x) => x.subtype === "COMMITTEE_MEETING"
        );
      } else {
        this.ratificationList = Res;
      }
      this.tempRatificationList = this.ratificationList;
    });
  }
  sortbyAssemblyAndSessionId(res) {
    this.listOfAllData = res.filter(
      (el) =>
        el.assemblyId === this.assemblyId && el.sessionId === this.sessionId
    );
    this.listOfDisplayData = this.listOfAllData;
    this._applyFilterForAssembly(this.listOfDisplayData);
    this.onSearch();
  }
  viewQuestion() {}
  _applyFilterForAssembly(res) {
    if (this.filterSelected) {
      this.searchCol(this.filterSelected);
    } else {
      this.listOfData = res;
    }
  }
  _chooseFilter(box) {
    box.checked = !box.checked;
  }
  _showFilter(): void {
    this.isVisibleFilter = false;
    const tablefilter = this.tablefiltrParams.disable;
    tablefilter.fileNumber = this.filterCheckboxes.find(
      (element) => element.label === "File Number"
    ).checked;
    tablefilter.subject = this.filterCheckboxes.find(
      (element) => element.label === "File Subject"
    ).checked;
    tablefilter.priority = this.filterCheckboxes.find(
      (element) => element.label === "Priority"
    ).checked;
    tablefilter.subtype = this.filterCheckboxes.find(
      (element) => element.label === "File Type"
    ).checked;
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
  clearFilter() {
    this.searchParam = "";
    this._setFilterValue();
    this.searchCol(this.filterSelected);
    this._loadSelectedfilterData();
  }
  onSearch() {
    this.searchCol(this.filterSelected);
  }
  inputSearch() {
    if (this.searchParam) {
      this.listOfData = this.listOfData.filter(
        (element) =>
          (element.fileNumber &&
            element.fileNumber
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.subject &&
            element.subject
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.priority &&
            element.priority
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.subtype &&
            element.subtype
              .toLowerCase()
              .includes(this.searchParam.toLowerCase()))
      );
      return;
    }
  }
  disableFilter(fliterNum) {
    const tablefilter = this.tablefiltrParams.disable;
    switch (fliterNum) {
      case 1:
        tablefilter.fileNumber = false;
        this.filterSelected["fileNumber"] = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label === "File Number") {
            element.checked = false;
          }
        });
      case 2:
        tablefilter.priority = false;
        this.filterSelected["priority"] = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label === "Priority") {
            element.checked = false;
          }
        });
        break;
      case 3:
        tablefilter.subject = false;
        this.filterSelected["subject"] = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label === "File Subject") {
            element.checked = false;
          }
        });
        break;
      case 4:
        tablefilter.subtype = false;
        this.filterSelected["subtype"] = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label == "File Type") {
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
  _loadSelectedfilterData() {
    const tablefilter = this.tablefiltrParams.disable;
    const tablefiltrData = this.tablefiltrParams.data;
    const self = this;
    let counter1 = 0;
    let counter2 = 0;
    let counter3 = 0;
    let counter4 = 0;
    tablefilter.fileNumber
      ? Object.keys(self.listOfAllData).forEach(function (key) {
          counter1++;
          tablefiltrData.fileNumber.push(self.listOfAllData[key].fileNumber);
          if (counter1 == self.listOfAllData.length) {
            tablefiltrData.fileNumber = tablefiltrData.fileNumber.filter(
              (v, i, a) => a.indexOf(v) === i
            );
            tablefiltrData.fileNumber.sort((a, b) =>
              a.toLowerCase() > b.toLowerCase() ? 1 : -1
            );
          }
        })
      : "";
    tablefilter.priority
      ? Object.keys(self.listOfAllData).forEach(function (key) {
          counter2++;
          tablefiltrData.priority.push(self.listOfAllData[key].priority);
          if (counter2 === self.listOfAllData.length) {
            tablefiltrData.priority = tablefiltrData.priority.filter(
              (v, i, a) => a.indexOf(v) === i
            );
          }
        })
      : "";
    tablefilter.subject
      ? Object.keys(self.listOfAllData).forEach(function (key) {
          counter3++;
          tablefiltrData.subject.push(self.listOfAllData[key].subject);
          if (counter3 === self.listOfAllData.length) {
            tablefiltrData.subject = tablefiltrData.subject.filter(
              (v, i, a) => a.indexOf(v) === i
            );
          }
        })
      : "";
    tablefilter.subtype
      ? Object.keys(self.listOfAllData).forEach(function (key) {
          counter4++;
          tablefiltrData.subtype.push(self.listOfAllData[key].subtype);
          if (counter4 === self.listOfAllData.length) {
            tablefiltrData.subtype = tablefiltrData.subtype.filter(
              (v, i, a) => a.indexOf(v) === i
            );
          }
        })
      : "";
  }
  searchCol(filter: any) {
    if (!filter) {
      this.listOfData = this.listOfAllData;
    } else {
      this.listOfData = this.listOfAllData.filter((item: any) =>
        this.applyFilter(item, filter)
      );
    }
    this.inputSearch();
  }
  applyFilter(element: any, filter: any): boolean {
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
  showModal(): void {
    this.isVisibleFilter = true;
  }
  _setFilterValue() {
    this.tablefiltrParams.disable = {
      fileNumber: false,
      priority: false,
      subject: false,
      subtype: false,
      regDate: false,
    };
    this.tablefiltrParams.data = {
      fileNumber: [],
      priority: [],
      subject: [],
      subtype: [],
      regDate: [],
    };
    this.filterCheckboxes = [
      { label: "File Number", checked: false },
      { label: "File Subject", checked: false },
      { label: "Priority", checked: false },
      { label: "File Type", checked: false },
    ];
    this.filterSelected = {
      fileNumber: null,
      priority: null,
      subject: null,
      subtype: null,
      regDate: null,
    };
  }
  showCreateFilePopup(status) {
    this.fileCreateModel = status;
    if (!status) {
      this.getPendingFiles();
    }
  }
  clearSearch() {}
  viewFile(id) {
    this.router.navigate(["business-dashboard/committee/file-view/", id]);
  }
}
