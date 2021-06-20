import { Component, OnInit, ViewChild, Inject, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { differenceInCalendarDays } from 'date-fns';
import { forkJoin } from 'rxjs';
import { BudgetSpeechService } from '../../shared/services/budget-speech.service';
import { BudgetCommonService } from '../../shared/services/budgetcommon.service';
import { FileServiceService } from '../../shared/services/file-service.service';
import { Router, ActivatedRoute } from "@angular/router";
import { StmtDemandsGrantsService } from '../../shared/services/stmt-demands-grants.service';
import { NzNotificationService } from 'ng-zorro-antd';
import { SdgEgService } from '../../shared/services/sdg-eg.service'
@Component({
  selector: 'budget-timeallocation-ts',
  templateUrl: './timeallocation-ts.component.html',
  styleUrls: ['./timeallocation-ts.component.css']
})
export class TimeallocationTsComponent implements OnInit {
  @Input() isFileView = false;
  @Input() type = '';
  @Input() masterId = null;
  assemblySessionObj = {
    session: [],
    currentSession: '',
  };
  currentAssemblySession: any;
  visible = false;
  today = new Date();
  memberList: any = [];
  timeAllocationForm: FormGroup;
  getDateList: any;
  timeAllocationList: any = [];
  showPopup = false;
  dateTime = '';
  addPopup = {
    member: null,
    timeAlloted: null,
    party: null
  };
  canSetToLOB = false;
  timeObj = { dataList: [], typeArr: [], masterObj: '', type: null, selectLbl: 'Select SDFG/VOA', billtype: null };
  TAMaterIds = [];
  constructor(private fb: FormBuilder,
    public common: BudgetCommonService,
    private budgetSpeech: BudgetSpeechService,
    private router: Router,
    private route: ActivatedRoute,
    private file: FileServiceService,
    private sdfg: StmtDemandsGrantsService,
    private notify: NzNotificationService,
    @Inject('authService') public auth,
    private SdgEgService: SdgEgService
  ) {
  }
  ngOnInit() {
    if (this.isFileView) {
      this.timeObj.type = this.type;
    }
    this.buildForm();
    this.getCurrentAssemblySession();
  }
  getCurrentAssemblySession() {
    this.common.getCurrentAssemblyAndSession().subscribe(res => {
      this.currentAssemblySession = res;
      this.loadTypes();
    });
  }
  loadTypes() {
    this.timeObj.typeArr = [
      { value: 'BUDGET_SPEECH', label: 'Budget Speech' },
      { value: 'CUT_MOTION', label: 'SDFG/VOA' },
      { value: 'SDG_EG', label: 'SDG EG' },
      { value: 'AP_BILL_ON_BUDGET', label: 'AP Bill On Budget' },
      { value: 'AP_BILL_ON_VOA', label: 'AP Bill On VOA' },
      { value: 'AP_BILL_ON_SDG', label: 'AP Bill On SDG' }];
    if (this.masterId && this.isFileView) {
      this.showDropdown();
    }
  }
  showDropdown() {
    this.timeObj.dataList = [];
    this.timeObj.masterObj =  null;
    this.canSetToLOB = false;
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
      default:
        break;
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
  redirectOnType() {
    if (this.timeObj.type == 'SDG_EG') {
      this.timeObj.selectLbl = 'Select SDG /EG'
      this.getPublishedSDGEG();
    } else {
      this.timeObj.type = 'CUT_MOTION'
      this.getAllPublishedSDFG();
    }
  }
  getAssemblySession() {
    forkJoin(
      this.common.getAllAssembly(),
      this.common.getAllSession()
    ).subscribe(([assembly, session]) => {
      // this.assemblySessionObj.assembly = assembly as Array<any>;
      this.assemblySessionObj.session = session as Array<any>;
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
      }));
      if (this.masterId && this.isFileView) {
        this.setMasterObj();
      }
    });
  }
  setMasterObj() {
    this.timeObj.masterObj = this.timeObj.dataList.find(element => element.masterId == this.masterId);
    this.getTABySdfgId();
  }
  disabledDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, this.today) < 0;
  }
  onBack() {
    window.history.back();
  }
  save() { }
  submit() { }
  drawer() {
    this.visible = !this.visible;
  }
  deleteMember(party, memberId) {
    const removeId = this.timeAllocationForm.value.partyArray.find(x =>
      x.partyName === party.partyName).memberList.map(y => y.id).indexOf(memberId);
    this.timeAllocationForm.value.partyArray.find(x =>
      x.partyName === party.partyName).memberList.splice(removeId, 1);
  }
  hidePopup() {
    this.showPopup = false;
    this.addPopup = {
      member: null,
      timeAlloted: null,
      party: null
    };
  }
  buildForm() {
    this.timeAllocationForm = this.fb.group({
      timeAllocatedDay: [null],
      partyArray: this.fb.array([])
    });
  }
  getTABySdfgId() {
    if (this.timeObj.masterObj) {
      this.getDayDateList();
    }
  }
  getDayDateList() {
    this.budgetSpeech.getDayAndDates(this.findFileId(), this.timeObj.type).subscribe((res: any) => {
      this.getDateList = res;
      this.getTimeAllocationMember();
    });
  }
  getTimeAllocation(dateObj) {
    if (dateObj) {
      this.budgetSpeech.getTimeByFileIdAndDay(dateObj.key, this.findFileId(), this.timeObj.type).subscribe((res: any) => {
        if (res.memberAllocationDTO) {
          this.timeAllocationList = this.rebuildResponse(res.memberAllocationDTO);
          this.setFormValues();
        }
      });
    }
  }
  getTimeAllocationMember() {
    this.canSetToLOB = false;
    if(this.timeObj.masterObj && this.timeObj.masterObj['masterId']) {
      this.budgetSpeech.getTimeAllocationMember(this.timeObj.masterObj['masterId']).subscribe((res: any) => {
        if(res && res.length > 3) {
          this.notify.create('warning', 'Warning', 'Wrong Data Found!!');
          return;
        }
        if(res[0].status === 'APPROVED') {
          this.canSetToLOB = true;
        }
        this.TAMaterIds = res.map(value => value.id);
      });
    }
  }
  rebuildResponse(res) {
    if (!res || res.length === 0) {
      return [];
    }
    let newArr = [];
    res = [...new Map(res.map(item =>
      [item['partyId'], item])).values()];
    res.forEach(el2 => {
      let newObj = {};
      if (el2.memberDTO && el2.memberDTO.length > 0) {
        newObj['partyName'] = el2.partyName;
        newObj['timeAllocated'] = el2.timeAllocated;
        newObj['timeAllocatedInMinutes'] = el2.totalTime;
        newObj['allocatedTimeForMembers'] = this.findAllocatedTimeForMem(el2.memberDTO);
        newObj['unAllocatedtime'] = parseInt(newObj['timeAllocatedInMinutes']) - parseInt(newObj['allocatedTimeForMembers']);
        newObj['memberList'] = el2.memberDTO;
        newArr.push(newObj);
      }
    });
    return newArr;
  }
  findAllocatedTimeForMem(memberDTOList) {
    let memTime = 0;
    let timeArray = memberDTOList.map(value => value.time);
    timeArray.forEach(time => {
      memTime = memTime + time;
    });
    return memTime;
  }
  setFormValues() {
    const control = <FormArray>this.timeAllocationForm.controls['partyArray'];
    for (let i = control.length - 1; i >= 0; i--) {
      control.removeAt(i)
    }
    const controls = this.timeAllocationForm.controls.partyArray as FormArray;
    this.timeAllocationList.forEach((x) => {
      controls.push(
        this.fb.group({
          totalTime: x.totalTime,
          side: x.side,
          partyName: x.partyName,
          timeAllocated: x.timeAllocated,
          timeAllocatedInMinutes: x.timeAllocatedInMinutes,
          unAllocatedtime: x.unAllocatedtime,
          allocatedTimeForMembers: x.allocatedTimeForMembers,
          memberList: [x.memberList]
        })
      );
    });
  }
  get getPartyData() {
    const controls = this.timeAllocationForm.get('partyArray') as FormArray;
    return controls;
  }
  addMember() {
    this.timeAllocationForm.value.partyArray.find(x =>
      x.partyName === this.addPopup.party.partyName).memberList.push({
        id: this.addPopup.member.id,
        title: this.addPopup.member.title,
        allotedTime: this.addPopup.timeAlloted
      });
    this.hidePopup();
  }
  compareFn = (o1: any, o2: any) => (o1 && o2 ? o1.value === o2.value : o1 === o2);

  submitTimeAllocation() {
    let activeSubtype = this.getActiveSubtype();
    let reqParam = this._buildReqForTimeAllocation(activeSubtype);
    this.file.attachToFile(reqParam).subscribe((res: any) => {
      this.router.navigate(['/business-dashboard/budgets/file-view/', this.findFileId()]);
    });
  }
  _buildReqForTimeAllocation(activeSubtype) {
    return ({
      "fileForm": {
        "fileId": this.findFileId(),
        "activeSubTypes": [activeSubtype],
        "type": "BUDGET",
        "userId": this.auth.getCurrentUser().userId
      }
    });
  }
  getActiveSubtype() {
    let subtype;
    switch (this.timeObj.type) {
      case 'BUDGET_SPEECH':
        subtype = 'BUDGET_TIME_ALLOCATION_BUDGET_SPEECH_RESPONSE'
        break;
      case 'CUT_MOTION':
        subtype = 'BUDGET_TIME_ALLOCATION_CUT_MOTION_RESPONSE'
        break;
      case 'SDG_EG':
        subtype = 'BUDGET_TIME_ALLOCATION_SDG_EG_RESPONSE'
        break;
      case 'AP_BILL_ON_BUDGET':
        subtype = 'BUDGET_TIME_ALLOCATION_AP_BILL_ON_BUDGET_RESPONSE'
        break;
      case 'AP_BILL_ON_VOA':
        subtype = 'BUDGET_TIME_ALLOCATION_AP_BILL_ON_VOA_RESPONSE'
        break;
      case 'AP_BILL_ON_SDG':
        subtype = 'BUDGET_TIME_ALLOCATION_AP_BILL_ON_SDG_RESPONSE'
        break;
      default:
        break;
    }
    return subtype;
  }
  findFileId() {
    if (this.timeObj.masterObj) {
      if (this.timeObj.masterObj['fileId']) {
        return this.timeObj.masterObj['fileId']
      }
    }
  }
  removeUnderScore(element) {
    return element.replace(/_/g, " ");
  }
  setTAToLOB() {
    if (this.TAMaterIds.length > 0) {
      this.budgetSpeech.setTAToLOB({ fileId: this.findFileId(), masterIds: this.TAMaterIds }).subscribe((Res) => {
        this.notify.success('Success', 'Added To LOB');
        this.canSetToLOB = false;
      });
    }
  }
}
