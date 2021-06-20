import { Component, Inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommitteecommonService } from '../../shared/services/committeecommon.service';
import { CommitteeService } from "../../shared/services/committee.service";

@Component({
  selector: 'committee-meeting-notice',
  templateUrl: './meeting-notice.component.html',
  styleUrls: ['./meeting-notice.component.css']
})
export class MeetingNoticeComponent implements OnInit {
@Input() noticeDetails;
@Input() userDetails;
@Input() meetingId;
memberCodes = [];
user;
letterContent;
  constructor(
    private router: Router, private committeeCommonService: CommitteecommonService,
    private committeeService: CommitteeService, @Inject("authService") private auth,
  ) { 
    this.user = auth.getCurrentUser();
  }
  ngOnInit() {
    if (this.noticeDetails) {
      // tslint:disable-next-line: prefer-for-of
      for (let index = 0; index < this.noticeDetails.length; index++) {
        if (this.noticeDetails[index].correspondenceId) {
          this.getCorrespondenceById(this.noticeDetails[index].correspondenceId,index);
        }
        if (this.noticeDetails[index].correspondenceId == null) {
          this.getMemberCodes(index,this.noticeDetails[index].committee.id);
        }
      }
    }
  }
 getCorrespondenceById(id,index){
    if(id){
      this.committeeCommonService
      .getCorrespondenceById(id, this.user.correspondenceCode.code)
      .subscribe((Res:any) => {
        this.noticeDetails[index].letterContent = Res.data;
      });
      }
  }
draftCorrespondence(notice){
  this.router.navigate(
    ["business-dashboard/correspondence/select-template"],
    {
      state: {
        business: "COMMITTEE_MEETING_NOTICE",
        type: "COMMITTEE",
        fileId: notice.fileId,
        businessReferId: notice.id,
        businessReferType: "COMMITTEE",
        businessReferSubType: "COMMITTEE_MEETING",
        businessReferNumber: null,
        businessReferName: null,
        fileNumber: notice.fileNumber,
        departmentId: null,
        masterLetter: null,
        refrenceLetter: null,
        toCode: notice.memberCodes,
        toDisplayName: notice.memberCodes,
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
getMemberCodes(index,commiteeId){
    let type = 'member';
    this.noticeDetails[index].memberCodes = [];
    let memberList = [];
    this.committeeService
    .getCodesOfMeetingNoticeRecepients(this.meetingId,commiteeId)
    .subscribe((Res:any) => {
      memberList = Res;
      // memberList = memberList.filter(x=> x.role =='MEMBER')
      memberList.forEach(element => {
        this.noticeDetails[index].memberCodes.push(element)
      });
    });
}
}
