import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { TablescommonService } from '../../shared/services/tablescommon.service';
import { ReporterDairyTableComponent } from '../shared/components/reporter-dairy-table/reporter-dairy-table.component';
import { IPermissionProceedings } from '../shared/models/proceedingReporter.model';
import { ProceedingReportService } from '../shared/services/proceeding-report.service';

@Component({
  selector: 'tables-list-proceeding-diary',
  templateUrl: './list-proceeding-diary.component.html',
  styleUrls: ['./list-proceeding-diary.component.css']
})
export class ListProceedingDiaryComponent implements OnInit {
  showProceedingDiaryModel = false;
  myReportsDiaryList: any
  approvedDiaryList: any
  forActionDiaryList: any
  publishedReportsList: any
  assemblySession = {
    assemblyList: [],
    sessionList: []
  };
  currentAssemblySession = {
    assemblyId: null,
    sessionId: null
  };
  searchParams: string = ''
  permissions: IPermissionProceedings = new IPermissionProceedings();
  currentUser: any;
  @ViewChild(ReporterDairyTableComponent, { static: false }) childTableComponent: ReporterDairyTableComponent;
  constructor(private reportService: ProceedingReportService, private common: TablescommonService,
    private notification: NzNotificationService, @Inject('authService') private AuthService,
    private router: Router,) {
    this.currentUser = AuthService.getCurrentUser();
    this.common.setTablePermissions(this.currentUser.rbsPermissions);
  }

  ngOnInit() {
    this.checkRbsPermission();
    this.getAssemblySession();
  }

  checkRbsPermission() {
    this.permissions = this.reportService.checkRbsPermission();
  }

  getAssemblySession() {
    this.common.getAllAssembly().subscribe((assembly) => {
      this.common.getAllSession().subscribe((session) => {
        this.common.getCurrentAssemblyAndSession().subscribe((active: any) => {
          if (Array.isArray(session) && Array.isArray(assembly)) {
            this.assemblySession.assemblyList = assembly;
            this.assemblySession.sessionList = session;
            this.currentAssemblySession = active;
            this.forActionTabClick();
          }
        });
      });
    });
  }

  myReportTabClick() {
    this.publishedReportsList = null;
    this.approvedDiaryList = null;
    this.forActionDiaryList = null;
    this.searchParams = '';
    this.getMyReportDiaryList();
  }

  forActionTabClick() {
    this.publishedReportsList = null;
    this.myReportsDiaryList = null;
    this.approvedDiaryList = null;
    this.searchParams = '';
    this.getForActionReports()
  }

  approvedTabClick() {
    this.publishedReportsList = null;
    this.myReportsDiaryList = null;
    this.forActionDiaryList = null;
    this.searchParams = '';
    this.getApprovedReports()
  }

  publishTabClick() {
    this.myReportsDiaryList = null;
    this.forActionDiaryList = null;
    this.approvedDiaryList = null;
    this.searchParams = '';
    this.getPublishReportDiaryList()
  }

  getApprovedReports() {
    if (
      this.currentAssemblySession.assemblyId &&
      this.currentAssemblySession.sessionId
    ) {
      this.reportService.getApprovedProceedginDiaryList(this.currentAssemblySession.assemblyId, this.currentAssemblySession.sessionId).subscribe(res => {
        this.approvedDiaryList = res;
      })
    }
  }

  getMyReportDiaryList() {
    if (
      this.currentAssemblySession.assemblyId &&
      this.currentAssemblySession.sessionId
    ) {
      this.reportService.getMyProceedingReportsDiary(this.currentAssemblySession.assemblyId, this.currentAssemblySession.sessionId).subscribe(res => {
        this.myReportsDiaryList = res;
      })
    }
  }

  getForActionReports() {
    this.reportService.getForActionProceesingReportList().subscribe(res => {
      this.forActionDiaryList = res;
    })
  }

  getPublishReportDiaryList() {
    if (
      this.currentAssemblySession.assemblyId &&
      this.currentAssemblySession.sessionId
    ) {
      this.reportService.getPublishedProceedingReportsDiary(this.currentAssemblySession.assemblyId, this.currentAssemblySession.sessionId).subscribe(res => {
        this.publishedReportsList = res;
      })
    }
  }

  onTableSearch(event) {
    const searchValue = event.target.value
    this.childTableComponent.tableOnSearch(searchValue);
  }

  createProceedingDiary(event) {
    if (event) {
      this.reportService.createProceedingDiary(event)
        .subscribe((Res: any) => {
          this.notification.create("success", "Success", "Success");
          this.router.navigate(["business-dashboard/tables/createproceeding", Res.id,]);
        });
    }
    else {
      this.notification.info('Info', 'Something went wrong..')
    }
  }

  viewProceedingDiary(id) {
    this.router.navigate(['business-dashboard/tables/createproceeding', id])
  }

  onCancel(event) {
    this.showProceedingDiaryModel = event;
  }

}
