import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { PmbrCommonService } from 'projects/pmbr/src/lib/shared/services/pmbr-common.service';
import { PmbrResolutionService } from '../../services/pmbr-resolution.service';

@Component({
  selector: 'pmbr-view-lotting-notice',
  templateUrl: './view-lotting-notice.component.html',
  styleUrls: ['./view-lotting-notice.component.css']
})
export class ViewLottingNoticeComponent implements OnInit {

  @Input() noticeId;
  @Output() cancelNoticeView = new EventEmitter<boolean>();
  @Output() noticeSubmitted = new EventEmitter<boolean>();
  noticeData: any;
  user: any;
;
  noticeDetails = {
    htmlContent: 'Loading...',
    subject: 'Loding...'
  }
  memberList : any;

  constructor(private service: PmbrResolutionService,
              private notify: NzNotificationService,
              private router: Router,
              private route: ActivatedRoute,
              private pmbrCommon: PmbrCommonService,
              @Inject("authService") private AuthService,) {
                this.user = AuthService.getCurrentUser();
              }

  ngOnInit() {
    if(this.noticeId> 0) {
      this.getNoticeById(this.noticeId);
    }
  }
  getNoticeById(noticeId) {
    this.service.getNoticeById(noticeId).subscribe((res:any)=> {
      if(res) {
        this.noticeData = res;
        // this.getAllMembers();
        this.memberList = res.members;
        this.noticeDetails.htmlContent = res.description;
        this.noticeDetails.subject = res.subject;
      }
    })
  }
  cancelClick(){
    this.cancelNoticeView.emit(false);
  }
  submitNotice() {
    this.service.submitNotice(this.noticeData).subscribe(res=> {
      if(res) {
        this.notify.success(  "Success","Notice Submitted Succesfully" );
        this.noticeSubmitted.emit(true);
      }
    });
  }
  showAmendments() {
    this.router.navigate(['./resolution-amendment', this.noticeId], {relativeTo: this.route.parent});
  }
    
  isMember() {
    return (this.user.authorities.includes("MLA"));
  }
  isPPO() {
    return (
      this.AuthService.getCurrentUser().authorities.includes('ppo') ||
      this.AuthService.getCurrentUser().authorities.includes(
        'parliamentaryPartySecretary'
      )
    );
  }
  getAllMembers() {
    this.pmbrCommon.getAllMembersList().subscribe((data) => { 
      if(data) {
          this.memberList = data;
          this.memberList= this.memberList.filter(x=> this.noticeData.memberIds.includes(x.userId.toString()));
      }
    });
  }
  isMLA() {
    return this.AuthService.getCurrentUser().authorities.includes('MLA');
  }
}
