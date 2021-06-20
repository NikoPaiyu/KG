import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { differenceInCalendarDays } from 'date-fns';
import { NzNotificationService } from 'ng-zorro-antd';
import { TablescommonService } from '../../shared/services/tablescommon.service';
import { electedMemeber, postions } from '../shared/model/elected-member.model';
import { AssemblyElectionService } from '../shared/services/assembly-election.service';

@Component({
  selector: 'tables-member-position-details',
  templateUrl: './member-position-details.component.html',
  styleUrls: ['./member-position-details.component.css']
})
export class MemberPositionDetailsComponent implements OnInit {
  @Input() electedMember: electedMemeber;
  @Input() partyFronts;
  @Input() memberGroups;
  @Input() memberDesignations;
  @Input() portFolioList;
  @Input() allPortFolioList;
  @Output() onClose = new EventEmitter<any>();

  user;
  currentAssemblySession = null;
  rbsPermission ={
    updatePosition : false
  }
  editMode = false;
  activeStartDate = null;
  constructor(
    private service: AssemblyElectionService,
    @Inject("authService") private AuthService,
    private notification: NzNotificationService,
    private commonService :TablescommonService,
    ) {
      this.user = AuthService.getCurrentUser();
      this.commonService.setTablePermissions(this.user.rbsPermissions);
    }
  isMinister(panel) {
    if ( 
        panel.memberGroup === 'TREASURY_BENCH'
    ) {
       return true;
    }
    return false;
  }

  ngOnInit() {
    if(this.electedMember.postions.length !== 0){
      let currentPos;
      currentPos = this.electedMember.postions.find(x => x.status == 'ACTIVE' )
      if(currentPos){
        this.activeStartDate = new Date(currentPos.startDate);
      }
    }
    this.getCurrentAssemblySession();
    this.getRBSPermissions()
  }
  getCurrentAssemblySession(){
    this.commonService.getCurrentAssemblyAndSession().subscribe((active) => {
      if(active){
        this.currentAssemblySession = active;
      }
    });
  }
  getRBSPermissions(){
    if (this.commonService.doIHaveAnAccess('UPDATE_MEMBER_POSITION', 'UPDATE')) { 
    this.rbsPermission.updatePosition = true;
    }
  } 
  getActivePositions(){
    if(this.electedMember.postions){
    let currentPos = null;
    currentPos = this.electedMember.postions.find(x => x.status == 'ACTIVE' || x.status == 'DRAFT' )
    if(currentPos){
      return true;
    }else{
      return false;
    }
  }else{
    return false;
  }
  }
  addNewPosition(){
   if(this.getActivePositions()){
    this.notification.create("warning","Warning","Please End Current Position")
     return;
   }
   else{
     let newPos = {
      assemblyId: this.currentAssemblySession.assemblyId,
      assemblyValue:  this.currentAssemblySession.assemblyValue,
      designationId: null,
      designation:null,
      id: null,
      memberGroup: null,
      memberGroupDisplay : null,
      partyFrontId: null,
      portfolioId: null,
      partyFront : null,
      startDate: null,
      status: 'DRAFT',
      endDate : null,
      userId: this.electedMember.userId,
      portfolio: null
     };
    //  newPos.status = null;
    //  newPos.id = null;
     this.electedMember.postions.push(newPos);
   }
  }
  savePosition(position){
    if(position.startDate == null || position.memberGroup == null ||
       position.partyFrontId == null || position.designationId == null || 
       (position.memberGroup == 'TREASURY_BENCH' &&  position.portfolioId == null)
     ){
      this.notification.create("warning","Warning","Please Provide all the inputs")
      return;
     }
    this.service.saveMemberPosition(position).subscribe(res=>{
      this.onClose.emit(false);
      this.notification.create("success","Success","Member position successfully saved")
    });
  }
  endPosition(body){
  if(body.endDate == null){
    this.notification.create("warning","Warning","Please Provide End Date")
    return;
  }
  this.service.endMemberPosition(body).subscribe(res=>{
  this.onClose.emit(false);
  this.notification.create("success","Success","Member position successfully ended")
    });
  }
  confrmPosition(body){
    this.service.confrmMemberPosition(body).subscribe(res=>{
      this.onClose.emit(false);
      this.notification.create("success","Success","Member position successfully confirmed")
    });
  }
  canIView(panel){
    if(this.rbsPermission.updatePosition == false){
      return true;
    }
    else if((panel.status== 'ACTIVE' || panel.status== 'COMPLETED')&& this.rbsPermission.updatePosition == true){
      return true;
    }
    else if((panel.status== 'DRAFT')&& this.rbsPermission.updatePosition && panel.id && !this.editMode){
      return true;
    }
    else{
      return false
    }
  }
  canIEdit(panel){
    if(panel.status == 'DRAFT' && this.rbsPermission.updatePosition && panel.id == null){
      return true;
    }
    else if(this.editMode == true){
      return true;
    }
    else{
      false;
    }
  }

  returnPortfolio(id) {
    if (this.allPortFolioList.find(x => x.id === id)) {
      return this.allPortFolioList.find(x => x.id === id).name;
    }
  }
  disabledStartDate = (current: Date): boolean => {
    // Can not select days before today and today
    return differenceInCalendarDays(current,this.activeStartDate) < 0;
  };
  changeMemGroup(event,index){
    this.electedMember.postions[index].designationId = null;
    if(event == 'TREASURY_BENCH'){
      this.electedMember.postions[index].portfolioId = null;
    }
  }
}
