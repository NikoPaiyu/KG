import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import * as moment from "moment";
import * as _ from "lodash";
@Injectable({
  providedIn: "root",
})
export class QuestionService {
  rbsJson: any;
  reportApiUrl:string;

  constructor(private http: HttpClient) {
    this.reportApiUrl = environment.report_api_url;
  }

  getAllAssembly() {
    return this.http.get(`${environment.calendar_api_url}/mock/getAllAssembly`);
  }
  getAllSession() {
    return this.http.get(`${environment.calendar_api_url}/mock/getAllSession`);
  }
  
  getAllAssemblyAndSession() {
    return this.http.get(`${environment.calendar_api_url}/getAllAssemblyAndSession`)
      .pipe(map((res) => {
        let data = this.rebuildAssemblyData(res);
          return data;
        })
      );
  }
  
  getView(questionId: number, userId) {
    return this.http.get(
      `${environment.question_api_url}question/getById/${questionId}?userId=${userId}`
    );
  }

  getPreViewquestionWithAnswer(questionId: number) {
    return this.http.get(
      `${environment.question_api_url}question/preview/questionWithAnswer/${questionId}`
    );
  }
  getListByOwner(assembly, session, status, userId, primaryFlag) {
    // tslint:disable-next-line: max-line-length
    let url = `${environment.question_api_url}question/getByOwner?ownerId=${userId}&assemblyId=${assembly}&sessionId=${session}&primaryFlag=${primaryFlag}`;
    if (status) {
      url += `&status=${status}`;
    }
    return this.http.get<any>(url);
  }

  getNoticesListByOwner(assembly, session, status, userId, primaryFlag) {
    // tslint:disable-next-line: max-line-length
    let url = `${environment.question_api_url}question/member/getNotices?ownerId=${userId}&assemblyId=${assembly}&sessionId=${session}&primaryFlag=${primaryFlag}`;
    if (status) {
      url += `&status=${status}`;
    }
    return this.http.get<any>(url);
  }
  getNoticesListByMlaPpoQsa(body) {
    // tslint:disable-next-line: max-line-length
    let url = `${environment.question_api_url}question/member/getNotices`;
    return this.http.post<any>(url, body);
  }
  getMemberRaisedShortNoticeQ(body) {
    // tslint:disable-next-line: max-line-length
    let url = `${environment.question_api_url}shortNotice/memberRaisedListForPPO`;
    return this.http.post<any>(url, body);
  }
  getQuestionBankListByOwner(assembly, session, userId, primaryFlag) {
    // tslint:disable-next-line: max-line-length
    let url = `${environment.question_api_url}question/questionBank?userId=${userId}`;
    return this.http.get<any>(url);
  }
  getQuestionListByOwner(assembly, session, status, userId, primaryFlag) {
    // tslint:disable-next-line: max-line-length
    let url = `${environment.question_api_url}question/member/getQuestions?ownerId=${userId}&assemblyId=${assembly}&sessionId=${session}&primaryFlag=${primaryFlag}`;
    if (status) {
      url += `&status=${status}`;
    }
    return this.http.get<any>(url);
  }
  getQuestionListByMlaPpoQsa(body) {
    // tslint:disable-next-line: max-line-length
    let url = `${environment.question_api_url}question/member/getQuestions`;
    return this.http.post<any>(url, body);
  }
  getApprovedQuestions(assembly, session, userId) {
    return this.http.get(
      `${environment.question_api_url}question/approvedList`
    );
  }
  getlistViewByAnswersection(userId) {
    return this.http.get(
      `${environment.question_api_url}question/waitingForAnswer?userId=${userId}`
    );
  }
  getlistViewByQuestionsection(
    assembly,
    session,
    roleInDepartment: string,
    userId
  ) {
    return this.http.get(
      `${environment.question_api_url}question/getAll/pending/${roleInDepartment}/${assembly}/${session}?userId=${userId}`
    );
  }
  submit(question, flag, primaryMember, createdBy) {
    var questionDto: any = {
      assemblyId: question.assemblyId ? question.assemblyId : null,
      sessionId: question.session ? question.session : null,
      primaryMemberId: primaryMember ? primaryMember : null,
      respondentMemberId: question.portfolio ? question.portfolio : null,
      ministerSubjectId: question.ministerSubject
        ? question.ministerSubject
        : null,
      category: question.category ? question.category : null,
      priority: question.priority ? question.priority : null,
      clauses: question.questionClauses ? question.questionClauses : null,
      heading: question.title ? question.title : null,
      questionDate: question.questionDate,
      clubbingDetails: question.clubbingDetails
        ? question.clubbingDetails
        : null,
      tag: question.tags ? question.tags : null,
      createdBy: createdBy ? createdBy : null,
      reason: question.reason ? question.reason : null,
      type: question.type ? question.type : "NORMAL",
      retainInBank: question.retainInBank,
      isFromBank: question.isFromBank,
      submittedThroughId: question.submittedThroughId,
    };
    if (question.status) {
      questionDto.status = question.status ? question.status : "";
    }
    const action = flag ? "submit" : "save";
    if (question.id) {
      questionDto["id"] = question.id;
    }
    return this.http.post(
      `${environment.question_api_url}question/${action}`,
      questionDto
    );
  }

