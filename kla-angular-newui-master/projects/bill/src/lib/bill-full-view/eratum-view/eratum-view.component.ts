import {
  Component,
  OnInit,
  Input,
  Inject,
  Output,
  EventEmitter,
} from "@angular/core";
import { BillManagementService } from "../../shared/services/bill-management.service";
import { ActivatedRoute, Router } from "@angular/router";
import { BillcommonService } from "../../shared/services/billcommon.service";
import { NzNotificationService } from "ng-zorro-antd";
@Component({
  selector: "app-eratum-view",
  templateUrl: "./eratum-view.component.html",
  styleUrls: ["./eratum-view.component.scss"],
})
export class EratumViewComponent implements OnInit {
  @Output() onCloseErrata = new EventEmitter<any>();
  billId;
  billDetails;
  currentUser;
  @Input() erratadetails;
  @Input() fromEdit;
  rbsPermission = {
    applyErrata: false,
    createBill: true,
  };
  constructor(
    private billService: BillManagementService,
    private route: ActivatedRoute,
    @Inject("authService") private AuthService,
    private notification: NzNotificationService,
    private commonService: BillcommonService,
    private router: Router
  ) {
    this.currentUser = AuthService.getCurrentUser();
    this.commonService.setBillPermissions(this.currentUser.rbsPermissions);
  }

  ngOnInit() {
    this.getRbsPermissionsinList();
    this.setErrataViewBasedonRole();
  }
  getRbsPermissionsinList() {
    if (this.commonService.doIHaveAnAccess("APPLY_ERRATA", "READ")) {
      this.rbsPermission.applyErrata = true;
    }
    if (this.commonService.doIHaveAnAccess("BILLS", "CREATE")) {
      this.rbsPermission.createBill = true;
    }
  }
  isCreator() {
    return (
      this.rbsPermission.createBill &&
      this.currentUser.authorities.includes("Department")
    );
  }
  isApprover() {
    return (
      !this.rbsPermission.createBill &&
      this.currentUser.authorities.includes("Department")
    );
  }
  isSectionOfficer() {
    return this.currentUser.authorities.includes("sectionOfficer");
  }
  isAssistant() {
    return this.currentUser.authorities.includes("assistant");
  }
  isMember() {
    return this.currentUser.authorities.includes("MLA");
  }
  setErrataViewBasedonRole() {
    if (this.isSectionOfficer() || this.isAssistant()) {
      this.erratadetails = this.erratadetails.filter(
        (element) =>
          !(element.status == "SAVED" || element.status == "UNDER_APPROVER")
      );
    } else if (this.isMember() || this.isPPO()) {
      this.erratadetails = this.erratadetails.filter(
        (element) => element.status == "PUBLISHED"
      );
    }
  }
  applyErrata(errataId) {
    this.billService.closeErrata(errataId).subscribe((arg: any) => {
      this.onCloseErrata.emit(false);
      this.notification.create("success", "Errata applied successfully", "");
    });
  }
  // view covering letter
  viewCorrespondance(corresId){
    this.router.navigate(["business-dashboard/correspondence/correspondence", "view", corresId]);
  }
  isPPO() {
    return (
      this.AuthService.getCurrentUser().authorities.includes('ppo') ||
      this.AuthService.getCurrentUser().authorities.includes(
        'parliamentaryPartySecretary'
      )
    );
  }

  publishErratum(erratumId) {
    this.billService.publishErrata(erratumId).subscribe(data => {
      const errataIndex = this.erratadetails.findIndex(x => x.id == erratumId);
      this.erratadetails[errataIndex].status = 'PUBLISHED';
      this.notification.success('Success', 'Erratum published successfully');
    });
  }
}
