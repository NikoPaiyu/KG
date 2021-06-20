import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { differenceInCalendarDays } from 'date-fns';
import { NzNotificationService } from 'ng-zorro-antd';
import { BudgetSpeechService } from '../../shared/services/budget-speech.service';
import { BudgetCommonService } from '../../shared/services/budgetcommon.service';
import { Router, ActivatedRoute } from "@angular/router";
import { StmtDemandsGrantsService } from '../../shared/services/stmt-demands-grants.service';
import { SdgEgService } from '../../shared/services/sdg-eg.service'
@Component({
  selector: 'budget-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {
  @Input() isFileView = false;
  @Input() type = null;
  @Input() masterId = null;
  allocatedDates: any = [];
  fileResponse;
  today = new Date();
  assemblySessionObj = {
    currentsession: '',
    currentsessionVal: '',
  };
  visible = false;
  TimeallocationForm: FormGroup;
  partyTimeDetails: any;
  rulingParty: any = [];
  oppositionParty: any = [];
  days = ['Day1', 'Day2', 'Day3'];
  timeObj = { canEdit: true, canSubmit: false, canSave: true, dataList: [], masterObj: '', type: null, billtype: null, selectLbl: "Select SDFG/VOA", viewLbl: 'SDFG/VOA', typeArr: [] };
  constructor(private fb: FormBuilder,
    public common: BudgetCommonService,
    private notify: NzNotificationService,
    private router: Router,
    private budgetSpeech: BudgetSpeechService,
    private sdfg: StmtDemandsGrantsService,
    private SdgEgService: SdgEgService
  ) { }

  ngOnInit() {
    this.formvalidation();
    this.getAssemblySession();
  }
  getAssemblySession() {
    this.common.getCurrentAssemblyAndSession().subscribe((active) => {
      this.assemblySessionObj.currentsession = active['sessionId'];
      this.assemblySessionObj.currentsessionVal = active['sessionValue'];
      this.loadTypes();
      // this.redirectOnURL();
    });
  }
  showDropdown() {
    this.timeObj.dataList = [];
    this.timeObj.masterObj = null
    this.clearVariables();
    switch (this.timeObj.type) {
      case 'CUT_MOTION':
        this.timeObj.type = 'CUT_MOTION'
        this.getAllPublishedSDFG();
        break;
      case 'SDG_EG':
        this.timeObj.type = 'SDG_EG'
        this.timeObj.selectLbl = "Select SDG/EG"
        this.getPublishedSDGEG();
        break;
      case 'AP_BILL_ON_BUDGET':
        this.timeObj.type = 'AP_BILL_ON_BUDGET';
        this.timeObj.billtype = 'AP_BUDGET';
        this.timeObj.selectLbl = "Select AP Bill On Budget"
        this.getApprovedAPBills();
        break;
      case 'AP_BILL_ON_VOA':
        this.timeObj.type = 'AP_BILL_ON_VOA';
        this.timeObj.selectLbl = "Select AP Bill On VOA";
        this.timeObj.billtype = 'AP_VOA';
        this.getApprovedAPBills();
        break;
      case 'AP_BILL_ON_SDG':
        this.timeObj.type = 'AP_BILL_ON_SDG';
        this.timeObj.selectLbl = "Select AP Bill On SDG";
        this.timeObj.billtype = 'AP_SDG';
        this.getApprovedAPBills();
        break;
      case 'BUDGET_SPEECH':
          this.timeObj.type = 'BUDGET_SPEECH';
          this.timeObj.selectLbl = "Select Budget Speech";
          this.getAllPublishedBudgetSpeech();
          break;
      case 'FINANCE_BILL':
        this.timeObj.type = 'FINANCE_BILL';
        this.timeObj.selectLbl = "Select Finance Bill";
        this.getAllPublishedBudgetSpeech();
        break;
      default:
        break;
    }
  }
  loadTypes() {
    this.timeObj.typeArr = [
      { value: 'BUDGET_SPEECH', label: 'Budget Speech' },
      { value: 'CUT_MOTION', label: 'SDFG/VOA' },
      { value: 'SDG_EG', label: 'SDG EG' },
      { value: 'AP_BILL_ON_BUDGET', label: 'AP Bill On Budget' },
      { value: 'AP_BILL_ON_VOA', label: 'AP Bill On VOA' },
      { value: 'AP_BILL_ON_SDG', label: 'AP Bill On SDG' },
      { value: 'FINANCE_BILL', label: 'Finance Bill' }];

    if (this.masterId && this.isFileView) {
      this.timeObj.type = this.type;
      this.showDropdown();
    }
  }

  getApprovedAPBills() {
    this.common.getApprovedAppropriationBills(this.timeObj.billtype).subscribe((res: any) => {
      if (res && res.length == 0) {
        this.notify.info("Info", "No Approved Bill Found");
        return;
      }
      this.timeObj.dataList = res;
      this.timeObj.dataList = this.timeObj.dataList.map(x => ({
        fileId: x.tableFileId,
        masterId: x.billId,
        title: x.title
      }));
      if (this.masterId && this.isFileView) {
        this.setMasterObj();
      }
    });
  }
  getAllPublishedSDFG() {
    this.sdfg.getAllPublishedSDFG().subscribe((res: any) => {
      if (res && res.content.length == 0) {
        this.notify.info("Info", "No Published SDFG / VOA Found");
        return;
      }
      this.timeObj.dataList = res.content;
      this.timeObj.dataList = this.timeObj.dataList.map(x => ({
        fileId: x.tableFileId,
        masterId: x.sdfgId,
        title: x.title
      }));
      if (this.masterId && this.isFileView) {
        this.setMasterObj();
      }
    });
  }
  getAllPublishedBudgetSpeech() {
    this.budgetSpeech.getAllPublishedBudgetSpeech(null).subscribe((res: any) => {
      if (res && res.length == 0) {
        this.notify.info("Info", "No Published Budget Speech Found");
        return;
      }
      this.timeObj.dataList = res;
      this.timeObj.dataList = this.timeObj.dataList.map(x => ({
        fileId: x.tableFileId,
        masterId: x.id,
        title: x.budgetTitle
      }));
      if (this.masterId && this.isFileView) {
        this.setMasterObj();
      }
    });
  }
  getPublishedSDGEG() {
    this.SdgEgService.getPublishedSDGEGwithoutPagination().subscribe((res: any) => {
      if (res && res.length == 0) {
        this.notify.info("Info", "No Published SDG / EG Found");
        return;
      }
      this.timeObj.dataList = res;
      this.timeObj.dataList = this.timeObj.dataList.map(x => ({
        fileId: x.tableFileId,
        masterId: x.id,
        title: x.title
      })
      );
      if (this.masterId && this.isFileView) {
        this.setMasterObj();
        this.timeObj.viewLbl = 'SDG/EG';
      }
    });
  }
  setMasterObj() {
    this.timeObj.masterObj = this.timeObj.dataList.find(element => element.masterId == this.masterId);
    this.getTABySdfgId();
  }
  formvalidation() {
    this.TimeallocationForm = this.fb.group({
      timeAllocatedMasterId: [null],
      timeAllocatedDate: [null, [Validators.required]],
      timeAllocatedDay: [null, [Validators.required]],
      totalTime: [null, [Validators.required]],
      moverTime: [null, [Validators.required]],
      ministersReplyTime: [null],
      masterId: [null],
    });
  }
  getTABySdfgId() {
    this.clearVariables();
    if (this.timeObj.masterObj) {
      this.getDayAndDates();
    }
  }
  getDayAndDates() {
    this.budgetSpeech.getDayAndDates(this.findFileId(), this.timeObj.type).subscribe((res: any) => {
      this.allocatedDates = res;
      this.handleRequestFromFile();
    });
  }
  handleRequestFromFile() {
    if (Object.keys(this.allocatedDates).length > 0) { // loading for the first time for file view
      this.getByFileIdAndDay(Object.keys(this.allocatedDates)[0])
    }
  }
  getByFileIdAndDay(day) {
    if (day) {
      this.clearVariables();
      this.budgetSpeech.getByFileIdAndDay(day, this.findFileId(), this.timeObj.type).subscribe((res: any) => {
        if (res && res.fileId) { this.patchFormValues(res); }
      });
    }
  }
  patchFormValues(timeConf) {
    this.TimeallocationForm.patchValue({
      timeAllocatedMasterId: timeConf.timeAllocatedMasterId,
      timeAllocatedDate: timeConf.timeAllocatedDate,
      totalTime: timeConf.totalTime,
      moverTime: timeConf.moverTime,
      ministersReplyTime: timeConf.ministersReplyTime,
      masterId: timeConf.masterId
    });
    this.partyTimeDetails = timeConf.timeResponseDTO;
    this.rulingParty = this.partyTimeDetails.find(element => element.side === 'Ruling');
    this.oppositionParty = this.partyTimeDetails.find(element => element.side === 'Opposition');
    this.timeObj.canSubmit = (timeConf.status === 'SAVED') ? true : false;
    this.timeObj.canSave = (timeConf.status === 'SAVED') ? true : false;
  }
  disabledDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, this.today) < 0;
  }
  drawer(): void {
    this.visible = !this.visible;
  }
  editNote(note) {
    note.isEdit = true;
  }
  timeCheck() {
    let totalTime = parseInt(this.TimeallocationForm.value.totalTime, 10) ? parseInt(this.TimeallocationForm.value.totalTime, 10) : 0;
    let moverTime = parseInt(this.TimeallocationForm.value.moverTime, 10) ? parseInt(this.TimeallocationForm.value.moverTime, 10) : 0;
    let ministersReplyTime = parseInt(this.TimeallocationForm.value.ministersReplyTime, 10) ? parseInt(this.TimeallocationForm.value.ministersReplyTime, 10) : 0;
    let finalTotalTime = (moverTime != 0 && ministersReplyTime != 0) ? moverTime + ministersReplyTime : null
    if (totalTime) {
      if (moverTime > totalTime) {
        this.notify.warning("Sorry", "mover time should not be greater than the total time");
        this.TimeallocationForm.controls.moverTime.setValue(null);
        return false;
      }
      if (ministersReplyTime > totalTime) {
        this.notify.warning("Sorry", "minister reply time should not be greater than the total time");
        this.TimeallocationForm.controls.ministersReplyTime.setValue(null);
        return false;
      }
      if (finalTotalTime && finalTotalTime > totalTime) {
        this.notify.warning("Sorry", "sum of reply and mover time should not be greater than the total time");
        this.TimeallocationForm.controls.moverTime.setValue(null);
        this.TimeallocationForm.controls.ministersReplyTime.setValue(null);
        return false;
      }
    }
    return true;
  }
  generateTA() {
    if (!this._validateGenerateTime()) {
      return;
    }
    if (this.TimeallocationForm.valid) {
      this.budgetSpeech.generateTA(this.TimeallocationForm.value).subscribe(Res => {
        this.partyTimeDetails = Res;
        this.rulingParty = Res.find(element => element.side === 'Ruling');
        this.oppositionParty = Res.find(element => element.side === 'Opposition');
        this.notify.create('success', 'Success', 'Generated successfully');
      })
    }
  }
  _validateGenerateTime() {
    if (!this.timeObj.masterObj) {
      this.notify.warning("Warning", "No SDFG / VOA Found");
      return false;
    }
    if (this.timeCheck()) {
      return true;
    }
    return false;
  }
  save(value) {
    if (this.TimeallocationForm.valid) {
      this.budgetSpeech.saveTA(this.buildSaveObjectParams()).subscribe((res: any) => {
        this.timeObj.canEdit = false;
        this.TimeallocationForm.controls.timeAllocatedMasterId.setValue(res.id);
        if (value === 'SUBMIT') {
          this.submitTA();
          return;
        } else { this.notify.create('success', 'Success', 'Saved successfully'); }
      });
    } else {
      for (const key in this.TimeallocationForm.controls) {
        this.TimeallocationForm.controls[key].markAsDirty();
        this.TimeallocationForm.controls[key].updateValueAndValidity();
      }
    }
  }
  submitTA() {
    this.budgetSpeech.submitTA({ fileId: this.findFileId(), type: this.timeObj.type }).subscribe((res: any) => {
      this.notify.create('success', 'Success', res.message);
      this.router.navigate(['/business-dashboard/budgets/file-view/', this.findFileId()]);
    });
  }
  buildSaveObjectParams() {
    let formDto = this.TimeallocationForm.value;
    return ({
      timeAllocatedMasterId: formDto.timeAllocatedMasterId,
      timeResponseDTO: this.partyTimeDetails,
      fileId: this.findFileId(),
      timeAllocatedDay: formDto.timeAllocatedDay,
      timeAllocatedDate: formDto.timeAllocatedDate,
      totalTime: formDto.totalTime,
      moverTime: formDto.moverTime,
      ministersReplyTime: formDto.ministersReplyTime,
      masterId: this.getMatesrId(),
      type: this.timeObj.type
    })
  }
  getMatesrId() {
    if (this.timeObj.masterObj) {
      if (this.timeObj.masterObj['masterId']) {
        return this.timeObj.masterObj['masterId']
      }
    }
  }
  findFileId() {
    if (this.timeObj.masterObj) {
      if (this.timeObj.masterObj['fileId']) {
        return this.timeObj.masterObj['fileId']
      }
    }
  }
  clearVariables() {
    this.TimeallocationForm.controls.timeAllocatedDate.setValue(null);
    this.TimeallocationForm.controls.totalTime.setValue(null);
    this.TimeallocationForm.controls.moverTime.setValue(null);
    this.TimeallocationForm.controls.ministersReplyTime.setValue(null);
    this.TimeallocationForm.controls.timeAllocatedMasterId.setValue(null);
    this.TimeallocationForm.controls.masterId.setValue(null);
    this.partyTimeDetails = this.rulingParty = this.oppositionParty = [];
    this.timeObj.canSubmit = true;
    this.timeObj.canSave = true;
  }
  canSave() {
    if (!this.TimeallocationForm.valid) {
      return true;
    }
    if (this.timeObj.canSave) {
      return false;
    }
    return true;
  }
  removeUnderScore(element) {
    return element.replace(/_/g, " ");
  }
}