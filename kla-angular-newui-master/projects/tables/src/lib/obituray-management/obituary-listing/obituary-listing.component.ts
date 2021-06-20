import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { forkJoin } from 'rxjs';
import { ObituaryService } from '../../shared/services/obituary.service';
import { TablescommonService } from '../../shared/services/tablescommon.service';

@Component({
  selector: 'tables-obituary-listing',
  templateUrl: './obituary-listing.component.html',
  styleUrls: ['./obituary-listing.component.css']
})
export class ObituaryListingComponent implements OnInit {
  obituaryList: any = [];
  allobituaryList: any = [];
  allObituary :any = [];
  filtrParams: any = {};
  checkbxParams: any = { numberOfChecked: 0 };
  tableParams: any = { colSpan: false };
  searchParam = "";
  mapOfCheckedId: { [key: string]: boolean } = {};
  colCheckboxes = [
    { id: 1, label: "Session Date", check: true, disable: false },
    { id: 2, label: "Status", check: true, disable: false },
  ];
  billId;
  user: any;
  isPdfVisible=false
  docUrl = null;
  filePopup = false;
 obituaryId = null;
 assemblyId = null;
 sessionId = null;
 assembly = null;
 session = null;
  assemblyList = [];
  sessionList = [];
  assemblySession: any;
  constructor(
    private notification: NzNotificationService,
    private commonService:TablescommonService ,
    private router: Router,
    private route: ActivatedRoute,
    @Inject("authService") private AuthService,
    private obituaryService: ObituaryService
  ) {
    this.user = AuthService.getCurrentUser();
    // this.commonService.getBillPermissions(this.user.userId);
    this._setFilter();
   }

  ngOnInit() {
    this.getAssemblySession()
    // this.getObituaryList();
  }
  // getAssemblySession() {
  //   forkJoin(
  //     this.commonService.getAllAssembly(),
  //     this.commonService.getAllSession()
  //   ).subscribe(([assembly, session]) => {
  //     this.assemblyList = assembly as Array<any>;
  //     const res = this.assemblyList.map((x) => x.id);
  //     this.assemblyId = Math.max.apply(null, res);
  //     this.assembly = Math.max.apply(null, res);
  //     this.sessionList = session as Array<any>;
  //     const response = this.sessionList.map((x) => x.id);
  //     this.sessionId = Math.max.apply(null, response);
  //     this.session = Math.max.apply(null, response);
  //     this.getObituaryList();
  //   });
  // }

  //get all assembly and session
  getAssemblySession() {
    this.commonService.getAllAssemblyandSession().subscribe((Response:any)=> {
      if(Response){
        this.assemblySession = Response.assemblySession;
        this.assemblyId = Response.activeAssemblySession.assemblyId;
        this.assemblyList = Response.assembly;
        this.assemblyList.push({
          id: 0,
          assemblyId: 'No Assembly',
        });
        this.getSessionList();
        this.sessionId = Response.activeAssemblySession.sessionId;
        this.getObituaryList();
      }
    });
  }

//get session list for assembly
  getSessionList() {
    this.sessionId = null;
    if (this.assemblyId === 0 || !(this.assemblyId && this.assemblySession.find(x=> x.id === this.assemblyId))) {
      this.sessionList = [{
        id: 0,
        sessionId: 'No Session',
      }];
    } else {
      if(this.assemblyId && this.assemblySession.find(x=> x.id === this.assemblyId)){
        this.sessionList = this.assemblySession.find(x => x.id === this.assemblyId).session;
      }
    }
  }

  createObituary(){
    this.router.navigate([
      'business-dashboard/tables/create-obituary-address',
    ]);
  }

