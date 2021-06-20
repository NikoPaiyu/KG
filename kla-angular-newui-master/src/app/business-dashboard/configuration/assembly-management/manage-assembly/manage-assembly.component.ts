import { Component, OnInit } from '@angular/core';
import { differenceInCalendarDays } from 'date-fns';
import { NzNotificationService } from 'ng-zorro-antd';
import { CalenderofsittingService } from 'src/app/business-dashboard/calender-of-sitting/shared/services/calenderofsitting.service';
import { AssemblyManagementService } from '../../shared/service/assembly-management.service';

@Component({
  selector: 'app-manage-assembly',
  templateUrl: './manage-assembly.component.html',
  styleUrls: ['./manage-assembly.component.scss']
})
export class ManageAssemblyComponent implements OnInit {
  assemblyList: any = null;
  activeAssembly: any = null;
  assemblyId: any = null;
  sessionList: any = null;
  maxValues = {
    assembly: null,
    session: null
  };
  isAssemblyVisibleModal = false;
  constitutionDate = new Date();
  isDissolveVisible = false;
  dissolutionDate = new Date();
  activeSession: any = null;
  isSessionVisibleModal = false;
  isActivateAssemblyVisible = false;
  allSessionList: any = null;
  isDissolveSessionVisible = false;

  constructor(private cos: CalenderofsittingService,
              private assembly: AssemblyManagementService,
              private notify: NzNotificationService) { }

  ngOnInit() {
    this.getAllAssembly();
    this.getAllSession();
  }

  getAllAssembly() {
    this.cos.getAllAssembly().subscribe((res: any) => {
      this.assemblyList = res;
      this.activeAssembly = null;
      this.activeAssembly = res.find(x => x.status === 'ACTIVE');
      this.maxValues.assembly = null;
      this.maxValues.assembly =  res.find(x => x.assemblyId === Math.max.apply(null, this.assemblyList.map((x) => x.assemblyId)));
      if (this.activeAssembly) {
        this.assemblyId = this.activeAssembly;
      } else {
        this.assemblyId = this.maxValues.assembly;
      }
      this.getSessionForAssembly();
    });
  }

  getSessionForAssembly() {
    this.assembly.getSessionForAssembly(this.assemblyId.id).subscribe((res: any) => {
      this.sessionList = res;
      this.maxValues.session = null;
      this.activeSession = null;
      this.maxValues.session =  res.find(y => y.sessionId === Math.max.apply(null, this.sessionList.map((x) => x.sessionId)));
      if (this.assemblyId.assemblyId === this.activeAssembly.assemblyId) {
        this.activeSession =  this.sessionList.find(x => x.isActive === true);
      }
    });
  }

  setCurrentAssemblyAndSession(session) {
    const body = {
      assemblyId: this.assemblyId.id,
      assemblyValue:  this.assemblyId.assemblyId,
      current: true,
      id: session.cosAssemblySessionId,
      sessionId: session.id,
      sessionValue: session.sessionId,
      startDate: this.constitutionDate
    };
    this.assembly.activateSession(body).subscribe((res: any) => {
      this.notify.success('Sucess', 'Current Assembly and Session Changed Successfully!');
      this.getSessionForAssembly();
    });
  }

  assemblyModel() {
    this.isAssemblyVisibleModal = true;
  }

  disabledDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, new Date()) < -7;
  }

  handleCancel(){
    this.isAssemblyVisibleModal = false;
    this.isSessionVisibleModal = false;
    this.constitutionDate = new Date();
  }

  createAssembly() {
    const body = {
      assemblyId: this.activeAssembly ? this.activeAssembly.assemblyId + 1 : this.maxValues.assembly.assemblyId + 1,
      startDate: null
    };
    this.assembly.createDraftAssembly(body).subscribe((res: any) => {
      this.getAllAssembly();
      this.notify.success('Success', 'Assembly Created Successfully !');
      this.isAssemblyVisibleModal = false;
    });
  }

  handleDissolveCancel() {
    this.isDissolveVisible = false;
    this.dissolutionDate = new Date();
  }

  showDissolveModal() {
    this.isDissolveVisible = true;
  }

  activateAssembly() {
    const body = {
      assemblyId: this.assemblyId.id,
      startDate: this.constitutionDate
    };
    this.assembly.activateAssembly(body).subscribe((res: any) => {
      this.getAllAssembly();
      this.handleActivateCancel();
      this.notify.success('Success', 'Assembly Activated!');
    });
  }

  creatSessionModel() {
    this.isSessionVisibleModal = true;
  }

  dissolveAssembly(){
    const body = {
      assemblyId: this.assemblyId.id,
      sessionId: null,
      endDate: this.dissolutionDate
    };
    this.assembly.dissolveAssembly(body).subscribe((res:any)=>{
      this.activeSession = null;
      this.handleDissolveCancel();
      this.dissolutionDate = new Date();
      this.getAllAssembly();
      this.notify.success('Sucess', 'Dissolved Assembly Successfully!');
    });
  }

  createSession() {
    let newSession = null;
    if (this.maxValues.session) {
      newSession = this.allSessionList.find(x => x.sessionId === this.maxValues.session.sessionId + 1);
    } else {
      newSession = this.allSessionList.find(x => x.sessionId === 1);
    }
    // const body = {
    //   assemblyId: this.assemblyId.id,
    //   sessionId: newSession,
    //   current: false,
    //   startDate: this.constitutionDate
    // };
    const body = {
      assemblyId: this.assemblyId.id,
      assemblyValue:  this.assemblyId.assemblyId,
      current: true,
      sessionId: newSession.id,
      sessionValue: newSession.sessionId,
      startDate: this.constitutionDate
    };
    this.assembly.activateSession(body).subscribe((res: any) => {
      this.notify.success('Success', 'Session created Successfully!');
      this.isSessionVisibleModal = false;
      this.constitutionDate = new Date();
      this.getSessionForAssembly();
    });
  }

  disabledEndDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, new Date()) > 0;
  }

  handleActivateCancel() {
    this.constitutionDate = new Date();
    this.isActivateAssemblyVisible = false;
  }

  showActivateModal() {
    this.isActivateAssemblyVisible = true;
  }

  getAllSession() {
    this.cos.getAllSession().subscribe((res: any) => {
      this.allSessionList = res;
    });
  }

  showDissolveSesssionModal() {
    this.isDissolveSessionVisible = true;
  }

  closeDissolveSesssionModal() {
    this.isDissolveSessionVisible = false;
  }

  dissolveSession() {
    const body = {
      assemblyId: this.assemblyId.id,
      sessionId: this.activeSession.id,
      endDate: this.dissolutionDate
    };
    this.assembly.dissolveAssemblySession(body).subscribe((res: any) => {
      this.notify.success('Success', 'Session Dissolved Successfully!');
      this.closeDissolveSesssionModal();
      this.dissolutionDate = new Date();
      this.getSessionForAssembly();
    });
  }

}
