import {
  Component,
  OnInit,
  Input,
  Inject,
  Output,
  EventEmitter,
} from "@angular/core";
import { FileServiceService } from "../../shared/services/file-service.service";
import { Router } from "@angular/router";
import { NzNotificationService } from "ng-zorro-antd";
import { CommitteecommonService } from "../../shared/services/committeecommon.service";

@Component({
  selector: "committee-buttons",
  templateUrl: "./buttons.component.html",
  styleUrls: ["./buttons.component.css"],
})
export class ButtonsComponent implements OnInit {
  skip = false;
  @Input() allWorkflowUsers;
  @Input() notesInfo;
  @Input() currentPoolUser;
  @Input() assignee;
  @Input() fileResponse;
  @Input() fileId;
  @Input() selectedMeetingDetails;
  notes: any = [];
  latestNote: any;
  currentUserActionRow: any;
  forwardAssignee: any;
  forwardAssigneeGroup: any;
  selectedRole: any;
  showSkipModal = false;
  forwardReturnButton = "Forward";
  reason = "";
  showForward = true;
  showApprove = true;
  ratificationApprove = false;
  pullButton = false;
  fileClose = false;
  canApprove = false;
  user;
  ratification = false;
  fromGroup: any;
  showPullModal = false;
  canPull = false;
  currentPool: any = null;
  pullRemark = null;
  stepStatusDetail: any = [];
  workflowUsers: any = [];
  pullGroup: any;
  currentActionName = null;
  fromPool: any;
  logDetails: any = [];
  sectionRole: any;
  ratificationStatus: any;
  forwrdMsg = null;
  approveMsg = null;
  @Output() fileApproved = new EventEmitter<string>();
  @Output() fileForwarded = new EventEmitter<string>();
  @Output() fileClosureInitiated = new EventEmitter<string>();
  constructor(
    private file: FileServiceService,
    @Inject("authService") public auth,
    private router: Router,
    private notification: NzNotificationService,
    public commonService: CommitteecommonService
  ) {
    this.commonService.setCommitteePermissions(
      auth.getCurrentUser().rbsPermissions
    );
    this.user = auth.getCurrentUser();
    this.fromGroup = auth.getCurrentUser().authorities[0];
  }

