import { Component, OnInit, Input, ElementRef, ViewChild } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormControl,
} from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { QuestionService } from "../../shared/question.service";
import { QuestionRBSService } from "../../shared/question-rbs.service";
import { NotificationCustomService } from "src/app/shared/services/notification.service";
import { Observable } from "rxjs";
import { AuthService } from "src/app/auth/shared/services/auth.service";
import { differenceInCalendarDays } from "date-fns";
import { NzModalService } from "ng-zorro-antd";
import { QuestionduplicateComponent } from "../../shared/component/questionduplicate/questionduplicate.component";
import { Location } from "@angular/common";
import * as moment from "moment";

@Component({
  selector: "app-question-edit",
  templateUrl: "./question-editdept.component.html",
  styleUrls: ["./question-editdept.component.scss"],
})
export class QuestionEditDeptComponent implements OnInit {
  showClauseTag = [];
  bodyStyle = {
    overflow: "auto",
    "padding-bottom": "53px",
    display: "flex",
    "flex-direction": "column",
    height: "100%",
  };
  shortNoticeQuickOption = false;
  ruleChecked;
  clauseIndex;
  ShowRules = false;
  currentRuleStatement = "";
  directionList = [];
  visible = false;
  tags = [];
  @Input() value = "";
  validateForm: FormGroup;
  validateTDForm: FormGroup;
  ministers: object = [];
  ministerSubject = [];
  questionDate: any;
  allquestionDates: any;
  ministerSubSubject: any;
  memberGroup;
  upper = ["A", "B", "C", "D", "E", "F", "G", "H"];
  selMlaArray = [];
  ministerGroupId;
  editableFields: any;
  qDetail;
  buttonlist;
  showAddMla = false;
  showAddTag = false;
  ministerSubjects;
  portfolio;
  shownotes = false;
  notesList = [];
  mlalist;
  mlalistTemp;
  partyId;
  questionID;
  disallowRules = false;
  showDirection = false;
  transfarableDate: any = [];
  ruleList: any;
  reason = "";
  editedNoteOn = false;
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
  selectedTags = [];
  noteGiven = "";
  editedNote;
  forwardTo;
  forwardToQS;
  count = 1;
  clubbableMLACount;
  clauseWordCount;
  showWordCount;
  clauseMaxCount;
  clauseCount;
  dateFormat = "dd-MM-yyyy";
  activityFlowList: any;
  revokeFlowList: any;
  primaryMember;
  str: any;
  assemblySession: object = [];
  changeCategoryReason = false;
  changeCategoryRule = "";
  today = "";
  priorityList: any = ["P1", "P2", "P3"];
  validCategory: boolean = true;
  statusParam = "";
  versionsCombo = [];
  selectedVersionV1;
  v1: any = {};
  v2: any = {};
  showFileInfo = false;
  loading = true;
  ForwardButton = "Forward";
  currentRole;
  currentVersion;
  disableStarred = false;
  configurableParms = {};
  TDTMParams = {};
  editedNoteIndex = "";
  editedNoteData;
  @ViewChild("tagInput", { static: false }) inputElement: ElementRef;
  constructor(
    private fb: FormBuilder,
    private question: QuestionService,
    private notify: NotificationCustomService,
    private route: ActivatedRoute,
    private auth: AuthService,
    private router: Router,
    private modalService: NzModalService,
    private rbsService: QuestionRBSService,
    private location: Location
  ) {
    this.today = new Date().toISOString().split("T")[0];
  }

  ngOnInit(): void {
    this.primaryMember = this.auth.getCurrentUser();
    this.route.params.subscribe((params) => {
      if (params["id"]) {
        this.statusParam = params.status;
        this.questionID = params["id"];
        this._loadData();
        this._setConfigParam();
        this.formValidation();
        this.getNoteslist();
        this.getAllDirections();
        this.getRules();
      }
    });
  }
  _loadData() {
    this.getEditQuestion();
  }
  _setConfigParam() {
    this.configurableParms = {
      minTitleChar: 0,
      maxTitleChar: 100,
      minClauseWord: 0,
      maxReasonChar: 255,
    };
    this.TDTMParams = {
      showTD: false,
      showTM: false,
      TMData: [],
      TDData: [],
      ministerSubjects: [],
      ministerSubSubjects: [],
      TDTMLabel: "",
      TDSelData: "",
      TMSelData: "",
      showMinisterandDate: false,
      showTDPopup: false,
      selMinisterData: null,
      selDateData: null,
    };
  }
  getVersionsInittaiDetails() {
    if (this.questionID) {
      this.question.getVersionsList(this.questionID).subscribe((res: any) => {
        this.versionsCombo = res.versionDtails;
        this.versionsCombo.forEach((element) => {
          if (element.owner.roles.length > 1) {
            element.owner.roles.forEach((ele) => {
              if (ele.roleName == "speaker") {
                element.ROLE = "Speaker";
              }
            });
          } else {
            element.ROLE = element.owner.roles[0].roleName;
          }
          this.currentVersion = element.ROLE;
        });
        this.v1 = res.mlaVersion;
        this.loading = false;
        if (
          this.v1.question.assemblyId &&
          this.v1.question.sessionId &&
          this.assemblySession
        ) {
          this.v1.question.assemblyId = this.assemblySession["assembly"].find(
            (item) => item.id === this.v1.question.assemblyId
          ).assemblyId;
          this.v1.question.sessionId = this.assemblySession["session"].find(
            (item) => item.id === this.v1.question.sessionId
          ).sessionId;
        }
        this.versionsCombo.forEach(async (item) => {
          if (item.version === 1) {
            this.selectedVersionV1 = item.id;
          }
        });
      });
    }
  }
  getVersionDetailsById(versionId) {
    this.question.getVersionById(versionId).subscribe((res) => {
      this.v1 = {};
      this.v1 = res;
      if (
        this.v1.question.assemblyId &&
        this.v1.question.sessionId &&
        this.assemblySession
      ) {
        this.v1.question.assemblyId = this.assemblySession["assembly"].find(
          (item) => item.id === this.v1.question.assemblyId
        ).assemblyId;
        this.v1.question.sessionId = this.assemblySession["session"].find(
          (item) => item.id === this.v1.question.sessionId
        ).sessionId;
      }
    });
  }
  showFileInfoPopUp(status) {
    this.showFileInfo = status;
  }

