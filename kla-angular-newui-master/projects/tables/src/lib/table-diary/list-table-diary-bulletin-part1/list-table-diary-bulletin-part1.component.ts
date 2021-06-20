import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { TablediaryService } from '../../shared/services/tablediary.service';
import { TablescommonService } from '../../shared/services/tablescommon.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'tables-list-table-diary-bulletin-part1',
  templateUrl: './list-table-diary-bulletin-part1.component.html',
  styleUrls: ['./list-table-diary-bulletin-part1.component.css']
})
export class ListTableDiaryBulletinPart1Component implements OnInit {

  assemblyList = [];
  assemblySession: any = null;
  sessionList = [];
  sessionId = null;
  assemblyId = null;

  bulletinPart1Details: any = null;
  showFileModal = false;
  showCreateModal = false;
  tableDiary: any = [];
  allTableDiary: any = [];
  filtrParams: any = {};
  checkbxParams: any = { numberOfChecked: 0 };
  tableParams: any = { colSpan: false };
  searchParam = "";
  mapOfCheckedId: { [key: string]: boolean } = {};

  colCheckboxes = [
    { id: 1, label: "Date", check: true, disable: false },
    { id: 2, label: "Session", check: true, disable: false },
    { id: 3, label: "KLA", check: true, disable: false },
    { id: 4, label: "Status", check: true, disable: false },
  ];
  notification: any;

  constructor(
    private common :TablescommonService,
    private TablediaryService : TablediaryService,
    private router: Router
  ) { 
    this._setFilter();
  }

  ngOnInit() {

    this.TablediaryService.getAllAssemblyAndSession()
    .subscribe((res: any) => {
      this.assemblySession = res.assemblySession;
      this.assemblyList = res.assembly;
      });
    this.getTableDiaryBulletinPart1List();
  }

  getSessionForAssembly() {
    this.sessionId = null;
    this.sessionList = [];
    if (this.assemblyId === 0) {
      // this.sessionList = [{
      //         id: 0,
      //         sessionId: 'No Session',
      //       }];
    } else {
      if (this.assemblySession.find(x => x.id === this.assemblyId)) {
        this.sessionList = this.assemblySession.find(x => x.id === this.assemblyId).session;
      }
    }
  }

  getAssemblyAndSession() {
    this.assemblyId = null;
    this.sessionId = null;
}

  
  
  // getAssemblySession() {
  //   this.common.getAllAssembly().subscribe((assembly) => {
  //     this.common.getAllSession().subscribe((session) => {
  //       this.common.getCurrentAssemblyAndSession().subscribe((active:any) => {
  //         if (Array.isArray(session) && Array.isArray(assembly)) {
  //           this.assemblySession.assemblyList = assembly;
  //           this.assemblySession.sessionList= session;
  //           this.currentAssemblySession = active;
  //            this.getTableDiaryBulletinPart1List();
  //         }
         
  //       });
  //     });
  //   });
  // }
  getTableDiaryList(){
    if ( this.assemblyId && this.sessionId) {
      this.TablediaryService
        .getTableDiaryList(
          this.assemblyId,
          this.sessionId
        )
        .subscribe((Res: any) => {
         this.tableDiary =this.allTableDiary = Res;
         this.tableDiary.forEach(element => {
          element.viewLinks = false;
         });
        }); 
    }
  }
  _setFilter() {
    this.filtrParams.tableDto = [];
    const tableDataMdl = [
      { label: "Date", key: "date" },
      // { label: "Session", key: "sessionValue" },
      // { label: "Assembly", key: "assemblyValue" },
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
          case "date":
            this.allTableDiary.forEach((value) => {
              element.data.push(formatDate(value.date, 'dd-MM-yyyy', 'en'));
            });
            break;
          case "sessionValue":
            this.allTableDiary.forEach((value) => {
              element.data.push(value.sessionValue);
            });
            break;
          case "assemblyValue":
            this.allTableDiary.forEach((value) => {
              element.data.push(value.assemblyValue);
            });
            break;
          case "status":
            this.allTableDiary.forEach((value) => {
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
  searchonDiary() {
    this.tableDiary = this.allTableDiary;
    if (this.searchParam) {
      this.tableDiary = this.allTableDiary.filter(
        (element) =>
          (element.date &&
            element.date
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.sessionValue &&
            element.sessionValue ==
            this.searchParam) ||
          (element.assemblyValue &&
            element.assemblyValue ==
              this.searchParam) ||
          (element.status &&
            element.status
              .toLowerCase()
              .includes(this.searchParam.toLowerCase()))
      );
    } else {
      this.tableDiary = this.allTableDiary;
    }
  }
  searchCol() {
    if (!this.filtrParams.tableDto) {
      this.tableDiary = this.allTableDiary;
    } else {
      this.tableDiary = this.allTableDiary.filter((item: any) =>
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
    this.allTableDiary.forEach((item) => (this.mapOfCheckedId[item.billId] = value));
    this.refreshStatus(null);
  }
  refreshStatus(list): void {
    this.checkbxParams.numberOfChecked = this.allTableDiary.filter(
      (item) => this.mapOfCheckedId[item.billId]
    ).length;
    this.checkbxParams.allDtCheckd = this.allTableDiary.every(
      (item) => this.mapOfCheckedId[item.billId]
    );
    this.tableParams.colSpan =
      this.checkbxParams.numberOfChecked > 0 ? true : false;
    if (this.tableParams.colSpan) {
      this.tableDiary.forEach((element) => {
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
    const data = this.allTableDiary.filter((item) => item);
    if (sort.key && sort.value) {
      this.tableDiary = data.sort((a, b) =>
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
      this.tableDiary = data;
    }
  }

  disableCheckBox() {
    let count = 0;
    for (const box of this.colCheckboxes) {
      if (box.check) {
        count++;
      }
    }

    if (count === 6) {
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

  showCreateTable(){
    this.showCreateModal = true;
  }
  onCancel(event){
    this.showCreateModal = event;
  }
  showLinks(id){
    this.tableDiary.forEach((element) => {
      if (element.id === id) {
        element.viewLinks = true;
      } else {
        element.viewLinks = false;
      }
    });
  }
  gotoView(id){
   this.router.navigate(['business-dashboard/tables/table-diary-bulletin-part1',id])
  }

  getTableDiaryBulletinPart1List(){
    if (
      this.assemblyId &&
      this.sessionId
    ){
      this.TablediaryService
        .getListTableDiaryBulletinPart1(
          this.assemblyId,
          this.sessionId
        )
        .subscribe((Res: any) => {
         this.tableDiary =this.allTableDiary = Res;
         this.tableDiary.forEach(element => {
          element.viewLinks = false;
         });
        }); 
    }
  }

  showCreateFileModal(list) {
    this.showFileModal = true;
    this.bulletinPart1Details = list;
  }

  hideFileModal() {
    this.showFileModal = false;
    this.bulletinPart1Details = null;
  }

  

}







  

  

  
  




