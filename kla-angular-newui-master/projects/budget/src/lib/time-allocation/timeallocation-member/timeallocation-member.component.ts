import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { differenceInCalendarDays } from 'date-fns';
import { forkJoin } from 'rxjs';
import { BudgetCommonService } from '../../shared/services/budgetcommon.service';

@Component({
  selector: 'budget-timeallocation-member',
  templateUrl: './timeallocation-member.component.html',
  styleUrls: ['./timeallocation-member.component.css']
})
export class TimeallocationMemberComponent implements OnInit {
  TimeallocationForm: FormGroup;
  assemblySessionObj = {
    session: [],
    currentSession: "",
  };
  visible = false;
  today = new Date();
  memberList: any = [];
  constructor(private fb: FormBuilder, public common: BudgetCommonService) { }

  ngOnInit() {
    this.formvalidation();
    this.getAssemblySession();
  }
  formvalidation() {
    this.TimeallocationForm = this.fb.group({
      session: [null, [Validators.required]],
      Date: [null, [Validators.required]],
      allocation: [null, [Validators.required]],
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

  }
  save() { }
  submit() { }
  drawer() {
    this.visible = !this.visible
  }
  deleteMember() { }
  showMemberPopup(member) { }
}
