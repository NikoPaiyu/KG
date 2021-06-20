import { Component, OnInit, Input, ViewEncapsulation, Output, EventEmitter, Inject } from '@angular/core';
import { CommitteeService } from '../../shared/services/committee.service';
import { NzNotificationService } from 'ng-zorro-antd';
import { FileServiceService } from '../../shared/services/file-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'committee-minister-reading',
  templateUrl: './minister-reading.component.html',
  styleUrls: ['./minister-reading.component.scss']
})
export class MinisterReadingComponent implements OnInit {
  today = new Date();
  @Input() memberList: any = [];
  memberId: any = null;
  member: any = null;
  @Input() meetingDetails: any;
  @Input() subAgenda: any;
  parentCommittee: any = null;
  readingContent: any = null;
  @Input() reportDto: any;
  @Output() cancelPopup = new EventEmitter<any>();
  user: any;

  constructor(private committeeService: CommitteeService,
              private notification: NzNotificationService,
              private fileService: FileServiceService,
              private router: Router,
              @Inject('authService') private AuthService) {
                this.user = AuthService.getCurrentUser();
              }

  ngOnInit() {
    if (!this.reportDto.ministerReadingDto) {
      this.filterMemberList();
      this.getParentCommittee();
      this.generateContent();
    } else {
      this.getMinisterReading();
    }
  }

  filterMemberList() {
    this.memberList = this.memberList.filter(x => x.parentCommitttee === true);
    this.memberId = this.memberList.find(x => x.roleCode === 'CHAIRMAN').memberId;
    if (this.memberList.find(x => x.roleCode === 'CHAIRMAN')) {
      this.memberId = this.memberList.find(x => x.roleCode === 'CHAIRMAN').memberId;
      this.member = this.memberList.find(x => x.roleCode === 'CHAIRMAN');
    } else {
      this.memberId = this.memberList[0].memberId;
      this.member = this.memberList[0];
    }
  }

  getParentCommittee() {
    this.parentCommittee = this.meetingDetails.committee.find(x => x.parentCommittee === true);
  }

  generateContent() {
    this.member = this.memberList.find(x => x.memberId === this.memberId);
    const date = this.today.getDate() + '/' + (this.today.getMonth() + 1) + '/' + this.today.getFullYear();
    this.readingContent = '<p style="text-align:right;">തിരുവനന്തപുരം<br/>' +
    date +
    '</p><p style="text-align:left;">' +
    this.member.memberName + ',<br />' +
    this.parentCommittee.subject.description + ',<br/>' +
    this.member.roleName + ',<br />' + this.parentCommittee.subject.code.split('_').join(' ') +
    '.</p><p style="text-align:left;">സർ, <br/>' +
    this.subAgenda.businessTitle + ' ബിൽ സംബന്ധിച്ച ' +
    this.parentCommittee.category.name + ' റിപ്പോർട്ട് സമർപ്പിക്കുന്നു.</p>';
  }

  createMinisterReading() {
    this.fileService
    .getFileById(this.reportDto.fileId, this.user.userId)
    .subscribe((Response: any) => {
      if (Response.fileResponse.status === 'APPROVED') {
        const body = {
          content: this.readingContent,
          id: 0,
          ministerId: this.memberId,
          report: {
            id: this.reportDto.id
          }
        };
        this.committeeService.createMinisterReading(body).subscribe((res: any) => {
          this.resubmitFile(res.id);
          this.notification.success('Success', 'Minister Reading Created..');
          this.cancelPopup.emit();
        });
      } else {
        this.notification.warning(
          'Warning',
          'Report under approval flow. Cannot create now!'
        );
      }
  });
  }

  cancel() {
    this.cancelPopup.emit();
  }

  resubmitFile(id) {
    const fileReqbody = {
      ministerReadingId: id,
      fileForm: {
        activeSubTypes: ['MINISTER_READING'],
        fileId: this.reportDto.fileId,
        subtype: 'MEETING_REPORT',
        type: 'COMMITTEE_MEETING',
        userId: this.user.userId,
      },
    };
    this.fileService
    .reSubmitFile(fileReqbody)
    .subscribe((Res: any) => {
      this.notification.success(
        'Success',
        'Attached to File Successfully'
      );
      this.router.navigate([
        'business-dashboard/committee/file-view/',
        this.reportDto.fileId
      ]);
    });
  }

  getMinisterReading() {
    this.committeeService.getMinisterReadingById(this.reportDto.ministerReadingDto.id).subscribe((res: any) => {
      this.readingContent = res.content;
    });
  }

}
