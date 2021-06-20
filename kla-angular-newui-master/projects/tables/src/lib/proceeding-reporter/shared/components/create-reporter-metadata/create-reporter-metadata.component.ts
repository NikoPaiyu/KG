import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TablescommonService } from '../../../../shared/services/tablescommon.service';
@Component({
  selector: 'tables-create-reporter-metadata',
  templateUrl: './create-reporter-metadata.component.html',
  styleUrls: ['./create-reporter-metadata.component.css']
})
export class CreateReporterMetadataComponent implements OnInit {

  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();

  currentAssemblySession = null;
  dateList = [];
  dateSelected = null

  constructor(
    private common: TablescommonService,
    private datePipe: DatePipe,
  ) { }

  ngOnInit() {
    this.getAssemblySession();
  }

  getAssemblySession() {
    this.common.getCurrentAssemblyAndSession().subscribe((active) => {
      this.currentAssemblySession = active;
      this.getDateList();
    });
  }

  getDateList() {
    if (this.currentAssemblySession.assemblyId && this.currentAssemblySession.sessionId) {
      this.common.getDates(this.currentAssemblySession.assemblyId, this.currentAssemblySession.sessionId).subscribe((Res: any) => {
        this.dateList = Res;
      });
    }
  }

  disabledCosDates = (current: Date): boolean => {
    return !this.dateList.includes(
      this.datePipe.transform(current, "yyyy-MM-dd")
    );
  };



  onCancelClick() {
    this.onCancel.emit(false);
  }
  onSubmitClick() {
    const body = {
      date: this.dateSelected,
      assemblyId: this.currentAssemblySession.assemblyId,
      sessionId: this.currentAssemblySession.sessionId
    }
    this.onSubmit.emit(body);
  }

}
