import { Component, OnInit, Inject, Input, Output, EventEmitter } from '@angular/core';
import { SdgEgService } from '../../../shared/services/sdg-eg.service';
import { StmtDemandsGrantsService } from '../../../shared/services/stmt-demands-grants.service';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'budget-sdfg-preview',
  templateUrl: './sdfg-preview.component.html',
  styleUrls: ['./sdfg-preview.component.scss']
})
export class SdfgPreViewComponent implements OnInit {
  @Input() sdfgId;
  @Input() from;
  @Input() sdgEgId;
  @Output() showCutMotion = new EventEmitter<string>();
  sdfgListById;sdfgListTemp;
  cosdates;selcosDate;
  constructor(
    @Inject('authService') public auth,
    private sdfg: StmtDemandsGrantsService,
    private SdgEgService: SdgEgService,
    private notify: NzNotificationService
  ) {
  }
  ngOnInit() {
    if (this.sdfgId) {
      if (this.from === 'CUT_MOTION') {
        this.getCosDatesForSdfgId();
        return;
      }
      this.getSavedSDFG()
    }
    if(this.sdgEgId){
      this.getSDGEGById();
    }
  }
  getCosDatesForSdfgId() {
    this.sdfg.getCosDatesForSdfgId(this.sdfgId).subscribe((dates) => {
      this.cosdates = dates;
      if(!this.cosdates) {
        this.notify.info("Info", "No Demand Schedule Found!!!");
        return;
      }
      this.selcosDate = dates[0];
      this.getSdfgDetailsForCutMotion();
    })
  }
  getSdfgDetailsForCutMotion() {
    this.sdfg.getSdfgDetails(this.sdfgId).subscribe((res: any) => {
      this.sdfgListTemp = res;
      this.renderSDFGDemands(this.selcosDate);
    });
  }
  getSavedSDFG() {
    this.sdfg.getSDFGByLinesId(this.sdfgId).subscribe((res: any) => {
      this.sdfgListById = res.lines;
    });
  }
  goBack() {
    window.history.back();
  }
  removeUnderScore(element) {
    return element.replace(/_/g, " ");
  }
  showCutmotion(data) {
    this.sdfgListById.forEach(item => item.selRow = false);
    data.selRow = true;
    this.showCutMotion.emit(data)
  }
  getSDGEGById(){
    this.SdgEgService.getSDGEGById(this.sdgEgId).subscribe((res: any) => {
      this.sdfgListById = res.lines;
    });
  }
  renderSDFGDemands(data) {
    if(data) {
      this.sdfgListById = this.sdfgListTemp.filter((el) => el.cosDate == data.value);
      if(this.sdfgListById.length > 0) {
        this.showCutmotion(this.sdfgListById[0]);
      }
    }
  }
}
