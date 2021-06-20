import { Component, OnInit, Inject } from '@angular/core';
import { BillBulletinService } from '../../shared/services/bill-bulletin.service';
import { NzModalService } from 'ng-zorro-antd';
import { BulletinContentViewComponent } from '../bulletin-content-view/bulletin-content-view.component';
import { BillcommonService } from '../../shared/services/billcommon.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'lib-bulletin-part2',
  templateUrl: './bulletin-part2.component.html',
  styleUrls: ['./bulletin-part2.component.css']
})
export class BulletinPart2Component implements OnInit {
  user;
  buttonControls = {
    fileColumn: false
  }
  searchParam = "";
  listOfData: any;
  listOfAllData: any;
  filtrParams: any = {};
  constructor(private bullettin: BillBulletinService,
    public commmon: BillcommonService,
    private modal: NzModalService,
    private router: Router,
    private route: ActivatedRoute,
    @Inject("authService") private AuthService) {

    this.user = AuthService.getCurrentUser();
    this.commmon.setBillPermissions(this.user.rbsPermissions);
  }
  ngOnInit() {
    this.setFilter();
    this.getBulletinList();
    this.setRBSPermisson();
  }
  setRBSPermisson() {
    if (this.commmon.doIHaveAnAccess("FILE", "READ"))
      this.buttonControls.fileColumn = true;

  }
  getBulletinList() {
    if (this.commmon.isMLA() || this.commmon.isPPO()) {
      this.getApprovedBulletinList();
    }
    else {
      this.getAllBulletinList();
    }
  }
  getAllBulletinList() {
    this.bullettin.getAllBulletinList().subscribe((Response: any) => {
      if (Response) {
        this.listOfData = this.listOfAllData = Response;

      }
    });
  }

  getApprovedBulletinList() {
    this.bullettin.getPublishedBulletinList().subscribe((Response: any) => {
      if (Response) {
        this.listOfData = this.listOfAllData = Response;

      }
    });
  }
  openBulletin(id) {
    this.bullettin.getBulletinById(id).subscribe(res => {
      this.modal.create({
        nzTitle: null,
        nzWidth: '800',
        nzContent: BulletinContentViewComponent,
        nzClosable: true,
        nzFooter: null,
        nzMaskClosable: false,
        nzComponentParams: {
          bulletin: res,
        },
        nzOnCancel: () => this.getBulletinList()
      })
    })

  }


  setFilter() {
    this.filtrParams.tableDto = [];
    let tableDataMdl = [];

    let sectionFields = [
      { label: "Bulletin Number", key: "bulletinNumber" },
      { label: "Title", key: "title" },
      { label: "Type", key: "type" },
      { label: "Status", key: "fileStatus" },
    ];
    sectionFields.forEach((element) => {
      tableDataMdl.push(element);
    });
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
    this.filtrParams.colFilter = false;
    this.filtrParams.rowFilter = false;

  }
  showFilter(type) {
    // this.filtrParams.colFilter = type === "column" ? true : false;
    this.filtrParams.rowFilter = type === "row" ? true : false;

  }
  _confrmFilter(): void {
    if (this.filtrParams.colFilter) {
      this._filterCols();
    } else {
      this._filterRows();
    }
  }
  _filterCols() {
    this.filtrParams.colFilter = false;
    // this.filtrParams.tableDto.forEach((element) => {
    //   if (element.checked) {
    //     element.disableCol = true;
    //   }
    // });
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
          case "bulletinNumber":
            this.listOfAllData.forEach((value) => {
              element.data.push(value.bulletinNumber);
            });
            break;
          case "title":
            this.listOfAllData.forEach((value) => {
              element.data.push(value.title);
            });
            break;
          case "type":
            this.listOfAllData.forEach((value) => {
              if (!element.data.some(d => d == value.type))
                element.data.push(value.type);
            });
            break;
          case "fileStatus":
            this.listOfAllData.forEach((value) => {
              if (!element.data.some(d => d == value.fileStatus))
                element.data.push(value.fileStatus);
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
  searchOnList() {
    this.listOfData = this.listOfAllData;
    if (this.searchParam) {

      this.listOfData = this.listOfAllData.filter(
        (element) =>
          (element.bulletinNumber && element.bulletinNumber.toString()
            .toLowerCase()
            .includes(this.searchParam.toLowerCase())) ||
          (element.title && element.title.toString()
            .toLowerCase()
            .includes(this.searchParam.toLowerCase())) ||
          (element.type && element.type
            .toLowerCase()
            .includes(this.searchParam.toLowerCase())) ||
          (element.fileStatus && element.fileStatus.toLowerCase().includes(this.searchParam.toLowerCase()))
      );
    }
  }
  searchCol() {
    if (!this.filtrParams.tableDto) {
      this.listOfData = this.listOfAllData;
    } else {
      this.listOfData = this.listOfAllData.filter((item: any) =>
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


  disableFilter(filter) {
    filter.filtersel = false;
    filter.checked = false;
    filter.data = [];
    filter.selValue = null;
    this.searchCol();
    this._loadSelectedfilterData();
  }
  clearFilter() {
    this.setFilter();
    this.searchCol();
    this._loadSelectedfilterData();
  }

  get checkedFilters() {
    return this.filtrParams.tableDto.filter(ele => ele.filtersel);
  }

  sort(sort: { key: string; value: string }): void {
    const data = this.listOfAllData.filter((item) => item);
    if (sort.key && sort.value) {
      this.listOfData = data.sort((a, b) =>
        sort.value === "ascend"
          ? a[sort.key!].toLowerCase() > b[sort.key!].toLowerCase()
            ? 1
            : -1
          : b[sort.key!].toLowerCase() > a[sort.key!].toLowerCase()
            ? 1
            : -1
      );
    } else {
      this.listOfData = data;
    }
  }

  viewFile(fileId) {
    if (fileId) {
      this.router.navigate([
        "../bill/file-view",
        fileId,
      ], {
        relativeTo: this.route.parent,
      });
    }

  }
}
