import { Component, OnInit, Inject } from "@angular/core";
import { BillManagementService } from "../../shared/services/bill-management.service";
import { ActivatedRoute, Router } from "@angular/router";
import { NzModalService, NzNotificationService } from "ng-zorro-antd";
import { BillcommonService } from "../../shared/services/billcommon.service";
import { FileServiceService } from "../../shared/services/file-service.service";
import { createBillModel } from '../../shared/components/create-bill-content/create-bill-content-model';

@Component({
  selector: "lib-create-bill",
  templateUrl: "./create-bill.component.html",
  styleUrls: ["./create-bill.component.css"],
})
export class CreateBillComponent implements OnInit {
  billId = 0;
  fullScreenMode = false;
  ebitBillDetailsModel = false;
  billDetails;
  currentUser;
  rbsPermission = {
    create: false,
    createFile: false,
    reSubmitFile: false,
  };
  fileCreateModel = false;
  file = {
    subject: "",
    priority: null,
    description: "",
  };
  heading = "Edit Bill";
  selectedIndex = 0;
  constructor(
    @Inject("notify") public notify,
    private billService: BillManagementService,
    private route: ActivatedRoute,
    public modalService: NzModalService,
    private router: Router,
    private notification: NzNotificationService,
    @Inject("authService") private AuthService,
    private commonService: BillcommonService,
    private fileService: FileServiceService
  ) {
    if (this.route.snapshot.params["id"]) {
      this.billId = this.route.snapshot.params["id"];
      this.getBill(this.billId);
      this.currentUser = AuthService.getCurrentUser();
      this.commonService.setBillPermissions(this.currentUser.rbsPermissions);
      this.setHeading();
    }
  }

  ngOnInit() {
    this.getRbsPermissionsinList();
  }
  setHeading() {
    if (
      this.router.getCurrentNavigation() &&
      this.router.getCurrentNavigation().extras &&
      this.router.getCurrentNavigation().extras.state
    ) {
      let purpose = this.router.getCurrentNavigation().extras.state.purpose;
      if (purpose == "create") {
        this.heading = "Create Bill";
      }
    }
  }
  //get bill details by id
  getBill(billId) {
    this.billService.getBillByBillId(billId).subscribe((res) => {
      this.billDetails = res;
      this.stingifyContent();
      if ((this.billDetails.status == 'APPROVED' && this.billDetails.ordinance && !this.billDetails.statementOnRule)) {
        this.selectedIndex = 1;
      }
    });
  }
  //function will call after create bill coontent component trigger
  isBlockCreated(isBlockCreated) {
    if (isBlockCreated) {
      this.getBill(this.billId);
    }
  }
  //finctiom for stringify content
  stingifyContent() {
    this.billDetails.blocks.forEach(el => {
      if (this.isTableRequiredBlock(el.type.code)) {
        const parsedContent = JSON.parse(el.content)
        el.content = parsedContent
      }
      if (el.subBlockDto.length > 0) {
        el.subBlockDto.forEach(elsec => {
          if (this.isTableRequiredBlock(elsec.type.code)) {
            const parsedContent = JSON.parse(elsec.content)
            elsec.content = parsedContent
          }
          if (elsec.subBlockDto.length > 0) {
            elsec.subBlockDto.forEach(elpr => {
              if (this.isTableRequiredBlock(elpr.type.code)) {
                const parsedContent = JSON.parse(elpr.content)
                elpr.content = parsedContent
              }
              if (elpr.subBlockDto.length > 0) {
                elpr.subBlockDto.forEach(eltr => {
                  if (this.isTableRequiredBlock(eltr.type.code)) {
                    const parsedContent = JSON.parse(eltr.content)
                    eltr.content = parsedContent
                  }
                });
              }
            });
          }
        });
      }

    });
  }
  isTableRequiredBlock(typeCode): boolean {
    if (createBillModel.tableRequiredBlock.includes(typeCode)) {
      return true;
    }
    else {
      return false;
    }
  }
  //submit bill
  submitBill() {
    if (this.submitBillValidation()) {
      let body = {
        id: [this.billId],
        actionTaken: this.currentUser.userId,
      };
      this.billService.submitBill(body).subscribe((res) => {
        this.notification.success("Success", "Succesfully submitted..");
        this.router.navigate(["business-dashboard/bill/bills"]);
      });
    }

  }

