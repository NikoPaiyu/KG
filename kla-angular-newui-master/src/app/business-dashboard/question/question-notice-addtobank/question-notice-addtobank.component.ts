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
import { Location } from '@angular/common';
@Component({
  selector: 'app-question-notice-addtobank',
  templateUrl: './question-notice-addtobank.component.html',
  styleUrls: ['./question-notice-addtobank.component.scss']
})
export class QuestionNoticeAddtobankComponent implements OnInit {

  showPreview = false;
  showPreviewModalFlag = false;
  previewData;
  noticeCategory = "UNSTARRED";
  validateForm: FormGroup;
  questionClausesList: any = [];
  portfolio;
  ministerSubject;
  questionDate;
  upper = ["A", "B", "C", "D", "E", "F", "G", "H"];
  memeberDetails;
  mlalist;
  mlalistTemp;
  selMlaArray;
  newMlaList = [];
  count = 1;
  clubbableMLACount;
  clauseCount;
  clauseWordCount;
  showWordCount;
  showAddMla = false;
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
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private question: QuestionService,
    private notify: NotificationCustomService,
    private modalService: NzModalService,
    private auth: AuthService,
    private route: ActivatedRoute,
    public rbsService: QuestionRBSService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.formValidation();
      this.getListOfPortfolio();
      this.primaryMember = this.auth.getCurrentUser();
      this.loadRBSPermissions();
      this.getConfigurableCount();
      if (this.noticeType) {
        this.showAddMla = true;
        this.noticeCategory = "STARRED";
      }
    });
  }
  getConfigurableCount(): void {
      this.question.getClauseCount().subscribe((count1) => {
        this.clauseCount = count1;
        this.question.getClauseWordCount().subscribe((count2) => {
          this.showWordCount = count2;
          this.clauseWordCount = this.showWordCount;
        });
      });
  }
  loadRBSPermissions() {
    if (this.auth.getCurrentUser().userId) {
      this.rbsService
        .getQuestionPermissions(this.auth.getCurrentUser().userId)
        .subscribe((response) => {
          this.rbsPermission = this.rbsService.getrbsPermissionForCreate();

        });
    }
  }
  formValidation(): void {
    this.validateForm = this.fb.group({
      session: [null],
      partyName: [null],
      primaryMember: [null],
      clubbingDetails: [null],
      portfolio: [null, [Validators.required]],
      questionDate: [null,],
      category: [null, [Validators.required]],
      ministerSubject: [null],
      // ministerSubject: [null, [Validators.required]],
      title: [null, [Validators.required]],
      clauseVal: [null, [Validators.required]],
    });
    if (this.noticeType === "snq") {
      this.validateForm.addControl(
        "reason",
        new FormControl(null, Validators.required)
      );
    }
  }
  getListOfPortfolio() {
    this.question.listOfPortfolio().subscribe((response) => {
      // this.question.getPortfolios().subscribe((response) => {
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
  saveToQuestionBank() {
    if (this._isFormValid()) {
      if (this._isNonMember()) {
        return false;
      }
      this._pushLoggedUserToClubbingDet();
      this.validateForm.value.type =
        this.noticeType === "snq" ? "SHORT_NOTICE" : "NORMAL";
      this.questionClausesList = this._buildQuestionClausesList(
        this.questionClausesList
      );
      this.validateForm.value.questionClauses = this.questionClausesList;
      this.validateForm.value.portfolio = this.validateForm.value.portfolio
        ? this.validateForm.value.portfolio.id
        : null;
      const request = this.validateForm.value;
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
  _sortOnNoticeType() {
    const normalNoticeDates = [];
    const shortNoticeDates = [];
    const tenDysDiff = new Date().getTime() + 9 * 24 * 60 * 60 * 1000;
    const twoDysDiff = new Date().getTime() + 1 * 24 * 60 * 60 * 1000;
    this.questionDate.forEach((element) => {
      const AODtimestamp = new Date(element).getTime();
      if (AODtimestamp >= tenDysDiff) {
        normalNoticeDates.push(element);
      } else if (this.noticeType === "snq" && AODtimestamp >= twoDysDiff) {
        shortNoticeDates.push(element);
      }
    });
    this.questionDate =
      this.noticeType === "snq" ? shortNoticeDates : normalNoticeDates;
    this.questionDate.sort();
  }

  addMoreClause() {
    const clause = this.validateForm.get("clauseVal").value;
    if (clause) {
      if (this.questionClausesList.length === 4) {
        this.modalService.info({
          nzBodyStyle: { margin: "20px" },
          nzTitle:
            "Already reached 5 clauses, only " +
            (this.clauseCount - 5) +
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
        this.notify.showSuccess("Maximum allowed clause is ", this.clauseCount);
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
  _isFormValid() {
    if (this.validateMandatoryFieldForSave() && this._isAllClauseValid()) {
      return true;
    }
    return false;
  }
  _isAllClauseValid() {
    let counter = 0;
    if (
      this.validateForm.controls.title.value &&
      !this._validateCharLimitForHeading()
    ) {
      return false;
    }
    let questionsclauses = _.clone(this.questionClausesList);
    const qusetionClauseVal = this.validateForm.get("clauseVal").value;
    if (qusetionClauseVal) {
      questionsclauses.push({ clause: qusetionClauseVal, tags: [] });
    }
    if (questionsclauses && questionsclauses.length > 0) {
      // tslint:disable-next-line: forin
      for (const i in questionsclauses) {
        counter++;
        if (!this._hasMinClauseWordCount(questionsclauses[i].clause)) {
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
    if (this.validateForm.valid) {
      status = true;
    }
    else {
      for (const key in this.validateForm.controls) {
        this.validateForm.controls[key].markAsDirty();
        this.validateForm.controls[key].updateValueAndValidity();
        status = false;
      }
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
    this.router.navigate(["question-bank"],
    {relativeTo: this.route.parent});
  }

  isPPO() {
    return this.auth
      .getCurrentUser()
      .authorities.includes("parliamentaryPartySecretary");
  }


}
