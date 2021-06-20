import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StmtDemandsGrantsService } from '../../../shared/services/stmt-demands-grants.service';
import { NzModalService } from 'ng-zorro-antd';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'budget-list-cut-motion',
  templateUrl: './list-cut-motion.component.html',
  styleUrls: ['./list-cut-motion.component.scss']
})
export class ListCutMotionComponent implements OnInit {
  @Input() SdfgMasterId
  @Input() isFileView
  cosdates;
  reportVisible = false;reportUrl;
  cutmotionListDto = { sdfgId: '', demandMasterId:'', selcosDate: '', sdfgDemandList: [], subcutmotions: [], filterValue: '', selsdfgLineId: '', selDemandName: '', isresubmit: false }
  constructor(private router: Router,
    private route: ActivatedRoute,
    private sdfg: StmtDemandsGrantsService,
    private modalService: NzModalService,
    private notify: NzNotificationService
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (params["id"] || this.SdfgMasterId) {
        if (params["id"]) { this.cutmotionListDto.sdfgId = params["id"]; }
        if (this.SdfgMasterId) { 
          this.cutmotionListDto.sdfgId = this.SdfgMasterId; 
        }
        this.getCosDatesForSdfgId();
        //this.getSdfgDetailsForCutMotion();
        this.isResubmit();
      }
    });
  }
  getCosDatesForSdfgId() {
    this.sdfg.getCosDatesForSdfgId(this.cutmotionListDto.sdfgId).subscribe((dates) => {
      this.cosdates = dates;
      if(!this.cosdates) {
        this.notify.info("Info", "No Demand Schedule Found!!!");
        return;
      }
      this.cutmotionListDto.selcosDate = dates[0];
      this.renderSDFGDemands(dates[0]);
    })
  }
  isResubmit() {
    this.sdfg.isResubmit(this.cutmotionListDto.sdfgId).subscribe((status: any) => {
      this.cutmotionListDto.isresubmit = status;
    });
  }
  getSdfgDetailsForCutMotion() {
    this.sdfg.getSdfgDetails(this.cutmotionListDto.sdfgId).subscribe((res: any) => {
      this.cutmotionListDto.sdfgDemandList = res;
      this.view_cutmotion(this.cutmotionListDto.sdfgDemandList[0])
    });
  }
  view_cutmotion(sdfgDemandList) {
    this.cutmotionListDto.sdfgDemandList.forEach(item => item.selRow = false);
    sdfgDemandList.selRow = true
    this.cutmotionListDto.selsdfgLineId = sdfgDemandList.sdfgLineId;
    this.cutmotionListDto.selDemandName = sdfgDemandList.demandNameEng;
    let body = { sdfgLineId: sdfgDemandList.sdfgLineId };
    this.getAllSubmitted(body);
  }
  filterWithCutmotionType() {
    let body = { sdfgLineId: this.cutmotionListDto.selsdfgLineId, type: this.cutmotionListDto.filterValue ? this.cutmotionListDto.filterValue : null };
    this.getAllSubmitted(body);
  }
  getAllSubmitted(body) {
    this.sdfg.getAllSubmitted(body).subscribe((res: any) => {
      if (res) {
        this.cutmotionListDto.subcutmotions = res;
      }
    });
  }
  resubmitCutmotion() {
    this.sdfg.resubmitCutmotion(this.cutmotionListDto.sdfgId).subscribe((res: any) => {
      this.router.navigate(['business-dashboard/budgets/files/bd-files']);
    });
  }
  renderEconomyCut(economyCut) {
    let savedEconomy = '';
    if (economyCut && economyCut.economyCutValues) {
      let economyCutValues = JSON.parse(economyCut.economyCutValues);
      if (economyCutValues.selIndex != null) {
        savedEconomy = economyCut.notes.replace('[Amount]', economyCutValues.Amount);
        savedEconomy = savedEconomy.replace('[Item]', economyCutValues.Item);
      }
    }
    return savedEconomy;
  }
  renderSDFGDemands(data) {
    if(data) {
      this.cutmotionListDto.demandMasterId = data.key;
      this.sdfg.getDemandMasterById(data.key).subscribe((res) => {
        if (res) {
          this.cutmotionListDto.sdfgDemandList = res;
          this.cutmotionListDto.selcosDate = data.value.split("T")[0];
          this.view_cutmotion(this.cutmotionListDto.sdfgDemandList[0])
        }
      })
    }
  }
  generateReport() {
    this.sdfg.generateCutmotionReport(this.cutmotionListDto.demandMasterId).subscribe((res) => {
      if(res) {
        this.reportUrl = res;
        this.reportVisible = true;
      }
    });
  }
}
