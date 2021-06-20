import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConfig } from '../config/api.config';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class PmbrCommonService {
  environment: any;
  apiBaseURI: string;
  apiBaseURI1: string;
  apiBaseURI2: string;
  apiBaseURICorrespondence: string;
  rbsJson: any = null;
  portfolioURI: string;

  constructor(@Inject("environment") environment, private http: HttpClient) {
    this.environment = environment;
    this.apiBaseURI = this.environment.pmbr_api_url + ApiConfig.pmbrBasePathExt;
    this.apiBaseURI1 = this.environment.pmbr_api_url + ApiConfig.billBasePathExt;
    this.apiBaseURICorrespondence = this.environment.pmbr_api_url + ApiConfig.basePathCorrespondence;
    this.apiBaseURI2 = this.environment.bill_api_url + ApiConfig.basePathCreateFile;
    this.portfolioURI = this.environment.portfolio_mock_api_url;
  }

  getAllAssembly() {
    return this.http.get<any>(
      `${this.environment.calendar_api_url}/mock/getAllAssembly`
    );
  }
  getAllAssemblyAndSession() {
    return this.http.get<any>(
      `${this.environment.calendar_api_url}/getAllAssemblyAndSession`
    );
  }
  getAllSession() {
    return this.http.get<any>(
      `${this.environment.calendar_api_url}/mock/getAllSession`
    );
  }
  getCurrentAssemblyAndSession() {
    return this.http.get(`${this.environment.calendar_api_url}/getActiveSession`);
  }
  getMembers(body) {
    return this.http.get(this.apiBaseURI + `/schedule/lotting/members?presentationDate=${body.presentationDate}`);
  }
  getPerformList(body) {
    return this.http.get(this.apiBaseURI + `/schedule/lotting/performLotting?presentationDate=${body.presentationDate}`);
  }
  confirmBallot(body) {
    return this.http.post(this.apiBaseURI + `/schedule/lotting/confirm`, body);
  }

  setPermissions(permission) {
    if (permission) {
      this.rbsJson = permission;
    }
  }
  doIHaveAnAccess(pCategory, permission) {
    let permObj;
    // tslint:disable-next-line:no-string-literal
    if (this.rbsJson) {
      permObj = this.rbsJson['PMBR'];
    }
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
  getBillsList(body) {
    return this.http.post(this.apiBaseURI + `/bill/list`, body);
  }
  getSubmittedBills() {
    return this.http.get(this.apiBaseURI + `/bill/submittedBills`);
  }
  soAssigntoAssistant(body) {
    return this.http.post(this.apiBaseURI + `/bill/assignToAssistant`, body);
  }
  getAssignedbills() {
    return this.http.get(this.apiBaseURI + `/bill/listAssignedBills`);
  }
  getBillForAction(body) {
    return this.http.get(this.apiBaseURI + `/bill/listBillForAction/${body.id}`);
  }
  getBillsProcessedByAssistant(body) {
    return this.http.get(this.apiBaseURI + `/bill/listAssistantProcessed/${body.id}`);
  }
  getAssisstantList(body) {
    return this.http.post(`${this.environment.user_mgmnt_api_url}/rbs/getUsersWithSectionRoles`, body);
  }
  // createFile(body){
  //   return this.http.post(this.pmbrApiBaseURI + ApiConfig.pmbrBill.createFile, body);
  // }

  getBillsForVetting() {
    return this.http.get(this.apiBaseURI + `/bill/getBillsForVetting`);
  }
  sendFileLawDep(body) {
    return this.http.post(this.apiBaseURI + `/bill/sendForVetting/${body.billId}`, null);
  }
  completevetting(billId) {
    return this.http.post(this.apiBaseURI + `/bill/completeVetting/${billId}`, null);
  }
  completedVettingBills() {
    return this.http.get(this.apiBaseURI + `/bill/getBillsCompletedVetting`);
  }
  attachToFile(body) {
    return this.http.post(this.apiBaseURI1 + `/file/resubmitFile`, body);
  }

  addBillRegister(body) {
    return this.http.put(this.apiBaseURI + `/bill/register?billId=${body.billId}`, null);
  }
  registeredBills() {
    return this.http.get(this.apiBaseURI + `/bill/register/all`);
  }
  presentationDates(body) {
    return this.http.post(this.apiBaseURI + `/schedule/lotting/getPresentationDate`, body);
  }
  getregisteredBillById(body) {
    return this.http.get(this.apiBaseURI + `/bill/getRegistered?billId=${body.billId}`);
  }
  getBallotList() {
    return this.http.get(this.apiBaseURI + `/schedule/lotting/ballotListForDepartment`);
  }

  getBallotListforSection(body) {
    return this.http.get(this.apiBaseURI + `/schedule/lotting/ballotResultBySeesion?assemblyId=${body.assemblyId}&sessionId=${body.sessionId}`);
  }
  publishBulletin(bulletinId) {
    const url = this.apiBaseURI2 + `/bulletin/${bulletinId}/publish`
    return this.http.put(url, {});
  }

  getBallotResultById(body) {
    return this.http.get(this.apiBaseURI + `/schedule/lotting/ballotResultById?id=${body.id}`);
  }
  sendBallotDepartment(body) {
    return this.http.put(this.apiBaseURI + `/schedule/lotting/sendToDepartment?lottingResultId=${body.id}`, null);
  }
  getSpeakerNoteList() {
    return this.http.get(this.apiBaseURI + `/speakerNote/all`);
  }
  speakerNote(body) {
    return this.http.post(this.apiBaseURI + `/speakerNote`, body);
  }
  getSpeakerNoteById(id) {
    return this.http.get(this.apiBaseURI + `/speakerNote/${id}`);
  }
  attachFile(body) {
    return this.http.post(this.apiBaseURI1 + `/file/addSubType`, body);
  }
  resubmitOrAttachFile(body) {
    return this.http.post(this.apiBaseURI1 + `/file/resubmitOrAddSubType`, body);
  }
  getMemberReadingList() {
    return this.http.get(this.apiBaseURI + `/memberReading/all`);
  }
  getMemberReadingById(id) {
    return this.http.get(this.apiBaseURI + `/memberReading/${id}`);
  }
  getRejectedBillList() {
    return this.http.get(this.apiBaseURI + `/bill/rejectedBills`);
  }
  getBillOwnerById(billId) {
    return this.http.get(this.apiBaseURI + `/bill/getBillOwnerByBillId?billId=${billId}`)
  }
  getWonMembers(id) {
    return this.http.get(this.apiBaseURI + `/bill/getWonMembers?lottingResultId=${id}`)
  }
  getCorrespondenceById(id, code) {
    return this.http.get(
      this.apiBaseURICorrespondence + `/${id}?code=${code}`
    );
  }

  getBallotListforMembers(assemblyId, sessionId) {
    const url = this.apiBaseURI + ApiConfig.ballot.getListforMembers + `?assemblyId=${assemblyId}&sessionId=${sessionId}`;
    return this.http.get(url);
  }
  getMembersforResolution(body) {
    return this.http.get(this.apiBaseURI + `/schedule/lotting/resolution/members?presentationDate=${body.presentationDate}`);
  }
  getPerformListForResolution(body) {
    return this.http.get(this.apiBaseURI + `/schedule/lotting/resolution/performLotting?presentationDate=${body.presentationDate}`);
  }

  getBillListToChoose(body) {
    const url = this.apiBaseURI + ApiConfig.ballot.getListOfBillsMembers;
    return this.http.post(url, body);
  }

  updateBallotResult(body) {
    const url = this.apiBaseURI + ApiConfig.ballot.updateBallotResult;
    return this.http.post(url, body);
  }
  getAllMembersList() {
    return this.http.get(
      `${this.environment.user_mgmnt_api_url}/v1/users/member/getAll`
    );
  }
  getMemberListByPPO(ppoId) {
    //ppo APi need to change here.
    // const url = this.environment.user_mgmnt_api_url + `/v1/users/member/getAllWithEnhancedDetails`;
    const url = this.environment.user_mgmnt_api_url + `/v1/users/member/getAllMemberForAParty?userId=${ppoId}`;

    return this.http
      .get(url)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  getMinisterList() {
    return this.http.get(this.portfolioURI + 'mock/portfolio/getAllWithMinisterName');
  }

  getDepartmentList(portfolioId) {
    return this.http.get(this.portfolioURI + `mock/subject/getDepartmentsByPortfolioId?portfolioId=${portfolioId}`);
  }

  getSubjectList(deptId) {
    return this.http.get(this.portfolioURI + `mock/subject/getAllSubjectByDepartmentId?departmentId=${deptId}`);
  }
  getAllBillList() {
    return this.http.get(this.apiBaseURI + `/bill/getBillsForSession`);
  }
  getMemberBillList() {
    return this.http.get(this.apiBaseURI + `/bill/getMemberBills`);
  }
  getMemberDesignation() {
    return this.http.get(this.portfolioURI + 'mock/portfolio/getAll');
  }
  getBillDepartmentCode(billId) {
    return this.http.get(this.apiBaseURI + ApiConfig.pmbrBill.getDepartmentCode + `?billId=${billId}`);
  }

  generateSpeakerNote(body) {
    return this.http.post(this.apiBaseURI + ApiConfig.resolution.speakerNote, body);
  }

  generateMemberReading(id, flow) {
    return this.http.get(this.apiBaseURI + ApiConfig.resolution.memberReading + `/${id}`+ `/${flow}`);
  }
  viewMemberReading(memberReadingId) {
    return this.http.get(this.apiBaseURI + ApiConfig.resolution.viewMemberReading + `/${memberReadingId}`);
  }
  getWonMembersResolution(id,type) {
    return this.http.get(this.apiBaseURI + ApiConfig.ballot.getWonMembers +`?lottingResultId=${id}&ballotType=${type}`)
  }
  addResolutionToLob(id) {
    return this.http.get(this.apiBaseURI + ApiConfig.resolution.addToLob + `/${id}`);
  }
  getPmbrSpeakerNote(id) {
    return this.http.get(this.apiBaseURI + ApiConfig.resolution.speakerNoteById + `/${id}` )
  }
  addResolutionToLobFinal(speakerNoteId, resolutionId, date) {
    return this.http.get(this.apiBaseURI + ApiConfig.resolution.uploadToLobFinal + `/?date=${date}&resolutionId=${resolutionId}&speakerNoteId=${speakerNoteId}`);
  }
  getResolutionDepartmentCode(resolutionId) {
    return this.http.get(this.apiBaseURI + ApiConfig.resolutionList.getStakeHolderToCode + `/${resolutionId}`)
  }
}
