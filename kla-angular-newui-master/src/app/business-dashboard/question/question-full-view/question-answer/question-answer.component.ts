import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Question } from '../../shared/model/question';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  FormArray,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationCustomService } from 'src/app/shared/services/notification.service';
import { QuestionService } from '../../shared/question.service';
import { UserData } from 'src/app/auth/shared/models';
import { AuthService } from 'src/app/auth/shared/services/auth.service';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import { UploadFile } from 'ng-zorro-antd';
import * as jspdf from 'jspdf';
import { Observable } from 'rxjs';
import { NzModalService, NzModalRef } from 'ng-zorro-antd';
import { ShortNoticePreviewComponent } from '../../shared/component/short-notice-preview/short-notice-preview.component';


@Component({
  selector: 'app-question-answers',
  templateUrl: './question-answer.component.html',
  styleUrls: ['./question-answer.component.scss'],
})
export class QuestionAnswerComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private question: QuestionService,
    private notify: NotificationCustomService,
    private route: ActivatedRoute,
    private auth: AuthService,
    private location: Location,
    private modalService: NzModalService
  ) { }

  get qClause() {
    const controls = this.validateForm.get("clauses") as FormArray;
    return controls;
  }
  delayStatementRequiredAfterDays;
  upper = ["A", "B", "C", "D", "E", "F", "G", "H"];
  questions: Question[] = [];
  radioValue;
  radioValue2;
  answer;
  tags = [];
  inputVisible = false;
  inputValue = "";
  editId: number = 0;
  inputAnswer = true;
  viewAnswer = false;
  editAnswer: boolean = false;
  listOfData;
  validateForm: FormGroup;
  questionClausesList: any = [];
  status = "FINAL";
  newAns: any;
  qDetail;
  qDetailTemp;
  primarymember;
  clubbableMembers;
  ministerSubjects;
  portfolio;
  isButtonVisible = true;
  dashBoardUrl;
  selportFolio;
  selportFolioId;
  selministerSubject;
  selministerSubjectId;
  questionId;
  correctionRequestBtnLabel = "Request For Change in Reply";
  correctionApplyBtnLabel = "Apply For Change in Reply"
  cnfrmApplyBtnLabel = "Are you sure you want to apply for change in reply?"
  @ViewChild("inputElement", { static: false }) inputElement: ElementRef;
  hasAnswer: boolean = false;
  currentUser: UserData;
  assemblySession: object = [];
  uploadURL = `${environment.fileupload_url}/uploadImage`;
  public fileList = [];
  public ansAttachment = [];
  public coverLetter = [];
  clauseId;
  answerId;
  showBtns = { showchangeInreply: false, showcorrectionApplyBtn: false, ShowTransferMinister: false, canShowCoverLetter: false }
  ngOnInit() {
    this.formValidation();
    this.getAssemblySession();
    this.qDetail = new Question();
  }
  formValidation() {
    this.validateForm = this.fb.group({
      clauses: this.fb.array([]),
    });
  }
  getAssemblySession() {
    this.question.getAllAssemblyAndSession().subscribe((res) => {
      if (res) {
        this.assemblySession = res;
        this.getQuestions();
        }
    });
  }
  getQuestions() {
    this.route.params.subscribe((params) => {
      this.questionId = params["id"];
      this.listOfData = new Question();
      this.question
        .getView(this.questionId, this.auth.getCurrentUser().userId)
        .subscribe((response) => {
          this.qDetailTemp = response;
          this.qDetail = response["question"];
          this.qDetail.assemblyId = this.assemblySession["assembly"].find(
            (item) => item.id === this.qDetail.assemblyId
          ).assemblyId;
          this.qDetail.sessionId = this.assemblySession["session"].find(
            (item) => item.id === this.qDetail.sessionId
          ).sessionId;
          this.qDetail.clauses.sort((a, b) =>
            a.clauseOrder > b.clauseOrder ? 1 : -1
          );
          this.primarymember =
            response["clubbableMembers"].length > 0
              ? response["clubbableMembers"][0].memberFrom
              : [];
          if (this.qDetail.dealayStatementUrl) {
            this.fileList = [
              {
                uid: -1,
                name: "Delay Statement",
                status: "done",
                url: this.qDetail.dealayStatementUrl,
              },
            ];
          }
          this.getDesignationData().then((value) =>
            new Observable((execute) => {
              execute.next(
                this.setdelayStatementRequiredAfterDays(
                  this.qDetail.questionDate
                )
              );
              execute.next(this._setMinisterData(response));
              execute.next(this.setClauseData(this.qDetail));
              execute.next(this._isAnswerGiven(this.qDetail.clauses));
              execute.next(this.canShowTransferMinister());
              execute.next(this.showchangeInreplyBtn());
              execute.complete();
            }).subscribe((res) => { })
          );
        });
    });
  }
  setdelayStatementRequiredAfterDays(questionDate) {
    this.question
      .getSoaBasedOnQuestionDate(questionDate)
      .subscribe((res: any) => {
        if (res.tempReplyIssueDeadlineDate) {
          this.delayStatementRequiredAfterDays = res.tempReplyIssueDeadlineDate;
        }
      });
  }
  async getDesignationData() {
    if (this.qDetail.questionDate == null) {
      this.qDetail.portfolio = [];
      return;
    }
    // this.question
    //   .getDesignationList(this.qDetail.questionDate)
    //   .subscribe((designation) => {
    this.question
      .getPortfolios()
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

        if (this.qDetail.respondentMemberId) {
          this.qDetail.portfolio = this.portfolio.find(
            (o) => o.id === this.qDetail.respondentMemberId
          );
        }
        if (this.qDetail.respondentMemberId == null) {
          this.qDetail.ministerSubject = [];
          return;
        }
        this.question
          .getMinisterSubject(this.qDetail.respondentMemberId)
          .subscribe((ministersub) => {
            this.qDetail.ministerSubject = ministersub ? ministersub : [];

            this.ministerSubjects = this.qDetail.ministerSubject
              ? this.qDetail.ministerSubject
              : [];
            this.ministerSubjects.sort((a, b) =>
              a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1
            );

            if (this.qDetail.ministerSubjectId) {
              this.qDetail.ministerSubject = this.ministerSubjects.find(
                (o) => o.id === this.qDetail.ministerSubjectId
              );
              if (this.qDetail.ministerSubSubjectId && this.qDetail.ministerSubject) {
                let subsubject = this.qDetail.ministerSubject.ministerSubSubjects.
                  find(el => el.id == this.qDetail.ministerSubSubjectId);
                if (subsubject)
                  this.qDetail.ministerSubSubjectName = subsubject.title;
              }
            }
          });
      });
  }
  _setMinisterData(ministerDet) {
    this.clubbableMembers = ministerDet.clubbableMembers
      ? ministerDet.clubbableMembers
      : [];
    this.ministerSubjects = ministerDet.ministerSubjects
      ? ministerDet.ministerSubjects
      : [];
    this.portfolio = ministerDet.portfolio ? ministerDet.portfolio : [];
    this.clubbableMembers = this.clubbableMembers.filter((n) =>
      this.qDetail.clubbingDetails.some((n2) => n.memberIdTo === n2.memberId)
    );
    this.clubbableMembers = this.clubbableMembers.filter(
      (v, i, a) => a.findIndex((t) => t.memberIdTo === v.memberIdTo) === i
    );
    this.clubbableMembers.sort((a, b) =>
      a.clubbableMembers > b.clubbableMembers ? 1 : -1
    );
    this.selportFolio = this.portfolio.find(
      (o) => o.id === this.qDetail.respondentMemberId
    );
    this.selministerSubject = this.ministerSubjects.find(
      (o) => o.id === this.qDetail.ministerSubjectId
    );
    this.selministerSubjectId = this.selministerSubject
      ? this.selministerSubject.id
      : "";
    this.selportFolioId = this.selportFolio ? this.selportFolio.id : "";
  }
  setClauseData(qDetail) {
    if (qDetail) {
      this.qDetail.clauses.forEach((element) => {
        this.addClause(element);
      });
    }
  }
  addClause(clauses?: any) {
    let fg = this.fb.group({
      clause: [clauses ? clauses.clause : null],
      id: [clauses ? clauses.id : null],
      answer: this.fb.array([]),
    });
    (<FormArray>this.validateForm.get("clauses")).push(fg);
    let answerIndex = (<FormArray>this.validateForm.get("clauses")).length - 1;
    this.addAnswer(answerIndex, clauses.answer);
  }
  addAnswer(answerIndex, answer) {
    let changeInReply = (answer && answer.changeInReply === true) ? true : false;
    let fg = this.fb.group({
      answer: [
        answer ? answer.answer : "",
        Validators.compose([Validators.required, this.noWhitespaceValidator]),
      ],
      id: [answer ? answer.id : null],
      type: [
        answer ? answer.type : null,
        Validators.compose([Validators.required]),
      ],
      isEdit: [answer ? false : true],
      isLateAnswer: [answer ? answer.isLateAnswer : false],
      isCorrectn: false,
      showAnsbtn: true,
      changeInReply: changeInReply,
      clauseAnswerUrl: [
        answer && answer.clauseAnswerUrl ? answer.clauseAnswerUrl : null,
      ],
    });
    (<FormArray>(
      (<FormGroup>(
        (<FormArray>this.validateForm.controls["clauses"]).controls[answerIndex]
      )).controls["answer"]
    )).push(fg);
  }
  noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || "").trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }
  cAnswer(d) {
    const controls = d.get("answer") as FormArray;
    return controls;
  }
  handleClose(removedTag: {}): void {
    this.tags = this.tags.filter((tag) => tag !== removedTag);
  }
  sliceTagName(tag: string): string {
    const isLongTag = tag.length > 20;
    return isLongTag ? `${tag.slice(0, 20)}...` : tag;
  }
  showInput(): void {
    this.inputVisible = true;
    setTimeout(() => {
      this.inputElement.nativeElement.focus();
    }, 10);
  }
  handleInputConfirm(): void {
    if (this.inputValue && this.tags.indexOf(this.inputValue) === -1) {
      this.tags = [...this.tags, this.inputValue];
    }
    this.inputValue = "";
    this.inputVisible = false;
  }
  saveClauseAnswer(index) {
    if (
      this.getDateDiff() &&
      this._isQuestion() &&
      !this.qDetail.dealayStatementUrl
    ) {
      this.notify.showWarning("Warning", "Delay Statement Needed to answer.");
      return;
    }
    let qcontrols = this.validateForm.get("clauses") as FormArray;
    let anscontrols = <FormArray>(
      (<FormGroup>qcontrols.controls[index]).controls["answer"]
    );
    if (anscontrols.valid) {
      this.clauseId = this.validateForm.value.clauses[index].id;
      let answerData = {
        answer: this.validateForm.value.clauses[index].answer[0].answer,
        clauseId: this.clauseId,
        type: this.validateForm.value.clauses[index].answer[0].type,
        clauseAnswerUrl: this.validateForm.value.clauses[index].answer[0]
          .clauseAnswerUrl,
      };
      this.answerId = this.validateForm.value.clauses[index].answer[0].id;
      if (this.validateForm.value.clauses[index].answer[0].id) {
        this.answerId = this.validateForm.value.clauses[index].answer[0].id;
        answerData["id"] = this.answerId;
        answerData["isLateAnswer"] = this.validateForm.value.clauses[index].answer[0].isLateAnswer;
        this.question.postAnswer(answerData).subscribe((response) => {
          this.notify.showSuccess("Answer Updated Succesfully", "");
        });
        anscontrols.value[0].isEdit = false;
        anscontrols.value[0].changeInReply = false;
      } else {
        anscontrols.value[0].isEdit = false;
        this.question.postAnswer(answerData).subscribe((response) => {
          this.newAns = response;
          this.notify.showSuccess("Answer Added Succesfully", "");
          anscontrols.controls.forEach((group) =>
            group.get("id").patchValue(this.newAns.id)
          );
          anscontrols.value[0].isEdit = false;
          this.showBtns.ShowTransferMinister = false;
        });
      }
      this.hasAnswer = this.validateForm.value.clauses.some(
        (val, i, arr) => val.answer[0] && val.answer[0].type
      );
      this.showchangeInreplyBtn();
    } else {
      this._validateClauses(anscontrols);
    }
  }
  _validateClauses(anscontrols) {
    // tslint:disable-next-line: forin
    for (const i in anscontrols.controls) {
      anscontrols.controls[i].markAsDirty();
      anscontrols.controls[i].updateValueAndValidity();
      // if (i === 'questionClauses') {
      const control = anscontrols;
      // tslint:disable-next-line: forin
      for (const j in control.controls) {
        const controlTwo = control.controls[j] as FormGroup;
        // tslint:disable-next-line: forin
        for (const k in controlTwo.controls) {
          controlTwo.controls[k].markAsDirty();
          controlTwo.controls[k].updateValueAndValidity();
        }
      }
    }
  }
  _isAnswerGiven(clauses) {
    this.hasAnswer = clauses.some(
      (val, i, arr) => val.answer && val.answer.type
    );
  }
  _isWithdrawl() {
    let withdrwalStatus = ["PENDING_FOR_WITHDRAWAL", "WITHDRAWN"];
    if (withdrwalStatus.includes(this.qDetail.status)) {
      return true;
    }
    return false;
  }
  _isWithdrawn(qDetail) {
    if (
      qDetail.withdrawelStatus === "WITHDRAWN" &&
      qDetail.withdrawelWorkFlowId
    ) {
      return true;
    }
    return false;
  }

  // change in rply starts
  changeInReply() {
    if (this.qDetail.requestChangeReply) {
      this.notify.showWarning(
        "Warning",
        "Already sent change in reply request"
      );
      return;
    }
    this.question.changeInReply(this.qDetail.id).subscribe((response) => {
      this.notify.showSuccess("Request sent for change reply", "");
      this.onBack();
    });
  }
  showchangeInreplyBtn() {
    this.showBtns.showchangeInreply = false;
    if (!this.isCorrectionAfterSabha()) {
      if (!this._isWithdrawn(this.qDetail) && this.hasAnswer) {
        if (this._isQuestion() || this._isFinalAnswered()) {
          this.showBtns.showchangeInreply = true;
        }
      }
    }
  }
  // change in rply end
  canAllowReqCorrectionStmt() {
    if (this.qDetail.category === 'UNSTARRED') { // for unstarred only correction after sabha can perform
      if (this.isCorrectionAfterSabha() && !this.qDetail.requestCorrectionAfterSabha && this._isAllAnswerGiven()) {
        this.correctionRequestBtnLabel = "Request for Correction of Answer";
        this.correctionApplyBtnLabel = "Apply Correction of Answer";
        this.cnfrmApplyBtnLabel = "Are you sure you want to apply for correction of answer?"
        return true;
      }
    } else {
      if (this.qDetail.stage === "TAKEN") {
        if (!this.isCorrectionAfterSabha()) {
          if (this.qDetail.status !== 'CHANGE IN REPLY REQUEST') {
            return true;
          }
          return false;
        }
        if (!this.qDetail.requestCorrectionAfterSabha) {
          this.correctionRequestBtnLabel = "Request for Correction of Answer";
          this.correctionApplyBtnLabel = "Apply Correction of Answer";
          this.cnfrmApplyBtnLabel = "Are you sure you want to apply for correction of answer?"
          return true;
        }
      }
    }
    return false;
  }
  canAllowCoverLettrforCorrection() {
    if (this.qDetail.category === 'STARRED' && this.qDetail.stage === "TAKEN") {
      if (this.isCorrectionAfterSabha()) {
        if (!this.qDetail.requestCorrectionAfterSabha) {
          return true;
        }
      }
    }
    if (this.qDetail.category === 'UNSTARRED') {
      if (this.isCorrectionAfterSabha() && this._isAllAnswerGiven()) {
        if (!this.qDetail.requestCorrectionAfterSabha) {
          return true;
        }
      }
    }
  }
  reqCorrectionOfStatement(show) {
    if (this._isCorrectionValid()) {
      const showAnsBtn = show ? false : true;
      this.showBtns.showcorrectionApplyBtn = show ? true : false;
      let qcontrols = this.validateForm.get("clauses") as FormArray;
      if (!show) {
        this.qClause.controls = [];
        this.setClauseData(this.qDetail);
        return;
      }
      for (const index in this.qClause.controls) {
        if (
          this.qClause.controls[index].value &&
          this.qClause.controls[index].value.answer
        ) {
          const anscontrols = <FormArray>(
            (<FormGroup>qcontrols.controls[index]).controls["answer"]
          );
          anscontrols.controls.forEach((group) =>
            group.get("isEdit").setValue(show)
          );
          anscontrols.controls.forEach((group) =>
            group.get("isCorrectn").setValue(show)
          );
          anscontrols.controls.forEach((group) =>
            group.get("showAnsbtn").setValue(showAnsBtn)
          );
        }
      }
    }
  }
  _isCorrectionValid() {
    if (this.isCorrectionAfterSabha()) {
      if (this.qDetail.requestCorrectionAfterSabha) {
        this.notify.showWarning("Warning", "Already sent correction request");
        return false;
      }
      if (!this.qDetail.correctionAttachmentUrl) {
        this.showBtns.canShowCoverLetter = true;
        this.notify.showWarning("Warning", "Attach a cover letter");
        return false;
      }
      return true;
    }
    return true;
  }
  aplyCorrectionOfStatement() {
    let finalData = [];
    for (const index in this.qClause.controls) {
      if (
        this.qClause.controls[index].value &&
        this.qClause.controls[index].value.answer
      ) {
        const anscontrols = <FormArray>(
          (<FormGroup>this.qClause.controls[index]).controls["answer"]
        );
        if (anscontrols.valid) {
          let answerData = {};
          let clause = this.qClause.controls[index].value;
          answerData["clauseId"] = clause.id;
          answerData["id"] = clause.answer[0].id;
          answerData["answer"] = clause.answer[0].answer;
          answerData["type"] = clause.answer[0].type;
          answerData["clauseAnswerUrl"] = clause.answer[0].clauseAnswerUrl;
          finalData.push(answerData);
        } else {
          for (const i in anscontrols.controls) {
            anscontrols.controls[i].markAsDirty();
            anscontrols.controls[i].updateValueAndValidity();
            const control = anscontrols;
            // tslint:disable-next-line: forin
            for (const j in control.controls) {
              const controlTwo = control.controls[j] as FormGroup;
              // tslint:disable-next-line: forin
              for (const k in controlTwo.controls) {
                controlTwo.controls[k].markAsDirty();
                controlTwo.controls[k].updateValueAndValidity();
              }
            }
          }
          return;
        }
      }
    }
    this.exicuteCorrectionStmt(finalData);
  }
  exicuteCorrectionStmt(finalData) {
    this.question
      .requestCorrectionStatement(
        finalData,
        this.qDetail.id,
        this.auth.getCurrentUser().userId,
        this.isCorrectionAfterSabha()
      )
      .subscribe((response) => {
        this.notify.showSuccess("Request sent", "");
        this.onBack();
      });
  }
  isCorrectionAfterSabha() {
    const today = new Date().toISOString().split("T")[0];
    if (this.qDetail.questionDate < today) {
      return true;
    }
    return false;
  }
  editClauseAnswer(index) {
    let qcontrols = this.validateForm.get("clauses") as FormArray;
    let anscontrols = <FormArray>(
      (<FormGroup>qcontrols.controls[index]).controls["answer"]
    );
    anscontrols.controls.forEach((group) =>
      group.get("isEdit").setValue("true")
    );
  }
  deleteClauseAnswer(index) {
    let qcontrols = this.validateForm.get("clauses") as FormArray;
    let anscontrols = <FormArray>(
      (<FormGroup>qcontrols.controls[index]).controls["answer"]
    );
    this.clauseId = this.validateForm.value.clauses[index].id;
    this.answerId = this.validateForm.value.clauses[index].answer[0].id;
    anscontrols.controls.forEach((group) =>
      group.get("isEdit").setValue("true")
    );
    anscontrols.controls.forEach((group) => group.get("answer").reset());
    anscontrols.controls.forEach((group) => group.get("type").reset());
    this.question
      .deleteAnswer(this.clauseId, this.answerId)
      .subscribe((response) => {
        this.notify.showSuccess("Answer Deleted Succesfully", "");
      });
    anscontrols.controls.forEach((group) => group.get("id").reset());
  }
  cancelDelete(): void { }

  _getMinisterSubSubjectData(ind, id) {
    if (this.ministerSubjects && id) {
      return this.ministerSubjects[ind].ministerSubSubjects.find(
        (element) => element.id == id
      );
    } else {
      return { title: "" };
    }
  }
  transferMinisterButtonClick() {
    if (
      this.selportFolioId === this.selportFolio.id &&
      this.selministerSubjectId === this.selministerSubject.id
    ) {
      this.notify.showWarning("Warning", "Not Done Any changes");
      return;
    }
    if (!this.selministerSubjectId) {
      this.notify.showWarning("Warning", "Please Select Minister Subject");
      return;
    }
    let body = {
      ministerSubjectId: this.selministerSubjectId,
      questionId: this.questionId,
      respondentMemberId: this.selportFolioId,
    };
    this.question
      .tranferMinister(body, this.auth.getCurrentUser().userId)
      .subscribe((res: any) => {
        if (res && res.id > 0) {
          this.notify.showSuccess(
            "Success",
            "Transferred minister successfully"
          );
          this.onBack();
        }
      });
  }
  getMinisterSubject(portfolio) {
    if (portfolio) {
      this.selministerSubjectId = null;
      this.question.getMinisterSubject(portfolio).subscribe((response) => {
        this.ministerSubjects = response;
      });
    }
  }
  isMLA() {
    return this.auth.getCurrentUser().authorities.includes("MLA");
  }
  onBack() {
    localStorage.setItem("hasFilter", "true");
    this.location.back();
  }

  handleChange(info: any): void {
    const fileList = info.fileList;
    // 2. read from response and show file link
    // 3. filter successfully uploaded files according to response from server
    // tslint:disable-next-line:no-any
    this.fileList = fileList.filter((item: any) => {
      if (item.response) {
        return item.response.status !== "success";
      }
      return true;
    });
  }
  uploadDelayStatement() {
    let data = {
      questionId: this.questionId,
      statementUrl: this.fileList[0].response.body,
    };
    this.question.uploadDelayStatement(data).subscribe((res) => {
      this.notify.showSuccess("success", "Delay Statement Added.");
      this.qDetail.dealayStatementUrl = res.statementUrl;
    });
  }

  removeDelayStatement() {
    let data = {
      questionId: this.questionId,
      statementUrl: "",
    };
    this.question.uploadDelayStatement(data).subscribe((res) => {
      this.notify.showSuccess("Success", "Delay Statement Removed.");
      this.qDetail.dealayStatementUrl = res.statementUrl;
      this.fileList = [];
    });
  }
  handleRemove = (file: UploadFile) => {
    this.qDetail.dealayStatementUrl = null;
    return true;
  };
  getDateDiff() {
    if (this.delayStatementRequiredAfterDays) {
      var date1: any = new Date();
      var date2: any = new Date(this.delayStatementRequiredAfterDays);
      if (date1 > date2) return true;
    }

    return false;
  }
  addClauseAnsAttachment(info: any, ansindex) {
    let qcontrols = this.validateForm.get("clauses") as FormArray;
    const anscontrols = <FormArray>(
      (<FormGroup>qcontrols.controls[ansindex]).controls["answer"]
    );
    if (info.type === "removed" && info.fileList.length === 0) {
      anscontrols.controls.forEach((group) =>
        group.get("clauseAnswerUrl").reset()
      );
      return;
    }
    const ansfileList = info.fileList;
    ansfileList.filter((item: any) => {
      if (item.response) {
        anscontrols.controls.forEach((group) =>
          group.get("clauseAnswerUrl").setValue(item.response.body)
        );
        return item.response.status !== "success";
      }
      return true;
    });
  }
  removeClauseAnsAttachment(ansindex) {
    let qcontrols = this.validateForm.get("clauses") as FormArray;
    const anscontrols = <FormArray>(
      (<FormGroup>qcontrols.controls[ansindex]).controls["answer"]
    );
    anscontrols.controls.forEach((group) =>
      group.get("clauseAnswerUrl").reset()
    );
  }
  addAnsAttchmemt(info: any, attchmentTtype): void {
    const fileList = info.fileList;
    if (attchmentTtype === 'ANSWER') {
      this.ansAttachment = fileList.filter((item: any) => {
        if (item.response) {
          this.uploadAttachment(true, attchmentTtype, this.ansAttachment);
          return item.response.status !== "success";
        }
        return true;
      });
    }
    if (attchmentTtype === 'CORRECTION') {
      this.coverLetter = fileList.filter((item: any) => {
        if (item.response) {
          this.uploadAttachment(true, attchmentTtype, this.coverLetter);
          return item.response.status !== "success";
        }
        return true;
      });
    }
  }
  uploadAttachment(status, attchmentTtype, attachment) {
    let data = {
      questionId: this.questionId,
      attachmentUrl: (status && attachment) ? attachment[0].response.body : "",
      type: attchmentTtype,
    };
    this.question.uploadAttachment(data).subscribe((res) => {
      if (status) {
        this.notify.showSuccess("Success", "Attachment Added.");
        this._showAttchement(res, attchmentTtype, status);
        return;
      }
      this.notify.showSuccess("Success", "Attachment removed.");
      this._showAttchement(res, attchmentTtype, status);
      this.ansAttachment = [];
      this.coverLetter = [];
    });
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
  showAttachmentButton() {
    let avoidedStatus = ["ANSWERED", "TAKEN", "REQUEST_FOR_CORRECTION_OF_ANSWER_APPROVED"];
    if (
      this.qDetail &&
      !avoidedStatus.includes(this.qDetail.status) &&
      !this.qDetail.answerAttachmentUrl
    ) {
      return true;
    }
    return false;
  }
  _showAttchement(response, attchmentTtype, show) {
    if (show) {
      if (attchmentTtype === "CORRECTION") {
        this.qDetail.correctionAttachmentUrl = response.attachmentUrl;
        return;
      }
      this.qDetail.answerAttachmentUrl = response.attachmentUrl;
    } else {
      if (attchmentTtype === "CORRECTION") {
        this.qDetail.correctionAttachmentUrl = "";
        return;
      }
      this.qDetail.answerAttachmentUrl = "";
    }
  }
  showdeletButton() {
    let avoidedStatus = ["ANSWERED", "TAKEN", "CHANGE_IN_REPLY_APPROVED", "REQUEST_FOR_CORRECTION_OF_ANSWER_APPROVED"];
    if (
      this.qDetail &&
      avoidedStatus.includes(this.qDetail.status) &&
      this.qDetail.answerAttachmentUrl
    ) {
      return false;
    }
    return true;
  }
  checkUnstarredChangeinReply() {
    if (
      !this.isCorrectionAfterSabha()) {
      return true;
    } else {
      return false;
    }
  }
  basicPopup() {
    let popupWindow = window.open(
      this.qDetail.correctionAttachmentUrl,
      "popUpWindow",
      "height=800,width=800,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes"
    );
  }
  createPreviewModal() {
    if (this.qDetail.type === "SHORT_NOTICE") {
      this.modalService.create({
        nzContent: ShortNoticePreviewComponent,
        nzWidth: "800",
        nzFooter: null,
        nzComponentParams: {
          previewData: this.qDetailTemp,
          assembly: this.qDetail.assemblyId,
          session: this.qDetail.sessionId,
          hidePrint: false,
        },
      });
      return;
    }
  }
  _isQuestion() {
    return (this.qDetail.stage === 'QUESTION');
  }
  canShowTransferMinister() {
    if (this.qDetail.stage === 'QUESTION') {
      let isAnswered = this.qDetail.clauses.some(
        (val, i, arr) => val.answer && val.answer.type
      );
      this.showBtns.ShowTransferMinister = (!isAnswered) ? true : false;
    }
  }
  _isFinalAnswered() {
    return (this.qDetail.stage === 'ANSWERED');
  }
  _isTaken() {
    return (this.qDetail.stage === 'TAKEN');
  }
  _isAllAnswerGiven() {
    return (this.qDetail.clauses.every(
      (val, i, arr) => val.answer && val.answer.type
    ));
  }

  isDepartment() {
    if (this.auth.getCurrentUser().correspondenceCode && this.auth.getCurrentUser().correspondenceCode.type === 'DEPARTMENT') {
      return true;
    } else {
      return false;
    }
  }
  canEditAnswer(changeInReply) {
    const today = new Date().toISOString().split("T")[0];
    if(changeInReply || (this.qDetail.questionDate < today)) {
      return true;
    }
    return false;
  }
}
