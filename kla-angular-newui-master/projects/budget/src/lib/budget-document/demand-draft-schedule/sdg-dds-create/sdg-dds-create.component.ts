import { Component, OnInit, Inject, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { BudgetDocumentService } from '../../../shared/services/budget-document.service';
import { StmtDemandsGrantsService } from '../../../shared/services/stmt-demands-grants.service';
import { FileServiceService } from '../../../shared/services/file-service.service';
import { differenceInCalendarDays, parseISO } from 'date-fns';
import { SdgEgService } from '../../../shared/services/sdg-eg.service'
@Component({
  selector: 'budget-sdg-dds-create',
  templateUrl: './sdg-dds-create.component.html',
  styleUrls: ['./sdg-dds-create.component.scss']
})
export class SdgDdsCreateCreateComponent implements OnInit {
  @Input() demandMasterId;
  @Input() isFrmFileView;
  ddsMainDto = { ddsId: null, ddsList: [], sdfgId: null, fileId: null, isEdit: false, sdfgList: [] };
  demandsList; tempdemandsList;
  ddsListById;
  urlParams: any;
  today: any = new Date()

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private notify: NzNotificationService,
    private budgetDoc: BudgetDocumentService,
    private sdfg: StmtDemandsGrantsService,
    private file: FileServiceService,
    @Inject('authService') public auth,
    private SdgEgService: SdgEgService
  ) {
    this.urlParams = this.router.getCurrentNavigation().extras.state;
  }
  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (params["id"]) {
        this.ddsMainDto.isEdit = true;
        this.ddsMainDto.ddsId = params["id"];
      }
      if (this.demandMasterId) {
        this.ddsMainDto.ddsId = this.demandMasterId;
      }
        this.getAllPublishedSDGEG();
      this.renderDDSData();
    });
  }

  renderDDSData() {
    if (this.ddsMainDto.ddsId) {
        this.getSavedSDGEGdds();
        return;
    }
  }
  getAllPublishedSDFG() {
    this.sdfg.getAllPublishedSDFG().subscribe((res: any) => {
      if (res && res.content.length == 0) {
        this.notify.info("Info", "No Published SDFG / VOA Found");
        return;
      }
      this.ddsMainDto['sdfgList'] = res.content;
    });
  }
  getAllPublishedSDGEG() {
    this.SdgEgService.getAllLegiApprovedSDGEG(null).subscribe((res: any) => {
      if (res == null) {
        this.notify.info("Info", "No Published SDG or EG Found");
        return;
      }
      this.ddsMainDto['sdfgList'] = res;
    });
  }
  getSDFGByLineId(sdfgDto) {
      this.SdgEgService.getSDGEGById(sdfgDto.id).subscribe((data: any) => {
        if (!data) {
          this.notify.info("Info", "No SDG and EG Found");
          return;
        }
        this.demandsList = data ? data.lines : [];
        this.ddsMainDto.sdfgId = (sdfgDto.id) ? sdfgDto.id : null;
        this.ddsMainDto.fileId = (sdfgDto.legislationFileId) ? sdfgDto.legislationFileId : null;
        this.tempdemandsList = [...this.demandsList]
        this.initializedds();
      });
  }
  getSaveddds() {
    this.budgetDoc.getByDemandDraftById(this.ddsMainDto.ddsId).subscribe((res: any) => {
      this.ddsListById = res;
      this.getSDFGByLineId({ sdfgId: this.ddsListById.sdfgMasterId, fileId: this.ddsListById.fileId })
    });
  }
  getSavedSDGEGdds() {
    this.SdgEgService.getByDemandDraftById(this.ddsMainDto.ddsId).subscribe((res: any) => {
      this.ddsListById = res;
      this.getSDFGByLineId({ id: this.ddsListById.sdfgId, legislationFileId: this.ddsListById.fileId })
    });
  }
  initializedds() {
    if (this.ddsListById) {
      this.patchValues();
      return;
    }
    this._initializeDDSObject();
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
    if (draftLines) {
      draftLines.forEach(l => {
        lines.push({
          id: l.demandDraftLineId,
          cosDate: cosDate,
          sdfgLineId: l.sdfgLineId,
          suggestionByOL: false
        })
      });
    }
    return lines;
  }
  _initializeDDSObject() {
    for (let i = 0; i < 3; i++) {
      let day = i + 1;
      this.ddsMainDto.ddsList.push({
        ddsLines: [{ id: null, cosDate: this.today.toISOString().split("T")[0], sdfgLineId: null, suggestionByOL: false }],
        cosDate: null,
        day: day,
        discussion: false,
        id: null,
        canEdit: false,
        sdfgLineDTO: []
      });
    }
  }
  savedds() {
    if (this.validatedds()) {
        this.SdgEgService.createDDS(this.buildSubmitData()).subscribe((res: any) => {
          this.notify.success('Success', 'Saved successfully');
          this.router.navigate(['business-dashboard/budgets/sdgeg/dds/list']);
        });
    }
  }
  buildSubmitData() {
    let DraftDTOObj = { demandDraftDTO: [], id: null, sdfgId: '' };
    if (this.ddsMainDto.ddsList) {
      this.ddsMainDto.ddsList.forEach(d => {
        let obj = {
          "cosDate": d.cosDate,
          "day": d.day,
          "discussion": false,
          "id": d.id,
          "sdfgLineDTO": d.ddsLines
        }
        DraftDTOObj.demandDraftDTO.push(obj);
      });
      DraftDTOObj.id = this.ddsMainDto.ddsId;
      DraftDTOObj.sdfgId = this.ddsMainDto.sdfgId;
      return DraftDTOObj;
    }
  }
  submitdds() {
    if (this.validatedds()) {
        this.SdgEgService.submitDDS(this.buildSubmitData()).subscribe((ddsId: any) => {
          this.ddsMainDto.ddsId = ddsId;
          this.resubmitFile('BUDGET_DEMAND_DRAFT_MASTER_SDG_EG');
          this.router.navigate(['business-dashboard/budgets/sdgeg/dds/list']);
        });
    }
  }
  resubmitFile(activeSubtype) {
    let body: any;
    body = {
      fileForm: {
        fileId: this.ddsMainDto.fileId,
        activeSubTypes: [activeSubtype],
        type: 'BUDGET',
        userId: this.auth.getCurrentUser().userId,
      },
    };
    this.file.reSubmitFile(this.setUniqId(body, activeSubtype)).subscribe((res:any) => {
      if (res) {
        this.notify.success('Success', 'Submitted successfully.');
        this.router.navigate(['business-dashboard/budgets/file-view/', res.fileResponse.fileId]);
      }
    });
  }
  setUniqId(body, activeSubtype) {
    switch (activeSubtype) {
      case 'BUDGET_DEMAND_DRAFT_MASTER_SDG_EG':
        body.demandDraftMasterForSdgEgId = this.ddsMainDto.ddsId;
        break;
      case 'BUDGET_DEMAND_DRAFT':
        body.demandDraftMasterId = this.ddsMainDto.ddsId;
        break;
      default:
        break;
    }
    return body;
  }
  validatedds() {
    return true;
  }
  goBack() {
    this.router.navigate(['business-dashboard/budgets/dds/list']);
  }
  addNewHead(dds, index) {
    let ddsLines =
      { id: null, cosDate: dds.cosDate ? dds.cosDate.toISOString().split("T")[0] : '', sdfgLineId: null, suggestionByOL: false }
    this.ddsMainDto.ddsList[index].ddsLines.push(ddsLines);
  }
  disabledDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, this.today) < 0;
  }
  assignSDFGLinedate(dds) {
    if (this.ddsMainDto.ddsList && this.ddsMainDto.ddsList.length > 0) {
      this.ddsMainDto.ddsList.forEach(e => {
        if (e.day !== dds.day) {
          if (e.cosDate && dds.cosDate) {
            if (dds.cosDate.toISOString().split("T")[0] == e.cosDate.toISOString().split("T")[0]) {
              dds.cosDate = null;
              this.notify.warning('Warning', 'Date already Choosed!!');
              return
            }
          }
        }
      });
    }
    if (dds.ddsLines && dds.ddsLines.length > 0) {
      dds.ddsLines.forEach(e => {
        if (dds.cosDate) {
          e.cosDate = dds.cosDate.toISOString().split("T")[0]
        }
      });
    }
  }
  disableddsDeleteIcon(dds) {
    if (this.ddsListById && this.ddsListById.status !== 'SAVED') {
      return true
    } else if (dds.ddsLines && dds.ddsLines.length == 1) {
      return true
    }
    return false
  }
  disableDDSBtns() {
    if (!this.ddsMainDto.sdfgId) {
      return true;
    } else if (this.ddsListById && this.ddsListById.status !== 'SAVED') {
      return true;
    }
    return false;
  }
  onChangeHead() {
    let seldemandsList = [];
    if (this.ddsMainDto.ddsList && this.ddsMainDto.ddsList.length > 0) {
      this.ddsMainDto.ddsList.forEach(ddsMainDto => {
        ddsMainDto.ddsLines.forEach(dds => {
          if (dds.sdfgLineId) {
            seldemandsList.push(dds);
          }
        });
      });
      this.demandsList = this.filterDemands(this.tempdemandsList, seldemandsList);
    }
  }
  filterDemands = (demandList1, demandList2) => {
    return demandList1.filter(Item1 =>
      !demandList2.some(
        Item2 => Item1.id === Item2.sdfgLineId
      )
    );
  };
  removeHead(item, mainindex, lineIndex) {
    if (item.id) {
      this.budgetDoc.DeleteDDS(item.id).subscribe((res: any) => {
        this.ddsMainDto.ddsList[mainindex].ddsLines.splice(lineIndex, 1);
        if (item.sdfgLineId) {
          this.onChangeHead();
        }
        this.notify.success('Success', 'Deleted successfully');
      }); return;
    }
    this.ddsMainDto.ddsList[mainindex].ddsLines.splice(lineIndex, 1);
    if (item.sdfgLineId) {
      this.onChangeHead();
    }
    this.notify.success('Success', 'Deleted successfully');
  }
}
