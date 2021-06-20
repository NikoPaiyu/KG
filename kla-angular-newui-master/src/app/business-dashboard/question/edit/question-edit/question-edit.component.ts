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
import { Location } from "@angular/common";

@Component({
  selector: "app-question-edit",
  templateUrl: "./question-edit.component.html",
  styleUrls: ["./question-edit.component.scss"],
})
export class QuestionEditComponent implements OnInit {
  isReordered = false;
  showPreview = false;
  previousDate = null;
  showPreviewModalFlag = false;
  previewData;
  showClauseTag = [];
  bodyStyle = {
    overflow: "auto",
    "padding-bottom": "53px",
    display: "flex",
    "flex-direction": "column",
    height: "100%",
  };
  clauseRemains;
  clauseIndex;
  ShowRules = false;
  currentRuleStatement = "";
  directionList = [];
  visible = false;
  tags = [];
  @Input() value = "";
  validateForm: FormGroup;
  ministers: object = [];
  ministerSubject: object = [];
  questionDate: any;
  allquestionDates: any;
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
  mlalist;
  mlalistTemp;
  partyId;
  questionID;
  showDirection = false;
  reason = "";
  count = 1;
  clubbableMLACount;
  clauseWordCount;
  showWordCount;
  clauseMaxCount;
  clauseCount;
  dateFormat = "dd-MM-yyyy";
  primaryMember;
  str: any;
  assemblySession: object = [];
  today = "";
  priorityList: any = [];
  validCategory: boolean = true;
  statusParam = "";
  showConsent = false;
  myPartyMembers = [];
  consentedPartyMembers = [];
  listofconsentedPartyMembers = [];
  consentedMembers = [];
  listOfconsentedMembers = [];
  tempmyPartyMembers = [];
  tempconsentedPartyMembers = [];
  tempconsentedMembers = [];
  searchParam;
  searchParams;
  radioValue1;
  radioValue2;
  radioValue3;
  parties = [];
  selectedPartyId;
  selectedMember;
  selectedTab;
  @ViewChild("tagInput", { static: false }) inputElement: ElementRef;
  @ViewChild("clauseTagInput", { static: false }) clauseTagElement: ElementRef;
  selectedPriority = "empty";
  popupmessge = "";
  configurableParms = {
    minTitleChar: 0,
    maxTitleChar: 100,
    minClauseWord: 0,
    maxReasonChar: 255,
  };
  submissionThroughPPO = false;
  constructor(
    private fb: FormBuilder,
    private question: QuestionService,
    private notify: NotificationCustomService,
    private route: ActivatedRoute,
    private auth: AuthService,
    private router: Router,
    private modalService: NzModalService,
    public rbsService: QuestionRBSService,
    private location: Location
  ) {
    this.today = new Date().toISOString().split("T")[0];
    this.formValidation();
  }

