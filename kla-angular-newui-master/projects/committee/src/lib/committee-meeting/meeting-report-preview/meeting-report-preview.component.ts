import { Component, EventEmitter, Inject, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { differenceInCalendarDays, parseISO } from 'date-fns';
import { CommitteeService } from '../../shared/services/committee.service';
import { CommitteecommonService } from '../../shared/services/committeecommon.service';
import { FileServiceService } from '../../shared/services/file-service.service';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
@Component({
  selector: 'committee-meeting-report-preview',
  templateUrl: './meeting-report-preview.component.html',
  styleUrls: ['./meeting-report-preview.component.css'],
  encapsulation : ViewEncapsulation.None
})
export class MeetingReportPreviewComponent implements OnInit {
  @Output() cancelReportPreview = new EventEmitter<any>();
  @Input() subagenda;
  @Input() isFileView=false;
  @Input() reportPreview;
  @Input() isViewOnly = false;
  @Input() reportDto;
  previewContent;
  fullScreenMode = false;
  finalUrl;
  constructor(
    private committeeService: CommitteeService,private router: Router,
    private notification: NzNotificationService,private activeRoute: ActivatedRoute,
    @Inject("authService") private AuthService,  public common: CommitteecommonService,
    private fileService: FileServiceService
  ) { }

  ngOnInit() {
   this.getPreview();
  }
  getPreview(){
    if(!this.isFileView && !this.isViewOnly){
      this.committeeService.getMeetingReportPreview(this.subagenda.forwardedBusiness.id).subscribe((res: any) => {
        this.previewContent = res;
       });
    }else{
      this.previewContent = this.reportPreview;
    }
  }

  cancelPreview(){
    this.cancelReportPreview.emit(false);
  }
  generateReport(){
    this.committeeService.generateMeetingReport(this.subagenda.forwardedBusiness.id).subscribe((res: any) => {
     this.notification.success('Success', 'Report Generated Sucessfully..');
     this.cancelPreview();
    });
  }
  addClass() {
    this.fullScreenMode = !this.fullScreenMode;
  }
  downloadReport(){
    if(this.reportDto.reportData){
      let body={
      htmlString:this.reportDto.reportData
      }
       var mediaType = "application/pdf";
      this.common.downloadReport(body).subscribe((response) => {
         if (response) {
           var blob = new Blob([response], { type: mediaType });
           this.finalUrl = URL.createObjectURL(blob);
           window.open(this.finalUrl,'_blank');
           // this.reportParams.showPdf = (this.finalUrl) ? true : false;
           // this.finalUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
           // this.loading = (this.reportParams.showPdf && this.finalUrl) ? false : true;
         } 
       });
    }
  }
}
