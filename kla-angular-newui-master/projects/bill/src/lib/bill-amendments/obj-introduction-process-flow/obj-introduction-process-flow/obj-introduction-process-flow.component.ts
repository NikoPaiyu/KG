import { Component, Inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NzNotificationService } from "ng-zorro-antd";
import { element } from "protractor";
import { BillManagementService } from "../../../shared/services/bill-management.service";
import { BillcommonService } from "../../../shared/services/billcommon.service";
import { FileServiceService } from "../../../shared/services/file-service.service";
import { BillAmendmentsService } from "../../shared/bill-amendments.service";

@Component({
  selector: "lib-obj-introduction-process-flow",
  templateUrl: "./obj-introduction-process-flow.component.html",
  styleUrls: ["./obj-introduction-process-flow.component.css"],
})
export class ObjIntroductionProcessFlowComponent implements OnInit {
  selectedRole: any;
  currentRole;
  workflowUsers;
  currentPoolUser;
  forwardReturnButton = "Forward";
  htmlContent;
  noticeId;
  user;
  noticeDetails: any;
  billDetails;
  stepStatusDetail;
  assignee;
  forwardAssignee: any;
  forwardAssigneeGroup: any;
  currentUserActionRow;
  fromGroup;
  permissions = {
    approve: false,
    send: false,
  };
  currentUserRole;
  latestNote;
  showSendButton=true;
  constructor(
    private route: ActivatedRoute,
    @Inject("authService") private AuthService,
    private router: Router,
    private billAmendmentsService: BillAmendmentsService,
    private notification: NzNotificationService,
    private billService: BillManagementService,
    private commonService: BillcommonService
  ) {
    this.user = AuthService.getCurrentUser();
    this.currentUserRole = AuthService.getCurrentUser().authorities[0];
  }

