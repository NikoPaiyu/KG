import { Component, Inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommitteecommonService } from '../../shared/services/committeecommon.service';
import { CommitteeService } from "../../shared/services/committee.service";
@Component({
  selector: 'committee-meeting-letter',
  templateUrl: './meeting-letter.component.html',
  styleUrls: ['./meeting-letter.component.css']
})
export class MeetingLetterComponent implements OnInit {
  @Input() noticeDetails;
  @Input() userDetails;
  @Input() meetingId;
  memberCodes = [];
  user;
  letterContent;
    constructor(
      private router: Router, private committeeService: CommitteeService,
      private committeeCommonService: CommitteecommonService, 
      @Inject("authService") private auth

    ) { 
      this.user = auth.getCurrentUser();
    }
  
    ngOnInit() {
      if(this.noticeDetails.correspondenceId){
        this.committeeCommonService
        .getCorrespondenceById(this.noticeDetails.correspondenceId, this.user.correspondenceCode.code)
        .subscribe((Res:any) => {
          this.letterContent = Res.data
        });
        }
      if(this.noticeDetails.correspondenceId == null){
        this.getMemberCodes();
      }
    }
  draftCorrespondence(){
    this.router.navigate(
      ["business-dashboard/correspondence/select-template"],
      {
        state: {
          business: "COMMITTEE_MEETING_LETTER",
          type: "COMMITTEE",
          fileId: this.noticeDetails.fileId,
          businessReferId: this.noticeDetails.id,
          businessReferType: "COMMITTEE",
          businessReferSubType: "COMMITTEE_MEETING",
          businessReferNumber: null,
          businessReferName: null,
          fileNumber: this.noticeDetails.fileNumber,
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
      this.committeeService
      .getCodesOfMeetingLetterRecepients(this.meetingId)
      .subscribe((Res:any) => {
        this.memberCodes = Res;
        // this.memberCodes = this.memberCodes.filter((v, i, a) => a.indexOf(v) === i);
        this.memberCodes=this.memberCodes.filter(
          (thing, index, self) =>
            index ===
            self.findIndex((t) => t.id === thing.id));
        this.getLawdeptCode();
      });
  }
  getLawdeptCode(){
    let type = 'DEPARTMENT'
    this.committeeCommonService
    .getAllCode(type)
    .subscribe((Res:any) => {
      let deptCode = Res.filter(x=> x.code=='LAW');
      deptCode.forEach(element => {
        this.memberCodes.push(element);
      });
    });
  }
}
