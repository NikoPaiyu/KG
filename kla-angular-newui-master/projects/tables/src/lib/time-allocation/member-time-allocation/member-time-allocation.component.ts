import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { differenceInCalendarDays } from 'date-fns';
import { NzNotificationService } from 'ng-zorro-antd';
import { forkJoin } from 'rxjs';
import { FileServiceService } from '../../shared/services/file-service.service';
import { TablescommonService } from '../../shared/services/tablescommon.service';
import { TimeAllocationService } from '../shared/services/time-allocation.service';

@Component({
  selector: 'tables-member-time-allocation',
  templateUrl: './member-time-allocation.component.html',
  styleUrls: ['./member-time-allocation.component.css']
})
export class MemberTimeAllocationComponent implements OnInit {
  @Input() isFileView = false;
  @Input() type = '';
  @Input() businessId = null;
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
  timeObj = { dataList: [], sdfgObj: '', type: 'CUT_MOTION' ,selectLbl : 'Select SDFG/VOA',viewLbl : 'SDFG/VOA'};
  buisnessDetails;
  constructor(private fb: FormBuilder, 
    private file: FileServiceService,
    public common: TablescommonService,
    private notify: NzNotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private timeAllocationService : TimeAllocationService,
    @Inject('authService') public auth,
  ) {
    this.assemblySessionObj.currentSession = this.route.snapshot.params.sessionId;
  }
  ngOnInit() {
   
    this.buildForm();
    this.getCurrentAssemblySession();
    this.getBuisnessDetailsById();
  }
  getCurrentAssemblySession() {
    this.common.getCurrentAssemblyAndSession().subscribe(res => {
      this.currentAssemblySession = res;
     this.getDayDateList()
    });
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
  getDayDateList() {
    this.timeAllocationService.getDayAndDates(this.businessId).subscribe((res: any) => {
      this.getDateList = res;
    });
  }
  getTimeAllocation(dateObj) {
    if (dateObj) {
      this.timeAllocationService.getMemberTimeAllocation(this.businessId,dateObj).subscribe((res: any) => {
        if(res) {
          this.timeAllocationList = this.rebuildResponse(res);
          this.setFormValues();
        }
      });
    }
  }
  getBuisnessDetailsById(){
    this.timeAllocationService.getBuisnessDetailsById(this.businessId).subscribe((res: any) => {
      this.buisnessDetails = res;
    });
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
  
    let reqParam = this._buildReqForTimeAllocation();
    this.file.attachToFile(reqParam).subscribe((res: any) => {
      this.router.navigate(['/business-dashboard/tables/file-view/',res.fileResponse.fileId]);
    });
  }
  _buildReqForTimeAllocation() {
    return ({
      "fileForm": {
        "fileId": this.buisnessDetails.timeAllocationMap[1].fileId,
        "activeSubTypes": ['TABLE_BUSINESS_TIME_ALLOCATION_RESPONSE_FLOW'],
        "type": "TABLE",
        "userId": this.auth.getCurrentUser().userId
      }
    });
  }
}
