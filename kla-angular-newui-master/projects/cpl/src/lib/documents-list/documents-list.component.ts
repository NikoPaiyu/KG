import { Component, OnInit } from "@angular/core";
import { Data } from "@angular/router";
import { CplService } from "../cpl.service";
import { DocumentsService } from "../shared/services/documents.service";
import { Router, ActivatedRoute } from "@angular/router";
import { CplDocs } from "../shared/models/registration";
import { CommonService } from "../shared/services/common.service";
import { DatePipe } from "@angular/common";
@Component({
  selector: "cpl-documents-list",
  templateUrl: "./documents-list.component.html",
  styleUrls: ["./documents-list.component.scss"],
  providers: [DatePipe],
})
export class DocumentsListComponent implements OnInit {
  DocList: any = [];
  listOfDoc: any = [];
  listOfCurrentPageData: Data[] = [];
  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<number>();
  isCreateVisible = false;
  isAttachVisible = false;
  createAttach = false;
  attachList: any = [];
  numDocs = 0;
  docListTables: any = [];
  refreshList: any = [];
  layingList: any = [];
  viewDocs = false;
  assemblyList = [];
  sessionList = [];
  assemblyId = null;
  sessionId = null;
  layingdate: any;
  docBody = new CplDocs();
  allotmentDateId = 0;
  docIds: any = ["334ba147-5f3a-4788-9856-bfa2b6e0f91c"];
  fileId = 1;
  layingDate;
  date;
  status;
  documentsList: any = ["334ba147-5f3a-4788-9856-bfa2b6e0f91c"];
  isLaid: any = null;
  searchList: any = null;
  tempList: any;
  showListFilterModal = false;
  filterListCheckboxes = [
    { label: "Laying Date", checked: false },
    { label: "No. of Documents", checked: false },
    { label: "File No.", checked: false },
    { label: "Status", checked: false },
  ];
  disableLaying = false;
  disableTable = false;
  disableFileNum = false;
  disableStatus = false;
  listFilterSelected = {
    layingDate: null,
    docCount: null,
    fileNumber: null,
    status: null,
  };
  docCount = [];
  layingDates = [];
  statuses = [];
  fileNum = [];
  listTemp: any;
  list: any;
  activeSession: any;
  assemblySession: any = null;

  constructor(
    private docService: DocumentsService,
    private router: Router,
    private commonService: CommonService,
    public route: ActivatedRoute,
    public datepipe: DatePipe
  ) {}

  ngOnInit() {
    // this.getRefreshList();
    // this.saveDocumentList();
    // this.getAssemblyList();
    // this.getSessionList();
    // this.commonService.sharedAssemblyId.subscribe(
    //   (id) => (this.assemblyId = id)
    // );
    // this.commonService.sharedSessionId.subscribe((id) => (this.sessionId = id));
    this.route.params.subscribe((params) => {
      this.isLaid = params.laid;
      if (this.isLaid) {
      } else {
        this.getLayingList();
      }
    });
    this.getAllAssemblyAndSession();
  }

  getAllAssemblyAndSession() {
    this.docService.getAllAssemblyAndSession().subscribe((Response: any) => {
      this.assemblySession = Response.assemblySession;
      this.activeSession  = Response.activeAssemblySession;
      this.assemblyId = Response.activeAssemblySession.assemblyId;
      this.assemblyList = Response.assembly;
      this.getSessionForAssembly();
      this.sessionId = Response.activeAssemblySession.sessionId;
      this.getLayingList();
    });
  }

  getSessionForAssembly() {
    this.sessionId = null;
    this.sessionList = [];
      if (this.assemblyId && this.assemblySession.find(x => x.id === this.assemblyId)) {
        this.sessionId = null;
        this.sessionList = this.assemblySession.find(x => x.id === this.assemblyId).session;
      }
  }

