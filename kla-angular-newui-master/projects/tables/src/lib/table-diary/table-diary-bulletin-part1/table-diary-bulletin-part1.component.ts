import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { TablediaryService } from '../../shared/services/tablediary.service';
import { TablescommonService } from '../../shared/services/tablescommon.service';
// import * as Stomp from "stompjs";
// import * as SockJS from "sockjs-client";

@Component({
  selector: 'tables-table-diary-bulletin-part1',
  templateUrl: './table-diary-bulletin-part1.component.html',
  styleUrls: ['./table-diary-bulletin-part1.component.css']
})
export class TableDiaryBulletinPart1Component implements OnInit {

  // webSocketPoint = this.TablediaryService.getSocket();
  currentFile: string = "/session-socket/currentBusiness";
  stompClient: any;
  activeBusiness = null;
buttonList = [
    { title: "Diary Note", code: "DIARY_NOTE", id: 5, color: "magenta" },
    { title: "Point of Order", code: "POINT_OF_ORDER", id: 11, color: "cyan" },
    { title: "Personal Explanation", code: "EXPLANATION", id: 12, color: "geekblue" },
    { title: "Intervention", code: "INTERVENTION", id: 13, color: "purple" }
];
bulletinData;
isPdfVisible = false;
isPreviewVisible = false;
user;
  selectedBusiness = null;
  tableDiaryMaster;
  modules: any;
  diaryData = {
    bulletinId: null,
    assemblyValue: null,
    sessionValue : null,
    date:null,
    fileStatus: null,
   id: 0,
   lobLines : [
     {
      businessId: 0,
      businessLines: [
        {
          allotedTime: null,
          id: 0, 
          description: null,
          businessId: 1, 
          businessName: "",
          businessNameMalayalam: "",
          primaryMemberMalayalamFullName: "",
          primaryMemberName: "",
          secondaryMemberMalayalamFullName: "",
          secondaryMemberName:"",
          speakerNoteUrl:"",
          title: "",
          tableDiaryLines : [
               {
                 id : null,
                 description : null,
                 type:"",
                 time: "" ,
                 isEdit : false
               }
           ],
           tableDiaryBulletinLines : [
             {
              id : null,
              description : null,
              isEdit: false
             }
           ]
        }
      ],
      businessName: "",
      businessNameMalayalam : "",
      active: false,
      disable : false
     }
   ]
  }
  rbsPermission = {
    liveEdit : false,
    fullEdit : false,
    bulletinEdit : false
  }
  notify: any;

  constructor(
    private commonService :TablescommonService,
    private TablediaryService : TablediaryService,
    private router: Router,
    private route: ActivatedRoute,
    private notification: NzNotificationService,
    @Inject("authService") private AuthService,
  
  ) {
    this.user = AuthService.getCurrentUser();
    this.commonService.setTablePermissions(this.user.rbsPermissions);
   this.tableDiaryMaster = this.route.snapshot.params.id
   }

  ngOnInit() {
    this.getRBSPermissions()
    this.setEditorConfig();
    // this.getBulletinPart1PreviewbyId()
    this.getDiarybyId();
  }

  getRBSPermissions(){
    if (this.commonService.doIHaveAnAccess('TABLE_DAIRY_LIVE_EDIT', 'UPDATE')) { 
    this.rbsPermission.liveEdit = true;
    }
    if (this.commonService.doIHaveAnAccess('TABLE_DIARY_FULL_EDIT', 'UPDATE')) {
      this.rbsPermission.fullEdit = true;
    }
    if (this.commonService.doIHaveAnAccess('CREATE_BULLETIN', 'UPDATE')) {
      this.rbsPermission.bulletinEdit = true;
    }
  }
  getDiarybyId(){
    this.diaryData = null;
    if(this.tableDiaryMaster){
      this.TablediaryService.getDiaryBulIletinByld(this.tableDiaryMaster)
      .subscribe((Res: any) => {
        this.diaryData = Res;
        if(Res.lobLines && Res.lobLines.length!= 0 ){
          this.getCurrentBusiness();
          
          this.diaryData.lobLines.forEach(lob => {
             
             lob.businessLines.forEach(business => {
               business.tableDiaryBulletinLines.forEach(bulletin => {
                
                
                 
               });
               
             });
          });
          
        }else{
         this.notification.create("warning","No Running Business is available","")
        }
      });
      
    }
    
  }
  setDatas(diaryData,childIndex,parentIndex){
    this.selectedBusiness = null;
    this.selectedBusiness = diaryData;
    
  }
  setEditorConfig() {
    this.modules = {
      toolbar: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline'],
       
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
      ]
    };
  }
 addNew(code){
 let newType =  { 
    id :null,
    time : this.getTime(),
    description : null,
    type : code.code,
    isEdit : true
   };
 this.selectedBusiness.tableDiaryLines.push(newType);
 }
 getTime(){
  var today = new Date();
  var hours = today.getHours();
  let minutes = today.getMinutes() as any;
  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
 }
 back(){
   window.history.back();
 }
 getTagName(code){
  if(code){
    let finded = this.buttonList.find(element=> element.code == code)
    return finded.title
  }
 }
 getTagColor(code){
   if(code){
     let finded = this.buttonList.find(element=> element.code == code)
     return finded.color
   }
 }
 saveDiaryLines(diaryData,diaryIndex){
   if(diaryData.description == null){
    this.notification.create("warning","Content is empty","");
    return;
   }
   let body ={
    id : diaryData.id ? diaryData.id : null,
    description : diaryData.description ? diaryData.description : "",
    type: diaryData.type ? diaryData.type : "DIARY_NOTE",
    time: diaryData.time ? diaryData.time : this.getTime(),
    lobAgendaBusinessLineId: this.selectedBusiness.id ? this.selectedBusiness.id : null,
    tableDiaryMasterId : this.tableDiaryMaster
   }
this.TablediaryService.saveBulletinPart1Line(body).subscribe((Res: any) => {
    if(Res.id){
      this.selectedBusiness.tableDiaryBulletinLines[diaryIndex].isEdit = false;
      this.selectedBusiness.tableDiaryBulletinLines[diaryIndex].id = Res.id;
    }
    this.notification.create("success","Success","")
  })
 }
 editDiaryLines(diaryIndex){
   this.selectedBusiness.tableDiaryBulletinLines[diaryIndex].isEdit = true;
  // this.selectedBusiness.tableDiaryLines[diaryIndex].isEdit = true;
 }
 getCurrentBusiness(){
   let today = new Date();
   const curdate = today.toISOString().split('T')[0];
   const dDate = new Date(this.diaryData.date).toISOString().split('T')[0];
  
   if(curdate == dDate){
    if(this.rbsPermission.liveEdit){
      this.getFileByRestApi();
      // this.getLiveBusiness();
     }
     else{
      this.diaryData.lobLines.forEach(lob => {
        lob.active = false
      });
     }
   }
 }
