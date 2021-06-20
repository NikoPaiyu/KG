import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { differenceInCalendarDays } from 'date-fns';
import { NzNotificationService } from 'ng-zorro-antd';
import { TablescommonService } from '../../shared/services/tablescommon.service';
import { timeAllocationData } from '../shared/model/time-alloc.model';
import { TimeAllocationService } from '../shared/services/time-allocation.service';

@Component({
  selector: 'tables-generate-time-allocation',
  templateUrl: './generate-time-allocation.component.html',
  styleUrls: ['./generate-time-allocation.component.css']
})
export class GenerateTimeAllocationComponent implements OnInit {
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
  timeAllocationData : timeAllocationData
  partyTimeDetails: any;
  rulingParty: any = [];
  oppositionParty: any = [];
  days = ['Day1', 'Day2', 'Day3'];
  timeObj = { canEdit: true, canSubmit: false, dataList: []};
  businessId = null;
  filePopup = false;
  buisnessDetails : any;
  constructor(
    private fb: FormBuilder,
    public common: TablescommonService,
    private notify: NzNotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private timeAllocationService : TimeAllocationService) { 
      if(!this.isFileView){
        this.businessId = this.route.snapshot.params.id;
      }
    }
    
  ngOnInit() {
    this.formvalidation();
    this.getAssemblySession();
  }
  getAssemblySession() {
    this.common.getCurrentAssemblyAndSession().subscribe((active) => {
      this.assemblySessionObj.currentsession = active['sessionId'];
      this.assemblySessionObj.currentsessionVal = active['sessionValue'];
      this.getDayAndDates() ;
      this.getBuisnessDetailsById();
    });
  }
  formvalidation() {
    this.TimeallocationForm = this.fb.group({
      timeAllocatedMasterId: [null],
      timeAllocatedDate: [null, [Validators.required]],
      timeAllocatedDay: [null, [Validators.required]],
      totalTime: [null, [Validators.required]],
      moverTime: [null, [Validators.required]],
      ministersReplyTime: [null],
      businessId: [null],
    });
  }
 
  getDayAndDates() {
    this.timeAllocationService.getDayAndDates(this.businessId).subscribe((res: any) => {
      this.allocatedDates = res;
      this.handleRequestFromFile();
    });
  }
  getBuisnessDetailsById(){
    this.timeAllocationService.getBuisnessDetailsById(this.businessId).subscribe((res: any) => {
      this.buisnessDetails = res;
      this.timeObj.canSubmit = this.buisnessDetails.canSubmitFile;
    });
  }
  handleRequestFromFile() {
    if (Object.keys(this.allocatedDates).length > 0) { // loading for the first time for file view
      // this.getByBusinessIdAndDay(Object.keys(this.allocatedDates)[0])
      this.TimeallocationForm.patchValue({
        timeAllocatedDay : Object.keys(this.allocatedDates)[0],
        timeAllocatedDate : (Object.values(this.allocatedDates)[0])
      })
    }
  }
  getByBusinessIdAndDay(day) {
    if (day) {
      this.clearVariables();
      this.timeAllocationService.getByBusinessIdAndDay(this.businessId,day).subscribe((res: any) => {
        if (res) { 
          this.timeAllocationData = res;
          this.patchFormValues(day);
         }
      });
    }
  }
  patchFormValues(day) {
    this.TimeallocationForm.patchValue({
      timeAllocatedMasterId:  this.timeAllocationData.timeAllocatedMasterId,
      timeAllocatedDate: this.timeAllocationData.timeAllocatedDate? this.timeAllocationData.timeAllocatedDate : this.allocatedDates[parseInt(day)],
      totalTime:this.timeAllocationData.totalTime !== 0 ? this.timeAllocationData.totalTime : null,
      moverTime: this.timeAllocationData.moverTime !== 0 ? this.timeAllocationData.moverTime : null,
      ministersReplyTime: this.timeAllocationData.ministersReplyTime !== 0 ? this.timeAllocationData.ministersReplyTime : null,
      businessId: this.timeAllocationData.businessDto ? this.timeAllocationData.businessDto.id : null
    });
    this.partyTimeDetails = this.timeAllocationData.timeResponseDTO;
    if( this.partyTimeDetails){
      this.rulingParty = this.partyTimeDetails.find(element => element.side === 'Ruling');
      this.oppositionParty = this.partyTimeDetails.find(element => element.side === 'Opposition');
    }
    this.timeObj.canSubmit = (this.timeAllocationData.status === 'SAVED') ? true : false;
    this.timeObj.canEdit = true;
    this.businessId= this.timeAllocationData.businessDto.id;
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
  onEdit(){
    this.timeObj.canEdit = true;
    this.timeObj.canSubmit = false;
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
      this.timeAllocationService.generateTA(this.TimeallocationForm.value).subscribe(Res => {
        this.partyTimeDetails = Res;
        this.rulingParty = Res.find(element => element.side === 'Ruling');
        this.oppositionParty = Res.find(element => element.side === 'Opposition');
        this.notify.create('success', 'Success', 'Generated successfully');
      })
    }
  }
  _validateGenerateTime() {
    if (this.timeCheck()) {
      return true;
    }
    return false;
  }
  save(value) {
    if (this.TimeallocationForm.valid) {
      if (value === 'SUBMIT') {
        this.submitTA();
        return;
      } else {  
        this.timeAllocationService.saveTA(this.buildSaveObjectParams()).subscribe((res: any) => {
        this.timeObj.canEdit = false;
        this.timeObj.canSubmit = true;
        this.TimeallocationForm.controls.timeAllocatedMasterId.setValue(res.id);
        this.notify.create('success', 'Success', 'Saved successfully');
      });
     }
    } else {
      for (const key in this.TimeallocationForm.controls) {
        this.TimeallocationForm.controls[key].markAsDirty();
        this.TimeallocationForm.controls[key].updateValueAndValidity();
      }
    }
  }
  submitTA() {
    this.filePopup = true;
  }
  buildSaveObjectParams() {
    let formDto = this.TimeallocationForm.value;
    return ({
      timeAllocatedMasterId: formDto.timeAllocatedMasterId,
      timeResponseDTO: this.partyTimeDetails,
      fileId:null,
      timeAllocatedDay: formDto.timeAllocatedDay,
      timeAllocatedDate: formDto.timeAllocatedDate,
      totalTime: formDto.totalTime,
      moverTime: formDto.moverTime,
      ministersReplyTime: formDto.ministersReplyTime,
      businessId: this.businessId,
      // type: this.timeObj.type
    })
  }
  clearVariables() {
    this.TimeallocationForm.controls.timeAllocatedDate.setValue(null);
    this.TimeallocationForm.controls.totalTime.setValue(null);
    this.TimeallocationForm.controls.moverTime.setValue(null);
    this.TimeallocationForm.controls.ministersReplyTime.setValue(null);
    this.TimeallocationForm.controls.timeAllocatedMasterId.setValue(null);
    this.TimeallocationForm.controls.businessId.setValue(null);
    this.partyTimeDetails = this.rulingParty = this.oppositionParty = [];
  }
  onCancelFilePopup(){
    this.filePopup = false;
  }
}
