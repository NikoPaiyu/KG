import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { PmbrCommonService } from '../../shared/services/pmbr-common.service';

@Component({
  selector: 'pmbr-ballot-file',
  templateUrl: './ballot-file.component.html',
  styleUrls: ['./ballot-file.component.css']
})
export class BallotFileComponent implements OnInit {
  @Input() ballotDetails;
  @Input() fileStatus;
  @Input() ballotDetail;
  ballotResult: any = null;
  memberCodes: any = null;
  @Output() showLetter = new EventEmitter<any>();

  constructor(private pmbrCommonService: PmbrCommonService,
              private router: Router) { }

  ngOnInit() {
  }

  ballotResultById(ballot){
    const body = {
      id: ballot.id
    }
    this.pmbrCommonService.getBallotResultById(body).subscribe((res: any) =>{
      this.ballotResult = res;
      this.getMemberCodes(ballot);
    })
  }

  getMemberCodes(ballot) {
    let memberList
    this.pmbrCommonService.getWonMembers(ballot.id).subscribe( res => {
      if(res) {
        this.memberCodes = res;
      }
      this.draftCorrespondence(ballot);
    });
  }

  draftCorrespondence(ballot) {
    this.router.navigate(
      ["business-dashboard/correspondence/select-template"],
      {
        state: {
          business: "PRIVATE_MEMBER_BILL_WON_LETTER",
          type: "PMBR_SECTION",
          fileId: ballot.fileId,
          businessReferId: ballot.id,
          businessReferType: "PMBR",
          businessReferSubType: "PRIVATE_MEMBER_BILL_WON_LETTER",
          businessReferValue : "Letter to Won Members",
          businessReferNumber: null,
          businessReferName: null,
          fileNumber:  ballot.fileNumber,
          departmentId: null,
          masterLetter: null,
          refrenceLetter: null,
          toCode: this.memberCodes,
          toDisplayName: this.memberCodes.map(x => x.displayName).join(),
          toEditable: false,
          redirectToModule: 'PMBR'
          // onSuccess: "business-dashboard/bill/list-priority-list",
        },
      }
    );
  }

  viewLetter(correspondenceId) {
    this.showLetter.emit(correspondenceId);
  }

}