//  getLiveBusiness(){
//   this. _initializeSocket()
//  }
//  _initializeSocket() {
//   let ws = new SockJS(this.webSocketPoint);
//   this.stompClient = Stomp.over(ws);
//   const _this = this;
//   _this.stompClient.connect(
//     {},
//     function (frame) {
//       _this._connectToLiveFileSocket();
//     },
//     this.errorCallBack
//   );
// }
// errorCallBack(error) {
//   setTimeout(() => {
//     this._initializeSocket();
//   }, 5000);
// }
_connectToLiveFileSocket() {
  const _this = this;
  _this.stompClient.subscribe(_this.currentFile, function (sdkEvent) {
    _this.onFilePathTrigger(sdkEvent);
  });
}
onFilePathTrigger(message) {
  if(message !== null){
    this.activeBusiness = JSON.parse(message.body);
    if(this.activeBusiness){
    this.setSelectedBusinessAsActive();
    }
  }else{
    this.getFileByRestApi();
  }
}
getFileByRestApi() {
  this.TablediaryService.getStreamingFile().subscribe((res: any) => {
    this.activeBusiness = res;
     if(this.activeBusiness){
      this.setSelectedBusinessAsActive();
    }
  });
}
 setSelectedBusinessAsActive(){
  this.diaryData.lobLines.forEach(lob => {
     lob.businessLines.forEach(element => {
       if(this.activeBusiness.lobId && element.id == this.activeBusiness.lobId ){
        //  this.selectedBusiness = element;
         lob.active = true;
       }else{
        lob.active = false;
       }
     });
   let find = lob.businessLines.find(element => element.id == this.activeBusiness.lobId);
   if(find){
    lob.active = true;
    lob.disable = false
   }else{
    lob.active = false;
    lob.disable = true;
   }
  });
  
 }


 saveBulletinLines(diaryData,diaryIndex){
  if(diaryData.description == null){
   this.notification.create("warning","Content is empty","");
   return;
  }
  let body ={
   id : diaryData.id ? diaryData.id : null,
   description : diaryData.description ? diaryData.description : "",
   type: diaryData.type ? diaryData.type : "DIARY_NOTE",
   time: diaryData.time ? diaryData.time : this.getTime(),
   lobAgendaBusinessLineId: this.selectedBusiness.id ? this.selectedBusiness.id : null,
   tableDiaryMasterId : this.tableDiaryMaster
  }
  this.TablediaryService.saveBulletinPart1Line(body)
 .subscribe((Res: any) => {
   if(Res.id){
     this.selectedBusiness.tableDiaryLines[diaryIndex].isEdit = false;
     this.selectedBusiness.tableDiaryLines[diaryIndex].id = Res.id;
   }
   this.notification.create("success","Success","")
 })
}

listBulletinPart1(){
  this.router.navigate([
    "business-dashboard/tables/list-table-diary-bulletin-part1"
  ]);
} 

publishBulletinPart1(){
  this.TablediaryService.bulletinPart1Publish(this.tableDiaryMaster).subscribe((res: any) => {
      this.notification.success("Success", "Bulletin Published.");
  })
  

}
getBulletinPart1PreviewbyId(){
    this.diaryData = null;
    if(this.tableDiaryMaster){
      this.TablediaryService.getPreviewBulletinPart1byId(this.tableDiaryMaster)
      .subscribe((Res: any) => {
        this.diaryData = Res;
        
      });
     
    }
}
}
  




