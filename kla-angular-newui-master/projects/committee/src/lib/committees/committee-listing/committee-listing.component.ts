import { Component, Inject, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { CommitteeService } from "../../shared/services/committee.service";
import { NzNotificationService, NzModalService } from "ng-zorro-antd";
import { CommitteecommonService } from "../../shared/services/committeecommon.service";
import { FileServiceService } from "../../shared/services/file-service.service";

@Component({
  selector: "lib-committee-listing",
  templateUrl: "./committee-listing.component.html",
  styleUrls: ["./committee-listing.component.css"],
})
export class CommitteeListingComponent implements OnInit {
  activeSession: any;
  committeeList: any = [];
  tempCommitteeList: any = [];
  showPop = false;
  showdissolvebutton = false;
  dissolveResponse;
  committeeDetailId;
  bulletinData: any;
  user: any;
  resubmitFileDetails: any;
  fileStatus: any = null;
  showBulletinPart2Popup = false;
  permissions = {
    createBulletin: false,
  };
  committeeDto;
  searchFilter = "";
  newList: any = [];
  commiteeView = {
    showpop: false,
    id: null,
    memberDetailDto: null,
    category: null,
  };
  category;
  assemblyId;
  constructor(
    public committee: CommitteeService,
    private router: Router,
    private route: ActivatedRoute,
    private notification: NzNotificationService,
    @Inject("authService") private AuthService,
    private modalService: NzModalService,
    private service: CommitteecommonService,
    public fileService: FileServiceService
  ) {
    this.user = AuthService.getCurrentUser();
    this.service.setCommitteePermissions(this.user.rbsPermissions);
  }

  checkboxes = [
    { id: 1, label: "Committee Name", check: true },
    { id: 2, label: "Committee Type", check: true },
    { id: 3, label: "Constituted Date", check: true },
    { id: 5, label: "Status", check: true },
  ];
  filterList() {
    if (this.searchFilter) {
      this.committeeList = this.tempCommitteeList.filter(
        (element) =>
          (element.subjectName &&
            element.subjectName
              .toLowerCase()
              .includes(this.searchFilter.toLowerCase())) ||
          (element.categoryName &&
            element.categoryName
              .toLowerCase()
              .includes(this.searchFilter.toLowerCase())) ||
          (element.dateOfConstitution &&
            element.dateOfConstitution
              .toLowerCase()
              .includes(this.searchFilter.toLowerCase())) ||
          (element.status &&
            element.status
              .toLowerCase()
              .includes(this.searchFilter.toLowerCase()))
      );
    } else {
      this.committeeList = this.tempCommitteeList;
    }
  }

  ngOnInit() {
    this.loadPermissions();
    this.getAssemblySession();
    this.getCategoryBySectionId();
  }
  getAssemblySession() {
    this.service.getAllAssemblyandSession().subscribe((Response: any) => {
      if (Response) {
        this.assemblyId = Response.activeAssemblySession.assemblyId;
      }
    });
  }
  getCategoryBySectionId() {
    this.committee
      .getCategoryBySectionId(this.user.correspondenceCode.id)
      .subscribe((Res) => {
        this.category = Res;
        this.getCommiteeList();
      });
  }
  committeeview(data) {
    if (data) {
      if (
        (data.status == "APPROVED" || data.status == "DISSOLVED") &&
        data.memberFileStatus == "APPROVED"
      ) {
        this.committee.getCommitteeById(data.id).subscribe((Res: any) => {
          this.commiteeView.memberDetailDto = Res;
          this.commiteeView.showpop = true;
          this.commiteeView.id = data.id;
          this.commiteeView.category = data.category.code;
        });
      } else {
        this.notification.warning(
          "Warning",
          "Committee constitution is not completed..."
        );
      }
    }
  }
  closePop() {
    this.commiteeView.showpop = false;
    this.commiteeView.memberDetailDto = null;
    this.commiteeView.id = null;
    this.commiteeView.category = null;
  }
  getCommiteeList() {
    const body = {
      assemblyId: this.assemblyId,
      categoryId: this.category[0].id,
    };
    this.committee.getcommitteeList(body).subscribe((Res) => {
      // this.committee.getcommitteeListBySectionId(this.user.correspondenceCode.id).subscribe(Res => {
      this.committeeList = Res;
      this.tempCommitteeList = this.committeeList;
      console.log(this.committeeList);
    });
  }

  subject_committee(id: any) {
    this.showdissolvebutton = true;
    this.committeeDetailId = id;
    //  console.log(this.committeeDetailId)
  }
  changeCommittee(comm) {
    this.showdissolvebutton = false;
    this.committeeDetailId = null;
    if (comm) {
      if (comm.status === "DISSOLVED") {
        this.notification.warning("Warning", "Committee Already Dissolved");
        return;
      }
      this.showdissolvebutton = true;
      this.committeeDetailId = comm.id;
    }
  }
  dissolve_committee() {
    this.committee
      .dissolve_committee(this.committeeDetailId)
      .subscribe((Res) => {
        this.getCommiteeList();
        this.notification.success(
          "Success",
          "Committee Dissolved Successfully"
        );
        this.showdissolvebutton = false;
        this.committeeDetailId = null;
      });
  }
  cancel() {}

  showLinks(id) {
    this.committeeList.forEach((element) => {
      if (element.id === id) {
        element.viewLinks = true;
      } else {
        element.viewLinks = false;
      }
    });
  }

  hideLinks(id) {
    this.committeeList.forEach((element) => {
      if (element.id === id) {
        element.viewLinks = false;
      }
    });
  }
  getBusinessType(data) {
    let businessType = "SUBJECT_COMMITTEE_BULLETIN";
    if (data.category.code == "SELECT_COMMITTEE") {
      businessType = "SELECT_COMMITTEE_BULLETIN";
    }
    return businessType;
  }
  createBulletinPart2(data) {
    let businessType = this.getBusinessType(data);
    this.bulletinData = {
      businessId: data.id,
      businessType: businessType,
      description: "",
      fileId: data.fileId,
      part: "2",
      title: "",
      type: "COMMITTEE",
      userId: this.user.userId,
      assemblyId: null,
      sessionId: null,
    };
    this.resubmitFileDetails = {
      billId: data.id,
      fileId: data.fileId,
    };
    this.fileService
      .getFileById(data.fileId, this.user.userId)
      .subscribe((res: any) => {
        this.fileStatus = res.fileResponse.status;
        if (this.fileStatus === "APPROVED") {
          this.showBulletinPart2Popup = true;
        } else {
          this.modalService.create({
            nzTitle: "Create Bulletin Part 2",
            nzWidth: "500",
            nzContent:
              "&nbsp;&nbsp;<b>Currently file is under approval flow..Cannot create bulletin now... </b>",
            nzOkText: "OK",
            nzOnOk: () => {},
          });
        }
      });
  }

  cancelBulletin() {
    this.showBulletinPart2Popup = false;
    this.bulletinData = {};
  }

  afterCreateBulletin(event) {
    if (event) {
      this.notification.success("Success", "Bulletin Created.");
      this.getCommiteeList();
      this.resubmitFile();
    }
    this.cancelBulletin();
  }

  resubmitFile() {
    const body = {
      fileForm: {
        fileId: this.resubmitFileDetails.fileId,
        activeSubTypes: ["BULLETIN"],
        type: "BULLETIN",
        userId: this.user.userId,
      },
    };
    this.fileService.reSubmitFile(body).subscribe((Res: any) => {
      this.router.navigate([
        "business-dashboard/committee/file-view/",
        this.resubmitFileDetails.fileId,
      ]);
    });
  }

  loadPermissions() {
    if (this.service.doIHaveAnAccess("CREATE_BULLETIN", "CREATE")) {
      this.permissions.createBulletin = true;
    }
  }
  viewFile(fileId) {
    this.router.navigate(["business-dashboard/committee/file-view/", fileId]);
  }
}
