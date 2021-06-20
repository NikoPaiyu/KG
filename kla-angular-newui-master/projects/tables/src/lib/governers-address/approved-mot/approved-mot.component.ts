import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { FileServiceService } from '../../shared/services/file-service.service';
import { GovernersAddressService } from '../../shared/services/governersaddress.service';

@Component({
  selector: 'tables-approved-mot',
  templateUrl: './approved-mot.component.html',
  styleUrls: ['./approved-mot.component.css']
})
export class ApprovedMOTComponent implements OnInit {
  result: any = [];
  allResult: any = [];
  userId;
  noticeContent = '';
  isNoticeView = false;
  searchParam="";
  sortName: string | null = null;
  sortValue: string | null = null;
  searchAddress: string;
  listOfSearchName: string[] = [];
  constructor(private service: GovernersAddressService, private router: Router,
    private notify: NzNotificationService,
    private file: FileServiceService, @Inject('authService') private auth) {
    this.userId = auth.getCurrentUser().userId;
  }

  ngOnInit() {
    this.getApprovedMOT();
  }
  currentPageDataChange($event): void {
    this.allResult = $event;
  }
  // sort(sort: { key: string; value: string }): void {
  //   const data = this.allResult.filter((item) => item);
  //   if (sort.key && sort.value) {
  //     this.result = data.sort((a, b) =>
  //       sort.value === "ascend"
  //         ? a[sort.key!].toLowerCase() > b[sort.key!].toLowerCase()
  //           ? 1
  //           : -1
  //         : b[sort.key!].toLowerCase() > a[sort.key!].toLowerCase()
  //           ? 1
  //           : -1
  //     );
  //   } else {
  //     this.result = data;
  //   }
  // }
  viewFile(id) {
    this.router.navigate(['business-dashboard/tables/file-view/', id]);
  }
  getApprovedMOT() {
    this.service.getApprovedMOT().subscribe(res => {
      this.result = this.allResult=[];
      this.result = this.allResult = res;
    });
  }
  noticeView(id) {
    if (id) {
      this.file.getNoticeTemplateData(id, this.userId).subscribe(res => {
        this.noticeContent = res.notice.noticeData;
        console.log(this.noticeContent);
        this.isNoticeView = true;
      });
    }
  }
  handleCancel() {
    this.isNoticeView = false;
  }
  search() {
    if (this.searchParam) {
      this.result = this.allResult.filter(
        (element) =>
          (element.noticeNumber.toString() &&
            element.noticeNumber.toString()
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          // (element.fileNumber &&
          //   element.fileNumber
          //     .toLowerCase()
          //     .includes(this.searchParam.toLowerCase())) 
          (element.submittedMemberName.details.fullName.toString() &&
            element.submittedMemberName.details.fullName.toString()
              .toLowerCase()
              .includes(this.searchParam.toLowerCase()))
      );
    } 
    else {
      this.result = this.allResult
    }
  }
  sort(sort: { key: string; value: string }): void {
    this.sortName = sort.key;
    this.sortValue = sort.value;
    this.sortBySearch();
  }
  sortBySearch(): void {
    const filterFunc = (item: { name: string; age: number; address: string }) =>
      (this.searchAddress
        ? item.address.indexOf(this.searchAddress) !== -1
        : true) &&
      (this.listOfSearchName.length
        ? this.listOfSearchName.some((name) => item.name.indexOf(name) !== -1)
        : true);
    const data = this.result.filter((item) => filterFunc(item));
    /** sort data **/
    if (this.sortName && this.sortValue) {
      this.result = data.sort((a, b) =>
        this.sortValue === "ascend"
          ? a[this.sortName!] > b[this.sortName!]
            ? 1
            : -1
          : b[this.sortName!] > a[this.sortName!]
            ? 1
            : -1
      );
    } else {
      this.result = data;
    }
  }
}
