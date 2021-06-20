import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { differenceInCalendarDays, parseISO } from 'date-fns';
import { GovernersAddressService } from '../../shared/services/governersaddress.service';
import { TablescommonService } from '../../shared/services/tablescommon.service';
import { FileServiceService } from '../../shared/services/file-service.service';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { CreateGovComponent } from '../create-gov/create-gov.component';


@Component({
  selector: 'tables-list-governers-address',
  templateUrl: './list-governers-address.component.html',
  styleUrls: ['./list-governers-address.component.scss']
})
export class ListGovernersAddressComponent implements OnInit {
  isChecked = true;
  tablefiltrParams: any = { disable: {}, data: {} };
  isVisibleFilter = false;
  listOfData = [];
  listOfDisplayData = [];
  listOfAllData = [];
  sortName: string | null = null;
  sortValue: string | null = null;
  mapOfCheckedId: { [key: string]: boolean } = {};
  searchParam = '';
  searchAddress: string;
  listOfSearchName: string[] = [];
  filterCheckboxes: any = [];
  filterSelected: object;
  statusParam: any;
  sortbyId = false;
  assemblySession: object = [];
  coverLetterTitle = '';
  correspondance = { CoverLetterModel: false, coverLetterTitle: '', govId: '', type: '', fileId: '' }
  constructor(
    private router: Router,
    private governerAddrss: GovernersAddressService,
    private route: ActivatedRoute,
    private common: TablescommonService,
    private fb: FormBuilder,
    private file: FileServiceService,
    private notify: NzNotificationService,
    private modalService: NzModalService,
    @Inject('authService') public auth
  ) {
    this._setFilterValue();
  }
  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.getAssemblySession();
    });
  }
  getAssemblySession() {
    this.common.getAllAssemblyandSession().subscribe((res) => {
      if (res) {
        this.assemblySession = res;
        this.assemblySession['assembly'].currentassembly = res.activeAssemblySession.assemblyId
        this.findSessionListByAssembly(this.assemblySession['assembly'].currentassembly);
        this.assemblySession['session'].currentsession  = res.activeAssemblySession.sessionId;
        this.getGovernersddressList();     
      }
    });
  }
  findSessionListByAssembly(selAssembly) {
    if (this.assemblySession) {
      if (this.assemblySession['assemblySession'].
      find(
        (element) => element.id === selAssembly)) {
        let session = this.assemblySession['assemblySession'].find(
          (element) => element.id === selAssembly).session;
        this.assemblySession['session'] = session;     
        }
    }
  }
  getGovernersddressList() {
    this.governerAddrss.getGovernerAddrssList(null).subscribe((res: any) => {
      this.listOfDisplayData = this.listOfAllData = res;
      this.sortbyAssemblyAndSessionId(res);
    });
  }
  sortbyAssemblyAndSessionId(res) {
    this.listOfAllData = res.filter(
      (el) =>
        el.assemblyId == this.assemblySession["assembly"].currentassembly &&
        el.sessionId === this.assemblySession["session"].currentsession
    );
    this.listOfDisplayData = this.listOfAllData;
    this._applyFilterForAssembly(this.listOfDisplayData);
    this.onSearchUser();
    this.sortbyId = true;
  }
  currentPageDataChange($event): void {
    this.listOfDisplayData = $event;
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
  _chooseFilter(box) {
    box.checked = !box.checked;
  }
  _showFilter(): void {
    this.isVisibleFilter = false;
    const tablefilter = this.tablefiltrParams.disable;
    tablefilter.fileNumberdisable = this.filterCheckboxes.find(
      (element) =>
        element.label === "fileNumber"
    ).checked;
    tablefilter.datedisable = this.filterCheckboxes.find(
      (element) => element.label === "Date"
    ).checked;
    tablefilter.statusdisable = this.filterCheckboxes.find(
      (element) => element.label === "Status"
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
  DoNothing() {
    return false;
  }
  clearFilter() {
    this.searchParam = "";
    localStorage.clear();
    this._setFilterValue();
    this.searchCol(this.filterSelected);
    this._loadSelectedfilterData();
  }
  onSearchUser() {
    this.searchCol(this.filterSelected);
    this.inputSearch();
  }
  inputSearch() {
    if (this.searchParam) {
      this.listOfData = this.listOfData.filter(
        (element) =>
          (element.fileNumber &&
            element.fileNumber
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.date &&
            element.date
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.status &&
            element.status
              .toLowerCase()
              .includes(this.searchParam.toLowerCase()))
      );
    }
  }
  disableFilter(fliterNum) {
    const tablefilter = this.tablefiltrParams.disable;
    switch (fliterNum) {
      case 1:
        tablefilter.fileNumberdisable = false;
        this.filterSelected["fileNumber"] = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label === "fileNumber") {
            element.checked = false;
          }
        });
      case 2:
        tablefilter.datedisable = false;
        this.filterSelected["date"] = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label === "Date") {
            element.checked = false;
          }
        });
        break;
      case 3:
        tablefilter.statusdisable = false;
        this.filterSelected["status"] = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label == "Status") {
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
    tablefilter.fileNumber
      ? Object.keys(self.listOfAllData).forEach(function (key) {
        counter1++;
        tablefiltrData.fileNumber.push(self.listOfAllData[key].fileNumber);
        if (counter1 == self.listOfAllData.length) {
          tablefiltrData.fileNumber = tablefiltrData.fileNumber.filter(
            (v, i, a) => a.indexOf(v) === i
          );
        }
      })
      : "";
    tablefilter.datedisable
      ? Object.keys(self.listOfAllData).forEach(function (key) {
        counter2++;
        tablefiltrData.date.push(self.listOfAllData[key].date);
        if (counter2 == self.listOfAllData.length) {
          tablefiltrData.date = tablefiltrData.date.filter(
            (v, i, a) => a.indexOf(v) === i
          );
        }
      })
      : "";
    tablefilter.statusdisable
      ? Object.keys(self.listOfAllData).forEach(function (key) {
        counter3++;
        tablefiltrData.status.push(self.listOfAllData[key].status);
        if (counter3 == self.listOfAllData.length) {
          tablefiltrData.status = tablefiltrData.status.filter(
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
    element.stage = element.stage.replace(/_/g, ' ');
    for (const field in filter) {
      if (filter[field]) {
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
    return true;
  }
  showModal(): void {
    this.isVisibleFilter = true;
  }
  _setFilterValue() {
    this.tablefiltrParams.disable = {
      fileNumberdisable: false,
      datedisable: false,
      statusdisable: false
    };
    this.tablefiltrParams.data = {
      fileNumber: [],
      date: [],
      status: []
    };
    this.filterCheckboxes = [
      { label: "fileNumber", checked: false },
      { label: "Date", checked: false },
      { label: "Status", checked: false },
    ];
    this.filterSelected = {
      fileNumber: null,
      date: null,
      status: null
    };
  }
  viewGovernessAddress(data) {
    if (data.status !== 'SUBMITTED' || data.status !== 'APPROVED') {
      this.showGovernerAddresspopup(data);
    }
  }
  findAssembly(assemblyId) {
    if (this.assemblySession["assembly"])
      return this.assemblySession["assembly"].find(o => o.id === assemblyId).assemblyId;
  }
  findSession(sessionId) {
    if (this.assemblySession["session"]){
      let session = this.assemblySession["session"].find(o => o.id === sessionId);
      if(session) {
        return session.sessionId;
      }
    }
  }
  // correspondance starts
  showCreateLetterForm(gov, type) {
    this.correspondance.CoverLetterModel = true;
    this.correspondance.govId = gov.id;
    this.correspondance.fileId = gov.fileId;
    this.correspondance.type = type;
  }
  createCoverLetter() {
    this.draftCorrespondence();
  }
  draftCorrespondence() {
    this.router.navigate(
      ["business-dashboard/correspondence/select-template"],
      {
        state: this.buildCorrespondanceData(),
      }
    );
  }
  buildCorrespondanceData() {
    if (this.getBusiness() == '') {
      this.notify.warning('Warning.', 'No Business Found');
      return;
    }
    return ({
      business: this.getBusiness(),
      type: "TABLE",
      fileId: this.correspondance.fileId,
      businessReferId: this.correspondance.govId,
      businessReferType: "TABLE",
      businessReferSubType: this.getBusiness(),
      businessReferValue: this.correspondance.coverLetterTitle,
      businessReferNumber: null,
      businessReferName: null,
      fileNumber: "",
      departmentId: null,
      masterLetter: null,
      refrenceLetter: null,
      toCode: this.getToCodes(),
      toDisplayName: ['0'],
      toEditable: true,
      redirectToFile: true,
      redirectToModule: 'TABLES'
    })
  }
  getToCodes() {
    this.common.getAllCode('').subscribe((codes) => {
      console.log(codes);
    });
  }
  getBusiness() {
    let business = '';
    switch (this.correspondance.type) {
      case 'c1':
        business = "TABLE_GOVERNORS_ADDRESS_CORRESPONDANCE_COVERING_LETTER"
        break;
      case 'c2':
        business = "TABLE_LETTER_WITH_COVERING_LETTER"
        break;
      case 'c3':
        business = "TABLE_CORRESPONDANCE_LAW_DEPT"
        break;
      default:
        break;
    }
    return business;
  }
  canCreateGovAddress() {
    if(this.listOfData.length === 0) {
      return true;
      return;
    }
    return this.listOfData.find(o => o.status === "SAVED");
  }
  viewFile(id) {
    this.router.navigate(['business-dashboard/tables/file-view/', id]);
  }
  // ends correspondence
  cancelCnfrm() {}
  showGovernerAddresspopup(data) {
    this.modalService.create({
      nzContent: CreateGovComponent,
      nzWidth: "600",
      nzFooter: null,
      nzTitle: "Create Governor's Address",
      nzClosable: true,
      nzOnOk: () => {  },
      nzComponentParams: {
        assemblySession: this.assemblySession,
        govData: data ? data : null
      },
    });
  }
}
