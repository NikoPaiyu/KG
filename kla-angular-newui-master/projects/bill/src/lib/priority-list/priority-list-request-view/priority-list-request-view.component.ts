import { Component, Inject, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CosViewComponent } from '../../files/cos-view/cos-view.component';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { BillcommonService } from '../../shared/services/billcommon.service';
import { ProrityListService } from "../../shared/services/prority-list.service";

@Component({
  selector: "lib-priority-list-request-view",
  templateUrl: "./priority-list-request-view.component.html",
  styleUrls: ["./priority-list-request-view.component.scss"],
})
export class PriorityListRequestViewComponent implements OnInit {
  @Input() priorityListRequest;
  permissions = {
    correspondence: false
  };

  reportParams = {
    showPdf : false,
    finalUrl : null
  }
  constructor(private router: Router,
              private modal: NzModalService,
              @Inject('authService') private AuthService,
              private commonService: BillcommonService,
              private priorityListService:ProrityListService,
              private notification: NzNotificationService,) {
      const user = AuthService.getCurrentUser();
      this.commonService.setBillPermissions(user.rbsPermissions);
     }

  ngOnInit() {
    this.getRbsPermissionsinList();
  }

  draftCorrespondence() {
    this.router.navigate(
      ["business-dashboard/correspondence/select-template"],
      {
        state: {
          business: "REQUEST_PRIORITY_LIST",
          type: "LEGISLATION_SECTION",
          fileId: this.priorityListRequest.fileId,
          businessReferId: this.priorityListRequest.id,
          businessReferType: "BILL",
          businessReferSubType: "PRIORITY_LIST_REQUEST",
          businessReferNumber: null,
          businessReferName: null,
          fileNumber: this.priorityListRequest.fileNumber,
          departmentId: null,
          masterLetter: null,
          refrenceLetter: null,
          toCode: "LAW",
          toDisplayName: "Law",
          onSuccess: "business-dashboard/bill/list-priority-list",
        },
      }
    );
  }

  viewCorrespondence(id) {
    this.router.navigate([
      'business-dashboard/correspondence/correspondence',
      'view',
      id,
    ], {
      state: {
        returnUrl: 'business-dashboard/bill/file-view/',
        fileId: this.priorityListRequest.fileId
      }
    });
  }

  viewCOS(list) {
    // this.modal.create({
    //   nzTitle: "COS Preview",
    //   nzContent: CosViewComponent,
    //   nzClosable: true,
    //   nzFooter: null,
    //   nzMaskClosable: false,
    //   nzComponentParams: {
    //     calendarSittingId: id,
    //   }
    // })
    this.priorityListService.getCOSId(list.assemblyId, list.sessionId).subscribe((res: any) => {
      if (res) {
        res.assemblyId = list.assemblyValue
        res.sessionId =  list.sessionValue
        res.reportType = "COSReport";
        res.location = "report.pdf";
        if (res.calendarOfDaysList) {
          this.getPDF(res);
        } else {
          this.reportParams.showPdf = false;
          this.notification.warning("Sorry Report is not Available","");
        }
      }
    });
  }
  getPDF(body){
    var mediaType = "application/pdf";
    this.reportParams.finalUrl = null;
    this.priorityListService.getReport(body).subscribe((response) => {
      if (response) {
        var blob = new Blob([response], { type: mediaType });
        this.reportParams.finalUrl = URL.createObjectURL(blob);
        this.reportParams.showPdf = true;
      } else {
        this.reportParams.showPdf = false;
        this.notification.warning("Sorry Report is not Available","");
      }
    });
  }
  cancelCos(){
    this.reportParams.finalUrl = null;
    this.reportParams.showPdf = null;
  }
  getRbsPermissionsinList() {
    if (this.commonService.doIHaveAnAccess('ATTACH_CORRESPONDENCE', 'CREATE')) {
      this.permissions.correspondence = true;
    }
  }
}
