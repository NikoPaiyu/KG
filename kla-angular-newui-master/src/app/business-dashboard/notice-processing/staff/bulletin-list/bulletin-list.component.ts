import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { FileService } from '../../shared/services/file.service';
import { NoticeService } from '../../shared/services/notice.service';

@Component({
  selector: 'app-bulletin-list',
  templateUrl: './bulletin-list.component.html',
  styleUrls: ['./bulletin-list.component.scss']
})
export class BulletinListComponent implements OnInit {
  user;
  searchParam = '';
  listOfData: any;
  listOfAllData: any;
  filtrParams: any = {};
  bulletinData: any = null;
  viewBulletinModal = false;
  bulletin: any = null;

  constructor(
    private modal: NzModalService,
    private router: Router,
    private route: ActivatedRoute,
    @Inject('authService') private AuthService,
    private notification: NzNotificationService,
    public notice: NoticeService,
    private file: FileService) {
    this.user = AuthService.getCurrentUser();
    this.notice.getNoticePermissions(this.user.userId);
  }

  ngOnInit() {
    this.setFilter();
    this.getBulletinList();
  }

  getBulletinList() {
    this.file.getBulletinList().subscribe((Response: any) => {
      if (Response) {
        this.listOfData = this.listOfAllData = Response;
      }
    });
  }

  openBulletin(id, bulletin) {
    this.bulletin = bulletin;
    this.file.getBulletinPreview(id).subscribe(res => {
      this.bulletinData = res;
      this.viewBulletinModal = true;
    });
  }


  setFilter() {
    this.filtrParams.tableDto = [];
    const tableDataMdl = [];

    const sectionFields = [
      { label: 'Bulletin Number', key: 'bulletinNumber' },
      { label: 'Title', key: 'title' },
      { label: 'Type', key: 'type' },
      { label: 'Status', key: 'fileStatus' },
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
    this.filtrParams.rowFilter = type === 'row' ? true : false;

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
          case 'bulletinNumber':
            this.listOfAllData.forEach((value) => {
              element.data.push(value.bulletinNumber);
            });
            break;
          case 'title':
            this.listOfAllData.forEach((value) => {
              element.data.push(value.title);
            });
            break;
          case 'type':
            this.listOfAllData.forEach((value) => {
              if (!element.data.some(d => d == value.type)) {
                element.data.push(value.type);
              }
            });
            break;
          case 'fileStatus':
            this.listOfAllData.forEach((value) => {
              if (!element.data.some(d => d == value.fileStatus)) {
                element.data.push(value.fileStatus);
              }
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
        if (typeof filter[field].selValue === 'string') {
          if (
            !element[filter[field].key] ||
            element[filter[field].key].toLowerCase() !==
            filter[field].selValue.toLowerCase()
          ) {
            return false;
          }
        } else if (typeof filter[field].selValue === 'number') {
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
        sort.value === 'ascend'
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
        'business-dashboard/notice/staff/file',
        fileId,
      ]);
    }

  }

  hidePreview() {
    this.viewBulletinModal = false;
    this.bulletinData = null;
  }

  publishBulletin() {
    this.file.publishBulletin(this.bulletin.businessId).subscribe((res => {
      this.notification.success('Success', 'Bulletin Publish Successfully.');
      this.hidePreview();
      this.getBulletinList();
    }));
  }

}
