import { Component, OnInit, Inject, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { BudgetDocumentService } from '../../../shared/services/budget-document.service';
import { StmtDemandsGrantsService } from '../../../shared/services/stmt-demands-grants.service';
import { FileServiceService } from '../../../shared/services/file-service.service';
import { SdgEgService } from '../../../shared/services/sdg-eg.service'
@Component({
  selector: 'budget-schedule-report',
  templateUrl: './schedule-report.component.html',
  styleUrls: ['./schedule-report.component.scss']
})
export class ScheduleReportComponent implements OnInit {
  @Input() demandMasterId;
  @Input() isFrmFileView;
  @Output() renderGulletin = new EventEmitter<string>();
  @Input() DDSCreationType = "SDFG/VOA";
  ddsMainDto = { ddsId: null, ddsList: [], sdfgId: null, fileId: null, isEdit: false, sdfgList: [] };
  demandsList; tempdemandsList;
  ddsListById;
  today: any = new Date()

  constructor(
    private route: ActivatedRoute,
    private budgetDoc: BudgetDocumentService,
    @Inject('authService') public auth,
    private SdgEgService: SdgEgService
  ) { }
  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (this.demandMasterId) {
        this.ddsMainDto.ddsId = this.demandMasterId;
      }
      this.renderDDSData();
    });
  }
  renderDDSData() {
    this.getSaveddds();
  }
  getSaveddds() {
    this.budgetDoc.getByDemandDraftById(this.ddsMainDto.ddsId).subscribe((res: any) => {
      this.ddsListById = res;
      console.log(this.ddsListById);
      if (res && res.gulletin) {
        this.renderGulletin.emit(res.gulletin);
      }
    });
  }
  findTime(d) {
    d = new Date(d);
    return (d.toLocaleTimeString());
   }
}
