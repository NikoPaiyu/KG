import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { QuestionService } from "../../shared/question.service";
import { QuestionRBSService } from "../../shared/question-rbs.service";
import { NotificationCustomService } from "src/app/shared/services/notification.service";
import { AuthService } from "src/app/auth/shared/services/auth.service";
import { Location } from '@angular/common';
@Component({
  selector: 'app-process-late-answer-bulletin',
  templateUrl: './process-late-answer-bulletin.component.html',
  styleUrls: ['./process-late-answer-bulletin.component.scss']
})
export class ProcessLateAnswerBulletinComponent implements OnInit {
  questionId = null;
  showPreview = false;
  previewData = ""
  list = {
    header: "14th assembly 15 session",
    subHeader: "this is no of answers details",
    rows: []
  };
  ruleChecked;
  disallowedReason = false;
  shownotes = false;
  noteGiven = "";
  qDetail;
  reason = "";
  currentRuleStatement = "";
  quickOptions = [
    { label: "May be Approved.", disallowStatus: false },
    // { label: "May be Admitted as unstarred", disallowStatus: false },
    { label: "May be Rejected.", disallowStatus: false },
    // { label: "Forwading..", disallowStatus: true },
    // {
    //   label: "May be transferred to question date",
    //   disallowStatus: false,
    //   transferDate: true,
    // },
    // {
    //   label: "May be transferred to minister",
    //   disallowStatus: false,
    //   transferMinister: true,
    // },
  ];
  noticeReason;
  ShowRules = false;
  filteredRuleList = [];
  ruleList: any;
  activityFlowList: any;
  withdrawFlowList: any;
  correctionReqFlowList: any;
  revokeFlowList: any;
  selectedTags = [];
  notesList = [];
  editedNote;
  rbsPermission: any;
  disallowRules = false;
  editedNoteOn = false;
  disallowedShortNoticeReason = false;
  shortNoticeRule;
  shortNoticeReason;
  forwardTo;
  forwardToQS;
  showClauseAns;
  isChange: boolean = false;
  noticeNoArray = [];
  assemblySession: object = [];
  changeCategoryReason = false;
  changeCategoryRule = "";
  statusParam = "";
  primaryFlag: boolean;
  claimParams = {
    BtnLbl: "Claim",
    IsClaimed: false,
    showClaimBtn: false,
    prompt: "Do you want to claim this bulletin?",
  };
  ForwardButton = "Forward";
  currentRole;
  claimMessage = "";
  returnRoles = [];
  isRoleTS = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private question: QuestionService,
    private notify: NotificationCustomService,
    private auth: AuthService,
    private rbsService: QuestionRBSService,
    private location: Location
  ) { }

  ngOnInit(): void {
    if (this.auth.getCurrentUser().authorities[0] !== "Department") {
      this.isRoleTS = true;
    }
    this.route.params.subscribe((params) => {
      const questionId = this.questionId = params.listId;
      this.statusParam = params.status;
      this.primaryFlag = params.isp;

      if (questionId) {
        this.question
          .getLateAnswerBulletinById(questionId)
          .subscribe((response) => {
            this.getAssemblySession(response);
          });
      }
    });
  }
  getAssemblySession(response) {
    this.question.getAllAssemblyAndSession().subscribe((res) => {
      if (res) {
        this.assemblySession = res;
          this.qDetail = JSON.parse(response.bulletin);
          this.qDetail.workflowId = response.workflowId;
          this.getTaskActors(this.qDetail.workflowId);
          this.qDetail.category = "STARRED"
          this.qDetail.status = response.status;
          this.qDetail.date = response.createDateTime;
          if (this.qDetail.claimedBy === this.auth.getCurrentUser().userId) {
            this.claimParams["IsClaimed"] = true;
            this.claimParams["BtnLbl"] = "Unclaim";
            this.claimParams["prompt"] = "Do you want to unclaim this bulletin?";
            this.claimParams["showClaimBtn"] = true;
          } else if (this.qDetail.claimedBy == null) {
            this.claimParams["showClaimBtn"] = true;
          } else if (this.qDetail.claimedBy) {
            this.createClaimMessage();
          }
          this.assemblySession["assemblyId"] = this.assemblySession["assembly"].find(
            (item) => item.id === this.qDetail.assemblyId
          ).assemblyId;
          this.assemblySession["sessionId"] = this.assemblySession["session"].find(
            (item) => item.id === this.qDetail.sessionId
          ).sessionId;
          this.loadRBSPermissions();
          this._drawWorkflowTracking();
        }
    });
  }
  loadRBSPermissions() {
    this.rbsService
      .getQuestionPermissions(this.auth.getCurrentUser().userId)
      .subscribe((response) => {
        this.rbsPermission = this.rbsService.getButtonsInAnswerStatusListProcess(
          this.qDetail,
          this.auth.getCurrentUser(),
          this.qDetail.status
        );
        // this.rbsPermission.edit = this.rbsService.getQEditOptions(
        //   this.qDetail.status
        // );
        this.rbsPermission.addnote = this._getADDnotePermission();

        if (this.qDetail.status == "DISALLOWED") {
          this.claimParams["IsClaimed"] = true;
          this.claimParams["showClaimBtn"] = false;
        }
        if (
          this.rbsPermission.Revoke == true ||
          this.qDetail.status == "APPROVED" ||
          this.qDetail.status == "ANSWERED" ||
          this.qDetail.status == "WITHDRAWN"
        ) {
          this.claimParams["IsClaimed"] = true;
          this.claimParams["showClaimBtn"] = false;
          this.claimMessage = "";
        }
      });
  }
  getAllDirections() {
    this.question.getAllDirections().subscribe((Response) => {
      this.filteredRuleList = Response;
    });
  }
  getActivityFlow() {
    this.question
      .getActivityFlow(this.qDetail.workflowId)
      .subscribe((Response) => {
        if (this.qDetail.revokedWorkFlowId) {
          this.revokeFlowList = Response;
          if (this.revokeFlowList[0].owner == "assistant") {
            this.revokeFlowList.shift();
          }
          if (
            this.qDetail.status === "DISALLOWED" &&
            this.qDetail.disallowedBy
          ) {
            let lastIndex = this.revokeFlowList.slice(-1).pop();
            lastIndex.owner = "Disallowed By " + lastIndex.owner;
            lastIndex.endWrkflow = true;
          }
        } else {
          this.activityFlowList = Response;
        }
        if (
          this.qDetail.status === "DISALLOWED" &&
          this.qDetail.disallowedBy &&
          !this.qDetail.revokedWorkFlowId
        ) {
          let lastIndex = this.activityFlowList.slice(-1).pop();
          lastIndex.owner = "Disallowed By " + lastIndex.owner;
          lastIndex.endWrkflow = true;
        }
      });
  }
  onBack(status) {
    window.history.back();
  }
  handleNotes(boolean: boolean): void {
    this.shownotes = boolean;
    this.notify.clearAll();
    this.noteGiven = "";
  }
  getNoteslist() {
    this.question.getLateAnswerBulletinNotes(this.questionId).subscribe((res: any) => {
      this.notesList = res;
      var filterValue = "questionVersion";
      this.notesList.sort(function (a, b) {
        if (a[filterValue] > b[filterValue]) return 1;
        if (a[filterValue] < b[filterValue]) return -1;
        if (a.createDate < b.createDate) return -1;
        if (a.createDate > b.createDate) return 1;
        return 0;
      });
      this.notesList.forEach(async (item) => {
        // item.editNote = false;
        if (
          this.auth.getCurrentUser().userId == item.ownerId &&
          item.status == "INTERIM"
        ) {
          item.editNote = true;
        } else {
          item.editNote = false;
        }
        item.noteditable = false;
      });
    });
  }
  saveNotes() {
    if (this.notesList.length > 0 && this._isAddedNote()) {
      this.noteGiven = "";
      this.notify.showWarning(
        "Warning",
        "Sorry, You can only edit existing Note."
      );
      return;
    }
    if (!this.noteGiven) {
      this.notify.showError("Error", "Plesae Enter Note.");
      return;
    }
    this.question
      .postLateAnswerBulletinNotes(
        this.noteGiven,
        this.questionId,
        this.auth.getCurrentUser().userId,
        null
      )
      .subscribe((element) => {
        this.notify.showSuccess("Success", "Note Added.");
        this.notesList.push(element);
        let i = this.notesList.length;
        this.notesList[i - 1].editNote = true;
        this.notesList[i - 1].noteditable = false;
        this.noteGiven = "";
      });
  }
  updateNotes(index, note) {

    if (!this.editedNote) {
      this.notify.showError("Error", "Plesae Enter Note.");
      return;
    }
    this.question
      .postLateAnswerBulletinNotes(
        this.editedNote,
        this.questionId,
        this.auth.getCurrentUser().userId,
        note.id
      )
      .subscribe((element) => {
        this.notesList[index].note = this.editedNote;
        this.notesList[index].createDate = new Date();
        this.notesList[index].editNote = true;
        this.notesList[index].noteditable = false;
        this.editedNoteOn = false;
        this.notify.showSuccess("Success", "Note Updated.");
      });
  }
  // deleteNotes(questionid, index, noteId) {
  //   this.question.deleteNotes(questionid, noteId).subscribe((response) => {
  //     this.notify.showSuccess("Delete Success", "");
  //     this.notesList.splice(index, 1);
  //   });
  // }
  editNotes(index, data): void {
    this.notesList[index].editNote = false;
    this.notesList[index].noteditable = true;
    this.notesList[index].noteditable == true
      ? (this.editedNoteOn = true)
      : (this.editedNoteOn = false);
    this.editedNote = this.notesList[index].note;
  }
  addQuickOptions(checked: boolean, tag: string, index: number): void {
    if (this.editedNoteOn) {
      this.editedNote = tag;
    } else {
      this.noteGiven = tag;
    }
  }
  CheckforRules(checked: boolean, tag, index: number) {
    this.currentRuleStatement = tag.label;
    if (tag.disallowStatus) {
      this.ShowRules = true;
    } else {
      this.addQuickOptions(checked, tag.label, index);
    }
  }


  checkedRule() {
    this.ruleChecked = this.ruleList.filter((x) => x.checked === true);
    const ruleCodes = this.ruleChecked.map((x) => x.code);
    const ruleDescription = this.ruleChecked.map((x) => x.englishDescription);
    this.reason =
      "Disallowing using the rule " + ruleCodes + "-" + ruleDescription;
  }
  deleteQuestion(questionId: number) {
    this.question.deleteQuestion(questionId).subscribe((response) => {
      this.notify.showSuccess("Question Deleted Successfully", "");
    });
  }

  _redirectToMlaList() {
    this.location.back();
  }
  claimUnclaimQuestion(questionId: number) {
    this.question
      .claimUnclaimQuestion(
        questionId,
        this.auth.getCurrentUser().userId,
        this.claimParams["IsClaimed"],
        this._findRole(),
        this._claimType(),
        null
      )
      .subscribe((response) => {
        if (!this.claimParams["IsClaimed"]) {
          this.qDetail.claimedBy = this.auth.getCurrentUser().userId;
          this.claimParams["IsClaimed"] = true;
          this.claimParams["BtnLbl"] = "Unclaim";
          this.claimParams["prompt"] = "Do you want to unclaim this bulletin?";
          this.claimParams["showClaimBtn"] = true;
        } else {
          this.qDetail.claimedBy = null;
          this.claimParams["IsClaimed"] = false;
          this.claimParams["BtnLbl"] = "Claim";
          this.claimParams["prompt"] = "Do you want to claim this bulletin?";
          this.claimParams["showClaimBtn"] = true;
        }
        this.notify.showSuccess(response["body"], "");
      });
  }

  admitQuestion() {
    if (this.qDetail.questionDate < new Date().toISOString().split("T")[0]) {
      this.notify.showWarning(
        "Warning",
        "Sorry, You cannot admit past date notices"
      );
      return;
    }
    this.question
      .forwardOradmitLateAnswerBulletin(
        this.questionId,
        "admit",
        null,
        this.auth.getCurrentUser().userId,
        this._findRole()
      )
      .subscribe((element) => {
        this.notify.showSuccess("Admitted Successfully", "");
        this.onBack(this.qDetail.status);
      });
  }
  forwardToQuestion() {
    if (this.qDetail.questionDate < new Date().toISOString().split("T")[0]) {
      this.notify.showWarning(
        "Warning",
        "Sorry, You cannot forward past date notices"
      );
      return;
    }
    if (!this.forwardToQS) {
      this.notify.showError("Error", "Please select a role");
      return;
    }
    this.question
      .forwardOradmitLateAnswerBulletin(
        this.questionId,
        "forward",
        this.forwardToQS,
        this.auth.getCurrentUser().userId,
        this._findRole()
      )
      .subscribe((element) => {
        this.notify.showSuccess(
          "Successfully " + this.ForwardButton + "ed",
          ""
        );
        this.onBack(this.qDetail.status);
      });
  }

  forwardNoticeTo(e) {
    if (e.level == this.currentRole.level) {
      this.ForwardButton = "Transfer";
    } else if (e.level < this.currentRole.level) {
      this.ForwardButton = "Return";
    } else {
      this.ForwardButton = "Forward";
    }

    this.forwardToQS = e.group;
    if (this.forwardToQS.includes("/")) {
      this.forwardToQS = "JointSecretary";
    }
  }


  _getADDnotePermission() {
    if (
      this.qDetail.status === "APPROVED"
    ) {
      return false;
    }
    return true;
  }
  _drawWorkflowTracking() {
    this.getActivityFlow();
  }
  _findRole() {
    if (this.auth.getCurrentUser().authorities.indexOf("speaker") !== -1) {
      return "speaker";
    }
    return this.auth.getCurrentUser().authorities[0];
  }
  _isAddedNote() {
    // tslint:disable-next-line: only-arrow-functions
    const lastNote = this.notesList.reduce(function (prev, current) {
      return prev.id > current.id ? prev : current;
    });
    if (
      this.auth.getCurrentUser().userId === lastNote.ownerId &&
      lastNote.status === "INTERIM"
    ) {
      return true;
    }
    return false;
  }
  isMLA() {
    return this.auth.getCurrentUser().authorities.includes("MLA");
  }
  showModal(): void {
    this.ShowRules = true;
  }
  cancelRuleSelection() {
    this.ShowRules = false;
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.ruleList.length; i++) {
      if (this.ruleList[i].checked) {
        this.ruleList[i].checked = false;
      }
    }
  }
  applyRule() {
    let ruleApplyed = [];
    this.editedNote = this.noteGiven = "";
    ruleApplyed = this.ruleList.filter((x) => x.checked === true);
    const ruleCodes = ruleApplyed.map((x) => x.code);
    const ruleDescription = ruleApplyed.map((x) => x.englishDescription);
    if (ruleApplyed.length > 0) {
      if (this.editedNoteOn) {
        this.editedNote = `${this.editedNote} ${this.currentRuleStatement} as per ${ruleCodes} :- ${ruleDescription} `;
      } else {
        this.noteGiven = `${this.noteGiven} ${this.currentRuleStatement} as per ${ruleCodes} :- ${ruleDescription} `;
      }
      this.selectedTags.push(
        `${this.currentRuleStatement} as per ${ruleCodes} :- ${ruleDescription}`
      );
    }
    this.cancelRuleSelection();
    this.ShowRules = false;
  }
  cancel(): void { }

  DisallowQuestion() {
    if (this.qDetail.questionDate < new Date().toISOString().split("T")[0]) {
      this.notify.showWarning(
        "Warning",
        "Sorry, You cannot disallow past date notices"
      );
      return;
    }
    this.disallowRules = true;
  }

  cancelRule() {
    this.disallowRules = false;
  }

  // getRules() {
  //   this.question.getRules().subscribe((Response) => {
  //     this.ruleList = Response;
  //   });
  // }

  ruleSelected(questionId: number) {
    if (this.reason == "") {
      this.notify.showWarning("Warning", "Please Specify the reason");
      return;
    }
    let ruleSelected = [];
    ruleSelected = this.ruleList.filter((x) => x.checked === true);
    const ruleCodes = ruleSelected.map((x) => x.code);
    let ruleData = {};
    ruleData["direction"] = ruleSelected[0].englishDescription;
    ruleData["ownerId"] = this.auth.getCurrentUser().userId;
    ruleData["questionId"] = questionId;
    ruleData["reason"] = this.reason;
    ruleData["groupId"] = this._findRole();

    this.question.questionDisallow(ruleData).subscribe((response) => {
      this.notify.showSuccess("disallowed successfully", "");
      this.onBack(this.qDetail.status);
    });

    this.disallowRules = false;
  }
  createClaimMessage(): void {
    this.claimMessage = `This bulletin is claimed by ${this.qDetail.claimedUser}`;
  }

  showPreviewModal() {
    this.previewData = document.getElementById('print-section').innerHTML;
    let bodyControl = document.getElementsByTagName("body")[0];
    bodyControl.classList.add("questionbooklet");
    this.showPreview = true;
  }
  cancelVersion() {
    let bodyControl = document.getElementsByTagName("body")[0];
    bodyControl.classList.remove("questionbooklet");
    this.showPreview = false;
  }
  _claimType() {
    if (
      this.qDetail.withdrawelStatus === "WITHDRAWEL_REQUESTED" &&
      this.qDetail.withdrawelWorkFlowId &&
      this.statusParam === "PENDING_FOR_WITHDRAWAL"
    ) {
      return "WITHDRAWAL";
    }
    if (this.qDetail.status === "CORRECTION_REQUEST") {
      return "CORRECTION";
    }
    return "QUESTION";
  }

  totalColumn(key, length) {
    let total = 0;
    if (this.qDetail && this.qDetail.rows && this.qDetail.rows.length > 0) {
      if (!length)
        total = this.qDetail.rows.reduce((prev, next) => prev + next[key], 0);
      else
        total = this.qDetail.rows.reduce((prev, next) => prev + next[key].length, 0);
    }
    return total ? total : "ഇല്ല";
  }
  getTaskActors(pId) {
    this.question
      .getWorkflowTaskActors(pId, this.auth.getCurrentUser())
      .subscribe((data: any) => {
        this.forwardTo = data.roles;
        this.currentRole = data.currentrole;
        if (this.auth.getCurrentUser().authorities.indexOf("speaker") !== -1) {
          this.ForwardButton = "Return";
        }
      });
  }
}
