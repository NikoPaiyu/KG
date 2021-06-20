import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { CommitteeService } from '../../shared/services/committee.service';

import { CommitteecommonService } from '../../shared/services/committeecommon.service';
import { FileServiceService } from '../../shared/services/file-service.service';
@Component({
  selector: 'committee-staff-allocation',
  templateUrl: './staff-allocation.component.html',
  styleUrls: ['./staff-allocation.component.css']
})
export class StaffAllocationComponent implements OnInit {
  @Input() fileView = false;
  @Input() staffDetail;
  @Input() meeting;
  staffForm:FormGroup;
  // fileView = false;
  staffTitle =""
  meetingId;
  staffData:any;
  assistantData=[];
  officerData=[];
  officeAttendendData=[];
  reporterData=[];
  assistantArray = [];
  officerArray = [];
  officeAttendantArray = [];
  reporterArray = [];
  meetingDetails;
  showAddStaff = false;
  allAssistant:any;
  listofAllAssistant:any;
  allOfficer:any;
  listOfAllOfficer:any;
  allOfficeAttendent:any;
  listOfallOfficeAttendent:any;
  allReporter:any;
  listOfAllReporter:any;
  tabType;
  user;
  purpose;
  editMode=true;
  isSubmitted = false;
  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private notification: NzNotificationService,
              @Inject("authService") private AuthService,
              private committeeService: CommitteeService,
              private committeeCommonService: CommitteecommonService,
              private fileService : FileServiceService
    ) {
      this.user = AuthService.getCurrentUser();
   }
  ngOnInit() {
    this.route.params.subscribe((params) => {
      if( params.id && !this.fileView){
        this.meetingId = params.id;
        this.getMeetingById();
        this.getAllStaffList();
      }else{
        this.meetingDetails = this.meeting;
        this.meetingId = this.meeting.id;
        this.staffData = this.staffDetail;
        this.setStaffData();
        this.editMode = false;
      }
      this.purpose = params.purpose;
      if(this.purpose == 'fullview' || this.purpose == 'view'){
        this.editMode = false;
      }
    });
  }
  getMeetingById(){
    this.committeeService.getMeetingById(this.meetingId).subscribe((res: any) => {
      this.meetingDetails = res;
      if(this.meetingDetails.staffRoles){
        this.staffData = this.meetingDetails.staffRoles;
        this.setStaffData();
      }else{
         this.staffData=[];
      }
    });
  }
  setStaffData(){
   let assisntres =this.staffData.find(element => element.code == 'ASSISTANT');
   if (assisntres.staff) {
    assisntres.staff.forEach((element) => {
      this.addStaff(element,'assistant','old');
    });
  }
  assisntres = null;
   let officerRes =this.staffData.find(element => element.code == 'OFFICER');
   if ( officerRes.staff) {
    officerRes.staff.forEach((element) => {
      this.addStaff(element,'officer','old');
    });
  }
   let attendRes=this.staffData.find(element => element.code == 'OFFICE_ATTENDANT');
   if (attendRes.staff) {
    attendRes.staff.forEach((element) => {
      this.addStaff(element,'officeAttendant','old');
    });
  }
   let repRes =this.staffData.find(element => element.code == 'REPORTER');
   if (repRes.staff) {
    repRes.staff.forEach((element) => {
      this.addStaff(element,'reporter','old');
    });
  }
  }
  addStaff(data,category,membertype){
    let fg ={
      id: data.id ? data.id : null,
      userId: data.userId ? data.userId : null,
      operationType : '',
      newmember : membertype,
      details: data.details ? data.details : data.user.details
    };
    if(category == 'assistant'){
      this.assistantArray.push(fg);
      this.assistantData.push(fg);
    }
    else if(category == 'officer'){
      this.officerArray.push(fg);
      this.officerData.push(fg);
    }
    else if(category == 'officeAttendant'){
      this.officeAttendantArray.push(fg);
      this.officeAttendendData.push(fg);
    }
   else if(category == 'reporter'){
    this.reporterArray.push(fg)
    this.reporterData.push(fg);
    }
  }
  deleteAssistant(item,index){
   this.assistantArray.splice(index, 1);
   if(this.assistantData[index].newmember == 'new'){
    this.assistantData.splice(index, 1);
   }else{
    this.assistantData[index].operationType = "DELETE";
   }
  }
  deleteOfficer(item,index){
    this.officerArray.splice(index, 1);
    if(this.officerData[index].newmember == 'new'){
     this.officerData.splice(index, 1);
    }else{
     this.officerData[index].operationType = "DELETE";
    }
   }
   deleteOfficeAttendent(item,index){
    this.officeAttendantArray.splice(index, 1);
    if(this.officeAttendendData[index].newmember == 'new'){
     this.officeAttendendData.splice(index, 1);
    }else{
     this.officeAttendendData[index].operationType = "DELETE";
    }
   }
   deleteReporter(item,index){
    this.reporterArray.splice(index, 1);
    if(this.reporterData[index].newmember == 'new'){
     this.reporterData.splice(index, 1);
    }else{
     this.reporterData[index].operationType = "DELETE";
    }
   } 
