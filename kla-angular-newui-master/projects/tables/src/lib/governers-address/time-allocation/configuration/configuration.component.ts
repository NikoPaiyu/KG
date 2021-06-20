import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { differenceInCalendarDays } from 'date-fns';
import { NzNotificationService } from 'ng-zorro-antd';
import { GovernersAddressService } from '../../../shared/services/governersaddress.service';
import { TablescommonService } from '../../../shared/services/tablescommon.service';
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'tables-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {
  @Input() isFileView;
  fileId;
  assignee;
  GvAddrssList: any = [];
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
  timeObj = { canEdit: true, canSubmit: false, canSave: true }
  governorsAddressId;
  constructor(private fb: FormBuilder, public common: TablescommonService,
    private notify: NzNotificationService,
    private router: Router,
    private governerAddrss: GovernersAddressService) { }

  ngOnInit() {
    this.formvalidation();
    this.getAssemblySession();
    this.getGovernersddressList();
  }
  formvalidation() {
    this.TimeallocationForm = this.fb.group({
      timeAllocatedMasterId: [null],
      timeAllocatedDate: [null, [Validators.required]],
      timeAllocatedDay: [null, [Validators.required]],
      totalTime: [null, [Validators.required]],
      moverTime: [null, [Validators.required]],
      ministersReplyTime: [null],
      governorsAddressId: [null],
    });
  }
  getAssemblySession() {
    this.common.getCurrentAssemblyAndSession().subscribe((active) => {
      this.assemblySessionObj.currentsession = active['sessionId'];
      this.assemblySessionObj.currentsessionVal = active['sessionValue'];
    });
  }
  getGovernersddressList() {
    this.governerAddrss.getGovernerAddrssList('APPROVED').subscribe((res: any) => {
      if (res.length === 0) { this.notify.info("Info", "No Governor's Address Found"); return; }
      this.GvAddrssList = res;
      this.governorsAddressId = (this.GvAddrssList.length > 0) ? this.GvAddrssList[0].id : null;
      this.getDayAndDates();
    });
  }
  getDayAndDates() {
    this.governerAddrss.getDayAndDates(this.findFileId()).subscribe((res: any) => {
      this.allocatedDates = res;
      this.handleRequestFromFile();
    });
  }
  getByFileIdAndDay(day) {
    if (day) {
      this.clearVariables();
      this.governerAddrss.getByFileIdAndDay(day, this.findFileId()).subscribe((res: any) => {
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
      governorsAddressId: timeConf.governorsAddressId
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
      this.governerAddrss.generateTA(this.TimeallocationForm.value).subscribe(Res => {
        this.partyTimeDetails = Res;
        this.rulingParty = Res.find(element => element.side === 'Ruling');
        this.oppositionParty = Res.find(element => element.side === 'Opposition');
        this.notify.create('success', 'Success', 'Generated successfully');
      })
    }
  }
  _validateGenerateTime() {
    if (!this.governorsAddressId) {
      this.notify.warning("Warning", "No Governor's Address Found");
      return false;
    }
    if (this.timeCheck()) {
      return true;
    }
    return false;
  }
  save(value) {
    if (this.TimeallocationForm.valid) {
      this.governerAddrss.saveTA(this.buildSaveObjectParams()).subscribe((res: any) => {
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
    this.governerAddrss.submitTA({ fileId: this.findFileId() }).subscribe((res: any) => {
      this.notify.create('success', 'Success', res.message);
      this.router.navigate(['/business-dashboard/tables/file-view/',  this.findFileId()]);
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
      governorsAddressId: this.governorsAddressId
    })
  }
  findFileId() {
    const selected = this.GvAddrssList.find(element => element.status === "APPROVED");
    return selected.fileId;
  }
  clearVariables() {
    this.TimeallocationForm.controls.timeAllocatedDate.setValue(null);
    this.TimeallocationForm.controls.totalTime.setValue(null);
    this.TimeallocationForm.controls.moverTime.setValue(null);
    this.TimeallocationForm.controls.ministersReplyTime.setValue(null);
    this.TimeallocationForm.controls.timeAllocatedMasterId.setValue(null);
    this.partyTimeDetails = this.rulingParty = this.oppositionParty = [];
  }
  handleRequestFromFile() {
    if (Object.keys(this.allocatedDates).length > 0) { // loading for the first time for file view
      this.getByFileIdAndDay(Object.keys(this.allocatedDates)[0])
    }
  }
}