  ngOnInit() {
    this.getRbsPermissionsinList();
    if (
      (this.fileResponse.fileResponse.subtype === "COMMITEE_REQUEST_NOMINEES" &&
        this.fileResponse.letter.correspondenceId === null) ||
      this.checkMeetingNoticeandLetterCorrespondence()
    ) {
      this.showForward = false;
      this.forwrdMsg = "Please Attach Correspondence To Continue";
    }
    if (
      this.fileResponse.fileResponse.subtype === "COMMITTEE_FILE" &&
      this.fileResponse.committeeDetails.category.code === "SELECT_COMMITTEE" &&
      this.fileResponse.memberDetailDto === null
    ) {
      this.showForward = false;
      this.forwrdMsg = null;
    }
    if (
      this.fileResponse.fileResponse.subtype === "COMMITTEE_FILE" &&
      this.fileResponse.committeeDetails.category.code === "SELECT_COMMITTEE" &&
      this.fileResponse.memberDetailDto !== null &&
      !this.fileResponse.memberDetailDto.committeeDto[0].memberDtoResponse.hasOwnProperty(
        "CHAIRMAN"
      ) &&
      this.commonService.doIHaveAnAccess(
        "ADD_SELECT_COMMITEE_CHAIRMAN",
        "UPDATE"
      )
    ) {
      this.showApprove = false;
      this.approveMsg = "Please Add Committee Chairman to approve file";
    }
    if (
      this.fileResponse.fileResponse.subtype === "COMMITTEE_FILE" &&
      this.fileResponse.committeeDetails.category.code ===
        "SUBJECT_COMMITTEE" &&
      this.fileResponse.memberDetailDto !== null &&
      (this.commonService.doIHaveAnAccess("FILE", "APPROVE") ||
        this.ratificationApprove) &&
      !this.checkSubjectCommiteeValidity()
    ) {
      this.showApprove = false;
      this.approveMsg = "Please Fill Committee Details to approve file";
    }
    this.getFileByFileId();
  }
  checkSubjectCommiteeValidity() {
    let validity = true;
    if (this.fileResponse.memberDetailDto !== null) {
      this.fileResponse.memberDetailDto.committeeDto.forEach((element) => {
        if (
          !element.memberDtoResponse.hasOwnProperty("CHAIRMAN") ||
          !element.memberDtoResponse.hasOwnProperty("MEMBER")
        ) {
          validity = false;
        } else if (this.findMemberCount(element) < 7) {
          validity = false;
        }
      });
    }
    return validity;
  }
  findMemberCount(element) {
    let chCount = 0,
      exCount = 0,
      mCount = 0;
    if (element.memberDtoResponse.hasOwnProperty("CHAIRMAN")) {
      chCount = element.memberDtoResponse.CHAIRMAN.length;
    }
    if (element.memberDtoResponse.hasOwnProperty("MEMBER")) {
      mCount = element.memberDtoResponse.MEMBER.length;
    }
    if (element.memberDtoResponse.hasOwnProperty("EX_OFFICIO")) {
      exCount = element.memberDtoResponse.EX_OFFICIO.length;
    }
    return chCount + exCount + mCount;
  }
  checkMeetingNoticeandLetterCorrespondence() {
    let noCorrespondence = false;
    if (this.fileResponse.meetings) {
      this.fileResponse.meetings.forEach((meet) => {
        if (meet.meetingNotice) {
          meet.meetingNotice.forEach((notice) => {
            if (notice.correspondenceId == null) {
              noCorrespondence = true;
            }
          });
        }
        if (meet.meetingLetter && meet.meetingLetter.correspondenceId == null) {
          noCorrespondence = true;
        }
        if (meet.supportingDocumentLetter) {
          meet.supportingDocumentLetter.forEach((supportDoc) => {
            if (supportDoc.correspondenceId == null) {
              noCorrespondence = true;
            }
          });
        }
      });
    }
    return noCorrespondence;
  }
  getRbsPermissionsinList() {
    if (this.commonService.doIHaveAnAccess("PULL_FILE", "READ")) {
      this.pullButton = true;
    }
    if (this.commonService.doIHaveAnAccess("FILE_RATIFICATION", "APPROVE")) {
      this.ratificationApprove = true;
    }
    // if (this.commonService.doIHaveAnAccess('FILE_CLOSURE', 'READ')) {
    //   this.fileClose = true;
    // }
  }
  getFileByFileId() {
    this.file
      .getFileById(this.fileId, this.auth.getCurrentUser().userId)
      .subscribe((Response) => {
        if (Response) {
          this.fileResponse = Response;
          this.notes = this.fileResponse.fileResponse;
          this.latestNote = this.notes[this.notes.length - 1];
          if (this.fileResponse.fileResponse.status !== "APPROVED") {
            this.canApprove = true;
          }
          this.getWorkflowStatus();
          if (this.fileResponse.fileResponse.status !== "APPROVED") {
            this.getWorkFLowUsers();
          }
          if (this.fileResponse.fileResponse.ratification) {
            if (this.fileResponse.fileResponse.ratification.length !== 0) {
              const temp = this.fileResponse.fileResponse.ratification.filter(
                (x) => x.sectionRole === this.sectionRole
              );
              if (temp.length !== 0) {
                this.ratificationStatus = temp[0].status;
              }
            }
          }
        }
      });
  }
  getWorkflowStatus() {
    this.file
      .checkWorkFlowStatus(this.fileResponse.fileResponse.workflowId)
      .subscribe((Res) => {
        if (Res) {
          this.stepStatusDetail = Res;
          const current =
            this.stepStatusDetail[this.stepStatusDetail.length - 1];
          // this.currentPoolUser = current.owner;
          this.getCurrentPool();
          if (this.fileResponse.fileResponse.status !== "APPROVED") {
            this.getWorkFLowUsers();
          }
        }
      });
  }
  getWorkFLowUsers() {
    // this.file.getWorkflowActionUsers(
    //     this.fileResponse.fileResponse.workflowId,
    //     this.fileResponse.fileResponse.fileId
    //   )
    //   .subscribe((Res) => {
    //     this.workflowUsers = Res;
    //     for (let user of this.workflowUsers) {
    //       if (this.currentPoolUser === user.code) {
    //         this.currentUserActionRow = user.actionRow;
    //         break;
    //       }
    //     }
    //     this.pullOrNot();
    //   });
    this.workflowUsers = this.allWorkflowUsers.filter(
      (user) =>
        user.actionRow <=
        this.allWorkflowUsers.find((u) => u.userId === this.user.userId)
          .actionRow +
          2
    );
    for (let user of this.workflowUsers) {
      if (this.currentPoolUser === user.code) {
        this.currentUserActionRow = user.actionRow;
        break;
      }
    }
    this.pullOrNot();
  }
  pullOrNot() {
    this.getPullGroup();
    const current = this.stepStatusDetail[this.stepStatusDetail.length - 1];
    if (current) {
      const fromRow = this.workflowUsers.find(
        (user) => user.code === current.owner
      );
      const groupRow = this.workflowUsers.find(
        (user) => user.code === this.currentPool
      );
      if (fromRow && groupRow && groupRow.actionRow > fromRow.actionRow) {
        this.canPull = true;
      } else {
        this.canPull = false;
      }
    }
  }
  returnFile() {}
  submitFile() {}
  goBack() {
    window.history.back();
  }
  cancel() {}
  forwardOrReturn() {
    const arrForwardUerInfo = this.selectedRole.split("-");
    const forwardActionRow = arrForwardUerInfo[1];
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
    if (
      forwardActionRow > this.currentUserActionRow + 1 &&
      this.currentUserActionRow < 6
    ) {
      this.skip = true;
    } else {
      this.skip = false;
    }
  }