  // currentAssemblyAndSession() {
  //   this.commonService.getCurrentAssemblyAndSession().subscribe((Res: any) => {
  //     this.activeSession = Res;
  //     // this.assemblyId = this.activeSession.assemblyId;
  //     // this.sessionId = this.activeSession.sessionId;
  //     // if (this.assemblyId && this.sessionId) {
  //     //   this.getLayingList();
  //     // }
  //   });
  // }

  // getAssemblyList() {
  //   this.docService.getAllAssembly().subscribe((Response) => {
  //     this.assemblyList = Response;
  //     this.assemblyId = this.activeSession.assemblyId;
  //     // const result = this.assemblyList.map((x) => x.id);
  //     // const maxValue = Math.max.apply(null, result);
  //     // this.assemblyId = maxValue;
  //     this.docService.getAllSession().subscribe((Res) => {
  //       this.sessionList = Res;
  //       this.sessionId = this.activeSession.sessionId;
  //       // const res = this.sessionList.map((x) => x.id);
  //       // const maxVal = Math.max.apply(null, res);
  //       // this.sessionId = maxVal;
  //       this.getLayingList();
  //     });
  //   });
  // }

  // getSessionList() {
  //   this.docService.getAllSession().subscribe((Response) => {
  //     this.sessionList = Response;
  //     // this.sessionId = this.activeSession.sessionId;
  //     const result = this.sessionList.map((x) => x.id);
  //     const maxValue = Math.max.apply(null, result);
  //     this.sessionId = maxValue;
  //     this.getLayingList();
  //   });
  // }

  onCurrentPageDataChange(listOfCurrentPageData: Data[]): void {
    this.listOfCurrentPageData = listOfCurrentPageData;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    const listOfEnabledData = this.listOfCurrentPageData.filter(
      ({ disabled }) => !disabled
    );
    this.checked = listOfEnabledData.every(({ id }) =>
      this.setOfCheckedId.has(id)
    );
    this.indeterminate =
      listOfEnabledData.some(({ id }) => this.setOfCheckedId.has(id)) &&
      !this.checked;
  }

  onAllChecked(checked: boolean): void {
    this.listOfCurrentPageData
      .filter(({ disabled }) => !disabled)
      .forEach(({ id }) => this.updateCheckedSet(id, checked));
    this.refreshCheckedStatus();
  }

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  showCreateModal(): void {
    this.createAttach = true;
    this.isCreateVisible = true;
  }

  showAttachModal() {
    this.createAttach = false;
    this.isAttachVisible = true;
  }

  handleCancel() {
    this.isCreateVisible = false;
    this.isAttachVisible = false;
  }

  getDoCList() {
    if (this.assemblyId && this.sessionId) {
      this.commonService.newAssemblyId(this.assemblyId);
      this.commonService.newSessionId(this.sessionId);
      // this.docService.getAllDocuments(this.assemblyId, this.sessionId).subscribe(Response => {
      //   this.docListTables = Response;
      // });
    }
  }

  viewDocument(id) {
    this.router.navigate(["business-dashboard/cpl/cpl-view", "veiw", id]);
  }

  getLayingList() {
    if (this.assemblyId === null || this.sessionId === null) {
      this.layingList = [];
    } else {
      if (this.assemblyId && this.sessionId) {
        this.docService
          .getLayingDateList(this.assemblyId, this.sessionId)
          .subscribe((Response) => {
            this.layingList = Response;
            this.tempList = this.layingList;
            this.list = this.layingList;
          });
      }
    }
  }

  docPreparation() {
    this.router.navigate(["business-dashboard/cpl/document-preparation"]);
  }

  viewFileOrDoc(fileId, listId) {
    if (fileId == 0 || fileId == null) {
      this.router.navigate([
        "business-dashboard/cpl/document-preparation",
        listId,
      ]);
    } else {
      this.router.navigate(["business-dashboard/cpl/file-workflow", fileId]);
    }
  }

