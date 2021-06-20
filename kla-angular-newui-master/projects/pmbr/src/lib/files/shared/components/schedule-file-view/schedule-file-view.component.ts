import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { PmbrCommonService } from '../../../../shared/services/pmbr-common.service';

@Component({
  selector: 'pmbr-schedule-file-view',
  templateUrl: './schedule-file-view.component.html',
  styleUrls: ['./schedule-file-view.component.scss']
})
export class ScheduleFileViewComponent implements OnInit {
  @Input() scheduleData;
  assemblyList: any;
  sessionList: any;
  sessionId = null;
  assemblyId = null;
  assemblySession: any = null;
  constructor(private pmbrCommonService: PmbrCommonService,
              private router: Router,) { }

  ngOnInit() {
    this.setAssemblySession();
  }
  
  setAssemblySession() {
    this.pmbrCommonService.getAllAssemblyAndSession().subscribe((Res: any) => {
      this.assemblyList = Res.assembly;
      this.assemblySession = Res.assemblySession;
      this.assemblyId = Res.activeAssemblySession.assemblyId;
      this.getSessionForAssembly();
      // this.sessionId = Res.activeAssemblySession.sessionId;
    });
  }
  getSessionForAssembly() {
    this.sessionList = [];
    if (this.assemblyId === 0) {
      this.sessionId = 0;
      this.sessionList = [{
        id: 0,
        sessionId: 'No Session',
      }];
    } else {
      if (this.assemblyId && this.assemblySession.find(x => x.id === this.assemblyId)) {
        this.sessionId = null;
        this.sessionList = this.assemblySession.find(x => x.id === this.assemblyId).session;
      }
      
    }
  }
  // edit schedule of dates
  editSchedule( action ,scheduleId) {
    this.router.navigate(['/business-dashboard/pmbr/create-schedule', action,scheduleId])
  }
}
