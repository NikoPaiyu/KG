import { Component, OnInit } from "@angular/core";
import { QuestionService } from "../../shared/question.service";
import { NotificationCustomService } from "../../../../shared/services/notification.service";
import { NzModalService } from "ng-zorro-antd/modal";
import { AuthService } from "src/app/auth/shared/services/auth.service";

@Component({
  selector: "app-question-settings",
  templateUrl: "./question-settings.component.html",
  styleUrls: ["./question-settings.component.scss"],
})
export class QuestionSettingsComponent implements OnInit {
  currentVersion = null;
  configurableParms = {
    minTitleChar: 0,
    maxTitleChar: 100,
    minClauseWord: 0,
    maxReasonChar: 255,
  };
  editable = false;
  questionDates: any = [];
  dateFormat = "dd/MM/yyyy";
  ballotingDetails: any = [];
  ballotingLines: any = [];
  questionDate;
  isBallotApproved = true;
  showSubmitButton = false;
  assemblySession: object = [];
  ClubbedMembers = { show: false, data: [], questionId: 0 };
  showDirection = false;
  showVersion = false;
  questionVersion;
  selectedVersion = null;
  clauseNo = ["A", "B", "C", "D", "E", "F", "G", "H"];
  versionsCombo = [];
  showPendingModal = false;
  pendingData = [];
  directionList: any = [];
  questionSel: object;
  canSetQuestion: boolean = true;

  settingUpObj = {
    questionNumber: 0,
    members: [],
    questionId: 0,
    ballotOrder: 0,
  };
  topPosition = 0;
  questionNumber = 0;
  SettingUpArray = [];
  settingUpArrCopy = [];
  questionIds = [];
  memberIds = [];
  hasQuestions = false;
  removeValidationMsg = "";
  dupMemberInremoval = [];

  constructor(
    private question: QuestionService,
    private modalService: NzModalService,
    private notify: NotificationCustomService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.getAssemblySession();
    this.getAllDirections();
  }
  getAssemblySession() {
    this.question.getAllAssemblyAndSession().subscribe((res) => {
      if (res) {
        this.assemblySession = res;
          this.getQuestionDate();
      }
    });
  }
  getAllDirections() {
    this.question.getAllDirections().subscribe((Response) => {
      this.directionList = Response;
    });
  }
  getQuestionDate() {
    this.question
      .getDate(
        this.assemblySession["assembly"].currentassembly,
        this.assemblySession["session"].currentsession
      )
      .subscribe((res: any) => {
        if (res) {
          let today = new Date().toISOString().split("T")[0];
          this.questionDates = res.filter((date) => date > today);
          this.questionDates = this.questionDates.filter(
            (v, i, a) => a.findIndex((t) => t === v) === i
          );
          this.questionDates.sort();
        }
      });
  }
  getBallotDetailedView() {
    this._resetVariables();
    this.question
      .getBallotDetailedView(this.questionDate)
      .subscribe((res: any) => {
        if (res && res.valid) {
          if (res.result && res.result.lines) {
            this.isBallotApproved =
              res.result.status === "FINAL" ? true : false;
            this.showSubmitButton =
              res.result.status === "FINAL" || res.result.status === "PENDING"
                ? false
                : true;
            this.ballotingDetails = res.result ? res.result : [];
            this.ballotingLines = res.result.lines ? res.result.lines : [];
            this._setBallotResultResult();
          }
        } else if (res && !res.valid) {
          this.pendingData = res.pendingTasks ? res.pendingTasks : [];
          this.openPendingModal();
        }
      });
  }
  _resetVariables() {
    this.ballotingDetails = this.ballotingLines = this.pendingData = [];
    this.settingUpObj = {
      questionNumber: 0,
      members: [],
      questionId: 0,
      ballotOrder: 0,
    };
    this.topPosition = 0;
    this.questionNumber = 0;
    this.SettingUpArray = [];
    this.settingUpArrCopy = [];
    this.questionIds = [];
    this.memberIds = [];
    this.isBallotApproved = true;
    this.showSubmitButton = false;
  }
  sort(sort: { key: string; value: string }): void {
    const data = this.ballotingLines.filter((item) => item);
    if (sort.key && sort.value) {
      this.ballotingLines = data.sort((a, b) =>
        sort.value === "ascend"
          ? this._sortQuestionAsc(a, b, sort)
            ? 1
            : -1
          : this._sortQuestionDesc(a, b, sort)
            ? 1
            : -1
      );
    } else {
      this.ballotingLines = data;
    }
  }
  _sortQuestionAsc(a, b, sort) {
    if (a[sort.key] && b[sort.key]) {
      return a[sort.key!].toLowerCase() > b[sort.key!].toLowerCase();
    }
  }
  _sortQuestionDesc(a, b, sort) {
    if (a[sort.key] && b[sort.key]) {
      return b[sort.key!].toLowerCase() > a[sort.key!].toLowerCase();
    }
  }
  isMLA() {
    return this.auth.getCurrentUser().authorities.includes("MLA");
  }
  changeStaredToUnstared(direction) {
    let self = this;
    const body = {
      direction,
      questionId: this.questionSel["id"],
      ownerId: this.auth.getCurrentUser().userId,
      reason: "SETTING_UP",
    };
    this.question.changeStaredToUnstared(body).subscribe((res: any) => {
      this.showDirection = false;
      this.ballotingLines.forEach((ballotQues: { questions: any[] }) => {
        if (ballotQues.questions) {
          // tslint:disable-next-line: only-arrow-functions
          ballotQues.questions = ballotQues.questions.filter(function (el) {
            return self.questionSel["id"] !== el.id;
          });
          if (ballotQues["questionId"] === this.questionSel["id"]) {
            this.removeFromSettingUp(ballotQues, null, null);
          }
        }
      });
    });
  }
  applyRuleDirection() {
    let checkedData = [];
    checkedData = this.directionList.filter((x) => x.checked === true);
    const selectedRules = this.selectedDirection(checkedData);
    if (selectedRules) {
      this.changeStaredToUnstared(selectedRules);
      for (let i = 0; i < this.directionList.length; i++) {
        if (this.directionList[i].checked) {
          this.directionList[i].checked = false;
        }
      }
    } else {
      this.notify.showInformation("Info", "Please select atlest one rule");
    }
  }
  selectedDirection(ruleApplyed) {
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
  canceldirectionSelection() {
    this.showDirection = false;
    this.questionSel["isStarred"] = true;
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.directionList.length; i++) {
      if (this.directionList[i].checked) {
        this.directionList[i].checked = false;
      }
    }
  }

