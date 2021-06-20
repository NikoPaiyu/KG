import { Component, Inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PmbrCommonService } from 'projects/pmbr/src/lib/shared/services/pmbr-common.service';

@Component({
  selector: 'pmbr-rejection-letter-form',
  templateUrl: './rejection-letter-form.component.html',
  styleUrls: ['./rejection-letter-form.component.css']
})
export class RejectionLetterFormComponent implements OnInit {

  @Input() fileDetails;
  rejectionLetter;
  memberCode =[];
  letterContent: any;
  user: any;

  constructor(private router: Router,
    private pmbrCommonService: PmbrCommonService,
    @Inject("authService") private auth,) { 
      this.user = auth.getCurrentUser();
    }

  ngOnInit() {
    if(this.fileDetails.letter) {
      this.rejectionLetter = this.fileDetails.letter.find(element => element.businessSubType === 'PRIVATE_MEMBER_BILL_REJECTION_LETTER')
      // if(this.rejectionLetter.correspondenceId){
      // this.pmbrCommonService.getCorrespondenceById(this.rejectionLetter.correspondenceId, this.user.correspondenceCode.code)
      // .subscribe((Res:any) => {
      //   this.letterContent = Res.data
      // });
      // }
    }
    if(this.fileDetails.letter == null){
      this.getMemberCodes(this.fileDetails.bill.id);
    }
  }
  getMemberCodes(billId) {
    let memberList = [];
    this.pmbrCommonService.getBillOwnerById(billId).subscribe( res=> {
      if(res) {
        memberList.push(res);
        memberList.forEach(element => {
        this.memberCode.push(element);
      });
      }
    });
  }
  draftCorrespondence() {
    this.router.navigate(
      ["business-dashboard/correspondence/select-template"],
      {
        state: {
          business: "PRIVATE_MEMBER_BILL_REJECTION_LETTER",
          type: "PMBR_SECTION",
          fileId: this.fileDetails.fileResponse.fileId,
          businessReferId: this.fileDetails.bill.id,
          businessReferType: "PMBR",
          businessReferSubType: "PRIVATE_MEMBER_BILL_REJECTION_LETTER",
          businessReferValue : "Letter to Owner of Bill",
          businessReferNumber: null,
          businessReferName: null,
          fileNumber:  this.fileDetails.fileResponse.fileNumber,
          departmentId: null,
          masterLetter: null,
          refrenceLetter: null,
          toCode: this.memberCode,
          toDisplayName: this.memberCode,
          toEditable: true
          // onSuccess: "business-dashboard/bill/list-priority-list",
        },
      }
    );
  }
  viewCorrespondence(corresId) {
    this.router.navigate([
      'business-dashboard/correspondence/correspondence',
      'view',
      corresId,
    ]);
  }
  doIHaveAnAccess() {
    if(this.pmbrCommonService.doIHaveAnAccess('CORRESPONDENCE', 'CREATE')) {
      return true;
    }
  }
}