  forwardFile(fileId) {
    this.latestNote = this.notesInfo.notes[this.notesInfo.notes.length - 1];
    if (
      this.latestNote &&
      this.latestNote.user.userId === this.auth.getCurrentUser().userId
    ) {
      if (this.skip) {
        this.showSkipModal = true;
      } else {
        const body = {
          processInstanceId: this.notesInfo.workflowId,
          action: "FORWARD",
          groupId: this.forwardAssigneeGroup,
          fromGroup: this.getFromGroupOfUser(),
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
          if (this.notesInfo.type === "COMMITTEE_MEETING") {
            this.router.navigate([
              "business-dashboard/committee/files/meeting-files",
            ]);
          } else {
            this.router.navigate(["business-dashboard/committee/files"]);
          }
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
  approveFile() {
    this.latestNote = this.notesInfo.notes[this.notesInfo.notes.length - 1];
    if (
      this.latestNote &&
      this.latestNote.user.userId === this.auth.getCurrentUser().userId
    ) {
      this.markAsApproved();
    } else {
      this.addNote();
    }
  }
  ratificationApproveFile(fileId) {
    this.ratification = true;
    this.approveFile();
  }
  getFromGroupOfUser() {
    if (this.user.authorities.includes("speaker")) {
      return "Speaker";
    } else if (this.user.authorities.includes("MLA")) {
      return "Minister";
    }
    return this.auth.getCurrentUser().authorities[0];
  }
  markAsApproved() {
    if (!this.isMeetingDetailValid()) {
      return;
    }
    if (!this.ratification) {
      const body = {
        fileId: this.notesInfo.fileId,
        userId: this.auth.getCurrentUser().userId,
        approvedById: this.auth.getCurrentUser().userId,
        fromGroup: this.getFromGroupOfUser(),
      };
      this.file.approveFile(body).subscribe((Res) => {
        this.notification.create(
          "success",
          "Success",
          "File Approved Successfully!"
        );
        if (this.notesInfo.type === "COMMITTEE_MEETING") {
          this.router.navigate([
            "business-dashboard/committee/files/meeting-files",
          ]);
        } else {
          this.router.navigate(["business-dashboard/committee/files"]);
        }
      });
    } else {
      const body = {
        fileId: this.fileId,
        userId: this.user.userId,
        ratification: this.ratification,
        fromGroup: this.fromGroup,
      };
      this.file.approveFile(body).subscribe((Res) => {
        this.selectedRole = null;
        this.notification.create(
          "success",
          "Success",
          "File approved Successfully!"
        );
        setTimeout(() => {
          if (this.notesInfo.type === "COMMITTEE_MEETING") {
            this.router.navigate([
              "business-dashboard/committee/files/meeting-files",
            ]);
          } else {
            this.router.navigate(["business-dashboard/committee/files"]);
          }
        }, 1500);
      });
    }
  }

  addNote() {
    const reqBody = {
      noteId: null,
      fileId: this.notesInfo.fileId,
      note: "File Approved.",
      referenceBusiness: [0],
      referenceRules: [0],
      temporary: false,
      userId: this.auth.getCurrentUser().userId,
    };
    this.file.createNote(reqBody).subscribe((data: any) => {
      this.notesInfo.notes = data;
      this.latestNote = this.notesInfo.notes[this.notesInfo.notes.length - 1];
      this.markAsApproved();
    });
  }
  isMeetingDetailValid() {
    if (
      this.fileResponse &&
      this.fileResponse.fileResponse.activeSubTypes &&
      (this.fileResponse.fileResponse.activeSubTypes.includes(
        "COMMITTEE_MEETING"
      ) || this.fileResponse.fileResponse.activeSubTypes.includes(
        "MEETING_DETAIL"
      )) &&
      this.selectedMeetingDetails &&
      this.selectedMeetingDetails.meetingDetails &&
      (this.commonService.doIHaveAnAccess("FILE", "APPROVE") ||
        this.ratificationApprove)
    ) {
      if (
        (this.selectedMeetingDetails.meetingDetails.venue == null &&
           this.fileResponse.fileResponse.activeSubTypes.includes(
          "MEETING_DETAIL")) ||
        this.selectedMeetingDetails.meetingDetails.occasion == null ||
        this.selectedMeetingDetails.meetingDetails.date == null ||
        this.selectedMeetingDetails.meetingDetails.time == null
      ) {
        this.notification.create(
          "error",
          "Warning",
          "Please fill all the meeting details to approve the File !!!"
        );
        return false;
      }
    }
    return true;
  }
  showPullpopup() {
    this.showPullModal = true;
  }
  pullFile() {
    this.getPullGroup();
    const current = this.stepStatusDetail[this.stepStatusDetail.length - 1];
    if (current) {
      const fromRow = this.workflowUsers.find(
        (user) => user.code === current.owner
      );
      const groupRow = this.workflowUsers.find(
        (user) => user.code === this.currentPool
      );
      const body = {
        processInstanceId: this.fileResponse.fileResponse.workflowId,
        action: "FORWARD",
        groupId: this.currentPool,
        fromGroup: this.pullGroup,
        assignee: this.user.userId,
        remark: this.pullRemark,
      };
      if (fromRow && groupRow && groupRow.actionRow > fromRow.actionRow) {
        this.file.pullFile(body, this.fileId).subscribe((Res) => {
          this.fileForwarded.emit(this.fileId);
          this.showPullModal = false;
          this.notification.create(
            "success",
            "Success",
            "File pulled Successfully!"
          );
          this.getWorkflowStatus();
          this.getAllLogs(this.fileId);
          this.getFileByFileId();
        });
      } else {
        this.notification.create(
          "warning",
          "Warning",
          "You cannot pull from higher authority!"
        );
      }
    }
  }
  cancelPull() {
    this.showPullModal = false;
  }
  getAllLogs(id) {
    this.file.getAllFileLogs(id).subscribe((Response) => {
      if (Response) {
        this.logDetails = Response;
      }
    });
  }
  getCurrentPool() {
    this.workflowUsers.forEach((element) => {
      if (element.userId === this.user.userId) {
        this.currentPool = element.actionId;
        this.pullGroup = element.name;
        this.currentActionName = element.actionName;
      }
    });
    // const currentUser = this.workflowUsers.filter((x) => x.userId === this.user.userId);

    // if (this.user.authorities.includes('assistant')) {
    //   this.currentPool = 'SUBJECT_COMMITTEE_A_ASSISTANT';
    //   this.pullGroup = 'Assisstant';
    //   this.currentActionName = 'Assistant';
    // } else if (this.user.authorities.includes('sectionOfficer')) {
    //   this.currentPool = 'SUBJECT_COMMITTEE_A_SECTION_OFFICER';
    //   this.pullGroup = 'Section Officer';
    //   this.currentActionName = 'SectionOfficer';
    // } else if (this.user.authorities.includes('underSecretary')) {
    //   this.currentPool = 'SUBJECT_COMMITTEE_A_UNDER_SECRETARY';
    //   this.pullGroup = 'Under Secretary';
    //   this.currentActionName = 'UnderSecretary';
    // } else if (this.user.authorities.includes('deputySecretary')) {
    //   this.currentPool = 'SUBJECT_COMMITTEE_A_DEPUTY_SECRETARY';
    //   this.pullGroup = 'Deputy Secretary';
    //   this.currentActionName = 'DeputySecretary';
    // } else if (this.user.authorities.includes('jointSecretary')) {
    //   this.currentPool = 'SUBJECT_COMMITTEE_A_JOINT_SECRETARY';
    //   this.pullGroup = 'Joint Secretary';
    //   this.currentActionName = 'JS/AS/SS';
    // } else if (this.user.authorities.includes('additionalSecretary')) {
    //   this.currentPool = 'SUBJECT_COMMITTEE_A_ADDITIONAL_SECRETARY';
    //   this.pullGroup = 'Additional Secretary';
    //   this.currentActionName = 'JS/AS/SS';
    // } else if (this.user.authorities.includes('specialSecretary')) {
    //   this.currentPool = 'SUBJECT_COMMITTEE_A_SPECIAL_SECRETARY';
    //   this.pullGroup = 'Special Secretary';
    //   this.currentActionName = 'JS/AS/SS';
    // } else if (this.user.authorities.includes('secretary')) {
    //   this.currentPool = 'SECRETARY';
    //   this.pullGroup = 'Secretary';
    //   this.currentActionName = 'Secretary';
    // } else if (this.user.authorities.includes('speaker')) {
    //   this.currentPool = 'SPEAKER';
    //   this.pullGroup = 'Speaker';
    //   this.currentActionName = 'Speaker';
    // }
  }
  getPullGroup() {
    const current = this.stepStatusDetail[this.stepStatusDetail.length - 1];
    if (current) {
      this.workflowUsers.forEach((element) => {
        if (element.actionId === current.owner) {
          this.fromPool = element.name;
        }
      });
    }
    // if (current.owner === 'SUBJECT_COMMITTEE_A_ASSISTANT') {
    //   this.fromPool = 'Assistant';
    // } else if (current.owner === 'SUBJECT_COMMITTEE_A_SECTION_OFFICER') {
    //   this.fromPool = 'Section Officer';
    // } else if (current.owner === 'SUBJECT_COMMITTEE_A_UNDER_SECRETARY') {
    //   this.fromPool = 'Under Secretary';
    // } else if (current.owner === 'SUBJECT_COMMITTEE_A_DEPUTY_SECRETARY') {
    //   this.fromPool = 'Deputy Secretary';
    // } else if (current.owner === 'SUBJECT_COMMITTEE_A_JOINT_SECRETARY') {
    //   this.fromPool = 'Joint Secretary';
    // } else if (current.owner === 'SUBJECT_COMMITTEE_A_ADDITIONAL_SECRETARY') {
    //   this.fromPool = 'Additional Secretary';
    // } else if (current.owner === 'SUBJECT_COMMITTEE_A_SPECIAL_SECRETARY') {
    //   this.fromPool = 'Special Secretary';
    // } else if (current.owner === 'SECRETARY') {
    //   this.fromPool = 'Secretary';
    // } else if (current.owner === 'SPEAKER') {
    //   this.fromPool = 'Speaker';
    // }
  }
  getFromGroup() {
    const current = this.stepStatusDetail[this.stepStatusDetail.length - 1];
    this.workflowUsers.forEach((element) => {
      if (element.userId === this.user.userId) {
        this.fromGroup = element.name;
        this.sectionRole = element.actionId;
      }
    });
    // if (this.user.authorities.includes('assistant')) {
    //   this.fromGroup = 'Assistant';
    //   this.sectionRole = 'SUBJECT_COMMITTEE_A_ASSISTANT';
    // } else if (this.user.authorities.includes('sectionOfficer')) {
    //   this.fromGroup = 'Section Officer';
    //   this.sectionRole = 'SUBJECT_COMMITTEE_A_SECTION_OFFICER';
    // } else if (this.user.authorities.includes('underSecretary')) {
    //   this.fromGroup = 'Under Secretary';
    //   this.sectionRole = 'SUBJECT_COMMITTEE_A_UNDER_SECRETARY';
    // } else if (this.user.authorities.includes('deputySecretary')) {
    //   this.fromGroup = 'Deputy Secretary';
    //   this.sectionRole = 'SUBJECT_COMMITTEE_A_DEPUTY_SECRETARY';
    // } else if (this.user.authorities.includes('jointSecretary')) {
    //   this.fromGroup = 'Joint Secretary';
    //   this.sectionRole = 'SUBJECT_COMMITTEE_A_JOINT_SECRETARY';
    // } else if (this.user.authorities.includes('additionalSecretary')) {
    //   this.fromGroup = 'Additional Secretary';
    //   this.sectionRole = 'SUBJECT_COMMITTEE_A_ADDITIONAL_SECRETARY';
    // } else if (this.user.authorities.includes('specialSecretary')) {
    //   this.fromGroup = 'Special Secretary';
    //   this.sectionRole = 'SUBJECT_COMMITTEE_A_SPECIAL_SECRETARY';
    // } else if (this.user.authorities.includes('secretary')) {
    //   this.fromGroup = 'Secretary';
    //   this.sectionRole = 'SECRETARY';
    // } else if (this.user.authorities.includes('speaker')) {
    //   this.fromGroup = 'Speaker';
    //   this.sectionRole = 'SPEAKER';
    // }
  }
  fileClosure() {
    this.file.fileClosure(this.fileId, this.user.userId).subscribe((Res) => {
      this.notification.create(
        "success",
        "Success",
        "File closure initiated successfully!"
      );
      this.fileClosureInitiated.emit(this.fileId);
      this.getAllLogs(this.fileId);
    });
  }
  approveClosure() {
    if (this.latestNote && this.latestNote.user.userId === this.user.userId) {
      this.closeFile();
    } else {
      const body = {
        fileId: this.fileId,
        note: "File closed",
        referenceBusiness: [0],
        referenceRules: [0],
        temporary: false,
        userId: this.user.userId,
      };
      this.file.createNote(body).subscribe((Res) => {
        this.notes = Res;
        this.latestNote = this.notes[this.notes.length - 1];
        this.getAllLogs(this.fileId);
        // this.inputValue = null;
        // this.currentRuleStatement = null;
        this.closeFile();
      });
    }
  }
  closeFile() {
    const body = {
      fromGroup: this.fromGroup,
      approvedById: this.user.userId,
    };
    this.file.approveClosure(body, this.fileId).subscribe((Res) => {
      this.getFileByFileId();
      this.notification.create(
        "success",
        "Success",
        "File Closed Successfully!"
      );
    });
  }
  _canApprove() {
    let canIApprove = false;
    if (this.commonService.doIHaveAnAccess("FILE", "APPROVE")) {
      canIApprove = true;
      if (
        this.fileResponse.fileResponse.subtype === "COMMITTEE_FILE" &&
        this.fileResponse.committeeDetails.category.code ===
          "SELECT_COMMITTEE" &&
        this.fileResponse.memberDetailDto !== null &&
        this.fileResponse.fileResponse.activeSubTypes &&
        this.fileResponse.fileResponse.activeSubTypes.includes(
          "COMMITTEE_MEMBER"
        )
      ) {
        if (
          this.commonService.doIHaveAnAccess(
            "ADD_SELECT_COMMITEE_CHAIRMAN",
            "UPDATE"
          )
        ) {
          canIApprove = true;
        } else {
          canIApprove = false;
        }
      }
    }
    if (
      this.commonService.doIHaveAnAccess("APPROVE_LETTER_TO_PPO", "APPROVE")
    ) {
      if (
        this.fileResponse.fileResponse.activeSubTypes &&
        this.fileResponse.fileResponse.activeSubTypes.includes(
          "COMMITEE_REQUEST_NOMINEES"
        ) &&
        this.user.userId.toString() === this.assignee
      ) {
        this.ratificationApprove = false;
        //Letter to PPO approval can be done from us and above
        canIApprove = true;
      }
    }
    if (
      this.commonService.doIHaveAnAccess("APPROVE_MEETING_LETTER", "APPROVE")
    ) {
      if (
        this.fileResponse.fileResponse.activeSubTypes &&
        this.fileResponse.fileResponse.activeSubTypes.includes(
          "MEETING_LETTER"
        ) &&
        this.user.userId.toString() === this.assignee
      ) {
        this.ratificationApprove = false;
        // meeting letter approval is from us and above so ractifiction is disabled from us
        canIApprove = true;
      }
    }
    if (
      this.commonService.doIHaveAnAccess("APPROVE_MEETING_NOTICE", "APPROVE")
    ) {
      if (
        this.fileResponse.fileResponse.activeSubTypes &&
        this.fileResponse.fileResponse.activeSubTypes.includes(
          "MEETING_NOTICE"
        ) &&
        this.user.userId.toString() === this.assignee
      ) {
        this.ratificationApprove = false;
        // meeting notice approval is from js and above so ractifiction is disabled from js
        canIApprove = true;
      }
    }
    if (
      this.commonService.doIHaveAnAccess("APPROVE_ATTENDANCE", "APPROVE")
    ) {
      if (
        this.fileResponse.fileResponse.activeSubTypes &&
        this.fileResponse.fileResponse.activeSubTypes.includes(
          "MEETING_ATTENDANCE"
        ) &&
        this.user.userId.toString() === this.assignee
      ) {
        this.ratificationApprove = false;
        // meeting notice approval is from js and above so ractifiction is disabled from js
        canIApprove = true;
      }
    }
    return canIApprove;
  }
  addCommMembers(type) {
    if (type == "select" && this.fileResponse.committeeId) {
      this.router.navigate([
        "business-dashboard/committee/select-committee-members/",
        "addnew",
        this.fileResponse.committeeId,
      ]);
    }
  }
}
