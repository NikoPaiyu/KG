import { Component, OnInit, Inject, Input, Output, EventEmitter } from '@angular/core';
import { StmtDemandsGrantsService } from '../../../../shared/services/stmt-demands-grants.service';

@Component({
  selector: 'budget-bit-list-report',
  templateUrl: './bit-list-report.component.html',
  styleUrls: ['./bit-list-report.component.scss']
})
export class bitListReportComponent implements OnInit {
  @Input() demandDraftId;
  dataSet =[]
  constructor(
    @Inject('authService') public auth,
    private sdfg: StmtDemandsGrantsService
  ) {
  }
  ngOnInit() {
  }
  getSdfgDetailsForCutMotion() {
    this.sdfg.getSdfgDetails(this.demandDraftId).subscribe((res: any) => {
    });
  }
}
