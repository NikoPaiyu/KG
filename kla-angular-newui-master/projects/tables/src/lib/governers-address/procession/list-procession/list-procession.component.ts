import { Component, OnInit, Inject } from '@angular/core';
import { NzModalRef, UploadFile } from "ng-zorro-antd";
import { differenceInCalendarDays, parseISO } from 'date-fns';
import { TablescommonService } from '../../../shared/services/tablescommon.service';
import { GovernersAddressService } from '../../../shared/services/governersaddress.service';
import { FileServiceService } from '../../../shared/services/file-service.service';
import { NzNotificationService } from 'ng-zorro-antd';


@Component({
  selector: 'tables-list-procession',
  templateUrl: './list-procession.component.html',
  styleUrls: ['./list-procession.component.scss']
})
export class ListProcessionComponent implements OnInit {
  today: any = new Date();
  isCreateProcession = false;
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
  fileList: UploadFile[] = [];
  GvAddrssList: any[];
  selGovaddress = "";
  processionId = '';
  constructor(
    private governerAddrss: GovernersAddressService,
    private file: FileServiceService,
    @Inject('authService') public auth,
    private notify: NzNotificationService,
    private common: TablescommonService
  ) {
    this._setFilterValue();
  }
  ngOnInit() {
    this.loadRBSPermissions();
    this.getProcessionList();
    this.getGovernersddressList();
  }
  loadRBSPermissions() {
  }
  getProcessionList() {
    this.governerAddrss.getProcessionList().subscribe((res: any) => {
      this.listOfDisplayData = this.listOfAllData = res;
      this.sortbyAssemblyAndSessionId(res);
    });
  }
  sortbyAssemblyAndSessionId(res) {
    this.listOfDisplayData = this.listOfAllData;
    this._applyFilterForAssembly(this.listOfDisplayData);
    this.onSearchUser();
    this.sortbyId = true;
  }
  getGovernersddressList() {
    this.governerAddrss.getGovernerAddrssList('APPROVED').subscribe((res: any) => {
      this.GvAddrssList = res;
      this.selGovaddress = (this.GvAddrssList.length > 0) ? this.GvAddrssList[0].id : '';
    });
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
    tablefilter.fileSubjectdisable = this.filterCheckboxes.find(
      (element) =>
        element.label === "Governer's Address File Subject"
    ).checked;
    tablefilter.processionUrldisable = this.filterCheckboxes.find(
      (element) => element.label === "Procession"
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
          (element.fileSubject &&
            element.fileSubject
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.processionUrl &&
            element.processionUrl
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
        tablefilter.fileSubjectdisable = false;
        this.filterSelected[" fileSubject"] = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label === "Governer's Address File Subject") {
            element.checked = false;
          }
        });
      case 2:
        tablefilter.processionUrldisable = false;
        this.filterSelected["processionUrl"] = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label === "Procession") {
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
    tablefilter.fileSubjectdisable
      ? Object.keys(self.listOfAllData).forEach(function (key) {
        counter1++;
        tablefiltrData.fileSubject.push(self.listOfAllData[key].fileSubject);
        if (counter1 == self.listOfAllData.length) {
          tablefiltrData.fileSubject = tablefiltrData.fileSubject.filter(
            (v, i, a) => a.indexOf(v) === i
          );
        }
      })
      : "";
    tablefilter.processionUrldisable
      ? Object.keys(self.listOfAllData).forEach(function (key) {
        counter2++;
        tablefiltrData.processionUrl.push(self.listOfAllData[key].processionUrl);
        if (counter2 == self.listOfAllData.length) {
          tablefiltrData.processionUrl = tablefiltrData.processionUrl.filter(
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
      fileSubjectdisable: false,
      processionUrldisable: false,
      statusdisable: false
    };
    this.tablefiltrParams.data = {
      fileSubject: [],
      processionUrl: [],
      status: []
    };
    this.filterCheckboxes = [
      { label: "Governer's Address File Subject", checked: false },
      { label: "Procession", checked: false },
      { label: "Status", checked: false },
    ];
    this.filterSelected = {
      fileSubject: null,
      processionUrl: null,
      status: null
    };
  }
  viewGovernessAddress(data) {
    if (data.status !== 'SUBMITTED') {
      this.showProcessionpopup(data);
    }
  }
  showProcessionpopup(data) {
    this.isCreateProcession = true;
    if (data) {
      this.processionId = data.id;
      this.fileList = [
        {
          uid: "-1",
          size: 0,
          type: "pdf",
          name: "document",
          status: "done",
          url: data.processionUrl
        }
      ];
      this.selGovaddress = data.governorsAddressId ? data.governorsAddressId : "";
    }
  }
  saveProcession(type) {
    let fileReq = {
      file: this.fileList,
      assemblyId: 1,
      sessionId: 4,
      business: 'TABLE_PROCESSION'
    }
    if (this.fileList && this.fileList[0].uid != "-1") {
      this.updateProcessionFile(type);
      return;
    }
    this.saveProcessionFile(null, type);
  }
  updateProcessionFile(type) {
    this.common.uploadFile(this.fileList[0]).subscribe((processionFile: any) => {
      this.saveProcessionFile(processionFile, type);
    });
  }
  saveProcessionFile(processionFile, type) {
    let reqParam = {
      id: (this.processionId) ? (this.processionId) : null,
      governorsAddressId: this.selGovaddress,
      fileId: this.findFileId(),
      status: (type === 'SAVE') ? 'SAVED' : 'SUBMITTED',
      processionUrl: (processionFile && processionFile.body) ? processionFile.body : this.fileList[0].url
    }
    this.governerAddrss.saveProcession(reqParam).subscribe((procession: any) => {
      this.isCreateProcession = false;
      this.getProcessionList();
    });
  }
  findFileId() {
    const selected = this.GvAddrssList.find(element => element.id === this.selGovaddress);
    let fileId = (selected) ? selected.fileId : null
    return fileId;
  }
  submitProcession(procession) {
    let reqParam = this._buildReqForProcession(procession);
    this.file.attachToFile(reqParam).subscribe((res: any) => {
      this.getProcessionList();
    });
  }
  _buildReqForProcession(procession) {
    return ({
      processionId: procession.id,
      governorsAddressId: procession.governorsAddressId,
      fileForm: {
        fileId: this.findFileId(),
        activeSubTypes: [
          "TABLE_PROCESSION"
        ],
        type: "TABLE",
        userId: this.auth.getCurrentUser().userId
      }
    });
  }
  disabledDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, this.today) < 0;
  }
  cancel() {
    this.isCreateProcession = false;
  }
  beforeUpload = (file: UploadFile): boolean => {
    this.fileList = [];
    this.fileList = this.fileList.concat(file);
    return false;
  };

  handleRemoveFIle = (file: UploadFile) => {
    return true;
  };
  _showFileName(processionUrl) {
    return processionUrl.split('file/')[1]
  }
}
