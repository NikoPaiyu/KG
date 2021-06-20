import { Component, OnInit, TemplateRef } from "@angular/core";
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl,
} from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { QuestionService } from "../shared/question.service";
import { QuestionRBSService } from "../shared/question-rbs.service";
import { NotificationCustomService } from "src/app/shared/services/notification.service";
import { NzModalService } from "ng-zorro-antd/modal";
import { AuthService } from "src/app/auth/shared/services/auth.service";
import { differenceInCalendarDays } from "date-fns";
import * as _ from "lodash";
@Component({
  selector: "app-question-create",
  templateUrl: "./question-create.component.html",
  styleUrls: ["./question-create.component.scss"],
})
export class QuestionCreateComponent implements OnInit {
  clauseRemains;
  isReordered = false;
  showPreview = false;
  showPreviewModalFlag = false;
  previewData;
  noticeCategory = "STARRED";
  validateForm: FormGroup;
  questionClausesList: any = [];
  portfolio;
  ministerSubject;
  questionDate;
  upper = ["A", "B", "C", "D", "E", "F", "G", "H"];
  memeberDetails;
  mlalist = [];
  mlalistTemp = [];
  selMlaArray;
  newMlaList = [];
  count = 1;
  clubbableMLACount;
  clauseCount;
  clauseWordCount;
  showWordCount;
  showAddMla = false;
  showConsent = false;
  myPartyMembers = [];
  tempmyPartyMembers = [];
  consentedPartyMembers = [];
  tempconsentedPartyMembers = [];
  listofconsentedPartyMembers = [];
  consentedMembers = [];
  tempconsentedMembers = [];
  listOfconsentedMembers = [];
  radioValue1;
  radioValue2;
  radioValue3;
  searchParam;
  searchParams;
  parties = [];
  selectedPartyId;
  selectedMember;
  selectedTab;
  clauseHide = true;
  clauseNo = true;
  rbsPermission;
  primaryMember;
  isCount: boolean;
  str: String;
  partyId = "All";
  noticeType;
  assemblySession: object = [];
  priorityList: any = [];
  validCategory = true;
  showQDateSection = true;
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
    private router: Router,
    private question: QuestionService,
    private notify: NotificationCustomService,
    private modalService: NzModalService,
    private auth: AuthService,
    private route: ActivatedRoute,
    public rbsService: QuestionRBSService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.formValidation();
      this.getAssemblySession();
      this.getClubbedMLAList(this.auth.getCurrentUser().userId);
      this.primaryMember = this.auth.getCurrentUser();
      this.loadRBSPermissions();
      this.getConfigurableCount();
      this.getPPOConfig();
    });
  }
  getPPOConfig() {
    if (this.auth.getCurrentUser().userId) {
      this.question
        .getPPOConfig(this.auth.getCurrentUser().userId)
        .subscribe((res) => {
          if (res) {
            this.submissionThroughPPO = res["submissionThroughPPO"];
          }
        });
    }
  }
  loadRBSPermissions() {
    if (this.auth.getCurrentUser().userId) {
      this.rbsService
        .getQuestionPermissions(this.auth.getCurrentUser().userId)
        .subscribe((response) => {
          this.rbsPermission = this.rbsService.getrbsPermissionForCreate();
          if (this.rbsPermission.addmla) {
            if (this.isPPO()) {
              this.getPPOConsentList(this.auth.getCurrentUser().userId);
              this.getMembersofTab("myparty");
              this.getMembersofTab("consentedParty");
              this.getMembersofTab("consentedMember");
              return;
            }
            this.getMlaList();
          }
        });
    }
  }
  getPPOConsentList(userId) {
    let ppomemberlist = [];
    let arr = [];
    this.question.getMyPartyMembers(userId).subscribe((response) => {
      if (Array.isArray(response)) {
        ppomemberlist = response;
        this.mlalist = ppomemberlist.filter(
          (thing, index, self) =>
            index === self.findIndex((t) => t.userId === thing.userId)
        );
        this.filterPPOMlaList();
      }
    });
  }
  formValidation(): void {
    this.validateForm = this.fb.group({
      session: [null, [Validators.required]],
      partyName: [null],
      primaryMember: [null],
      clubbingDetails: [null],
      portfolio: [null, [Validators.required]],
      questionDate: [null, [Validators.required]],
      category: [null],
      ministerSubject: [null],
      title: [null, [Validators.required]],
      clauseVal: [null, [Validators.required]],
      priority: [null]
    });
  }
  getQuestionDateList() {
    if (this.validateForm.value.questionDate) {
      this.validateForm.controls.questionDate.reset();
    }
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
    if (
      this.assemblySession["assembly"].currentassembly &&
      this.assemblySession["session"].currentsession
    ) {
      this.question
        .getNoticeDate(
          this.assemblySession["assembly"].currentassembly,
          this.assemblySession["session"].currentsession
        )
        .subscribe((res: any) => {
          if (Array.isArray(res)) {
            const today = new Date().toISOString().split("T")[0];
            this.questionDate = res.filter((date) => date > today);
            this.questionDate = this.questionDate.filter(
              (v, i, a) => a.findIndex((t) => t === v) === i
            );
            this.questionDate.sort();
            this.showQDateSection = true;
          }
        });
    }
  }
  getListOfPortfolio() {
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
      const qdate = this.validateForm.value.questionDate;
      this.question.getDesignationList(qdate).subscribe((response) => {
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
  }

  listSorted($event) {
    this.isReordered = true;
  }
  getAssemblySession() {
    this.question.getAllAssemblyAndSession().subscribe((res) => {
      if (res) {
        this.assemblySession = res;
        this.findSessionListByAssembly(this.assemblySession['assembly'].currentassembly);
      }
      this.getQuestionDateList();
    });
  }
  
  findSessionListByAssembly(selAssembly) {
    if (this.assemblySession) {
      if (this.assemblySession['sessionByAssembly'].
      find(
        (element) => element.id === selAssembly)) {
        let session = this.assemblySession['sessionByAssembly'].find(
          (element) => element.id === selAssembly).session;
        this.assemblySession['session'] = session;
        this.assemblySession['session'].currentsession = session.find(
          (element) => element.id === this.assemblySession['activeAssemblySession'].sessionId).id;
          this.assemblySession['session'].currentsessionLabel = session.find(
            (element) => element.id === this.assemblySession['activeAssemblySession'].sessionId).sessionId;
      }
    }
  }
  getClubbedMLAList(userId) {
    let mem;
    let arr = [];
    this.question.getAllConsentsTaken(userId).subscribe((response) => {
      if (Array.isArray(response)) {
        mem = response;
        mem.forEach((element) => {
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
        });
        this._filterMemberDetails(arr, userId);
      }
    });
    if (this.isPPO()) {
      this.myPartyMembers = this.tempmyPartyMembers;
      this.consentedMembers = this.tempconsentedMembers;
      this.consentedPartyMembers = this.tempconsentedPartyMembers;
    }
  }
  _filterMemberDetails(arr, userId) {
    this.memeberDetails = arr.filter(
      (thing, index, self) =>
        index ===
        self.findIndex((t) =>
          t.memberTo && thing.memberTo
            ? t.memberTo.userId === thing.memberTo.userId
            : false
        )
    );
    this.memeberDetails = this.memeberDetails.filter(
      (element) =>
        element.memberTo &&
        element.memberTo.roles &&
        element.memberTo.roles[0].roleName !== "parliamentaryPartySecretary"
    );
    this.memeberDetails = this.memeberDetails.filter(
      (element) => element.memberIdTo !== userId
    );
  }
  getConsentsOfMLA(e) {
    this.newMlaList = [];
    this.validateForm.controls.clubbingDetails.reset();
    if (this.validateForm.value.priority) {
      this.validateForm.controls.priority.reset();
      this.selectedPriority = "empty";
    }
    if (e != null) {
      this.count = 1;
      this.getClubbedMLAList(e.id);
      this.rbsPermission.clubbmla = true;
      this.primaryMember = e;
      this.primaryMember.userId = e.id;
      this._showmessage();
    } else {
      this.rbsPermission.clubbmla = false;
      this.validCategory = true;
    }
  }

  getConfigurableCount(): void {
    this.question.getClubbableMLACount().subscribe((count) => {
      this.clubbableMLACount = count;
      this.question.getClauseCount().subscribe((count1) => {
        this.clauseCount = count1;
        this.question.getClauseWordCount().subscribe((count2) => {
          this.showWordCount = count2;
          this.clauseWordCount = this.showWordCount;
        });
      });
    });
  }
  getMlaList() {
    this.question.getAllExcludingMinisters().subscribe((response: any) => {
      this.mlalist = response;
      this.mlalistTemp = response;
    });
  }
  getMlaListByParty(party) {
    this.mlalist = this.mlalistTemp;
    this.validateForm.controls.primaryMember.reset();
    if (party !== "All") {
      this.mlalist = this.mlalist.filter((x) => x.details.memberGroup == party);
    }
  }
  submitForm(flag, confirmDialog) {
    if (this._isFormValid(flag)) {
      if (this._isNonMember()) {
        return false;
      }
      if (!confirmDialog) {
        this._pushLoggedUserToClubbingDet();
      }
      this.validateForm.value.type = "NORMAL";
      this.validateForm.value.portfolio = this.setPortfolioId();
      if ((flag && confirmDialog) || (!flag && !confirmDialog)) {
        let clauses = [...this.questionClausesList];
        this.validateForm.value.questionClauses = this._buildQuestionClausesList(
          clauses
        );
        const request = { ...this.validateForm.value};
        request.assemblyId = this.assemblySession["assembly"].currentassembly;
        this.question
          .submit(
            request,
            flag,
            this.primaryMember.userId,
            this.auth.getCurrentUser().userId
          )
          .subscribe((element) => {
            this.notify.showSuccess("Add Success", "");
            this._clearVariables();
            this._redirectTo();
            this.cancelPreview();
          });
      } else {
        this._previewData();
      }
    } else if (flag) {
      for (const i in this.validateForm.controls) {
        if (this.validateForm.controls[i]) {
          this.validateForm.controls[i].markAsDirty();
          this.validateForm.controls[i].updateValueAndValidity();
        }
      }
    }
  }
  saveToQuestionBank(flag, confirmDialog) {
    if (this._isFormValid(flag)) {
      if (this._isNonMember()) {
        return false;
      }
      if (!confirmDialog) {
        this._pushLoggedUserToClubbingDet();
      }
      this.validateForm.value.type = "NORMAL";
      if ((flag && confirmDialog) || (!flag && !confirmDialog)) {
        this.questionClausesList = this._buildQuestionClausesList(
          this.questionClausesList
        );
        this.validateForm.value.questionClauses = this.questionClausesList;
        this.validateForm.value.portfolio = this.validateForm.value.portfolio
          ? this.validateForm.value.portfolio.id
          : null;
        const request = this.validateForm.value;
        request.assemblyId = this.assemblySession["assembly"].currentassembly;
        this._clearVariables();
        this.question
          .addToQuestionBank(
            request,
            this.primaryMember.userId,
            this.auth.getCurrentUser().userId
          )
          .subscribe((element) => {
            this.notify.showSuccess("Add Success", "");
            this._redirectTo();
          });
      }
    } else if (flag) {
      for (const i in this.validateForm.controls) {
        if (this.validateForm.controls[i]) {
          this.validateForm.controls[i].markAsDirty();
          this.validateForm.controls[i].updateValueAndValidity();
        }
      }
    }
  }
  getMinisterSubject(portfolio) {
    if (portfolio) {
      if (this.validateForm.value.ministerSubject) {
        this.validateForm.controls.ministerSubject.reset();
      }
      this.question.getMinisterSubject(portfolio.id).subscribe((response) => {
        this.ministerSubject = response;
        this.ministerSubject.sort((a, b) =>
          a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1
        );
      });
    } else {
      this.validateForm.controls.ministerSubject.reset();
      this.ministerSubject = null;
    }
  }
  _previewData() {
    this.previewData = this.validateForm.value;
    this.previewData.questionClauses = this._buildQuestionClausesList(
      _.clone(this.questionClausesList)
    );
    this.previewData.assemblyId = this.assemblySession[
      "assembly"
    ].currentassembly;
    this.previewData.assemblyId = this.assemblySession["assembly"].find(
      (item) => item.id === this.previewData.assemblyId
    ).assemblyId;
    this.previewData.sessionId = this.assemblySession["session"].find(
      (item) => item.id === this.previewData.session
    ).sessionId;
    if (this.previewData.ministerSubject) {
      this.previewData.subjectName = this.ministerSubject.find(
        (item) => item.id === this.previewData.ministerSubject
      ).title;
    }
    if (this.previewData.portfolio) {
      this.previewData.selportfolio = this.portfolio.find(
        (item) => item.id === this.previewData.portfolio
      );
    }
    this.previewData.submissionThroughPPO = this.issubmissionThroughPPO();
    this.showPreview = true;
  }
  issubmissionThroughPPO() {
    if (this.submissionThroughPPO && this.isMLA()) {
      return true;
    }
    return false;
  }
  _sortOnNoticeType() {
    const normalNoticeDates = [];
    const shortNoticeDates = [];
    const tenDysDiff = new Date().getTime() + 10 * 24 * 60 * 60 * 1000;
    const twoDysDiff = new Date().getTime() + 1 * 24 * 60 * 60 * 1000;
    this.questionDate.forEach((element) => {
      const AODtimestamp = new Date(element).getTime();
      if (AODtimestamp > tenDysDiff) {
        normalNoticeDates.push(element);
      }
    });
    this.questionDate = normalNoticeDates;
    this.questionDate.sort();
  }
  _setDataForPreview() {
    this.previewData = this.validateForm.value;
    this.previewData.questionClauses = this._buildQuestionClausesList(
      _.clone(this.questionClausesList)
    );
    this.previewData.assemblyId = this.assemblySession[
      "assembly"
    ].currentassembly;
    this.previewData.assemblyId = this.assemblySession["assembly"].find(
      (item) => item.id === this.previewData.assemblyId
    ).assemblyId;
    this.previewData.sessionId = this.assemblySession["session"].find(
      (item) => item.id === this.previewData.session
    ).sessionId;
    if (this.previewData.ministerSubject) {
      this.previewData.subjectName = this.ministerSubject.find(
        (item) => item.id === this.previewData.ministerSubject
      ).title;
    }
    this.showPreview = true;
  }
  getExistingQuestionCount() {
    if (this.validateForm.value && this.noticeCategory === "STARRED") {
      this.validateForm.addControl("priority", new FormControl(null));
    } else {
      this.validateForm.removeControl("priority");
      this.popupmessge = "";
    }
    this._showmessage();
  }
  addMoreClause() {
    const clause = this.validateForm.get("clauseVal").value;
    if (clause) {
      this.clauseRemains = this.clauseCount - 5;
      if (this.questionClausesList.length === 4) {
        this.modalService.info({
          nzBodyStyle: { margin: "20px" },
          nzTitle:
            "Already reached 5 clauses, only " +
            this.clauseRemains +
            " more clauses can be added",
        });
      }
      const valid = this.isValidClause(clause);
      if (!valid.status) {
        this.notify.showWarning(valid.msg, "");
        return;
      }
      this.validateForm.get("clauseVal").setValidators(null);
      const clauseData = {
        clause,
        answer: null,
        ministerSubSubject: null,
        isEdit: false,
        tags: [],
      };
      this.questionClausesList.push(clauseData);
      this.validateForm.get("clauseVal").setValue(null);
      if (this.questionClausesList.length >= this.clauseCount) {
        this.notify.showSuccess(
          "Maximum number of allowed clauses is ",
          this.clauseCount
        );
        this.clauseNo = false;
      }
    }
  }
  isValidClause(clause) {
    const result = {
      status: true,
      msg: "",
    };
    clause = clause.replace(/(\r\n|\n|\r)/gm, " ");
    clause = clause.replace(/(^\s*)|(\s*$)/gi, "");
    clause = clause.replace(/[ ]{2,}/gi, " ");
    const count = clause.split(" ").length;
    if (count < this.configurableParms.minClauseWord) {
      result.status = false;
      result.msg =
        "Minimum word count for clause is " +
        this.configurableParms.minClauseWord;
      return result;
    }
    return result;
  }
  saveClause(index, questionClause) {
    if (questionClause.clause) {
      this.questionClausesList[index].clause = questionClause.clause;
      this.questionClausesList[index].isEdit = false;
    } else {
      this.notify.showWarning("Enter Clause", "");
    }
  }
  showClauseAsEditable(index) {
    this.questionClausesList[index].isEdit = true;
  }
  removeClause(index) {
    if (this.questionClausesList.length == 1) {
      this.notify.showWarning("Sorry", "Clauses Cannot Be Empty");
      return;
    }
    this.clauseNo = true;
    if (index !== -1) {
      this.questionClausesList.splice(index, 1);
      let i = 0;
      for (const qCl of this.questionClausesList) {
        this.questionClausesList[i].clauseName =
          "Clauses(" + this.upper[i] + ")";
        i++;
      }
    }
    if (this.questionClausesList.length < 7) {
      this.clauseHide = false;
    }
  }
  addMlAOnChange(e) {
    if (e) {
      const found = this.memeberDetails.some(
        (el) => el.memberIdTo === e.memberIdTo
      );
      if (found) {
        this.newMlaList.push(e);
        this.memeberDetails = this.memeberDetails.filter((tag) => tag !== e);
        this.validateForm.controls.clubbingDetails.setValue(this.newMlaList);
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
    this.showAddMla = false;
  }
  removeClubbedMla(mla: {}): void {
    if (this.isPPO()) {
      this.removeMemberFromConsent(mla);
    } else {
      this.newMlaList = this.newMlaList.filter((tag) => tag !== mla);
      this.memeberDetails.push(mla);
      this.validateForm.controls.clubbingDetails.setValue(this.newMlaList);
      this.count--;
    }
    this.getExistingQuestionCount();
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
      this.notify.showSuccess(
        "Maximum allowed MLAs is ",
        this.clubbableMLACount
      );
      this.showAddMla = false;
      if (this.isPPO()) {
        this.showConsent = false;
      }
    }
  }

  onInput() {
    console.log(this.validateForm.value.clauseVal);
  }
  disableKey(content, e) {
    let key = e.keyCode || e.charCode;
    if (key == 8 || key == 46 || key == 17) {
      return true;
    } else {
      let key1 = e.keyCode || e.charCode;
      if (key1 == 32 || key1 == 13 || key == 86) {
        this.str = content;
        this.str = this.str.replace(/(\r\n|\n|\r)/gm, " ");
        this.str = this.str.replace(/(^\s*)|(\s*$)/gi, "");
        this.str = this.str.replace(/[ ]{2,}/gi, " ");
        const l = this.str.split(" ").length;
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
  onPaste(event: ClipboardEvent, index) {
    let max = this.clauseWordCount;
    let clipboardData = event.clipboardData;
    const pastedData = clipboardData.getData("Text");
    let wordCount = this.getWordCountOnPaste(pastedData);
    if (wordCount > max) {
      event.preventDefault();
      this.notify.showWarning(
        "Warning",
        "Cannot paste! Maximum Wordlimit" + this.clauseWordCount + "will exceed"
      );
    } else {
      let curdata;
      if (index == null) {
        curdata = this.validateForm.get("clauseVal").value;
      } else {
        curdata = this.questionClausesList[index].clause;
      }
      if (curdata) {
        const concatedData = curdata.concat(pastedData);
        const concatedlen = this.getWordCountOnPaste(concatedData);
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
  getTrimmedWord(max, data) {
    const testdata = data;
    let regex = /\s+/gi;
    let wordCount = data.trim().replace(regex, " ").split(" ").length;
    let trimmedData;
    while (wordCount > max) {
      let n = data.lastIndexOf(" ");
      trimmedData = testdata.slice(0, n);
      let regex = /\s+/gi;
      let wordCount = trimmedData.trim().replace(regex, " ").split(" ").length;
      data = trimmedData;
    }
    return data;
  }
  getWordCountOnPaste(data) {
    let regex = /\s+/gi;
    let datacount = data.trim().replace(regex, " ").split(" ").length;
    return datacount;
  }
  _pushLoggedUserToClubbingDet() {
    let clauseOrder = 1;
    let newData: any = [
      {
        memberId: this.primaryMember.userId,
        primaryMember: true,
        memberName: this.primaryMember ? this.primaryMember.fullName : "",
        clubbingOrder: clauseOrder++,
      },
    ];
    if (this.validateForm.value.clubbingDetails) {
      this.validateForm.value.clubbingDetails.forEach(async (element) => {
        if (element.memberIdTo) {
          newData.push({
            memberId: element.memberIdTo,
            memberName: element.memberTo
              ? element.memberTo.details
                ? element.memberTo.details.fullName
                : ""
              : "",
            clubbingOrder: clauseOrder++,
          });
        } else if (element.memberId) {
          newData.push({
            memberId: element.memberId,
            memberName: element.memberName,
            clubbingOrder: clauseOrder++,
          });
        }
      });
    }
    newData = newData.filter(
      (thing, index, self) =>
        index === self.findIndex((t) => t.memberId === thing.memberId)
    );
    this.validateForm.value.clubbingDetails = newData;
  }
  isMLA() {
    return this.auth.getCurrentUser().authorities.includes("MLA");
  }
  _buildQuestionClausesList(questionClausesList) {
    const qusetionClauseVal = this.validateForm.get("clauseVal").value;
    let clauseOrder = 0;
    if (qusetionClauseVal) {
      questionClausesList.push({ clause: qusetionClauseVal, tags: [] });
    }
    if (questionClausesList.length > 0) {
      questionClausesList.forEach(async (value) => {
        clauseOrder++;
        value.clauseOrder = clauseOrder;
        const lastclause = value.clause.trim();
        const lastChar = lastclause.charAt(lastclause.length - 1);
        if (questionClausesList.length === clauseOrder) {
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
    }
    return questionClausesList;
  }
  _isFormValid(flag) {
    this.validateForm.value.category = this.validateForm.value.category;
    if (!flag) {
      if (this.validateMandatoryFieldForSave() && this._isAllClauseValid()) {
        return true;
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
      this.validateForm.controls.title.value &&
      !this._validateCharLimitForHeading()
    ) {
      return false;
    }
    if (this.questionClausesList.length > 0) {
      // tslint:disable-next-line: forin
      for (const i in this.questionClausesList) {
        counter++;
        if (!this._hasMinClauseWordCount(this.questionClausesList[i].clause)) {
          return false;
        }
      }
    }
    return true;
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
    if (this.validateForm.controls.title.value === null) {
      this.validateForm.controls.title.markAsDirty();
      this.validateForm.controls.title.updateValueAndValidity();
      status = false;
    }
    if (this.questionClausesList.length === 0) {
      if (this.validateForm.controls.clauseVal.value === null) {
        this.validateForm.controls.clauseVal.markAsDirty();
        this.validateForm.controls.clauseVal.updateValueAndValidity();
        status = false;
      }
    }
    return status;
  }
  _validateCharLimitForHeading() {
    let title = this.validateForm.controls.title.value.trim();
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
  _cancelDelete(): void { }
  _showmessage() {
    const ids = [];
    if (this.validateForm.value.clubbingDetails) {
      this.validateForm.value.clubbingDetails.forEach((element) => {
        ids.push(element.memberIdTo);
      });
    }
    ids.push(this.primaryMember.userId);
    if (
      this.validateForm.value.category &&
      this.validateForm.value.questionDate &&
      this.primaryMember.userId
    ) {
      const body = {
        assemblyId: this.assemblySession["assembly"].currentassembly,
        category: this.validateForm.value.category,
        questionDate: this.validateForm.value.questionDate,
        sessionId: this.validateForm.value.session,
        userId: this.primaryMember.userId,
        memberIds: ids,
      };
      this.question.validateCategoryCount(body).subscribe((isValid) => {
        this.validCategory = true;
        if (!isValid["status"] || isValid["message"]) {
          this.validCategory = isValid["status"];
          this.modalService.warning({
            nzClassName: "pdng",
            nzContent: isValid["message"],
            nzOkText: "OK",
            nzOnOk: () => console.log("OK"),
          });
        }
      });
    }
    this.getPriorityList(ids);
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
  _clearVariables() {
    this.questionClausesList = [];
    this.selMlaArray = [];
    this.newMlaList = [];
    this.validateForm.controls.clubbingDetails.reset();
    this.validateForm.controls.portfolio.reset();
    this.validateForm.controls.questionDate.reset();
    this.validateForm.controls.category.reset();
    this.validateForm.controls.ministerSubject.reset();
    this.validateForm.controls.title.reset();
    this.validateForm.controls.clauseVal.reset();
    if (this.validateForm.controls.priority) {
      this.validateForm.controls.priority.reset();
    }
  }
  disabledDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, new Date()) < 0;
  };
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
  _redirectTo() {
    if (this.isMLA() || this.isPPO()) {
      this.router.navigate(["list-mla-ntc"],
        { relativeTo: this.route.parent });
    } else {
      this.router.navigate(["svd-list"],
        { relativeTo: this.route.parent });
    }
  }

  isPPO() {
    return this.auth
      .getCurrentUser()
      .authorities.includes("parliamentaryPartySecretary");
  }
  checkCountOfMLAOnSubmit() {
    const body = {
      assemblyId: this.assemblySession["assembly"].currentassembly,
      category: this.validateForm.value.category,
      questionDate: this.validateForm.value.questionDate,
      sessionId: this.validateForm.value.session,
      userId: this.primaryMember.userId,
    };
    const status = false;
    this.question.validateCategoryCount(body).subscribe((isValid) => {
      if (isValid["status"]) {
        this.modalService.warning({
          nzClassName: "pdng",
          nzContent: isValid["message"],
          nzOkText: "OK",
          nzOnOk: () => console.log("OK"),
        });
        return isValid["status"];
      }
    });
  }

  checkQcountofaddMLA(mla) {
    if (this.validateForm.value.questionDate && mla) {
      const ids = [];
      ids.push(mla);
      const body = {
        assemblyId: this.assemblySession["assembly"].currentassembly,
        category: this.validateForm.value.category,
        questionDate: this.validateForm.value.questionDate,
        sessionId: this.validateForm.value.session,
        userId: mla,
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
    }
    if (this.addMla) {
      const ids = [];
      if (this.validateForm.value.clubbingDetails) {
        this.validateForm.value.clubbingDetails.forEach((element) => {
          ids.push(element.memberIdTo);
        });
      }
      ids.push(this.primaryMember.userId);
      this.getPriorityList(ids);
    }
  }
  cancelPreview() {
    this.previewData = null;
    this.showPreview = false;
  }
  getpriority(priority) {
    if (this.validateForm.value.category == "STARRED") {
      if (priority) {
        this.selectedPriority = priority;
      } else {
        this.selectedPriority = "empty";
      }
      this.popupmessge = "with Priority as " + this.selectedPriority;
    }
  }

  showPreviewModal() {
    this._pushLoggedUserToClubbingDet();
    this.previewData = this.validateForm.value;
    this.previewData.questionClauses = this._buildQuestionClausesList(
      _.clone(this.questionClausesList)
    );
    this.previewData.assemblyId = this.assemblySession[
      "assembly"
    ].currentassembly;
    this.previewData.assemblyId = this.assemblySession["assembly"].find(
      (item) => item.id === this.previewData.assemblyId
    ).assemblyId;
    this.previewData.sessionId = this.assemblySession["session"].find(
      (item) => item.id === this.previewData.session
    ).sessionId;
    if (this.previewData.ministerSubject) {
      this.previewData.subjectName = this.ministerSubject.find(
        (item) => item.id === this.previewData.ministerSubject
      ).title;
    }
    this.showPreviewModalFlag = true;
  }

  cancelPreviewModal() {
    this.previewData = null;
    this.showPreviewModalFlag = false;
  }
  showConsentList() {
    this.showConsent = true;
    this.showAddMla = false;
    this.selectedMember = null;
    if (this.primaryMember) {
      this.myPartyMembers = this.myPartyMembers.filter(
        (element) => element.memberIdTo != this.primaryMember.userId
      );
      this.consentedPartyMembers = this.listofconsentedPartyMembers = this.consentedPartyMembers.filter(
        (element) => element.memberIdTo != this.primaryMember.userId
      );
      this.consentedMembers = this.listOfconsentedMembers = this.consentedMembers.filter(
        (element) => element.memberIdTo != this.primaryMember.userId
      );
      this.myPartyMembers.forEach((r, index) => {
        if (r.memberTo && r.memberTo.roles) {
          let found = r.memberTo.roles.find(
            (item) => item.roleName === "speaker"
          );
          if (found) {
            this.myPartyMembers.splice(index, 1);
          }
        }
      });
    }
  }
  cancelConsentList() {
    this.showConsent = false;
    this.showAddMla = false;
    this.noticeType = false;
    this.radioValue1 = this.radioValue2 = this.radioValue3 = null;
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
    this.selectedPartyId = 0;
    this.searchParam = null;
    this.searchParams = null;
    let e = this.selectedMember;
    this.selectedMember == null;
    if (e) {
      this.newMlaList.push(e);
      if (this.selectedTab == "myparty") {
        this.myPartyMembers = this.myPartyMembers.filter((tag) => tag !== e);
      }
      if (this.selectedTab == "consentedParty") {
        this.consentedPartyMembers = this.listofconsentedPartyMembers = this.consentedPartyMembers.filter(
          (tag) => tag !== e
        );
      }
      if (this.selectedTab == "consentedMember") {
        this.consentedMembers = this.listOfconsentedMembers = this.consentedMembers.filter(
          (tag) => tag !== e
        );
      }
      this.validateForm.controls.clubbingDetails.setValue(this.newMlaList);
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
    this.newMlaList = this.newMlaList.filter((tag) => tag !== mla);
    if (mla.tab == "myparty") {
      this.myPartyMembers.push(mla);
    }
    if (mla.tab == "consentedParty") {
      this.consentedPartyMembers.push(mla);
    }
    if (mla.tab == "consentedMember") {
      this.consentedMembers.push(mla);
    }
    this.validateForm.controls.clubbingDetails.setValue(this.newMlaList);
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
              });
            }
          });
          this.tempmyPartyMembers = newarr;
          this.myPartyMembers = newarr;
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
              });
            }
          });
          this.tempconsentedPartyMembers = newarr;
          this.consentedPartyMembers = this.listofconsentedPartyMembers = newarr;
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
              });
            }
          });
          this.tempconsentedMembers = newarr;
          this.consentedMembers = this.listOfconsentedMembers = newarr;
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
  filterPPOMlaList() {
    this.mlalist.forEach((r, index) => {
      if (r.roles) {
        let found = r.roles.find(
          (item) => item.roleName === "speaker" || item.roleName === "parliamentaryPartySecretary"
        );
        if (found) {
          this.mlalist.splice(index, 1);
        }
      }
    });
  }
  setPortfolioId() {
    if (this.validateForm.value.portfolio) {
      if (this.validateForm.value.portfolio.id) {
        return this.validateForm.value.portfolio.id;
      }
      return this.validateForm.value.portfolio
    }
    return null
  }
}
