import { Component, OnInit, ElementRef, ViewChild, Input } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { TablescommonService } from "../../../shared/services/tablescommon.service";
import { GovernersAddressService } from "../../../shared/services/governersaddress.service";
@Component({
  selector: 'tables-list-minute',
  templateUrl: './list-minute.component.html',
  styleUrls: ['./list-minute.component.scss']
})
export class ListMinuteComponent implements OnInit {
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
  searchParam = '';
  searchAddress: string;
  listOfSearchName: string[] = [];
  filterCheckboxes: any = [];
  filterSelected: object;
  statusParam: any;
  sortbyId = false;
  assemblySession: object = [];
  constructor(
    private router: Router,
    private governerAddrss: GovernersAddressService,
    private route: ActivatedRoute,
    private common: TablescommonService
  ) {
    this._setFilterValue();
  }
  ngOnInit() {
    this.loadRBSPermissions();
    this.route.params.subscribe((params) => {
      this.getAssemblySession();
    });
  }
  loadRBSPermissions() {
  }
  getAssemblySession() {
    this.common.getAllAssemblyandSession().subscribe((res) => {
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
      if (this.assemblySession['session'].currentsession) {
        this.geMinutetoMinuteList();
      }
    }
  }
  geMinutetoMinuteList() {
    this.governerAddrss.getMinutetominuteList().subscribe((res: any) => {
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
  viewMinutes(list) {
    this.statusParam = this.statusParam ? this.statusParam : "";
    this.router.navigate(["create-m2m", list.id],
      { relativeTo: this.route.parent });
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
    tablefilter.headingdisable = this.filterCheckboxes.find(
      (element) =>
        element.label === "Heading"
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
          (element.heading &&
            element.heading
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
        tablefilter.headingdisable = false;
        this.filterSelected["heading"] = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label === "Heading") {
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
    tablefilter.heading
      ? Object.keys(self.listOfAllData).forEach(function (key) {
        counter1++;
        tablefiltrData.heading.push(self.listOfAllData[key].heading);
        if (counter1 == self.listOfAllData.length) {
          tablefiltrData.heading = tablefiltrData.heading.filter(
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
      headingdisable: false,
      datedisable: false,
      statusdisable: false
    };
    this.tablefiltrParams.data = {
      heading: [],
      date: [],
      status: []
    };
    this.filterCheckboxes = [
      { label: "Heading", checked: false },
      { label: "Date", checked: false },
      { label: "Status", checked: false },
    ];
    this.filterSelected = {
      heading: null,
      date: null,
      status: null
    };
  }
  createMinute() {
    this.router.navigate(["create-m2m", ""], { relativeTo: this.route.parent });
  }
}