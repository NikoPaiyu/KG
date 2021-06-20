import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { IDiaryResponse, buttonList, IBusinessLineResponse, reportDiaryResponse, saveDiaryDto } from '../shared/models/proceedingReporter.model'
import { ProceedingReportService } from '../shared/services/proceeding-report.service'
@Component({
  selector: 'tables-create-reporter-diary',
  templateUrl: './create-reporter-diary.component.html',
  styleUrls: ['./create-reporter-diary.component.css']
})
export class CreateReporterDiaryComponent implements OnInit {
  diaryDetails: IDiaryResponse;
  reporterDiaryMasterId: any;
  selectedBusinessDetails: IBusinessLineResponse;
  modules: any = this.reporterService.setQuillEditorConfig();
  isPdfVisible = false;
  buttonList = buttonList;
  currentUser: any;
  constructor(private router: ActivatedRoute, private reporterService: ProceedingReportService,
    private notification: NzNotificationService, private route: Router, @Inject("authService") private AuthService) {
    this.reporterDiaryMasterId = this.router.snapshot.params.id;
    this.currentUser = AuthService.getCurrentUser();
  }

  ngOnInit() {
    if (this.reporterDiaryMasterId > 0) {
      this.getReporterDiaryDetailsById(this.reporterDiaryMasterId)
    }
  }

  getReporterDiaryDetailsById(diaryId) {
    this.reporterService.getReporterDiaryById(diaryId).subscribe((res: IDiaryResponse) => {
      this.diaryDetails = res;
    })
  }

  setSelectedBuisnessDetails(data: IBusinessLineResponse) {
    this.selectedBusinessDetails = data;
    this.selectedBusinessDetails.proceedingReporterLines.forEach(element => {
      element.isEdit = element.id ? true : false;
      element.type = element.type ? element.type : 'DIARY_NOTE';
      element.startTime = new Date(element.startTime + `Z`);
      element.endTime = new Date(element.endTime + `Z`)
    })
  }

  addNewBlock(code) {
    const newType = this.reporterService.addNewBlock();
    newType.type = code.code
    this.selectedBusinessDetails.proceedingReporterLines.push(newType);
  }

  saveReporterDiary(data: reportDiaryResponse) {
    const body: saveDiaryDto = {
      id: data.id,
      description: data.description,
      type: data.type ? data.type : "DIARY_NOTE",
      startTime: data.startTime,
      endTime: data.endTime,
      proceedingReporterMasterId: this.reporterDiaryMasterId,
      lobAgendaBusinessLineId: this.selectedBusinessDetails.id
    }
    if (this.saveValidation(body)) {
      this.reporterService.saveDiaryLines(body).subscribe(res => {
        data.id = res.id;
        data.isEdit = true;
        this.notification.success('Success', 'Saved successfully')
      })
    }
  }

  saveValidation(body: saveDiaryDto) {
    if (!body.startTime) {
      this.notification.info('Info', 'Please add start time');
      return false;
    }
    else if (!body.endTime) {
      this.notification.info('Info', 'Please add end time');
      return false;
    }
    else if (!body.description) {
      this.notification.info('Info', 'Please add description');
      return false;
    }
    else {
      return true;
    }
  }

  submitRporterDiary() {
    this.reporterService.submitDiaryReport(this.reporterDiaryMasterId).subscribe(res => {
      this.notification.success('Success', 'Submitted');
      this.route.navigate(["business-dashboard/tables/reporterlist"]);
    })
  }
  goBack() {
    window.history.back();
  }
}