  getAssemblySession() {
    this.question.getAllAssemblyAndSession().subscribe((res) => {
      if (res) {
        this.assemblySession = res;
        this.assemblySession["session"] = this.findSessionListByAssembly(this.assemblySession['assembly'].currentassembly, this.assemblySession["sessionByAssembly"]);
          this.assemblySession["assembly"].currentassemblyLabel = this.assemblySession["assembly"].find(
            (item) => item.id === this.qDetail.question.assemblyId
          ).assemblyId;
          this.assemblySession["assembly"].currentassembly = this.assemblySession["assembly"].find(
            (item) => item.id === this.qDetail.question.assemblyId
          ).id;
          this.assemblySession["session"].currentsessionLabel = this.assemblySession["session"].find(
            (item) => item.id === this.qDetail.question.sessionId
          ).sessionId;
          this.assemblySession["session"].currentsession = this.assemblySession["session"].find(
            (item) => item.id === this.qDetail.question.sessionId
          ).id;
          this.getVersionsInittaiDetails();
          this._setQuestionDate();
        }
    });
  }
  findSessionListByAssembly(currentassembly, assemblySession) {
    let session = assemblySession.find(
      (element) => element.id === currentassembly).session;
      return session;
  }
  getTaskActors(pId) {
    if (this._IsQs()) {
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
  }
  getQuestionDateListOnSession() {
    const session = this.validateForm.value.sessionId;
    if (this.qDetail.question.assemblyId && session) {
      this.question
        .getNoticeDate(this.qDetail.question.assemblyId, session)
        .subscribe((response) => {
          if (Array.isArray(response)) {
            this.questionDate = this.allquestionDates = response.filter(
              (date) => date > this.today
            );
            this.questionDate = this.questionDate.filter(
              (v, i, a) => a.findIndex((t) => t === v) === i
            );
            //this._sortOnNoticeType(); // no need of 10 days filtering
          }
          this.validateForm.controls.ministerSubject.reset();
          this.validateForm.controls.portfolio.reset();
          this.portfolio = null;
          this.validateForm.controls.questionDate.reset();
        });
    }
  }
  getAllDirections() {
    this.question.getAllDirections().subscribe((Response) => {
      this.directionList = Response;
    });
  }
  getNoteslist() {
    this.question.getNotes(this.questionID).subscribe((res: any) => {
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
  getActivityFlow() {
    this.question
      .getActivityFlow(this.qDetail.question.workFlowId)
      .subscribe((Response) => {
        if (this.qDetail.question.revokedWorkFlowId) {
          this.revokeFlowList = Response;
          if (this.revokeFlowList[0].owner == "assistant") {
            this.revokeFlowList.shift();
          }
        } else {
          this.activityFlowList = Response;
        }
      });
  }
  getRevokedNoticeTracking() {
    if (this.qDetail.question.revokedWorkFlowId) {
      this.question
        .getActivityFlow(this.qDetail.question.revokedWorkFlowId)
        .subscribe((Response) => {
          this.activityFlowList = Response;
          this.qDetail.question.revokedByName = this.activityFlowList
            .slice(-1)
            .pop().owner;
          if (this.qDetail.question.status === "REVOKED") {
            this.activityFlowList.push({
              processInstanceId: null,
              startTime: null,
              endTime: null,
              reason: "in progress",
              owner: "Revoked By " + this.qDetail.question.revokedByName,
              endWrkflow: true,
            });
          }
        });
    }
  }
  formValidation() {
    this.validateForm = this.fb.group({
      assemblyId: [null, [Validators.required]],
      sessionId: [null, [Validators.required]],
      portfolio: [null, [Validators.required]],
      questionDate: [null, [Validators.required]],
      category: [null, [Validators.required]],
      priority: [null],
      ministerSubject: [null, [Validators.required]],
      subSubjectId: [null, [Validators.required]],
      heading: [null, [Validators.required]],
      clauses: this.fb.array([]),
      clubbingDetails: [null, [Validators.required]],
      tags: [null],
      forwardToQS: [null],
      primaryMember: [null],
      partyName: [null],
      transfarableDate: [null],
    });
    this.validateTDForm = this.fb.group({
      transfarableDate: [null, [Validators.required]],
      portfolio: [null, [Validators.required]],
      ministerSubject: [null, [Validators.required]],
      subSubjectId: [null, [Validators.required]],
    });
  }
  getEditQuestion() {
    this.question
      .getView(this.questionID, this.auth.getCurrentUser().userId)
      .subscribe((response) => {
        this.question.getClubbableMLACount().subscribe((count) => {
          this.clubbableMLACount = count;
          this.question.getClauseCount().subscribe((count1) => {
            this.clauseMaxCount = count1;
            this.question.getClauseWordCount().subscribe((count1) => {
              this.showWordCount = count1;
              this.clauseWordCount = this.showWordCount;
              this.qDetail = response;
              this.qDetail.question.tmpQDate = 
                        this.qDetail.question.questionDate
              this.getTaskActors(this.qDetail.question.workFlowId);
              if (this.qDetail.question.type === "SHORT_NOTICE") {
                this.shortNoticeQuickOption = true;
              }
              this.getAssemblySession();
              this.count = this.qDetail.question.clubbingDetails.length;
              this.loadRBSPermissions();
              this.getMinisterSubSubject(
                this.qDetail.question.ministerSubjectId
              );
              this.getDesignationData(response).then((value) =>
                console.log("çomplete") 
              );
            });
          });
        });
      });
  }
  async getDesignationData(response) {
    if (this.qDetail.question.questionDate == null) {
      this.qDetail.portfolio = [];
      return;
    }
    this.question
      .getDesignationList(this.qDetail.question.questionDate)
      .subscribe((designation) => {
        if (this.qDetail.question.type === "SHORT_NOTICE") {
          this.qDetail.portfolio = this.qDetail.portfolio
            ? this.qDetail.portfolio
            : [];
        } else {
          this.qDetail.portfolio = designation ? designation : [];
        }
        this.question
          .getMinisterSubject(this.qDetail.question.respondentMemberId)
          .subscribe((ministersub) => {
            this.qDetail.ministerSubject = ministersub ? ministersub : [];
            new Observable((execute) => {
              execute.next(this.getActivityFlow());
              execute.next(this.getRevokedNoticeTracking());
              execute.next(this._setMinisterData(response));
              execute.next(this._setMinisterSubSubjectData());
              execute.next(this._setClubbedMemberData(response));
              execute.next(this.getTransfarableDate());
              execute.next(this.editNewQuestion());
              if (this.qDetail.question.status === "SAVED") {
                execute.next(this._getExistingQuestionCount());
              }
              execute.complete();
            }).subscribe((res) => {});
          });
      });
  }
  loadRBSPermissions() {
    this.rbsService
      .getQuestionPermissions(this.auth.getCurrentUser().userId)
      .subscribe(() => {
        this.buttonlist = this.rbsService.getButtonsInEdit(
          this.qDetail.question,
          this.auth.getCurrentUser().userId
        );
        this.editableFields = this.rbsService.getQEditOptions(
          this.qDetail.question.status
        );
        if (
          this.qDetail.question.status != "SAVED" &&
          this.editableFields.categoryEdit &&
          this.qDetail.question.category == "UNSTARRED" &&
          this.auth.getCurrentUser().authorities.includes("secretary")
        ) {
          this.editableFields.categoryEdit = false;
        }
      });
  }
  onInput() {
    console.log("clicked");
  }
  onPaste(event: ClipboardEvent, i) {
    var max = this.clauseWordCount;
    var clipboardData = event.clipboardData;
    let pastedData = clipboardData.getData("Text");
    var wordCount = this.getWordCountOnPaste(pastedData);
    if (wordCount > max) {
      event.preventDefault();
      this.notify.showWarning(
        "Warning",
        "Cannot paste! Maximum Wordlimit" + this.clauseWordCount + "will exceed"
      );
    } else {
      let curdata = this.validateForm.value.clauses[i].clause;
      if (curdata) {
        let concatedData = curdata.concat(pastedData);
        let concatedlen = this.getWordCountOnPaste(concatedData);
        if (concatedlen > max) {
          event.preventDefault();
          this.notify.showWarning(
            "Warning",
            "Cannot paste! Maximum Wordlimit" +
              this.clauseWordCount +
              "will exceed"
          );
        }
      }
    }
  }
  disableKey(content, e, i) {
    var key = e.keyCode || e.charCode;
    if (key == 8 || key == 46 || key == 17) return true;
    else {
      var key1 = e.keyCode || e.charCode;
      if (key1 == 32 || key1 == 13 || key == 86) {
        this.str = content;
        this.str = this.str.replace(/(\r\n|\n|\r)/gm, " ");
        this.str = this.str.replace(/(^\s*)|(\s*$)/gi, "");
        this.str = this.str.replace(/[ ]{2,}/gi, " ");
        let l = this.str.split(" ").length;
        if (l > this.clauseWordCount - 1) {
          this.notify.showWarning(
            "Warning",
            "Maximum length of word count is " + this.showWordCount
          );
          return false;
        }
      }
    }
  }
  getTrimmedWord(max, data) {
    let testdata = data;
    var regex = /\s+/gi;
    var wordCount = data.trim().replace(regex, " ").split(" ").length;
    var trimmedData;
    while (wordCount > max) {
      var n = data.lastIndexOf(" ");
      trimmedData = testdata.slice(0, n);
      var regex = /\s+/gi;
      var wordCount = trimmedData.trim().replace(regex, " ").split(" ").length;
      data = trimmedData;
    }
    return data;
  }
  getWordCountOnPaste(data) {
    var regex = /\s+/gi;
    var datacount = data.trim().replace(regex, " ").split(" ").length;
    return datacount;
  }
  _setClubbedMemberData(_qDetail) {
    const newArr = [];
    _qDetail.clubbableMembers = _qDetail.clubbableMembers
      ? _qDetail.clubbableMembers.filter(
          (n) =>
            !this.qDetail.question.clubbingDetails.some(
              (n2) => n.memberIdTo === n2.memberId
            )
        )
      : [];
    _qDetail.clubbableMembers.forEach((element) => {
      newArr.push({
        memberId: element.memberIdTo,
        memberName: element.memberTo.details.fullName,
      });
    });
    _qDetail.clubbableMembers = newArr;
  }
  _setMinisterData(_qDetail) {
    this.ministerSubjects = _qDetail.ministerSubjects
      ? _qDetail.ministerSubjects
      : [];
    this.ministerSubjects.sort((a, b) =>
      a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1
    );
    this.portfolio = _qDetail.portfolio ? _qDetail.portfolio : [];
    this.portfolio.forEach((element) => {
      if (element.name) {
        element.name = element.name.replace(/\s+/g, " ");
      }
    });
    this.portfolio = this.portfolio.filter(
      (v, i, a) => a.findIndex((t) => t.name === v.name) === i
    );
    this.portfolio.sort((a, b) => (a.name > b.name ? 1 : -1));
    if (this.qDetail.question.respondentMemberId) {
      _qDetail.portfolio = this.portfolio.find(
        (o) => o.id === this.qDetail.question.respondentMemberId
      );
    }
    if (this.qDetail.question.ministerSubjectId) {
      _qDetail.ministerSubjects = this.ministerSubjects.find(
        (o) => o.id === this.qDetail.question.ministerSubjectId
      );
    }
  }
  _setMinisterSubSubjectData() {
    if (this.qDetail.ministerSubjects && this.qDetail.ministerSubjects.id) {
      this.ministerSubSubject = this.qDetail.ministerSubjects.ministerSubSubjects;
      let sub = this.ministerSubSubject.find(
        (element) => element.id == this.qDetail.question.ministerSubSubjectId
      );
      if (sub) {
        this.qDetail.question.ministerSubSubjectName = sub.title;
      }
    }
  }

  listSorted(orderedClause) {
    for (let i = 0; i < orderedClause.length; i++) {
      this.validateForm.controls.clauses.value[i] = orderedClause[i].value;
    }
  }

  _setQuestionDate() {
    const session = this.qDetail.question.sessionId;
    this.question
      .getNoticeDate(this.qDetail.question.assemblyId, session)
      .subscribe((response) => {
        if (Array.isArray(response)) {
          this.questionDate = this.allquestionDates = response.filter(
            (date) => date > this.today
          );
          //this._sortOnNoticeType();
        }
      });
  }
  bindMinisterSubSubject(e) {
    if (e) {
      this.question.getMinisterSubSubjects(e.id).subscribe((response) => {
        this.ministerSubSubject = response;
        if (this.validateForm.controls.ministerSubject.value) {
          let subjectId = this.qDetail.question.ministerSubjectId;
          if (subjectId !== e.id) {
            this.validateForm.controls.subSubjectId.reset();
          }
        }
      });
    }
  }
  getMinisterSubSubject(e) {
    if (e) {
      this.question.getMinisterSubSubjects(e).subscribe((response) => {
        this.validateTDForm.controls.subSubjectId.reset();
        this.ministerSubSubject = response;
        this.TDTMParams["ministerSubSubjects"] = response;
      });
    }
  }
  bindMinisterSubject(portfolio) {
    if (portfolio) {
      if (this.validateForm.value.ministerSubject) {
        this.validateForm.controls.ministerSubject.reset();
      }
      const session = this.validateForm.value.sessionId;
      const groupId = portfolio.ministerGroupId;
      const portfolioId = portfolio.id;
      this.question.getMinisterSubject(portfolio.id).subscribe((response) => {
        this.ministerSubjects = response;
        this.ministerSubjects.sort((a, b) =>
          a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1
        );
      });
    } else {
      this.validateForm.controls.ministerSubject.reset();
      this.ministerSubjects = null;
    }
  }
  getDesignationListOnQdate() {
    if (this.validateForm.value.portfolio) {
      this.validateForm.controls.portfolio.reset();
      this.portfolio = null;
    }
    if (this.validateForm.value.ministerSubject) {
      this.validateForm.controls.ministerSubject.reset();
    }
    if (this.validateForm.value.priority) {
      this.validateForm.controls.priority.reset();
    }
    if (this.validateForm.value.questionDate) {
      let qdate = this.validateForm.value.questionDate;
      this.question.getDesignationList(qdate).subscribe((response) => {
        this.portfolio = response ? response : [];
        this.portfolio.forEach((element) => {
          if (element.name) {
            element.name = element.name.replace(/\s+/g, " ");
          }
        });
        this.portfolio = this.portfolio.filter(
          (v, i, a) => a.findIndex((t) => t.name === v.name) === i
        );
        this.portfolio.sort((a, b) => (a.name > b.name ? 1 : -1));
      });
    }
  }
  editNewQuestion() {
    const question = this.qDetail.question;
    question.qDate  = question.questionDate;
    if (question.type === "SHORT_NOTICE") {
      this.validateForm.addControl(
        "reason",
        new FormControl(null, Validators.required)
      );
    }
    if (question) {
      this.validateForm.patchValue({
        assemblyId: question.assemblyId,
        sessionId: question.sessionId,
        category: question.category,
        priority: question.priority,
        questionDate: question.questionDate,
        ministerSubject: this.qDetail.ministerSubjects,
        subSubjectId: question.ministerSubSubjectId,
        portfolio: this.qDetail.portfolio,
        heading: question.heading,
        clubbingDetails: question.clubbingDetails,
        tags: null,
        reason:
          question.directions && question.directions.length > 0
            ? question.directions[0].reason
            : "",
      });
      this._setClauseData();
      this._setTagData();
      this._setReasonForCategoryChange(null);
    }
  }
  removeClubbedMla(mla: {}): void {
    this.qDetail.question.clubbingDetails = this.qDetail.question.clubbingDetails.filter(
      (tag) => tag !== mla
    );
    this.qDetail.clubbableMembers.push(mla);
    this.validateForm.controls.clubbingDetails.setValue(
      this.qDetail.question.clubbingDetails
    );
    this.count--;
    this._getExistingQuestionCount();
  }
  get qClause() {
    const controls = this.validateForm.get("clauses") as FormArray;
    this.clauseCount = controls.length;
    return controls;
  }
  addTag(): void {
    const newTag = { tag: this.validateForm.value.tags };
    const found = this.qDetail.question.tags.find(
      (item) => item.tag === newTag.tag
    );
    if (
      newTag.tag &&
      this.qDetail.question.tags &&
      typeof found === "undefined"
    ) {
      this.qDetail.question.tags = [...this.qDetail.question.tags, newTag];
    }
    this.validateForm.controls.tags.setValue(null);
    this.showAddTag = false;
  }
  addClauseTag(index): void {
    const newTag = { tag: this.validateForm.value.clauses[index].clauseTags };
    const control = this.validateForm.controls.clauses as FormArray;
    const formgrp = control.controls[index] as FormGroup;
    if (
      newTag.tag &&
      this.validateForm.value.clauses[index].tags &&
      this.validateForm.value.clauses[index].tags.indexOf(newTag) === -1
    ) {
      formgrp.controls.tags.setValue([...formgrp.controls.tags.value, newTag]);
    }

    formgrp.controls.clauseTags.setValue(null);
    this.showClauseTag[index] = false;
  }
  addNewClause() {
    if (
      typeof this.clauseCount === "undefined" ||
      this.clauseCount < this.clauseMaxCount
    ) {
      if (this._isValidClause()) {
        const control = this.validateForm.controls.clauses as FormArray;
        control.push(
          this.fb.group({
            subSubjectId: [null],
            clause: [null, Validators.compose([Validators.required])],
            tags: [[]],
            clauseTags: [null],
            subSubjectName: [null],
          })
        );
        this.showClauseTag.push(false);
      }
    } else {
      this.notify.showWarning(
        "Sorry",
        "Number of clauses cannot  be greater than " + this.clauseMaxCount
      );
    }
  }
  _isValidClause() {
    if (this.validateForm.value.clauses) {
      // tslint:disable-next-line: forin
      for (const i in this.validateForm.value.clauses) {
        let clause = this.validateForm.value.clauses[i].clause;
        if (clause === null) {
          return false;
        }
        if (clause) {
          clause = clause.replace(/(\r\n|\n|\r)/gm, " ");
          clause = clause.replace(/(^\s*)|(\s*$)/gi, "");
          clause = clause.replace(/[ ]{2,}/gi, " ");
          const count = clause.split(" ").length;
          if (count < this.configurableParms["minClauseWord"]) {
            this.notify.showWarning(
              "Minimum word count for clause is " +
                this.configurableParms["minClauseWord"],
              ""
            );
            return false;
          }
        }
      }
      return true;
    }
  }
  deleteClause(i) {
    if (this.clauseCount === 1) {
      this.notify.showWarning("Sorry", "Clauses Cannot Be Empty");
      return;
    }
    let control = <FormArray>this.validateForm.controls.clauses;
    if (control.value[i].id != null) {
      control.removeAt(i);
      this.showClauseTag.splice(i, 1);
    } else {
      control.removeAt(i);
      this.showClauseTag.splice(i, 1);
    }
    this.clauseCount = control.length;
    this.editableFields.clauseEdit =
      this.clauseCount < this.clauseMaxCount ? true : false;
  }
  handleNotes(boolean: boolean): void {
    this.shownotes = boolean;
    this.noteGiven = "";
  }
  open(): void {
    this.visible = true;
  }
  close(): void {
    this.visible = false;
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
  checkforTag(data) {
    let istag = false;
    this.quickOptions.forEach((element) => {
      if (data.match(element.label)) {
        istag = true;
      }
    });
    return istag;
  }
  editNotes(index, data): void {
    // this.notesList[index].editNote = false;
    // this.notesList[index].noteditable = true;
    // this.notesList[index].noteditable === true
    //   ? (this.editedNoteOn = true)
    //   : (this.editedNoteOn = false);
    this.editedNote = this.noteGiven = this.notesList[index].note;
    this.editedNoteIndex = index;
    this.editedNoteData = data;  }
  changeQCategory() {
    if (this.qDetail.question.status === "SAVED") {
      this._getExistingQuestionCount();
    }
    if (
      this.validateForm.controls.category.value === "UNSTARRED" &&
      this.editableFields.showrule
    ) {
      this.showDirection = true;
    } else {
      this.qDetail.question.category = this.validateForm.controls.category.value;
      this.changeCategoryReason = false;
    }
  }
  saveNotes(questionId): void {
    if (this.notesList.length > 0 && this._isAddedNote() && !this.editedNoteData) {
      this.noteGiven = "";
      this.notify.showWarning(
        "Warning",
        "Sorry, You can only edit existing Note"
      );
      return;
    }
    if (!this.noteGiven) {
      this.notify.showError("Error", "Please Enter Notes");
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
        this._showSuccessMsg(null);
        this.notesList.push(element);
        let i = this.notesList.length;
        this.notesList[i - 1].editNote = true;
        this.notesList[i - 1].noteditable = false;
        this.noteGiven = "";
      });
  }
  updateNotes(index, questionId, note) {
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
        this.noteGiven = "";
        this.editedNoteIndex = "";
        this.editedNoteData = "";
        this.notify.showSuccess("Note Updated Successfully", "");
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
  admitQuestion() {
    this._setNewQuestionData(this.qDetail.question);
    if (this.validateForm.valid) {
      if (!this._isAllClauseValid()) {
        return true;
      }
      this.question
        .forwardOradmitQuestion(
          this.qDetail.question,
          "admit",
          null,
          this.auth.getCurrentUser().userId,
          this._findRole()
        )
        .subscribe((element) => {
          this._showSuccessMsg("Admitted Successfully");
          this._redirectTo();
        });
    } else {
      this._validateClauses();
    }
  }
  forwardToQuestion() {
    if (!this.forwardToQS) {
      this.notify.showError("Error", "Please Select A role");
      return;
    }
    this._setNewQuestionData(this.qDetail.question);
    if (this.validateForm.valid) {
      if (!this._isAllClauseValid()) {
        return true;
      }
      this.question
        .forwardOradmitQuestion(
          this.qDetail.question,
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
          this._redirectTo();
        });
    } else {
      this._validateClauses();
    }
  }
  cancelDelete() {}
  disabledDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, new Date()) < 0;
  };
  showVersion() {
    this.router.navigate([
      "business-dashboard/question/question-versions",
      this.qDetail.question.id,
      this.statusParam,
      "EDIT",
    ]);
  }
  cancelRuleSelection(type) {
    if (type == "true") {
      this.ShowRules = false;
      this.showDirection = false;
      this.reason = "";
      let category = this.qDetail.question.category;
      this.validateForm.controls.category.setValue(category);
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
  }
  applyRuleDirection() {
    let checkedData = [];
    this.editedNote = this.noteGiven = "";
    if (this.shownotes) {
      if (this.showDirection) {
        checkedData = this.directionList.filter((x) => x.checked === true);
        this._addNotesContent(checkedData);
        for (let i = 0; i < this.directionList.length; i++) {
          if (this.directionList[i].checked) {
            this.directionList[i].checked = false;
          }
        }
        this.showDirection = false;
        return;
      }
      checkedData = this.ruleList.filter((x) => x.checked === true);
      this._addNotesContent(checkedData);
      for (let i = 0; i < this.ruleList.length; i++) {
        if (this.ruleList[i].checked) {
          this.ruleList[i].checked = false;
        }
      }
      return;
    }
    checkedData = this.directionList.filter((x) => x.checked === true);
    let selectedRules = this.selectedRules(checkedData);
    if (selectedRules) {
      // this._addNotesContent(ruleApplyed);
      this.changeStaredToUnstared(selectedRules);
      for (let i = 0; i < this.directionList.length; i++) {
        if (this.directionList[i].checked) {
          this.directionList[i].checked = false;
        }
      }
      this.ShowRules = false;
      this.validateForm.controls.priority.setValue(null);
    } else {
      this.notify.showInformation("Info", "Please select atlest one rule");
    }
  }
  selectedRules(ruleApplyed) {
    let selectedRules = "";
    ruleApplyed.forEach((value, index) => {
      if (value.heading) {
        selectedRules =
          selectedRules + value.heading + "--" + value.englishDescription + ",";
      } else {
        selectedRules =
          selectedRules + value.code + value.englishDescription + ",";
      }
    });
    return selectedRules;
  }
  CheckforRules(checked: boolean, tag, index: number) {
    this.currentRuleStatement = tag.label;
    if (tag.disallowStatus) {
      this.ShowRules = true;
      this.reason = "";
    } else if (tag.showDirection) {
      this.showDirection = true;
    } else if (tag.transferMinister) {
      this._applytransferMinisterOption();
    } else if (tag.transferDate) {
      this._applytransferDateOption("note");
    } else if (tag.tranferMinisterandDate) {
      this._applytransferMinisterandDateOption();
    } else {
      this.addQuickOptions(checked, tag.label, index);
    }
  }
  _applytransferMinisterOption() {
    this.question
      .getDesignationList(this.qDetail.question.questionDate)
      .subscribe((response) => {
        if (Array.isArray(response)) {
          response.forEach((element) => {
            if (element.id !== this.qDetail.question.respondentMemberId) {
              this.TDTMParams["TMData"].push(element.name);
            }
          });
        }
        this.TDTMParams["showTM"] = true;
        this.TDTMParams["TDTMLabel"] = "Select Minister";
      });
  }
  _applytransferDateOption(from) {
    this.question
      .getNoticeDate(
        this.qDetail.question.assemblyId,
        this.qDetail.question.sessionId
      )
      .subscribe((response) => {
        if (Array.isArray(response)) {
          //this._sortOnNoticeType();
          let questionDates = response.filter(
            (date) => date > this.qDetail.question.qDate
          );
          questionDates.sort();
          this.TDTMParams["TDData"] = questionDates;
          from == "note" ? (this.TDTMParams["showTD"] = true) : "";
          this.TDTMParams["TDTMLabel"] = "Select Question Date";
        }
      });
  }
  _applytransferMinisterandDateOption() {
    this.question
      .getNoticeDate(
        this.qDetail.question.assemblyId,
        this.qDetail.question.sessionId
      )
      .subscribe((res) => {
        if (Array.isArray(res)) {
          //this._sortOnNoticeType();
          let questionDates = res.filter(
            (date) => date > this.qDetail.question.qDate
          );
          questionDates.sort();
          this.TDTMParams["TDData"] = questionDates;
        }
        this.TDTMParams["selDateData"] = null;
        this.TDTMParams["selMinisterData"] = null;
        this.TDTMParams["showMinisterandDate"] = true;
      });
  }
  cancelTDTM() {
    this.TDTMParams["showTD"] = false;
    this.TDTMParams["showTM"] = false;
    this.TDTMParams["TDData"] = [];
    this.TDTMParams["TMData"] = [];
    this.TDTMParams["TDTMLabel"] = "";
    this.TDTMParams["showMinisterandDate"] = false;
    this.TDTMParams["selDateData"] = null;
    this.TDTMParams["selMinisterData"] = null;
    this.TDTMParams["TDSelData"] = null;
    this.TDTMParams["TMSelData"] = null;
  }
  cancelTransferDate() {
    this.TDTMParams["TDData"] = [];
    this.TDTMParams["TMData"] = [];
    this.TDTMParams["showTDPopup"] = false;
    this.validateTDForm.reset();
  }
  selectTDTM() {
    if (this.editedNoteOn) {
      if (this.TDTMParams["showTD"]) {
        if (this.TDTMParams["TDSelData"]) {
          if (this.checkforTag(this.editedNote)) {
            this.editedNote = `${this.currentRuleStatement} :-  ${this.TDTMParams["TDSelData"]}`;
          } else {
            this.editedNote =
              this.editedNote +
              `${this.currentRuleStatement} :-  ${this.TDTMParams["TDSelData"]}`;
          }
          this.cancelTDTM();
        } else {
          this.notify.showWarning(
            "Sorry",
            "The date field can not be empty, please select one date"
          );
        }
      }
      if (this.TDTMParams["showTM"]) {
        if (this.TDTMParams["TMSelData"]) {
          if (this.checkforTag(this.editedNote)) {
            this.editedNote = `${this.currentRuleStatement} :-  ${this.TDTMParams["TMSelData"]}`;
          } else {
            this.editedNote =
              this.editedNote +
              `${this.currentRuleStatement} :-  ${this.TDTMParams["TMSelData"]}`;
          }
          this.cancelTDTM();
        } else {
          this.notify.showWarning(
            "Sorry",
            "The minister field can not be empty, please select one minister"
          );
        }
      }
      if (this.TDTMParams["showMinisterandDate"]) {
        if (
          this.TDTMParams["selMinisterData"] &&
          this.TDTMParams["selDateData"]
        ) {
          if (this.checkforTag(this.editedNote)) {
            this.editedNote = `May be transferred to minister :- ${this.TDTMParams["selMinisterData"].name} , Question date :- ${this.TDTMParams["selDateData"]}`;
          } else {
            this.editedNote =
              this.editedNote +
              `May be transferred to minister :- ${this.TDTMParams["selMinisterData"].name} , Question date :- ${this.TDTMParams["selDateData"]}`;
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
      if (this.TDTMParams["showTD"]) {
        if (this.TDTMParams["TDSelData"]) {
          if (this.checkforTag(this.noteGiven)) {
            this.noteGiven = `${this.currentRuleStatement} :-  ${this.TDTMParams["TDSelData"]}`;
          } else {
            this.noteGiven =
              this.noteGiven +
              `${this.currentRuleStatement} :-  ${this.TDTMParams["TDSelData"]}`;
          }
          this.cancelTDTM();
        } else {
          this.notify.showWarning(
            "Sorry",
            "The date field can not be empty, please select one date"
          );
        }
      }
      if (this.TDTMParams["showTM"]) {
        if (this.TDTMParams["TMSelData"]) {
          if (this.checkforTag(this.noteGiven)) {
            this.noteGiven = `${this.currentRuleStatement} :-  ${this.TDTMParams["TMSelData"]}`;
          } else {
            this.noteGiven =
              this.noteGiven +
              `${this.currentRuleStatement} :-  ${this.TDTMParams["TMSelData"]}`;
          }
          this.cancelTDTM();
        } else {
          this.notify.showWarning(
            "Sorry",
            "The minister field can not be empty, please select one minister"
          );
        }
      }
      if (this.TDTMParams["showMinisterandDate"]) {
        if (
          this.TDTMParams["selMinisterData"] &&
          this.TDTMParams["selDateData"]
        ) {
          if (this.checkforTag(this.noteGiven)) {
            this.noteGiven = `May be transferred to minister :- ${this.TDTMParams["selMinisterData"].name} , Question date :- ${this.TDTMParams["selDateData"]}`;
          } else {
            this.noteGiven =
              this.noteGiven +
              `May be transferred to minister :- ${this.TDTMParams["selMinisterData"].name} , Question date :- ${this.TDTMParams["selDateData"]}`;
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
  selTDTMSelData() {}
  changeStaredToUnstared(direction) {
    let body = {
      direction: direction,
      questionId: this.questionID,
      ownerId: this.auth.getCurrentUser().userId,
    };
    this.question.changeStaredToUnstared(body).subscribe((res: any) => {
      this.notify.showSuccess("", "Category updated suceesfully..");
      this.showDirection = false;
      this.disableStarred = true;
    });
    this.qDetail.question.category = "UNSTARRED";
    this.qDetail.question.priority = null;
    this._setReasonForCategoryChange(direction);
  }
  showModal(): void {
    this.ShowRules = true;
  }
  checkQuestionDuplication() {
    let body = {
      questionId: this.questionID,
      assemblyId: this.qDetail.question.assemblyId,
      sessionId: this.qDetail.question.sessionId,
    };
    this.question.checkQuesstionDuplication(body).subscribe((res: any) => {
      if (res) {
        this.modalService.create({
          nzTitle: null,
          nzContent: QuestionduplicateComponent,
          nzClosable: true,
          nzMaskClosable: true,
          nzFooter: null,
          nzWidth: 1100,
          nzComponentParams: {
            questionDuplicateDetails: res,
          },
        });
      } else {
        this.notify.showInformation("Info", "No duplicate question found");
      }
    });
  }

  getQuestionDuplication() {
    if (this.questionID) {
      this.router.navigate(["question-check-duplicate", this.questionID], {
        relativeTo: this.route.parent,
      });
    }
  }

  getTransfarableDate() {
    if (
      this.qDetail.question.questionDate &&
      this.qDetail.question.status !== "SAVED"
    ) {
      this.question.getTransferableDate(this.questionID).subscribe((res) => {
        if (Array.isArray(res)) {
          this.transfarableDate = res.filter((date) => date > this.today);
          this.transfarableDate.sort();
        }
      });
    }
  }
  saveAsDraft() {
    this._setNewQuestionData(this.qDetail.question);
    if (this.validateForm.valid) {
      if (!this._isAllClauseValid()) {
        return true;
      }
      this.question
        .saveAsDraft(this.qDetail.question, this.auth.getCurrentUser().userId)
        .subscribe((element) => {
          this._showSuccessMsg(null);
          this._redirectTo();
        });
    } else {
      this._validateClauses();
    }
  }
  _isAllClauseValid() {
    let counter = 0;
    if (
      this.validateForm.controls.heading.value &&
      !this._validateCharLimitForHeading()
    ) {
      return false;
    }
    if (this.validateForm.value.clauses) {
      if (this.validateForm.value.clauses.length === 1) {
        if (this.validateForm.value.clauses[0].clause === null) {
          this.notify.showWarning("Please enter a clause", "");
          return false;
        }
      }
      this.validateForm.value.clauses = this.validateForm.value.clauses.filter(
        function (el) {
          return el.clause != null;
        }
      );
      let clauselegth = this.validateForm.value.clauses.length;
      // tslint:disable-next-line: forin
      for (const i in this.validateForm.value.clauses) {
        counter++;
        if (
          !this._hasMinClauseWordCount(
            this.validateForm.value.clauses[i].clause
          )
        ) {
          return false;
        }
      }
      return true;
    }
  }
  _validateCharLimitForHeading() {
    let title = this.validateForm.controls.heading.value.trim();
    if (title.length < this.configurableParms["minTitleChar"]) {
      this.notify.showWarning(
        "Warning",
        "Minimum character limit for heading is " +
          this.configurableParms["minTitleChar"]
      );
      return false;
    } else if (title.length > this.configurableParms["maxTitleChar"]) {
      this.notify.showWarning(
        "Warning",
        "Maximum character limit " +
          this.configurableParms["maxTitleChar"] +
          " will exceed"
      );
      return false;
    }
    return true;
  }
  _hasMinClauseWordCount(clause) {
    clause = clause.replace(/(\r\n|\n|\r)/gm, " ");
    clause = clause.replace(/(^\s*)|(\s*$)/gi, "");
    clause = clause.replace(/[ ]{2,}/gi, " ");
    const count = clause.split(" ").length;
    if (count < this.configurableParms["minClauseWord"]) {
      this.notify.showWarning(
        "Minimum word count for clause is " +
          this.configurableParms["minClauseWord"],
        ""
      );
      return false;
    }
    return true;
  }
  _submitMmberData() {
    let memberData = {};
    if (
      this.auth.getCurrentUser().authorities[0] ===
        "parliamentaryPartySecretary" ||
      this.auth.getCurrentUser().authorities[0] === "assistant"
    ) {
      memberData["primaryMemberId"] = this.validateForm.value.primaryMember
        ? this.validateForm.value.primaryMember.id
        : null;
    } else {
      memberData["primaryMemberId"] = this.qDetail.question.primaryMemberId;
    }
    memberData["createdBy"] = this.auth.getCurrentUser().userId;
    if (this.qDetail.question.createdBy) {
      memberData["createdBy"] = this.qDetail.question.createdBy;
    }
    return memberData;
  }
  _addNotesContent(ruleApplyed) {
    const ruleCodes = ruleApplyed.map((x) => x.code);
    const ruleDescription = ruleApplyed.map((x) => x.englishDescription);
    let reasonSel  = this.buildReason(ruleApplyed);
    reasonSel = reasonSel.replace(/,\s*$/, "");
    if (this.shownotes) {
      if (ruleApplyed.length > 0) {
        if (this.editedNoteOn) {
          this.editedNote = `${this.editedNote} ${this.currentRuleStatement} as per ${reasonSel} `;
        } else {
          this.noteGiven = `${this.noteGiven} ${this.currentRuleStatement} as per ${reasonSel} `;
        }
        this.selectedTags.push(
          `${this.currentRuleStatement} as per ${reasonSel} `
        );
      }
    }
    this.ShowRules = false;
  }
  _keepClauseOrder(clauses) {
    let clauseOrder = 0;
    if (clauses) {
      clauses.forEach(async (value) => {
        clauseOrder++;
        value.clauseOrder = clauseOrder;
        const lastclause = this._trimData(value.clause);
        const lastChar = lastclause.charAt(lastclause.length - 1);
        if (clauses.length === clauseOrder) {
          if (lastChar !== "?") {
            if (lastChar === ";") {
              value.clause = value.clause.substring(0, value.clause.length - 1);
            }
            value.clause = value.clause + "?";
          }
        } else if (lastChar !== ";") {
          if (lastChar === "?") {
            value.clause = value.clause.substring(0, value.clause.length - 1);
          }
          value.clause = value.clause + ";";
        }
      });
      return clauses;
    }
  }
  _setNewQuestionData(qDetail) {
    qDetail.heading = this._trimData(this.validateForm.controls.heading.value);
    qDetail.tags = this.keepTagOrder(qDetail.tags);
    qDetail.clauses = this._keepClauseOrder(
      this.validateForm.controls.clauses.value
    );
    qDetail.category = this.validateForm.controls.category.value;
    qDetail.priority =
      this.validateForm.controls.priority.value === null
        ? qDetail.priority
        : (qDetail.priority = this.validateForm.controls.priority.value);
    //for set transaferable date
    qDetail.questionDate = qDetail.qDate;
    if (this.validateForm.controls.transfarableDate.value) {
      qDetail.questionDate = this.validateForm.controls.transfarableDate.value;
    }
    if (this.validateForm.controls.ministerSubject.value) {
      const ministerSubject = this.validateForm.controls.ministerSubject.value;
      qDetail.ministerSubjectId = ministerSubject.id;
    }

    if (this.validateForm.controls.subSubjectId.value) {
      // const ministerSubject = this.validateForm.controls.ministerSubject.value;
      qDetail.ministerSubSubjectId = this.validateForm.controls.subSubjectId.value;
    }
    if (this.validateForm.controls.portfolio.value) {
      const portfolio = this.validateForm.controls.portfolio.value;
      qDetail.respondentMemberId = portfolio.id;
    }
    return qDetail;
  }
  _trimData(text) {
    if (text) {
      return text.trim();
    }
  }
  keepTagOrder(tagArray) {
    let tagOrder = 0;
    if (tagArray) {
      tagArray.forEach(async (value) => {
        tagOrder++;
        value.tagOrder = tagOrder;
      });
      return tagArray;
    } else {
      return [];
    }
  }
  _setTags(tags) {
    let count = 0;
    let newArr = [];
    tags.forEach((element) => {
      count++;
      newArr.push({ tag: element });
    });
    if (count == tags.length) {
      return newArr;
    }
  }
  _validateClauses() {
    this.notify.showWarning("Please fill all the required fields...", "");
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
      if (i === "clauses") {
        const control = this.validateForm.get("clauses") as FormArray;
        for (const j in control.controls) {
          const controlTwo = control.controls[j] as FormGroup;
          for (const k in controlTwo.controls) {
            controlTwo.controls[k].markAsDirty();
            controlTwo.controls[k].updateValueAndValidity();
          }
        }
      }
    }
  }
  _setClauseData() {
    if (this.qDetail.question.clauses.length !== 0) {
      const controls = this.validateForm.controls.clauses as FormArray;
      this.qDetail.question.clauses.sort((a, b) =>
        a.clauseOrder > b.clauseOrder ? 1 : -1
      );
      this.qDetail.question.clauses.forEach((x) => {
        controls.push(
          this.fb.group({
            id: x.id,
            clause: [x.clause, Validators.compose([Validators.required])],
            subSubjectId: x.subSubjectId,
            subSubjectName:
              x.subSubjectId && this.ministerSubSubject.lengh > 0
                ? this.ministerSubSubject.find(
                    (item) => item.id === x.subSubjectId
                  ).title
                : "",
            tags: [[]],
            clauseTags: [],
          })
        );
        this.showClauseTag.push(false);
      });
    } else {
      this.addNewClause();
    }
  }
  _setTagData() {
    if (this.qDetail.question.tags === undefined) {
      this.tags = [];
    } else {
      this.qDetail.question.tags.sort((a, b) =>
        a.tagOrder > b.tagOrder ? 1 : -1
      );
      this.tags = this.qDetail.question.tags;
    }
  }
  _removeTag(removedTag: {}): void {
    if (removedTag["id"]) {
      this.question.removeTag(removedTag["id"]).subscribe((res: any) => {
        this.qDetail.question.tags = this.qDetail.question.tags.filter(
          (tag) => tag !== removedTag
        );
      });
    } else {
      this.qDetail.question.tags = this.qDetail.question.tags.filter(
        (tag) => tag !== removedTag
      );
    }
  }
  _closeClauseTag(removedTag: {}, index): void {
    const control = this.validateForm.controls.clauses as FormArray;
    const formgrp = control.controls[index] as FormGroup;
    formgrp.controls.tags.setValue([
      ...formgrp.controls.tags.value.filter((tag) => tag !== removedTag),
    ]);
  }
  _showAddTag(): void {
    this.showAddTag = true;
    setTimeout(() => {
      this.inputElement.nativeElement.focus();
    }, 10);
  }
  _sliceTagName(tag: string): string {
    const isLongTag = tag.length > 20;
    return isLongTag ? `${tag.slice(0, 20)}` : tag;
  }
  _sortOnNoticeType() {
    let normalNoticeDates = [];
    let shortNoticeDates = [];
    const tenDysDiff = new Date().getTime() + 9 * 24 * 60 * 60 * 1000;
    const twoDysDiff = new Date().getTime() + 1 * 24 * 60 * 60 * 1000;
    this.allquestionDates.forEach((element) => {
      const AODtimestamp = new Date(element).getTime();
      if (AODtimestamp >= tenDysDiff) {
        normalNoticeDates.push(element);
      } else if (
        this.qDetail.question.type === "SHORT_NOTICE" &&
        AODtimestamp >= twoDysDiff
      ) {
        shortNoticeDates.push(element);
      }
    });
    this.questionDate =
      this.qDetail.question.type === "SHORT_NOTICE"
        ? shortNoticeDates
        : normalNoticeDates;
    this.questionDate = this.questionDate.filter(
      (v, i, a) => a.findIndex((t) => t === v) === i
    );
    this.questionDate.sort();
  }
  _showSuccessMsg(msg) {
    msg = msg ? msg : "Add Success";
    this.notify.showSuccess(msg, "");
  }
  _redirectTo() {
    localStorage.setItem("hasFilter", "true");
    if (this.isMLA()) {
      this.router.navigate(["business-dashboard/question/list-dept"]);
    } else if (this.statusParam) {
      this.router.navigate([
        "business-dashboard/question/list-dept",
        this.statusParam,
      ]);
    } else {
      this.router.navigate([
        "business-dashboard/question/list-dept",
        this.qDetail.question.status,
      ]);
    }
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
  _getExistingQuestionCount() {
    if (
      this.validateForm.value.category &&
      this.validateForm.value.questionDate &&
      this._submitMmberData()["primaryMemberId"]
    ) {
      let ids = [];
      if (this.validateForm.value.clubbingDetails) {
        this.validateForm.value.clubbingDetails.forEach((element) => {
          ids.push(element.memberId);
        });
      }
      const body = {
        assemblyId: this.validateForm.value.assemblyId,
        category: this.validateForm.value.category,
        questionDate: this.validateForm.value.questionDate,
        sessionId: this.validateForm.value.sessionId,
        userId: this._submitMmberData()["primaryMemberId"],
        memberIds: ids,
      };
      this.question.validateCategoryCount(body).subscribe((isValid) => {
        this.validCategory = isValid["status"];
        if (!isValid["status"] || isValid["message"]) {
          if (this.priorityList.length == 0) {
            this.priorityList = ["P3"];
          }
          this.modalService.warning({
            nzClassName: "pdng",
            nzContent: isValid["message"],
            nzOkText: "OK",
            nzOnOk: () => console.log("OK"),
          });
        }
      });
      this.getPriorityList(ids);
    }
  }

  getPriorityList(pids) {
    if (
      this.validateForm.value.category == "STARRED" &&
      this.validateForm.value.questionDate
    ) {
      this.question
        .getAvailablePriority(pids, this.validateForm.value.questionDate)
        .subscribe((QPList) => {
          if (!QPList) {
            this.priorityList = [];
          } else {
            this.priorityList = QPList;
          }
          if (
            this.validateForm.controls.priority &&
            !this.priorityList.includes(this.validateForm.value.priority)
          ) {
            this.validateForm.controls.priority.reset();
          }
        });
    }
  }
  DisallowQuestion() {
    this.disallowRules = true;
    this.reason = "";
  }
  cancelRule() {
    this.disallowRules = false;
    this.reason = "";
  }
  getRules() {
    this.question.getRules().subscribe((Response) => {
      this.ruleList = Response;
    });
  }
  ruleSelected() {
    if (this.reason == "") {
      this.notify.showWarning("Warning", "Please Specify the reason");
      return;
    }

    if (this.clauseIndex >= 0) {
      if (this.clauseCount === 1) {
        this.notify.showWarning("Sorry", "Clauses Cannot Be Empty");
        return;
      }
      const clauseId = this.qClause.value[this.clauseIndex].id;
      let control = <FormArray>this.validateForm.controls.clauses;
      this.clauseCount = control.length;

      let ruleSelected = [];
      ruleSelected = this.ruleList.filter((x) => x.checked === true);
      const ruleCodes = ruleSelected.map((x) => x.code);
      let clauseRuleData = {};
      clauseRuleData["clauseId"] = clauseId;
      clauseRuleData["prefix"] = "";
      clauseRuleData["direction"] = ruleSelected[0].englishDescription;
      clauseRuleData["ownerId"] = this.auth.getCurrentUser().userId;
      clauseRuleData["questionId"] = this.questionID;
      clauseRuleData["reason"] = this.reason;
      this.question.disallowClause(clauseRuleData).subscribe((response) => {
        this.notify.showSuccess("disallowed clause Successfully", "");
        control.removeAt(this.clauseIndex);
        this.ruleList.filter((x) => (x.checked = false));
        this.reason = "";
      });
      this.disallowRules = false;
    } else {
      let ruleSelected = [];
      ruleSelected = this.ruleList.filter((x) => x.checked === true);
      const ruleCodes = ruleSelected.map((x) => x.code);
      let ruleData = {};
      ruleData["direction"] = ruleSelected[0].englishDescription;
      ruleData["ownerId"] = this.auth.getCurrentUser().userId;
      ruleData["questionId"] = this.questionID;
      ruleData["reason"] = this.reason;
      ruleData["groupId"] = this._findRole();
      this.question.questionDisallow(ruleData).subscribe((response) => {
        this.notify.showSuccess("disallowed successfully", "");
        this._redirectTo();
        this.reason = "";
      });

      this.disallowRules = false;
    }
  }
  RevokeQuestion(questionId: number) {
    if (
      this.qDetail.question.questionDate <
      new Date().toISOString().split("T")[0]
    ) {
      this.notify.showWarning(
        "Warning",
        "Sorry, You cannot revoke past date notices"
      );
      return;
    }
    if (!this.forwardToQS) {
      this.notify.showError("Error", "Please select a role");
      return;
    }
    this.question
      .RevokeQuestion(
        this.auth.getCurrentUser().userId,
        questionId,
        this.forwardToQS
      )
      .subscribe((response) => {
        this.notify.showSuccess("Revoked Notice Successfully", "");
        this._redirectTo();
      });
  }
  DisallowClause(index) {
    this.clauseIndex = index;
    this.disallowRules = true;
  }
  isMLA() {
    return this.auth.getCurrentUser().authorities.includes("MLA");
  }
  transferDate() {
    if (this.validateTDForm.valid) {
      if (this.validateTDForm.controls.transfarableDate.value) {
        let TD = this.validateTDForm.controls.transfarableDate.value;
        this.modalService.confirm({
          nzClassName: "pdng",
          nzContent:
            "Are you sure you want to transfer date from " +
            moment(this.qDetail.question.tmpQDate).format("DD-MM-YYYY") +
            " to " +
            moment(TD).format("DD-MM-YYYY") +
            "?",
          nzOkText: "OK",
          nzCancelText: "Cancel",
          nzOnOk: () => this._reroutetoqsa(),
        });
      }
    } else {
      for (const i in this.validateTDForm.controls) {
        this.validateTDForm.controls[i].markAsDirty();
        this.validateTDForm.controls[i].updateValueAndValidity();
      }
    }
  }
  _reroutetoqsa() {
    if (this.validateTDForm.controls.portfolio.value) {
      this.qDetail.question.questionDate = this.validateTDForm.controls.transfarableDate.value;
    }
    if (this.validateTDForm.controls.portfolio.value) {
      const portfolio = this.validateTDForm.controls.portfolio.value;
      this.qDetail.question.respondentMemberId = portfolio.id;
    }
    if (this.validateTDForm.controls.ministerSubject.value) {
      const ministerSubject = this.validateTDForm.controls.ministerSubject
        .value;
      this.qDetail.question.ministerSubjectId = ministerSubject.id;
    }
    if (this.validateTDForm.controls.subSubjectId.value) {
      const subSubjectId = this.validateTDForm.controls.subSubjectId.value;
      this.qDetail.question.ministerSubSubjectId = subSubjectId.id;
    }
    this.forwardToQS = this._defineRoles()[2];
    this.question
      .forwardOradmitQuestion(
        this.qDetail.question,
        "forward",
        this.forwardToQS,
        this.auth.getCurrentUser().userId,
        this._findRole()
      )
      .subscribe(() => {
        this.notify.showSuccess("Success", "");
        this._redirectTo();
      });
  }
  _findRole() {
    if (this.auth.getCurrentUser().authorities.indexOf("speaker") !== -1) {
      return "speaker";
    }
    return this.auth.getCurrentUser().authorities[0];
  }
  _setReasonForCategoryChange(direction) {
    if (
      this.qDetail.question.type === "NORMAL" &&
      this.qDetail.question.category == "UNSTARRED"
    ) {
      if (!direction) {
        let rulearray = [];
        rulearray = this.qDetail.question.directions.filter(
          (element) => element.type === "DIRECTION"
        );
        if (rulearray.length > 0) {
          const item = rulearray.reduce((prev, current) =>
            +prev.id > +current.id ? prev : current
          );
          this.changeCategoryReason = true;
          this.changeCategoryRule = item.direction;
        }
      } else {
        this.changeCategoryReason = true;
        this.changeCategoryRule = direction;
      }
    } else {
      this.changeCategoryReason = false;
    }
  }
  _IsQs() {
    if (
      this.auth.getCurrentUser().authorities.includes(this._defineRoles()[10])
    ) {
      return true;
    } else if (
      !this.auth
        .getCurrentUser()
        .authorities.includes(this._defineRoles()[0]) &&
      !this.auth
        .getCurrentUser()
        .authorities.includes(this._defineRoles()[1]) &&
      !this.auth.getCurrentUser().authorities.includes(this._defineRoles()[11])
    ) {
      return true;
    }
    return false;
  }
  _defineRoles() {
    return [
      "MLA",
      "parliamentaryPartySecretary",
      "assistant",
      "sectionOfficer",
      "underSecretary",
      "deputySecretary",
      "jointSecretary",
      "specialSecretary",
      "additionalSecretary",
      "secretary",
      "speaker",
      "Department",
    ];
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
  capitalize(string) {
    if (typeof string !== "string") return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  getDesignationListByQDate(qdate) {
    if (qdate) {
      this.question.getDesignationList(qdate).subscribe((response) => {
        this.validateTDForm.controls.portfolio.reset();
        this.validateTDForm.controls.ministerSubject.reset();
        this.validateTDForm.controls.subSubjectId.reset();
        this.TDTMParams["TMData"] = response ? response : [];
        this.TDTMParams["TMData"].forEach((element) => {
          if (element.name) {
            element.name = element.name.replace(/\s+/g, " ");
          }
        });
        this.TDTMParams["TMData"] = this.TDTMParams["TMData"].filter(
          (v, i, a) => a.findIndex((t) => t.name === v.name) === i
        );
        this.TDTMParams["TMData"].sort((a, b) => (a.name > b.name ? 1 : -1));
      });
    }
  }
  getMinisterSubject(e) {
    if (e) {
      this.question.getMinisterSubject(e.id).subscribe((response) => {
        this.validateTDForm.controls.ministerSubject.reset();
        this.validateTDForm.controls.subSubjectId.reset();
        this.TDTMParams["ministerSubjects"] = response ? response : [];
        this.TDTMParams["ministerSubjects"].sort((a, b) =>
          a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1
        );
      });
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