  _setFilter() {
    this.filtrParams.tableDto = [];
    const tableDataMdl = [
      { label: "Session Date", key: "sessionDate" },
      { label: "Status", key: "status" },
    ];
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < tableDataMdl.length; i++) {
      const row = {
        key: tableDataMdl[i].key,
        label: tableDataMdl[i].label,
        checked: false,
        filtersel: false,
        data: [],
        selValue: null,
        disableCol: false,
      };
      this.filtrParams.tableDto.push(row);
    }
    this.filtrParams.rowFilter = false;
    this.filtrParams.showPriorityPopup = false;
  }
  showFilter(type) {
    this.filtrParams.rowFilter = type === "row" ? true : false;
  }
  _confrmFilter(): void {
    if (this.filtrParams.rowFilter) {
      this._filterRows();
    }
  }
  _filterRows() {
    this.filtrParams.rowFilter = false;
    this.filtrParams.tableDto.forEach((element) => {
      element.filtersel = element.checked;
    });
    this._loadSelectedfilterData();
  }
  _loadSelectedfilterData() {
    let count = 0;
    this.filtrParams.tableDto.forEach((element) => {
      count++;
      if (element.filtersel) {
        switch (element.key) {
          case "sessionDate":
            this.allobituaryList.forEach((value) => {
              element.data.push(value.sessionDate);
            });
            break;
          case "status":
            this.allobituaryList.forEach((value) => {
              element.data.push(value.status);
            });
            break;
          default:
            break;
        }
      }
    });
    if (count === this.filtrParams.tableDto.length) {
      this.filtrParams.tableDto.forEach((element) => {
        element.data = element.data.filter((v, i, a) => a.indexOf(v) === i);
      });
    }
  }
  _chooseFilter(box) {
    box.checked = !box.checked;
  }
  searchonErrata() {
    this.obituaryList = this.allobituaryList;
    if (this.searchParam) {
      this.obituaryList = this.allobituaryList.filter(
        (element) =>
          (element.sessionDate &&
            element.sessionDate
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.status &&
            element.status
              .toLowerCase()
              .includes(this.searchParam.toLowerCase()))
      );
    } else {
      this.obituaryList = this.allobituaryList;
    }
  }
  searchCol() {
    if (!this.filtrParams.tableDto) {
      this.obituaryList = this.allobituaryList;
    } else {
      this.obituaryList = this.allobituaryList.filter((item: any) =>
        this.applyFilter(item, this.filtrParams.tableDto)
      );
    }
  }
  applyFilter(element: any, filter: any) {
    for (const field in filter) {
      if (filter[field].selValue) {
        if (typeof filter[field].selValue === "string") {
          if (
            !element[filter[field].key] ||
            element[filter[field].key].toLowerCase() !==
              filter[field].selValue.toLowerCase()
          ) {
            return false;
          }
        } else if (typeof filter[field].selValue === "number") {
          if (
            !element[filter[field].key] ||
            element[filter[field].key] !== filter[field].selValue
          ) {
            return false;
          }
        }
      }
    }
    return true;
  }
  _checkAllRows(value: boolean): void {
    this.allobituaryList.forEach((item) => (this.mapOfCheckedId[item.billId] = value));
    this.refreshStatus(null);
  }
  refreshStatus(list): void {
    this.checkbxParams.numberOfChecked = this.allobituaryList.filter(
      (item) => this.mapOfCheckedId[item.billId]
    ).length;
    this.checkbxParams.allDtCheckd = this.allobituaryList.every(
      (item) => this.mapOfCheckedId[item.billId]
    );
    this.tableParams.colSpan =
      this.checkbxParams.numberOfChecked > 0 ? true : false;
    if (this.tableParams.colSpan) {
      this.obituaryList.forEach((element) => {
        element.viewLinks = false;
      });
    }
  }
  disableFilter(filter) {
    filter.filtersel = false;
    filter.checked = false;
    filter.data = [];
    filter.selValue = null;
    this.searchCol();
    this._loadSelectedfilterData();
  }
  clearFilter() {
    this._setFilter();
    this.searchCol();
    this._loadSelectedfilterData();
  }
  get checkedFilters() {
    return this.filtrParams.tableDto.filter(ele => ele.filtersel);
  }
  sort(sort: { key: string; value: string }): void {
    const data = this.allobituaryList.filter((item) => item);
    if (sort.key && sort.value) {
      this.obituaryList = data.sort((a, b) =>
        sort.value === "ascend"
          ? (a[sort.key!] && a[sort.key!].toLowerCase()) >
            (b[sort.key!] && b[sort.key!].toLowerCase())
            ? 1
            : -1
          : (b[sort.key!] && b[sort.key!].toLowerCase()) >
            (a[sort.key!] && a[sort.key!].toLowerCase())
          ? 1
          : -1
      );
    } else {
      this.obituaryList = data;
    }
  }

  disableCheckBox() {
    let count = 0;
    for (const box of this.colCheckboxes) {
      if (box.check) {
        count++;
      }
    }

    if (count === 1) {
      for (const box of this.colCheckboxes) {
        if (!box.check) {
          box.disable = true;
        }
      }
    } else {
      for (const box of this.colCheckboxes) {
        box.disable = false;
      }
    }
  }

  getObituaryList() {
    this.obituaryService.getAllObituary().subscribe((arg: any) => {
      this.obituaryList = this.allobituaryList = this.allObituary = arg;
      this.filterByAssemblyandSession()
    });
    this.obituaryList.forEach((element) => {
      element.viewLinks = false;
    });
  }
  filterByAssemblyandSession(){
    if(this.obituaryList && this.obituaryList.length > 0) {
      this.obituaryList = this.allobituaryList = this.allObituary.filter(
        (el) =>
          el.assemblyId == this.assemblyId &&
          el.sessionId === this.sessionId
      );
    } else {
      this.getObituaryList();
    }
    
  }  
  showLinks(id) {
    if (this.tableParams.colSpan) {
      return;
    }
    this.obituaryList.forEach((element) => {
      if (element.id === id) {
        element.viewLinks = true;
      }
      else{
        element.viewLinks = false;
      }
    });
  }
  showPdfModal(documentUrl) {
    this.docUrl = documentUrl;
    if (this.docUrl) {
      this.isPdfVisible = true;
    }
  }
  hideModal(){
    this.isPdfVisible = false;
  }
  goToFileView(fileId){
    this.router.navigate(["business-dashboard/tables/file-view",fileId]);
  }
  onCancelFilePopup(){
    this.filePopup = false;
    this.obituaryId = null;
   }
   attachToFile(obituaryId){
     this.obituaryId = obituaryId;
     this.filePopup = true;
   }
}

