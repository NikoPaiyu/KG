import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CommitteecommonService } from '../../../shared/services/committeecommon.service';
import { FileServiceService } from '../../../shared/services/file-service.service';

@Component({
  selector: 'committee-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.css']
})
export class FileListComponent implements OnInit {

  listOfData;
  showCreateModal;
  assemblySessionObj = {
    assembly: [],
    session: [],
    currentAssembly: "",
    currentSession: "",
    currentAssemblyLbl: "",
  };
  isVisibleFilter: boolean;
  filterCheckboxes: any = [];
  tablefiltrParams: any = { disable: {}, data: {} };
  listOfAllData = [];
  searchParam = "";
  filterSelected: object;
  type ='COMMITTEE';
  subType = 'COMMITTEE_FILE'

  constructor(private router: Router,
    public common: CommitteecommonService,
    @Inject("authService") private auth,
    private file: FileServiceService) {
      this.common.setCommitteePermissions(
        auth.getCurrentUser().rbsPermissions
      );
    }

  ngOnInit() {
    this.getAssemblySession();
  }
  getAssemblySession() {
    forkJoin(
      this.common.getAllAssembly(),
      this.common.getAllSession()
    ).subscribe(([assembly, session]) => {
      this.assemblySessionObj.assembly = assembly as Array<any>;
      const res = this.assemblySessionObj.assembly.map((x) => x.id);
      this.assemblySessionObj.currentAssembly = Math.max.apply(null, res);
      const labels = this.assemblySessionObj.assembly.map((x) => x.assemblyId);
      this.assemblySessionObj.currentAssemblyLbl = Math.max.apply(null, labels);
      this.assemblySessionObj.session = session as Array<any>;
      const response = this.assemblySessionObj.session.map((x) => x.id);
      this.assemblySessionObj.currentSession = Math.max.apply(null, response);
      this.getPendingFiles();
    });
  }

  getPendingFiles() {
    this.file.getPendingFiles(
        this.auth.getCurrentUser().userId,
        this.assemblySessionObj.currentAssembly,
        this.assemblySessionObj.currentSession,
        this.type).subscribe((Res: any) => {
          this.listOfData = this.listOfAllData = Res;
      });
  }
  getAllFiles() {
    const body = {
      assemblyId: this.assemblySessionObj.currentAssembly,
      sessionId: this.assemblySessionObj.currentSession,
      status: null,
      subtype: this.subType,
      type: this.type,
      userId: this.auth.getCurrentUser().userId
    };
    this.file.getAllFiles(body).subscribe((Res: any) => {
      this.listOfData = this.listOfAllData = Res;
    });
  }
  createCommitteeFile() {
    this.showCreateModal = true;
  }
  viewFile(fileId) {
    this.router.navigate(['business-dashboard/committee/pmbr-commitee/file-view/', fileId]);
  }
  showCreateFilePopup(status) {
    this.showCreateModal = status;
  }
  showModal(): void {
    this.isVisibleFilter = true;
  }
  _hideFilter(): void {
    this.isVisibleFilter = false;
    if (this.isVisibleFilter == false) {
      this.clearFilter();
    }
  }
  clearFilter() {
    this.searchParam = "";
    this._setFilterValue();
    this.searchCol(this.filterSelected);
    this._loadSelectedfilterData();
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
        tablefiltrData.fileNumber.push(
          self.listOfAllData[key].fileNumber
        );
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
        tablefiltrData.subtype.push(
          self.listOfAllData[key].subtype
        );
        if (counter4 === self.listOfAllData.length) {
          tablefiltrData.subtype = tablefiltrData.subtype.filter(
            (v, i, a) => a.indexOf(v) === i
          );
        }
      })
      : "";
  }
  _chooseFilter(box) {
    box.checked = !box.checked;
  }
  onSearch() {
    this.searchCol(this.filterSelected);
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
        if (typeof filter[field] === 'string') {
          if (
            !element[field] ||
            element[field].toLowerCase() !== filter[field].toLowerCase()
          ) {
            return false;
          }
        } else if (typeof filter[field] === 'number') {
          if (!element[field] || element[field] !== filter[field]) {
            return false;
          }
        }
      }
    }
    return true;
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
          if (
            element.label === "File Subject"
          ) {
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
}
