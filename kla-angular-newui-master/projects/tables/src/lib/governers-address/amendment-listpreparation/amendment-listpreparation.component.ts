import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { isThisSecond } from 'date-fns';
import { NzNotificationService } from 'ng-zorro-antd';
import { FileServiceService } from '../../shared/services/file-service.service';
import { GovernersAddressService } from '../../shared/services/governersaddress.service';

@Component({
  selector: 'tables-amendment-listpreparation',
  templateUrl: './amendment-listpreparation.component.html',
  styleUrls: ['./amendment-listpreparation.component.css']
})
export class AmendmentListpreparationComponent implements OnInit {
@Input() lId:any;
searchParam=new FormControl(null);
approvedMOTList=[];
amendmentsList:any;
listData;
noticeContent="";
userId;
isViewNotice=false;
amendmentText="";
isViewAmendement=false;
listId:Number=0;
isFileView;
checkbxParams: any = { numberOfChecked: 0 };
mapOfCheckedId: { [key: string]: boolean } = {};
tableParams: any = {
  colSpan: false,
  tableDto: []
 };
 commonAmendmentList:any=[];
 fileAmendmentList=[];
 fileAmendmentIds=[];
  amendmentids: any;
  constructor(private service: GovernersAddressService, private router: Router,
    private notify: NzNotificationService,
    private file: FileServiceService, @Inject('authService') private auth) { 
      this.userId = auth.getCurrentUser().userId;
    }

  ngOnInit() {
    console.log(this.lId);
    this.isFileView=this.lId? true : false
    if(this.lId){
      this.getAmendmentListBylId(this.lId);
    }
    this.getApprovedMOT();
  }
  getAmendmentListBylId(id){
    this.service.getAllAmendmentsByListId(id).subscribe(res => {
      this.commonAmendmentList= res;
    });
  }
  currentPageDataChange($event): void {
    this.commonAmendmentList = $event;
  }
  getApprovedMOT() {
    this.service.getApprovedMOT().subscribe(res => {
      this.approvedMOTList= res;
    });
  }
  noticeView(id){

  }
  viewFile(id) {
    this.router.navigate(['business-dashboard/tables/file-view/', id]);
  }
  sort(data){

  }
  getAllAmendment(){
    if(this.searchParam.value){
    this.service.getAllAmendmentForMotByStatus(this.searchParam.value).subscribe((res: any) => {
      this.amendmentsList=res;
      console.log(this.amendmentsList);
      if(res.amendmentToMOTDtoList.length > 0){
      this.commonAmendmentList = res.amendmentToMOTDtoList;
      this.listId= this.amendmentsList.amendmentListId;
      console.log(this.listId);
      this.getNoticeTemplate();
      }
    });
  }else{
    this.commonAmendmentList=[];
  }
  }
  create() {
 let amendmetsids=[];
 amendmetsids=this.amendmentsList.amendmentToMOTDtoList.map(data=>data.id);
//  let reqBody={
//   amendmetsids]
//  }
 this.service.createAmendmentList(amendmetsids,this.searchParam.value).subscribe((res: any) => {
  this.notify.create('success', 'Success', 'Amendment  List Created Successfully!');
  this.listData=res;
  this.getAllAmendment();
  // this.amendmentsList=[];
  // this.amendmentsList = res;
});
  }
  // showConsentLinks(id) {
  //   this.result.forEach((element) => {
  //     if (element.id === id) {
  //       element.viewLinks = true;
  //     } else {
  //       element.viewLinks = false;
  //     }
  //   });
  // }
  // hideConsentLinks(id) {
  //   this.result.forEach((element) => {
  //     if (element.id === id) {
  //       element.viewLinks = false;
  //     }
  //   });
  // }
  getNoticeTemplate(){
    let noticeid= this.approvedMOTList.find(el=>el.id===this.searchParam.value).noticeId;
    this.file.getNoticeTemplateData(noticeid, this.userId).subscribe(res => {
      this.noticeContent = res.notice.noticeData;
    });
  }
  handleCancel() {
    this.isViewNotice = false;
  }
  showPopup(){
    this.isViewNotice=true;
  }
  viewAmendment(text) {
this.amendmentText = text;
this.isViewAmendement=true;
  }
  cancel(){
    this.isViewAmendement=false;
  }
  attachToFile(){
//     let amendmetsids=[];
//  amendmetsids=this.amendmentsList.map(data=>data.id);
//  let id= this.listData.id? this.listData.id : this.listId;
 let body= {
  amendmentListId: (this.listId)?  this.listId:this.listData.id,
  fileForm: {
    fileId: this.getSelectedMOT(),
    activeSubTypes: [
      "TABLE_AMENDMENT_LIST_MOTION_OF_THANKS"
    ],
    type: "TABLE",
    userId: this.auth.getCurrentUser().userId
  }
}
console.log(body);
    this.service.resubmitAmendmentList(body).subscribe(res=>{
if(res){
  this.notify.create('success','Success','List Attached To File successfully');
        setTimeout(() => {
      this.router.navigate(['business-dashboard/tables/file-view/', res.fileResponse.fileId]);
    }, 1500);
}
    })
  }
  cancelAmendment(Id){
    // let checkedArray = [];
    // checkedArray = this.fileAmendmentList.filter(
    //   (item) => this.mapOfCheckedId[item.id]
    // );
    // checkedArray.forEach(element => {
    //   if (element.id) {
    //     this.amendmentids.push(element.id);
    //   }
    // });
  
    this.service.cancelAmendmentBySpeaker(Id).subscribe(res =>{
      if(res) {
        this.notify.create('success', 'Success', 'Amendment with id ='+res.id+ ' Cancelled Successfully!');
        this.getAmendmentListBylId(this.lId);
      }
    })
  }
  isSpeaker() {
    return this.auth.getCurrentUser().authorities.includes("speaker");
  }
  refreshStatus(list): void {
    this.checkbxParams.numberOfChecked = this.fileAmendmentList.filter(
      (item) => this.mapOfCheckedId[item.id]
    ).length;
    this.checkbxParams.allDtCheckd = this.fileAmendmentList.every(
      (item) => this.mapOfCheckedId[item.id]
    );
    this.tableParams.colSpan =
      this.checkbxParams.numberOfChecked > 0 ? true : false;
    if (this.tableParams.colSpan) {
      this.fileAmendmentList.forEach((element) => {
        element.viewLinks = false;
      });
    }
  }
  getSelectedMOT(){
    let selectedMOT=this.approvedMOTList.find(el=>el.id=== this.searchParam.value).fileId;
    console.log(selectedMOT);
   return selectedMOT;
     }
}
