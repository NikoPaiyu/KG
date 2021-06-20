import { Component, OnInit } from '@angular/core';
import { CalenderofsittingService } from 'src/app/business-dashboard/calender-of-sitting/shared/services/calenderofsitting.service';
import { differenceInCalendarDays } from 'date-fns';
import { AssemblyManagementService } from '../../shared/service/assembly-management.service';
import { NzNotificationService } from 'ng-zorro-antd';
import { elementAt } from 'rxjs-compat/operator/elementAt';
@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss']
})
export class SessionsComponent implements OnInit {
  allAssembly;
  maxAssemblyId;
  maxSessionId= null;
  newMaxSessionId= null;
  sessionId = null;
  assemblyValue = null;
  sessionValue = null;
  currentAssemblyId;
  currentSessionId;
  assemblyList:any=[];
  sessionList: any=[];
  tempSessionList: any = [];
  activeSession: any = [];
  formSessionList:any=[];
  search = null;
  isAssemblyVisibleModal = false;
  isSessionVisibleModal = false;
  astartDate = null;
  sstartDate = null;
  today = new Date();
  newAssemblyValue=null;
  newSessionValue=null;
  dateFormat = "dd-MM-yyyy";
  assemblyButton;
  sessionButton;
  dissolveButton;
  selectedSessionList:any=[];
  tempselectedSessionList:any=[];
  lastSessionActive = false;
  assemblyEndDate = new Date();
  isDissolveVisible = false;
  assemblyDissolved = true;

  constructor(private cos: CalenderofsittingService,
              private assembly: AssemblyManagementService,
              private notify: NzNotificationService) {}