  submitBillValidation(): boolean {
    const totalBillLength = this.billDetails.blocks.length;
    const a = this.billDetails.blocks[totalBillLength - 1].content;
    if (!this.billDetails.blocks[totalBillLength - 3].content) {
      this.notification.warning('warning', 'Please add Statement of Objects and Reasons')
      return false;
    }
    else if (!this.billDetails.blocks[totalBillLength - 2].content) {
      this.notification.warning('warning', 'Please add Financial Memorandum')
      return false;
    }
    // else if (!this.billDetails.blocks[totalBillLength - 1].content) {
    //   this.notification.warning('warning', 'Please add Memorandum Regarding Delegated Legislation')
    //   return false;
    // }
    else {
      return true
    }
  }
  //approve and send bill
  approveAndSendBill() {
    let body = {
      id: [this.billId],
      actionTaken: this.currentUser.userId,
    };
    this.billService.approveAndSendBill(body).subscribe((res) => {
      this.notification.success("Success", "Approve and send successfully..");
      this.router.navigate(["business-dashboard/bill/bills"]);
    });
  }

  //create File
  createFile() {
    const body = {
      billId: this.billId,
      fileForm: {
        assemblyId: 1,
        currentNumber: null,
        description: this.file.description,
        sessionId: 3,
        status: "saved",
        subject: this.file.subject,
        activeSubTypes: ["BILL"],
        subtype: "BILL",
        type: "BILL",
        userId: this.currentUser.userId,
        priority: this.file.priority,
      },
      priorityMasterId: 0,
    };
    let reqBody = {
      id: [this.billId],
      actionTaken: this.currentUser.userId,
    };
    this.billService.submitByAssistant(reqBody).subscribe((res: any) => {
      this.billService.createFile(body).subscribe((Res: any) => {
        this.notification.success(
          "Success",
          "File Created with fileNumber " + Res.fileResponse.fileNumber
        );
        this.router.navigate([
          "business-dashboard/bill/file-view",
          "bill",
          Res.fileResponse.fileId,
        ]);
      });
    });
  }

  //this function will trigger after edit bill details success
  afterEditBillDetails() {
    this.getBill(this.billId);
    this.handlePreviewCancel();
  }

  //back
  backToList() {
    this.router.navigate(["business-dashboard/bill/bills"]);
  }

  //to edit bill detials
  editBillDetails() {
    this.ebitBillDetailsModel = true;
  }

  //function to show file model
  showcreateFileModal() {
    this.fileCreateModel = true;
  }

  //hide modal
  handlePreviewCancel() {
    this.ebitBillDetailsModel = false;
    this.fileCreateModel = false;
  }

  //rbs role checking
  getRbsPermissionsinList() {
    if (this.commonService.doIHaveAnAccess("BILLS", "CREATE")) {
      this.rbsPermission.create = true;
    }
    if (this.commonService.doIHaveAnAccess("FILE", "CREATE")) {
      this.rbsPermission.createFile = true;
    }
    if (this.commonService.doIHaveAnAccess("FILE_RESUBMIT", "READ")) {
      this.rbsPermission.reSubmitFile = true;
    }
  }
  isCreator() {
    return (
      this.rbsPermission.create &&
      this.currentUser.authorities.includes("Department")
    );
  }
  isApprover() {
    return (
      !this.rbsPermission.create &&
      this.currentUser.authorities.includes("Department")
    );
  }
  isSectionOfficer() {
    return this.currentUser.authorities.includes("sectionOfficer");
  }
  isAssistant() {
    return this.currentUser.authorities.includes("assistant");
  }

  viewBill() {
    if (this.billId) {
      this.router.navigate(["business-dashboard/bill/bill-view", this.billId]);
    }
  }
  afterCloseErrata() {
    this.getBill(this.billId);
  }
  reSubmitBill() {
    const body = {
      billId: this.billId,
      fileForm: {
        fileId: this.billDetails.fileId,
        activeSubTypes: ["BILL"],
        type: "BILL",
        userId: this.currentUser.userId,
      },
      priorityMasterId: 0,
    };
    this.fileService
      .getFileById(this.billDetails.fileId, this.currentUser.userId)
      .subscribe((res: any) => {
        const fileStatus = res.fileResponse.status;
        if (fileStatus === "APPROVED") {
          this.billService.attachErrataToFile(body).subscribe((Res: any) => {
            this.notification.success("Success", "Resubmitted Successfully");
            this.router.navigate([
              "business-dashboard/bill/file-view",
              Res.fileResponse.fileId,
            ]);
          });
        } else {
          this.modalService.create({
            nzTitle: "Resubmit File",
            nzWidth: "500",
            nzContent:
              "&nbsp;&nbsp;<b>Currently file is under approval flow..Cannot resubmit now... </b>",
            nzOkText: "OK",
            nzOnOk: () => { },
          });
        }
      });
  }
}
