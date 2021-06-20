import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { reportDiaryResponseDto } from '../../models/proceedingReporter.model';
import { ProceedingReportService } from '../../services/proceeding-report.service';
import { TablescommonService } from '../../../../shared/services/tablescommon.service'

@Component({
  selector: 'tables-reporter-dairy-table',
  templateUrl: './reporter-dairy-table.component.html',
  styleUrls: ['./reporter-dairy-table.component.css']
})
export class ReporterDairyTableComponent implements OnInit {
  @Input() reportDiaryDetails: reportDiaryResponseDto[];
  @Input() allowActionColumn: boolean;
  @Input() allowApproveButton: boolean;
  @Input() allowDownLoadButton: boolean;
  @Output() viewDiaryClick = new EventEmitter<string>();
  tempReportDiaryDetails: reportDiaryResponseDto[];
  constructor(private proceedingService: ProceedingReportService, private notification: NzNotificationService, private tableService: TablescommonService) { }

  ngOnInit() {
    this.tempReportDiaryDetails = this.reportDiaryDetails;
  }

  tableOnSearch(searchValue) {
    if (searchValue) {
      this.reportDiaryDetails = this.tempReportDiaryDetails.filter(
        (element) =>
          (element.date &&
            element.date
              .toLowerCase()
              .includes(searchValue.toLowerCase())) ||
          (element.status &&
            element.status
              .toLowerCase()
              .includes(searchValue.toLowerCase()))
      );
    } else {
      this.reportDiaryDetails = this.tempReportDiaryDetails;
    }
  }

  approveProceedingDiary(id, index, array) {
    this.proceedingService.approveProceedingDiary(id).subscribe(res => {
      array.splice(index, 1);
      this.notification.success('Success', 'Approved succesfully..');
    })
  }

  viewDiary(id) {
    this.viewDiaryClick.emit(id);
  }

  downLoadPdf(htmlContent) {
    this.tableService.downloadReport(htmlContent).subscribe((response: any) => {
      if (response) {
        var blob = new Blob([response], { type: "application/pdf" });
        const pdfUrl = URL.createObjectURL(blob);
        if (pdfUrl) {
          window.open(pdfUrl);
        }
      } else { this.notification.info('Info', 'PDF not avilable!') }
    });
  }

}
