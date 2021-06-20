import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { FileServiceService } from '../../shared/services/file-service.service';
import { GovernersAddressService } from '../../shared/services/governersaddress.service';

@Component({
  selector: 'tables-list-mot',
  templateUrl: './list-mot.component.html',
  styleUrls: ['./list-mot.component.css']
})
export class ListMOTComponent implements OnInit {
result:any=[];
allResult:any=[];
userId;
noticeContent = '';
isNoticeView = false;
searchParam="";
  constructor(private service:GovernersAddressService,private router:Router,
    private notify: NzNotificationService,    private file: FileServiceService, @Inject('authService') private auth) {
      this.userId = auth.getCurrentUser().userId;
     }

  ngOnInit() {
    this.getAllMOT();
  }
  currentPageDataChange($event): void {
    this.allResult= $event;
  }
  sort(sort: { key: string; value: string }): void {
    const data = this.allResult.filter((item) => item);
    if (sort.key && sort.value) {
      this.result = data.sort((a, b) =>
        sort.value === "ascend"
          ? a[sort.key!].toLowerCase() > b[sort.key!].toLowerCase()
            ? 1
            : -1
          : b[sort.key!].toLowerCase() > a[sort.key!].toLowerCase()
            ? 1
            : -1
      );
    } else {
      this.result = data;
    }
  }
  getAllMOT(){
this.service.getAllMOT().subscribe(res =>{
  this.result=this.allResult=res;
});
  }
  showConsentLinks(id) {
    this.result.forEach((element) => {
      if (element.id === id) {
        element.viewLinks = true;
      } else {
        element.viewLinks = false;
      }
    });
  }
  hideConsentLinks(id) {
    this.result.forEach((element) => {
      if (element.id === id) {
        element.viewLinks = false;
      }
    });
  }
  attachToFile(Id){
    let body={
      id:Id
    }
    this.service.resubmitMOT(body).subscribe(res =>{
      if(res){
        this.notify.create('success','Success',' Submitted successfully');
        setTimeout(() => {
      this.router.navigate(['business-dashboard/tables/file-view/', res.fileId]);
    }, 1500);
      }
    });
  }
  viewFile(id) {
    this.router.navigate(['business-dashboard/tables/file-view/', id]);
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
          (element.submittedMemberName.details.fullName &&
            element.submittedMemberName.details.fullName
              .toLowerCase()
              .includes(this.searchParam.toLowerCase()))
      );
    } 
    else {
      this.result = this.allResult
    }
  }
}
