import { Component, OnInit, Inject, Input, Output,EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { BudgetDocumentService } from '../../../shared/services/budget-document.service';
import { StmtDemandsGrantsService } from '../../../shared/services/stmt-demands-grants.service';
import { FileServiceService } from '../../../shared/services/file-service.service';
import { differenceInCalendarDays, parseISO } from 'date-fns';
import { SdgEgService} from '../../../shared/services/sdg-eg.service'
@Component({
  selector: 'budget-dds-preview',
  templateUrl: './dds-preview.component.html',
  styleUrls: ['./dds-preview.component.scss']
})
export class DdsPreviewComponent implements OnInit {
  @Input() demandMasterId;
  @Input() isFrmFileView;
  @Output() renderGulletin = new EventEmitter<string>();
  @Input() DDSCreationType = "SDFG/VOA";
  ddsMainDto = { ddsId: null, ddsList: [], sdfgId: null, fileId: null, isEdit: false, sdfgList: [] };
  demandsList; tempdemandsList;
  ddsListById;
  today: any = new Date()

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private notify: NzNotificationService,
    private budgetDoc: BudgetDocumentService,
    private sdfg: StmtDemandsGrantsService,
    private file: FileServiceService,
    @Inject('authService') public auth,
    private SdgEgService : SdgEgService
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
    if (this.ddsMainDto.ddsId && this.DDSCreationType == 'SDFG/VOA') {
      this.getSaveddds();
      return;
    }
    if (this.ddsMainDto.ddsId && this.DDSCreationType == 'SDGEG') {
      this.getSavedSDGEGdds();
      return;
    }
  }
  getSaveddds() {
    this.budgetDoc.getByDemandDraftById(this.ddsMainDto.ddsId).subscribe((res: any) => {
      this.ddsListById = res;
      if(res && res.gulletin) {
        this.renderGulletin.emit(res.gulletin);
      }
      this.initializedds();
    });
  }
  getSavedSDGEGdds(){
    this.SdgEgService.getByDemandDraftById(this.ddsMainDto.ddsId).subscribe((res: any) => {
      this.ddsListById = res;
      if(res && res.gulletin) {
        this.renderGulletin.emit(res.gulletin);
      }
      this.initializedds();
    });
  }
  initializedds() {
    if (this.ddsListById) {
      this.patchValues();
      return;
    }
  }
  patchValues() {
    this.ddsListById.demandDraftDTOList.forEach(d => {
      this.ddsMainDto.ddsList.push({
        ddsLines: this._setDraftLines(d.draftLines, d.cosDate),
        cosDate: d.cosDate,
        day: d.day,
        discussion: false,
        id: d.id,
        canEdit: false,
        sdfgLineDTO: []
      });
    });
  }
  _setDraftLines(draftLines, cosDate) {
    let lines = [];
    if(draftLines) {
      draftLines.forEach(l => {
        lines.push({
          id: l.demandDraftLineId,
          cosDate: cosDate,
          sdfgLineId: l.sdfgLineId,
          suggestionByOL: false, 
          demandNameEng: l.demandNameEng
        })
      });
    }
    return lines;
  }
}
