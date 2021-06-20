import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { BudgetDocumentService } from '../../../shared/services/budget-document.service';
import { FileServiceService } from '../../../shared/services/file-service.service';
import { SdgEgService } from '../../../shared/services/sdg-eg.service'

@Component({
  selector: 'budget-dds-suggetion',
  templateUrl: './dds-suggetion.component.html',
  styleUrls: ['./dds-suggetion.component.scss']
})
export class DdsSuggetionComponent implements OnInit {
  ddsMainDto = { budgetDocumentId: null, ddsId: null, demandDraftDates: [], Mode: 'SDFG/VOA' };
  urlParams: any;
  ddsListById;
  caneditDDS = true;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private notify: NzNotificationService,
    private budgetDoc: BudgetDocumentService,
    @Inject('authService') public auth,
    private file: FileServiceService,
    private SdgEgService: SdgEgService
  ) {
    this.urlParams = this.router.getCurrentNavigation().extras.state;
  }
  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.setDDSMode();
      if (params["id"]) {
        this.ddsMainDto.ddsId = params["id"];
      }
    });
    this.getDDSList();
  }
  setDDSMode() {
    if (this.router.url.includes('budgets/sdgeg/dds/suggetion')) {
      this.ddsMainDto.Mode = 'SDGEG'
    }
  }
  getDDSList() {
    if (this.ddsMainDto.ddsId) {
      if (this.ddsMainDto.Mode == 'SDGEG') {
        this.getSavedSDGEGddds();
        return;
      }
      this.getSaveddds();
      return;
    }
  }
  getSavedSDGEGddds() {
    this.SdgEgService.getByDemandDraftById(this.ddsMainDto.ddsId).subscribe((res: any) => {
      this.ddsListById = res;
      this.initializedds();
      this.canEditDDS();
    });
  }
  getSaveddds() {
    this.budgetDoc.getByDemandDraftById(this.ddsMainDto.ddsId).subscribe((res: any) => {
      this.ddsListById = res;
      this.initializedds();
      this.canEditDDS();
    });
  }
  initializedds() {
    this.ddsMainDto['ddsList'] = [];
    if (this.ddsListById) {
      if (this.ddsListById.demandDraftDTOList && this.ddsListById.demandDraftDTOList.length > 0) {
        this.ddsListById.demandDraftDTOList.forEach(e => {
          this.ddsMainDto.demandDraftDates.push(e.cosDate)
          this._setDDSObject(e);
        });
      }
    }
  }
  _setDDSObject(dds) {
    dds.draftLines.forEach(line => {
      this.ddsMainDto['ddsList'].push({
        "cosDate": dds.cosDate,
        "id": line.demandDraftLineId ? line.demandDraftLineId : null,
        "demandName": line.demandNameEng ? line.demandNameEng : null,
        "sdfgLineId": line.sdfgLineId ? line.sdfgLineId : null,
        "suggestionByOL": false,
        "sdfgId": line.sdfgId
      }
      );
    });
  }
  goBack() {
    this.router.navigate(['business-dashboard/budgets/dds/submitted']);
  }
  acceptDDS() {
    let selectedDDS = [];
    if (this.ddsMainDto['ddsList'] && this.ddsMainDto['ddsList'].length > 0) {
      selectedDDS = this.ddsMainDto['ddsList'].filter((item) => item.suggestionByOL);
    }
    if (selectedDDS && selectedDDS.length === 0) {
      this.notify.warning("Warning", "Please select Atleast One ....");
      return;
    }
    this._unLinkProperties();
    let body = { masterId: this.ddsMainDto.ddsId, sdfgLines: this.ddsMainDto['ddsList'] }
    if (this.ddsMainDto.Mode == 'SDGEG') {
      this.suggestionForOlSDGFG(body);
      return;
    }
    this.suggestionForOl(body);
  }
  suggestionForOlSDGFG(body){
    this.SdgEgService.suggestionForOl(body).subscribe((res: any) => {
      this.notify.success('Success', 'Finalized');
      this.goBack();
    });
  }
  suggestionForOl(body) {
    this.budgetDoc.suggestionForOl(body).subscribe((res: any) => {
      this.notify.success('Success', 'Finalized');
      this.goBack();
    });
  }
  _unLinkProperties() {
    this.ddsMainDto['ddsList'].forEach(e => { delete e.demandName; delete e.sdfgId; });
  }
  canEditDDS() {
    if (this.ddsListById) {
      if (this.ddsListById.demandDraftDTOList && this.ddsListById.demandDraftDTOList.length > 0) {
        let demandDraftDTOList = this.ddsListById.demandDraftDTOList;
        let found = demandDraftDTOList.find(o => o.nature === "FROM_OL");
        this.caneditDDS = (found) ? true : false;
      }
    }
  }
}
