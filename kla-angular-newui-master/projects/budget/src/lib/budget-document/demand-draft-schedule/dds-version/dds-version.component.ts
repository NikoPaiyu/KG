import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { BudgetDocumentService } from '../../../shared/services/budget-document.service';
import { BudgetCommonService } from '../../../shared/services/budgetcommon.service';
import { StmtDemandsGrantsService } from '../../../shared/services/stmt-demands-grants.service';
import { SdgEgService } from '../../../shared/services/sdg-eg.service'

@Component({
  selector: 'budget-dds-version',
  templateUrl: './dds-version.component.html',
  styleUrls: ['./dds-version.component.scss']
})
export class DdsVersionComponent implements OnInit {
  demandDraftMasterId = null;
  fileId;
  demand
  versionDTO = {
    Mode: 'SDFG/VOA',
    fromSection: {
      id: null,
      demandDraftIds: [],
      demandHeader: [],
      gulletinList: [],
      editMode: true
    },
    fromOL: {
      id: null,
      demandDraftIds: [],
      demandHeader: [],
      gulletinList: [],
      editMode: true
    }
  }
  demandsList = [];
  selectedKey = null;
  rbsPermission = {
    acceptVersion: false
  }
  urlParams;
  constructor(private budgetDocService: BudgetDocumentService,
    private route: ActivatedRoute,
    private router: Router,
    private notify: NzNotificationService,
    @Inject('authService') public auth,
    public commonService: BudgetCommonService,
    private sdfg: StmtDemandsGrantsService,
    private SdgEgService: SdgEgService
  ) {
    this.commonService.setBudgetPermissions(auth.getCurrentUser().rbsPermissions);
    this.getRbsPermissionsinList();
    this.urlParams = this.router.getCurrentNavigation().extras.state;
    if (!this.urlParams) {
      return;
    }
    this.route.params.subscribe((params) => {
      if (params["ol"] && params["section"]) {
        this.versionDTO["fromOL"].id = params["ol"];
        this.versionDTO["fromSection"].id = params["section"];
        this.setParams();
      }
    });
  }

  ngOnInit() {
    this.setDDSVersionMode();
    if (this.urlParams && this.urlParams.sdfgMasterId) {
      this.getSelectedNature();
    }
  }
  setDDSVersionMode() {
    if (this.router.url.includes('sdgeg/dds/version')) {
      this.versionDTO.Mode = 'SDGEG';
    }
  }
  getRbsPermissionsinList() {
    if (this.commonService.doIHaveAnAccess('ACCEPT_DDS_VERSION', 'APPROVE')) {
      this.rbsPermission.acceptVersion = true;
    }
  }
  getSelectedNature() {
    if(this.versionDTO.Mode === 'SDGEG') {
      this.getActiveNatureForSDG();
      return;
    }
    this.getActiveNatureForSDFGVOA();
  }
  getActiveNatureForSDG() {
    this.SdgEgService.getActiveNature(this.urlParams.sdfgMasterId).subscribe((selectedNature: any) => {
      if (selectedNature == 'FROM_SECTION') {
        this.selectedKey = 'fromSection'
      } else if (selectedNature == 'FROM_OL') {
        this.selectedKey = 'fromOL'
      } else {
        this.selectedKey = null
      }
    });
  }
  getActiveNatureForSDFGVOA() {
    this.budgetDocService.getActiveNature(this.urlParams.sdfgMasterId).subscribe((selectedNature: any) => {
      if (selectedNature == 'FROM_SECTION') {
        this.selectedKey = 'fromSection'
      } else if (selectedNature == 'FROM_OL') {
        this.selectedKey = 'fromOL'
      } else {
        this.selectedKey = null
      }
    });
  }
  setParams() {
    this.versionDTO["fromOL"].editMode = false;
    this.versionDTO["fromSection"].editMode = false;
  }
  goBack() {
    window.history.back();
  }
  selectVersion(version) {
    this.selectedKey = version.key;
    version.key == 'fromOL' ? this.versionDTO["fromSection"].editMode = false : this.versionDTO["fromOL"].editMode = false
  }
  approveVersion() {
    let demandDraftId = this.versionDTO[this.selectedKey].id;
    if(this.versionDTO.Mode === 'SDGEG') {
      this.setApprovedVersionForSDG(demandDraftId);
      return;
    }
    this.setApprovedVersionForSDFG(demandDraftId);
  }
  setApprovedVersionForSDFG(demandDraftId) {
    this.budgetDocService.setApprovedVersion(demandDraftId, this.urlParams.sdfgMasterId).subscribe((res: any) => {
      if (res) {
        this.notify.success("Success", "Version accepted Successfully");
        this.goBack();
      }
    });
  }
  setApprovedVersionForSDG(demandDraftId) {
    this.SdgEgService.setApprovedVersion(demandDraftId, this.urlParams.sdfgMasterId).subscribe((res: any) => {
      if (res) {
        this.notify.success("Success", "Version accepted Successfully");
        this.goBack();
      }
    });
  }
  getDemandsList() {
    this.sdfg.getAllDemands().subscribe((demands: any) => {
      this.demandsList = demands;
    });
  }
  submitdds() {
    this.budgetDocService.submitDDS(this.buildSubmitData()).subscribe((ddsId: any) => {
      this.goBack();
    });
  }
  buildSubmitData() {
    let DraftDTOObj = { demandDraftDTO: [], id: null };
    if (this.versionDTO[this.selectedKey].demandHeader) {
      this.versionDTO[this.selectedKey].demandHeader.forEach(d => {
        let obj = {
          "cosDate": d.cosDate,
          "day": d.day,
          "discussion": false,
          "id": d.id,
          "sdfgLineDTO": d.ddsLines
        }
        DraftDTOObj.demandDraftDTO.push(obj);
      });
      DraftDTOObj.id = this.demandDraftMasterId;
      return DraftDTOObj;
    }
  }
}
