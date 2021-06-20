import { Component, OnInit,Inject,Input, EventEmitter, Output } from '@angular/core';
import { PmbrCommonService } from '../../shared/services/pmbr-common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
@Component({
  selector: 'pmbr-ballot-view',
  templateUrl: './ballot-view.component.html',
  styleUrls: ['./ballot-view.component.css']
})
export class BallotViewComponent implements OnInit {
  ballotid;
ballotResult: any = [];
performList: any = [];
user: any;
attachtofileButton;
@Input() ballotId;
@Input() fileStatus;
@Output() showLetter = new EventEmitter<any>();
memberCodes: any = null;
permissions = {
  createLetter: false
};
type = "BILL";
  constructor(private pmbrCommonService: PmbrCommonService,
    private route: ActivatedRoute,
    private router: Router,
    private notification: NzNotificationService,
    @Inject('authService') private AuthService) {
    this.ballotid = this.route.snapshot.params.id;
    this.user = AuthService.getCurrentUser();
    this.pmbrCommonService.setPermissions(this.user.rbsPermissions);
    if (this.user.authorities[0] === 'assistant') {
      this.attachtofileButton = true;
    }
   }
 
  ngOnInit() {
    this.getRbsPermissions();
  //  / this.ballotResultById();
    if (!this.ballotId) {
      this.ballotid = this.route.snapshot.params.id;
      this.ballotResultById();
      
    } else {
      this.ballotid = this.ballotId; 
      this.ballotResultById();
      this.attachtofileButton = false;
    } 
  }
ballotResultById(){
  const body = {
    id: this.ballotid
  }
  this.pmbrCommonService.getBallotResultById(body).subscribe((res: any) =>{
    this.ballotResult = res;
  })
}
resubmitFile(){
  const body = {
    pmbrLottingId: this.ballotResult.id,
fileForm: {
  fileId: this.ballotResult.fileId,
  activeSubTypes: ["PMBR_SCHEDULE_LOTTING_RESULT"],
  type: "PMBR",
  userId: this.user.userId,
  subtype: "PMBR_SCHEDULE_LOTTING_RESULT",  
  pmbrScheduleId: this.ballotResult.pmbrScheduleId    
}

}
  this.pmbrCommonService.attachToFile(body).subscribe((Res: any) => {
    this.notification.success(
      "Success",
      "File Resubmitted Successfully"
    );
    this.router.navigate(['business-dashboard/pmbr/file-view/', Res.fileResponse.fileId]);
  });
}
attachToFile(){
  const body = {
    pmbrLottingId: this.ballotResult.id,
fileForm: {
  fileId: this.ballotResult.fileId,
  activeSubTypes: ["PMBR_SCHEDULE_LOTTING_RESULT"],
  requestedAdditionalSubtype: ["PMBR_SCHEDULE_LOTTING_RESULT"],
  type: "PMBR",
  userId: this.user.userId,
  subtype: "PMBR_SCHEDULE_LOTTING_RESULT",  
  pmbrScheduleId: this.ballotResult.pmbrScheduleId    
}
}
this.pmbrCommonService.attachFile(body).subscribe((Res: any) => {
  this.notification.success(
    "Success",
    "File Attached Successfully"
  );
  this.router.navigate(['business-dashboard/pmbr/file-view/', Res.fileResponse.fileId]);
  // this.router.navigate(['business-dashboard/pmbr/file-view/'], Res.fileResponse.fileId);
});
}
cancel(){
  
}

viewFile() {
  this.router.navigate(['business-dashboard/pmbr/file-view/', this.ballotResult.fileId]);
}

getMemberCodes() {
  this.pmbrCommonService.getWonMembersResolution(this.ballotId, this.type).subscribe( res => {
    if(res) {
      this.memberCodes = res;
    }
    this.draftCorrespondence();
  });
}

draftCorrespondence() {
  this.router.navigate(
    ["business-dashboard/correspondence/select-template"],
    {
      state: {
        business: "PRIVATE_MEMBER_BILL_WON_LETTER",
        type: "PMBR_SECTION",
        fileId: this.ballotResult.fileId,
        businessReferId: this.ballotResult.id,
        businessReferType: "PMBR",
        businessReferSubType: "PRIVATE_MEMBER_BILL_WON_LETTER",
        businessReferValue : "Letter to Won Members",
        businessReferNumber: null,
        businessReferName: null,
        fileNumber:  this.ballotResult.fileNumber,
        departmentId: null,
        masterLetter: null,
        refrenceLetter: null,
        toCode: this.memberCodes,
        toDisplayName: this.memberCodes.map(x => x.displayName).join(),
        toEditable: false,
        redirectToModule: 'PMBR',
        redirectToFile: true
        // onSuccess: "business-dashboard/bill/list-priority-list",
      },
    }
  );
}

viewLetter(correspondenceId) {
  this.showLetter.emit(correspondenceId);
}

getDepartmentCode(billId) {
  this.pmbrCommonService.getBillDepartmentCode(billId).subscribe((res: any) => {
    if (res.code) {
      this.router.navigate(
        ['business-dashboard/correspondence/select-template'],
        {
          state: {
            business: 'PM_BILL_SEND_TO_DEPARTMENT',
            type: 'PMBR_SECTION',
            fileId: this.ballotResult.fileId,
            businessReferId: billId,
            businessReferType: 'PMBR',
            businessReferSubType: 'PM_BILL_SEND_TO_DEPARTMENT',
            businessReferValue : 'Letter to Bill Departent',
            businessReferNumber: null,
            businessReferName: null,
            fileNumber:  this.ballotResult.fileNumber,
            departmentId: null,
            masterLetter: null,
            refrenceLetter: null,
            toCode: res.code,
            toDisplayName: res.departmentName,
            toEditable: false,
            redirectToModule: 'PMBR',
            redirectToFile: true
            // onSuccess: "business-dashboard/bill/list-priority-list",
          },
        }
      );
    } else {
      this.notification.success(
        'Warning',
        'Department Not Found'
      );
    }
  });
}


getRbsPermissions() {
  if (this.pmbrCommonService.doIHaveAnAccess('CORRESPONDENCE', 'CREATE')) {
    this.permissions.createLetter = true;
  }
}

}
