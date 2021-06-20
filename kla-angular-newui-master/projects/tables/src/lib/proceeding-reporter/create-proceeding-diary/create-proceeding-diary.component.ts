import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { IBusinessLineResponse, IDiaryResponse, IPermissionProceedings, reportDiaryResponse, saveProceedingDiaryDto } from '../shared/models/proceedingReporter.model';
import { ProceedingReportService } from '../shared/services/proceeding-report.service';
import { TablescommonService } from '../../shared/services/tablescommon.service'

@Component({
  selector: 'tables-create-proceeding-diary',
  templateUrl: './create-proceeding-diary.component.html',
  styleUrls: ['./create-proceeding-diary.component.css']
})
export class CreateProceedingDiaryComponent implements OnInit {
  diaryDetails: IDiaryResponse;
  proceedingDiaryMasterId: any;
  selectedBusinessDetails: IBusinessLineResponse;
  modules: any = this.reporterService.setQuillEditorConfig();
  submittedReporterList: reportDiaryResponse[];
  currentUser: any;
  permissions: IPermissionProceedings = new IPermissionProceedings();
  constructor(private router: ActivatedRoute, private reporterService: ProceedingReportService,
    private notification: NzNotificationService, @Inject("authService") private AuthService, private tableService: TablescommonService,) {
    this.currentUser = AuthService.getCurrentUser();
    this.tableService.setTablePermissions(this.currentUser.rbsPermissions);
    this.proceedingDiaryMasterId = this.router.snapshot.params.id;
  }

  ngOnInit() {
    this.checkRbsPermission();
    if (this.proceedingDiaryMasterId > 0) {
      this.getProceedingDiaryDetailsById(this.proceedingDiaryMasterId)
    }
  }
  checkRbsPermission() {
    this.permissions = this.reporterService.checkRbsPermission();
  }
  getProceedingDiaryDetailsById(diaryId) {
    this.reporterService.getProceedingDiaryById(diaryId).subscribe((res: IDiaryResponse) => {
      this.diaryDetails = res;
      this.diaryDetails.isEdit = this.diaryDetails.description ? true : false;
    })
  }

  setSelectedBuisnessDetails(data: IBusinessLineResponse) {
    this.selectedBusinessDetails = data;
    this.getSubmittedReporterListByLobId(data.id)
  }
  getSubmittedReporterListByLobId(lobId) {
    this.reporterService.getSubmittedProceedingReporterListByLobId(lobId).subscribe((res: reportDiaryResponse[]) => {
      this.submittedReporterList = res;
    })
  }

  saveProceedingDiary() {
    const body: saveProceedingDiaryDto = {
      id: this.diaryDetails.id,
      description: this.diaryDetails.description
    }
    if (this.saveValidation(body)) {
      this.reporterService.createProceedingDiary(body).subscribe(res => {
        this.diaryDetails.isEdit = true;
        this.notification.success('Success', 'Saved successfully');
      })
    }
    else {
      this.notification.info('Info', 'Please add description');
    }
  }

  saveValidation(body) {
    const returnValue = body.description ? true : false;
    return returnValue
  }



}
