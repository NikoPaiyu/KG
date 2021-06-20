import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { differenceInCalendarDays } from 'date-fns';
import { forkJoin } from 'rxjs';
import { TablescommonService } from '../../../shared/services/tablescommon.service';

@Component({
  selector: 'tables-timeallocation-member',
  templateUrl: './timeallocation-member.component.html',
  styleUrls: ['./timeallocation-member.component.css']
})
export class TimeallocationMemberComponent implements OnInit {
  TimeallocationForm: FormGroup;
  assemblySessionObj = {
    session: [],
   currentSession: "",
    };
    visible=false;
    today=new Date();
    memberList:any=[
      {id:1,title:"Hamras"},
      {id:2,title:"rakesh"}
    ];
  constructor(private fb:FormBuilder,public common: TablescommonService) { }

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
  onBack(){

  }
  save(){}
  submit(){}
  drawer() {
    this.visible= !this.visible
  }
  deleteMember() {}
  showMemberPopup(member){}
}
