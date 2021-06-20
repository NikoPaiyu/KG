import { Component, OnInit, Inject, Input, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CorrespondenceService } from "../../services/correspondence.service";
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';


@Component({
  selector: 'add-timeallocation-response',
  templateUrl: './add-timeallocation-response.component.html',
  styleUrls: ['./add-timeallocation-response.component.css']
})
export class AddTimeallocationResponseComponent implements OnInit {
  @Input() correspondenceFormGrp: FormGroup;
  @Input() currentBuinessType;
  @Output() emitBusinessData = new EventEmitter<any>();
  @Input() business;
  timeAllcForm: FormGroup; addMemForm: FormGroup;
  assemblySessionObj = {
    currentsession: '',
    currentsessionVal: '',
  };
  today = new Date();
  showAddMmemModal = false;
  mlaList = []; tempmlaList = [];
  timeAllocation = [{ days: [], dates: [], totalTime: 0, allocateTime: 0, unallocateTime: 0 }];
  timeData;
  finalbusinessData: any = [];
  getDateList: any = [];
  isnewlyAdded = false;
  type = '';
  constructor(private fb: FormBuilder, private correspondence: CorrespondenceService, @Inject('authService') private auth, private notify: NzNotificationService) { }

  ngOnInit() {
    this.formvalidation();
    this.getAssemblySession();
    this.getPPOMembersList();
    if (this.currentBuinessType == 'TABLE') {
      this.getDayAndDates();
    } else {
      this.getTypeByBusiness();
    }
    this.getTimeByUserId();
  }
  getAssemblySession() {
    this.correspondence.getCurrentAssemblyAndSession().subscribe((active : any) => {
      if(active){
      this.assemblySessionObj.currentsession = active.activeAssemblySession['sessionId'];
      this.assemblySessionObj.currentsessionVal = active.activeAssemblySession['sessionValue'];
      }
    });
  }
  getPPOMembersList() {
    if (this.auth.getCurrentUser().userId)
      this.correspondence
        .getMemberListByPPO(this.auth.getCurrentUser().userId)
        .subscribe((data: []) => {
          this.mlaList = data; this.tempmlaList = { ...this.mlaList };
        });
  }
  getTypeByBusiness() {
    switch (this.business) {
      case 'SDG_EG_TIME_ALLOCATION_RESPONSE':
        this.type = 'SDG_EG'
        break;
      case 'BUDGET_TIME_ALLOCATION_AP_BILL_ON_BUDGET_RESPONSE':
        this.type = 'AP_BILL_ON_BUDGET'
        break;
      case 'BUDGET_TIME_ALLOCATION_AP_BILL_ON_SDG_RESPONSE':
        this.type = 'AP_BILL_ON_SDG'
        break;
      case 'BUDGET_TIME_ALLOCATION_AP_BILL_ON_VOA_RESPONSE':
        this.type = 'AP_BILL_ON_VOA'
        break;
      case 'BUDGET_TIME_ALLOCATION_CUT_MOTION_RESPONSE':
        this.type = 'CUT_MOTION'
        break;
      case 'BUDGET_TIME_ALLOCATION_BUDGET_SPEECH_RESPONSE':
        this.type = 'BUDGET_SPEECH'
        break;
      default:
        break;
    }
    this.getDayAndDates();
  }
  getDayAndDates() {
    this.correspondence.getDayAndDates(this.correspondenceFormGrp.value.fileId, this.currentBuinessType, this.type).subscribe((res: any) => {
      if (res) {
        this.getDateList = res;
        this.timeAllocation['days'] = Object.keys(res);
        this.timeAllocation['dates'] = Object.values(res);
      }
    });
  }
  getTimeByUserId() {
    this.correspondence.getTimeByUserId(this.correspondenceFormGrp.value.businessReferId, this.currentBuinessType).subscribe((timeData: any) => {
      if (timeData) {
        this.timeData = timeData;
      }
    });
  }
  getByFileIdAndDay(dateObj) {
    if (dateObj) {
      this.correspondence.getByFileIdAndDay(dateObj.key, this.correspondenceFormGrp.value.fileId, this.currentBuinessType, this.type).subscribe((res: any) => {
        if (res) { this.patchFormValues(dateObj.key, res); }
      });
    }
  }
  formvalidation() {
    this.timeAllcForm = this.fb.group({
      timeAllocatedMasterId: [null],
      timeAllocatedDay: [null, [Validators.required]],
      members: this.fb.array([]),
    });
    this.addMemForm = this.fb.group({
      memberDto: [null, [Validators.required]],
      time: [null, [Validators.required]]
    });
  }
  patchFormValues(selDay, timeConf) {
    this.timeAllcForm.patchValue({
      timeAllocatedMasterId: timeConf.timeAllocatedMasterId,
      timeAllocatedDate: timeConf.timeAllocatedDate
    });
    this.clearMemberData();
    this.buildFinaleBusinessData(false);
  }
  addMembers() {
    if (this.addMemForm.valid) {
      let memDta = this.addMemForm.value;
      let calTime = this.timeAllocation['allocateTime'] + memDta.time
      if (calTime > this.timeAllocation['totalTime']) {
        this.notify.warning('Warning.', 'Allocated Time Cannot Exceed TotalTime');
        return;
      }
      let fg = this.fb.group({
        id: [null],
        delete: [false],
        memberId: [memDta.memberDto ? memDta.memberDto.userId : null],
        memberName: [memDta.memberDto && memDta.memberDto.details ? memDta.memberDto.details.fullName : null],
        partyId: [memDta.memberDto && memDta.memberDto.details ? memDta.memberDto.details.keralaPolicticalPartyid : null],
        time: [memDta ? memDta.time : null]
      });
      (<FormArray>this.timeAllcForm.get("members")).push(fg);
      this.clearaddMemForm();
      this.buildFinaleBusinessData(true);
    } else {
      for (const i in this.addMemForm.controls) {
        this.addMemForm.controls[i].markAsDirty();
        this.addMemForm.controls[i].updateValueAndValidity();
      }
    }
  }
  get getMemberData() {
    const controls = this.timeAllcForm.get("members") as FormArray;
    return controls;
  }
  deleteMember(member, index) {
    let control = <FormArray>this.timeAllcForm.controls.members;
    control.removeAt(index);
    this.showTime();
  }
  onBack() { }
  save() { }
  submit() { }
  shownewMemberPopup() {
    this.showAddMmemModal = true
  }
  clearaddMemForm() {
    this.showAddMmemModal = false;
    this.addMemForm.reset();
  }
  buildFinaleBusinessData(isnewlyAdded) {
    this.isnewlyAdded = isnewlyAdded;
    if (this.timeAllcForm.value) {
      let index = this.timeAllcForm.value.timeAllocatedDay && this.timeAllcForm.value.timeAllocatedDay.key ? this.timeAllcForm.value.timeAllocatedDay.key - 1 : null;
      if (typeof this.finalbusinessData[index] === 'undefined') { // clearing member data on change
        this.clearMemberData();
      }
      if (this.finalbusinessData[index] && this.finalbusinessData[index].members.length > 0 && !this.isnewlyAdded) {
        this.timeAllcForm.value.members = this.finalbusinessData[index].members
      }
      this.finalbusinessData[index] = { ...this.timeAllcForm.value };
      this.emitBusinessData.emit(this.finalbusinessData);
      this.showTime();
    }
  }
  showTime() {
    this.timeAllocation['totalTime'] = 0;
    this.timeAllocation['allocateTime'] = 0;
    this.timeAllocation['unallocateTime'] = 0;
    this.handleMemberlist();
  }
  handleMemberlist() {
    let self = this;
    if (this.finalbusinessData && this.finalbusinessData.length > 0) {
      self.finalbusinessData.forEach((businessDto, index) => {
        if (this.timeAllcForm.value.timeAllocatedDay.key === businessDto.timeAllocatedDay.key) {
          businessDto.totalTime =
            this.timeAllocation['totalTime'] = this.timeAllocation['unallocateTime'] = this.timeData[businessDto.timeAllocatedDay.key];
          businessDto.allocateTime = 0;
          businessDto.members.forEach(mem => {
            businessDto.allocateTime = this.timeAllocation['allocateTime'] = businessDto.allocateTime + mem.time;
            businessDto.unallocateTime = this.timeAllocation['unallocateTime'] = this.timeAllocation['totalTime'] - businessDto.allocateTime;
            self.mlaList = Object.values(self.tempmlaList).filter(user => user.userId !== mem.memberId);
          });
          if (businessDto.members.length > 0 && !this.isnewlyAdded) {
            this.clearMemberData();
            this.pathMemberData(businessDto.members);
          }
        }
      });
    }
  }
  pathMemberData(membersDto) {
    const controls = this.timeAllcForm.controls.members as FormArray;
    membersDto.forEach((x) => {
      controls.push(
        this.fb.group({
          id: x.id,
          delete: x.delete,
          memberId: [x.memberId ? x.memberId : null],
          memberName: [x.memberName ? x.memberName : null],
          partyId: [x.partyId ? x.partyId : null],
          time: [x.time ? x.time : null]
        })
      );
    });
  }
  clearMemberData() {
    this.timeAllcForm.value.members = [];
    const control = <FormArray>this.timeAllcForm.controls['members'];
    for (let i = control.length - 1; i >= 0; i--) {
      control.removeAt(i)
    }
  }
}
