import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { TablescommonService } from '../../shared/services/tablescommon.service';
import { ReporterDairyTableComponent } from '../shared/components/reporter-dairy-table/reporter-dairy-table.component';
import { reportDiaryResponseDto } from '../shared/models/proceedingReporter.model';
import { ProceedingReportService } from '../shared/services/proceeding-report.service';
@Component({
  selector: 'tables-list-reporter-diary',
  templateUrl: './list-reporter-diary.component.html',
  styleUrls: ['./list-reporter-diary.component.css']
})
export class ListReporterDiaryComponent implements OnInit {
  showReporterDiaryModel = false;
  reportDiaryDetails: reportDiaryResponseDto[];
  assemblySession = {
    assemblyList: [],
    sessionList: []
  };
  currentAssemblySession = {
    assemblyId: null,
    sessionId: null
  };
  @ViewChild(ReporterDairyTableComponent, { static: false }) childTableComponent: ReporterDairyTableComponent;

  constructor(private reportService: ProceedingReportService, private common: TablescommonService,
    private reporterDiaryService: ProceedingReportService,
    private notification: NzNotificationService,
    private router: Router,) { }

  ngOnInit() {
    this.getAssemblySession();
  }

  getAssemblySession() {
    this.common.getAllAssembly().subscribe((assembly) => {
      this.common.getAllSession().subscribe((session) => {
        this.common.getCurrentAssemblyAndSession().subscribe((active: any) => {
          if (Array.isArray(session) && Array.isArray(assembly)) {
            this.assemblySession.assemblyList = assembly;
            this.assemblySession.sessionList = session;
            this.currentAssemblySession = active;
            this.getReporterDiaryList();
          }
        });
      });
    });
  }

  getReporterDiaryList() {
    if (
      this.currentAssemblySession.assemblyId &&
      this.currentAssemblySession.sessionId
    ) {
      this.reportService.getReporterDiaryList(this.currentAssemblySession.assemblyId, this.currentAssemblySession.sessionId).subscribe((res: reportDiaryResponseDto[]) => {
        this.reportDiaryDetails = res;
      })
    }
  }

  onCancel(event) {
    this.showReporterDiaryModel = event;
  }

  createReporterDiary(event) {
    if (event) {
      this.reporterDiaryService.createReporterDiary(event)
        .subscribe((Res: any) => {
          this.notification.create("success", "Success", "Success");
          this.router.navigate(["business-dashboard/tables/createreporter", Res.id,]);
        });
    }
    else {
      this.notification.info('Info', 'Something went wrong..')
    }
  }

  onTableSearch(event) {
    const searchValue = event.target.value
    this.childTableComponent.tableOnSearch(searchValue);
  }
  viewReporterDiary(id) {
    this.router.navigate(['business-dashboard/tables/createreporter', id])
  }

}
