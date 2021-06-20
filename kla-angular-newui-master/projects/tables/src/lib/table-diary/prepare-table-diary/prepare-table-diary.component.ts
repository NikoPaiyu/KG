import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { TablediaryService } from '../../shared/services/tablediary.service';
import { TablescommonService } from '../../shared/services/tablescommon.service';
import * as Stomp from "stompjs";
import * as SockJS from "sockjs-client";
@Component({
  selector: 'tables-prepare-table-diary',
  templateUrl: './prepare-table-diary.component.html',
  styleUrls: ['./prepare-table-diary.component.css']
})
export class PrepareTableDiaryComponent implements OnInit {
  webSocketPoint = this.TablediaryService.getSocket();
  currentFile: string = "/session-socket/currentBusiness";
  stompClient: any;
  activeBusiness = null;
  today = new Date();
buttonList = [
    { title: "Diary Note", code: "DIARY_NOTE", id: 5, color: "magenta" },
    { title: "Point of Order", code: "POINT_OF_ORDER", id: 11, color: "cyan" },
    { title: "Personal Explanation", code: "EXPLANATION", id: 12, color: "geekblue" },
    { title: "Intervention", code: "INTERVENTION", id: 13, color: "purple" },
    { title: "Supplimentary", code: "SUPPLIMENTARY", id: 14, color: "yellow" }
];
parentBusiness = null;
isPdfVisible = false;
dateSelected = null;
isPreviewVisible = false;
user;
  selectedBusiness = null;
  tableDiaryMaster;
  modules: any;
  diaryData = {
    assemblyValue: null,
    sessionValue : null,
    date:null,
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
                 time: null,
                 isEdit : false
               }
           ],
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
    bulletinPart1Create : false
  }
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
    this.getDiarybyId()
    console.log("loged by: ",this.commonService);
  }
  getRBSPermissions(){
    if (this.commonService.doIHaveAnAccess('TABLE_DAIRY_LIVE_EDIT', 'UPDATE')) { 
    this.rbsPermission.liveEdit = true;
    }
    if (this.commonService.doIHaveAnAccess('TABLE_DIARY_FULL_EDIT', 'UPDATE')) {
      this.rbsPermission.fullEdit = true;
    }
    if (this.commonService.doIHaveAnAccess('CREATE_BULLETIN', 'CREATE')) {
      this.rbsPermission.bulletinPart1Create = true;
    }
  }
  getDiarybyId(){
    this.diaryData = null;
    if(this.tableDiaryMaster){
      this.TablediaryService.getDiarybyId(this.tableDiaryMaster)
      .subscribe((Res: any) => {
        this.diaryData = Res;
        if(Res.lobLines && Res.lobLines.length!= 0 ){
          this.getCurrentBusiness();
          this.diaryData.lobLines.forEach(lob => {
             lob.active = false;
             lob.disable = false;
             lob.businessLines.forEach(business => {
               business.tableDiaryLines.forEach(element => {
                element.isEdit = element.id ? false : true;
                element.type = element.id ?  element.type  : "DIARY_NOTE" ;
                element.time = element.id ?  new Date(element.time)  : this.today;
               });
             });
          });
          
        }else{
         this.notification.create("warning","No Running Business is available","")
        }
      });
    }
  }
  setDatas(diaryData,childIndex,parentPanel){
    this.selectedBusiness = null;
    this.selectedBusiness = diaryData;
    this.parentBusiness = parentPanel;
    console.log(this.diaryData);
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
    time : new Date(),
    description : null,
    type : code.code,
    isEdit : true
   };
   
 this.selectedBusiness.tableDiaryLines.push(newType);
 }
 getTime(diaryTime){
  var time = new Date(diaryTime);
  var hours = time.getHours();
  let minutes = time.getMinutes() as any;
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
    time: diaryData.time ? diaryData.time : this.today,
    lobAgendaBusinessLineId: this.selectedBusiness.id ? this.selectedBusiness.id : null,
    tableDiaryMasterId : this.tableDiaryMaster
   }
  this.TablediaryService.saveDiaryLines(body)
  .subscribe((Res: any) => {
    if(Res.id){
      this.selectedBusiness.tableDiaryLines[diaryIndex].isEdit = false;
      this.selectedBusiness.tableDiaryLines[diaryIndex].id = Res.id;
    }
    this.notification.create("success","Success","")
  })
 }
 editDiaryLines(diaryIndex){
  this.selectedBusiness.tableDiaryLines[diaryIndex].isEdit = true;
  this.selectedBusiness.tableDiaryLines[diaryIndex].time = new Date();
 }
 getCurrentBusiness(){
   let today = new Date();
   const curdate = today.toISOString().split('T')[0];
   const dDate = new Date(this.diaryData.date).toISOString().split('T')[0];
  
   if(curdate == dDate){
    if(this.rbsPermission.liveEdit){
      this.getFileByRestApi();
      this.getLiveBusiness();
     }
     else{
      this.diaryData.lobLines.forEach(lob => {
        lob.active = false
      });
     }
   }
 }
 getLiveBusiness(){
  this. _initializeSocket()
 }
 _initializeSocket() {
  let ws = new SockJS(this.webSocketPoint);
  this.stompClient = Stomp.over(ws);
  const _this = this;
  _this.stompClient.connect(
    {},
    function (frame) {
      _this._connectToLiveFileSocket();
    },
    this.errorCallBack
  );
}
errorCallBack(error) {
  setTimeout(() => {
    this._initializeSocket();
  }, 5000);
}
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
    //  lob.businessLines.forEach(element => {
    //    if(this.activeBusiness.lobId && element.id == this.activeBusiness.lobId ){
    //     //  this.selectedBusiness = element;
    //      lob.active = true;
    //    }else{
    //     lob.active = false;
    //    }
    //  });
   let find = lob.businessLines.find(element => element.id == this.activeBusiness.lobId);
   if(find){
    lob.active = true;
    lob.disable = false
   }else{
    lob.active = false;
    lob.disable = true;
   }
  });
  console.log("lob lines",this.diaryData.lobLines)
 }

 bulletinPart1 (){
   console.log(this.diaryData);
  this.TablediaryService.generateBulletinPart1(this.tableDiaryMaster)
  .subscribe((Res: any) => {
    this.notification.create("success", "Success", "Success");
    this.router.navigate([
      "business-dashboard/tables/table-diary-bulletin-part1",
      Res.id,
    ]);
    
  });
  
 }

 getTagList(){
   if(this.parentBusiness &&  this.parentBusiness.businessName && this.parentBusiness.businessName === 'Questions' ){
    return this.buttonList;
   }
   else{
    return this.buttonList.filter(x => x.code !== 'SUPPLIMENTARY');
     
   }
 }

 showPreview(){
   this.isPreviewVisible = true;
 }
 
}

