import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PmbrResolutionService } from '../shared/services/pmbr-resolution.service';
import { Location } from '@angular/common';
import { NzNotificationService } from 'ng-zorro-antd';
@Component({
  selector: 'pmbr-resolution-full-view',
  templateUrl: './resolution-full-view.component.html',
  styleUrls: ['./resolution-full-view.component.css'],

})
export class ResolutionFullViewComponent implements OnInit {
  resolutionDetails: any;
  resolutionId: any;
  currentUser
  constructor(private resolutionService: PmbrResolutionService, private route: ActivatedRoute, private _location: Location, private router: Router, private notification: NzNotificationService, @Inject("authService") private AuthService,) {
    this.resolutionId = this.route.snapshot.params.id;
    this.currentUser = AuthService.getCurrentUser();
  }

  ngOnInit() {
    if (this.resolutionId > 0) {
      this.getResolutionDetails(this.resolutionId);
    }
  }

  getResolutionDetails(resolutionId) {
    this.resolutionService.getResolutionById(resolutionId).subscribe(res => {
      this.resolutionDetails = res;
    })
  }

  back() {
    this._location.back();
  }
  editResolution(resoluitonId) {
    this.router.navigate(['business-dashboard/pmbr/create-resolution/', resoluitonId]);
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
    const isNoticeConatain = this.resolutionDetails.notices.some(m => m.noticeType == 'PMR_REQUEST');
    return isNoticeConatain;
  }


}
