import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConfig } from '../../../shared/config/api.config';

@Injectable({
  providedIn: 'root',
})
export class BillManagementService {
  apiBaseURI: string;
  portfolioURI: string;
  environment: any;
  constructor(@Inject('environment') environment, private http: HttpClient) {
    this.environment = environment;
    this.apiBaseURI = this.environment.bill_api_url + ApiConfig.pmbrBasePathExt;
    this.portfolioURI =
      this.environment.portfolio_mock_api_url + ApiConfig.portfolio;
  }
  uploadUrl() {
    return 'http://45.249.111.246' + ApiConfig.uploadFile;
  }
  // start bill list services
  getAllBills(filterbody) {
    return this.http.post(this.apiBaseURI + `/all`, filterbody);
  }
  getAllRegisterBills(filterbody) {
    return this.http.post(this.apiBaseURI + `/register/all`, filterbody);
  }
  getBillsForAction(filterbody) {
    return this.http.put(this.apiBaseURI + `/getList`, filterbody);
  }
  assignToAssistant(body) {
    return this.http.post(this.apiBaseURI + `/assignToAssistant`, body);
  }
  // end bill list services
  // start errata services
  addErrata(body) {
    return this.http.post(this.apiBaseURI + `/errata`, body);
  }
  getAllErrata() {
    return this.http.get(this.apiBaseURI + `/errata/all`);
  }
  getErrataForAction(body) {
    return this.http.post(this.apiBaseURI + `/errata/errataByUser`, body);
  }
  sentErrataToApprover(errataId) {
    return this.http.post(
      this.apiBaseURI + `/errata/sendToApprover/${errataId}`,
      errataId
    );
  }
  sentErrataToSection(errataId) {
    return this.http.post(
      this.apiBaseURI + `/errata/sendToSection/${errataId}`,
      errataId
    );
  }
  assignErratatoAssistant(body) {
    return this.http.post(this.apiBaseURI + `/errata/assignToAssistant`, body);
  }
  attachErrataToFile(body) {
    return this.http.post(this.apiBaseURI + `/file/resubmitFile`, body);
  }
  closeErrata(errataId) {
    return this.http.post(
      this.apiBaseURI + `/errata/closeErrata/${errataId}`,
      errataId
    );
  }
  //balloting file
  attachBallotingToFile(body) {
    return this.http.post(this.apiBaseURI + `/file/resubmitFile`, body);
  }
  // end  errata services
  //start create bill services
  getBillByBillId(billId) {
    const url = this.apiBaseURI + `/${billId}`;
    return this.http.get(url);
  }
  // 
  getBillByBillIdwithAmend(billId) {
    const url = this.apiBaseURI + `/resolution/${billId}`;
    return this.http.get(url);
  }
  getBillById(billId) {
    const url = this.apiBaseURI + `/${billId}/register`;
    return this.http.get(url);
  }
  createBillBlocks(body) {
    const url = this.apiBaseURI + `/block`;
    return this.http.post(url, body);
  }
  updateBillBlocks(body) {
    const url = this.apiBaseURI + `/block`;
    return this.http.put(url, body);
  }
  removeBlock(blockId) {
    const url = this.apiBaseURI + `/block/deleteById?id=${blockId}`;
    return this.http.delete(url);
  }
  submitBill(body) {
    const url = this.apiBaseURI + `/submit`;
    return this.http.post(url, body);
  }
  approveAndSendBill(body) {
    const url = this.apiBaseURI + `/sendToSection`;
    return this.http.post(url, body);
  }
  submitByAssistant(body) {
    const url = this.apiBaseURI + `/submittedByAssistant`;
    return this.http.post(url, body);
  }
  getBillTypes() {
    return this.http.get(``);
  }

  getBillReferences() {
    return this.http.get(``);
  }

  getBillLanguages() {
    return this.http.get(``);
  }
  getDepartments() {
    return this.http.get(``);
  }

  getMinisters() {
    return this.http.get(``);
  }
  saveBill(data) {
    return this.http.post(``, data);
  }

  createFile(body) {
    return this.http.post(this.apiBaseURI + ApiConfig.pmbrBill.createFile, body);
  }
  // end create bill services

  // send minister
  createMinisterMotion(body) {
    const url = this.apiBaseURI + '/ministerMotion';
    return this.http.post(url, body);
  }
  processMotionTemplate(BillDetails) {
    // tslint:disable-next-line: max-line-length
    const committie = {
      SUBJECT_COMMITTEE: 'സബ്ജക്ട്',
      SELECT_COMMITTEE: 'സെലക്ട്',
    };
    let template = `<p>സർ,</p><p><br></p><p>വിഷയം: [BillTitles]</p><p>എന്നിവയുടെ അവതരണത്തിനുശേഷമുള്ള പ്രമേയം സംബന്ധിച്ചു</p><p><br></p><p><br></p><p>[BillTitles] എന്നിവ നിയമസഭയിൽ അവതരിപ്പിച്ച ശേഷം ആയവ ബന്ധപ്പെട്ട [Commitie] കമ്മിറ്റിയുടെ പരിഗണയ്ക് വിടണമെന്ന പ്രമേയം അവതരിപ്പിക്കുവാൻ പ്രസ്തുത ബില്ലുകളുടെ ചുമതല വഹിക്കുന്ന ബഹുഃ [Minister] എന്ന വിവരം അറിയിച്ചുകൊള്ളുന്നു.</p>`;
    template = template
      .split('[BillTitles]')
      .join(BillDetails.titles.join(','));
    if (BillDetails.minister) {
      template = template.replace('[Minister]', BillDetails.minister);
    } else {
      template = template.replace('[Minister]', BillDetails.minister);
    }
    template = template.replace('[Commitie]', committie[BillDetails.committie]);
    return template;
  }
  submitGeneralAmendment(body) {
    const url = this.apiBaseURI + '/amendment';
    return this.http.post(url, body);
  }