  searchDocList() {
    if (this.searchList) {
      this.layingList = this.tempList.filter(
        (element) =>
          element.docCount.toString().includes(this.searchList) ||
          (element.fileNumber &&
            element.fileNumber
              .toLowerCase()
              .includes(this.searchList.toLowerCase())) ||
          this.datepipe
            .transform(element.layingDate, "dd-MM-yyyy")
            .toString()
            .includes(this.searchList) ||
          element.status.toLowerCase().includes(this.searchList.toLowerCase())
      );
    } else {
      this.layingList = this.tempList;
    }
  }

  showFilterModal() {
    this.showListFilterModal = true;
  }

  _hideFilter() {
    this.showListFilterModal = false;
  }

  _showListFilter() {
    this.showListFilterModal = false;
    this.disableLaying = this.filterListCheckboxes.find(
      (element) => element.label === "Laying Date"
    ).checked;
    this.disableTable = this.filterListCheckboxes.find(
      (element) => element.label === "No. of Documents"
    ).checked;
    this.disableFileNum = this.filterListCheckboxes.find(
      (element) => element.label === "File No."
    ).checked;
    this.disableStatus = this.filterListCheckboxes.find(
      (element) => element.label === "Status"
    ).checked;
    this._loadListFilterData();
  }

  _chooseFilter(box) {
    box.checked = !box.checked;
  }

  _loadListFilterData() {
    const self = this;
    let counter1 = 0;
    let counter2 = 0;
    let counter3 = 0;
    let counter4 = 0;

    this.disableLaying
      ? Object.keys(self.layingList).forEach(function (key) {
          counter1++;
          self.layingDates.push(self.layingList[key].layingDate);
          if (counter1 == self.layingList.length) {
            self.layingDates = self.layingDates.filter(
              (v, i, a) => a.indexOf(v) === i
            );
          }
        })
      : "";

    this.disableTable
      ? Object.keys(self.layingList).forEach(function (key) {
          counter2++;
          self.docCount.push(self.layingList[key].docCount);
          if (counter2 == self.layingList.length) {
            self.docCount = self.docCount.filter(
              (v, i, a) => a.indexOf(v) === i
            );
          }
        })
      : "";

    this.disableFileNum
      ? Object.keys(self.layingList).forEach(function (key) {
          counter3++;
          self.fileNum.push(self.layingList[key].fileNumber);
          if (counter3 == self.layingList.length) {
            self.fileNum = self.fileNum.filter((v, i, a) => a.indexOf(v) === i);
          }
        })
      : "";

    this.disableStatus
      ? Object.keys(self.layingList).forEach(function (key) {
          counter4++;
          self.statuses.push(self.layingList[key].status);
          if (counter4 == self.layingList.length) {
            self.statuses = self.statuses.filter(
              (v, i, a) => a.indexOf(v) === i
            );
          }
        })
      : "";
  }

  searchListCol(filter) {
    if (!filter) {
      this.layingList = this.tempList;
    } else {
      this.layingList = this.tempList.filter((item: any) =>
        this.applyFilter(item, filter)
      );
    }
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

  disableListFilter(value) {
    switch (value) {
      case 1:
        this.disableLaying = false;
        this.listFilterSelected.layingDate = null;
        this.filterListCheckboxes.forEach((element) => {
          if (element.label == "Laying Date") {
            element.checked = false;
          }
        });
        break;
      case 2:
        this.disableTable = false;
        this.listFilterSelected.docCount = null;
        this.filterListCheckboxes.forEach((element) => {
          if (element.label == "No. of Documents") {
            element.checked = false;
          }
        });
        break;
      case 3:
        this.disableFileNum = false;
        this.listFilterSelected.fileNumber = null;
        this.filterListCheckboxes.forEach((element) => {
          if (element.label == "File No.") {
            element.checked = false;
          }
        });
        break;
      case 4:
        this.disableStatus = false;
        this.listFilterSelected.status = null;
        this.filterListCheckboxes.forEach((element) => {
          if (element.label == "Status") {
            element.checked = false;
          }
        });
        break;
      default:
        break;
    }
    this.searchListCol(this.listFilterSelected);
    this._loadListFilterData();
  }
}
