import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { PmbrResolutionService } from '../../services/pmbr-resolution.service';

@Component({
  selector: 'pmbr-lotting-won-resolutionlist',
  templateUrl: './lotting-won-resolutionlist.component.html',
  styleUrls: ['./lotting-won-resolutionlist.component.css']
})
export class LottingWonResolutionlistComponent implements OnInit {
  ownNoticesList: any[];
  tempOwnNoticesList;
  showHideResolutionMetaData = false;
  resolutionLottingResultId
  constructor(private pmbrResolutionServices: PmbrResolutionService, private notification: NzNotificationService, private router: Router) { }

  ngOnInit() {
    this.getOwnNotices();
  }

  //get own notices list
  getOwnNotices() {
    this.pmbrResolutionServices.getOwnNoticesList().subscribe((res: any[]) => {
      this.ownNoticesList = res;
      this.tempOwnNoticesList = res;
    });
  }

  //table filter
  tableFilter(searchText) {
    if (searchText) {
      this.ownNoticesList = this.tempOwnNoticesList.filter(
        (element) =>
          (element.memberName &&
            element.memberName
              .toLowerCase()
              .includes(searchText.toLowerCase())) ||
          (element.presentationDate &&
            element.presentationDate
              .toLowerCase()
              .includes(searchText.toLowerCase())) ||
          (element.noticeSubmissionDate &&
            element.noticeSubmissionDate
              .toLowerCase()
              .includes(searchText.toLowerCase())) ||
          (element.lottingDate &&
            element.lottingDate
              .toLowerCase()
              .includes(searchText.toLowerCase()))
      );
    } else {
      this.ownNoticesList = this.tempOwnNoticesList;
    }
  }

  viewResolutionContent(resolutionId) {
    this.router.navigate(["business-dashboard/pmbr/resolution-view", resolutionId]);
  }

  editResolutionMetaData(resolutionLottingResultId) {
    this.resolutionLottingResultId = resolutionLottingResultId;
    this.showHideResolutionMetaData = true;
  }

  createOrCancelResolutionMetaData(res) {
    if (res) {
      this.notification.success('Success', 'Resolution created succesfully..');
      this.router.navigate(["business-dashboard/pmbr/create-resolution", res.id]);
    }
    this.hidePopUp();
  }
  hidePopUp() {
    this.showHideResolutionMetaData = false;
  }
}