  showVersionModal(id) {
    this.getCurrentVersionDetails(id);
    this.editable = false;
    this.showVersion = true;
  }
  getCurrentVersionDetails(id) {
    if (id) {
      this.question.getVersionsList(id).subscribe((res: any) => {
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
        });
        this.questionVersion = res.current.question;
        this.selectedVersion = res.current.id;
        this.currentVersion = res.current.id;
        if (this.questionVersion.category === "UNSTARRED") {
          this.questionVersion.priority = null;
        }
        if (
          this.questionVersion.assemblyId &&
          this.questionVersion.sessionId &&
          this.assemblySession
        ) {
          this.questionVersion.assemblyId = this.assemblySession[
            "assembly"
          ].find(
            (item) => item.id === this.questionVersion.assemblyId
          ).assemblyId;
          this.questionVersion.sessionId = this.assemblySession["session"].find(
            (item) => item.id === this.questionVersion.sessionId
          ).sessionId;
        }
      });
    }
  }
  getVersionDetailsById(versionId) {
    if (this.currentVersion != versionId) {
      this.editable = false;
    }
    this.question.getVersionById(versionId).subscribe((res) => {
      this.questionVersion = {};
      this.questionVersion = res.question;
      if (
        this.questionVersion.assemblyId &&
        this.questionVersion.sessionId &&
        this.assemblySession
      ) {
        this.questionVersion.assemblyId = this.assemblySession["assembly"].find(
          (item) => item.id === this.questionVersion.assemblyId
        ).assemblyId;
        this.questionVersion.sessionId = this.assemblySession["session"].find(
          (item) => item.id === this.questionVersion.sessionId
        ).sessionId;
      }
    });
  }
  cancelVersion() {
    this.showVersion = false;
    this.questionVersion = {};
  }

  onEditNotice(questionVersion) {
    this.editable = true;
  }

  onSaveEditedNotice(questionVersion) {
    if (this._isFormValid(questionVersion)) {
      let data = {
        "questionId": questionVersion.id,
        "clauses": this._keepClauseOrder(questionVersion.clauses),
        "heading": questionVersion.heading,
        "editedBy": this.auth.getCurrentUser().userId
      }
      this.question.saveFromSettingUp(data).subscribe(res => {
        this.notify.showSuccess("Success", "Updated.");
        this.editable = false;
        this.ballotingLines.forEach(element => {
          if (element.questions) {
            element.questions.forEach(element => {
              if (element.id === data.questionId && element.heading !== data.heading) {
                element.heading = data.heading;
              }
            });
          }
        });
        // this.getBallotDetailedView();
        this.cancelVersion();
      })
    }

  }

  onCancelEditNotice() {
    this.getVersionDetailsById(this.selectedVersion);
    this.editable = false;
  }

  _isFormValid(questionVersion) {
    if (this._isAllClauseValid(questionVersion)) {
      return true;
    }
    return false;
  }

  _isAllClauseValid(questionVersion) {
    let counter = 0;
    if (!this._validateCharLimitForHeading(questionVersion)) {
      return false;
    }
    if (questionVersion.clauses) {
      let clauselegth = questionVersion.clauses.length;
      for (const i in questionVersion.clauses) {
        counter++;
        if (!this._hasMinClauseWordCount(questionVersion.clauses[i].clause, i)) {
          return false;
        }
      }
      return true;
    }
  }
  _hasMinClauseWordCount(clause, index) {
    clause = clause.replace(/(\r\n|\n|\r)/gm, " ");
    clause = clause.replace(/(^\s*)|(\s*$)/gi, "");
    clause = clause.replace(/[ ]{2,}/gi, " ");
    const count = clause.split(" ").length;
    if (count < this.configurableParms.minClauseWord) {
      this.notify.showWarning(
        "Minimum word count for clause is " +
        this.configurableParms.minClauseWord,
        "" + `(Clause ${this.clauseNo[index]})`
      );
      return false;
    }
    return true;
  }

  _validateCharLimitForHeading(questionVersion) {
    let title = questionVersion.heading.trim();
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

  _trimData(text) {
    if (text) {
      return text.trim();
    }
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
  openPendingModal() {
    this.showPendingModal = true;
  }

  notifyStaff() { }

  sumofPendingData(pendingData) {
    let sum = 0;
    sum = pendingData
      .map((item: any) => item.pendingCount)
      .reduce((sum, current) => sum + current, 0);
    return sum;
  }
  cancelPendingModal() {
    this.showPendingModal = false;
  }
  _confrmCategoryChange(index, question) {
    if (!question.isStarred) {
      this.questionSel = question;
      this.modalService.confirm({
        nzClassName: "pdng",
        nzContent: "Do you want change the category as UNSTARRED?",
        nzOkText: "OK",
        nzCancelText: "Cancel",
        nzOnOk: () => this._defineQuestionId(question.id),
        nzOnCancel: () => this._removeSelection(question),
      });
    }
  }
  _cancelRemove() { }
  _removeSelection(question) {
    question.isStarred = true;
    this.questionSel = {};
  }
  _defineQuestionId(Id) {
    this.questionSel["id"] = Id;
    this.showDirection = true;
  }
  _showClubbedMembers(members, questionId) {
    this.ClubbedMembers.show = true;
    this.ClubbedMembers.questionId = questionId;
    this.ClubbedMembers.data = this._orderClubbingMember(members);
  }
  _deleteClubbedMember(member, index) {
    let self = this;
    const body = {
      questionId: this.ClubbedMembers.questionId,
      memberId: member.memberId,
      reason: "SETTING_UP",
    };
    this.question.removeClubbedmember(body).subscribe((res: any) => {
      this.ClubbedMembers.show = false;
      this.ClubbedMembers.data = this.ClubbedMembers.data.filter(function (
        clubb
      ) {
        return clubb.memberId !== member.memberId;
      });
      this.ballotingLines.forEach((ballotQues) => {
        if (ballotQues.memberId === member.memberId) {
          ballotQues.questions = ballotQues.questions.filter(function (mem) {
            return self.ClubbedMembers.questionId !== mem.id;
          });
          this._removeMemberFromMemberArr(
            member.memberId,
            this.ClubbedMembers.questionId
          );
        }
        if (ballotQues.questions) {
          ballotQues.questions.forEach(function (el) {
            if (self.ClubbedMembers.questionId === el.id) {
              el.clubbingDetails = el.clubbingDetails.filter(function (mem) {
                return member.memberId !== mem.memberId;
              });
            }
          });
        }
      });
    });
  }
  pushtoLOB() {
    let checkedQue = Object.values(this.ballotingLines).every(
      (ballot) => ballot["questionId"] === null
    );
    if (checkedQue) {
      this.notify.showWarning("Warning", "Please Select at least One Question");
      return;
    }
    this.question
      .saveQuestionsForTheDay(this.questionDate, this.ballotingDetails)
      .subscribe((res: any) => {
        this.showSubmitButton = false;
        this.ballotingLines = [];
        this.notify.showSuccess("Success", "Success");
      });
  }
  refresh() {
    this.question.cancelSettingUp(this.questionDate).subscribe((res: any) => {
      this.getBallotDetailedView();
    });
  }
  _setBallotResultResult() {
    let counter = 0;
    this.ballotingLines.forEach((ballot) => {
      ballot.slNo = counter++;
      if (ballot.questions) {
        this.hasQuestions = true;
        ballot.questions.forEach((question) => {
          question.isStarred = question.category === "STARRED" ? true : false;
          question.alterQ = false;
          question.disableLbl = "";
          question.settolob = false;
          if (
            ballot.questionId &&
            ballot.ballotingOrder &&
            ballot.questionId !== question.id
          ) {
            question.alterQ = true;
          }
          if (ballot.questionId === question.id) {
            this.populateSettingUpArr(question, ballot);
            question.settolob = true;
          }
          if (
            question.settolob === false &&
            this._ifIdExistInArr(this.SettingUpArray, question)
          ) {
            let newFilter = this.SettingUpArray.filter(
              (q) => q.questionId === question.id
            );
            question.settolob = true;
            question.alterQ = true;
            question.disableLbl =
              "Question is set against ballot order " +
              newFilter[0].ballotOrder;
          }
        });
      }
    });
    this.ballotingLines.sort((a, b) =>
      a.ballotingOrder > b.ballotingOrder ? 1 : -1
    );
  }
  _ifIdExistInArr(SettingUpArray, question) {
    let newFilter = SettingUpArray.filter((q) => q.questionId === question.id);
    if (newFilter.length > 0) {
      return true;
    }
    return false;
  }
  populateSettingUpArr(question, ballot) {
    this.questionNumber = this.questionNumber + 1;
    if (ballot.questionId === question.id) {
      let settingUpObj = {
        questionNumber: this.questionNumber,
        members: this._buildMemberArray(
          question.clubbingDetails,
          question.id,
          ballot
        ),
        questionId: ballot.questionId,
        ballotOrder: ballot.ballotingOrder,
      };
      this.SettingUpArray.push(settingUpObj);
      for (var n in settingUpObj.members) {
        this.memberIds.push(settingUpObj.members[n]);
      }
      this.questionIds.push(settingUpObj.questionId);
    }
  }
  _ifExistInObject(quesTaken, question) {
    let newFilter = quesTaken.filter((q) => q.Qid === question.id);
    if (newFilter.length > 0) {
      return true;
    }
    return false;
  }
  // setting up algorithm starts
  _validateSettingUp(index, question, ballot) {
    this.settingUpArrCopy = [];
    this.SettingUpArray.map((item) => {
      this.settingUpArrCopy.push({ ...item });
    });
    this.resetDeleteIcon();
    if (question.settolob) {
      if (this._checkQuestionIdExist(question.id)) {
        this.modalService.info({
          nzBodyStyle: { margin: "20px" },
          nzTitle: "Question Already taken",
          nzOnOk: () => this._checkboxUncheck(question, null, null),
        });
        return;
      }
      if (!this._checkThirtySelected(index, question, ballot)) {
        this.validationsOnSetting(index, question, ballot);
      }
    } else {
      this.removeFromSettingUp(ballot, question, index);
    }
  }

  validationsOnSetting(index, question, ballot) {
    if (this._checkMemberCountIsThree(question, ballot.memberId)) {
      return;
    }
    this._validateSettingUpOrder(index, question, ballot);
    if (!this._foundMemberDuplication(question, ballot)) {
      this.SettingUpArray.push(this.settingUpObj);
      this._keepMemberArr(this.settingUpObj.members, question.id);
      this.questionIds.push(this.settingUpObj.questionId);
      this.ballotingLines[index].questionId = question.id;
      this._showLabelsForSameQuestion(this.settingUpObj);
      this._disableOtherQuestionInBallotOrder(this.settingUpObj);
      this._changeClubbingMemberOrder(ballot, question.clubbingDetails, true);
    } else {
      this.questionNumber = this.questionNumber - 1;
      this.SettingUpArray = [...this.settingUpArrCopy];
      const topBallotOrder = this.SettingUpArray.reduce((prev, current) =>
        prev.ballotOrder > current.ballotOrder ? prev : current
      );
      this.topPosition = topBallotOrder.ballotOrder;
    }
  }
  // remove question setting up (once uncheck question)
  removeFromSettingUp(ballot, question, index) {
    let removedElemnt = {};
    this.removeValidationMsg = "";
    this.dupMemberInremoval = [];
    for (var i = 0; i < this.SettingUpArray.length; i++) {
      if (this.SettingUpArray[i].ballotOrder === ballot.ballotingOrder) {
        removedElemnt = this.SettingUpArray[i];
        this.SettingUpArray.splice(i, 1);
      }
    }
    this.SettingUpArray.forEach((setUp) => {
      if (setUp.questionNumber > removedElemnt["questionNumber"]) {
        setUp.questionNumber = setUp.questionNumber - 1;
      }
    });
    if (!this._checkForMemberDuplication(removedElemnt, question)) {
      this._removeFromMemberQuesArr(removedElemnt);
      this.removelabelFromQuestionSetUp(
        removedElemnt["questionId"],
        removedElemnt["ballotOrder"]
      );
      this._disableOtherQuestionInBallotOrder(removedElemnt);
      this._changeClubbingMemberOrder(ballot, question.clubbingDetails, false);
      this.ballotingLines[index].questionId = null;
    } else {
      this.modalService.info({
        nzBodyStyle: { margin: "20px" },
        nzTitle: this.removeValidationMsg,
        nzOnOk: () =>
          this._checkBox(question, this.dupMemberInremoval, ballot.memberId),
      });
      this.SettingUpArray = [...this.settingUpArrCopy];
    }
  }
  // remove clubbed memmbers from memberIds when question removes
  _removeFromMemberQuesArr(removedElemnt) {
    if (removedElemnt) {
      if (removedElemnt.members && removedElemnt.members.length > 0) {
        this.memberIds.forEach((member) => {
          let found = removedElemnt.members.some((el) => el.id === member.id);
          if (found) {
            this.memberIds = this.memberIds.filter(
              (item) => item.id !== member.id
            );
          }
        });
      }
      for (var i = 0; i < this.questionIds.length; i++) {
        if (this.questionIds[i] === removedElemnt.questionId) {
          this.questionIds.splice(i, 1);
        }
      }
      this.questionNumber = this.questionNumber - 1;
      if (this.SettingUpArray.length > 0) {
        const topBallotOrder = this.SettingUpArray.reduce((prev, current) =>
          prev.ballotOrder > current.ballotOrder ? prev : current
        );
        this.topPosition = topBallotOrder.ballotOrder;
      } else {
        this.topPosition = 0;
      }
    }
  }
  // check whether member found 3 times in 30 question
  _checkForMemberDuplication(removedElemnt, uncheckEle) {
    if (removedElemnt["questionNumber"] <= 5) {
      let qusFive = {};
      this.SettingUpArray.forEach((setUp) => {
        if (setUp.questionNumber === 5) {
          qusFive = setUp;
        }
      });
      if (Object.keys(qusFive).length === 0) {
        return false;
      } else {
        let status = this._checkIftheMemberFoundInFirstFourInRemoval(
          qusFive,
          removedElemnt,
          uncheckEle
        );
        if (status === 0) {
          return false;
        } else {
          return true;
        }
      }
    } else if (removedElemnt["questionNumber"] > 5) {
      let qusaboveFive = {};
      this.SettingUpArray.forEach((setUp) => {
        if (setUp.questionNumber === removedElemnt["questionNumber"]) {
          qusaboveFive = setUp;
        }
      });
      let status = this._checkIftheMemberRepetationFoundInRemoval(
        qusaboveFive,
        removedElemnt,
        uncheckEle
      );
      if (status === 0) {
        return false;
      } else {
        return true;
      }
    }
  }

  // check whether member found in first five questions in removal
  // take first four elements in array
  _checkIftheMemberRepetationFoundInRemoval(
    qusaboveFive,
    removedElemnt,
    uncheckEle
  ) {
    let duplicateMem = [];
    let status = 0;
    if (this.SettingUpArray.length === 0) {
      return false;
    }
    const previousQues = this.SettingUpArray.find(
      (o) => o.questionNumber === removedElemnt.questionNumber - 1
    );
    const nextQues = this.SettingUpArray.find(
      (o) => o.questionNumber === removedElemnt.questionNumber + 1
    );
    if (qusaboveFive.members && qusaboveFive.members.length > 0) {
      if (previousQues) {
        let counter = 0;
        previousQues.members.forEach((member) => {
          counter++;
          let found = qusaboveFive.members.some(
            (el) => el.memberId === member.memberId
          );
          if (found) {
            duplicateMem.push(member.memberName);
            this.dupMemberInremoval.push(member);
          }
        });
        if (counter === previousQues.members.length) {
          if (duplicateMem.length > 0) {
            status = 1;
          } else {
            status = 0;
          }
        }
      }
      if (nextQues) {
        let counter = 0;
        nextQues.members.forEach((member) => {
          counter++;
          let found = qusaboveFive.members.some(
            (el) => el.memberId === member.memberId
          );
          if (found) {
            duplicateMem.push(member.memberName);
            this.dupMemberInremoval.push(member);
          }
        });
        if (counter === nextQues.members.length) {
          if (duplicateMem.length > 0) {
            status = 1;
          } else {
            status = 0;
          }
        }
      }
      if (duplicateMem.length > 0) {
        duplicateMem = duplicateMem.filter(function (value, index, array) {
          return duplicateMem.indexOf(value) == index;
        });
        this.removeValidationMsg =
          duplicateMem.join() + " - already available in adjacent question.";
        // this.modalService.info({
        //   nzBodyStyle: { margin: "20px" },
        //   nzTitle:
        //     duplicateMem.join() + " - already available in adjacent question.",
        //   nzOnOk: () => (this._checkBox(uncheckEle)),
        // });
      }
    }

    return status;
  }

  _checkIftheMemberFoundInFirstFourInRemoval(
    qusFive,
    removedElemnt,
    uncheckEle
  ) {
    this.SettingUpArray.sort(this._compareValues("questionNumber", "asc"));
    let arrayWithFiveEle = [...this.SettingUpArray];
    arrayWithFiveEle = arrayWithFiveEle.slice(0, 4);
    let counter = 0;
    let duplicateMem = [];
    if (arrayWithFiveEle.length === 0) {
      return 0;
    }
    if (qusFive.members.length === 0) {
      return 0;
    }
    arrayWithFiveEle.forEach((setQues) => {
      counter++;
      setQues.members.forEach((member) => {
        let found = qusFive.members.some(
          (el) => el.memberId === member.memberId
        );
        if (found) {
          duplicateMem.push(member.memberName);
          this.dupMemberInremoval.push(member);
        }
      });
    });
    if (counter === arrayWithFiveEle.length) {
      if (duplicateMem.length > 0) {
        duplicateMem = duplicateMem.filter(function (value, index, array) {
          return duplicateMem.indexOf(value) == index;
        });
        this.removeValidationMsg =
          duplicateMem.join() +
          " - already have a question reference in first 5 questions.";
        // this.modalService.info({
        //   nzBodyStyle: { margin: "20px" },
        //   nzTitle:
        //     duplicateMem.join() +
        //     " - already have a question refrence in first 5 questions.",
        //   nzOnOk: () => this._checkBox(uncheckEle),
        //});
        return 1;
      } else {
        return 0;
      }
    }
  }
  _checkBox(currentQ, repeatedMembers, ballotMemberId) {
    currentQ.settolob = true;
    if (repeatedMembers && repeatedMembers.length > 0 && ballotMemberId) {
      this._showClubbedMemberDelete(repeatedMembers, currentQ, ballotMemberId);
    }
  }

  // find memeber duplication in all cases
  _foundMemberDuplication(question, ballot) {
    if (this.settingUpObj.questionNumber <= 5) {
      let status = this._checkIftheMemberFoundInFirstFiveQuestion(
        question,
        ballot
      );
      if (status === 0) {
        return false;
      } else {
        return true;
      }
    } else if (this.settingUpObj.questionNumber >= 5) {
      let status = this._checkIftheMemberRepetationFoundInQuestion(
        question,
        ballot
      );
      if (status === 0) {
        return false;
      } else {
        return true;
      }
    }
  }

  // check whether member found in first five questions
  _checkIftheMemberFoundInFirstFiveQuestion(question, ballot) {
    let counter = 0;
    let duplicateMem = [];
    let repeatedMembers = [];
    if (this.SettingUpArray.length === 0) {
      return 0;
    }
    this.SettingUpArray.forEach((setQues) => {
      counter++;
      setQues.members.forEach((member) => {
        let found = question.clubbingDetails.some(
          (el) => el.memberId === member.memberId
        );
        if (found) {
          duplicateMem.push(member.memberName);
          repeatedMembers.push(member);
        }
      });
    });
    if (counter === this.SettingUpArray.length) {
      if (duplicateMem.length > 0) {
        duplicateMem = duplicateMem.filter(function (value, index, array) {
          return duplicateMem.indexOf(value) == index;
        });
        this.modalService.info({
          nzBodyStyle: { margin: "20px" },
          nzTitle:
            duplicateMem.join() +
            " - already have a question reference in first 5 questions.",
          nzOnOk: () =>
            this._checkboxUncheck(question, repeatedMembers, ballot.memberId),
        });
        return 1;
      } else {
        return 0;
      }
    }
  }
  //function to uncheck checkbox if member is repeat
  _checkboxUncheck(question, repeatedMembers, ballotMemberId) {
    question.settolob = false;
    if (repeatedMembers && repeatedMembers.length > 0 && ballotMemberId) {
      this._showClubbedMemberDelete(repeatedMembers, question, ballotMemberId);
    }
  }
  _checkIftheMemberRepetationFoundInQuestion(question, ballot) {
    let duplicateMem = [];
    let repeatedMembers = [];
    let status = 0;
    if (this.SettingUpArray.length === 0) {
      return false;
    }
    const previousQues = this.SettingUpArray.find(
      (o) => o.questionNumber === this.settingUpObj.questionNumber - 1
    );
    const nextQues = this.SettingUpArray.find(
      (o) => o.questionNumber === this.settingUpObj.questionNumber + 1
    );
    if (previousQues) {
      let counter = 0;
      previousQues.members.forEach((member) => {
        counter++;
        let found = question.clubbingDetails.some(
          (el) => el.memberId === member.memberId
        );
        if (found) {
          duplicateMem.push(member.memberName);
          repeatedMembers.push(member);
        }
      });
      if (counter === previousQues.members.length) {
        if (duplicateMem.length > 0) {
          status = 1;
        } else {
          status = 0;
        }
      }
    }
    if (nextQues) {
      let counter = 0;
      nextQues.members.forEach((member) => {
        counter++;
        let found = question.clubbingDetails.some(
          (el) => el.memberId === member.memberId
        );
        if (found) {
          duplicateMem.push(member.memberName);
          repeatedMembers.push(member);
        }
      });
      if (counter === nextQues.members.length) {
        if (duplicateMem.length > 0) {
          status = 1;
        } else {
          status = 0;
        }
      }
    }
    if (duplicateMem.length > 0) {
      duplicateMem = duplicateMem.filter(function (value, index, array) {
        return duplicateMem.indexOf(value) == index;
      });
      this.modalService.info({
        nzBodyStyle: { margin: "20px" },
        nzTitle:
          duplicateMem.join() + " - already available in adjesent question.",
        nzOnOk: () =>
          this._checkboxUncheck(question, repeatedMembers, ballot.memberId),
      });
    }
    return status;
  }

  _validateSettingUpOrder(index, question, ballot) {
    if (ballot.ballotingOrder > this.topPosition) {
      this.topPosition = ballot.ballotingOrder;
      this.questionNumber = this.questionNumber + 1;
      this.settingUpObj = {
        questionNumber: this.questionNumber,
        members: this._buildMemberArray(
          question.clubbingDetails,
          question.id,
          ballot
        ),
        questionId: question.id,
        ballotOrder: ballot.ballotingOrder,
      };
    } else {
      this._correctSettingUpOrder(index, question, ballot);
    }
  }
  // create member array
  _buildMemberArray(members, questionId, ballot) {
    let memArr = [];
    // tslint:disable-next-line: forin
    for (var n in members) {
      memArr.push({
        id: members[n].id,
        memberId: members[n].memberId,
        memberName: members[n].memberName,
        questionId,
        primarymember: ballot.memberId === members[n].memberId ? true : false,
      });
    }
    return memArr;
  }

  _keepMemberArr(members, questionId) {
    // tslint:disable-next-line: forin
    for (var n in members) {
      this.memberIds.push({
        id: members[n].id,
        memberId: members[n].memberId,
        memberName: members[n].memberName,
        questionId,
        primarymember: members[n].primarymember,
      });
    }
  }
  // correcting setting up order
  _correctSettingUpOrder(index, question, ballot) {
    let object = this.getNextObjectOfCurrent(ballot.ballotingOrder);
    let questionNo = object.questionNumber;
    this.settingUpObj = {
      questionNumber: questionNo,
      members: this._buildMemberArray(
        question.clubbingDetails,
        question.id,
        ballot
      ),
      questionId: question.id,
      ballotOrder: ballot.ballotingOrder,
    };
    this.SettingUpArray.sort(this._compareValues("ballotOrder", "asc"));
    this.SettingUpArray.forEach((element) => {
      if (element.questionNumber >= this.settingUpObj.questionNumber) {
        element.questionNumber = element.questionNumber + 1;
      }
    });
    this.questionNumber++;
  }
  getNextObjectOfCurrent(ballotingOrder) {
    this.SettingUpArray.sort(this._compareValues("ballotOrder", "asc"));
    // tslint:disable-next-line: prefer-for-of
    for (var i = 0; i < this.SettingUpArray.length; i++) {
      if (this.SettingUpArray[i].ballotOrder >= ballotingOrder) {
        return this.SettingUpArray[i];
      }
    }
  }
  _compareValues(key, order = "asc") {
    return function innerSort(a, b) {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        return 0;
      }
      const varA = typeof a[key] === "string" ? a[key].toUpperCase() : a[key];
      const varB = typeof b[key] === "string" ? b[key].toUpperCase() : b[key];
      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return order === "desc" ? comparison * -1 : comparison;
    };
  }
  // check whether question is already taken
  _checkQuestionIdExist(questionId) {
    if (this.questionIds.indexOf(questionId) !== -1) {
      return true;
    }
    return false;
  }
  // check whether member is repeated in 3 times
  _checkMemberCountIsThree(question, memberId) {
    let memberNames = [];
    let repeatedMembers = [];
    question.clubbingDetails.forEach((member) => {
      const memberRepeat = this.memberIds.filter(
        (i) => i.memberId === member.memberId
      );
      const memberCount = memberRepeat.length;
      if (memberCount >= 3) {
        memberNames.push(memberRepeat[0].memberName);
        repeatedMembers.push(memberRepeat[0]);
      }
    });
    if (memberNames.length > 0) {
      this.modalService.info({
        nzBodyStyle: { margin: "20px" },
        nzTitle:
          memberNames.join() + "-already been allocated with 3 questions",
        nzOnOk: () =>
          this._checkboxUncheck(question, repeatedMembers, memberId),
      });
      return true;
    }
    return false;
  }
  _showLabelsForSameQuestion(settingUpObj) {
    this.ballotingLines.forEach((ballotQues) => {
      if (ballotQues.questions) {
        ballotQues.questions.forEach((ques) => {
          if (ballotQues.questionId === ques.id) {
            ques.settolob = true;
          }
          if (
            ques.settolob == false &&
            this.settingUpObj.questionId === ques.id
          ) {
            ques.alterQ = true;
            ques.disableLbl =
              "Question is set against ballot order " +
              settingUpObj.ballotOrder;
          } else {
          }
        });
      }
    });
  }
  _disableOtherQuestionInBallotOrder(settingUpObj) {
    this.ballotingLines.forEach((ballotQues) => {
      if (ballotQues.questions) {
        ballotQues.questions.forEach((ques) => {
          if (settingUpObj.ballotOrder === ballotQues.ballotingOrder) {
            ques.alterQ = false;
            if (ballotQues.questionId) {
              if (ballotQues.questionId === ques.id) {
                ques.settolob = true;
              } else {
                ques.alterQ = true;
              }
            }
          }
        });
      }
    });
  }
  removelabelFromQuestionSetUp(questionId, ballotOrder) {
    this.ballotingLines.forEach((ballotQues, index) => {
      if (ballotQues.ballotingOrder == ballotOrder)
        this.ballotingLines[index].questionId = null;
      if (ballotQues.questions) {
        ballotQues.questions.forEach((ques) => {
          if (ques.id === questionId) {
            ques.setolob = false;
            if (ballotOrder !== ballotQues.id) {
              ques.alterQ = false;
              ques.disableLbl = "";
            }
          }
        });
      }
    });
  }
  _changeClubbingMemberOrder(ballot, clubbingDetails, isSet) {
    clubbingDetails.forEach((value) => {
      value.newprimaryMember = false;
      if (isSet === true && value.memberId === ballot.memberId) {
        value.newprimaryMember = true;
      }
      if (isSet === false && value.primaryMember === true) {
        value.newprimaryMember = true;
      }
    });
  }
  _orderClubbingMember(members) {
    return members.sort(this._compareValues("newprimaryMember", "desc"));
  }
  _removeMemberFromMemberArr(memberId, questionId) {
    for (var i = 0; i < this.memberIds.length; i++) {
      if (this.memberIds[i].questionId == questionId) {
        if (this.memberIds[i].memberId === memberId) {
          this.memberIds.splice(i, 1);
        }
      }
    }
    if (this.SettingUpArray && this.SettingUpArray.length > 0) {
      this.SettingUpArray.forEach((setQues) => {
        for (var i = 0; i < setQues.members.length; i++) {
          if (setQues.members[i].questionId === questionId) {
            if (setQues.members[i].memberId === memberId) {
              setQues.members.splice(i, 1);
            }
          }
        }
      });
    }
  }

  // check whether 30 questions selected
  _checkThirtySelected(index, question, ballot) {
    if (this.SettingUpArray.length === 30) {
      this.modalService.info({
        nzBodyStyle: { margin: "20px" },
        nzTitle: "Sorry, You have already selected 30 notices",
        nzOnOk: () => {
          this._checkboxUncheck(question, null, null);
        },
      });
      return true;
    }
    return false;
  }
  // show delete icon only for repeatd members
  _showClubbedMemberDelete(repeatdMembers, currentQ, ballotMemberId) {
    let canDeleteIds = [];
    this.memberIds.forEach((member) => {
      let found = repeatdMembers.some((el) => el.memberId === member.memberId);
      if (found) {
        canDeleteIds.push(member);
      }
    });
    this.ballotingLines.forEach((ballot) => {
      if (ballot.questions && ballot.questionId) {
        ballot.questions.forEach((question) => {
          question.clubbingDetails.forEach((member) => {
            member.showDelete = false;
            let found = canDeleteIds.some(
              (el) =>
                el.memberId === member.memberId &&
                question.id === el.questionId &&
                el.primarymember === false
            );
            if (found) {
              member.showDelete = true;
            }
          });
        });
      }
    });
    currentQ.clubbingDetails.forEach((member) => {
      member.showDelete = false;
      let found = canDeleteIds.some(
        (el) =>
          el.memberId === member.memberId && ballotMemberId !== el.memberId
      );
      if (found) {
        member.showDelete = true;
      }
    });
  }
  resetDeleteIcon() {
    this.ballotingLines.forEach((ballot) => {
      if (ballot.questions) {
        ballot.questions.forEach((question) => {
          question.clubbingDetails.forEach((member) => {
            member.showDelete = false;
          });
        });
      }
    });
  }
  // setting up algorithm ends
}
