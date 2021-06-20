import { Component, Inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommitteecommonService } from '../../shared/services/committeecommon.service';
import { CommitteeService } from "../../shared/services/committee.service";

@Component({
  selector: 'committee-letterfor-supporting-doc',
  templateUrl: './letterfor-supporting-doc.component.html',
  styleUrls: ['./letterfor-supporting-doc.component.css']
})
export class LetterforSupportingDocComponent implements OnInit {
  @Input() letterDetails;
  @Input() userDetails;
  @Input() meetingId;
  user;
  memberCodes = [];
    constructor(
      private router: Router, private committeeCommonService: CommitteecommonService,
      private committeeService: CommitteeService,@Inject("authService") private auth,
  
    ) { 
      this.user = auth.getCurrentUser();
    }
  
    ngOnInit() {
      if (this.letterDetails) {
        // tslint:disable-next-line: prefer-for-of
        for (let index = 0; index < this.letterDetails.length; index++) {
          if (this.letterDetails[index].correspondenceId) {
            this.getCorrespondenceById(this.letterDetails[index].correspondenceId,index);
          }
          // if (this.noticeDetails[index].correspondenceId == null) {
          //   this.getMemberCodes(index,this.letterDetails[index].committee.id);
          // }
        }
      }
        this.getMemberCodes();
    }
   getCorrespondenceById(id,index){
      if(id){
        this.committeeCommonService
        .getCorrespondenceById(id, this.user.correspondenceCode.code)
        .subscribe((Res:any) => {
          this.letterDetails[index].letterContent = Res.data;
        });
        }
    }  
  draftCorrespondence(letter){
    this.router.navigate(
      ["business-dashboard/correspondence/select-template"],
      {
        state: {
          business: "COMMITTEE_MEETING_SUPPORTING_DOCUMENT_REQUEST",
          type: "COMMITTEE",
          fileId: letter.fileId,
          businessReferId: letter.id,
          businessReferType: "COMMITTEE",
          businessReferSubType: "COMMITTEE_MEETING",
          businessReferNumber: null,
          businessReferName: null,
          fileNumber: letter.fileNumber,
          departmentId: null,
          masterLetter: null,
          refrenceLetter: null,
          toCode: this.memberCodes,
          toDisplayName: this.memberCodes,
          toEditable : true
          // onSuccess: "business-dashboard/bill/list-priority-list",
        },
      }
    );
  }
  viewCorrespondence(id){
    this.router.navigate([
      'business-dashboard/correspondence/correspondence',
      'view',
      id,
    ]);
  }
  getMemberCodes(){
      let type = '';
      let memberList = [];
      this.committeeCommonService
      .getAllCode(type)
      .subscribe((Res:any) => {
        memberList = Res;
        memberList = Res.filter(x=> x.code =='LAW' || x.code =='LEGISLATION_SECTION')
        memberList.forEach(element => {
         this.memberCodes.push(element)
        });
      });
  }
}
