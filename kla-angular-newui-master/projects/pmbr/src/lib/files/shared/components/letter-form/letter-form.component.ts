import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PmbrCommonService } from 'projects/pmbr/src/lib/shared/services/pmbr-common.service';

@Component({
  selector: 'pmbr-letter-form',
  templateUrl: './letter-form.component.html',
  styleUrls: ['./letter-form.component.css']
})
export class LetterFormComponent implements OnInit {

  @Input() fileDetails;
  memberCodes =[];

  constructor(private router: Router,
    private pmbrCommonService: PmbrCommonService) { }

  ngOnInit() {
    this.getMemberCodes(this.fileDetails.pmbrScheduleLottingResultDTO[0].lottingResultId);
  }
  draftCorrespondence() {
    this.router.navigate(
      ["business-dashboard/correspondence/select-template"],
      {
        state: {
          business: "PRIVATE_MEMBER_BILL_WON_LETTER",
          type: "PMBR_SECTION",
          fileId: this.fileDetails.fileResponse.fileId,
          businessReferId: this.fileDetails.pmbrScheduleDTO.id,
          businessReferType: "PMBR",
          businessReferSubType: "PRIVATE_MEMBER_LETTER_FOR_WON_MEMBERS",
          businessReferValue : "Letter to Won Members",
          businessReferNumber: null,
          businessReferName: null,
          fileNumber:  this.fileDetails.fileResponse.fileNumber,
          departmentId: null,
          masterLetter: null,
          refrenceLetter: null,
          toCode: this.memberCodes,
          toDisplayName: this.memberCodes,
          toEditable: true
          // onSuccess: "business-dashboard/bill/list-priority-list",
        },
      }
    );
  }
  viewCorrespondence(id) {

  }
  getMemberCodes(lottingResultId) {
    let memberList
    this.pmbrCommonService.getWonMembers(lottingResultId).subscribe( res => {
      if(res) {
        memberList.push(res);
        memberList.forEach(element => {
          this.memberCodes.push(element);
        });
      }
    });
  }
}
