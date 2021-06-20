import { Component, OnInit, Input, OnChanges, SimpleChanges, Inject, Output, EventEmitter } from '@angular/core';
import { BillNoticeService } from '../../shared/services/bill-notice.service';
import { DatePipe } from '@angular/common';
import { NzNotificationService } from 'ng-zorro-antd';
@Component({
  selector: 'lib-create-notice',
  templateUrl: './create-notice.component.html',
  styleUrls: ['./create-notice.component.css']
})
export class CreateBillNoticeComponent implements OnInit, OnChanges  {
@Input() noticeType;
@Input() billDetails;
@Output() closeNotice = new EventEmitter<string>();
noticeView = null;
content = null;
htmlContent = null;
memberDetail = null;
memberList = [];
place;
  constructor(private service: BillNoticeService, @Inject('authService') private auth,
              private notify: NzNotificationService) { }

  ngOnInit() {
    this.getNoticeTemplate();
    this.content = null;
    this.setBillContent();
    this.getMemberList(this.noticeType);
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      if (changes.noticeType.currentValue !== changes.noticeType.previousValue) {
        this.getNoticeTemplate();
        this.setBillContent();
      }
    }
    this.getMemberList(this.noticeType);
  }
  getNoticeTemplate() {
    this.service.loadNoticeTemplate().subscribe(data => {
      this.noticeView = data;
      this.processNoticeView();
    });
  }
  setBillContent() {
    if (this.noticeType === 'ordinance') {
      const staticContent = `<p style="line-height: 1.3">സർ,
      ഭരണഘടനയുടെ  213 -ആം അനുച്ഛേദം (2)-ആം ഖണ്ഡം (എ) ഉപഖണ്ഡമനുസരിച്ചു താഴെ പറയുന്ന പ്രമേയം സഭയിൽ അവതരിപ്പിക്കാൻ അനുവദിക്കണമെന്ന് അഭ്യർത്ഥിക്കുന്നു.[title] നിരാകരിക്കണമെന്ന പ്രമേയം ഞാൻ അവതരിപ്പിക്കുന്നു.</p>`;
      this.content = staticContent.replace('[title]', this.billDetails.blocks[0].content);
    } else {
      this.content = '';
    }
  }
  processNoticeView() {
    let htmlContent = this.noticeView.replace('[NoticeType]', this.service.getNoticeNameByType(this.noticeType, this.billDetails));
    if (this.content == null) {
      this.content = '';
    }
    htmlContent = htmlContent.replace('[Matter]', this.content);
    htmlContent = htmlContent.split('[MLA]').join(this.getMlaName());
    htmlContent = htmlContent.split('[Constituency]').join('');
    htmlContent = htmlContent.replace('[Date]', new DatePipe('en-US').transform(new Date(), 'dd-MM-yyyy'));
    htmlContent = htmlContent.replace('[Place]', this.place || '');
    this.htmlContent = htmlContent;
  }
  getMlaName() {
    if (this.isPPO()) {
      if (this.memberDetail) {
        return this.memberDetail.details.malayalamFullName;
      }
      return '';
    } else {
      return this.auth.getCurrentUser().malayalamFullName;
    }
  }
  isPPO() {
    return this.auth.getCurrentUser().authorities.includes("ppo") || this.auth.getCurrentUser().authorities.includes("parliamentaryPartySecretary");
  }
  checkForPpo() {
    if (this.isPPO()) {
      if (this.memberDetail) {
        return false;
      }
      return true;
    } else {
      return false;
    }
  }
  submitNotice() {
    let memberId = null;
    if (this.isPPO()) {
      memberId = this.memberDetail.userId;
    } else {
      memberId = this.auth.getCurrentUser().userId;
    }
    if (this.noticeType === 'objection') {
      const body = {
        content: this.htmlContent,
        memberId,
        billId: this.billDetails.id
      };
      this.service.submitObjectIntrodution(body).subscribe(data => {
        this.notify.success('Success', 'Notice submitted successfully');
        this.memberDetail = null;
        this.content = null;
        this.place = null;
        this.closeNoticepopup(this.noticeType);
      });
    }
    if (this.noticeType === 'ordinance') {
      const body = {
        content: this.htmlContent,
        memberId,
        billId: this.billDetails.id
      };
      this.service.submitOrdinanceDisapproval(body).subscribe(data => {
        this.notify.success('Success', 'Notice submitted successfully');
        this.memberDetail = null;
        this.content = null;
        this.place = null;
        this.closeNoticepopup(this.noticeType);
    
      });
    }
  }
  closeNoticepopup(noticeType) {
    this.closeNotice.emit(noticeType);
    this.htmlContent = this.noticeView;
    this.setBillContent();
    this.processNoticeView();
    this.getMemberList(noticeType);
  }
  getMemberList(noticeType) {
    if (this.isPPO()) {
      this.service.getMemberByPpo(this.billDetails.id, noticeType).subscribe(data => {
        this.memberList = data;
      });
    }
  }
}
