import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { PmbrResolutionService } from '../shared/services/pmbr-resolution.service';
import { Location } from '@angular/common';
import { InoticeDetails } from '../../pmbr-bill/shared/models/pmbr-bill-model';
@Component({
  selector: 'pmbr-create-resolution',
  templateUrl: './create-resolution.component.html',
  styleUrls: ['./create-resolution.component.css']
})
export class CreateResolutionComponent implements OnInit {
  resolutionId: any;
  resolutionDetails;
  currentUser;
  showHideResolutionMetaData = false;
  noticeDetails: InoticeDetails;
  showHideCreateNotice = false;
  title: string;
  constructor(private route: ActivatedRoute, private resolutionService: PmbrResolutionService,
    private notification: NzNotificationService, @Inject("authService") private AuthService, private router: Router, private _location: Location) {
    if (this.route.snapshot.params["id"]) {
      this.resolutionId = this.route.snapshot.params["id"];
      this.currentUser = AuthService.getCurrentUser();
      this.getResolutionDetailsByID(this.resolutionId)
    }
  }

  ngOnInit() {
  }

  //get bill details by id
  getResolutionDetailsByID(resolutionId) {
    this.resolutionService.getResolutionById(resolutionId).subscribe((res) => {
      this.resolutionDetails = res;
    });
  }

  //is block create
  IsBlockCreate(event) {
    if (event) {
      this.getResolutionDetailsByID(this.resolutionId)
    }
  }

  hidePopUp() {
    this.showHideResolutionMetaData = false;
    this.showHideCreateNotice = false;
  }

  updateOrCancelResolutionMetaData(res) {
    if (res) {
      this.notification.success('Success', 'Resolution updated succesfully..');
      this.getResolutionDetailsByID(this.resolutionId)
    }
    this.hidePopUp();
  }

  //submit resolution
  submitResolution() {
    if (this.checkWhetherItsNoticeCreateOrNot()) {
      let body = {
        id: [this.resolutionId],
        actionTaken: this.currentUser.userId,
      };
      this.resolutionService.submitResolution(body).subscribe((res) => {
        this.notification.success("Success", "Succesfully submitted..");
        this.router.navigate(["business-dashboard/pmbr/resolution-list"]);
      });
    }
    else {
      this.notification.warning("Warning", "Please Create Notice..");
    }
  }

  checkWhetherItsNoticeCreateOrNot() {
    if(this.resolutionDetails){
      if(this.resolutionDetails.notices.length !== 0){
        const isNoticeConatain = this.resolutionDetails.notices.some(m => m.noticeType == 'PMR_REQUEST');
        return isNoticeConatain;
      } else { return false;}
    }
  }
  viewResolution() {
    this.router.navigate(["business-dashboard/pmbr/resolution-view", this.resolutionId]);
  }
  back() {
    this._location.back();
  }
  createOrViewNotice(type){
    this.getResolutionDetailsByID(this.resolutionId);
    const noticeDetails = this.resolutionDetails.notices.find(n => n.noticeType == type)
    if(noticeDetails) {
      this.title = "View Notice"
    } else {
      this.title = "Create Notice"
    }
    this.noticeDetails = {
      billId: this.resolutionDetails.id,
      noticeId: noticeDetails ? noticeDetails.id : null,
      noticeType: type,
      billStatus: this.resolutionDetails.status
    }
    this.showHideCreateNotice = true;
  }
  saveNotice(event) {
    if (event) {
      this.getResolutionDetailsByID(this.resolutionId);
      this.notification.success('Success', 'Notice created successfully')
    }
    this.hidePopUp();
  }
}
