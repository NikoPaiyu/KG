import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { differenceInCalendarDays } from 'date-fns';
import { NzNotificationService } from 'ng-zorro-antd';
import { TablediaryService } from '../../shared/services/tablediary.service';
import { TablescommonService } from '../../shared/services/tablescommon.service';

@Component({
  selector: 'tables-create-resume',
  templateUrl: './create-resume.component.html',
  styleUrls: ['./create-resume.component.css']
})
export class CreateResumeComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  // assemblySession = {
  //   assemblyList : [],
  //   sessionList : []
  // };

  assemblyList = [];
  assemblySession: any = null;
  sessionList = [];
  sessionId = null;
  assemblyId = null;

  currentAssemblySession = null;
  dateList =[];
  disabledCosDates: any;
  dateSelected = null
 sessionSelected = null;
 assemblySelected = null

  constructor(
    private common :TablescommonService,
    private datePipe: DatePipe,
    private TablediaryService : TablediaryService,
    private notification: NzNotificationService,
    private router: Router
  ) { }

  ngOnInit() {
    // this.getAssemblySession();

    this.TablediaryService.getAllAssemblyAndSession()
    .subscribe((res: any) => {
      this.assemblySession = res.assemblySession;
      this.assemblyList = res.assembly;
      
      });
  }

  getSessionForAssembly() {
    this.sessionId = null;
    this.sessionList = [];
    if (this.assemblyId === 0) {
      // this.sessionList = [{
      //         id: 0,
      //         sessionId: 'No Session',
      //       }];
    } else {
      if (this.assemblySession.find(x => x.id === this.assemblyId)) {
        this.sessionList = this.assemblySession.find(x => x.id === this.assemblyId).session;
      }
    }
  }

  getAssemblyAndSession() {
    this.assemblyId = null;
    this.sessionId = null;
}

  // getAssemblySession() {
  //   this.common.getAllAssembly().subscribe((assembly) => {
  //     this.common.getAllSession().subscribe((session) => {
  //       this.common.getCurrentAssemblyAndSession().subscribe((active) => {
  //         if (Array.isArray(session) && Array.isArray(assembly)) {
  //           this.assemblySession.assemblyList = assembly;
  //           this.assemblySession.sessionList= session;
  //           this.currentAssemblySession = active;
  //         }
  //       });
  //     });
  //   });
  // }
  cancel(){
    this.onCancel.emit(false);
  }

  createResume(){
      let body ={
      id : null,
      sessionId : this.sessionId,
      assemblyId : this.assemblyId,
      description:null
    }
    this.TablediaryService.saveResume(body)
    .subscribe((Res: any) => {
      this.notification.create("success", "Success", "Success");
      this.router.navigate([
        "business-dashboard/tables/resume-prepare",
        Res.id,
      ]);
    });
  
  }

}





  


