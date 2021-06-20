import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { differenceInCalendarDays } from 'date-fns';
import { BudgetCommonService } from '../../shared/services/budgetcommon.service';


@Component({
  selector: 'budget-add-members',
  templateUrl: './add-members.component.html',
  styleUrls: ['./add-members.component.css']
})
export class AddMembersComponent implements OnInit {
  timeAllcForm: FormGroup; addMemForm: FormGroup;
  assemblySessionObj = {
    currentsession: '',
    currentsessionVal: '',
  };
  today = new Date();
  showAddMmemModal = false;
  mlaList = [];
  days = ['Day1', 'Day2', 'Day3'];
  constructor(private fb: FormBuilder, public common: BudgetCommonService, @Inject('authService') private auth) { }

  ngOnInit() {
    this.formvalidation();
    this.getAssemblySession();
    this.getPPOMembersList()
  }
  getPPOMembersList() {
    if(this.auth.getCurrentUser().userId)
    this.common
      .getMemberByPpo(this.auth.getCurrentUser().userId)
      .subscribe((data: []) => {
        this.mlaList = data;
      });
  }
  formvalidation() {
    this.timeAllcForm = this.fb.group({
      session: [null],
      date: [null, [Validators.required]],
      allocation: [null, [Validators.required]],
      members: this.fb.array([]),
    });
    this.addMemForm = this.fb.group({
      memberId: [null, [Validators.required]],
      time: [null, [Validators.required]]
    });
  }
  getAssemblySession() {
    this.common.getCurrentAssemblyAndSession().subscribe((active) => {
      this.assemblySessionObj.currentsession = active['sessionId'];
      this.assemblySessionObj.currentsessionVal = active['sessionValue'];
    });
  }
  disabledDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, this.today) < 0;
  }
  addMembers(data) {
    let fg = this.fb.group({
      delete: [false],
      memid: [data ? data.id : null],
      memName: [data ? data.name : null],
      time: [data ? data.time : null]
    });
    (<FormArray>this.timeAllcForm.get("members")).push(fg);
  }
  setMemmbers() {
    const controls = this.timeAllcForm.get("members").value;
    controls.forEach((element) => {
      if (element.userId) {
        this.addMembers(element);
      }
    });
  }
  get getMemberData() {
    const controls = this.timeAllcForm.get("members") as FormArray;
    return controls;
  }
  deleteMember(controls, index) {
    let control = <FormArray>this.timeAllcForm.controls.members;
    control.removeAt(index);
  }
  onBack() { }
  save() { }
  submit() { }
  shownewMemberPopup() {debugger
    this.showAddMmemModal = true
  }
  getAddedData(event) {
    this.addMembers(event);
  }
}