  submitAsShortNotice(question, primaryMember) {
    var questionDto: any = {
      assemblyId: question.assemblyId ? question.assemblyId : null,
      sessionId: question.session ? question.session : null,
      primaryMemberId: primaryMember ? primaryMember : null,
      title: question.title ? question.title : null,
      createdDate: new Date().toISOString().split("T")[0],
      answerDate: question.questionDate,
      place: "Thiruvananthapuram",
      portfolioId: question.portfolio ? question.portfolio : null,
      subjectId: question.ministerSubject ? question.ministerSubject : null,
      reason: question.reason ? question.reason : null,
      clauses: question.questionClauses
        ? question.questionClauses.map((element) => element.clause)
        : [],
    };
    return this.http.post(
      `${environment.notice_processing_api}convertToShortNotice `,
      questionDto
    );
  }
  addToQuestionBank(question, primaryMember, createdBy) {
    const questionDto = {
      assemblyId: question.assemblyId ? question.assemblyId : null,
      sessionId: question.session ? question.session : null,
      primaryMemberId: primaryMember ? primaryMember : null,
      respondentMemberId: question.portfolio ? question.portfolio : null,
      ministerSubjectId: question.ministerSubject
        ? question.ministerSubject
        : null,
      category: question.category ? question.category : null,
      priority: question.priority ? question.priority : null,
      clauses: question.questionClauses ? question.questionClauses : null,
      heading: question.title ? question.title : null,
      questionDate: question.questionDate,
      clubbingDetails: question.clubbingDetails
        ? question.clubbingDetails
        : null,
      tag: question.tags ? question.tags : null,
      createdBy: createdBy ? createdBy : null,
      reason: question.reason ? question.reason : null,
      type: question.type ? question.type : "NORMAL",
      isFromBank: true,
    };
    if (question.id) {
      questionDto["id"] = question.id;
    }
    return this.http.post(
      `${environment.question_api_url}question/addToQuestionBank`,
      questionDto
    );
  }
  deleteQuestion(questionId: number) {
    return this.http.delete(
      `${environment.question_api_url}question/delete/${questionId}`
    );
  }
  getMlaList() {
    return this.http
      .get(
        `${environment.user_mgmnt_api_url}/v1/users/member/getAll`
      )
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  grandConsent(grantData) {
    return this.http.post(
      `${environment.question_api_url}consents/grants`,
      grantData
    );
  }
  requestConsent(requestData) {
    return this.http.post(
      `${environment.question_api_url}consents/requests`,
      requestData
    );
  }
  getMLACount(assemblyId, sessionId, memberId) {
    return this.http.get(
      `${environment.question_api_url}question-report/member-report/${assemblyId}/${sessionId}/${memberId}`
    );
  }
  getAllParties() {
    return this.http
      .get(`${environment.departmentmangement_api_url}/getparty`)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  getMyPartyMembers(userId) {
    return this.http
      .get(
        `${environment.question_api_url}consents/getMyParty?userId=${userId}`
      )
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  getConsentedPartyMembers(userId) {
    return this.http
      .get(
        `${environment.question_api_url}consents/getConsentedParty?userId=${userId}`
      )
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  getConsentedMembers(userId) {
    return this.http
      .get(
        `${environment.question_api_url}consents/getConsentedMember?userId=${userId}`
      )
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  getPartyByuserId(userId) {
    return this.http
      .get(`${environment.question_api_url}/consents/getParty?userId=${userId}`)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  getAllPartiesByPPO(userId) {
    return this.http
      .get(
        `${environment.question_api_url}/consents/getPartyPPO?userId=${userId}`
      )
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  getMlaListByParty(party) {
    return this.http.get(
      `${environment.user_mgmnt_api_url}/v1/users/member/allPartyMember/${party}`
    );
  }
  getListOfConsentRequests(loggedUserId) {
    return this.http.get(
      `${environment.question_api_url}consents/members/${loggedUserId}/consentRequests/REQUESTED`
    );
  }

  getListOfConsentGiven(loggedUserId) {
    return this.http.get(
      `${environment.question_api_url}consents/members/${loggedUserId}/consentRequests/ACCEPTED`
    );
  }
  getAllConsentsTaken(loggedUserId) {
    return this.http.get(
      `${environment.question_api_url}consents/members/${loggedUserId}/consentTaken`
    );
  }
  getAllConsentsAccepted(loggedUserId) {
    return this.http.get(
      `${environment.question_api_url}consents/members/${loggedUserId}/consentAccepted`
    );
  }
  getAllRequestSent(loggedUserId) {
    return this.http.get(
      `${environment.question_api_url}consents/members/${loggedUserId}/requestSent`
    );
  }
  acceptRejectRevokeRequest(data, consentid) {
    return this.http.put(
      `${environment.question_api_url}consents/` + consentid,
      data
    );
  }
  listOfPortfolio() {
    return this.http.get(
      `${environment.portfolio_mock_api_url}mock/portfolio/getAll`
    );
  }
  listOfMinisterSubjects() {
    return this.http.get(
      `${environment.portfolio_mock_api_url}mock/subject/getAll`
    );
  }
  getDesignationList(qDate) {
    if (qDate) {
      return this.http.get(
        `${environment.aod_api_url}aod/getPortfoliosForDay?date=${qDate}`
      );
    }
  }
  getPortfolios() {
    const url = `${environment.portfolio_mock_api_url}mock/portfolio/getAll`;
    return this.http.get(url);
  }
  getMinisterSubject(ministerId) {
    if (ministerId) {
      return this.http.get(
        `${environment.portfolio_mock_api_url}mock/portfolio/getSubjects/${ministerId}`
      );
    }
  }
  getMinisterSubSubjects(subjectId) {
    return this.http.get(
      `${environment.portfolio_mock_api_url}mock/subSubject/${subjectId}`
    );
  }
  getQuestionDate(assemblyId, sessionId, groupId, portfolioId) {
    return this.http.get(
      `${environment.aod_api_url}aod/${assemblyId}/${sessionId}/dates/${groupId}/${portfolioId}`
    );
  }

  getMinisterSubSubject(subjectId) {
    return this.http.get(
      `${environment.question_api_url}mock/minister/subject/${subjectId}/subSubjects`
    );
  }
  postAnswer(clauseAns) {
    return this.http.post(
      `${environment.question_api_url}question/answer/save`,
      clauseAns
    );
  }
  updateAnswer(clauseAns) {
    return this.http.put(
      `${environment.question_api_url}question/answer/save`,
      clauseAns
    );
  }
  getAnswer(clauseId, answerId) {
    return this.http.get(
      `${environment.question_api_url}clauses/${clauseId}/answers/${answerId}`
    );
  }
  deleteAnswer(clauseId, answerId) {
    return this.http.delete(
      `${environment.question_api_url}clauses/${clauseId}/answers/${answerId}`
    );
  }
  postNotes(dataLst: any, questionId: number, userId, noteId) {
    const note = {
      note: dataLst,
      ownerId: userId,
    };
    noteId ? (note["id"] = noteId) : "";
    return this.http.post(
      `${environment.question_api_url}question/note/addNote?questionId=${questionId}`,
      note
    );
  }
  deleteNotes(questionId, noteId) {
    return this.http.delete(
      `${environment.question_api_url}questions/${questionId}/notes/${noteId}`
    );
  }
  getNotes(questionId) {
    return this.http.get(
      `${environment.question_api_url}question/note/getAll/${questionId}`
    );
  }
  editNotes(questionId, noteId, editedComment) {
    const body = {
      comment: editedComment,
    };
    return this.http.put(
      `${environment.question_api_url}questions/${questionId}/notes/${noteId}`,
      body
    );
  }

  forwardOradmitQuestion(question, status, forwardTo, userId, fromGroup) {
    let url = `${environment.question_api_url}question/approve/${status}?approvedBy=${userId}&fromGroup=${fromGroup}`;
    if (userId && forwardTo) {
      url = `${environment.question_api_url}question/approve/${status}/${forwardTo}/${userId}/${fromGroup}`;
    }
    return this.http.put(url, question);
  }
  forwardOradmitWithdrawReq(questionId, forwardTo, approvedBy, fromGroup) {
    if (forwardTo) {
      return this.http.put(
        `${environment.question_api_url}question/approve/forwardWithdrawal/${forwardTo}/${fromGroup}?questionId=${questionId}`,
        forwardTo,
        questionId
      );
    }
    return this.http.put(
      // tslint:disable-next-line: max-line-length
      `${environment.question_api_url}question/approve/admitWithdrawal?approvedBy=${approvedBy}&questionId=${questionId}&fromGroup=${fromGroup}`,
      approvedBy,
      questionId
    );
  }
  forwardOradmitCorrectionReq(
    questionId,
    forwardTo,
    approvedBy,
    fromGroup,
    correctionDate
  ) {
    if (forwardTo) {
      return this.http.put(
        // tslint:disable-next-line: max-line-length
        `${environment.question_api_url}question/approve/forwardCorrectionRequest?group=${forwardTo}&questionId=${questionId}&fromGroup=${fromGroup}&userId=${approvedBy}`,
        forwardTo,
        questionId
      );
    }
    if (correctionDate) {
      return this.http.put(
        // tslint:disable-next-line: max-line-length
        `${environment.question_api_url}question/approve/admitCorrectionRequest?approvedBy=${approvedBy}&questionId=${questionId}&fromGroup=${fromGroup}&correctionDate=${correctionDate}`,
        approvedBy,
        questionId
      );
    }
    return this.http.put(
      // tslint:disable-next-line: max-line-length
      `${environment.question_api_url}question/approve/admitCorrectionRequest?approvedBy=${approvedBy}&questionId=${questionId}&fromGroup=${fromGroup}`,
      approvedBy,
      questionId
    );
  }

  validateCategoryCount(body) {
    return this.http.post(
      `${environment.question_api_url}question/categoryCountExpired`,
      body
    );
  }
  getAvailablePriority(body, questionDate) {
    return this.http.post(
      `${environment.question_api_url}question/availablePriority?questionDate=${questionDate}`,
      body
    );
  }
  getDate(assemblyId, sessionId) {
    return this.http.get(
      `${environment.question_api_url}aod/${assemblyId}/${sessionId}/allDates
      `
    );
  }
  getNoticeDate(assemblyId, sessionId) {
    return this.http.get(
      `${environment.question_api_url}aod/${assemblyId}/${sessionId}/noticeDates
      `
    );
  }
  getCosDates(assemblyId, sessionId) {
    const url = `${environment.calendar_api_url}/get/allCalenderDates?assemblyId=${assemblyId}&sessionId=${sessionId}`;
    return this.http.get(url);
  }
  getBallotDates(assemblyId, sessionId) {
    return this.http.get(
      `${environment.question_api_url}QPBalloting/getBallotDates
      `
    );
  }
  getDetailsOfNotices(assemblyId, sessionId, selectedQuestionDate) {
    return this.http.get(
      `${environment.question_api_url}/question-report/members/notices/${assemblyId}/${sessionId}/${selectedQuestionDate}`
    );
  }
  WithdrawQuestion(memberId, questionId) {
    return this.http.put(
      `${environment.question_api_url}question/witdraw?questionId=${questionId}`,
      questionId
    );
  }
  removeMeFromClubbing(memberId, questionId) {
    return this.http.put(
      `${environment.question_api_url}question/applyClubbingWithdrawal?questionId=${questionId}&memberId=${memberId}`,
      questionId
    );
  }
  getlistofClubbedMemberWithdraw(role, userId) {
    return this.http.get(
      `${environment.question_api_url}question/getAll/pendingClubbedWithdrawal?role=${role}&userId=${userId}`
    );
  }
  forwardClubbRemove(question, questionId, group, fromGroup, clubbedMemberId) {
    // tslint:disable-next-line: max-line-length
    let url = `${environment.question_api_url}question/approve/forwardClubbedWithdrawal?questionId=${questionId}&group=${group}&fromGroup=${fromGroup}&clubbedMemberId=${clubbedMemberId}`;
    return this.http.put(url, question);
  }
  admitClubbRemove(
    question,
    questionId,
    approvedBy,
    fromGroup,
    clubbedMemberId
  ) {
    // tslint:disable-next-line: max-line-length
    let url = `${environment.question_api_url}question/approve/admitClubbedWithdrawal?questionId=${questionId}&approvedBy=${approvedBy}&fromGroup=${fromGroup}&clubbedMemberId=${clubbedMemberId}`;
    return this.http.put(url, question);
  }
  RevokeQuestion(revokedBy, questionId, groupId) {
    return this.http.put(
      `${environment.question_api_url}question/revoke?groupId=${groupId}&questionId=${questionId}&userId=${revokedBy}`,
      questionId
    );
  }
  claimUnclaimQuestion(
    questionId,
    userId,
    Isclaimed,
    role,
    type,
    clubbedMemberId
  ) {
    if (!Isclaimed) {
      let url = `${environment.question_api_url}question/claim/${questionId}?userId=${userId}&role=${role}&type=${type}&clubbedMemberId`;
      if (clubbedMemberId) {
        url = `${environment.question_api_url}question/claim/${questionId}?userId=${userId}&role=${role}&type=${type}&clubbedMemberId=${clubbedMemberId}`;
      }
      return this.http.put(url, userId);
    }
    let url = `${environment.question_api_url}question/unclaim/${questionId}?userId=${userId}&type=${type}&clubbedMemberId`;
    if (clubbedMemberId) {
      url = `${environment.question_api_url}question/unclaim/${questionId}?userId=${userId}&type=${type}&clubbedMemberId=${clubbedMemberId}`;
    }
    return this.http.put(url, userId);
  }
  DisallowQuestion(disallowedBy, questionId) {
    return this.http.put(
      `${environment.question_api_url}question/disallow?questionId=${questionId}&userId=${disallowedBy}`,
      questionId
    );
  }
  getClubbableMLACount() {
    return this.http.get(
      `${environment.question_api_url}question-config/clubbable-mla-count`
    );
  }
  getClauseCount() {
    return this.http.get(
      `${environment.question_api_url}question-config/clause-count`
    );
  }
  getClauseWordCount() {
    return this.http.get(
      `${environment.question_api_url}question-config/clause-word-count `
    );
  }
  getDeptDashboardCount(role, userId) {
    return this.http.get(
      `${environment.question_api_url}question/dashBoardDetails?groupId=${role}&userId=${userId}`
    );
  }
  getMLADashboardCount(userId) {
    return this.http.get(
      `${environment.question_api_url}question/member/dashBoardDetails/${userId}`
    );
  }
  getPPODashboardCount(userId) {
    return this.http.get(
      `${environment.question_api_url}question/ppo/dashBoardDetails/${userId}`
    );
  }
  getVersionById(versionId) {
    return this.http
      .get(`${environment.question_api_url}question/version/get/${versionId}`)
      .map((res: any) => {
        if (res && res.question) {
          if (!res.question.tags) res.question.tags = [];
          res.question.questionDate = this.formatDateDDMMYYYY(
            res.question.questionDate
          );
          res.question.registrationDate = this.formatDateDDMMYYYY(
            res.question.registrationDate
          );
        }

        return res;
      });
  }
  getVersionsList(questionId) {
    return this.http
      .get(
        `${environment.question_api_url}question/version/initialDetail/${questionId}`
      )
      .map((res: any) => {
        if (res && res.current && res.current.question) {
          if (!res.current.question.tags) res.current.question.tags = [];
          res.current.question.questionDate = this.formatDateDDMMYYYY(
            res.current.question.questionDate
          );
          res.current.question.registrationDate = this.formatDateDDMMYYYY(
            res.current.question.registrationDate
          );
        }

        if (res && res.mlaVersion && res.mlaVersion.question) {
          if (!res.mlaVersion.question.tags) res.mlaVersion.question.tags = [];
          res.mlaVersion.question.questionDate = this.formatDateDDMMYYYY(
            res.mlaVersion.question.questionDate
          );
          res.mlaVersion.question.registrationDate = this.formatDateDDMMYYYY(
            res.mlaVersion.question.registrationDate
          );
        }

        if (res && res.previous && res.previous.question) {
          if (!res.previous.question.tags) res.previous.question.tags = [];
          res.previous.question.questionDate = this.formatDateDDMMYYYY(
            res.previous.question.questionDate
          );
          res.previous.question.registrationDate = this.formatDateDDMMYYYY(
            res.previous.question.registrationDate
          );
        }

        return res;
      });
  }

  formatDateDDMMYYYY(datetime) {
    return datetime ? moment(datetime).format("DD-MM-YYYY") : "";
  }
  getAllDirections() {
    const url =
      environment.departmentmangement_api_url + "/directions/QUESTIONS";
    return this.http.get<any>(url);
  }
  getActivityFlow(processInstanceId) {
    return this.http.get(
      `${environment.question_wrkflw_api_url}task/tracking/?processInstanceId=${processInstanceId}`
    );
  }
  getMemberDetailswithConsents(fromDate, memberId, toDate) {
    /// request chnaged to grant
    let reqParm = `?fromDate=${fromDate}&memberId=${memberId}&toDate=${toDate}`;
    let url = "";
    if (fromDate && toDate) {
      url =
        `${environment.question_api_url}consents/partyMembers/request` +
        reqParm;
    } else {
      url = `${environment.question_api_url}consents/partyMembers/request?memberId=${memberId}`;
    }
    return this.http.get(url);
  }
  getMemberDetailswithGrand(fromDate, memberId, toDate) {
    let reqParm = `?fromDate=${fromDate}&memberId=${memberId}&toDate=${toDate}`;
    let url = "";
    if (fromDate && toDate) {
      url =
        `${environment.question_api_url}consents/partyMembers/grant` + reqParm;
    } else {
      url = `${environment.question_api_url}consents/partyMembers/grant?memberId=${memberId}`;
    }
    return this.http.get(url);
  }
  saveSubject(subjectData) {
    return this.http.post(
      `${environment.portfolio_mock_api_url}mock/subject/add`,
      subjectData
    );
  }
  updatePortfolioOrder(portdata) {
    let data = portdata.map((element, index) => {
      return {
        masterId: element.value,
        order: index,
      };
    });
    return this.http.post(
      `${environment.portfolio_mock_api_url}mock/portfolio/reorder`,
      data
    );
  }
  updateMinisterSubjectOrder(subjectData) {
    let data = subjectData.map((element, index) => {
      return {
        masterId: element.value,
        order: index,
      };
    });
    return this.http.post(
      `${environment.portfolio_mock_api_url}mock/portfolio/subject/reorder`,
      data
    );
  }

  saveSubSubject(subSubjectData) {
    return this.http.post(
      `${environment.portfolio_mock_api_url}mock/subSubject/add`,
      subSubjectData
    );
  }
  updateMinisterSubSubjectOrder(subsubjectData) {
    let data = subsubjectData.map((element, index) => {
      return {
        masterId: element.value,
        order: index,
      };
    });
    return this.http.post(
      `${environment.portfolio_mock_api_url}mock/portfolio/subSubject/reorder`,
      data
    );
  }
  getQuestionCongirations() {
    return this.http.get(
      `${environment.question_api_url}question-config/QUESTION`
    );
  }
  updateClauseDataSettings(clauseData) {
    return this.http.put(
      `${environment.question_api_url}question-config`,
      clauseData
    );
  }
  transferDate(req, dateShiftType) {
    let reqParm = `?fromDate=${req.fromDate}&toDate=${req.toDate}`;
    let url = "";
    if (dateShiftType === "dateshift") {
      url = `${environment.question_api_url}question/dateShift`;
    } else {
      url = `${environment.question_api_url}question/serialDateShift`;
    }
    return this.http.post(url, req);
  }
  changeInReply(qid) {
    return this.http.put(
      `${environment.question_api_url}question/change-reply?questionId=${qid}`,
      qid
    );
  }
  requestCorrectionStatement(reqObj, questionId, userId, isAftersabha) {
    if (isAftersabha) {
      return this.http.put(
        `${environment.question_api_url}question/requestCorrectionAfterSabha?questionId=${questionId}&userId=${userId}`,
        reqObj
      );
    }
    return this.http.put(
      `${environment.question_api_url}question/requestCorrectionStatement?questionId=${questionId}&userId=${userId}`,
      reqObj
    );
  }
  getRequestForChangeReply(assemblyId, sessionId, userId) {
    return this.http.get(
      `${environment.question_api_url}question/getRequestForChangeReply/${assemblyId}/${sessionId}`,
      userId
    );
  }
  getAllPendingWithdrawal(
    assembly,
    session,
    roleInDepartment: string,
    IsQuestion,
    userId
  ) {
    return this.http.get(
      `${environment.question_api_url}question/getAll/pendingWithdrawal/${IsQuestion}/${roleInDepartment}/${assembly}/${session}?userId=${userId}`
    );
  }
  getAllPendingCorrectionrequest(
    assembly,
    session,
    roleInDepartment: string,
    userId
  ) {
    return this.http.get(
      `${environment.question_api_url}question/getAll/pendingCorrectionRequest?assemblyId=${assembly}&sessionId=${session}&role=${roleInDepartment}&userId=${userId}`
    );
  }
  getWithdrawnNotices(assemblyId, sessionId) {
    return this.http.get(
      `${environment.question_api_url}question/list/notice/withdrawn?assemblyId=${assemblyId}&sessionId=${sessionId}`
    );
  }
  getWithdrawnQuestion(assemblyId, sessionId) {
    return this.http.get(
      `${environment.question_api_url}question/list/questions/withdrawn?assemblyId=${assemblyId}&sessionId=${sessionId}`
    );
  }
  getQuestionByStatus(assemblyId, sessionId, status, deptUserId, type, stage) {
    let url = `${environment.question_api_url}question/getAllByStatus?assemblyId=${assemblyId}&sessionId=${sessionId}&status=${status}&type=${type}`;
    if (stage) {
      url += `&stage=${stage}`;
    }
    if (deptUserId) {
      url += `&userId=${deptUserId}`;
    }
    return this.http.get(url);
  }
  getAllAnsweredQuestion(assemblyId, sessionId, deptUserId) {
    let url = `${environment.question_api_url}question/list/questions/answered?assemblyId=${assemblyId}&sessionId=${sessionId}`;
    if (deptUserId) {
      url += `&userId=${deptUserId}`;
    }
    return this.http.get(url);
  }
  getAllSNQAnsweredQuestion(assemblyId, sessionId, userId) {
    let url = `${environment.question_api_url}shortNotice/waitingForAnswer?assemblyId=${assemblyId}&sessionId=${sessionId}&userId=${userId}`;
    return this.http.get(url);
  }
  approveChangedReply(questionId, action) {
    return this.http.put(
      `${environment.question_api_url}question/approve-change-reply?action=${action}&questionId=${questionId}`,
      action,
      questionId
    );
  }
  changeStaredToUnstared(body) {
    return this.http.put(
      `${environment.question_api_url}question/changeCategory`,
      body
    );
  }
  checkQuesstionDuplication(parameters: any) {
    return this.http.get(
      `${environment.question_api_url}/question/check-duplication?questionId=${parameters.questionId}&assemblyId=${parameters.assemblyId}&sessionId=${parameters.sessionId}`
    );
  }
  getAllMembersList() {
    return this.http.get(
      `${environment.user_mgmnt_api_url}/v1/users/member/getAll`
    );
  }
  getAllExcludingMinisters() {
    return this.http.get(
      `${environment.user_mgmnt_api_url}/v1/users/member/getAllExcludingMinisters`
    );
  }
  getTransferableDate(questionId) {
    return this.http.get(
      `${environment.question_api_url}/question/getTransferableDates?questionId=${questionId}`
    );
  }
  getAnswerVersions(questionId, versionId) {
    return this.http.get(
      `${environment.question_api_url}question/answer/version?questionId=${questionId}&versionId=${versionId}`
    );
  }
  saveAsDraft(question, userId) {
    const url = `${environment.question_api_url}question/draft?userId=${userId}`;
    return this.http.post<any>(url, question);
  }

  // API related to Balloting
  getBallotReport(questionData) {
    const url = `${environment.question_api_url}QPBalloting/getBallotingLog/${questionData}}`;
    return this.http.get<any>(url);
  }
  performBallot(questionDate, assemblyId, sessionId) {
    const url = `${environment.question_api_url}QPBalloting/performBalloting/${questionDate}?assemblyId=${assemblyId}&sessionId=${sessionId}`;
    return this.http.post<any>(url, questionDate);
  }
  cancelBallot(questionDate) {
    const url = `${environment.question_api_url}QPBalloting/ballotResult/${questionDate}`;
    return this.http.delete<any>(url, questionDate);
  }
  cancelSettingUp(questionDate) {
    const url = `${environment.question_api_url}QPBalloting/cancelSettingUp/${questionDate}`;
    return this.http.put<any>(url, questionDate);
  }
  saveQuestionsForTheDay(questionDate, ballotingData) {
    return this.http.post(
      `${environment.question_api_url}QPBalloting/saveQuestionsForTheDay/${questionDate}`,
      ballotingData
    );
  }
  getBallotInitialData(questionDate) {
    const url = `${environment.question_api_url}QPBalloting/initialData/${questionDate}`;
    return this.http.get<any>(url);
  }
  getBallotDetailedView(questionDate) {
    const url = `${environment.question_api_url}QPBalloting/detailedView/${questionDate}`;
    return this.http.get<any>(url);
  }
  getBallotResult(questionDate) {
    const url = `${environment.question_api_url}QPBalloting/ballotResult/${questionDate}`;
    return this.http.get<any>(url);
  }
  getquestionsForTheDay(questionDate) {
    const url = `${environment.question_api_url}QPBalloting/questionsForTheDay/${questionDate}
    `;
    return this.http.get<any>(url);
  }
  getApprovedShortNotices(assembly, session) {
    const url = `${environment.question_api_url}shortNotice/approved/?assemblyId=${assembly}&sessionId=${session}
    `;
    return this.http.get<any>(url);
  }

  allotedQuestionsForTheDay(questionDate) {
    const url = `${environment.question_api_url}QPBalloting/allotedQuestionsForTheDay/${questionDate}
    `;
    return this.http.get<any>(url);
  }
  approveBallot(ballotId) {
    const url = `${environment.question_api_url}QPBalloting/approveQuestionsForTheDay/${ballotId}`;
    return this.http.post<any>(url, ballotId);
  }
  setToLob(questionId) {
    const url = `${environment.question_api_url}question/setToLob?questionId=${questionId}`;
    return this.http.post<any>(url, questionId);
  }
  getBallotedDates(assemblyId, sessionId) {
    const url = `${environment.question_api_url}QPBalloting/ballotedDates/?assemblyId=${assemblyId}&sessionId=${sessionId}
    `;
    return this.http.get<any>(url);
  }

  getBallotSet(assemblyId, sessionId) {
    const url = `${environment.question_api_url}QPBalloting/questionSet/?assemblyId=${assemblyId}&sessionId=${sessionId}
    `;
    return this.http.get<any>(url);
  }
  // Ends API related to ballot

  //send to department
  getApprovedQuestionSet(assemblyId, sessionId) {
    const url = `${environment.question_api_url}QPBalloting/approvedQuestionSet/?assemblyId=${assemblyId}&sessionId=${sessionId}
    `;
    return this.http.get<any>(url);
  }
  sendToDept(ballotId) {
    const url = `${environment.question_api_url}QPBalloting/sendQuestionsForTheDay/${ballotId}`;
    return this.http.post<any>(url, ballotId);
  }
  sendToDeptSNQ(assembly, session, questionIds) {
    const url = `${environment.question_api_url}shortNotice/sendToDepartment/?questionIds=${questionIds}`;
    // const url = `${environment.question_api_url}shortNotice/sendToDepartment/?assemblyId=${assembly}&sessionId=${session}`;
    return this.http.post<any>(url, questionIds);
  }
  //ends send dept

  tranferMinister(body, userId) {
    return this.http.post(
      `${environment.question_api_url}/question/transferMinister?userId=${userId}`,
      body
    );
  }
  getRules() {
    return this.http.get(
      `${environment.departmentmangement_api_url}/rules/QUESTIONS`
    );
  }
  questionDisallow(data) {
    return this.http.put(
      `${environment.question_api_url}question/disallow?questionId=${data.questionId}&userId=${data.ownerId}&groupId=${data.groupId}`,
      data
    );
  }
  disallowClause(data) {
    return this.http.put(
      `${environment.question_api_url}question/clause/disallow?clauseId=${data.clauseId}&userId=${data.ownerId}`,
      data
    );
  }
  getlistViewByPpo(assembly, session, status: string, userId) {
    return this.http.get(
      // tslint:disable-next-line: max-line-length
      `${environment.question_api_url}question/getAllForPPOByStatus?assemblyId=${assembly}&sessionId=${session}&status=${status}&userId=${userId}`
    );
  }
  removeClubbedmember(body) {
    return this.http.put(
      // tslint:disable-next-line: max-line-length
      `${environment.question_api_url}question/removeClubbing?questionId=${body.questionId}&memberId=${body.memberId}&reason=${body.reason}`,
      body
    );
  }
  sentToDepartment(body) {
    return this.http.put(`${environment.question_api_url}question/`, body);
  }

  getUnstarredList(questionDate, sessionId) {
    const url = `${environment.question_api_url}QPBalloting/unstarred/approvedQuestions?questionDate=${questionDate}&sessionId=${sessionId}`;
    return this.http.get<any>(url);
  }

  getUnstarredPreviewData(questionDate, sessionId) {
    const url = `${environment.question_api_url}QPBalloting/unstarred/booklet?questionDate=${questionDate}&sessionId=${sessionId}`;
    return this.http.get(url).pipe(
      map((res) => {
        let result = {};
        if (res && res['body']) {
         result = JSON.parse(res['body']);
        }
        return result;
      })
    ); 
   }

  getStarredPreviewData(questionDate) {
    const url = `${environment.question_api_url}QPBalloting/starred/booklet?questionDate=${questionDate}`;
    return this.http.get(url).pipe(
      map((res) => {
        let result = {};
        if (res && res['body']) {
         result = JSON.parse(res['body']);
        }
        return result;
      })
    );
  }

  sendUnstarredData(questionDate) {
    const url = `${environment.question_api_url}QPBalloting/unstarred/sendQuestions?questionDate=${questionDate}`;
    return this.http.get<any>(url, {});
  }
  saveFromSettingUp(saveData) {
    let url = `${environment.question_api_url}question/settingUp/edit`;
    return this.http.put<any>(url, saveData);
  }

  uploadDelayStatement(data) {
    let url = `${environment.question_api_url}question/answer/delayStatement`;
    return this.http.post<any>(url, data);
  }
  uploadAttachment(data) {
    let url = `${environment.question_api_url}question/answer/addAttachment`;
    return this.http.post<any>(url, data);
  }

  getGeneratedAnswerStatusList(assemblyId, sessionId) {
    let url = `${environment.question_api_url}question/list/answerStatus?assemblyId=${assemblyId}&sessionId=${sessionId}`;
    return this.http.get<any>(url);
  }

  saveAnswerStatusList(data) {
    let url = `${environment.question_api_url}question/answer/statusList/save`;
    return this.http.post<any>(url, data);
  }

  submitAnswerStatusList(data) {
    let url = `${environment.question_api_url}question/answer/statusList/submit`;
    return this.http.post<any>(url, data);
  }

  getAnswerStatusListById(listId) {
    let url = `${environment.question_api_url}question/answer/statulsList/getById/${listId}`;
    return this.http.get<any>(url);
  }

  getAllAnswerStatusList(assemblyId, sessionId) {
    let url = `${environment.question_api_url}question/answer/statulsList/all?assemblyId=${assemblyId}&sessionId=${sessionId}`;
    return this.http.get<any>(url);
  }

  getPendingAnswerStatusList(role) {
    let url = `${environment.question_api_url}question/answer/statusList/pending?role=${role}`;
    return this.http.get<any>(url);
  }

  getApprovedAnswerStatusList(assemblyId: any, sessionId: any) {
    let url = `${environment.question_api_url}question/report/answerStatus/approved?assemblyId=${assemblyId}&sessionId=${sessionId}`;
    return this.http.get<any>(url);
  }

  forwardOradmitAnswerStatusList(
    question,
    status,
    forwardTo,
    userId,
    fromGroup
  ) {
    let url = `${environment.question_api_url}question/answer/statusList/approve/${status}?listId=${question}&fromGroup=${fromGroup}`;
    if (userId && forwardTo) {
      url = `${environment.question_api_url}question/answer/statusList/approve/${status}/${forwardTo}/${userId}/${fromGroup}?listId=${question}`;
    }
    return this.http.put(url, {});
  }

  postAnswerStatusListNotes(dataLst: any, listId: number, userId, noteId) {
    const note = {
      statusReportId: listId,
      note: dataLst,
      ownerId: userId,
    };
    noteId ? (note["id"] = noteId) : "";
    return this.http.post(
      `${environment.question_api_url}question/report/answerStatus/addNote`,
      note
    );
  }

  getAnswerStatusListNotes(listId) {
    return this.http.get(
      `${environment.question_api_url}question/report/answerStatus/getNotes/${listId}`
    );
  }
  getSoaBasedOnQuestionDate(date) {
    return this.http.get(
      `${environment.aod_api_url}soa/get/scheduleForDate?date=${date}`
    );
  }
  removeTag(tagId: number) {
    return this.http.delete(
      `${environment.question_api_url}question/removeTag/${tagId}`
    );
  }

  getAllNoticesForPull(assemblyId, sessionId, role) {
    return this.http.get(
      `${environment.question_api_url}question/pullAll?role=${role}&assemblyId=${assemblyId}&sessionId=${sessionId}`
    );
  }

  getAllNoticesForTrack(assemblyId, sessionId, role) {
    return this.http.get(
      `${environment.question_api_url}question/list/all?role=${role}&assemblyId=${assemblyId}&sessionId=${sessionId}`
    );
  }

  getAllNoticesReturned(assemblyId, sessionId, role) {
    return this.http.get(
      `${environment.question_api_url}delay/returnedStatement?assemblyId=${assemblyId}&sessionId=${sessionId}`
    );
  }
  getCorrectionRequestAfterSabha(assemblyId, sessionId, userId) {
    return this.http.get(
      `${environment.question_api_url}question/getRequestForCorrectionAfterSabha/${assemblyId}/${sessionId}?userId=${userId}`
    );
  }
  pendingCorrectionRequestAfterSabha(assemblyId, sessionId, role, userId) {
    return this.http.get(
      `${environment.question_api_url}question/getAll/pendingCorrectionRequestAfterSabha?role=${role}&assemblyId=${assemblyId}&sessionId=${sessionId}&userId=${userId}`
    );
  }
  getClaimedByNotices(body) {
    return this.http.get(
      `${environment.question_api_url}question/getAll/pendingClaimedByQS?role=${body.role}&assemblyId=${body.assemblyId}&sessionId=${body.sessionId}&userId=${body.userId}`
    );
  }
  getAllForCorrection(assemblyId, sessionId, type, userId) {
    return this.http.get(
      // tslint:disable-next-line: max-line-length
      `${environment.question_api_url}question/getAllForCorrection?assemblyId=${assemblyId}&sessionId=${sessionId}&type=${type}&userId=${userId}`
    );
  }
  getCOSquestionDates(assemblyId, sessionId) {
    const url =
      environment.calendar_api_url +
      `/get/itemForQuestions?assemblyId=${assemblyId}&sessionId=${sessionId}`;
    return this.http.get(url);
  }
  getApprovedCos(assemblyId, sessionId) {
    const url =
      environment.calendar_api_url +
      `/get/item?assemblyId=${assemblyId}&sessionId=${sessionId}&status=APPROVED`;
    return this.http.get(url);
  }

  getApprovedSOA(assemblyId, sessionId, userId) {
    const url =
      environment.question_api_url +
      `/soa/getForSession?assemblyId=${assemblyId}&sessionId=${sessionId}&userId=${userId}`;
    return this.http.get(url);
  }
  getAODReport(assemblyId, sessionId) {
    const url =
      environment.portfolio_mock_api_url +
      `/mock/portfolio/getAllWithMinisterSubjects?assemblyId=${assemblyId}&sessionId=${sessionId}`;
    return this.http.get<any>(url);
  }
  // stat Report generation
  getReport(body) {
    // let Url = `http://localhost:5000/create-pdf`;
    let Url = `${environment.report_api_url}/create-pdf`;
    return this.http.post(Url, body, { responseType: "blob" }).pipe(
      map((res) => {
        return res;
      })
    );
  }
  getAnswerReceivedStaticstics(assemblyId, sessionId, questionDate) {
    const url = `${environment.question_api_url}question-report/answerRecievedStatistics?questionDate=${questionDate}&assemblyId=${assemblyId}&sessionId=${sessionId}`;
    return this.http.get<any>(url);
  }
  // End Report generation
  getGeneratedLateAnswerBulletin(assemblyId, sessionId) {
    let url = `${environment.question_api_url}question/list/lateAnswerBulletin?assemblyId=${assemblyId}&sessionId=${sessionId}`;
    return this.http.get<any>(url);
  }

  saveLateAnswerBulletin(data) {
    let url = `${environment.question_api_url}question/answer/lateAnswerBulletin/save`;
    return this.http.post<any>(url, data);
  }

  submitLateAnswerBulletin(data) {
    let url = `${environment.question_api_url}question/answer/lateAnswerBulletin/submit`;
    return this.http.post<any>(url, data);
  }

  getLateAnswerBulletinById(listId) {
    let url = `${environment.question_api_url}question/answer/lateAnswerBulletin/getById/${listId}`;
    return this.http.get<any>(url);
  }

  getAllLateAnswerBulletin(assemblyId, sessionId) {
    let url = `${environment.question_api_url}question/answer/lateAnswerBulletin/all?assemblyId=${assemblyId}&sessionId=${sessionId}`;
    return this.http.get<any>(url);
  }

  getPendingLateAnswerBulletin(role) {
    let url = `${environment.question_api_url}question/answer/lateAnswerBulletin/pending?role=${role}`;
    return this.http.get<any>(url);
  }

  getApprovedLateAnswerBulletin(assemblyId: any, sessionId: any, page, record) {
    let url = `${environment.question_api_url}question/answer/lateAnswerBulletin/approved?page=${page}&record=${record}`;
    return this.http.get<any>(url);
  }

  forwardOradmitLateAnswerBulletin(
    question,
    status,
    forwardTo,
    userId,
    fromGroup
  ) {
    let url = `${environment.question_api_url}question/answer/lateAnswerBulletin/approve/${status}?bulletinId=${question}&fromGroup=${fromGroup}`;
    if (userId && forwardTo) {
      url = `${environment.question_api_url}question/answer/lateAnswerBulletin/approve/${status}/${forwardTo}/${userId}/${fromGroup}?bulletinId=${question}`;
    }
    return this.http.put(url, {});
  }

  postLateAnswerBulletinNotes(dataLst: any, listId: number, userId, noteId) {
    const note = {
      statusReportId: listId,
      note: dataLst,
      ownerId: userId,
    };
    noteId ? (note["id"] = noteId) : "";
    return this.http.post(
      `${environment.question_api_url}question/report/lateAnswerBulletin/addNote`,
      note
    );
  }

  getLateAnswerBulletinNotes(listId) {
    return this.http.get(
      `${environment.question_api_url}question/report/lateAnswerBulletin/getNotes/${listId}`
    );
  }

  returnToDept(listId, questionId) {
    let url = `${environment.question_api_url}delay/question/return?listId=${listId}&questionId=${questionId}`;
    return this.http.post<any>(url, {});
  }
  getGeneratedDelayStatementList(assemblyId, sessionId) {
    let url = `${environment.question_api_url}delay/generateList?assemblyId=${assemblyId}&sessionId=${sessionId}`;
    return this.http.get<any>(url);
  }

  saveDelayStatementList(data) {
    let url = `${environment.question_api_url}question/answer/statusList/save`;
    return this.http.post<any>(url, data);
  }

  submitDelayStatementList(data) {
    let url = `${environment.question_api_url}delay/statementList?assemblyId=${data.assembyId}&sessionId=${data.sessionId}`;
    return this.http.post<any>(url, data.questionIds);
  }

  getDelayStatementListById(listId) {
    let url = `${environment.question_api_url}delay/statementList?listId=${listId}`;
    return this.http.get<any>(url);
  }

  getAllDelayStatementList(assemblyId, sessionId) {
    let url = `${environment.question_api_url}delay/statementList/pending/all?assemblyId=${assemblyId}&sessionId=${sessionId}`;
    return this.http.get<any>(url);
  }

  getPendingDelayStatementList(role) {
    let url = `${environment.question_api_url}delay/statementList/pending?role=${role}`;
    return this.http.get<any>(url);
  }

  getApprovedDelayStatementList(assemblyId: any, sessionId: any) {
    let url = `${environment.question_api_url}delay/approved?assemblyId=${assemblyId}&sessionId=${sessionId}`;
    return this.http.get<any>(url);
  }

  forwardDelayStatementList(question, status, forwardTo, userId, fromGroup) {
    let url = `${environment.question_api_url}delay/statementList/${status}/${forwardTo}/${userId}/${fromGroup}?listId=${question}`;
    return this.http.post(url, {});
  }

  admitDelayStatementList(question, layingDate, fromGroup) {
    let url = `${environment.question_api_url}delay/statementList/approve?listId=${question}&fromGroup=${fromGroup}&layingDate=${layingDate}`;

    return this.http.post(url, {});
  }
  postDelayStatementListNotes(dataLst: any, listId: number, userId, noteId) {
    const note = {
      parentId: Number(listId),
      note: dataLst,
      owner: userId,
    };
    noteId ? (note["id"] = noteId) : "";
    return this.http.post(`${environment.question_api_url}delay/note`, note);
  }

  getDelayStatementListNotes(listId) {
    return this.http.get(
      `${environment.question_api_url}delay/note?listId=${listId}`
    );
  }

  setDelayStatementListToLob(id) {
    // tslint:disable-next-line: max-line-length
    let url = `${environment.question_api_url}delay/statementList`;
    return this.http.post<any>(url, id);
  }

  getDelayStatementPreviewHtml(id) {
    return this.http.get(
      `${environment.question_api_url}delay/statementList/preview?listId=${id}`,
      { responseType: "text" }
    );
  }

  getApprovedShortNoticeQuestion(body) {
    return this.http.get(
      `${environment.question_api_url}question/section/getAllByType?assemblyId=${body.assemblyId}&sessionId=${body.sessionId}&stage=${body.stage}&type=${body.type}`
    );
  }

  // start ppo configuration
  savePPOConfig(body) {
    let url = `${environment.question_api_url}ppo/config/submit`;
    return this.http.post<any>(url, body);
  }
  getPPOConfig(userId) {
    return this.http.get(
      `${environment.question_api_url}ppo/config/id?userId=${userId}`
    );
  }
  // end ppo configuration

  //Duplicate Check
  getHeadingDuplicates(keywords: any[], noticeId) {
    let body = {
      keywords: keywords,
      searchCategory: "HEADING",
      noticeId: noticeId,
    };
    return this.http
      .post(`${environment.question_api_url}question/duplicate`, body)
      .map((res) => {
        return { keywords: _.clone(keywords), matches: res ? res : [] };
      });
  }

  getClauseDuplicates(keywords: any[], noticeId) {
    let body = {
      keywords: keywords,
      searchCategory: "CLAUSE",
      noticeId: noticeId,
    };
    return this.http
      .post(`${environment.question_api_url}question/duplicate`, body)
      .map((res) => {
        return { keywords: keywords, matches: res ? res : [] };
      });
  }

  getSubsubjectDuplicates(keywords: any[], subIds: any[], noticeId) {
    let body = {
      keywords: keywords,
      searchCategory: "SUB_SUBJECT",
      subSubjectIds: subIds,
      noticeId: noticeId,
    };
    return this.http
      .post(`${environment.question_api_url}question/duplicate`, body)
      .map((res) => {
        return { keywords: keywords, matches: res ? res : [] };
      });
  }

  getTagDuplicates(keywords: any[], noticeId) {
    let body = {
      keywords: keywords,
      searchCategory: "TAG",
      noticeId: noticeId,
    };
    return this.http
      .post(`${environment.question_api_url}question/duplicate`, body)
      .map((res) => {
        return { keywords: keywords, matches: res ? res : [] };
      });
  }

  // start API's for culling and assurance
  getAssuredQuestionList(assembly, session) {
    let url = `${environment.question_api_url}question/assurance/assuredQuestions?assemblyId=${assembly}&sessionId=${session}`;
    return this.http.get<any>(url);
  }

  getQuestionListToAssure(assembly, session, keyWords) {
    let url = `${environment.question_api_url}question/assurance/cullOutQuestions?assemblyId=${assembly}&sessionId=${session}`;
    return this.http.post<any>(url, keyWords);
  }

  getCullingQuestionView(questionId) {
    let url = `${environment.question_api_url}question/assurance/getAssuranceDetails/${questionId}`;
    return this.http.get<any>(url);
  }

  saveAssurance(assurance, questionId) {
    let url = `${environment.question_api_url}question/assurance/addAssurance?questionId=${questionId}`;
    return this.http.post<any>(url, assurance);
  }

  deleteAssurance(assuranceId) {
    let url = `${environment.question_api_url}question/assurance/deleteAssurance?assuranceId=${assuranceId}`;
    return this.http.delete<any>(url);
  }

  markAsNoAssurance(questionId) {
    let url = `${environment.question_api_url}question/assurance/markAsNoAssurance?questionId=${questionId}`;
    return this.http.put<any>(url, {});
  }
  markAsAssurance(questionId) {
    let url = `${environment.question_api_url}question/assurance/markAsAssurance?questionId=${questionId}`;
    return this.http.put<any>(url, {});
  }
  markAsNoAnsAssurance(body) {
    let url = `${environment.question_api_url}question/assurance/markAsNoAssurance/clause`;
    return this.http.put<any>(url, body);
  }
  submitAssurence(questionId) {
    let url = `${environment.question_api_url}question/assurance/submitAssurance?questionId=${questionId}`;
    return this.http.put<any>(url, {});
  }
  forwardAssurence(body) {
    return this.http.put(
      // tslint:disable-next-line: max-line-length
      `${environment.question_api_url}question/assurance/approve/forward/${body.forwardTo}/${body.userId}/${body.fromGroup}?questionId=${body.questionId}`,
      body.forwardTo,
      body.questionId
    );
  }
  forwardAssuranceList(body) {
    return this.http.put(
      // tslint:disable-next-line: max-line-length
      `${environment.question_api_url}question/assurance/approve/list/forward/${body.forwardTo}/${body.userId}/${body.fromGroup}?listId=${body.listId}`,
      body.forwardTo,
      body.questionId
    );
  }
  approveAssurence(body) {
    let url = `${environment.question_api_url}question/assurance/approve/admit?approvedBy=${body.approvedBy}&fromGroup=${body.fromGroup}&questionId=${body.questionId}`;
    return this.http.put<any>(url, {});
  }
  admitAssuranceList(body) {
    let url = `${environment.question_api_url}question/assurance/approve/list/admit?approvedBy=${body.approvedBy}&fromGroup=${body.fromGroup}&listId=${body.listId}`;
    return this.http.put<any>(url, {});
  }
  getAllPendingAssurance(body) {
    let url = `${environment.question_api_url}question/assurance/getAll/pendingAssurance?role=${body.role}&userId=${body.userId}`;
    return this.http.get<any>(url);
  }
  getAllPendingDraftAssurances(body) {
    let url = `${environment.question_api_url}question/assurance/getAll/pendingAssuranceList?role=${body.role}&userId=${body.userId}`;
    return this.http.get<any>(url);
  }
  getAllAssuranceList(assemblyId, sessionId, status) {
    let url = `${environment.question_api_url}question/assurance/getAllList?assemblyId=${assemblyId}&sessionId=${sessionId}&status=${status}`;
    return this.http.get<any>(url);
  }
  getassuredQuestions(assemblyId, sessionId, isAssured, status) {
    let body = {
      assemblyId: assemblyId,
      sessionId: sessionId,
      isAssured: isAssured,
      status: status,
    };
    return this.http.post(
      `${environment.question_api_url}question/assurance/assuredQuestions`,
      body
    );
  }
  createAssuranceList(body) {
    // tslint:disable-next-line: max-line-length
    let url = `${environment.question_api_url}question/assurance/createList?assemblyId=${body.assemblyId}&sessionId=${body.sessionId}`;
    return this.http.post<any>(url, body);
  }
  getDraftListById(listId) {
    let url = `${environment.question_api_url}question/assurance/getListById?listId=${listId}`;
    return this.http.get<any>(url);
  }

  postAssuranceNotes(body) {
    return this.http.post(
      `${environment.question_api_url}question/assurance/note/addNote`,
      body
    );
  }
  getAssuranceNotes(id, type) {
    return this.http.get(
      `${environment.question_api_url}question/assurance/note/getAll?id=${id}&type=${type}`
    );
  }
  getapprovedDraftList(assemblyId, sessionId) {
    let url = `${environment.question_api_url}question/assurance/approvedDraftAssuranceList?assemblyId=${assemblyId}&sessionId=${sessionId}`;
    return this.http.get<any>(url);
  }
  saveAssuranceOrder(body) {
    return this.http.put(
      `${environment.question_api_url}question/assurance/updateListById`,
      body
    );
  }
  // end API's for culling and assurance

  // question authorization
  authorizeQuestion(body) {
    let url = `${environment.question_api_url}question/permission/request/authorisation`;
    return this.http.post<any>(url, body);
  }
  getPendingAuthorizeList() {
    let url = `${environment.question_api_url}question/permission/request/authorisation/pending`;
    return this.http.get<any>(url);
  }
  ApproveAuthorization(requestId) {
    let url = `${environment.question_api_url}question/permission/approve/authorisation/${requestId}`;
    return this.http.post<any>(url, requestId);
  }
  // end question authorization
  // question clubbing API
  approveClubbingRequest(requestId) {
    return this.http.put(
      `${environment.question_api_url}question/clubbing/request/approve?requestId=` +
        requestId,
      requestId
    );
  }
  rejectClubbingRequest(requestId) {
    return this.http.put(
      `${environment.question_api_url}question/clubbing/request/reject?requestId=` +
        requestId,
      requestId
    );
  }
  getClubbingRequests() {
    return this.http.get(
      `${environment.question_api_url}question/clubbing/requests`
    );
  }
  createClubbingRequest(body) {
    let url = `${environment.question_api_url}question/clubbing/sendRequest`;
    return this.http.post<any>(url, body);
  }
  getClubbRequestById(requestId) {
    return this.http.get(
      `${environment.question_api_url}question/clubbing/request/${requestId}`
    );
  }
  approveQuestionClubbRequest(body) {
    let url = `${environment.question_api_url}question/clubbing/request/approve?requestId=${body.requestId}&note=${body.note}`;
    return this.http.put(url, body);
  }
  rejectQuestionClubbRequest(body) {
    let url = `${environment.question_api_url}question/clubbing/request/reject?requestId=${body.requestId}&note=${body.note}`;
    return this.http.put(url, body);
  }
  // end question clubbing API

  // assign unstarred booklet
  assignQuestionBooklet(body) {
    const url = environment.question_api_url + `QPBalloting/booklet/submit`;
    return this.http.put(url, body);
  }
  // get approved unstaared question dates
  getApprovedUnstarredQuestionDates(assemblyId, sessionId) {
    const url =
      environment.question_api_url +
      `QPBalloting/booklet/approved/dates?assemblyId=${assemblyId}&sessionId=${sessionId}`;
    return this.http.get<any>(url);
  }
  getUnstarredReport(questionDate, sessionId) {
    const url = `${environment.question_api_url}QPBalloting/unstarred/approvedBooklet?questionDate=${questionDate}&sessionId=${sessionId}`;
    return this.http.get<any>(url);
  }
  finaliseQuestionAnswer(questionId) {
    return this.http.put(
      `${environment.question_api_url}question/answer/finaliseQuestionAnswers/${questionId}`,
      questionId
    );
  }
  resetAnswer(answerId, questionId) {
    return this.http.put(
      `${environment.question_api_url}question/answer/resetAnswer/${answerId}?questionId=${questionId}`,
      questionId
    );
  }

  // start API process task actors
  getWorkflowTaskActors(pId, currntUsr) {
      let url = `${environment.question_wrkflw_api_url}process/getTaskActors?processInstanceId=${pId}`;
      return this.http.get(url).pipe(
        map((res) => {
          let result = this._applyFilter(res, currntUsr);
          return result;
        })
      );
  }

  getAllPublishedQuestions(body) {
    return this.http.get(
      `${environment.question_api_url}question/published?assemblyId=${body.assemblyId}&sessionId=${body.sessionId}`
    );
  }
  _applyFilter(QsRole, currntUsr) {
    let wrkflowObj = { roles: [], currentrole: {} };
    if (!QsRole) {
      return wrkflowObj;
    }
    if (this.IsQsOfficials(currntUsr)) {
      wrkflowObj.roles = this.mergeEqualObjects(QsRole);
      let roleName = currntUsr.authorities[0];
      if (currntUsr.authorities.indexOf("speaker") !== -1) {
        roleName = "speaker";
      }
      wrkflowObj.currentrole = QsRole.find(
        (element) => element.group === roleName
      );
      if (
        roleName === "jointSecretary" ||
        roleName === "specialSecretary" ||
        roleName === "additionalSecretary"
      ) {
        wrkflowObj.currentrole = wrkflowObj.roles.splice(4, 1)[0];
      }
      if (wrkflowObj.currentrole) {
        wrkflowObj.roles = wrkflowObj.roles.filter(
          (element) =>
            element.level >= wrkflowObj.currentrole["level"] - 2 &&
            element.level <= wrkflowObj.currentrole["level"] + 2 &&
            element.level !== wrkflowObj.currentrole["level"]
        );
      }
      return wrkflowObj;
    }
  }
  mergeEqualObjects(QsRole) {
    let newQsArr = [];
    if (QsRole) {
      QsRole.forEach(function (a) {
        if (!this[a.level]) {
          this[a.level] = {
            level: a.level,
            group: a.group,
            displayName: a.displayName,
          };
          newQsArr.push(this[a.level]);
        } else {
          this[a.level].displayName += "/ " + a.displayName;
        }
      }, Object.create(null));
    }
    return newQsArr;
  }
  IsQsOfficials(currntUsr) {
    if (currntUsr.authorities.indexOf("speaker") !== -1) {
      return true;
    }
    if (
      currntUsr.authorities.includes("MLA") ||
      currntUsr.authorities.includes("parliamentaryPartySecretary")
    ) {
      return false;
    }
    return true;
  }

  // end API process task actors

  getSecretary() {
    return this.http.get(`${environment.user_mgmnt_api_url}/v1/users/getSecretaryDetails`);
  }
  getBullettinList() {
    const url = environment.bulletin_api + '/list/published';
    return this.http.get(url);
  }
  downloadReport(htmlContent){
    const url = this.reportApiUrl + `/string-to-pdf`;
    return this.http.post(url, htmlContent, { responseType: "blob" }).pipe(
      map((res) => {
        return res;
      })
    );
  }
  rebuildAssemblyData(dto) {
    let assemblySession = { sessionByAssembly: [], assembly: [], session: [], activeAssemblySession:{} };
    if (dto) {
      assemblySession.activeAssemblySession = dto.activeAssemblySession;
      assemblySession.assembly = dto.assembly;
      assemblySession.assembly['currentassembly'] = parseInt(dto.activeAssemblySession.assemblyId);
      assemblySession.assembly['currentassemblyLabel'] = parseInt(dto.activeAssemblySession.assemblyValue);
      // assemblySession.session = this.findSessionListByAssembly(dto.activeAssemblySession.assemblyId, dto.assemblySession);
      assemblySession.session = dto.session;
      assemblySession.session['currentsession'] = parseInt(dto.activeAssemblySession.sessionId);
      assemblySession.session['currentsessionLabel'] = parseInt(dto.activeAssemblySession.sessionValue);
      assemblySession.sessionByAssembly = dto.assemblySession;
      console.log(assemblySession);
      return assemblySession;
    }
  }
  findSessionListByAssembly(currentassembly, assemblySession) {
    let session = assemblySession.find(
      (element) => element.id === currentassembly).session;
      return session;
  }
  filterAssemblyList(assemblyList, activeAssembly) {
    let list = [];
    assemblyList.forEach(a => {
      if(a.assemblyId >= activeAssembly) {
        list.push(a);
      }
    });
    return list;
  }
  filterSessionList(sessionList, activeSession) {
    let list = [];
    sessionList.forEach(s => {
      if(s.sessionId >= activeSession) {
        list.push(s);
      }
    });
    return list;
  }
}