resetArrays(){
this.officerArray = [];
this.officerData =[];
this.assistantArray = [];
this.assistantData =[];
this.officeAttendantArray = [];
this.officeAttendendData = [];
this.reporterArray = [];
this.reporterData = [];
}
checkArrayValidity(){
  let arrayValidity = true;
  if(this.assistantArray.length < 1 || 
      this.officeAttendantArray.length < 1 ||
      this.officerArray.length < 1 ||
      this.reporterArray.length < 1 
      ){
      arrayValidity= false;
       }
  return arrayValidity;
}
saveStaffData(){
  this.isSubmitted = true;
  if(this.checkArrayValidity()){
  let reqBody = this.buildRequestBody();
  this.editMode = false;
  console.log("reqBody",reqBody);
  this.committeeService
    .saveStaffAlloctaion(reqBody)
    .subscribe((Res:any) => {
      this.notification.success("Success", " Saved Successfully");
      this.router.navigate(["business-dashboard/committee/file-view/",this.meetingDetails.fileId]);
    });
  }else{
    this.notification.warning("Please add missing data","");
  }

}
saveandResubmitData(){
this.isSubmitted = true;
if(this.checkArrayValidity()){
this.fileService.getFileById(this.meetingDetails.fileId, this.user.userId).subscribe((res: any) => {
 if(res.fileResponse.status == 'APPROVED'){
  this.editMode = false;
  let reqBody = this.buildRequestBody();
  console.log("reqBody",reqBody);
  this.committeeService
    .saveStaffAlloctaion(reqBody)
    .subscribe((Response:any) => {
  let fileReqbody={
        meetingStaffAllocationId: Response.id,
        fileForm: {
          activeSubTypes: ["MEETING_STAFF_ALLOCATION"],
          fileId:this.meetingDetails.fileId,
          subtype :"COMMITTEE_MEETING",
          type:"COMMITTEE",
          userId : this.user.userId
        }
         };    
  this.fileService
      .reSubmitFile(fileReqbody)
      .subscribe((Res:any) => {
        this.notification.success("Success", " Resubmitted Successfully");
        this.router.navigate(["business-dashboard/committee/file-view/",this.meetingDetails.fileId]);
      });
    });
  }
  else{
this.notification.warning("Sorry..","Currently file is under approval flow..Cannot resubmit now... ")
  }
  });
}
else{
  this.notification.warning("Please add missing data","");
} 
}
buildRequestBody(){
  let reqBody = {
  id :  this.meetingDetails.staffAllocationId ? this.meetingDetails.staffAllocationId : null,
  fileId: this.meetingDetails.fileId,
  fileNumber : this.meetingDetails.fileNumber,
  meeting:{
    id: this.meetingDetails.id
  },
  staffRoles: [
    {
      code : "ASSISTANT",
      staff: this.assistantData
    },
    {
      code : "OFFICER",
      staff: this.officerData
    },
    {
      code : "OFFICE_ATTENDANT",
      staff: this.officeAttendendData
    },
    {
      code : "REPORTER",
      staff: this.reporterData
    }
  ],
  };
  return reqBody;
}
showStaffPopup(category){
  this.tabType = category;
  console.log('tabTYpe',this.tabType);
  if(this.tabType == 'assistant'){
    this.staffTitle ="Add Assistant"
    this.allAssistant = this.listofAllAssistant;
    this.assistantArray.forEach(element => {
      this.allAssistant = this.allAssistant
      .filter(x => x.userId != element.userId); 
    });
  }else if(this.tabType == 'officer'){
    this.staffTitle ="Add Officer"
    this.allOfficer = this.listOfAllOfficer;
    this.officerArray.forEach(element => {
      this.allOfficer = this.allOfficer
      .filter(x => x.userId != element.userId); 
    });
  }else if(this.tabType == 'officeAttendant'){
    this.staffTitle ="Add Office Attendant"
    this.allOfficeAttendent = this.listOfallOfficeAttendent;
    this.officeAttendantArray.forEach(element => {
      this.allOfficeAttendent = this.allOfficeAttendent
      .filter(x => x.userId != element.userId); 
    });
  }else if(this.tabType == 'reporter'){
    this.staffTitle ="Add Reporter"
    this.allReporter = this.listOfAllReporter;
    this.reporterArray.forEach(element => {
      this.allReporter = this.allReporter
      .filter(x => x.userId != element.userId); 
    });
  }
  this.showAddStaff = true;
}
getAllStaffList(){
  this.staffList('assistant');
  this.staffList('officer');
  this.staffList('officeAssistant');
  this.staffList('reporter');
}
staffList(type){
  this.committeeCommonService
  .getAllUserListOfStaff(type)
  .subscribe((Res) => {
    if(type == 'assistant'){
      this.allAssistant = this.listofAllAssistant =Res;
      this.allOfficer = this.listOfAllOfficer = Res;
      this.allReporter = this.listOfAllReporter = Res;
    }
    // else if(type == 'officer'){
    //   this.allOfficer = this.listOfAllOfficer = Res;
    // }
    else if(type == 'officeAssistant'){
    this.allOfficeAttendent = this.listOfallOfficeAttendent =Res;
    }
    // else if(type == 'reporter'){
    //   this.allReporter = this.listOfAllReporter = Res;
    // }
  });
}
hideStaffPopUp(event){
 this.showAddStaff = event;
}
generateNewStaffData(data){
data.id = null;
data.newmember = 'new';
data.operationType = '';
return data;
}
addStaffFromPopUp(member){
  if(this.tabType == 'assistant'){
    member.forEach(element => {
     this.addStaff(element,'assistant','new')
    });
    this.allAssistant = this.allAssistant
    .filter(x => !member.map(y => y.userId).includes(x.userId));
  }
  else if(this.tabType == 'officer'){
    member.forEach(element => {
      this.addStaff(element,'officer','new');
   });
   this.allOfficer = this.allOfficer
  .filter(x => !member.map(y => y.userId).includes(x.userId));
  }
  else if(this.tabType == 'officeAttendant'){
    member.forEach(element => {
      this.addStaff(element,'officeAttendant','new')

   });
   this.allOfficeAttendent = this.allOfficeAttendent
   .filter(x => !member.map(y => y.userId).includes(x.userId));
  }
  else if(this.tabType == 'reporter'){
    member.forEach(element => {
      this.addStaff(element,'reporter','new')
   });
   this.allReporter = this.allReporter
   .filter(x => !member.map(y => y.userId).includes(x.userId));
  }
 
}
gotoFullview(){
  this.router.navigate(['/business-dashboard/committee/staff-allocation','fullview',this.meetingId]);
}
gotoBack(){
  window.history.back();
}
editStaff(){
  this.editMode = true;
}
cancelStaff(){
  this.editMode = false;
  this.resetArrays();
  this.setStaffData();
  // this.getMeetingById();
}
}
