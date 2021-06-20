import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { PmbrBillService } from '../shared/services/pmbr-bill.service';
import { Location } from '@angular/common';
import { PmbrCommonService } from '../../shared/services/pmbr-common.service';
@Component({
  selector: 'pmbr-bill-full-view',
  templateUrl: './bill-full-view.component.html',
  styleUrls: ['./bill-full-view.component.css']
})
export class BillFullViewComponent implements OnInit {
  billId;
  billDetails: any;
  user: any;
  sendToPMBR;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private notification: NzNotificationService,
    private pmbrCommonService: PmbrCommonService,
    @Inject('authService') private AuthService, private billService: PmbrBillService, private _location: Location) {
    this.user = AuthService.getCurrentUser();
    if (this.user.authorities[0] === 'Department') {
      this.sendToPMBR = true;
    }
    this.billId = this.route.snapshot.params.id;
    if (this.billId > 0) {
      this.getBillDetailsById(this.billId)
    }
  }
  ngOnInit() { }

  getBillDetailsById(billId) {
    this.billService.getBillByBillId(billId).subscribe(res => {
      this.billDetails = res;
    });
  }
  back() {
    this._location.back();
  }
  editBill(billId) {
    this.router.navigate(['business-dashboard/pmbr/create/', billId]);
  }
  backToPmbrSection(billId) {
    this.pmbrCommonService.completevetting(billId).subscribe((Res) => {
      this.notification.success('Success', 'Bill send Successfully');
      this.router.navigate(['business-dashboard/pmbr/file-list']);
    });
  }
  submitBill() {
    if (this.checkWhetherItsNoticeCreateOrNot()) {
      let body = {
        id: [this.billId],
        actionTaken: this.user.userId,
      };
      this.billService.submitBill(body).subscribe((res) => {
        this.notification.success("Success", "Succesfully submitted..");
        this.router.navigate(["business-dashboard/pmbr/bills"]);
      });
    } else {
      if (!this.billDetails.notices.some(m => m.noticeType == 'INTRODUCE_BILL')) {
        this.notification.warning("Warning", "Please Create Notice..");
      }
      else if (!this.billDetails.notices.some(m => m.noticeType == 'PRESENT_IN_ENGLISH')) {
        this.notification.warning("Warning", "Please Create English Notice..");
      }

    }
  }

  checkWhetherItsNoticeCreateOrNot() {
    if (this.billDetails.language == 'MAL') {
      const isNoticeConatain = this.billDetails.notices.some(m => m.noticeType == 'INTRODUCE_BILL');
      return isNoticeConatain;
    }
    else if (this.billDetails.language == 'ENG') {
      return this.billDetails.notices.length == 2
    }
  }
}
