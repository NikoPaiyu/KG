import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { QuestionService } from "../../shared/question.service";
import { Question } from "../../shared/model/question";
import { QuestionRBSService } from "../../shared/question-rbs.service";
import { NotificationCustomService } from "src/app/shared/services/notification.service";
import { AuthService } from "src/app/auth/shared/services/auth.service";
import { Location } from "@angular/common";
import { NzModalService, NzModalRef } from "ng-zorro-antd";
import { QuestionansPreviewComponent } from "../../shared/component/questionans-preview/questionans-preview.component";
import { ShortNoticePreviewComponent } from "../../shared/component/short-notice-preview/short-notice-preview.component";
import { TranslateService } from '@ngx-translate/core';

import * as jspdf from "jspdf";
@Component({
  selector: "app-question-view",
  templateUrl: "./question-view.component.html",
  styleUrls: ["./question-view.component.scss"],
})
export class QuestionViewComponent implements OnInit {
  bodyStyle = {
    overflow: "auto",
    "padding-bottom": "53px",
    display: "flex",
    "flex-direction": "column",
    height: "100%",
  };
  shortNoticeQuickOptions = false;
  showQuickOption = true;
  ruleChecked;
  disallowedReason = false;
  upper = ["A", "B", "C", "D", "E", "F", "G", "H"];
  shownotes = false;
  noteGiven = "";
  qDetail;
  reason = "";
  portfolio;
  ministerSubjects;
  ministerSubSubject;
  currentRuleStatement = "";
  quickOptions = [
    { label: "May be Admitted as starred", disallowStatus: false },
    {
      label: "May be Admitted as unstarred",
      disallowStatus: false,
      showDirection: true,
    },
    { label: "May be Disallowed", disallowStatus: true },
    { label: "May be Disallowed partially", disallowStatus: true },
    {
      label: "May be transferred to question date",
      disallowStatus: false,
      transferDate: true,
    },
    {
      label: "May be transferred to minister",
      disallowStatus: false,
      transferMinister: true,
    },
    {
      label: "May be transferred to both minister and question date",
      disallowStatus: false,
      tranferMinisterandDate: true,
    },
  ];
  quickOption = [
    { label: "May be Disallowed", disallowStatus: true },
    { label: "May be Disallowed partially", disallowStatus: true },
  ];
  noticeReason;
  ShowRules = false;
  directionList = [];
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
    prompt: "Do you want to claim this notice?",
  };
  ForwardButton = "Forward";
  currentRole;
  claimMessage = "";
  TDTMParams = {
    showTD: false,
    showTM: false,
    showMinisterandDate: false,
    TDData: [],
    TMData: [],
    TDTMLabel: "",
    TDSelData: "",
    TMSelData: "",
    selMinisterData: null,
    selDateData: null,
  };
  returnRoles = [];
  clubbRemovalWorkflow = [];
  clubbRemovedWorkflow: any;
  clubbingRemovalRequest = [];
  showDirection = false;
  qdateForCorrection = null;
  questionDate = [];
  showDate = false;
  clubbRemovlId = "";
  qDetailTemp: any;
  viewAuthorize: boolean = false;
  viewQuestionClubbing: boolean = false;
  mlaDetails = [];
  mlaDetailsTemp = [];
  questionForClubbing = [];
  mapOfCheckedId: { [key: string]: boolean } = {};
  numberOfChecked = [];
  searchParam = "";
  ClubbingRemovalPiD = "";
  editedNoteIndex = "";
  editedNoteData;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private question: QuestionService,
    private notify: NotificationCustomService,
    private auth: AuthService,
    public rbsService: QuestionRBSService,
    private location: Location,
    private modalService: NzModalService,
    private translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this.qDetail = new Question();
    this.route.params.subscribe((params) => {
      const questionId = params.id;
      this.statusParam = params.status;
      this.clubbRemovlId = params.clubbid ? params.clubbid : null;
      this.primaryFlag = params.isp;
      if (questionId && this.auth.getCurrentUser().userId) {
        this.question
          .getView(questionId, this.auth.getCurrentUser().userId)
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
          this.qDetailTemp = response;
          this.qDetail = response["question"];
          this.IsQsOfficials() ? this.getWrkflowUsers() : "";
          this.assemblySession["assemblyId"] = this.assemblySession["assembly"].find(
            (item) => item.id === this.qDetail.assemblyId
          ).assemblyId;
          this.assemblySession["sessionId"] = this.assemblySession["session"].find(
            (item) => item.id === this.qDetail.sessionId
          ).sessionId;
          this.handleResponse(response);
          this.showNoteQuickOptions();
        }
      });
  }
  handleResponse(response) {
    this.getRules();
    this.getAllDirections();
    this.loadRBSPermissions();
    this._handleResponseData();
    this._drawWorkflowTracking();
    this._bindData(response);
    this._setMinisterData(response);
    this.getNoteslist();
  }
  loadRBSPermissions() {
    this.rbsService
      .getQuestionPermissions(this.auth.getCurrentUser().userId)
      .subscribe((response) => {
        this.rbsPermission = this.rbsService.getButtonsInView(
          this.qDetail,
          this.auth.getCurrentUser(),
          this._isClubbingRemoval(),
          this.statusParam
        );
        this.rbsPermission.edit = this.rbsService.getQEditOptions(
          this.qDetail.status
        );
        this.rbsPermission.addnote = this._getADDnotePermission();
        this.statusParam === "CLAIMED"
          ? this.setDefaultAsClaimed()
          : this._drawClaimButtom();
        this.getCOCdatesForCorrection();
      });
  }
  getWrkflowUsers() {
    if (this.statusParam === "CLAIMED") {
      this.IdentifyClaimedTask();
      return;
    }
    switch (this.statusParam) {
      case "NORMAL":
        this.getTaskActors(this.qDetail.workFlowId);
        break;
      case "CORRECTION":
        break;
      case "CORRECTION_AFTER":
        this.getTaskActors(this.qDetail.correctionRequestAfterSabhaWorkFlowId);
        break;
      case "CLUBBING_REMOVE_QUESTION":
        this._isClubbingRemoval();
        this.getTaskActors(this.ClubbingRemovalPiD);
        break;
      case "CLUBBING_REMOVE":
        this._isClubbingRemoval();
        this.getTaskActors(this.ClubbingRemovalPiD);
        break;
      case "CORRECTION_REQUEST":
        this.getTaskActors(this.qDetail.correctionRequestWorkFlowId);
        break;
      case "SHORT_NOTICE":
        this.getTaskActors(this.qDetail.workFlowId);
        break;
      case "REVOKED":
        break;
      case "PENDING_FOR_WITHDRAWAL":
        this.getTaskActors(this.qDetail.withdrawelWorkFlowId);
        break;
      default:
        this.getTaskActors(this.qDetail.workFlowId);
        break;
    }
  }
  IdentifyClaimedTask() {
    if (
      this.qDetail.withdrawelStatus === "WITHDRAWEL_REQUESTED" &&
      this.qDetail.withdrawelWorkFlowId &&
      this.statusParam === "CLAIMED"
    ) {
      this.getTaskActors(this.qDetail.withdrawelWorkFlowId);
      return;
    }
    if (this.qDetail.status === "CHANGE_IN_REPLY_REQUEST") {
      this.getTaskActors(this.qDetail.correctionRequestWorkFlowId);
      return;
    }
    if (this.qDetail.status === "REQUEST_FOR_CORRECTION_OF_ANSWER") {
      this.getTaskActors(this.qDetail.correctionRequestAfterSabhaWorkFlowId);
      return;
    }
    if (this.statusParam === "CLAIMED" && this._isClubbingRemoval()) {
      this._isClubbingRemoval();
      this.getTaskActors(this.ClubbingRemovalPiD);
      return;
    }
    this.getTaskActors(this.qDetail.workFlowId);
    return;
  }
  getTaskActors(pId) {
    this.question
      .getWorkflowTaskActors(pId, this.auth.getCurrentUser())
      .subscribe((data: any) => {
        this.forwardTo = data.roles;
        this.currentRole = data.currentrole;
        if (
          this.auth.getCurrentUser().authorities.indexOf("speaker") !== -1
        ) {
          this.ForwardButton = "Return";
        }
      });
  }
  getCOCdatesForCorrection() {
    if (
      this.qDetail.status === "REQUEST_FOR_CORRECTION_OF_ANSWER" &&
      this.rbsPermission.CorrectionApprove
    ) {
      this.showDate = true;
      this.question
        .getCOSquestionDates(this.qDetail.assemblyId, this.qDetail.sessionId)
        .subscribe((Response: []) => {
          const today = new Date().toISOString().split("T")[0];
          this.questionDate = Response.filter((date) => date > today);
          this.questionDate = this.questionDate.filter(
            (v, i, a) => a.findIndex((t) => t === v) === i
          );
          this.questionDate.sort();
        });
    }
  }
  getAllDirections() {
    this.question.getAllDirections().subscribe((Response) => {
      this.directionList = Response;
    });
  }
  getActivityFlow() {
    this.question
      .getActivityFlow(this.qDetail.workFlowId)
      .subscribe((Response) => {
        this._handleWorkflow(Response)
      });
  }
  getWithdrawTracking() {
    if (this.qDetail.withdrawelWorkFlowId) {
      this.question
        .getActivityFlow(this.qDetail.withdrawelWorkFlowId)
        .subscribe((Response) => {
          this.withdrawFlowList = Response;
        });
    }
  }
  getClubbRemoveTracking() {
    let clubb;
    this.qDetail.clubbingDetails.forEach((element) => {
      if (
        element.withdrawalWorkflowId != null &&
        element.memberId == this.clubbRemovlId
      ) {
        this.question
          .getActivityFlow(element.withdrawalWorkflowId)
          .subscribe((Response) => {
            clubb = Response;
            clubb.memberDetails = element;
            this.clubbRemovalWorkflow.push(clubb);
          });
      }
    });
  }
  getCorrectionReqTracking() {
    if (this.qDetail.correctionRequestWorkFlowId) {
      this.question
        .getActivityFlow(this.qDetail.correctionRequestWorkFlowId)
        .subscribe((Response) => {
          this.correctionReqFlowList = Response;
        });
    }
    if (this.qDetail.correctionRequestAfterSabhaWorkFlowId) {
      this.question
        .getActivityFlow(this.qDetail.correctionRequestAfterSabhaWorkFlowId)
        .subscribe((Response) => {
          this.correctionReqFlowList = Response;
        });
    }
  }
  getRevokedNoticeTracking() {
    if (this.qDetail.revokedWorkFlowId) {
      this.question
        .getActivityFlow(this.qDetail.revokedWorkFlowId)
        .subscribe((Response) => {
          this.activityFlowList = Response;
          this.qDetail.revokedByName = this.activityFlowList
            .slice(-1)
            .pop().owner;
          if (this.qDetail.revokedWorkFlowId) {
            this.activityFlowList.push({
              processInstanceId: null,
              startTime: null,
              endTime: null,
              reason: "in progress",
              owner: "Revoked By " + this.qDetail.revokedByName,
              endWrkflow: true,
            });
          }
        });
    }
  }
  onBack(status) {
    localStorage.setItem("hasFilter", "true");
    if (
      this.auth
        .getCurrentUser()
        .authorities.includes("parliamentaryPartySecretary")
    ) {
      if (this.qDetail.questionNumber === null) {
        this.router.navigate(["list-mla-ntc"], { relativeTo: this.route.parent });
        //this.router.navigate(["business-dashboard/question/list-mla-ntc"]);
      } else {
        this.router.navigate(["list-mla-qus"], { relativeTo: this.route.parent });
        //this.router.navigate(["business-dashboard/question/list-mla-qus"]);
      }
    }
    if (this.IsQsOfficials()) {
      if (this.qDetail.type === "SHORT_NOTICE" && this.qDetail.questionNumber) {
        this.router.navigate(["/business-dashboard/question/snq-list"]);
        return;
      }
      if (this.isChange) {
        this.router.navigate([
          "business-dashboard/question/list-dept/IsChange",
        ]);
      }
      if (this.primaryFlag) {
        this.router.navigate([
          "business-dashboard/question/list-dept",
          this.statusParam,
          this.primaryFlag,
        ]);
      } else if (this.statusParam) {
        if (this.statusParam === "PENDING_FOR_WITHDRAWAL") {
          if (this.qDetail.questionNumber == null) {
            this.router.navigate([
              "business-dashboard/question/list-dept-ntc",
              this.statusParam,
            ]);
          } else {
            this.router.navigate([
              "business-dashboard/question/list-dept-qus",
              this.statusParam,
            ]);
          }
        } else if (this.statusParam === "WITHDRAWN") {
          if (this.qDetail.questionNumber == null) {
            this.router.navigate(["business-dashboard/question/withdr-list"]);
          } else {
            this.router.navigate([
              "business-dashboard/question/withdr-list-qus",
            ]);
          }
        } else if (this.statusParam === "PULL") {
          this.router.navigate(["business-dashboard/question/pull-list"]);
        } else if (this.statusParam === "TRACKALL") {
          this.router.navigate(["business-dashboard/question/all-list"]);
        } else if (this.statusParam === "CLUBBING_REMOVE" || this.statusParam === "CLUBBING_REMOVE_QUESTION") {
          this.router.navigate([
            "business-dashboard/question/list-dept-clubw",
            this.statusParam,
          ]);
        } else {
          this.router.navigate([
            "business-dashboard/question/list-dept",
            this.statusParam,
          ]);
        }
      } else {
        this.router.navigate(["business-dashboard/question/list-dept", status]);
      }
    } else if (this.isMLA()) {
      this._redirectToMlaList();
    } else if (this._IsAs()) {
      this.router.navigate(["business-dashboard/question/list-dept", status]);
    }
  }
  onEdit(questionId) {
    if (this.qDetail.questionDate < new Date().toISOString().split("T")[0]) {
      this.notify.showWarning(
        "Warning",
        "Sorry, You cannot edit past date notices"
      );
      return;
    }
    this.router.navigate([
      "business-dashboard/question/question-editsec",
      questionId,
      this.statusParam,
    ]);
  }
  handleNotes(boolean: boolean): void {
    this.shownotes = boolean;
    this.noteGiven = "";
  }
  getNoteslist() {
    this.question.getNotes(this.qDetail.id).subscribe((res: any) => {
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
  saveNotes(questionId) {
    if (
      this.qDetail.questionDate < new Date().toISOString().split("T")[0] &&
      this.checkForAfterSabha()
    ) {
      this.noteGiven = "";
      this.notify.showWarning(
        "Warning",
        "Adding notes for past date notices is not allowed"
      );
      return;
    }
    if (this.notesList.length > 0 && this._isAddedNote() && !this.editedNoteData) {
      this.noteGiven = "";
      this.notify.showWarning(
        "Warning",
        "Sorry, You can only edit existing Note"
      );
      return;
    }
    if (!this.noteGiven) {
      this.notify.showError("Error", "Plesae Enter Notes");
      return;
    }
    if(this.editedNoteData && this.editedNoteIndex !== null) {
     this.updateNotes(this.editedNoteIndex, questionId, this.editedNoteData);
     return;
    }
    this.question
      .postNotes(
        this.noteGiven,
        questionId,
        this.auth.getCurrentUser().userId,
        null
      )
      .subscribe((element) => {
        this.notify.showSuccess("Add Success", "");
        this.notesList.push(element);
        let i = this.notesList.length;
        this.notesList[i - 1].editNote = true;
        this.notesList[i - 1].noteditable = false;
        this.noteGiven = "";
        this.reason = "";
      });
  }
  updateNotes(index, questionId, note) {
    if (
      this.qDetail.questionDate < new Date().toISOString().split("T")[0] &&
      this.checkForAfterSabha()
    ) {
      this.noteGiven = "";
      this.notify.showWarning(
        "Warning",
        "Editing notes for past date notices is not allowed"
      );
      return;
    }
    if (!this.noteGiven) {
      this.notify.showError("Error", "Plesae Enter Notes");
      return;
    }
    this.question
      .postNotes(
        this.noteGiven,
        questionId,
        this.auth.getCurrentUser().userId,
        note.id
      )
      .subscribe((element) => {
        this.notesList[index].note = this.noteGiven;
        this.notesList[index].createDate = new Date();
        this.notesList[index].editNote = true;
        this.notesList[index].noteditable = false;
        this.editedNoteOn = false;
        this.reason = "";
        this.noteGiven = "";
        this.editedNoteIndex = "";
        this.editedNoteData = "";
        this.notify.showSuccess("Updated Successfully", "");
      });
  }
  checkForAfterSabha() {
    if (
      this.qDetail.status === "REQUEST_FOR_CORRECTION_OF_ANSWER" ||
      (this.qDetail.stage === "TAKEN" &&
        this.qDetail.requestCorrectionAfterSabha)
    ) {
      return false;
    }
    return true;
  }
  deleteNotes(questionid, index, noteId) {
    this.question.deleteNotes(questionid, noteId).subscribe((response) => {
      this.notify.showSuccess("Delete Success", "");
      this.notesList.splice(index, 1);
    });
  }
  editNotes(index, data): void {
   this.notesList[index].editNote = false;
   // this.notesList[index].noteditable = true;
    // this.notesList[index].noteditable == true
    //   ? (this.editedNoteOn = true)
    //   : (this.editedNoteOn = false);
    this.editedNote = this.noteGiven = this.notesList[index].note;
    this.editedNoteIndex = index;
    this.editedNoteData = data;
  }
  addQuickOptions(checked: boolean, tag: string, index: number): void {
    if (this.editedNoteOn) {
      this.checkforTag(this.editedNote)
        ? (this.editedNote = tag)
        : (this.editedNote = this.editedNote + tag);
    } else {
      this.checkforTag(this.noteGiven)
        ? (this.noteGiven = tag)
        : (this.noteGiven = this.noteGiven + tag);
    }
  }
  CheckforRules(checked: boolean, tag, index: number) {
    this.currentRuleStatement = tag.label;
    if (tag.disallowStatus) {
      this.ShowRules = true;
    } else if (tag.showDirection) {
      this.showDirection = true;
    } else if (tag.transferMinister) {
      this._applytransferMinisterOption(this.qDetail.questionDate, 'TM');
    } else if (tag.transferDate) {
      this._applytransferDateOption();
    } else if (tag.tranferMinisterandDate) {
      this._applytransferMinisterandDateOption();
    } else {
      this.addQuickOptions(checked, tag.label, index);
    }
  }
  _applytransferMinisterOption(questionDate, fromType) {
    this.question
      .getDesignationList(questionDate)
      .subscribe((response) => {
        if (Array.isArray(response)) {
          this.TDTMParams.TMData = [];
          response.forEach((element) => {
            if (element.id !== this.qDetail.respondentMemberId) {
              this.TDTMParams.TMData.push(element.name);
            }
          });
        }
        if (fromType === 'TM') {
          this.TDTMParams.showTM = true;
          this.TDTMParams.TDTMLabel = "Select Minister";
        }
      });
  }
  _applytransferDateOption() {
    this.question
      .getNoticeDate(this.qDetail.assemblyId, this.qDetail.sessionId)
      .subscribe((response) => {
        if (Array.isArray(response)) {
          response = response.filter(
            (date) => date > this.qDetail.questionDate
          );
          this._sortOnNoticeType(response);
          this.TDTMParams.showTD = true;
          this.TDTMParams.TDTMLabel = "Select Question Date";
        }
      });
  }
  _sortOnNoticeType(allquestionDates) {
    this.TDTMParams.TDData = allquestionDates
    this.TDTMParams.TDData = this.TDTMParams.TDData.filter(
      (v, i, a) => a.findIndex((t) => t === v) === i
    );
    this.TDTMParams.TDData.sort();
  }
  _applytransferMinisterandDateOption() {
    this.question
      .getDesignationList(this.qDetail.questionDate)
      .subscribe((response) => {
        if (Array.isArray(response)) {
          response.forEach((element) => {
            if (element.id !== this.qDetail.respondentMemberId) {
              this.TDTMParams.TMData.push(element.name);
            }
          });
        }
        this.question
          .getNoticeDate(this.qDetail.assemblyId, this.qDetail.sessionId)
          .subscribe((response) => {
            if (Array.isArray(response)) {
              response = response.filter(
                (date) => date > this.qDetail.questionDate
              );
              this._sortOnNoticeType(response);
              this.TDTMParams.selDateData = null;
              this.TDTMParams.selMinisterData = null;
              this.TDTMParams.showMinisterandDate = true;
            }
          });
      });
  }


  cancelTDTM() {
    this.TDTMParams.showTD = false;
    this.TDTMParams.showTM = false;
    this.TDTMParams.TDData = [];
    this.TDTMParams.TMData = [];
    this.TDTMParams.TDTMLabel = "";
    this.TDTMParams.TMSelData = null;
    this.TDTMParams.TDSelData = null;
    this.TDTMParams.showMinisterandDate = false;
    this.TDTMParams.selDateData = null;
    this.TDTMParams.selMinisterData = null;
  }
  selectTDTM() {
    if (this.editedNoteOn) {
      if (this.TDTMParams.showTD) {
        if (this.TDTMParams.TDSelData) {
          if (this.checkforTag(this.editedNote)) {
            this.editedNote = `${this.currentRuleStatement} :-  ${this.TDTMParams.TDSelData}`;
          } else {
            this.editedNote =
              this.editedNote +
              `${this.currentRuleStatement} :-  ${this.TDTMParams.TDSelData}`;
          }
          this.cancelTDTM();
        } else {
          this.notify.showWarning(
            "Sorry",
            "The date field can not be empty, please select one date"
          );
        }
      }
      if (this.TDTMParams.showTM) {
        if (this.TDTMParams.TMSelData) {
          if (this.checkforTag(this.editedNote)) {
            this.editedNote = `${this.currentRuleStatement} :-  ${this.TDTMParams.TMSelData}`;
          } else {
            this.editedNote =
              this.editedNote +
              `${this.currentRuleStatement} :-  ${this.TDTMParams.TMSelData}`;
          }
          this.cancelTDTM();
        } else {
          this.notify.showWarning(
            "Sorry",
            "The minister field can not be empty, please select one minister"
          );
        }
      }
      if (this.TDTMParams.showMinisterandDate) {
        if (this.TDTMParams.selDateData && this.TDTMParams.selMinisterData) {
          if (this.checkforTag(this.editedNote)) {
            this.editedNote = `May be transferred to minister :- ${this.TDTMParams.selMinisterData} , Question date :- ${this.TDTMParams.selDateData}`;
          } else {
            this.editedNote =
              this.editedNote +
              `May be transferred to minister :- ${this.TDTMParams.selMinisterData} , Question date :- ${this.TDTMParams.selDateData}`;
          }
          this.cancelTDTM();
        } else {
          this.notify.showWarning(
            "Sorry",
            "Please select both minister and question date"
          );
        }
      }
    } else {
      if (this.TDTMParams.showTD) {
        if (this.TDTMParams.TDSelData) {
          if (this.checkforTag(this.noteGiven)) {
            this.noteGiven = `${this.currentRuleStatement} :-  ${this.TDTMParams.TDSelData}`;
          } else {
            this.noteGiven =
              this.noteGiven +
              `${this.currentRuleStatement} :-  ${this.TDTMParams.TDSelData}`;
          }
          this.cancelTDTM();
        } else {
          this.notify.showWarning(
            "Sorry",
            "The date field can not be empty, please select one date"
          );
        }
      }
      if (this.TDTMParams.showTM) {
        if (this.TDTMParams.TMSelData) {
          if (this.checkforTag(this.noteGiven)) {
            this.noteGiven = `${this.currentRuleStatement} :-  ${this.TDTMParams.TMSelData}`;
          } else {
            this.noteGiven =
              this.noteGiven +
              `${this.currentRuleStatement} :-  ${this.TDTMParams.TMSelData}`;
          }
          this.cancelTDTM();
        } else {
          this.notify.showWarning(
            "Sorry",
            "The minister field can not be empty, please select one minister"
          );
        }
      }
      if (this.TDTMParams.showMinisterandDate) {
        if (this.TDTMParams.selDateData && this.TDTMParams.selMinisterData) {
          if (this.checkforTag(this.noteGiven)) {
            this.noteGiven = `May be transferred to minister :- ${this.TDTMParams.selMinisterData} , Question date :- ${this.TDTMParams.selDateData}`;
          } else {
            this.noteGiven =
              this.noteGiven +
              `May be transferred to minister :- ${this.TDTMParams.selMinisterData} , Question date :- ${this.TDTMParams.selDateData}`;
          }
          this.cancelTDTM();
        } else {
          this.notify.showWarning(
            "Sorry",
            "Please select both minister and question date"
          );
        }
      }
    }
  }
  checkforTag(data) {
    let istag = false;
    this.quickOptions.forEach((element) => {
      if (data.match(element.label)) {
        istag = true;
      }
    });
    return istag;
  }
  checkedRule(isChecked) {
    this.ruleChecked = this.ruleList.filter((x) => x.checked === true);
    const ruleCodes = this.ruleChecked.map((x) => x.code);
    const ruleDescription = this.ruleChecked.map((x) => x.englishDescription);
    let reasonSel  = this.buildReason(this.ruleChecked);
    reasonSel = reasonSel.replace(/,\s*$/, "");
    if (!isChecked) {
      if (this.ruleChecked.length == 0) {
        this.reason = " ";
        return;
      } else {
        this.reason =
          "Disallowing using the rule " + reasonSel;
        return;
      }
    }
    this.reason =
      "Disallowing using the rule " + reasonSel;
  }
  buildReason(ruleChecked) {
    let html = '';
    ruleChecked.forEach(element => {
      html += element.code + " :- " + element.englishDescription + ", ";
    });
    return html;
  }
  deleteQuestion(questionId: number) {
    this.question.deleteQuestion(questionId).subscribe((response) => {
      this.notify.showSuccess("Question Deleted Successfully", "");
    });
  }
  WithdrawQuestion(questionId: number) {
    let today = new Date();
    var curtime = today.getHours() + ":" + today.getMinutes();
    var curdate = today.toISOString().split("T")[0];
    let withdrawtime = "10:00";
    const getTime = (time) =>
      new Date(2019, 9, 2, time.substring(0, 2), time.substring(3, 5), 0, 0);
    let res = getTime(curtime) > getTime(withdrawtime);
    if (this.qDetail.questionDate == curdate && res) {
      this.notify.showWarning(
        "Sorry",
        "The time limit for withdrawn has expired"
      );
    } else {
      this.question
        .WithdrawQuestion(this.auth.getCurrentUser().userId, questionId)
        .subscribe((response) => {
          let msg =
            this.qDetail.status === "SUBMITTED_TO_PPO"
              ? "Notice Withdrawn Successfully"
              : "Question Withdrawn request send Successfully";
          this.notify.showSuccess(msg, "");
          this._redirectToMlaList();
        });
    }
  }
  _redirectToMlaList() {
    this.location.back();
  }
  RevokeQuestion(questionId: number) {
    if (this.qDetail.questionDate < new Date().toISOString().split("T")[0]) {
      this.notify.showWarning(
        "Warning",
        "Sorry, You cannot revoke past date notices"
      );
      return;
    }
    this.question
      .RevokeQuestion(
        this.auth.getCurrentUser().userId,
        questionId,
        this._findRole()
      )
      .subscribe((response) => {
        this.notify.showSuccess("Revoked Notice Successfully", "");
        this.onEdit(questionId);
      });
  }
  claimUnclaimQuestion(questionId: number) {
    this.question
      .claimUnclaimQuestion(
        questionId,
        this.auth.getCurrentUser().userId,
        this.claimParams["IsClaimed"],
        this._findRole(),
        this._claimType(),
        this._claimType() === "CLUBBED_WITHDRAWAL" ? this.clubbRemovlId : null
      )
      .subscribe((response) => {
        if (!this.claimParams["IsClaimed"]) {
          this._handleclaimActivity();
        } else {
          this._handleunclaimActivity();
        }
        this.notify.showSuccess(response["body"], "");
      });
  }
  ApproveChangeReply(questionId) {
    if (this.qDetail.questionDate < new Date().toISOString().split("T")[0]) {
      this.notify.showWarning(
        "Warning",
        "Sorry, You cannot approve past date notices"
      );
      return;
    }
    this.question
      .approveChangedReply(questionId, "approve")
      .subscribe((response) => {
        this.notify.showSuccess("Question approved for change reply", "");
        this.isChange = false;
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
      .forwardOradmitQuestion(
        this.qDetail,
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
    if (this._validateForwardNotice('NORMAL')) {
      this.question
        .forwardOradmitQuestion(
          this.qDetail,
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
  }
  forwardQuestionWithdrawal() {
    if (this._validateForwardNotice('WITHDRAWAL')) {
      this.question
        .forwardOradmitWithdrawReq(
          this.qDetail.id,
          this.forwardToQS,
          this.auth.getCurrentUser().userId,
          this._findRole()
        )
        .subscribe((element) => {
          this.notify.showSuccess("Successfully forwarded", "");
          this.onBack(this.qDetail.status);
        });
    }
  }
  admitQuestionWithdrawal() {
    this.question
      .forwardOradmitWithdrawReq(
        this.qDetail.id,
        null,
        this.auth.getCurrentUser().userId,
        this._findRole()
      )
      .subscribe((element) => {
        this.notify.showSuccess("Approved Successfully", "");
        this.onBack(this.qDetail.status);
      });
  }

  forwardCorrectionRequest() {
    if (this._validateForwardNotice('CORRECTION')) {
      this.question
        .forwardOradmitCorrectionReq(
          this.qDetail.id,
          this.forwardToQS,
          this.auth.getCurrentUser().userId,
          this._findRole(),
          null
        )
        .subscribe((element) => {
          this.notify.showSuccess("Successfully forwarded", "");
          this.onBack(this.qDetail.status);
        });
    }
  }
  admitCorrectionRequest() {
    if (this.showDate && this.qdateForCorrection == null) {
      this.notify.showWarning("Please Select Correction Date", "");
      return;
    }
    this.question
      .forwardOradmitCorrectionReq(
        this.qDetail.id,
        null,
        this.auth.getCurrentUser().userId,
        this._findRole(),
        this.qdateForCorrection
      )
      .subscribe((element) => {
        this.notify.showSuccess("Approved Successfully", "");
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
  showVersion() {
    this.router.navigate(["question-versions", this.qDetail.id,
      this.statusParam,
      "VIEW"],
      { relativeTo: this.route.parent });
  }
  showAnswerVersion() {
    this.router.navigate(["question-answer-versions", this.qDetail.id],
      { relativeTo: this.route.parent });
  }
  _bindData(response) {
    this.qDetail.clauses.sort((a, b) =>
      a.clauseOrder > b.clauseOrder ? 1 : -1
    );
  }
  showAnswer() {
    const clauses = this.qDetail.clauses;
    const today = new Date().toISOString().split("T")[0];
    let haveAns = clauses.some((val, i, arr) => val.answer && val.answer.type);
    return haveAns;
  }
  _IsMinister() {
    return this.auth.getCurrentUser().authorities.includes("minister");
  }
  _IsAs() {
    return this.auth.getCurrentUser().authorities.includes("Department");
  }
  IsQsOfficials() {
    if (this.auth.getCurrentUser().authorities.indexOf("speaker") !== -1) {
      return true;
    }
    if (
      this.auth.getCurrentUser().authorities.includes("MLA") ||
      this.auth
        .getCurrentUser()
        .authorities.includes("parliamentaryPartySecretary")
    ) {
      return false;
    }
    return true;
  }
  _setMinisterData(ministerDet) {
    this.ministerSubjects = ministerDet["ministerSubjects"]
      ? ministerDet["ministerSubjects"]
      : [];
    this.portfolio = ministerDet["portfolio"] ? ministerDet["portfolio"] : [];
    this.portfolio = this.portfolio.find(
      (o) => o.id === this.qDetail.respondentMemberId
    );
    this.ministerSubjects = this.ministerSubjects.find(
      (o) => o.id === this.qDetail.ministerSubjectId
    );
    if (this.qDetail.ministerSubSubjectId && this.ministerSubjects) {
      let subsubject = this.ministerSubjects.ministerSubSubjects.find(
        (el) => el.id == this.qDetail.ministerSubSubjectId
      );
      if (subsubject) this.qDetail.ministerSubSubjectName = subsubject.title;
    }
  }
  _getMinisterSubSubjectData(id) {
    if (
      this.ministerSubjects &&
      this.ministerSubjects.ministerSubSubjects.length > 0 &&
      id
    ) {
      return this.ministerSubjects.ministerSubSubjects.find(
        (element) => element.id == id
      );
    } else {
      return { title: "" };
    }
  }
  _getADDnotePermission() {
    if (
      this.qDetail.withdrawelStatus === "WITHDRAWEL_REQUESTED" &&
      this.qDetail.withdrawelWorkFlowId &&
      this.statusParam == "PENDING_FOR_WITHDRAWAL"
    ) {
      return true;
    }
    if (
      this.qDetail.status === "WITHDRAWN" ||
      this.qDetail.status === "DISALLOWED" ||
      this.qDetail.status === "ANSWERED" ||
      // this.qDetail.status === "WAITING_FOR_ANSWER" ||
      this.qDetail.withdrawelStatus === "WITHDRAWN" ||
      this.statusParam == "TRACKALL" ||
      (this.qDetail.status == "APPROVED" &&
        this.qDetail.approvedBy !== this.auth.getCurrentUser().userId)
    ) {
      return false;
    }
    return true;
  }
  _handleResponseData() {
    if (
      this.qDetail.requestChangeReply === true &&
      this.statusParam !== "PENDING_FOR_WITHDRAWAL"
    ) {
      this.isChange = true;
    }
    if (this.qDetail.tags) {
      this.qDetail.tags.sort((a, b) => (a.tagOrder > b.tagOrder ? 1 : -1));
    }
    this.qDetail.directions.forEach((element) => {
      if (element.prefix === "SHORT_NOTICE") {
        this.noticeReason = element.reason;
      }
    });
    if (this.qDetail.clubbingDetails) {
      this.qDetail.clubbingDetails.forEach((element) => {
        this.noticeNoArray.push(element.noticeNumber);
      });
      this.noticeNoArray.sort();
    }
    if (
      this.qDetail.type === "NORMAL" &&
      this.qDetail.status === "DISALLOWED"
    ) {
      this.disallowedReason = true;
    }
    if (
      this.qDetail.type === "SHORT_NOTICE" &&
      this.qDetail.status === "DISALLOWED"
    ) {
      this.disallowedShortNoticeReason = true;
      this.qDetail.directions.forEach((element) => {
        if (element.prefix === "DISALLOW") {
          this.shortNoticeRule = element.direction;
          this.shortNoticeReason = element.reason;
        }
      });
    }
    if (
      this.qDetail.type === "NORMAL" &&
      this.qDetail.category == "UNSTARRED" &&
      this.qDetail.directions.length > 0
    ) {
      let rulearray = [];
      rulearray = this.qDetail.directions.filter(
        (element) => element.type === "DIRECTION"
      );
      if (rulearray.length > 0) {
        const item = rulearray.reduce((prev, current) =>
          +prev.id > +current.id ? prev : current
        );
        this.changeCategoryReason = true;
        this.changeCategoryRule = item.direction;
      }
    }
  }
  _drawWorkflowTracking() {
    this.getActivityFlow();
    this.getWithdrawTracking();
    this.getRevokedNoticeTracking();
    this.getCorrectionReqTracking();
    this.getClubbRemoveTracking();
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
  canWithdrwfrwrdAsNotice() {
    if (
      (this.qDetail.questionNumber === null &&
        this.qDetail.withdrawelStatus === "WITHDRAWEL_REQUESTED") ||
      this.statusParam == "CLUBBING_REMOVE"
    ) {
      if (this.auth.getCurrentUser().authorities.indexOf("speaker") !== -1) {
        return false;
      }
    }
    if (
      this.qDetail.questionNumber &&
      this.qDetail.withdrawelStatus === "WITHDRAWEL_REQUESTED" &&
      this.qDetail.stage === "TAKEN"
    ) {
      if (this.auth.getCurrentUser().authorities.indexOf("speaker") !== -1) {
        return false;
      }
    }
    return true;
  }
  canShowClaimForWithdraw() {
    if (
      this.qDetail.questionNumber === null &&
      this.qDetail.withdrawelStatus === "WITHDRAWEL_REQUESTED"
    ) {
      let role = this.auth.getCurrentUser().authorities[0];
      if (this.auth.getCurrentUser().authorities.indexOf("speaker") !== -1) {
        role = "speaker";
      }
      let status = ["speaker", "secretary"];
      if (!status.includes(role)) {
        return false;
      }
    }
    return true;
  }
  canApproveWithdrwAsQues() {
    if (
      this.qDetail.questionNumber !== null &&
      this.qDetail.withdrawelStatus === "WITHDRAWEL_REQUESTED"
    ) {
      if (this.auth.getCurrentUser().authorities.indexOf("secretary") !== -1) {
        return false;
      }
    }
    return true;
  }
  isMLA() {
    if (this.auth.getCurrentUser().authorities.indexOf("speaker") !== -1) {
      return false;
    }
    return this.auth.getCurrentUser().authorities.includes("MLA");
  }
  isMLAPPO() {
    if (this.auth.getCurrentUser().authorities.indexOf("speaker") !== -1) {
      return false;
    }
    return (
      this.auth.getCurrentUser().authorities.includes("MLA") ||
      this.auth
        .getCurrentUser()
        .authorities.includes("parliamentaryPartySecretary")
    );
  }
  showModal(): void {
    this.ShowRules = true;
  }
  cancelRuleSelection() {
    this.ShowRules = false;
    this.disallowRules = false;
    this.showDirection = false;
    this.reason = "";
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.ruleList.length; i++) {
      if (this.ruleList[i].checked) {
        this.ruleList[i].checked = false;
      }
    }
    for (let i = 0; i < this.directionList.length; i++) {
      if (this.directionList[i].checked) {
        this.directionList[i].checked = false;
      }
    }
  }
  applyRule() {
    if (this.disallowRules) {
      this.disallowQuestion(this.qDetail.id);
      return;
    }
    let ruleApplyed = [];
    if (this.noteGiven || this.editedNote) {
      this.quickOptions.forEach((element) => {
        if (
          this.noteGiven.match(element.label) ||
          this.editedNote.match(element.label)
        ) {
          this.editedNote = this.noteGiven = "";
        } else {
          if (this.editedNoteOn) {
            this.editedNote = this.editedNote;
          } else {
            this.noteGiven = this.noteGiven;
          }
        }
      });
      this.noteGiven = this.noteGiven;
    } else {
      this.editedNote = this.noteGiven = "";
    }

    ruleApplyed = this.ruleList.filter((x) => x.checked === true);
    const ruleCodes = ruleApplyed.map((x) => x.code);
    const ruleDescription = ruleApplyed.map((x) => x.englishDescription);
    let reasonSel  = this.buildReason(ruleApplyed);
    reasonSel = reasonSel.replace(/,\s*$/, "");
    if (ruleApplyed.length > 0) {
      if (this.editedNoteOn) {
        this.editedNote = `${this.editedNote} ${this.currentRuleStatement} as per ${reasonSel} `;
      } else {
        this.noteGiven = `${this.noteGiven} ${this.currentRuleStatement} as per ${reasonSel} `;
      }
      this.selectedTags.push(
        `${this.currentRuleStatement} as per ${reasonSel}`
      );
    }
    this.cancelRuleSelection();
  }
  applyDirection() {
    let directionApplyed = [];
    if (this.noteGiven || this.editedNote) {
      this.quickOptions.forEach((element) => {
        if (
          this.noteGiven.match(element.label) ||
          this.editedNote.match(element.label)
        ) {
          this.editedNote = this.noteGiven = "";
        } else {
          if (this.editedNoteOn) {
            this.editedNote = this.editedNote;
          } else {
            this.noteGiven = this.noteGiven;
          }
        }
      });
      this.noteGiven = this.noteGiven;
    } else {
      this.editedNote = this.noteGiven = "";
    }
    directionApplyed = this.directionList.filter((x) => x.checked === true);
    const ruleCodes = directionApplyed.map((x) => x.code);
    const ruleDescription = directionApplyed.map((x) => x.englishDescription);
    if (directionApplyed.length > 0) {
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
    this.ShowRules = true;
  }

  cancelRule() {
    this.disallowRules = false;
    this.ShowRules = false;
  }

  getRules() {
    this.question.getRules().subscribe((Response) => {
      this.ruleList = Response;
    });
  }

  disallowQuestion(questionId: number) {
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
  _IsQuestion() {
    if (this.qDetail.questionNumber !== null) {
      return true;
    }
    return false;
  }

  createClaimMessage(): void {
    if (this.qDetail.status !== "DISALLOWED") {
      this.claimMessage = `This notice is claimed by ${this.qDetail.claimedUser}`;
    }
  }

  createPreviewModal() {
    if (this.qDetail.type === "SHORT_NOTICE") {
      this.modalService.create({
        nzContent: ShortNoticePreviewComponent,
        nzWidth: "800",
        nzFooter: null,
        nzComponentParams: {
          previewData: this.qDetailTemp,
          assembly: this.assemblySession["assemblyId"],
          session: this.assemblySession["sessionId"],
          hidePrint: false,
        },
      });
      return;
    }
    this.modalService.create({
      nzContent: QuestionansPreviewComponent,
      nzWidth: "800",
      nzFooter: null,
      nzComponentParams: {
        qDetail: this.qDetail,
        assembly: this.assemblySession["assemblyId"],
        session: this.assemblySession["sessionId"],
        ministersubject: this.ministerSubjects,
        portFolio: this.portfolio,
        statusParam: this.statusParam
      },
    });
  }
  removeMeFromClubbing(questionId) {
    let today = new Date();
    var curtime = today.getHours() + ":" + today.getMinutes();
    var curdate = today.toISOString().split("T")[0];
    let withdrawtime = "10:00";
    const getTime = (time) =>
      new Date(2019, 9, 2, time.substring(0, 2), time.substring(3, 5), 0, 0);
    let res = getTime(curtime) > getTime(withdrawtime);
    if (this.qDetail.questionDate == curdate && res) {
      this.notify.showWarning(
        "Sorry",
        "The time limit for removal has expired"
      );
    } else {
      this.question
        .removeMeFromClubbing(this.auth.getCurrentUser().userId, questionId)
        .subscribe((response) => {
          this.notify.showSuccess("Removal request send Successfully", "");
          this._redirectToMlaList();
        });
    }
  }
  forwardClubbRemoveQuestion() {
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
      .forwardClubbRemove(
        this.qDetail,
        this.qDetail.id,
        this.forwardToQS,
        this._findRole(),
        this._claimType() === "CLUBBED_WITHDRAWAL" ? this.clubbRemovlId : null
      )
      .subscribe((element) => {
        this.notify.showSuccess(
          "Successfully " + this.ForwardButton + "ed",
          ""
        );
        this.onBack(this.statusParam);
      });
  }
  admitClubbRemoveQuestion() {
    if (this.qDetail.questionDate < new Date().toISOString().split("T")[0]) {
      this.notify.showWarning(
        "Warning",
        "Sorry, You cannot admit past date notices"
      );
      return;
    }
    this.question
      .admitClubbRemove(
        this.qDetail,
        this.qDetail.id,
        this.auth.getCurrentUser().userId,
        this._findRole(),
        this._claimType() === "CLUBBED_WITHDRAWAL" ? this.clubbRemovlId : null
      )
      .subscribe((element) => {
        this.notify.showSuccess("Admitted Successfully", "");
        this.onBack(this.statusParam);
      });
  }
  capitalize(string) {
    if (typeof string !== "string") return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  DownloadFile(data) {
    if (this.checkURL(data)) {
      var img = new Image();
      img.src = data;
      this.generatePDF(img);
      return;
    }
    const link = document.createElement("a");
    link.setAttribute("target", "_blank");
    link.setAttribute("href", data);
    link.setAttribute("download", data);
    document.body.appendChild(link);
    link.click();
  }
  checkURL(url) {
    return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
  }
  generatePDF(img) {
    var doc = new jspdf("p", "mm", "a4");
    doc.addImage(img, "JPEG", 10, 10, 180, 200);
    var blob = doc.output("blob");
    window.open(URL.createObjectURL(blob));
    // doc.open();
  }
  correctionApproveAfterSabha() {
    let finalData = [];
    this.qDetail.clauses.forEach((clause) => {
      let answerData = {};
      answerData["clauseId"] = clause.id;
      answerData["id"] = clause.answer.id;
      answerData["answer"] = clause.answer.answer;
      answerData["type"] = clause.answer.type;
      answerData["clauseAnswerUrl"] = clause.answer.clauseAnswerUrl;
      finalData.push(answerData);
    });
    this.question
      .requestCorrectionStatement(
        finalData,
        this.qDetail.id,
        this.auth.getCurrentUser().userId,
        false
      )
      .subscribe((response) => {
        this.onBack(this.statusParam);
      });
  }
  _claimType() {
    if (
      this.qDetail.withdrawelStatus === "WITHDRAWEL_REQUESTED" &&
      this.qDetail.withdrawelWorkFlowId &&
      (this.statusParam === "PENDING_FOR_WITHDRAWAL" ||
        this.statusParam === "CLAIMED")
    ) {
      return "WITHDRAWAL";
    }
    if (this.qDetail.status === "CHANGE_IN_REPLY_REQUEST") {
      return "CORRECTION_BEFORE";
    }
    if (this.qDetail.status === "REQUEST_FOR_CORRECTION_OF_ANSWER") {
      return "CORRECTION_AFTER";
    }
    if (
      this.statusParam === "CLUBBING_REMOVE" ||
      this.statusParam === "CLUBBING_REMOVE_QUESTION" ||
      (this.statusParam === "CLAIMED" && this._isClubbingRemoval())
    ) {
      return "CLUBBED_WITHDRAWAL";
    }
    return "QUESTION";
  }
  basicPopup() {
    let popupWindow = window.open(
      this.qDetail.correctionAttachmentUrl,
      "popUpWindow",
      "height=800,width=800,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes"
    );
  }
  _handleclaimActivity() {
    this.qDetail.claimedBy = this.auth.getCurrentUser().userId;
    this.claimParams["IsClaimed"] = true;
    this.claimParams["BtnLbl"] = "Unclaim";
    this.claimParams["prompt"] = "Do you want to unclaim this notice?";
    this.claimParams["showClaimBtn"] = true;
  }
  _handleunclaimActivity() {
    this.qDetail.claimedBy = null;
    this.claimParams["IsClaimed"] = false;
    this.claimParams["BtnLbl"] = "Claim";
    this.claimParams["prompt"] = "Do you want to claim this notice?";
    this.claimParams["showClaimBtn"] = true;
  }
  _handleclaimMsg(claimedUser) {
    if (claimedUser === this.auth.getCurrentUser().userId) {
      this.claimParams["IsClaimed"] = true;
      this.claimParams["BtnLbl"] = "Unclaim";
      this.claimParams["prompt"] = "Do you want to unclaim this notice?";
      this.claimParams["showClaimBtn"] = true;
    } else if (claimedUser == null) {
      this.claimParams["showClaimBtn"] = true;
    } else if (claimedUser) {
      this.createClaimMessage();
    }
  }
  _drawClaimButtom() {
    let status = [
      "PENDING_FOR_WITHDRAWAL",
      "DISALLOWED",
      "APPROVED",
      "ANSWERED",
      "WITHDRAWN",
      // "WAITING_FOR_ANSWER",
      "CLUBBING_REMOVE",
      // "CLUBBING_REMOVE_QUESTION",
      //  "TAKEN",
    ];
    let claimedType = [
      "WITHDRAWAL",
      "CORRECTION_BEFORE",
      "CORRECTION_AFTER",
      "QUESTION",
      "CLUBBED_WITHDRAWAL",
    ];
    let claimedUser = this.findclaimedUser();
    this.claimParams["IsClaimed"] = false;
    if (this.statusParam === 'CORRECTION') {
      this.claimParams["IsClaimed"] = true;
      this.claimParams["showClaimBtn"] = false;
      return;
    }
    for (var i = 0; i < claimedType.length; ++i) {
      if (
        (claimedType[i] === this._claimType() &&
          claimedUser === this.auth.getCurrentUser().userId) ||
        (claimedUser === null &&
          !this.qDetail.requestChangeReply &&
          !status.includes(this.qDetail.status)) ||
        this.qDetail.withdrawelStatus === "WITHDRAWEL_REQUESTED"
      ) {
        this._handleclaimMsg(claimedUser);
        return;
        break;
      }
    }
    if (
      this.rbsPermission.Revoke === true ||
      status.includes(this.qDetail.status) ||
      status.includes(this.qDetail.withdrawelStatus) ||
      status.includes(this.statusParam) ||
      this.qDetail.requestCorrectionAfterSabha
    ) {
      this.claimParams["IsClaimed"] = true;
      this.claimParams["showClaimBtn"] = false;
      this.claimMessage = "";
    }
  }
  findclaimedUser() {
    if (this._claimType() === "WITHDRAWAL") {
      return this.qDetail.withdrawalClaimedBy;
    }
    if (this._claimType() === "CORRECTION_BEFORE") {
      return this.qDetail.correctionBeforeClaimedBy;
    }
    if (this._claimType() === "CORRECTION_AFTER") {
      return this.qDetail.correctionAfterClaimedBy;
    }
    if (this._claimType() === "CLUBBED_WITHDRAWAL") {
      for (var i = 0; i <= this.qDetail.clubbingDetails.length; i++) {
        let clubb = this.qDetail.clubbingDetails[i];
        if (
          clubb.withdrawalWorkflowId != null &&
          clubb.memberId == this.clubbRemovlId
        ) {
          if (
            clubb.clubbedWithdrawalClaimedBy ==
            this.auth.getCurrentUser().userId
          ) {
            return clubb.clubbedWithdrawalClaimedBy;
            break;
          } else {
            return null;
          }
        }
      }
    }
    if (this._claimType() === "QUESTION") {
      return this.qDetail.claimedBy;
    }
  }
  _isWithdrawn() {
    if (this.qDetail.withdrawelStatus === "WITHDRAWN") {
      return true;
    }
    return false;
  }
  _isWithdrawlGiven() {
    if (
      this.qDetail.withdrawelStatus === "WITHDRAWN" ||
      this.qDetail.withdrawelStatus === "WITHDRAWEL_REQUESTED"
    ) {
      return true;
    }
    return false;
  }
  _isClubbingRemoval() {
    let isClubbingRemoval = false;
    if (
      this.statusParam === "CLUBBING_REMOVE" ||
      this.statusParam === "CLUBBING_REMOVE_QUESTION" ||
      this.statusParam === "CLAIMED"
    ) {
      this.qDetail.clubbingDetails.forEach((element) => {
        if (element.withdrawalWorkflowId != null) {
          isClubbingRemoval = true;
          this.ClubbingRemovalPiD = element.withdrawalWorkflowId;
        }
      });
    }
    return isClubbingRemoval;
  }
  canShowActionButtons() {
    let status = ["TRACKALL", "ALL_ANSWERED", "SNQ_LIST"];
    if (!status.includes(this.statusParam)) {
      return true;
    }
    return false;
  }
  canShowNoteVersion() {
    let status = ["TRACKALL"];
    if (!status.includes(this.statusParam)) {
      return true;
    }
    return false;
  }
  canshowAuthAndClubbQuestion() {
    const today = new Date().toISOString().split("T")[0];
    if (this.qDetail.category === "STARRED" && this.qDetail.type === "NORMAL") {
      if (
        this.qDetail.questionDate > today &&
        this.auth.getCurrentUser().userId === this.qDetail.primaryMemberId
      ) {
        if (this._IsQuestion() && !this._isWithdrawlGiven() && this.isMLA()) {
          return true;
        }
      }
    }
    return false;
  }
  getMemberList() {
    if (this.mlaDetailsTemp.length > 0) {
      this.viewAuthorize = true;
      return;
    }
    let counter = 0;
    let arr = [];
    this.question.getAllMembersList().subscribe((members) => {
      if (Array.isArray(members)) {
        let primaryMemDetails = members.find(
          (item) => item.details.id === this.qDetail.primaryMemberId
        );
        members.forEach((ele) => {
          counter++;
          if (
            ele.details &&
            ele.details.memberGroup !== "TREASURY_BENCH" &&
            ele.details.id !== this.qDetail.primaryMemberId
          ) {
            if (
              ele.details.keralaConstituencyId &&
              primaryMemDetails.details.memberGroup === ele.details.memberGroup
            ) {
              arr.push(ele.details);
            }
          }
          if (counter === members.length) {
            this.mlaDetailsTemp = this.mlaDetails = arr;
            this.viewAuthorize = true;
          }
        });
      }
    });
  }
  checkMember(id): void {
    if (this.numberOfChecked.length >= 1) {
      this.numberOfChecked.forEach((element) => {
        if (element.id !== id) {
          this.mapOfCheckedId[element.id] = false;
        }
      });
    }
    this.numberOfChecked = this.mlaDetails.filter(
      (item) => this.mapOfCheckedId[item.id]
    );
  }
  onCancelAuthorization() {
    this.viewAuthorize = false;
    this.numberOfChecked.forEach((element) => {
      this.mapOfCheckedId[element.id] = false;
    });
  }
  onSubmitAuthorization() {
    if (this.numberOfChecked.length === 0) {
      this.notify.showWarning("Warning", "Choose Member");
      return;
    }
    let body = {
      authorisingFrom: this.auth.getCurrentUser().userId,
      fromMember: this.auth.getCurrentUser().fullName,
      questionHeading: this.qDetail.heading,
      authorisingTo: this.numberOfChecked[0]["id"],
      toMember: this.numberOfChecked[0]["fullName"],
      questionId: this.qDetail.id,
    };
    this.question.authorizeQuestion(body).subscribe((res) => {
      this.notify.showSuccess(res.body, "");
      this.viewAuthorize = false;
    });
  }
  onSearchMember() {
    if (this.searchParam) {
      this.mlaDetails = this.mlaDetailsTemp.filter(
        (element) =>
          (element.fullName &&
            element.fullName
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.keralaConstituencyName &&
            element.keralaConstituencyName
              .toLowerCase()
              .includes(this.searchParam.toLowerCase()))
      );
    } else {
      this.mlaDetails = this.mlaDetailsTemp;
    }
  }
  getClubbingQuestions() {
    if (this.questionForClubbing.length > 0) {
      this.viewQuestionClubbing = true;
      return;
    }
    let counter = 0;
    let arr = [];
    const today = new Date().toISOString().split("T")[0];
    this.question
      .getQuestionByStatus(
        this.qDetail.assemblyId,
        this.qDetail.sessionId,
        "",
        null,
        "NORMAL",
        null
      )
      .subscribe((questions) => {
        if (Array.isArray(questions)) {
          questions.forEach((q) => {
            counter++;
            if (this.qDetail.stage === 'QUESTION' || this.qDetail.stage === 'TAKEN') {
              if (q.category === "STARRED" && q.questionDate > today) {
                if (
                  q.withdrawelStatus === "NOT_REQUESTED" &&
                  q.id !== this.qDetail.id &&
                  q.questionDate === this.qDetail.questionDate
                ) {
                  arr.push(q);
                }
              }
            }
            if (counter === questions.length) {
              this.questionForClubbing = arr;
              this.viewQuestionClubbing = true;
            }
          });
        }
      });
  }
  selQuestion(id): void {
    if (this.numberOfChecked.length >= 1) {
      this.numberOfChecked.forEach((element) => {
        if (element.id !== id) {
          this.mapOfCheckedId[element.id] = false;
        }
      });
    }
    this.numberOfChecked = this.questionForClubbing.filter(
      (item) => this.mapOfCheckedId[item.id]
    );
  }
  onCancelClubbing() {
    this.viewQuestionClubbing = false;
  }
  onSubmitClubbing() {
    if (this.numberOfChecked.length === 0) {
      this.notify.showWarning("Warning", "Choose Question");
      return;
    }
    let body = {
      clubbingQuestion: this.numberOfChecked[0].id,
      masterQuestion: this.qDetail.id,
      requestedBy: this.auth.getCurrentUser().userId,
    };
    this.question.createClubbingRequest(body).subscribe((res) => {
      this.notify.showSuccess(res.body, "");
      this.viewQuestionClubbing = false;
    });
  }
  setDefaultAsClaimed() {
    this.claimParams["IsClaimed"] = true;
    this.claimParams["BtnLbl"] = "Unclaim";
    this.claimParams["prompt"] = "Do you want to unclaim this notice?";
    this.claimParams["showClaimBtn"] = true;
  }
  isNavigateFromAns() {
    if (this.statusParam === 'ALL_ANSWERED') {
      return true;
    }
    return false;
  }
  updateClauseType(clause) {
    this.question.resetAnswer(clause.answer.id, this.qDetail.id).subscribe((Response) => {
      this.notify.showSuccess("Success", "");
      clause.answer.type = 'INTERIM';
    });
  }
  finaliseQuestionAnswer() {
    this.question.finaliseQuestionAnswer(this.qDetail.id).subscribe((response) => {
      this.notify.showSuccess("Success", "");
      this.onBack(this.qDetail.status);
    });
  }
  showFinalizeBtn() {
    if (this.isNavigateFromAns()) {
      if (this.qDetail.clauses && this.isAllAnswered() && this.qDetail.stage === 'QUESTION') {
        return true;
      }
    }
    return false;
  }
  canChangeAnsType(answer) {
    if (this.isNavigateFromAns()) {
      if (answer.type === 'FINAL' || answer.type === 'INTERIM') {
        // if (this.qDetail.stage === 'QUESTION') {
        return true;
        //}
      }
    }
    return false;
  }
  isAllAnswered() {
    return (this.qDetail.clauses.some(
      (val, i, arr) => val.answer && val.answer.type
    ));
  }
  showNoteQuickOptions() {
    if (this.qDetail.type === "SHORT_NOTICE") {
      this.shortNoticeQuickOptions = true;
    }
    if (
      this.qDetail.withdrawelStatus === "WITHDRAWEL_REQUESTED" ||
      this.qDetail.status === "REQUEST_FOR_CORRECTION_OF_ANSWER" ||
      this.qDetail.status === "CHANGE_IN_REPLY_REQUEST" ||
      (this.qDetail.stage === "TAKEN" &&
        this.qDetail.requestCorrectionAfterSabha)
    ) {
      this.showQuickOption = false;
    }
  }
  canMLAPerformActions() {
    let today = new Date();
    var curtime = today.getHours() + ":" + today.getMinutes();
    var curdate = today.toISOString().split("T")[0];
    let timeEnd = "10:00";
    const getTime = (time) =>
      new Date(2019, 9, 2, time.substring(0, 2), time.substring(3, 5), 0, 0);
    let timeExpires = getTime(curtime) > getTime(timeEnd);
    if (this.qDetail.questionDate == curdate && timeExpires) {
      return false;
    }
    return true;
  }
  _validateForwardNotice(type) {
    if (type === 'NORMAL') {
      if (!this.qDetail.ministerSubSubjectId) {
        this.notify.showWarning(this.translate.instant('Warning'),
          this.translate.instant('business-dashboard.question.addministersubsubject'));
        return false;
      }
    }
    if (type !== 'CORRECTION') {
      if (this.qDetail.questionDate < new Date().toISOString().split("T")[0]) {
        this.notify.showWarning(this.translate.instant('Warning'),
          this.translate.instant('business-dashboard.question.errpastdates'));
        return false;
      }
    }
    if (!this.forwardToQS) {
      this.notify.showWarning(this.translate.instant('Warning'),
        this.translate.instant('business-dashboard.question.errselrole'));
      return false;
    }
    return true;
  }
  _handleWorkflow(Response) {
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
    this._handlewithdrawWorkflow();
    if (
      this.qDetail.status === "DISALLOWED" &&
      this.qDetail.disallowedBy &&
      !this.qDetail.revokedWorkFlowId
    ) {
      let lastIndex = this.activityFlowList.slice(-1).pop();
      lastIndex.owner = "Disallowed By " + lastIndex.owner;
      lastIndex.endWrkflow = true;
    }
  }
  _handlewithdrawWorkflow() {
    if (this.qDetail.withdrawelWorkFlowId) {
      if (this.qDetail.withdrawelStatus === "WITHDRAWEL_REQUESTED" || this.qDetail.withdrawelStatus === "WITHDRAWN") {
        this.activityFlowList.push({
          processInstanceId: null,
          startTime: null,
          endTime: null,
          reason: "in progress",
          owner: "MLA",
          endWrkflow: true,
        });
      }
    }
  }
  displayNoteOwnr(note) {
    if(note && note.owner && note.owner.roles) {
      let role = note.owner.roles.find(
        (item) => item.roleName === "Speaker"
      );
      if(role) { return role.roleName;}
      return note.owner.roles[0].roleName;
    }
  }
}
