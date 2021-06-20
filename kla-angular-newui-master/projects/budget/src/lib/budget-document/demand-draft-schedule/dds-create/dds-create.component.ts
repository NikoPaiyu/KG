import { Component, OnInit, Inject, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { BudgetDocumentService } from '../../../shared/services/budget-document.service';
import { StmtDemandsGrantsService } from '../../../shared/services/stmt-demands-grants.service';
import { FileServiceService } from '../../../shared/services/file-service.service';
import { BudgetCommonService } from '../../../shared/services/budgetcommon.service';
import { differenceInCalendarDays, parseISO } from 'date-fns';
import { SdgEgService } from '../../../shared/services/sdg-eg.service'
@Component({
  selector: 'budget-dds-create',
  templateUrl: './dds-create.component.html',
  styleUrls: ['./dds-create.component.scss']
})
export class DdsCreateComponent implements OnInit {
  @Input() demandMasterId;
  @Input() isFrmFileView;
  ddsMainDto = { ddsId: null, ddsList: [], sdfgId: null, fileId: null, type: null,  isEdit: false, sdfgList: [] };
  demandsList; tempdemandsList;
  ddsListById;
  urlParams: any;
  today: any = new Date()
  cutmotionDeadlineDates: any = [];
  assemblySession = {assembly: {}, session: {}}

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private notify: NzNotificationService,
    private budgetDoc: BudgetDocumentService,
    private sdfg: StmtDemandsGrantsService,
    private file: FileServiceService,
    @Inject('authService') public auth,
    private SdgEgService: SdgEgService,
    public common: BudgetCommonService,
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
        this.getAllPublishedSDFG();
      this.renderDDSData();
      this.getAssemblySession();
    });
  }
  getAssemblySession() {
        this.common.getCurrentAssemblyAndSession().subscribe((active) => {
            this.assemblySession.assembly['currentassemblyVal'] = active['assemblyValue'];
            this.assemblySession.session['currentsessionVal'] = active['sessionValue'];
      });
  }
  renderDDSData() {
    if (this.ddsMainDto.ddsId) {
        this.getSaveddds();
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
      this.sdfg.getSDFGByLinesId(sdfgDto.sdfgId).subscribe((data: any) => {
        if (!data) {
          this.notify.info("Info", "No SDFG Found");
          return;
        }
        this.demandsList = data ? data.lines : [];
        this.ddsMainDto.sdfgId = (sdfgDto.sdfgId) ? sdfgDto.sdfgId : null;
        this.ddsMainDto.fileId = (sdfgDto.fileId) ? sdfgDto.fileId : null;
        this.ddsMainDto.type = (sdfgDto.type) ? sdfgDto.type : null;
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
        fromTime: d.fromTime,
        toTime: d.toTime,
        cutmotionDeadlineTime: d.cutmotionDeadlineTime,
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
          fromTime: l.fromTime,
          toTime: l.toTime,
          cutmotionDeadlineTime: l.cutmotionDeadlineTime,
          sdfgLineId: l.sdfgLineId,
          suggestionByOL: false
        })
      });
    }
    return lines;
  }
  _initializeDDSObject() {
    let daysCount = 3;
    if(this.ddsMainDto.type == 'VOA') {
      daysCount = 1;
    }
    for (let i = 0; i < daysCount; i++) {
      let day = i + 1;
      this.ddsMainDto.ddsList.push({
        ddsLines: [{ id: null, cosDate: this.today.toISOString().split("T")[0], fromTime: null, toTime: null, cutmotionDeadlineTime: null, sdfgLineId: null, suggestionByOL: false }],
        cosDate: null,
        fromTime: null,
        toTime: null,
        cutmotionDeadlineTime: null,
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
        this.budgetDoc.createDDS(this.buildSubmitData()).subscribe((res: any) => {
          this.notify.success('Success', 'Saved successfully');
          this.goBack();
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
        this.budgetDoc.submitDDS(this.buildSubmitData()).subscribe((ddsId: any) => {
          this.ddsMainDto.ddsId = ddsId;
          this.resubmitFile();
          this.goBack();
        });
    }
  }
  resubmitFile() {
    let body: any;
    let activeSubTypes = ['BUDGET_DEMAND_DRAFT']
    body = {
      demandDraftMasterId: this.ddsMainDto.ddsId,
      fileForm: {
        fileId: this.ddsMainDto.fileId,
        activeSubTypes: (this.ddsMainDto.type == 'VOA') ? activeSubTypes.push('BUDGET_DEMAND_DRAFT_SCHEDULE_BULLETIN'): activeSubTypes,
        type: 'BUDGET',
        userId: this.auth.getCurrentUser().userId,
      },
    };
    this.file.reSubmitFile(body).subscribe((res: any) => {
      if (res) {
        this.notify.success('Success', 'Submitted successfully.');
        this.router.navigate(['business-dashboard/budgets/file-view/', res.fileResponse.fileId]);
      }
    });
  }
  validatedds() {
    return true;
  }
  goBack() {
    this.router.navigate(['business-dashboard/budgets/dds/list']);
  }
  addNewHead(dds, index) {
    let ddsLines =
      { id: null, cosDate: dds.cosDate ? dds.cosDate.toISOString().split("T")[0] : '', fromTime: dds.fromTime ? dds.fromTime : '', toTime: dds.toTime ? dds.toTime : '', cutmotionDeadlineTime: dds.cutmotionDeadlineTime ? dds.cutmotionDeadlineTime : '', sdfgLineId: null, suggestionByOL: false }
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
          e.cosDate = dds.cosDate.toISOString().split("T")[0];
          e.cutmotionDeadlineTime = this.cutmotionLastdate(dds.cosDate);
          this.getcutmotionDeadlineDates(e.cutmotionDeadlineTime);
        }
        if(dds.fromTime && dds.toTime) {
          e.fromTime = dds.fromTime;
          e.toTime = dds.toTime;
        }
        if(dds.cutmotionDeadlineTime) {
          e.cutmotionDeadlineTime = dds.cutmotionDeadlineTime;
          this.getcutmotionDeadlineDates(e.cutmotionDeadlineTime);
        }
      });
    }
  }
  getcutmotionDeadlineDates(cutmotionLastdate) {
    this.cutmotionDeadlineDates =  (current: Date): boolean => {
      return (differenceInCalendarDays(current, cutmotionLastdate) > 0 || differenceInCalendarDays(current, cutmotionLastdate) < 0);
    };
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
 cutmotionLastdate(cosDate) {
   if(cosDate) {
    var d = new Date(cosDate);
    d.setDate(d.getDate() - 3);
    return d;
   }
 }
 findTime(d) {
  d = new Date(d);
  return (d.toLocaleTimeString());
 }
}
