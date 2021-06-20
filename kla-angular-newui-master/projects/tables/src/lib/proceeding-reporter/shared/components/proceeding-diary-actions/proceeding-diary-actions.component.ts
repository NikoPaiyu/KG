import { Component, Inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { TablescommonService } from '../../../../shared/services/tablescommon.service';
import { FileServiceService } from '../../../../shared/services/file-service.service';
import { forwardProceedingDiaryDto, IDiaryResponse, IForwardusers, IWorkFlowUsers, IPermissionProceedings } from '../../models/proceedingReporter.model';
import { ProceedingReportService } from '../../services/proceeding-report.service'
@Component({
  selector: 'tables-proceeding-diary-actions',
  templateUrl: './proceeding-diary-actions.component.html',
  styleUrls: ['./proceeding-diary-actions.component.css']
})
export class ProceedingDiaryActionsComponent implements OnInit {
  @Input() diaryDetails: IDiaryResponse;
  @Input() permissionCheck: any;
  allWorkFlowUsers: IWorkFlowUsers[] = [];
  forwardingUser: IForwardusers;
  currentUser: any;
  currentUserForwardAction: IForwardusers;
  forwardButtonText: string = 'Forward';
  proceedingMasterId: any;
  visiblePdfViewer = false;
  pdfUrl: any;
  constructor(private notification: NzNotificationService, private fileService: FileServiceService,
    private proceedingService: ProceedingReportService, private router: ActivatedRoute,
    @Inject("authService") private AuthService, private route: Router, private tableService: TablescommonService) {
    this.proceedingMasterId = this.router.snapshot.params.id;
    this.currentUser = AuthService.getCurrentUser();
  }

  ngOnInit() {
  }

  getWorkFlowUsersByWorkFlowId() {
    if (this.diaryDetails.workflowId > 0 && this.allWorkFlowUsers.length == 0) {
      this.fileService.getWorkflowActionUsers(this.diaryDetails.workflowId, 0).subscribe((res: IWorkFlowUsers[]) => {
        this.allWorkFlowUsers = this.proceedingService.setAllWorkFlowUsers(res, this.currentUser.userId)
        this.currentUserForwardAction = this.proceedingService.getCurrentUserForwardAction(res, this.currentUser.userId);
      })
    }
  }

  forwardProceedingDiary() {
    if (this.forwardingUser) {
      const body: forwardProceedingDiaryDto = {
        proceedigDiaryMasterId: this.proceedingMasterId,
        assignee: String(this.forwardingUser.userId),
        fromGroup: this.currentUser.fullName,
        groupId: this.forwardingUser.code
      }
      this.proceedingService.forwardProceedingDiaryReports(body).subscribe(res => {
        this.notification.success('Success', 'Forwaded succesfully');
        this.route.navigate(["business-dashboard/tables/proceedinglist"]);
      })
    }
  }

  isItForwardOrReturn(event: IForwardusers) {
    this.forwardButtonText = this.currentUserForwardAction.actionRow < event.actionRow ? 'Forward' : 'Return';
  }

  approveProceedingDiary() {
    this.proceedingService.approveProceedingDiary(this.proceedingMasterId).subscribe(res => {
      this.notification.success('Success', 'Approved succesfully..');
      this.route.navigate(["business-dashboard/tables/proceedinglist"]);
    })
  }

  publishProceedingDiary() {
    this.proceedingService.publishProceddingReportDiary(this.proceedingMasterId).subscribe(res => {
      this.notification.success('Success', 'Published succesfully..');
      this.route.navigate(["business-dashboard/tables/proceedinglist"]);
    })
  }

  previewReport(htmlContent) {
    if (htmlContent) {
      this.tableService.downloadReport(htmlContent).subscribe((response: any) => {
        if (response) {
          var mediaType = "application/pdf"
          var blob = new Blob([response], { type: mediaType });
          this.pdfUrl = URL.createObjectURL(blob);
          if (this.pdfUrl) {
            this.visiblePdfViewer = true;
          }
        }
        else { this.notification.info('Info', 'Something went wrong..') }
      });
    }
    else { this.notification.info('Info', 'PDF not avilable!') }
  }

  goBack() {
    window.history.back();
  }
}
