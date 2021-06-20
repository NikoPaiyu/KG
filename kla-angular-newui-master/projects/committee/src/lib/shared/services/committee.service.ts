import { Injectable, Inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ApiConfig } from "../config/api.config";
import { map } from "rxjs/operators";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

@Injectable({
  providedIn: "root",
})
export class CommitteeService {
  apiBaseURI: string;
  portfolioURI: string;
  environment: any;
  rbsJson = {
    modules: {},
  };
  constructor(
    @Inject("environment") environment,
    private http: HttpClient,
    @Inject("authService") private AuthService
  ) {
    this.environment = environment;
    this.apiBaseURI =
      this.environment.committee_api_url + ApiConfig.basePathExt;
    this.portfolioURI =
      this.environment.portfolio_mock_api_url + ApiConfig.portfolio;
  }

  createFile(body) {
    return this.http.post(this.apiBaseURI + `/create/details`, body);
  }
  CreateNomineeRequest(body) {
    const url = this.apiBaseURI + `/nominee`;
    return this.http.post(url, body);
  }
  agendaType() {
    return this.http.get<any>(`${this.apiBaseURI}/agendaType`);
  }
  venueType() {
    return this.http.get<any>(`${this.apiBaseURI}/venue`);
  }
  getAllBills(body) {
    return this.http
      .post(
        `${this.environment.bill_api_url}:8044/kla/service/v1/bill/all`,
        body
      )
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  committeeList() {
    const body = {
      assemblyId: 1,
      categoryId: 1,
      isActive: true,
      status: "APPROVED",
      subjectId: null,
    };
    return this.http.put<any>(`${this.apiBaseURI}/list`, body);
  }

  getcommitteeListBySectionId(sectionId) {
    const url =
      this.apiBaseURI + `/list/getCommitteeBySection?sectionId=${sectionId}`;
    return this.http.post(url, sectionId);
  }
  getcommitteeList(body) {
    const url = this.apiBaseURI + `/get/details`;
    return this.http.post(url, body);
  }
  getCategoryBySectionId(sectionId) {
    const url = this.apiBaseURI + `/category/section/${sectionId}`;
    return this.http.get(url);
  }
  CreateMeeting(body) {
    const url = this.apiBaseURI + ApiConfig.meeting.createMeeting;
    return this.http.post(url, body);
  }
  getCommitteeById(id) {
    const url = this.apiBaseURI + `/${id}`;
    return this.http.get(url);
  }
  saveCommitte(body) {
    const url = this.apiBaseURI + `/create/committees`;
    return this.http.put(url, body);
  }
  getAllRolesList() {
    const url = this.apiBaseURI + `/roles`;
    return this.http.get(url);
  }

  getMeetingById(id) {
    const url = this.apiBaseURI + ApiConfig.meeting.createMeeting + "/" + id;
    return this.http.get(url);
  }

  getCurrentAssemblyAndSession() {
    return this.http.get(
      `${this.environment.calendar_api_url}/getActiveSession`
    );
  }

  saveMinutes(body) {
    const url = this.apiBaseURI + ApiConfig.meeting.createMinutes;
    return this.http.post(url, body);
  }

  getMinutesByMeetingId(id) {
    const url = this.apiBaseURI + ApiConfig.meeting.getMinutesByMeetId;
    return this.http.get(url + `/${id}`);
  }

  saveStaffAlloctaion(reqBody) {
    const url = this.apiBaseURI + `/meeting/staffAllocation`;
    return this.http.put(url, reqBody);
  }
  getSpecialInvittebyMeetingId(meetingId) {
    const url =
      this.apiBaseURI + `/meeting/specialInvite/getByMeetingId/${meetingId}`;
    return this.http.get(url);
  }
  saveSpecialInvitee(reqBody) {
    const url = this.apiBaseURI + `/meeting/specialInvite`;
    return this.http.post(url, reqBody);
  }

  getAttendees(meetingId) {
    const url = this.apiBaseURI + ApiConfig.meeting.getAttendees;
    return this.http.get(url + `/${meetingId}`);
  }

  createQuestionnaire(body) {
    const url = this.apiBaseURI + `/meeting/questionnaire`;
    return this.http.post(url, body);
  }

  getQuestionnaireById(id) {
    const url = this.apiBaseURI + `/meeting/questionnaire`;
    return this.http.get(url + `/${id}`);
  }

  getQuestionnaireList() {
    const url = this.apiBaseURI + `/meeting/questionnaire/list`;
    return this.http.get(url);
  }
  createMeetingNotice(body) {
    const url = this.apiBaseURI + ApiConfig.meeting.createMeeting + `/notice`;
    return this.http.post(url, body);
  }
  createMeetingLetter(body) {
    const url = this.apiBaseURI + ApiConfig.meeting.createMeeting + `/letter`;
    return this.http.post(url, body);
  }
  getCodesOfMeetingNoticeRecepients(meetingId, committeeId) {
    const url =
      this.apiBaseURI +
      ApiConfig.meeting.createMeeting +
      `/notice/getMemberCode?committeeId=${committeeId}&meetingId=${meetingId}`;
    return this.http.get(url);
  }
  getCodesOfMeetingLetterRecepients(meetingId) {
    const url =
      this.apiBaseURI +
      ApiConfig.meeting.createMeeting +
      `/letter/getMemberCode?meetingId=${meetingId}`;
    return this.http.get(url);
  }
  createSupportingDoc(body) {
    const url =
      this.apiBaseURI +
      ApiConfig.meeting.createMeeting +
      `/supporting/document/letter`;
    return this.http.post(url, body);
  }

  createDissentNote(body) {
    const url = this.apiBaseURI + `/meeting/report/dissentNote`;
    return this.http.post(url, body);
  }

  getAssisstantList(body) {
    // return this.http.post(`${this.environment.user_mgmnt_api_url}/rbs/getUsersWithSectionRoles`, body);
    return this.http.post(
      `${this.environment.user_mgmnt_api_url}/v1/users/member/getNonMembers`,
      body
    );
  }

  assignToAssistant(body, userId) {
    return this.http.post(
      this.apiBaseURI + `/meeting/assignBusinessToAssitant?userId=${userId}`,
      body
    );
  }

  getAllBusiness(body) {
    const url = this.apiBaseURI + ApiConfig.meeting.getAllBusiness;
    return this.http.post(url, body);
  }

  dissolve_committee(committeeDeatilId) {
    const url =
      this.apiBaseURI +
      `/create/details?committeeDeatilId=${committeeDeatilId}`;
    return this.http.delete(url);
  }
  getCommiteeMembersBySubagendaId(id) {
    const url = this.apiBaseURI + `/meeting/report/getMemberList/${id}`;
    return this.http.get(url);
  }
  generateCommiteeMeetingReport(body) {
    const url = this.apiBaseURI + `/meeting/report`;
    return this.http.post(url, body);
  }
  getMeetingReportPreview(id) {
    const url = this.apiBaseURI + `/meeting/report/preview/${id}`;
    return this.http.get(url, { responseType: "text" });
  }
  generateMeetingReport(id) {
    const url = this.apiBaseURI + `/meeting/report/generate/${id}`;
    return this.http.put(url, id);
  }
  getAllApprovedReports(body) {
    const url = this.apiBaseURI + `/meeting/report/list/approved`;
    return this.http.get(url);
  }
  sentReporttoLegislation(id) {
    const url = this.apiBaseURI + `/meeting/report/sendToBill/${id}`;
    return this.http.put(url, id);
  }
  updateMeeting(body) {
    const url = this.apiBaseURI + `/meeting/update`;
    return this.http.post(url, body);
  }

  markBusiness(body) {
    const url = this.apiBaseURI + `/meeting/markBusinessStatus`;
    return this.http.post(url, body);
  }
  getReportDtoBySubagendaId(id) {
    const url = this.apiBaseURI + `/meeting/report/getBySubagenda/${id}`;
    return this.http.get(url);
  }
  getSpecialMemberInMeeting(id) {
    const url =
      this.apiBaseURI + `/meeting/consent/${id}/getSepcialMemberInMeeting`;
    return this.http.get(url);
  }

  requestConsent(id, body) {
    const url = this.apiBaseURI + `/meeting/consent/${id}/requestConsent`;
    return this.http.post(url, body);
  }
  giveConsent(id, body) {
    const url = this.apiBaseURI + `/meeting/consent/${id}/giveConsent`;
    return this.http.put(url, body);
  }
  getMeetingByNoticeId(noticeId) {
    const url =
      this.apiBaseURI + `/meeting/myMeeting/byNotice?noticeId=${noticeId}`;
    return this.http.get(url);
  }
  approveMeeting(body, noticeId) {
    const url =
      this.apiBaseURI + `/meeting/notice/approve?noticeId=${noticeId}`;
    return this.http.put(url, body);
  }

  populateMembersInMeeting(meetId) {
    const url =
      this.apiBaseURI +
      `/meeting/${meetId}` +
      ApiConfig.meeting.populateMembers;
    return this.http.get(url);
  }

  markAttendence(body, meetingId) {
    const url = this.apiBaseURI + `/meeting/${meetingId}/attendence`;
    return this.http.post(url, body);
  }

  getAttendence(meetingId) {
    const url = this.apiBaseURI + `/meeting/${meetingId}/attendence`;
    return this.http.get(url);
  }

  populateMinuteData(meetingId) {
    const url = this.apiBaseURI + `/meeting/minutes/populate/${meetingId}`;
    return this.http.get(url);
  }
  uploadUrl() {
    return "http://45.249.111.246" + ApiConfig.uploadFile;
  }

  createMinisterReading(body) {
    const url = this.apiBaseURI + `/meeting/ministerReading`;
    return this.http.post(url, body);
  }

  getMinisterReadingById(id) {
    const url = this.apiBaseURI + `/meeting/ministerReading/${id}`;
    return this.http.get(url);
  }
  getAllSectionInvolved(id) {
    const url = this.apiBaseURI + `/meeting/${id}/getSectionInvolved`;
    return this.http.get(url);
  }
}
