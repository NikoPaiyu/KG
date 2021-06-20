import { Component, EventEmitter, Inject, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { BillcommonService } from "../../services/billcommon.service";
import { UploadFile, NzNotificationService } from "ng-zorro-antd";
import { ActivatedRoute, Router } from "@angular/router";
@Component({
  selector: 'lib-committee-report-preview',
  templateUrl: './committee-report-preview.component.html',
  styleUrls: ['./committee-report-preview.component.css'],
  encapsulation : ViewEncapsulation.None
})
export class CommitteeReportPreviewComponent implements OnInit {
  @Output() cancelReportPreview = new EventEmitter<any>();
  @Input() billDetails;
  @Input() isFileView=false;
  @Input() reportContent;
  previewContent;
  fullScreenMode = false;
  finalUrl;
  constructor(
    private commonService: BillcommonService,private router: Router,
    private notification: NzNotificationService,private activeRoute: ActivatedRoute,
    @Inject("authService") private AuthService,
  ) { }

  ngOnInit() {
   this.getPreview();
  }
  getPreview(){
    if(!this.isFileView){
      this.commonService.getCommitteeMeetingReportPreview(this.billDetails.committeReportId).subscribe((res: any) => {
        this.previewContent = res.reportData;
       });
    }else{
      this.previewContent = this.reportContent;
    }
  }

  cancelPreview(){
    this.cancelReportPreview.emit(false);
  }
  generateReport(){
    // this.committeeService.generateMeetingReport(this.subagenda.id).subscribe((res: any) => {
    //  this.notification.success('Success', 'Report Generated Sucessfully..');
    //  this.cancelPreview();
    // });
  }
  addClass() {
    this.fullScreenMode = !this.fullScreenMode;
  }
  downloadReport(){
    if(this.previewContent){
      let body={
      htmlString:this.previewContent
      }
       var mediaType = "application/pdf";
      this.commonService.downloadReport(body).subscribe((response) => {
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