  getGeneralAmendmentList() {
    const url = this.apiBaseURI + '/amendment/report';
    return this.http.get(url);
  }

  getAmendmentListByBillId(billId) {
    const url = this.apiBaseURI + `/amendment/getByBill/${billId}`;
    return this.http.get(url);
  }
  addToRegister(body) {
    console.log('body', body);
    const url = this.apiBaseURI + `/${body.billId}/register`;
    return this.http.post(url, body);
  }
  getOrdDisApprovalList() {
    const url = this.apiBaseURI + `/ordinanceDisapproval/report/user`;
    return this.http.get(url);
  }
  getObjToIntroductionList() {
    const url = this.apiBaseURI + `/objection/introduction/report/user`;
    return this.http.get(url);
  }
  getGenAmendmentList() {
    const url = this.apiBaseURI + `/amendment/report/user`;
    return this.http.get(url);
  }

  getAllBillsNotAddedInPriorityList() {
    return this.http.get(
      this.apiBaseURI + `/priorityList/list/unAssigned/bills`
    );
  }
  getClauseByClauseList() {
    const url = this.apiBaseURI + `/clause/getAllBillByFilterForMember`;
    return this.http.get(url);
  }
  getdataList(body) {
    console.log(body);
    const url = this.apiBaseURI + `/ballot/getListByNoticeType`;
    return this.http.post(url, body);
  }
  getSecondList(body) {
    const url = this.apiBaseURI + `/ballot/getListByNoticeType`;
    return this.http.post(url, body);
  }
  getThirdList(body) {
    const url = this.apiBaseURI + `/clause/list/all`;
    return this.http.post(url, body); 
  }
  getBallotList(body) {
    const url = this.apiBaseURI + `/ballot/getListByNoticeType`;
    return this.http.post(url, body);
  }
  getListByBallotId(id) {
    const url = this.apiBaseURI + `/ballot/getById/${id}`;
    return this.http.get(url);
  }
  getClauseListByListId(listId) {
    console.log(listId);
    const url = this.apiBaseURI + `/clause/list?listId=${listId}`;
    return this.http.get(url);
  }
  getApprovedBillList() {
    const url = this.apiBaseURI + `/act/getAll`;
    return this.http.get(url);
  }
  getSubBlockByBlockId(blockId) {
    const url = this.apiBaseURI + `/block/getSubBlockById?blockId=${blockId}`;
    return this.http.get(url);
  }
  getAllMembersList() {
    return this.http.get(
      `${this.environment.user_mgmnt_api_url}/v1/users/member/getAll`
    );
  }
  getMemberByPpo(userId) {
    const url = `${this.environment.user_mgmnt_api_url}/v1/users/member/getAllMemberForAParty?userId=${userId}`;
    return this.http.get(url);
  }
  getBillVersionDetails(versionNo, billId) {
    const url = this.apiBaseURI + `/getByVersionIdAndBillId?billId=${billId}&version=${versionNo}`;
    return this.http.get(url);
  }
  getBillsReadyForFirstReading() {
    const url = this.apiBaseURI + `/getBillsReadyForFirstReading`;
    return this.http.get(url);
  }
  setBillToLOB(billId) {
    const url = this.apiBaseURI + `/uploadToLob?billId=${billId}`;
    return this.http.get(url);
  }
  sentBillForVetting(billId) {
    const url = this.apiBaseURI + `/sendForVetting/${billId}`;
    return this.http.post(url, {});
  }
  getBillsSignManualList() {
    const url = this.apiBaseURI + `/getBillsSignManualList`;
    return this.http.get(url);
  }
  getBillsForVetting() {
    const url = this.apiBaseURI + `/getBillsForVetting`;
    return this.http.get(url);
  }
  getBillsCompletedVetting() {
    const url = this.apiBaseURI + `/getBillsCompletedVetting`;
    return this.http.get(url);
  }
  finalizeVetting(billId) {
    const url = this.apiBaseURI + `/completeVetting/${billId}`;
    return this.http.post(url, {});
  }
  submitBillTranslationDoc(body){
    const url = this.apiBaseURI + `/addTranslation`;
    return this.http.post(url,body);
  }
  getAllTranslatedBills(){
    const url = this.apiBaseURI + `/getAllTranslations`;
    return this.http.get(url);
  }
  getAllMembers() {
    const url = this.apiBaseURI + `/ministerMotion/member/allPending`;
    return this.http.get(url);
  }
  addMembers(body) {
    const url = this.apiBaseURI + `/ministerMotion/member/add`;
    return this.http.post(url, body);
  }
  addSpeakerNote(billId){
    const url = this.apiBaseURI + `/addSpeakerNote/${billId}`;
    return this.http.get(url);
  }
  markAmendmentAsAccepted(body) {
    const url = this.apiBaseURI + `/resolution/amendment/markAsAccepted`;
    return this.http.post(url, body);
  }
  markAmendmentAsRejected(body) {
    const url = this.apiBaseURI + `/resolution/amendment/markAsRejected`;
    return this.http.post(url, body);
  }
}
