import {
  Component,
  OnInit,
  Input,
  Inject,
  Output,
  EventEmitter,
} from "@angular/core";
import { Router } from "@angular/router";
import { NzNotificationService } from "ng-zorro-antd";
import { CommitteecommonService } from "../../../shared/services/committeecommon.service";
import { FileServiceService } from "../../../shared/services/file-service.service";

@Component({
  selector: "committee-buttons",
  templateUrl: "./buttons.component.html",
  styleUrls: ["./buttons.component.css"],
})
export class ButtonsComponent implements OnInit {
  @Input() allWorkflowUsers;
  @Input() currentPoolUser;
  @Input() fileResponse;
  @Input() assignee;

  @Output() fileForwarded = new EventEmitter<string>();

  user;
  forwardReturnButton = "Forward";
  selectedRole: any;
  forwardAssignee: any;
  forwardAssigneeGroup: any;
  workflowUsers: any;
  currentUserActionRow: any;
  skip = false;
  latestNote: any;
  showSkipModal = false;
  fromGroup: any;
  reason = "";
  showForward = true;

  constructor(
    @Inject("authService") public auth,
    public common: CommitteecommonService,
    private file: FileServiceService,
    private notification: NzNotificationService,
    private router: Router
  ) {
    this.user = auth.getCurrentUser();
    this.fromGroup = this.user.authorities[0];
    this.common.setCommitteePermissions(this.user.rbsPermissions);
  }

  ngOnInit() {
    if (this.allWorkflowUsers) {
      this.getWorkFlowUsers();
    }
  }

  goBack() {
    window.history.back();
  }

  getWorkFlowUsers() {
    this.workflowUsers = this.allWorkflowUsers.filter(
      (user) =>
        user.actionRow <=
        this.allWorkflowUsers.find((u) => u.userId === this.user.userId)
          .actionRow +
          2
    );
  }

  forwardOrReturn() {
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
    if (forwardActionRow > this.currentUserActionRow + 1) {
      this.skip = true;
    } else {
      this.skip = false;
    }
  }

  cancel() {}

  forwardFile(fileId) {
    this.latestNote = this.fileResponse.notes[
      this.fileResponse.notes.length - 1
    ];
    if (this.latestNote && this.latestNote.user.userId === this.user.userId) {
      if (this.skip) {
        this.showSkipModal = true;
      } else {
        const body = {
          processInstanceId: this.fileResponse.workflowId,
          action: "FORWARD",
          groupId: this.forwardAssigneeGroup,
          fromGroup: this.fromGroup,
          assignee: this.forwardAssignee,
          remark: this.reason,
          skipped: this.showSkipModal,
        };
        this.file.forwardFile(body, fileId).subscribe((Res) => {
          this.notification.create(
            "success",
            "Success",
            "File " + this.forwardReturnButton + "ed Successfully!"
          );
          this.showSkipModal = false;
          this.selectedRole = null;
          // this.fileForwarded.emit(this.fileResponse.fileId);
          this.router.navigate([
            "/business-dashboard/committee/pmbr-commitee/file-list",
          ]);
        });
      }
    } else {
      this.notification.create("warning", "Warning", "Please Add Note!");
    }
  }

  handleCancel() {
    this.showSkipModal = false;
    this.reason = "";
  }
  _canApprove() {
    return this.common.doIHaveAnAccess("FILE", "APPROVE");
  }
  approveFile() {
    this.latestNote = this.fileResponse.notes[
      this.fileResponse.notes.length - 1
    ];
    if (
      this.latestNote &&
      this.latestNote.user.userId === this.auth.getCurrentUser().userId
    ) {
      this.markAsApproved();
    } else {
      this.addNote();
    }
  }
  markAsApproved() {
    const body = {
      fileId: this.fileResponse.fileId,
      userId: this.auth.getCurrentUser().userId,
      approvedById: this.auth.getCurrentUser().userId,
      fromGroup: this.getFromGroupOfUser(),
    };
    this.file.approveFile(body).subscribe((Res) => {
      this.router.navigate([
        "/business-dashboard/committee/pmbr-commitee/file-list",
      ]);
      this.notification.create(
        "success",
        "Success",
        "File Approved Successfully!"
      );
    });
  }
  addNote() {
    const reqBody = {
      noteId: null,
      fileId: this.fileResponse.fileId,
      note: "File Approved.",
      referenceBusiness: [0],
      referenceRules: [0],
      temporary: false,
      userId: this.auth.getCurrentUser().userId,
    };
    this.file.createNote(reqBody).subscribe((data: any) => {
      this.fileResponse.notes = data;
      this.latestNote = this.fileResponse.notes[
        this.fileResponse.notes.length - 1
      ];
      this.markAsApproved();
    });
  }
  getFromGroupOfUser() {
    if (this.user.authorities.includes("speaker")) {
      return "Speaker";
    } else if (this.user.authorities.includes("MLA")) {
      return "Minister";
    }
    return this.user.authorities[0];
  }
}