  ngOnInit() {
    console.log(this.user);
    this.getRBSPermission();
    this.route.params.subscribe((params) => {
      this.noticeId = params.id;
      if (this.noticeId) {
        this.getNoticeById(this.noticeId);
      }
    });
  }
  getRBSPermission() {
    if (this.commonService.doIHaveAnAccess("OBJECTION_NOTICE", "APPROVE")) {
      this.permissions.approve = true;
    }
    if (this.commonService.doIHaveAnAccess("OBJECTION_NOTICE_SEND", "READ")) {
      this.permissions.send = true;
    }
  }
  getNoticeById(noticeId) {
    this.billAmendmentsService
      .getObjectionById(noticeId)
      .subscribe((arg: any) => {
        this.noticeDetails = arg;
        console.log("notice", this.noticeDetails);
        this.getNoticeInfo(this.noticeDetails.workFlowId);
        this.getBillInfo(this.noticeDetails.billId);
      });
  }
  getBillInfo(billId) {
    this.billService.getBillByBillId(billId).subscribe((res: any) => {
      this.billDetails = res;
    });
  }
  // getWorkFlowUsers() {
  //   let roleName = this.user.authorities[0];
  //   if (this.user.authorities.includes("speaker")) {
  //     roleName = "speaker";
  //     this.forwardReturnButton = "Return";
  //   }
  //   let QsRole = [
  //     {
  //       label: "Speaker Private Secretary",
  //       grpID: "SPEAKER_PRIVATE_SECRETARY",
  //       order: 0,
  //       roleName: "privateSecretaryToSpeaker",
  //     },
  //     {
  //       label: "Speaker Additional Private Secretary",
  //       grpID: "SPEAKER_ADDITIONAL_PRIVATE_SECRETARY",
  //       order: 1,
  //       roleName: "additionalSecretary",
  //     },
  //     { label: "Speaker", grpID: "SPEAKER", order: 2, roleName: "speaker" },
  //   ];
  //   this.currentRole = QsRole.find((element) => element.roleName === roleName);
  //   if (this.currentRole) {
  //     QsRole = QsRole.filter(
  //       (element) => element.order != this.currentRole.order
  //     );
  //     return QsRole;
  //   }
  // }
  getWorkflowUserList() {
    let userList;
    this.billAmendmentsService
      .getWorkflowActionUsers(
        this.noticeDetails.id,
        this.noticeDetails.workFlowId
      )
      .subscribe((Res: any) => {
        userList = Res;
        if (
          this.currentPoolUser == "SPEAKER" ||
          this.currentPoolUser == "SPEAKER_ADDITIONAL_PRIVATE_SECRETARY"
        ) {
          this.workflowUsers = userList.filter(
            (element) => element.code === "SPEAKER_PRIVATE_SECRETARY"
          );
        } else {
          this.workflowUsers = userList;
        }
      });
  }
  getNoticeInfo(workflowId) {
    this.billAmendmentsService.getNoticeInfo(workflowId).subscribe((Res) => {
      this.stepStatusDetail = Res;
      const current = this.stepStatusDetail[this.stepStatusDetail.length - 1];
      this.currentPoolUser = current.owner;
      if (current.assignee) {
        this.assignee = current.assignee;
      } else {
        if (this.currentUserRole == "privateSecretaryToSpeaker") {
          this.assignee = this.user.userId;
        }
      }
      this.fromGroup = current.owner;
      if (this.noticeDetails.status == "SUBMITTED") {
        this.getWorkflowUserList();
      }
      this.getAllNotes(this.noticeDetails.id);
      // const current = this.stepStatus[this.stepStatus.length - 1];
      // this.currentPoolUser = current.owner;
      // this.getCurrentPool();
      // if (this.fileDocsArray.fileResponse.status !== "APPROVED") {
      //   this.getWorkFLowUsers();
      // }
    });
  }
  getStatusByReason(reason) {
    if (reason) {
      if (reason === "completed") {
        return "finish";
      }
      if (reason === "in progress") {
        return "wait";
      }
    }
  }
  goBack() {
    window.history.back();
  }
  cancel() {}
  forwardOrReturn() {
    console.log(this.selectedRole);
    let arrForwardUerInfo = this.selectedRole.split("-");
    let forwardActionRow = arrForwardUerInfo[1];
    this.forwardAssignee = arrForwardUerInfo[0];
    this.forwardAssigneeGroup = arrForwardUerInfo[2];
    for (var user of this.workflowUsers) {
      if (this.currentPoolUser === user.actionId) {
        this.currentUserActionRow = user.actionRow;
        break;
      }
    }
    if (
      this.currentUserActionRow === null ||
      forwardActionRow >= this.currentUserActionRow
    ) {
      this.forwardReturnButton = "Forward";
    } else {
      this.forwardReturnButton = "Return";
    }
  }
  forwardFile() {
    this.latestNote = this.noticeDetails.notes[
      this.noticeDetails.notes.length - 1
    ];
    if (this.latestNote && this.latestNote.owner.userId === this.user.userId) {
      const body = {
        processInstanceId: this.noticeDetails.workflowId,
        groupId: this.forwardAssigneeGroup,
        fromGroup: this.fromGroup,
        assignee: this.forwardAssignee,
      };
      this.billAmendmentsService
        .forwardObjNotice(body, this.noticeDetails.id)
        .subscribe((arg: any) => {
          this.notification.success(
            "Success",
            "Succesfully" + this.forwardReturnButton + "ed"
          );
          this.router.navigate([
            "/business-dashboard/bill/obj-introduction-notices",
          ]);
        });
    } else {
      this.notification.create("warning", "Warning", "Please Add Note!");
    }
  }
  approveNotice() {
    this.latestNote = this.noticeDetails.notes[
      this.noticeDetails.notes.length - 1
    ];
    if (this.latestNote && this.latestNote.owner.userId === this.user.userId) {
     this.markAsApprove();
    } else {
     this.addaNote();
     this.markAsApprove();
    }
  }
  markAsApprove(){
    let body = {
      action: "ADMIT",
      groupId: this.currentPoolUser,
      processInstanceId: this.noticeDetails.workFlowId,
    };
    this.billAmendmentsService
      .approveObjNotice(body, this.noticeDetails.id)
      .subscribe((arg: any) => {
        this.notification.success("Success", "Approved SucessFully");
        this.router.navigate([
          "/business-dashboard/bill/obj-introduction-notices",
        ]);
      });
  }
  addaNote(){
    let reqBody={
      masterId:this.noticeDetails.id,
      note:  "Notice Approved",
      ownerId: this.user.userId
    }
    this.billAmendmentsService.createNote(reqBody).subscribe((data: any) => {
      this.noticeDetails.notes = data;
      this.latestNote = this.noticeDetails.notes[this.noticeDetails.notes.length - 1];
    });
  }
  rejectNotice() {
    this.latestNote = this.noticeDetails.notes[
      this.noticeDetails.notes.length - 1
    ];
    if (this.latestNote && this.latestNote.owner.userId === this.user.userId) {
      this.billAmendmentsService
        .rejectObjNotice(this.noticeDetails.id)
        .subscribe((arg: any) => {
          this.notification.success("Success", "Rejected SucessFully");
          this.router.navigate([
            "/business-dashboard/bill/obj-introduction-notices",
          ]);
        });
    } else {
      this.notification.create("warning", "Warning", "Please Add Note!");
    }
  }
  // disallowNotice() {
  //   this.billAmendmentsService
  //     .disallowObjNotice(this.noticeDetails.id)
  //     .subscribe((arg: any) => {
  //       this.notification.success("Success", "Disallowed SucessFully");
  //       this.router.navigate([
  //         "/business-dashboard/bill/obj-introduction-notices",
  //       ]);
  //     });
  // }
  sendNotice() {
    this.showSendButton = false;
    this.billAmendmentsService
      .sendNotice(this.noticeDetails.id)
      .subscribe((arg: any) => {
        this.getNoticeById(this.noticeId);
        this.notification.success("Success", "Notice Sended SucessFully");
      });
  }
  getAllNotes(noticeId) {
    this.billAmendmentsService
      .getAllNote(noticeId)
      .subscribe((Response: any) => {
        this.noticeDetails.notes = Response;
        this.latestNote = this.noticeDetails.notes[
          this.noticeDetails.notes.length - 1
        ];
      });
  }
}
