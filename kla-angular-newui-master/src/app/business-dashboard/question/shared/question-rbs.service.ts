import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class QuestionRBSService {
  rbsJson: any;

  constructor(private http: HttpClient, private router: Router) {}

  getQuestionPermissions(userId) {
    if (userId) {
      return this.http
        .get(environment.rbs_api_url + `getUserRoleDetails?userId=${userId}`)
        .pipe(
          map((res) => {
            this.rbsJson = res;
            return res;
          })
        );
    }
  }
  doIHaveAnAccess(pCategory, permission) {
    let permObj;
    if (this.rbsJson) {
      permObj = this.rbsJson.modules.QUESTION_PROCESSING;
      if (permObj) {
        if (permObj.categorys) {
          const permCategorys = permObj.categorys;
          if (permCategorys[pCategory]) {
            const permCat = permCategorys[pCategory];
            return permCat.includes(permission);
          }
        }
      }
    }
    return false;
  }
  getButtonsInView(qDetail, currentUser, isClubbingRemoval, statusParam) {
    let buttonList = this._getButtonsInView();
    let arrQuestionStatus = [
      "WITHDRAWN",
      "DISALLOWED",
      "CHANGE_IN_REPLY_APPROVED",
      "ANSWERED",
      "WAITING_FOR_ANSWER",
    ];

    let arrNoWithdraw = [
      "WITHDRAWN",
      "DISALLOWED",
      "CHANGE_IN_REPLY_REQUEST",
      "CHANGE_IN_REPLY_APPROVED"
    ];
    buttonList.Back = true;
    if (this.doIHaveAnAccess("CHANGE_ANSWERTYPE", "READ")) {
      buttonList.changeAnsType = true;
    }
    if (this._isWithdrawn(qDetail)) {
      if (this.doIHaveAnAccess("NOTES", "READ")) {
        buttonList.notes = true;
      }
      if (this.doIHaveAnAccess("VERSION", "READ")) {
        buttonList.version = true;
      }
    } else if (
      !arrNoWithdraw.includes(qDetail.status) &&
      qDetail.withdrawelWorkFlowId == null &&
      this.doIHaveAnAccess(qDetail.category, "WITHDRAW")
    ) {
      if (currentUser.userId === qDetail.primaryMemberId) {
        buttonList.Withdraw = true;
      } else if (!this._IsMinister(currentUser)){
        buttonList.removeClubbing = true;
      }
    } else if (isClubbingRemoval) {
      if (this.doIHaveAnAccess("CLUBBING_REMOVE_FORWARD", "READ")) {
        buttonList.clubbRemoveForward = true;
      }
      if (this.doIHaveAnAccess("CLUBBING_REMOVE_APPROVE", "READ")) {
        buttonList.clubbRemoveApprove = true;
      }
    } else if (this._isPendinfForwithdrawl(qDetail, statusParam)) {
      if (this.doIHaveAnAccess("WITHDRAW_FORWARD", "READ")) {
        buttonList.WithdrawForward = true;
      }
      if (this.doIHaveAnAccess("WITHDRAW_APPROVE", "READ")) {
        buttonList.WithdrawApprove = true;
      }
    } else if (
      qDetail.status === "CHANGE_IN_REPLY_REQUEST" ||
      qDetail.status === "REQUEST_FOR_CORRECTION_OF_ANSWER"
    ) {
      if (this.doIHaveAnAccess("CORRECTION_FORWARD", "READ")) {
        buttonList.CorrectionForward = true;
      }
      if (this.doIHaveAnAccess("CORRECTION_APPROVE", "READ")) {
        buttonList.CorrectionApprove = true;
      }
      if (this.doIHaveAnAccess("ANSWER_VERSION", "READ")) {
        buttonList.answerVersion = true;
      }
    }  else if (qDetail.requestChangeReply && !qDetail.requestCorrectionAfterSabha) {
      if (this.doIHaveAnAccess("CHANGEREPLY", "READ")) {
        buttonList.ChangeReply = true;
      }
    } else if (qDetail.status === "APPROVED") {
      if (this.doIHaveAnAccess(qDetail.category, "CHANGEREPLY")) {
        buttonList.ChangeReply = true;
      }
      if (
        qDetail.approvedBy === currentUser.userId &&
        qDetail.stage !== "TAKEN" &&
        !qDetail.revokedWorkFlowId
      ) {
        buttonList.Revoke = true;
      }
    } else if (
      qDetail.status === "SAVED" &&
      this.doIHaveAnAccess("QUESTION", "UPDATE") &&
      this.doIHaveAnAccess("QUESTION", "DELETE")
    ) {
      buttonList.Edit = true;
      buttonList.Delete = true;
    } else if (
      (qDetail.stage === "TAKEN") &&
      qDetail.requestCorrectionAfterSabha
    ) {
      // speaker receives the correction request & sent back to Qs
      if (this.doIHaveAnAccess("CORRECTION_APPROVE", "READ")) {
        buttonList.CorrectionApproveAfterSabha = true;
      }
      if (this.doIHaveAnAccess("ANSWER_VERSION", "READ")) {
        buttonList.answerVersion = true;
      }
    } else if (
      !arrQuestionStatus.includes(qDetail.status) &&
      !this._isWithdrawn(qDetail)
    ) {
      if (this.doIHaveAnAccess(qDetail.category, "FORWARD")) {
        buttonList.ForwardTo = true;
      }
      if (this.doIHaveAnAccess(qDetail.category, "BACKWARD")) {
        buttonList.BackwardTo = true;
      }
      if (
        (this.doIHaveAnAccess(qDetail.category, "APPROVE") &&
          qDetail.type !== "SHORT_NOTICE") ||
        (qDetail.type === "SHORT_NOTICE" &&
          this.doIHaveAnAccess("SHORT_NOTICE", "READ"))
      ) {
        buttonList.Approve = true;
      }
      if (
        (this.doIHaveAnAccess(qDetail.category, "DISALLOW") &&
          qDetail.type !== "SHORT_NOTICE") ||
        (qDetail.type === "SHORT_NOTICE" &&
          this.doIHaveAnAccess("SHORT_NOTICE", "READ"))
      ) {
        buttonList.Disallow = true;
      }
      if (this.doIHaveAnAccess("QUESTION_HEADING", "UPDATE")) {
        buttonList.Edit = true;
      }
    }
    if (this.doIHaveAnAccess("NOTES", "READ")) {
      buttonList.notes = true;
    }
    if (this._isnotCorrection(qDetail)) {
      if (this.doIHaveAnAccess("VERSION", "READ")) {
        buttonList.version = true;
      }
    }
    return buttonList;
  }

  _isnotCorrection(qDetail) {
    if (
      qDetail.status === "CHANGE_IN_REPLY_REQUEST" ||
      qDetail.status === "REQUEST_FOR_CORRECTION_OF_ANSWER" ||
      (qDetail.stage  === "TAKEN" && qDetail.requestCorrectionAfterSabha) ||
      (qDetail.stage === "ANSWERED" && qDetail.requestCorrectionAfterSabha)
    ) {
      return false;
    }
    return true;
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
  _isPendinfForwithdrawl(qDetail, statusParam) {
    if (
      qDetail.withdrawelStatus === "WITHDRAWEL_REQUESTED" &&
      qDetail.withdrawelWorkFlowId &&
      (statusParam === "PENDING_FOR_WITHDRAWAL" || statusParam === "CLAIMED")
    ) {
      return true;
    }
    return false;
  }
  getButtonsInEdit(qDetail, currentUser) {
    const buttonList = this._getButtonsInEdit();
    let editSttaus = ["SAVED", "QUESTION_BANK", "SUBMITTED_TO_PPO"]
    if (!editSttaus.includes(qDetail.status)) {
      buttonList.Back = true;
    }
    if (
      this.doIHaveAnAccess("QUESTION", "CREATE") &&
      this.doIHaveAnAccess("QUESTION", "UPDATE") &&
      editSttaus.includes(qDetail.status)
    ) {
      buttonList.SaveToBank = true;
      buttonList.Save = true;
      buttonList.Submit = true;
      if (qDetail.status !== "SUBMITTED_TO_PPO") {
        buttonList.Delete = true;
      }
    } else {
      if (this.doIHaveAnAccess(qDetail.category, "DRAFT")) {
        buttonList.Draft = true;
      }
      if (this.doIHaveAnAccess(qDetail.category, "FORWARD")) {
        buttonList.ForwardTo = true;
      }
      if (this.doIHaveAnAccess(qDetail.category, "BACKWARD")) {
        buttonList.BackwardTo = true;
      }
      if (
        (this.doIHaveAnAccess(qDetail.category, "APPROVE") &&
          qDetail.type !== "SHORT_NOTICE") ||
        (qDetail.type === "SHORT_NOTICE" &&
          this.doIHaveAnAccess("SHORT_NOTICE", "READ"))
      ) {
        buttonList.Approve = true;
      }

      if (
        (this.doIHaveAnAccess(qDetail.category, "DISALLOW") &&
          qDetail.type !== "SHORT_NOTICE") ||
        (qDetail.type === "SHORT_NOTICE" &&
          this.doIHaveAnAccess("SHORT_NOTICE", "READ"))
      ) {
        buttonList.Disallow = true;
      }
      if (this.doIHaveAnAccess("CHECK_DUPLICATE", "READ")) {
        buttonList.checkDuplicate = true;
      }
      if (this.doIHaveAnAccess("NOTES", "UPDATE")) {
        buttonList.notes = true;
      }
      if (this.doIHaveAnAccess("VERSION", "READ")) {
        buttonList.version = true;
      }
    }
    return buttonList;
  }
  getQEditOptions(status) {
    let editableFields;
    let editSttaus = ["SAVED", "QUESTION_BANK", "SUBMITTED_TO_PPO"]
    if (
      this.doIHaveAnAccess("QUESTION", "CREATE") &&
      this.doIHaveAnAccess("QUESTION", "UPDATE") &&
      this.doIHaveAnAccess("QUESTION", "DELETE") &&
      editSttaus.includes(status)
    ) {
      editableFields = this._getQEditOptionsForOwner();
    } else {
      editableFields = this._getQEditOptionsNA();
      if (this.doIHaveAnAccess("QUESTION_HEADING", "UPDATE")) {
        editableFields.noticeHeadingEdit = true;
      }

      if (this.doIHaveAnAccess("CLAUSE", "UPDATE")) {
        editableFields.clauseEdit = true;
      }

      if (this.doIHaveAnAccess("SUB_SUBJECT", "UPDATE")) {
        editableFields.subsubjectEdit = true;
      }

      if (this.doIHaveAnAccess("QUESTION_TAG", "UPDATE")) {
        editableFields.tagEdit = true;
      }

      if (this.doIHaveAnAccess("CLAUSE_TAG", "UPDATE")) {
        editableFields.clauseTagEdit = true;
      }

      if (this.doIHaveAnAccess("CLUBBING", "UPDATE")) {
            editableFields.clubbedMlaEdit = true;
      }

      if (this.doIHaveAnAccess("CLUBBING", "CREATE")) {
        editableFields.addclubbedMlaEdit = true;
      }

      if (this.doIHaveAnAccess("QUESTION_CATEGORY", "UPDATE")) {
        editableFields.categoryEdit = true;
      }
      if (this.doIHaveAnAccess("QUESTION_DATE", "UPDATE")) {
        editableFields.questionDate = true;
      }

      if (this.doIHaveAnAccess("QUESTION_PRIORITY", "UPDATE")) {
        editableFields.priorityEdit = true;
      }

      if (this.doIHaveAnAccess("RULE", "READ")) {
        editableFields.showrule = true;
      }
    }

    if (this.doIHaveAnAccess("ADD_MLA", "UPDATE") && status === "SAVED") {
      editableFields.addmla = true;
    }

    if (this.doIHaveAnAccess("PARTY", "UPDATE") && status === "SAVED") {
      editableFields.party = true;
    }
    if (this.doIHaveAnAccess("TRANSFER_DATE", "UPDATE")) {
      editableFields.transferDate = true;
    }

    editableFields.clubbmla = true;

    return editableFields;
  }
  getrbsPermissionForCreate() {
    const createOptions = this._getrbsPermissionForCreate();
    if (this.doIHaveAnAccess("QCREATE_CLUBMLA", "CREATE")) {
      createOptions.clubbmla = true;
    }
    if (this.doIHaveAnAccess("ADD_MLA", "CREATE")) {
      createOptions.addmla = true;
    }
    if (this.doIHaveAnAccess("PARTY", "CREATE")) {
      createOptions.addparty = true;
    }
    return createOptions;
  }
  getrbsPermissionForBallot() {
    const buttonList = this._getrbsPermissionForBallot();
    if (this.doIHaveAnAccess("CANCEL_BALLOT", "READ")) {
      buttonList.Cancel = true;
    }
    if (this.doIHaveAnAccess("APPROVE_BALLOT", "READ")) {
      buttonList.Approve = true;
    }
    if (this.doIHaveAnAccess("ADD_TO_LOB", "READ")) {
      buttonList.AddToLOB = true;
    }
    if (this.doIHaveAnAccess("APPROVE_BALLOT", "UPDATE")) {
      buttonList.EditNotice = true;
    }
    return buttonList;
  }
  _getQEditOptionsForOwner() {
    return {
      assemblyEdit: true,
      sessionEdit: true,
      clubbedMlaEdit: true,
      addclubbedMlaEdit: true,
      noticeHeadingEdit: true,
      clauseEdit: true,
      clauseTagEdit: false,
      subsubjectEdit: false,
      portfolioEdit: true,
      ministersubject: true,
      questionDate: true,
      categoryEdit: true,
      priorityEdit: true,
      tagEdit: false,
      addmla: false,
      clubbmla: false,
      showrule: false,
      party: false,
      reason: true,
    };
  }
  _getQEditOptionsNA() {
    return {
      assemblyEdit: false,
      sessionEdit: false,
      clubbedMlaEdit: false,
      addclubbedMlaEdit: false,
      noticeHeadingEdit: false,
      clauseEdit: false,
      clauseTagEdit: false,
      subsubjectEdit: false,
      portfolioEdit: false,
      ministersubject: false,
      questionDate: false,
      categoryEdit: false,
      priorityEdit: false,
      tagEdit: false,
      addmla: false,
      clubbmla: false,
      showrule: false,
      party: false,
      reason: false,
    };
  }
  _getButtonsInEdit() {
    return {
      Save: false,
      Submit: false,
      SaveToBank: false,
      Delete: false,
      ForwardTo: false,
      BackwardTo: false,
      Approve: false,
      Disallow: false,
      checkDuplicate: false,
      Back: false,
      Draft: false,
      notes: false,
      version: false,
      Revoke: false,
    };
  }
  getButtonsInList(roles) {
    const buttons = this._getButtonsInList();
    if (
      this.doIHaveAnAccess("CREATE_QUESTION", "CREATE") &&
      roles.indexOf("minister") === -1
    ) {
      buttons.create = true;
    }
    return buttons;
  }
  _getButtonsInList() {
    return {
      create: false,
    };
  }

  getButtonsInAnswerStatusListProcess(qDetail, currentUser, statusParam) {
    let buttonList = this._getButtonsInView();
    let arrQuestionStatus = [
      "WITHDRAWN",
      "DISALLOWED",
      "CORRECTION_APPROVED",
      "ANSWERED",
    ];

    let arrNoWithdraw = [
      "WITHDRAWN",
      "DISALLOWED",
      "CORRECTION_REQUEST",
      "CORRECTION_APPROVED",
    ];
    buttonList.Back = true;
    if (
      !arrNoWithdraw.includes(qDetail.status) &&
      qDetail.withdrawelWorkFlowId == null &&
      this.doIHaveAnAccess(qDetail.category, "WITHDRAW") &&
      currentUser.userId === qDetail.primaryMemberId
    ) {
      buttonList.Withdraw = true;
    } else if (qDetail.status === "ANSWERED") {
      if (this.doIHaveAnAccess("CHANGEREPLY", "READ")) {
        buttonList.ChangeReply = true;
      }
    } else if (qDetail.status === "APPROVED") {
      if (this.doIHaveAnAccess(qDetail.category, "CHANGEREPLY")) {
        buttonList.ChangeReply = true;
      }
      if (
        qDetail.approvedBy === currentUser.userId &&
        qDetail.status !== "TAKEN" &&
        !qDetail.revokedWorkFlowId
      ) {
        buttonList.Revoke = true;
        // buttonList.Edit = true;
      }
    } else if (
      qDetail.status === "SAVED" &&
      this.doIHaveAnAccess("QUESTION", "UPDATE") &&
      this.doIHaveAnAccess("QUESTION", "DELETE")
    ) {
      buttonList.Edit = true;
      buttonList.Delete = true;
    } else if (!arrQuestionStatus.includes(qDetail.status)) {
      if (this.doIHaveAnAccess(qDetail.category, "FORWARD")) {
        buttonList.ForwardTo = true;
      }
      if (this.doIHaveAnAccess(qDetail.category, "BACKWARD")) {
        buttonList.BackwardTo = true;
      }
      if (
        (this.doIHaveAnAccess(qDetail.category, "APPROVE") &&
          qDetail.type !== "SHORT_NOTICE") ||
        (qDetail.type === "SHORT_NOTICE" &&
          this.doIHaveAnAccess("SHORT_NOTICE", "READ"))
      ) {
        buttonList.Approve = true;
      }
      if (
        (this.doIHaveAnAccess(qDetail.category, "DISALLOW") &&
          qDetail.type !== "SHORT_NOTICE") ||
        (qDetail.type === "SHORT_NOTICE" &&
          this.doIHaveAnAccess("SHORT_NOTICE", "READ"))
      ) {
        buttonList.Disallow = true;
      }
      if (this.doIHaveAnAccess("QUESTION_HEADING", "UPDATE")) {
        buttonList.Edit = true;
      }
    }
    if (this.doIHaveAnAccess("NOTES", "READ")) {
      buttonList.notes = true;
    }
    if (this.doIHaveAnAccess("VERSION", "READ")) {
      buttonList.version = true;
    }
    return buttonList;
  }
  _getButtonsInView() {
    return {
      Delete: false,
      Withdraw: false,
      ForwardTo: false,
      BackwardTo: false,
      Approve: false,
      Revoke: false,
      Disallow: false,
      Edit: false,
      Back: false,
      version: false,
      notes: false,
      ChangeReply: false,
      WithdrawForward: false,
      WithdrawApprove: false,
      CorrectionForward: false,
      CorrectionApprove: false,
      answerVersion: false,
      removeClubbing: false,
      clubbRemoveForward: false,
      clubbRemoveApprove: false,
      CorrectionApproveAfterSabha: false,
      changeAnsType: false
    };
  }
  _getrbsPermissionForCreate() {
    return {
      addmla: false,
      clubbmla: false,
      addparty: false,
    };
  }
  _getrbsPermissionForBallot() {
    return {
      Cancel: false,
      Approve: false,
      AddToLOB: false,
      EditNotice: false,
    };
  }
  _IsMinister(currentuser) {
    return currentuser
    .authorities.includes('minister');
  }
  getloggedUserType() {
    let klaUserType = 'ADMIN';
    if (this.router.url.includes("/dashboard/")) {
      klaUserType = 'IN_HOUSE';
    }
    return klaUserType;
  }
}
