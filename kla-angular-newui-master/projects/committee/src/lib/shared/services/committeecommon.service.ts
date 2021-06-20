import { Injectable, Inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ApiConfig } from "../config/api.config";
import { map } from "rxjs/operators";
@Injectable({
  providedIn: "root",
})
export class CommitteecommonService {
  apiBaseURI: string;
  portfolioURI: string;
  environment: any;
  apiBaseURICorrespondence;
  billApiUrl;
  reportApiUrl;
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
    this.apiBaseURICorrespondence =
      this.environment.cpl_api_url + ApiConfig.basePathCorrespondence;
    this.billApiUrl = this.environment.bill_api_url + ApiConfig.billApiUrl;
    this.reportApiUrl = this.environment.report_api_url;
  }

  getAllAssembly() {
    return this.http.get<any>(
      `${this.environment.calendar_api_url}/mock/getAllAssembly`
    );
  }

  getAllSession() {
    return this.http.get<any>(
      `${this.environment.calendar_api_url}/mock/getAllSession`
    );
  }
  getCurrentAssemblyAndSession() {
    return this.http.get(
      `${this.environment.calendar_api_url}/getActiveSession`
    );
  }
  getAllAssemblyandSession() {
    return this.http.get(
      `${this.environment.calendar_api_url}/getAllAssemblyAndSession`
    );
  }
  getCommitteeCategories() {
    return this.http.get(this.apiBaseURI + `/category`);
  }
  getCategoryBySectionId(sectionId) {
    const url = this.apiBaseURI + `/category/section/${sectionId}`;
    return this.http.get(url);
  }
  uploadUrl() {
    return "http://45.249.111.246" + ApiConfig.uploadFile;
  }
  // RBS  functions

  setCommitteePermissions(permission) {
    if (permission) {
      this.rbsJson = permission;
    }
  }
  doIHaveAnAccess(pCategory, permission) {
    let permObj;
    // tslint:disable-next-line:no-string-literal
    permObj = this.rbsJson["COMMITTEE_MANAGEMENT"];
    if (permObj) {
      if (permObj.categorys) {
        const permCategorys = permObj.categorys;
        if (permCategorys[pCategory]) {
          const permCat = permCategorys[pCategory];
          return permCat.includes(permission);
        }
      }
    }
    return false;
  }

  doIHaveAnAccessWithCategory(pCategory, permission, category) {
    let permObj;
    // tslint:disable-next-line:no-string-literal
    permObj = this.rbsJson[category];
    if (permObj) {
      if (permObj.categorys) {
        const permCategorys = permObj.categorys;
        if (permCategorys[pCategory]) {
          const permCat = permCategorys[pCategory];
          return permCat.includes(permission);
        }
      }
    }
    return false;
  }
  isMLA() {
    return this.AuthService.getCurrentUser().authorities.includes("MLA");
  }

  isPPO() {
    return (
      this.AuthService.getCurrentUser().authorities.includes("ppo") ||
      this.AuthService.getCurrentUser().authorities.includes(
        "parliamentaryPartySecretary"
      )
    );
  }
  getCorrespondenceById(id, code) {
    return this.http.get(this.apiBaseURICorrespondence + `/${id}?code=${code}`);
  }
  getAllCode(type) {
    return this.http.get(
      this.apiBaseURICorrespondence +
        ApiConfig.correspondenceTemplate.getAllCode +
        `?type=${type}`
    );
  }
  getAllMeetingList() {
    return this.http.get(this.apiBaseURI + `/meeting/list`);
  }
  getAllMembersList() {
    const url = this.environment.user_mgmnt_api_url + `/v1/users/member/getAll`;
    return this.http.get(url);
  }
  getAllExcludingMinisters() {
    const url =
      this.environment.user_mgmnt_api_url +
      `/v1/users/member/getAllExcludingMinisters`;
    return this.http.get(url);
  }
  getAllMinistersList() {
    // const url = this.environment.user_mgmnt_api_url + `/v1/users/member/getByMemberGroup?klaMemberGroup=TREASURY_BENCH`;
    const url = this.apiBaseURI + `/getAllMinister`;
    return this.http.get(url);
  }
  getAllUserListOfStaff(roleName) {
    return this.http.get(
      this.apiBaseURI + `/meeting/staffAllocation/userList/${roleName}`
    );
  }
  getBillByBillId(billId) {
    const url = this.billApiUrl + `/${billId}`;
    return this.http.get(url);
  }
  getBillByBillIdwithAmend(billId) {
    const url = this.billApiUrl + `/getById/${billId}`;
    return this.http.get(url);
  }
  getClauseNoticesListByBillId(body) {
    const url = this.billApiUrl + `/clause/getByBillId`;
    return this.http.post(url, body);
  }
  getAmendmentsOfBillByMember(billId) {
    const url =
      this.billApiUrl + `/clause/amedment/suggestion?billId=${billId}`;
    return this.http.get(url);
  }
  getAmendmentsOfBillByMemberId(billId, memberId) {
    const url =
      this.billApiUrl +
      `/clause/getByMemberId?memberId=${memberId}&billId=${billId}`;
    return this.http.get(url);
  }
  submitClauseByClauseAmendments(amendment) {
    const url = this.billApiUrl + `/clause`;
    return this.http.post(url, amendment);
  }
  submitAmendments(body) {
    const url = this.billApiUrl + `/clause/submitToSO`;
    return this.http.post(url, body);
  }
  updateAmendmentStatus(billId, body) {
    const url =
      this.billApiUrl + `/clause/amendment/section/update?billId=${billId}`;
    return this.http.put(url, body);
  }
  deleteAmendments(amendmentId) {
    const url =
      this.billApiUrl + `/clause/deleteByClauseId?clauseId=${amendmentId}`;
    return this.http.delete(url);
  }
  applyAmendment(clauseId) {
    const url =
      this.billApiUrl + `/clause/applyClauseAfterSabha?clauseId=${clauseId}`;
    return this.http.get(url);
  }
  getMemberByPpo(userId) {
    const url = `${this.environment.user_mgmnt_api_url}/v1/users/member/getAllMemberForAParty?userId=${userId}`;
    return this.http.get(url);
  }
  getApprovedBillList() {
    const url = this.billApiUrl + `/act/getAll`;
    return this.http.get(url);
  }
  getSubBlockByBlockId(blockId) {
    const url = this.billApiUrl + `/block/getSubBlockById?blockId=${blockId}`;
    return this.http.get(url);
  }
  getAllConsentList() {
    const url = this.apiBaseURI + `/meeting/consent/getAllRequestedConsents`;
    return this.http.get(url);
  }
  getPendingMeetingNoticeList(body) {
    const url = this.apiBaseURI + `/meeting/notice/getPendingNotice`;
    return this.http.post(url, body);
  }
  getMyMeetingList() {
    const url = this.apiBaseURI + `/meeting/myMeeting`;
    return this.http.get(url);
  }
  downloadReport(htmlContent) {
    const url = this.reportApiUrl + `/string-to-pdf`;
    return this.http.post(url, htmlContent, { responseType: "blob" }).pipe(
      map((res) => {
        return res;
      })
    );
  }
  getUnclaimedBills(body) {
    const url = this.billApiUrl + `/getUnClaimedBillForCommittee`;
    return this.http.put(url, body);
  }
  getSubjectCommitteeList(body) {
    const url = this.apiBaseURI + `/list`;
    return this.http.put(url, body);
  }
  claimToCommittee(billId, body) {
    const url = this.billApiUrl + `/${billId}/claimToCommittee`;
    return this.http.put(url, body);
  }
  getcommitteeListBySectionId(sectionId) {
    const url =
      this.apiBaseURI + `/list/getCommitteeBySection?sectionId=${sectionId}`;
    return this.http.post(url, sectionId);
  }
  getSubjectByCategoryId(categoryId) {
    return this.http.get(this.apiBaseURI + `/category/${categoryId}`);
  }
  getAllSections() {
    return this.http.get<any>(
      this.environment.departmentmangement_api_url + "/getsection"
    );
  }
  getDesignation() {
    return this.http.get<any>(
      this.environment.departmentmangement_api_url + "/getdesignation"
    );
  }
  getAllNonMemberUsers(data) {
    return this.http.post<any>(
      this.environment.generic_file_api_urlx + "/users/member/getNonMembers",
      data
    );
  }
}
