import { Component, OnInit, Inject, Input } from "@angular/core";
import { DocumentsService } from "../shared/services/documents.service";
import { Router, ActivatedRoute } from "@angular/router";
import { FilesService } from "../shared/services/files.service";
import { CommonService } from "../shared/services/common.service";
import { NzNotificationService } from "ng-zorro-antd";
@Component({
  selector: "cpl-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  @Input() fromMainDash;
  data;
  data1;
  dashboardDetails: any = [];
  assemblyId = 1;
  sessionId = 3;
  detailsSro;
  currentUser;
  userPendingList;
  sectionPendingList: any = [];
  isSection = false;
  registration = false;
  listPrep = false;
  supervisorFileDetails: any = [];
  constructor(
    private commonService: CommonService,
    private docService: DocumentsService,
    private fileService: FilesService,
    private router: Router,
    private notification: NzNotificationService,
    @Inject("authService") private AuthService
  ) {
    this.currentUser = this.AuthService.getCurrentUser();
    this.commonService.getCPLPermissions(this.currentUser.rbsPermissions);
  }

  ngOnInit() {
    this.getDashboard();
    this.pendingListForUsers();
    setTimeout(() => {
      this.getPermissions();
    }, 500);
  }
  getDashboard() {
    if (this.assemblyId && this.sessionId) {
      this.docService
        .getDashboard(this.assemblyId, this.sessionId)
        .subscribe((Res) => {
          this.dashboardDetails = Res;
          this.detailsSro = this.dashboardDetails["SRO"];
        });
    }
  }
  getDashboardSupervisorFileDeails() {
    this.docService.getDashboardSupersorFileDetials(318).subscribe((res) => {
      this.supervisorFileDetails = res;
    });
  }
  pendingListForUsers() {
    let body = {
      userId: this.currentUser.userId,
    };
    this.fileService.pendingFilesForUser(body).subscribe((res) => {
      this.userPendingList = res;
    });
  }
  pendingListForSection() {
    let body = {
      userId: this.currentUser.userId,
    };
    this.fileService.pendingFilesForSection(body).subscribe((res) => {
      this.sectionPendingList = res;
    });
  }
  regpage() {
    this.router.navigate(["business-dashboard/cpl/registration"]);
  }
  docListpage() {
    this.router.navigate(["business-dashboard/cpl/documents-list"]);
  }

  laidList() {
    this.router.navigate(["business-dashboard/cpl/documents-list/laid"]);
  }

  getPermissions() {
    if (this.commonService.doIHaveAnAccess("BUTTONS", "APPROVE")) {
      this.isSection = true;
      this.pendingListForSection();
    }
    if (this.commonService.doIHaveAnAccess("DOCUMENTS", "CREATE")) {
      this.registration = true;
    }
    if (this.commonService.doIHaveAnAccess("LIST PREPARATION", "CREATE")) {
      this.listPrep = true;
    }
  }

  goToFiles(filePriority) {
    this.router.navigate(['/business-dashboard/cpl/files'], {
      state: {priority: filePriority}
    });
  }
}
