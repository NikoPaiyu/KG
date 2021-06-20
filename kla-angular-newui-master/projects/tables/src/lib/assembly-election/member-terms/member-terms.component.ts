import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { TablescommonService } from '../../shared/services/tablescommon.service';
import { electedMemeber } from '../shared/model/elected-member.model';
import { AssemblyElectionService } from '../shared/services/assembly-election.service';

@Component({
  selector: 'tables-member-terms',
  templateUrl: './member-terms.component.html',
  styleUrls: ['./member-terms.component.css']
})
export class MemberTermsComponent implements OnInit {
  @Input() electedMember : electedMemeber;
  @Output() onClose = new EventEmitter<any>();
  memberTermObj = null;
  termPopup = false;
  endTermList = [
    // { name: "Deceased", code: "DECEASED" },
    { name: "Suspension", code: "SUSPENSION" },
    { name: "Assembly dissolved", code: "ASSEMBLY_DISSOLVED" },
     {name: "Resign",code : "RESIGN"}
  ];
  user;
  rbsPermission={
    updateTerm: false
  }
  selectedDate=null;
  selectedTerm = null;
  constructor(
    private service: AssemblyElectionService,
    @Inject("authService") private AuthService,
    private notification: NzNotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private commonService :TablescommonService,
  ) {
    this.user = AuthService.getCurrentUser();
    this.commonService.setTablePermissions(this.user.rbsPermissions);
  }
  
  ngOnInit() {
    this.getRBSPermissions()
  }
  getRBSPermissions(){
    if (this.commonService.doIHaveAnAccess('UPDATE_TERM_END', 'UPDATE')) { 
    this.rbsPermission.updateTerm = true;
    }
  } 
  showEndtype(list){
    this.memberTermObj = list;
    this.termPopup= true;
  }
  submitEndtype(){
    let body = [
      {
      endDate: this.selectedDate,
      endType:this.selectedTerm,
      id: this.memberTermObj.id
      }
    ]
    this.service.submitEndtype(body).subscribe(res=>{
     this.onClose.emit(false);
     this.cancel();
     this.notification.create("success","Sucess","")
    });
  }
  cancel(){
    
    this.memberTermObj = null;
    this.termPopup= false;
    this.selectedDate=null;
    this.selectedTerm = null;
  }
}
