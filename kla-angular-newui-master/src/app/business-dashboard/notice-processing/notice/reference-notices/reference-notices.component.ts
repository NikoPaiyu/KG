import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/shared/services/auth.service';
import { NotificationCustomService } from 'src/app/shared/services/notification.service';
import { NoticeProcessService } from '../../shared/services/notice-process.service';

@Component({
  selector: 'app-reference-notices',
  templateUrl: './reference-notices.component.html',
  styleUrls: ['./reference-notices.component.scss']
})
export class ReferenceNoticesComponent implements OnInit {
  consentsList: any;
  tempConsentsList: any;
  searchParam: string;
  isVisible = false;
  viewContent;
  constructor(
    private auth: AuthService,
    private noticeService: NoticeProcessService,
    private notify: NotificationCustomService,
    private route: Router
  ) {}

  ngOnInit() {
    this.getNoticeList();
  }
  getNoticeList() {
    if (this.route.url.includes('minister')) {
      this.getMinisterCopy();
    }
    if (this.route.url.includes('table')) {
      this.getConsentsList();
    }
  }
  //function to show consents list
  getConsentsList() {
    this.searchParam = "";
    this.noticeService
      .getNoticeTableSectionCopy()
      .subscribe((res) => {
        this.consentsList = res;
        this.tempConsentsList = res;
      });
  }
  getMinisterCopy() {
    this.searchParam = "";
    this.noticeService
      .getNoticeMinisterCopy()
      .subscribe((res) => {
        this.consentsList = res;
        this.tempConsentsList = res;
      });
  }
   //function to accept or reject notice
  giveConsents(data, status) {
    let body = {
      noticeId: data.noticeId,
      userId: this.auth.getCurrentUser().userId,
      status: status,
    };
    this.noticeService.giveConsent(body).subscribe((res: any) => {
      if (res[0].noticeId > 0) {
        this.notify.showSuccess(
          "Success",
          "Consent " + status.toLowerCase() + " succesfully.."
        );
        data.status = status;
        this.getConsentsList();
      } else {
        this.notify.showError("Error", "Oops something went wrong..");
      }
    });
  }
  //function to sort consents list in table
  search() {
    if (this.searchParam) {
      this.consentsList = this.tempConsentsList.filter(
        (element) =>
          element.noticeNumber
            .toLowerCase()
            .includes(this.searchParam.toLowerCase()) ||
          element.title
            .toLowerCase()
            .includes(this.searchParam.toLowerCase()) ||
          element.templateName
            .toLowerCase()
            .includes(this.searchParam.toLowerCase()) ||
          element.createdDate
            .toLowerCase()
            .includes(this.searchParam.toLowerCase()) ||
          element.status.toLowerCase().includes(this.searchParam.toLowerCase())
      );
    } else {
      this.consentsList = this.tempConsentsList;
    }
  }
  // function to preview notice template
  showPreviewModal(noticeData) {
    this.isVisible = true;
    if (noticeData) {
      this.viewContent = noticeData;
    } else {
      this.viewContent = "Nothing to preview";
    }
  }
  handleCancel() {
    this.isVisible = false;
  }
}
