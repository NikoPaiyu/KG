import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConfig } from '../config/api.config';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CorrespondenceService {
  environment: any;
  apiBaseURICorrespondence: string;
  apiBaseURIRReg: string;
  apiBaseURINotif: string;
  rbsJson: any;
  apiBaseURICommittee: string;
  apiBaseURITable: string;
  apiBaseURITableVer2:string;
  apiBaseURIBudget: string;
  apiBaseURIBill:string;
  constructor(@Inject('environment') environment, private http: HttpClient) {
    this.environment = environment;
    this.apiBaseURICorrespondence =
      this.environment.cpl_api_url + ApiConfig.basePathCorrespondence;
    this.apiBaseURIRReg = this.environment.cpl_api_url + ApiConfig.basePathReg;
    this.apiBaseURINotif = this.environment.cpl_api_url + ApiConfig.basePathNotification;
    this.apiBaseURICommittee = this.environment.committee_api_url + ApiConfig.basePathCommittee;
    this.apiBaseURITable = this.environment.table_api_url + ApiConfig.basePathTable;
    this.apiBaseURITableVer2 = this.environment.table_api_url + ApiConfig.basePathTableV2;
    this.apiBaseURIBudget = this.environment.budget_api_url + ApiConfig.basePathBudget;
    this.apiBaseURIBill = this.environment.budget_api_url + ApiConfig.basePathBill;

  }

  getAllCode(type) {
    return this.http.get(
      this.apiBaseURICorrespondence +
      ApiConfig.correspondenceTemplate.getAllCode +
      `?type=${type}`
    );
  }

  getAllBusiness() {
    return this.http.get(
      this.apiBaseURICorrespondence +
      ApiConfig.correspondenceTemplate.getAllBusiness
    );
  }

  getAllWorkflow(type) {
    return this.http.get(
      this.apiBaseURICorrespondence +
      ApiConfig.correspondenceTemplate.getAllWorkFlow +
      `?type=${type}`
    );
  }

  getTemplateInputTypes() {
    return this.http.get(
      this.apiBaseURICorrespondence +
      ApiConfig.correspondenceTemplate.getAllInputType
    );
  }

  deleteTemplateInput(deleteBody) {
    return this.http.request(
      'delete',
      this.apiBaseURICorrespondence +
      ApiConfig.correspondenceTemplate.deleteTemplateInput,
      { body: deleteBody }
    );
  }

  saveTemplateWithInputs(body) {
    return this.http.post(
      this.apiBaseURICorrespondence +
      ApiConfig.correspondenceTemplate.saveTemplateWithInputs,
      body
    );
  }

  getTemplateById(templateId) {
    return this.http.get(
      this.apiBaseURICorrespondence +
      ApiConfig.correspondenceTemplate.getTemplateById +
      `?templateId=${templateId}`
    );
  }

  getAllTemplateByType(body) {
    return this.http.post(
      this.apiBaseURICorrespondence +
      ApiConfig.correspondenceTemplate.getAllTemplate,
      body
    );
  }

  deleteTemplate(templateId) {
    return this.http.delete(
      this.apiBaseURICorrespondence +
      ApiConfig.correspondenceTemplate.deleteTemplate +
      `?templateId=${templateId}`
    );
  }

  getCorrespondencePermissions(permission) {
    // if (userId) {
    //   const url = this.environment.user_mgmnt_api_url + `/rbs/getUserRoleDetails?userId=${userId}`;
    //   this.http.get(url).subscribe(Response => {
    //     this.rbsJson = Response as any;
    //   });
    // }
    if (permission) {
      this.rbsJson = permission;
    }
  }

  doIHaveCorrespondenceAccess(pCategory, permission) {
    let permObj;
    // tslint:disable-next-line:no-string-literal
    permObj = this.rbsJson['CORRESPONDENCE'];
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

  getTemplateFormById(id) {
    return this.http.get(
      this.apiBaseURICorrespondence +
      `/template/getTemplateForm?templateId=${id}`
    );
  }

  saveCorrespondence(body) {
    return this.http.post(this.apiBaseURICorrespondence, body);
  }

  sendCorrespondence(id) {
    const body = {};
    return this.http.post(this.apiBaseURICorrespondence + `/${id}/send`, body);
  }

  getAllToData() {
    return this.http.get(this.apiBaseURICorrespondence + `/getAllCode?type=`);
  }

  uploadUrl() {
    return 'http://45.249.111.246' + ApiConfig.uploadFile;
  }

  getCorrespondenceById(id, code) {
    return this.http.get(
      this.apiBaseURICorrespondence + `/${id}?code=${code}`
    );
  }

  deleteTo(id, toListId) {
    return this.http.get(this.apiBaseURICorrespondence + `/deleteFromToList?id=${id}&toListId=${toListId}`);
  }

  getWorkflowUsers(id) {
    return this.http.get(
      this.apiBaseURICorrespondence + `/${id}/getWorkflowActionUsers`
    );
  }

  addNote(id, body) {
    return this.http.post(
      this.apiBaseURICorrespondence +
      `/${id}` +
      ApiConfig.correspondenceTemplate.addNote,
      body
    );
  }

  updateNote(id, body) {
    return this.http.put(
      this.apiBaseURICorrespondence +
      `/${id}` +
      ApiConfig.correspondenceTemplate.addNote,
      body
    );
  }

  deleteNote(noteId, correspondenceId) {
    return this.http.delete(
      this.apiBaseURICorrespondence +
      `/${correspondenceId}` +
      ApiConfig.correspondenceTemplate.deleteNote +
      `?noteId=${noteId}`
    );
  }

  getNotes(id) {
    return this.http.get(
      this.apiBaseURICorrespondence +
      `/${id}` +
      ApiConfig.correspondenceTemplate.addNote
    );
  }

  approveCorrespondence(id, body) {
    return this.http.put(
      this.apiBaseURICorrespondence + `/${id}/approve`,
      body
    );
  }

  forwardCorrespondence(id, body) {
    return this.http.put(
      this.apiBaseURICorrespondence + `/${id}/forward`,
      body
    );
  }

  checkWorkFlowStatus(workFlowId) {
    const url =
      this.environment.cpl_api_url +
      `:9000/kla/workflow/service/v1/task/tracking?processInstanceId=${workFlowId}`;
    return this.http.get<any>(url);
  }

  correspondenceDetailView(currespondenceId, code) {
    return this.http.get(
      this.apiBaseURICorrespondence +
      `/${currespondenceId}/detail?code=${code}`
    );
  }

  getDeptUser(userId) {
    return this.http
      .get(this.environment.user_mgmnt_api_url + `/v1/users/get/id/${userId}`)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  getCorrespondenceDepartmentrecieved(departmentId) {
    return this.http.get(
      this.apiBaseURINotif +
      ApiConfig.notification.getCurrespondenceDepartmentRecieved +
      `=${departmentId}`
    );
  }

  uploadDocuments(body) {
    return this.http.put(
      this.apiBaseURICorrespondence + `/${body.correspondenceId}/uploadeCplAttachment`,
      body
    );
  }

  getPending(id) {
    return this.http.get(
      this.apiBaseURICorrespondence +
      ApiConfig.correspondenceTemplate.getPending +
      `?userId=${id}`
    );
  }

  getSent(code) {
    return this.http.post(
      this.apiBaseURICorrespondence +
      ApiConfig.correspondenceTemplate.sent +
      `?code=${code}`,
      null
    );
  }

  getInbox(code) {
    return this.http.post(
      this.apiBaseURICorrespondence +
      ApiConfig.correspondenceTemplate.inbox +
      `?code=${code}`,
      null
    );
  }

  getOutbox(code) {
    return this.http.post(
      this.apiBaseURICorrespondence +
      ApiConfig.correspondenceTemplate.outbox +
      `?code=${code}`,
      null
    );
  }

  // committe related services
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
  getSubjectCommitteeList(businessReferId) {
    // const url = this.apiBaseURICommittee + `/subject`;
    const url = this.apiBaseURICommittee + `/nominee/getSubjectToNominate?letterId=${businessReferId}`;
    return this.http
      .get(url)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  getMemberListByBusinessReferId(businessReferId){
    const url = this.apiBaseURICommittee + `/nominee/getMembersToNominate?letterId=${businessReferId}`;
    return this.http
      .get(url)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  // end committe APIS

  // starts governors address related Apis
  getDayAndDates(fileId, currentBuinessType, type) {
    let apiBaseUrl = currentBuinessType === 'TABLE' ? this.apiBaseURITable + '/governorsAddress' : this.apiBaseURIBudget;
    const url = apiBaseUrl + `/timeAllocation/getDayAndDates` + `?fileId=${fileId}&type=${type}`;
    return this.http.get<any>(url);
  }
  getCurrentAssemblyAndSession() {
    return this.http.get(`${this.environment.calendar_api_url}/getAllAssemblyAndSession`);
  }
  getByFileIdAndDay(day, fileId, currentBuinessType, type) {
    let apiBaseUrl = currentBuinessType === 'TABLE' ? this.apiBaseURITable + '/governorsAddress' : this.apiBaseURIBudget;
    const url = apiBaseUrl + `/timeAllocation/getByFileIdAndDay` + `?day=${day}&fileId=${fileId}&type=${type}`;
    return this.http.get<any>(url);
  }
  getTimeByUserId(id, currentBuinessType) {
    let apiBaseUrl = currentBuinessType === 'TABLE' ? this.apiBaseURITable + '/governorsAddress' : this.apiBaseURIBudget;
    let url = apiBaseUrl + `/timeAllocation/getTimeByUserId` + `?governorsAddressId=${id}`;
    if (currentBuinessType === 'BUDGET') {
      url = apiBaseUrl + `/timeAllocation/getTimeByUserId` + `?masterId=${id}`;
    }
    return this.http.get<any>(url);
  }
  
  getToListGovernorsAddress(businessCode) {
    const url = this.apiBaseURITable + `/governorsAddress/timeAllocation/getCodesByBusiness?business=${businessCode}`;
    return this.http.get<any>(url);
  }
  //get all budgetdoc businessdata
  getAllbudgetdocdata(){
    // const url = this.apiBaseURITable + `/governorsAddress/timeAllocation/getCodesByBusiness?business=${businessCode}`;
    // return this.http.get<any>(url);
  }
  getSDFGByLinesId(LinesId) {
    const url = this.apiBaseURIBudget + `/SDFG/getLines?sdfgId=${LinesId}`;
    return this.http.get<any>(url);
  }
  getAllAPBills(type){
    const url = this.apiBaseURIBill + `/apBill/listValues?type=${type}`;
    return this.http
      .get(url)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }  
  getAllSDFG(corrspondenceId) {
    const url = this.apiBaseURIBudget + `/SDFG/getAllSDFG?correspondanceId=${corrspondenceId}`;
    return this.http.get<any>(url);
  }
  getBudgetNature(corrspondenceId) {
    const url = this.apiBaseURIBudget + `/SDFG/letter/budgetNature/${corrspondenceId}`;
    return this.http.get<any>(url);
  }
  getAllSDGEG(corrspondenceId) {
    const url = this.apiBaseURIBudget + `/sdgAndeg/getAllSdgOrEg?correspondanceId=${corrspondenceId}`;
    // const url = this.apiBaseURIBudget + `/sdgAndeg/getAll?page=0&records=10`
    return this.http.get<any>(url);
  }
  getSDGEGById(id){
    const url = this.apiBaseURIBudget + `/sdgAndeg/getById?id=${id}`;
    return this.http.get<any>(url);
  }
  getTypeByMasterId(masterId){
    const url = this.apiBaseURIBudget + `/timeAllocation/getTypeByMasterId?masterId=${masterId}`;
    return this.http.get<any>(url);
  }
  // table  time allocation version 2
  getBusinessDayAndDates(businessId){
    const url = this.apiBaseURITableVer2 + `/timeAllocation/getDayAndDates?businessId=${businessId}`;
    return this.http.get<any>(url);
  }
  getBusinessTimeByUserId(businessId){
    const url = this.apiBaseURITableVer2 + `/timeAllocation/getTimeByUserId?businessId=${businessId}`;
    return this.http.get<any>(url);
  }
  getByBuisnessIdAndDay(businessId,day){
    const url = this.apiBaseURITableVer2 + `/timeAllocation/getByBusinessIdAndDay?businessId=${businessId}&day=${day}`;
    return this.http.get<any>(url);
  }
   // table  time allocation version 2
}