  ngOnInit() {
    this.getAssembly();
    this.getCurrentAssemblySession();
    this.getSessionForAssembly();
  }
  getAssembly() {
    this.cos.getAllAssembly().subscribe((res: any) => {
      this.assemblyList = res;
      const temp = this.assemblyList.map((x) => x.assemblyId)
      this.assemblyValue =  Math.max.apply(null, temp);
      this.newAssemblyValue = this.assemblyValue + 1;
       res = this.assemblyList.map((x) => x.id);
      this.maxAssemblyId = Math.max.apply(null, res);
      if (this.activeSession) {
        this.allAssembly = this.assemblyList.find(x => x.id == this.activeSession.assemblyId);
        this.getSessionForAssembly();
      } else {
        this.allAssembly = this.assemblyList.find(x => x.id == this.maxAssemblyId);
        this.getSessionForAssembly();
      }
    });
  }
  getSession() {
    this.cos.getAllSession().subscribe((res: any)=>{
      this.sessionList = this.tempSessionList = res;
      console.log(this.sessionList);
    })
  }
  getSessionForAssembly(){
    if (this.allAssembly) {
      if (this.selectedSessionList && this.selectedSessionList.length > 0) {
        if (this.activeSession && this.activeSession.sessionId === this.selectedSessionList[this.selectedSessionList.length - 1].sessionId
          && this.activeSession.assemblyValue === this.allAssembly.assemblyId - 1) {
          this.lastSessionActive = true;
        }
      }
      this.assembly.getSessionForAssembly(this.allAssembly.id).subscribe((res:any)=>{
        this.selectedSessionList = this.tempselectedSessionList = res;
        if(this.selectedSessionList.length == 0){
          this.selectedSessionList.unshift({
            id: 0,
            sessionId: 0,
          });
        }
        const temp = this.selectedSessionList.map((x) => x.sessionId)
        this.sessionValue =  Math.max.apply(null, temp);
        this.newSessionValue = this.sessionValue + 1;
        const rest = this.selectedSessionList.map((x) => x.id)
        this.maxSessionId =  Math.max.apply(null, rest);
        this.newMaxSessionId = this.maxSessionId + 1;
        const response = this.sessionList.map((x) => x.sessionId);
        this.formSessionList = this.sessionList.filter(
          (s) => s.sessionId === this.newSessionValue
        );
  
        this.selectedSessionList.forEach(element => {
          if(element.isActive === true){
            element.checked = true;
          }
          else {
            element.checked = false;
          }
        });
        if(this.maxAssemblyId === this.currentAssemblyId){
          this.assemblyButton = false;
        }
        else {
          this.assemblyButton = true;
        }
        if(this.allAssembly.id === this.currentAssemblyId){
          this.dissolveButton = false;
        }
        else {
           this.dissolveButton = true;
        }
        if((this.allAssembly.id == this.currentAssemblyId && this.maxSessionId == this.currentSessionId) ||
        (this.allAssembly.id > this.currentAssemblyId && this.maxSessionId == 0 && this.lastSessionActive)){
          this.sessionButton = false;
        }
        else {
          this.sessionButton = true;
        }
      })
    }
  } 
 getCurrentAssemblySession() {
   this.cos.getActiveAssemblySession().subscribe((res:any)=> {
     this.activeSession = res;
     this.currentAssemblyId = this.activeSession.assemblyId;
     this.currentSessionId = this.activeSession.sessionId;
     if (this.assemblyList) {
      this.allAssembly = this.assemblyList.find(x => x.id == this.activeSession.assemblyId);
      this.getSessionForAssembly();
     }
     this.getSession();
     this.assemblyDissolved = false;
   })
 }
 onSearch(){
  if (this.search) {
    this.selectedSessionList = this.tempselectedSessionList.filter(
      (element) =>
        (element.sessionId &&
          element.sessionId.toString()
            .toLowerCase()
            .includes(this.search.toLowerCase())) 
    );
  } else {
    this.selectedSessionList = this.tempselectedSessionList;
  }
}
assemblyModel(){
  this.isAssemblyVisibleModal = true;
}
creatSessionModel(){
  this.isSessionVisibleModal = true;
}
handleCancel(){
  this.isAssemblyVisibleModal = false;
  this.isSessionVisibleModal = false;
  this.sstartDate = null;
  this.astartDate = null;
  this.sessionId = null;
}
disabledDate = (current: Date): boolean => {
  return differenceInCalendarDays(current, this.today) < -7;
}

disabledEndDate = (current: Date): boolean => {
  return differenceInCalendarDays(current, this.today) > 0;
}

createAssembly(){
  const body = {
    assemblyId:this.newAssemblyValue,
    startDate:this.astartDate
  }
  this.assembly.createAssembly(body).subscribe((res:any)=>{
    this.notify.success("Success", "Assembly created Successfully !");
    this.isAssemblyVisibleModal = false;
    this.astartDate = null;
  })
}
createSession(){
  const body = {
    assemblyId: this.allAssembly.id,
    sessionId: this.sessionId,
    current:false,
    startDate:this.sstartDate
  }
  this.assembly.createSession(body).subscribe((res:any)=>{
    this.notify.success("Success", "Session created Successfully !");
    this.isSessionVisibleModal = false;
    this.sessionId = null;
    this.sstartDate = null;
    this.getSessionForAssembly();
  })
}
dissolveAssembly(){
  const body = {
    assemblyId:this.allAssembly.id,
    sessionId:this.currentSessionId,
    endDate: this.assemblyEndDate
  }
  this.assembly.dissolveAssembly(body).subscribe((res:any)=>{
    this.activeSession = null;
    this.handleDissolveCancel();
    this.getAssembly();
    this.assemblyDissolved = true;
    this.notify.success("Sucess", "Dissolved Assembly and Session Successfully!");
  })
}
setCurrentAssemblyAndSession(session) {
  const body = {
    assemblyId: this.allAssembly.id,
    assemblyValue:  this.allAssembly.assemblyId,
    current: true,
    id: session.cosAssemblySessionId,
    sessionId: session.id,
    sessionValue: session.sessionId,
  };
  this.assembly.setCurrentAssemblyAndSession(body).subscribe((res:any)=>{
    this.notify.success('Sucess', 'Current Assembly and Session Changed Successfully!');
    this.getCurrentAssemblySession();
    this.getSessionForAssembly();
  });
}

handleDissolveCancel() {
  this.isDissolveVisible = false;
  this.assemblyEndDate = new Date();
}

showDissolveModal() {
  this.isDissolveVisible = true;
}

}