  ngOnInit(): void {
    this.primaryMember = this.auth.getCurrentUser();
    this.route.params.subscribe((params) => {
      if (params["id"]) {
        this.statusParam = params.status;
        this.questionID = params["id"];
        this._loadData();
        this.getPPOConfig();
      }
    });
  }
  _loadData() {
    if (this.auth.getCurrentUser().authorities.indexOf("assistant") !== -1) {
      this.getMlaList();
      this.setMemberGroup();
    } else if (
      this.auth
        .getCurrentUser()
        .authorities.indexOf("parliamentaryPartySecretary") !== -1
    ) {
      this.getPPOConsentList(this.auth.getCurrentUser().userId);
      this.setMemberGroup();
    } else {
      this.getEditQuestion();
    }
  }
  getPPOConfig() {
    if (this.auth.getCurrentUser().userId) {
      this.question
        .getPPOConfig(this.auth.getCurrentUser().userId)
        .subscribe((res) => {
          if (res) {
            this.submissionThroughPPO = res["submissionThroughPPO"];
            // console.log("submissionThroughPPO:",this.submissionThroughPPO )
          }
        });
    }
  }
  getMlaList() {
    this.question.getAllExcludingMinisters().subscribe((response) => {
      this.mlalist = response;
      this.mlalistTemp = response;
      this.getEditQuestion();
    });
  }
  getPPOConsentList(userId) {
    let ppomemberlist = [];
    let arr = [];
    this.question.getMyPartyMembers(userId).subscribe((response) => {
      if (Array.isArray(response)) {
        ppomemberlist = response;
        arr = ppomemberlist.filter(
          (element) =>
            element.roles &&
            element.roles[0].roleName !== "parliamentaryPartySecretary"
        );
        this.mlalist = this.mlalistTemp = arr.filter(
          (thing, index, self) =>
            index === self.findIndex((t) => t.userId === thing.userId)
        );
      }
      this.getEditQuestion();
    });
  }
  getAssemblySession() {
    this.question.getAllAssemblyAndSession().subscribe((res) => {
      if (res) {
        this.assemblySession = res;
        this.assemblySession["session"] = this.findSessionListByAssembly(this.assemblySession['assembly'].currentassembly, this.assemblySession["sessionByAssembly"]);
          if (!this.qDetail.question.assemblyId) {
            this.qDetail.question.assemblyId = this.assemblySession['assembly'].currentassembly;
            this.validateForm.controls["assemblyId"].setValue(
              this.qDetail.question.assemblyId
            );
          }

          if (!this.qDetail.question.sessionId) {
            this.qDetail.question.sessionId = this.assemblySession['session'].currentsession;
            this.validateForm.controls["sessionId"].setValue(
              this.qDetail.question.sessionId
            );
          }
          // this.assemblySession["assembly"] = assembly;
          // this.assemblySession["assembly"].currentassemblyLabel = assembly.find(
          //   (item) => item.id === this.qDetail.question.assemblyId
          // ).assemblyId;
          // this.assemblySession["assembly"].currentassembly = assembly.find(
          //   (item) => item.id === this.qDetail.question.assemblyId
          // ).id;
          // this.assemblySession["session"] = session;
          // this.assemblySession["session"].currentsessionLabel = session.find(
          //   (item) => item.id === this.qDetail.question.sessionId
          // ).sessionId;
          // this.assemblySession["session"].currentsession = session.find(
          //   (item) => item.id === this.qDetail.question.sessionId
          // ).id;
        }
        this._setQuestionDate();
    });
  }
  findSessionListByAssembly(currentassembly, assemblySession) {
    let session = assemblySession.find(
      (element) => element.id === currentassembly).session;
      return session;
  }
  listSorted(orderedClause) {
    this.isReordered = true;
    for (let i = 0; i < orderedClause.length; i++) {
      this.validateForm.controls.clauses.value[i] = orderedClause[i].value;
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
            //this._sortOnNoticeType();
          }
          this.validateForm.controls.ministerSubject.reset();
          this.validateForm.controls.portfolio.reset();
          this.portfolio = null;
          this.validateForm.controls.questionDate.reset();
        });
    }
  }
  getMlaListByParty(party) {
    if (party) {
      this.validateForm.patchValue({
        primaryMember: null,
      });
      if (party !== "All") {
        this.mlalist = this.mlalistTemp.filter(
          (x) => x.details.memberGroup == party
        );
      } else {
        this.mlalist = this.mlalistTemp;
      }
    }
  }
  getConsentsOfMLA(e) {
    if (e != null) {
      this.count = 1;
      this.qDetail.question.clubbingDetails = [
        {
          id: null,
          noticeNumber: null,
          clubbingOrder: 1,
          memberId: e.id,
          primaryMember: true,
          memberName: e.fullName,
        },
      ];
      this.qDetail.clubbableMembers = [];
      this.getClubbedMLAList(e.id);
      this.editableFields.clubbmla = true;
      this.primaryMember = e;
      this.primaryMember.userId = e.id;
      this._getExistingQuestionCount();
    } else {
      this.editableFields.clubbmla = false;
      this.validCategory = true;
    }
  }
  getClubbedMLAList(userId) {
    let memmberList;
    let arr = [];
    this.question.getAllConsentsTaken(userId).subscribe((response) => {
      if (Array.isArray(response)) {
        memmberList = response;
        memmberList.forEach((element) => {
          // if (
          //   element.memberFrom &&
          //   element.memberFrom.roles &&
          //   element.memberFrom.roles[0].roleName !==
          //     "parliamentaryPartySecretary"
          // ) {
          if (element.memberIdFrom && element.memberIdFrom !== userId) {
            arr.push({
              memberTo: element.memberFrom,
              memberIdTo: element.memberIdFrom,
            });
          } else if (element.memberIdTo && element.memberIdTo !== userId) {
            arr.push({
              memberTo: element.memberTo,
              memberIdTo: element.memberIdTo,
            });
          }
          // }
        });
        let memeberDetails;
        memeberDetails = arr.filter(
          (thing, index, self) =>
            index ===
            self.findIndex((t) => t.memberTo && thing.memberTo
              ? t.memberTo.userId === thing.memberTo.userId
              : false)
        );
        memeberDetails = memeberDetails.filter(
          (element) =>
            element.memberTo &&
            element.memberTo.roles &&
            element.memberTo.roles[0].roleName !== "parliamentaryPartySecretary"
        );
        memeberDetails = memeberDetails.filter(
          (element) => element.memberIdTo !== userId
        );
        memeberDetails.forEach((element) => {
          const found = this.qDetail.question.clubbingDetails.some(
            (el) => el.memberId === element.memberTo.userId
          );
          const obj = {};
          obj['alreadyExist'] =  (found) ? true : false;
          obj["memberId"] = element.memberTo.userId;
          obj["memberName"] = element.memberTo.details.fullName;
          this.qDetail.clubbableMembers.push(obj);
        });
      }
    });
    if (this.isPPO()) {
      this.myPartyMembers = this.tempmyPartyMembers;
      this.consentedMembers = this.tempconsentedMembers;
      this.consentedPartyMembers = this.tempconsentedPartyMembers;
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
      ministerSubject: [null],
      heading: [null, [Validators.required]],
      clauses: this.fb.array([]),
      clubbingDetails: [null, [Validators.required]],
      tags: [null],
      forwardToQS: [null],
      primaryMember: [null],
      partyName: [null],
      transfarableDate: [null],
      retainInBank: [null],
    });
  }
  getEditQuestion() {
    let editSttaus = ["SAVED", "QUESTION_BANK", "SUBMITTED_TO_PPO"];
    this.question
      .getView(this.questionID, this.auth.getCurrentUser().userId)
      .subscribe((response) => {
        this.getConfigurableCount()
          .then((resp) => {
            this.qDetail = response;
            this.previousDate = this.qDetail.questionDate;
            this.getAssemblySession();
            this.count = this.qDetail.question.clubbingDetails.length;
            this.loadRBSPermissions();
            this.getPartyNameByMemberId(this.qDetail.question.primaryMemberId);
            this.getClubbedMLAList(this.qDetail.question.primaryMemberId);
            this.getDesignationData().then((value) => {
              this.bindData(response).then((value) => {
                this.editNewQuestion();
                if (editSttaus.includes(this.qDetail.question.status)) {
                  this._getExistingQuestionCount();
                }
              });
            });
          })
          .catch((e) => console.log(e));
      });
  }
  async bindData(response) {
    this._setMinisterData(response).then((value) => {
      this._setClubbedMemberData(response).then((value) => {
        return;
      });
    });
  }
  async getConfigurableCount() {
    this.question.getClubbableMLACount().subscribe((count) => {
      this.clubbableMLACount = count;
      this.question.getClauseCount().subscribe((count1) => {
        this.clauseMaxCount = count1;
        this.question.getClauseWordCount().subscribe((count1) => {
          this.showWordCount = count1;
          this.clauseWordCount = this.showWordCount;
          return;
        });
      });
    });
  }
  async getDesignationData() {
    if (
      this.qDetail.question.questionDate == null &&
      this.qDetail.question.status != "QUESTION_BANK"
    ) {
      this.qDetail.portfolio = [];
      return;
    }
    if (this.qDetail.question.status === "QUESTION_BANK") {
      this.question.getPortfolios().subscribe((designation) => {
        this.qDetail.portfolio = designation ? designation : [];

        this.portfolio = this.qDetail.portfolio ? this.qDetail.portfolio : [];
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
          this.qDetail.portfolio = this.portfolio.find(
            (o) => o.id === this.qDetail.question.respondentMemberId
          );
          this.validateForm.patchValue({
            portfolio: this.qDetail.portfolio,
          });
        }

        if (this.qDetail.question.respondentMemberId == null) {
          this.qDetail.ministerSubject = [];
          return;
        }
        this.question
          .getMinisterSubject(this.qDetail.question.respondentMemberId)
          .subscribe((ministersub) => {
            this.qDetail.ministerSubject = ministersub ? ministersub : [];

            this.ministerSubjects = this.qDetail.ministerSubject
              ? this.qDetail.ministerSubject
              : [];
            this.ministerSubjects.sort((a, b) =>
              a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1
            );

            if (this.qDetail.question.ministerSubjectId) {
              this.qDetail.ministerSubject = this.ministerSubjects.find(
                (o) => o.id === this.qDetail.question.ministerSubjectId
              );
              this.validateForm.patchValue({
                ministerSubject: this.qDetail.ministerSubject,
              });
            }
            return;
          });
      });
    } else {
      this.question
        .getDesignationList(this.qDetail.question.questionDate)
        .subscribe((designation) => {
          this.qDetail.portfolio = designation ? designation : [];
          this.portfolio = this.qDetail.portfolio ? this.qDetail.portfolio : [];
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
            this.qDetail.portfolio = this.portfolio.find(
              (o) => o.id === this.qDetail.question.respondentMemberId
            );
            this.validateForm.patchValue({
              portfolio: this.qDetail.portfolio,
            });
          }

          if (this.qDetail.question.respondentMemberId == null) {
            this.qDetail.ministerSubject = [];
            return;
          }
          this.question
            .getMinisterSubject(this.qDetail.question.respondentMemberId)
            .subscribe((ministersub) => {
              this.qDetail.ministerSubject = ministersub ? ministersub : [];

              this.ministerSubjects = this.qDetail.ministerSubject
                ? this.qDetail.ministerSubject
                : [];
              this.ministerSubjects.sort((a, b) =>
                a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1
              );

              if (this.qDetail.question.ministerSubjectId) {
                this.qDetail.ministerSubject = this.ministerSubjects.find(
                  (o) => o.id === this.qDetail.question.ministerSubjectId
                );
                this.validateForm.patchValue({
                  ministerSubject: this.qDetail.ministerSubject,
                });
              }
              return;
            });
        });
    }
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
          this.qDetail.question.status !== "QUESTION_BANK" &&
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
  async _setClubbedMemberData(_qDetail) {
    const newArr = [];
    let arr = [];
    let primaryMemberId = _qDetail.question.primaryMemberId;
    _qDetail.clubbableMembers.forEach((element) => {
      if (element.memberIdFrom != primaryMemberId) {
        arr.push({
          memberTo: element.memberFrom,
          memberIdTo: element.memberIdFrom,
        });
      } else if (element.memberIdTo != primaryMemberId) {
        arr.push({
          memberTo: element.memberTo,
          memberIdTo: element.memberIdTo,
        });
      }
    });
    _qDetail.clubbableMembers = arr.filter(
      (thing, index, self) =>
        index ===
        self.findIndex((t) => (t.memberTo && t.memberTo.userId === thing.memberTo && thing.memberTo.userId)
        ));
    _qDetail.clubbableMembers = _qDetail.clubbableMembers.filter(
      (element) =>
        element.memberTo &&
        element.memberTo.roles &&
        element.memberTo.roles[0].roleName !== "parliamentaryPartySecretary"
    );
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
    if (this.isPPO()) {
      this.getMembersofTab("myparty");
      this.getMembersofTab("consentedParty");
      this.getMembersofTab("consentedMember");
    }
    return;
  }
  async _setMinisterData(_qDetail) {
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
      if (
        this.qDetail.question.ministerSubSubjectId &&
        _qDetail.question.ministerSubjects
      ) {
        let subsubject = _qDetail.ministerSubjects.find(
          (el) => el.id == this.qDetail.question.ministerSubSubjectId
        );
        if (subsubject)
          this.qDetail.question.ministerSubSubjectName = subsubject.title;
      }
      return;
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
  bindMinisterSubSubject(e) { }
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
    if (this.qDetail.question.type === "SHORT_NOTICE") {
      this.getListOfPortfolio();
      return;
    }
    if (this.validateForm.value.priority) {
      this.validateForm.controls.priority.reset();
    }
    if (this.validateForm.controls["questionDate"].value) {
      let qdate = this.validateForm.controls["questionDate"].value;
      this.question.getDesignationList(qdate).subscribe((response: any) => {
        if (
          this.validateForm.value.portfolio &&
          !response.find(
            (element) => element.id == this.validateForm.value.portfolio.id
          )
        ) {
          this.modalService.warning({
            nzClassName: "pdng",
            nzContent:
              "Selected Minister Not Available On This Date. Do you want to continue?",
            nzOkText: "Yes",
            nzCancelText: "No",
            nzOnCancel: () => {
              this.validateForm.controls["questionDate"].setValue(
                this.previousDate
              );
            },
            nzOnOk: () => {
              if (this.validateForm.value.portfolio) {
                this.validateForm.controls.portfolio.reset();
              }
              if (this.validateForm.value.ministerSubject) {
                this.validateForm.controls.ministerSubject.reset();
              }
              this.previousDate = this.validateForm.controls[
                "questionDate"
              ].value;
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
            },
          });
        } else {
          this.previousDate = this.validateForm.controls["questionDate"].value;
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
        }
      });
    }
  }
  editNewQuestion() {
    const question = this.qDetail.question;
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
       // ministerSubject: this.qDetail.ministerSubjects,
       // portfolio: this.qDetail.portfolio,
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
    }
    this.getpriority();
  }
  removeClubbedMla(mla: {}): void {
    if (this.isPPO()) {
      this.removeMemberFromConsent(mla);
    } else {
      this.qDetail.question.clubbingDetails = this.qDetail.question.clubbingDetails.filter(
        (tag) => tag !== mla
      );
      this.qDetail.clubbableMembers.push(mla);
     // tslint:disable-next-line: max-line-length
      this.qDetail.clubbableMembers = this.qDetail.clubbableMembers.filter((v: { memberId: any; }, i: any, a: any[]) => a.findIndex(t => (t.memberId === v.memberId)) === i);
      this.qDetail.clubbableMembers.forEach((element: { memberId: any; alreadyExist: boolean; }) => {
      const found = this.qDetail.question.clubbingDetails.some(
        (el: { memberId: any; }) => el.memberId === element.memberId
      );
      element.alreadyExist =  (found) ? true : false;
    });
      this.validateForm.controls.clubbingDetails.setValue(
        this.qDetail.question.clubbingDetails
      );
      this.count--;
    }
    this._getExistingQuestionCount();
    if (this.validateForm.value.priority) {
      this.validateForm.controls.priority.reset();
    }
    this.selectedPriority = "empty";
  }
  addMla(): void {
    if (this.isPPO()) {
      this.showConsentList();
    } else {
      this.showAddMla = true;
    }
    if (this.count >= this.clubbableMLACount) {
      this._showSuccessMsg("Maximum allowed MLAs is " + this.clubbableMLACount);
      this.showAddMla = false;
      if (this.isPPO()) {
        this.showConsent = false;
      }
    }
  }
  addMlAOnChange(e) {
    if (e) {
      const found = this.qDetail.clubbableMembers.some(
        (el) => el.memberId === e.memberId
      );
      if (found) {
        this.qDetail.question.clubbingDetails.push(e);
        this.qDetail.clubbableMembers = this.qDetail.clubbableMembers.filter(
          (tag) => tag !== e
        );
        this.validateForm.controls.clubbingDetails.setValue(
          this.qDetail.question.clubbingDetails
        );
        this.count++;
      }
      if (e.memberId) {
        this.checkQcountofaddMLA(e.memberId);
        if (this.validateForm.value.priority) {
          this.validateForm.controls.priority.reset();
          this.selectedPriority = "empty";
        }
      }
    }
    this.showAddMla = false;
  }
  get qClause() {
    const controls = this.validateForm.get("clauses") as FormArray;
    this.clauseCount = controls.length;
    return controls;
  }
  addTag(): void {
    const newTag = { tag: this.validateForm.value.tags };
    if (
      newTag.tag &&
      this.qDetail.question.tags &&
      this.qDetail.question.tags.indexOf(newTag) === -1
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
      // this.validateForm.value.clauses[index].tags
      // .setValue([...this.validateForm.value.clauses[index].tags, newTag]);
    }

    formgrp.controls.clauseTags.setValue(null);
    this.showClauseTag[index] = false;
  }
  addNewClause() {
    this.clauseRemains = this.clauseMaxCount - 5;
    if (
      typeof this.clauseCount === "undefined" ||
      this.clauseCount < this.clauseMaxCount
    ) {
      if (this.validateForm.controls.clauses.value.length === 5) {
        this.modalService.info({
          nzBodyStyle: { margin: "20px" },
          nzTitle:
            "Already reached 5 clauses, only " +
            this.clauseRemains +
            " more clauses can be added",
        });
      }
      if (this._isValidClause()) {
        const control = this.validateForm.controls.clauses as FormArray;
        control.push(
          this.fb.group({
            subSubjectId: [null],
            clause: [null, Validators.compose([Validators.required])],
            tags: [[]],
            clauseTags: [null],
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
          if (count < this.configurableParms.minClauseWord) {
            this.notify.showWarning(
              "Minimum word count for clause is " +
              this.configurableParms.minClauseWord,
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
  submitForm(flag, confirmDialog) {
    if (this._isFormValid(flag)) {
      if (this._isNonMember()) {
        return false;
      }
      // if (this._checkIfShortNotice(flag)) {
      //   return false;
      // }
      const qData = this._buildPostData(
        this.validateForm.value,
        this._submitMmberData()["primaryMemberId"],
        flag
      );
      if ((flag && confirmDialog) || (!flag && !confirmDialog)) {
        this.question
          .submit(
            qData,
            flag,
            this._submitMmberData()["primaryMemberId"],
            this._submitMmberData()["createdBy"]
          )
          .subscribe((element) => {
            this._showSuccessMsg(null);
            this._redirectTo();
          });
      } else {
        this.previewData = qData;
        this.previewData.assemblyId = this.assemblySession["assembly"].find(
          (item) => item.id === this.previewData.assemblyId
        ).assemblyId;
        this.previewData.sessionId = this.assemblySession["session"].find(
          (item) => item.id === this.previewData.session
        ).sessionId;
        this.previewData.subjectName = this.previewData.ministerSubject
          ? this.ministerSubjects.find(
            (item) => item.id === this.previewData.ministerSubject
          ).title
          : "";
        this.previewData.selportfolio = this.validateForm.value.portfolio;
        this.previewData.submissionThroughPPO = this.issubmissionThroughPPO();
        this.showPreview = true;
      }
    } else if (flag) {
      this._validateClauses();
    }
  }
  issubmissionThroughPPO() {
    if (this.submissionThroughPPO && this.isMLA()) {
      return true;
    }
    return false;
  }
  saveToQuestionBank(flag, confirmDialog) {
    if (this._isFormValid(flag)) {
      if (this._isNonMember()) {
        return false;
      }
      // if (this._checkIfShortNotice(flag)) {
      //   return false;
      // }
      const qData = this._buildPostData(
        this.validateForm.value,
        this._submitMmberData()["primaryMemberId"],
        flag
      );
      if ((flag && confirmDialog) || (!flag && !confirmDialog)) {
        this.question
          .addToQuestionBank(
            qData,
            this._submitMmberData()["primaryMemberId"],
            this._submitMmberData()["createdBy"]
          )
          .subscribe((element) => {
            this._showSuccessMsg(null);
            this._redirectTo();
          });
      }
    } else if (flag) {
      this._validateClauses();
    }
  }
  changeQCategory() {
    if (
      this.qDetail.question.status === "SAVED" ||
      this.qDetail.question.status === "QUESTION_BANK" || 
      this.qDetail.question.status === "SUBMITTED_TO_PPO"
    ) {
      this._getExistingQuestionCount();
    }
    if (
      this.validateForm.controls.category.value === "UNSTARRED" &&
      this.editableFields.showrule
    ) {
      this.showDirection = true;
    } else {
      this.qDetail.question.category = this.validateForm.controls.category.value;
    }
    this.getpriority();
  }
  cancelDelete() { }
  disabledDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, new Date()) < 0;
  };
  deleteQuestion(questionId: number) {
    setTimeout(() => {
      this._showSuccessMsg("Question Deleted Successfully");
      this._redirectTo();
    }, 700);
    this.question.deleteQuestion(questionId).subscribe((response) => { });
  }
  getPartyNameByMemberId(memberID) {
    if (this.mlalist) {
      let memberDetails = this.mlalist.find((x) => x.details.id == memberID);
      this.getMlaListByParty(memberDetails.details.memberGroup);
      // this.partyId = memberDetails.details.memberGroup;
      this.validateForm.patchValue({
        primaryMember: memberDetails.details,
        partyName: memberDetails.details.memberGroup,
      });
    }
  }
  setMemberGroup() {
    this.memberGroup = [
      {
        memberGroupName: "Ruling Party",
        memberGroupId: "RULING_PARTY",
      },
      {
        memberGroupName: "Oposition Party",
        memberGroupId: "OPOSITION_PARTY",
      },
    ];
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
  _isNonMember() {
    const authorities = this.auth.getCurrentUser().authorities;
    if (
      (authorities.indexOf("parliamentaryPartySecretary") !== -1 ||
        authorities.indexOf("assistant") !== -1) &&
      this.validateForm.value.primaryMember == null
    ) {
      this.notify.showWarning("Warning", "Please Select MLA");
      return true;
    }
    return false;
  }
  _isFormValid(flag) {
    if (!flag) {
      if (this.validateMandatoryFieldForSave()) {
        if (this._isAllClauseValid()) {
          return true;
        }
      }
    } else if (this.validateForm.valid) {
      if (this._isAllClauseValid()) {
        return true;
      }
    } else {
      return false;
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
  _hasMinClauseWordCount(clause) {
    clause = clause.replace(/(\r\n|\n|\r)/gm, " ");
    clause = clause.replace(/(^\s*)|(\s*$)/gi, "");
    clause = clause.replace(/[ ]{2,}/gi, " ");
    const count = clause.split(" ").length;
    if (count < this.configurableParms.minClauseWord) {
      this.notify.showWarning(
        "Minimum word count for clause is " +
        this.configurableParms.minClauseWord,
        ""
      );
      return false;
    }
    return true;
  }
  validateMandatoryFieldForSave() {
    let status = true;
    if (this.validateForm.controls.heading.status === "INVALID") {
      this.validateForm.controls.heading.markAsDirty();
      this.validateForm.controls.heading.updateValueAndValidity();
      status = false;
    }
    if (this.validateForm.value.clauses) {
      if (this.validateForm.value.clauses.length === 1) {
        if (this.validateForm.value.clauses[0].clause === "") {
          this._validateClauses();
        }
      }
    }
    if (this.validateForm.controls.heading.value) {
      status = this._validateCharLimitForHeading();
    }
    return status;
  }
  _validateCharLimitForHeading() {
    let title = this.validateForm.controls.heading.value.trim();
    if (title.length < this.configurableParms.minTitleChar) {
      this.notify.showWarning(
        "Warning",
        "Minimum character limit for heading is " +
        this.configurableParms.minTitleChar
      );
      return false;
    } else if (title.length > this.configurableParms.maxTitleChar) {
      this.notify.showWarning(
        "Warning",
        "Maximum character limit " +
        this.configurableParms.maxTitleChar +
        " will exceed"
      );
      return false;
    }
    return true;
  }
  _buildPostData(qData, primaryMemberId, flag) {
    var questionDto: any = {
      id: this.qDetail.question.id,
      status: this.qDetail.question.status,
      assemblyId: qData.assemblyId,
      session: qData.sessionId,
      primaryMember: primaryMemberId,
      portfolio: qData.portfolio ? qData.portfolio.id : null,
      ministerSubject: qData.ministerSubject ? qData.ministerSubject.id : null,
      category: qData.category ? qData.category : null,
      priority: qData.priority ? qData.priority : null,
      questionClauses: this._keepClauseOrder(qData.clauses),
      title: qData.heading,
      questionDate: qData.questionDate,
      clubbingDetails: this._keepClubbingMemberOrder(),
      tags: this.qDetail.question.tags,
      type: this.qDetail.question.type,
      reason: qData.reason ? qData.reason : null,
      retainInBank: qData.retainInBank === true ? true : false,
      isFromBank:
        this.qDetail.question.status === "QUESTION_BANK" ? true : false,
      submittedThroughId:
        this.qDetail.question.status === "SUBMITTED_TO_PPO"
          ? this.auth.getCurrentUser().userId
          : null,
    };
    questionDto.status =
      questionDto.status === "QUESTION_BANK" ? questionDto.status : "";
    return questionDto;
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
  _keepClubbingMemberOrder() {
    let clubbingOrder = 0;
    if (this.qDetail.question.clubbingDetails) {
      this.qDetail.question.clubbingDetails.forEach(async (value) => {
        clubbingOrder++;
        value.clubbingOrder = clubbingOrder;
      });
      return this.qDetail.question.clubbingDetails;
    }
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
  _sortOnNoticeType() {
    let normalNoticeDates = [];
    let shortNoticeDates = [];
    const tenDysDiff = new Date().getTime() + 10 * 24 * 60 * 60 * 1000;
    // const twoDysDiff = new Date().getTime() + 1 * 24 * 60 * 60 * 1000;
    this.allquestionDates.forEach((element) => {
      const AODtimestamp = new Date(element).getTime();
      if (AODtimestamp >= tenDysDiff) {
        normalNoticeDates.push(element);
      } else if (this.qDetail.question.type === "SHORT_NOTICE") {
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
    if (
      this.qDetail.question.type === "SHORT_NOTICE" &&
      this.validateForm.value.questionDate
    ) {
      if (
        !this.questionDate.find(
          (element) => element === this.validateForm.value.questionDate
        )
      ) {
        this.validateForm.controls.questionDate.setValue(null);
      }
    }
  }
  _showSuccessMsg(msg) {
    msg = msg ? msg : "Add Success";
    this.notify.showSuccess(msg, "");
  }
  _redirectTo() {
    this.location.back();
  }
  _getExistingQuestionCount() {
    if (this.qDetail.question.type === "SHORT_NOTICE") {
      return;
    }
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
  isMLA() {
    return this.auth.getCurrentUser().authorities.includes("MLA");
  }
  isPPO() {
    return this.auth
      .getCurrentUser()
      .authorities.includes("parliamentaryPartySecretary");
  }
  _checkIfShortNotice(flag) {
    const tenDysDiff = new Date().getTime() + 9 * 24 * 60 * 60 * 1000;
    const AODtimestamp = new Date(
      this.validateForm.value.questionDate
    ).getTime();
    if (AODtimestamp <= tenDysDiff) {
      if (this.qDetail.question.type === "NORMAL" && flag) {
        this._confirmShortNoticeMsg();
        return true;
      }
    }
    return false;
  }
  _confirmShortNoticeMsg() {
    let msg =
      "You are trying to submit a short notice, Are you sure you want to continue without Member Clubbing? ";
    this.modalService.confirm({
      nzClassName: "pdng",
      nzContent: msg,
      nzOkText: "OK",
      nzCancelText: "Cancel",
      nzOnOk: () => this._setElementsAsShort(),
      nzOnCancel: () => console.log("cancel"),
    });
  }
  _convertToShortNotice() {
    let msg =
      "You are trying to convert a normal notice to a short notice, Do you want to continue ? ";
    if (
      this.qDetail.question &&
      this.qDetail.question.clubbingDetails.length > 1
    ) {
      msg =
        "You are trying to convert a normal notice to a short notice, Are you sure you want to continue without Member Clubbing? ";
    }
    this.modalService.confirm({
      nzClassName: "pdng",
      nzContent: msg,
      nzOkText: "Yes",
      nzCancelText: "No",
      nzOnOk: () => this._setElementsAsShort(),
      nzOnCancel: () => console.log("cancel"),
    });
  }
  _setElementsAsShort() {
    this.buttonlist.Save = false;
    this.buttonlist.Submit = false;
    this.buttonlist.SubmitShortNotice = true;
    this.validateForm.addControl(
      "reason",
      new FormControl(null, Validators.required)
    );
    this.qDetail.question.type = "SHORT_NOTICE";
    const clubbing = this.qDetail.question.clubbingDetails.filter(
      (item) => item.primaryMember === true
    );
    this.qDetail.question.clubbingDetails = clubbing;
    this.validateForm.controls.category.setValue("STARRED");
    this.qDetail.question.category = "STARRED";
    this.qDetail.question.priority = null;
    this.validateForm.controls.portfolio.reset();
    this.validateForm.controls.ministerSubject.reset();
    this.validCategory = true;
    this.getQdateFromCOS();
  }
  getQdateFromCOS() {
    this.question
      .getCOSquestionDates(
        this.qDetail.question.assemblyId,
        this.qDetail.question.sessionId
      )
      .subscribe((Response: []) => {
        const today = new Date().toISOString().split("T")[0];
        this.questionDate = Response.filter((date) => date > today);
        this.questionDate = this.allquestionDates = this.questionDate.filter(
          (v, i, a) => a.findIndex((t) => t === v) === i
        );
        this.questionDate.sort();
        this._sortOnNoticeType();
      });
  }
  getListOfPortfolio() {
    this.question.listOfPortfolio().subscribe((response) => {
      this.portfolio = response;
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
  checkQcountofaddMLA(mla) {
    if (this.validateForm.value.questionDate && mla) {
      let ids = [];
      ids.push(mla);
      const body = {
        assemblyId: this.assemblySession["assembly"].currentassembly,
        category: this.validateForm.value.category,
        questionDate: this.validateForm.value.questionDate,
        sessionId: this.validateForm.value.sessionId,
        userId: mla,
        memberIds: ids,
      };
      let pids = [];
      if (this.validateForm.value.clubbingDetails) {
        this.validateForm.value.clubbingDetails.forEach((element) => {
          pids.push(element.memberId);
        });
      }
      this.question.validateCategoryCount(body).subscribe((isValid) => {
        this.validCategory = isValid["status"];
        if (!isValid["status"] || isValid["message"]) {
          this.modalService.warning({
            nzClassName: "pdng",
            nzContent: isValid["message"],
            nzOkText: "OK",
            nzOnOk: () => console.log("OK"),
          });
        }
      });
      this.getPriorityList(pids);
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
  checkQcountonQuestionDate() {
    if (this.validateForm.value.clubbingDetails) {
      const body = {
        assemblyId: this.assemblySession["assembly"].currentassembly,
        category: this.validateForm.value.category,
        questionDate: this.validateForm.value.questionDate,
        sessionId: this.validateForm.value.sessionId,
        clubbedMLA: this.validateForm.value.clubbingDetails,
      };
      // this.question.validateCategoryCount(body).subscribe((isValid) => {

      // });
      this.modalService.warning({
        nzClassName: "pdng",
        nzContent: "clubbed not allowed",
        nzOkText: "OK",
        nzOnOk: () => console.log("OK"),
      });
    }
  }
  cancelPreview() {
    this.previewData = null;
    this.showPreview = false;
  }
  getpriority() {
    if (this.validateForm.value.category && this.validateForm.value.category == "UNSTARRED") {
      this.popupmessge = "";
      return;
    }
    if ((this.validateForm.value.category && this.validateForm.value.category == "STARRED") ||
      (this.qDetail.question.category == "STARRED")) {
      let priority = this.validateForm.value.priority;
      if (priority) {
        this.selectedPriority = priority;
      } else {
        this.selectedPriority = "empty";
      }
      this.popupmessge = "with Priority as " + this.selectedPriority;
    }
  }

  showPreviewModal() {
    const qData = this._buildPostData(
      this.validateForm.value,
      this._submitMmberData()["primaryMemberId"],
      null
    );
    this.previewData = qData;
    this.previewData.assemblyId = this.assemblySession["assembly"].find(
      (item) => item.id === this.previewData.assemblyId
    ).assemblyId;
    this.previewData.sessionId = this.assemblySession["session"].find(
      (item) => item.id === this.previewData.session
    ).sessionId;
    this.previewData.subjectName = this.previewData.ministerSubject
      ? this.ministerSubjects.find(
        (item) => item.id === this.previewData.ministerSubject
      ).title
      : "";
    this.previewData.selportfolio = this.validateForm.value.portfolio;
    this.showPreviewModalFlag = true;
  }

  cancelPreviewModal() {
    this.previewData = null;
    this.showPreviewModalFlag = false;
  }
  retainInBank() { }

  showConsentList() {
    this.showConsent = true;
    this.showAddMla = false;
    this.selectedMember = null;
    if (this.primaryMember) {
      this.myPartyMembers = this.myPartyMembers.filter(
        (element) => element.memberIdTo != this.primaryMember.userId
      );
      this.consentedPartyMembers = this.consentedPartyMembers.filter(
        (element) => element.memberIdTo != this.primaryMember.userId
      );
      this.consentedMembers = this.consentedMembers.filter(
        (element) => element.memberIdTo != this.primaryMember.userId
      );
    }
  }
  cancelConsentList() {
    this.radioValue1 = this.radioValue2 = this.radioValue3 = null;
    this.showConsent = false;
    this.showAddMla = false;
    // this.noticeType=false;
    this.selectedPartyId = 0;
    this.searchParam = null;
    this.searchParams = null;
  }
  getSelectedMember(data, tab) {
    this.selectedMember = data;
    this.selectedTab = tab;
    if (tab == "myparty") {
      this.radioValue2 = this.radioValue3 = null;
    }
    if (tab == "consentedParty") {
      this.radioValue1 = this.radioValue3 = null;
    }
    if (tab == "consentedMember") {
      this.radioValue1 = this.radioValue2 = null;
    }
  }
  onAddMLAOk() {
    this.radioValue1 = this.radioValue2 = this.radioValue3 = null;
    if (this.selectedMember == null) {
      this.notify.showWarning("Please select a Member", "");
      return;
    }
    this.showConsent = false;
    let e = this.selectedMember;
    this.selectedMember = null;
    this.selectedPartyId = 0;
    this.searchParam = null;
    this.searchParams = null;
    if (e) {
      e.newAdded = true;
      this.qDetail.question.clubbingDetails.push(e);
      if (this.selectedTab == "myparty") {
        this.myPartyMembers = this.myPartyMembers.filter((tag) => tag !== e);
      }
      if (this.selectedTab == "consentedParty") {
        this.consentedPartyMembers = this.consentedPartyMembers.filter(
          (tag) => tag !== e
        );
      }
      if (this.selectedTab == "consentedMember") {
        this.consentedMembers = this.consentedMembers.filter(
          (tag) => tag !== e
        );
      }
      this.validateForm.controls.clubbingDetails.setValue(
        this.qDetail.question.clubbingDetails
      );
      this.count++;
      if (e.memberIdTo) {
        this.checkQcountofaddMLA(e.memberIdTo);
        if (this.validateForm.value.priority) {
          this.validateForm.controls.priority.reset();
          this.selectedPriority = "empty";
        }
      }
    }
  }
  removeMemberFromConsent(mla) {
    this.qDetail.question.clubbingDetails = this.qDetail.question.clubbingDetails.filter(
      (tag) => tag !== mla
    );
    if (mla.tab == "myparty") {
      this.myPartyMembers.push(mla);
    }
    if (mla.tab == "consentedParty") {
      this.consentedPartyMembers.push(mla);
    }
    if (mla.tab == "consentedMember") {
      this.consentedMembers.push(mla);
    }
    this.validateForm.controls.clubbingDetails.setValue(
      this.qDetail.question.clubbingDetails
    );
    this.count--;
  }
  getMembersofTab(tab) {
    if (tab == "myparty") {
      let newarr = [];
      let partyMemberArray = [];
      this.searchParam = null;
      this.question
        .getMyPartyMembers(this.auth.getCurrentUser().userId)
        .subscribe((res: any) => {
          partyMemberArray = res;
          partyMemberArray.forEach((element) => {
            if (element.userId) {
              newarr.push({
                memberIdTo: element.userId,
                memberTo: element,
                tab: "myparty",
                memberName: element.details.fullName,
                memberId: element.userId,
                primaryMember: false,
              });
            }
          });
          this.tempmyPartyMembers = newarr;
          this.myPartyMembers = newarr;
          this.qDetail.question.clubbingDetails.forEach((element) => {
            this.myPartyMembers.forEach((el) => {
              if (element.memberId === el.memberId) {
                element.tab = "myparty";
                element.memberIdTo = el.memberIdTo;
                element.memberTo = el.memberTo;
                var index = this.myPartyMembers.indexOf(el);
                this.myPartyMembers.splice(index, 1);
              }
            });
          });
        });
    } else if (tab == "consentedParty") {
      let newarr = [];
      let MemberArray = [];
      this.searchParam = null;
      this.selectedPartyId = 0;
      this.question
        .getConsentedPartyMembers(this.auth.getCurrentUser().userId)
        .subscribe((res: any) => {
          this.parties = res.politicalParties;
          MemberArray = res.users;
          MemberArray.forEach((element) => {
            if (element.userId) {
              newarr.push({
                memberIdTo: element.userId,
                memberTo: element,
                tab: "consentedParty",
                memberName: element.details.fullName,
                memberId: element.userId,
                primaryMember: false,
              });
            }
          });
          this.tempconsentedPartyMembers = newarr;
          this.consentedPartyMembers = this.listofconsentedPartyMembers = newarr;
          this.qDetail.question.clubbingDetails.forEach((element) => {
            this.consentedPartyMembers.forEach((el) => {
              if (element.memberId === el.memberId) {
                element.tab = "consentedParty";
                element.memberIdTo = el.memberIdTo;
                element.memberTo = el.memberTo;
                var index = this.consentedPartyMembers.indexOf(el);
                this.consentedPartyMembers.splice(index, 1);
              }
            });
          });
        });
    } else if (tab == "consentedMember") {
      let newarr = [];
      let partyMemberArray = [];
      this.searchParam = null;
      this.question
        .getConsentedMembers(this.auth.getCurrentUser().userId)
        .subscribe((res: any) => {
          partyMemberArray = res;
          partyMemberArray.forEach((element) => {
            if (element.userId) {
              newarr.push({
                memberIdTo: element.userId,
                memberTo: element,
                tab: "consentedMember",
                memberName: element.details.fullName,
                memberId: element.userId,
                primaryMember: false,
              });
            }
          });
          this.tempconsentedMembers = newarr;
          this.consentedMembers = this.listOfconsentedMembers = newarr;
          this.qDetail.question.clubbingDetails.forEach((element) => {
            this.consentedMembers.forEach((el) => {
              if (element.memberId === el.memberId) {
                element.tab = "consentedMember";
                element.memberIdTo = el.memberIdTo;
                element.memberTo = el.memberTo;
                var index = this.consentedMembers.indexOf(el);
                this.consentedMembers.splice(index, 1);
              }
            });
          });
        });
    }
  }
  searchOnConsentList(tab) {
    if (tab == "tab1") {
      let listofData = [];
      listofData = this.myPartyMembers;
      if (this.searchParam) {
        this.myPartyMembers = listofData.filter((element) =>
          element.memberTo.details.fullName
            .toLowerCase()
            .includes(this.searchParam.toLowerCase())
        );
      } else {
        this.myPartyMembers = listofData;
      }
    } else if (tab == "tab3") {
      if (this.searchParams) {
        this.consentedMembers = this.listOfconsentedMembers.filter((element) =>
          element.memberTo.details.fullName
            .toLowerCase()
            .includes(this.searchParams.toLowerCase())
        );
      } else {
        this.consentedMembers = this.listOfconsentedMembers;
      }
    }
  }
  searchBasedParty() {
    if (this.selectedPartyId == 0 && !this.searchParam) {
      this.consentedPartyMembers = this.listofconsentedPartyMembers;
    } else {
      this.consentedPartyMembers = this.listofconsentedPartyMembers.filter(
        (element) =>
          this.filterItem(element, this.selectedPartyId, this.searchParam)
      );
    }
  }
  filterItem(item: any, selectedPartyId, name) {
    if (
      selectedPartyId > 0 &&
      !name &&
      item.memberTo.details.keralaPolicticalPartyid == selectedPartyId
    ) {
      return true;
    } else if (
      name &&
      selectedPartyId == 0 &&
      item.memberTo.details.fullName.toLowerCase().includes(name.toLowerCase())
    ) {
      return true;
    } else if (
      item.memberTo.details.keralaPolicticalPartyid == selectedPartyId &&
      item.memberTo.details.fullName.toLowerCase().includes(name.toLowerCase())
    ) {
      return true;
    }
    return false;
  }

  submitFormAsShortNotice(flag, confirmDialog) {
    if (this._isFormValid(flag)) {
      if (this._isNonMember()) {
        return false;
      }
      // if (this._checkIfShortNotice(flag)) {
      //   return false;
      // }
      const qData = this._buildPostData(
        this.validateForm.value,
        this._submitMmberData()["primaryMemberId"],
        flag
      );
      if ((flag && confirmDialog) || (!flag && !confirmDialog)) {
        this.question
          .submitAsShortNotice(
            qData,
            this._submitMmberData()["primaryMemberId"]
          )
          .subscribe((element) => {
            this._showSuccessMsg("Submitted As Short Notice.");
            this.question
              .deleteQuestion(this.qDetail.question.id)
              .subscribe((response) => { });
            this._redirectTo();
          });
      } else {
        this._showPreview(qData);
      }
    } else if (flag) {
      this._validateClauses();
    }
  }
  _showPreview(qData) {
    this.previewData = qData;
    this.previewData.assemblyId = this.assemblySession["assembly"].find(
      (item) => item.id === this.previewData.assemblyId
    ).assemblyId;
    this.previewData.sessionId = this.assemblySession["session"].find(
      (item) => item.id === this.previewData.session
    ).sessionId;
    this.previewData.subjectName = this.previewData.ministerSubject
      ? this.ministerSubjects.find(
        (item) => item.id === this.previewData.ministerSubject
      ).title
      : "";
    this.previewData.selportfolio = this.validateForm.value.portfolio;
    this.showPreview = true;
  }
  canRemoveWithPPOPermisiion(mla) {
    if (this.qDetail.question.status === "SUBMITTED_TO_PPO") {
      if (mla.newAdded) {
        return true;
      }
    } else {
      return true;
    }
  }
  onBack() {
    localStorage.setItem("hasFilter", "true");
    this.location.back();
    // this.router.navigate(["list-mla-ntc"], {relativeTo: this.route.parent});
  }
}
