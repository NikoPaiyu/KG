import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConfig } from '../config/api.config';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ProrityListService {
  apiBaseURI: string;
  environment: any;
  constructor(@Inject("environment") environment, private http: HttpClient) {
    this.environment = environment;
    this.apiBaseURI = this.environment.bill_api_url + ApiConfig.basePathExt;
  }
  getPriorityLstCategories() {

    return this.http.get(`${this.apiBaseURI}${ApiConfig.priorityList.categories}`);
  }

  savePriorityList(data) {
    return this.http.post(`${this.apiBaseURI}${ApiConfig.priorityList.save}`, data);
  }
  submitPriorityList(data) {
    return this.http.post(`${this.apiBaseURI}${ApiConfig.priorityList.submit}`, data);
  }
  getPriorityListById(id) {
    return this.http.get(`${this.apiBaseURI}${ApiConfig.priorityList.getById}/${id}`);

  }


  //#region priority list listing
  getAllPriorityList() {
    return this.http.get(`${this.apiBaseURI}${ApiConfig.priorityList.listAll}`);
  }

  getSubmittedPriorityList() {
    return this.http.get(`${this.apiBaseURI}${ApiConfig.priorityList.submittedList}`);
  }
  getAllPriorityListRequests() {
    return this.http.get(`${this.apiBaseURI}${ApiConfig.priorityList.listRequestAll}`);
  }
  requestPriorityList(body) {
    return this.http.post(`${this.apiBaseURI}${ApiConfig.priorityList.submitPrioritylistRquest}`, body);
  }

  attachCOS(body) {
    return this.http.post(`${this.apiBaseURI}${ApiConfig.priorityList.addCOS}`, body);
  }

  getPriorityListByAssemblySession(assembly, session) {
    return this.http.get(`${this.apiBaseURI}${ApiConfig.priorityList.priorityListByAssemblySession}/${assembly}/${session}`);
  }

  sendPriorityListRequestResponse(body) {

    return this.http.post(`${this.apiBaseURI}${ApiConfig.priorityList.sendPriorityListRequestResponse}`, body);
  }

  getCOSId(assemblyId, sessionId) {
    return this.http.get(`${this.environment.calendar_api_url}/get/item?assemblyId=${assemblyId}&sessionId=${sessionId}&status=APPROVED`);
  }

  getCosById(cosId) {
    const url = `${this.environment.calendar_api_url}/get/byId?calendarofSittingId=${cosId}`;
    return this.http.get<any>(url);
  }
   //  Report generation
  getReport(body) {
    // let Url = `http://localhost:5000/create-pdf`;
    let Url = `${this.environment.report_api_url}/create-pdf`;
    return this.http.post(Url, body, { responseType: "blob" }).pipe(
      map((res) => {
        return res;
      })
    );
  }
  getDates(assembly, session) {
    return this.http.get(
      `${this.environment.calendar_api_url}/get/itemForQuestions?assemblyId=${assembly}&sessionId=${session}`
    );
  }

  setInitialDays(body) {
    return this.http.post(`${this.apiBaseURI}${ApiConfig.priorityList.setInitialDays}`, body);
  }

  deletePriorityList(id) {
    return this.http.delete(`${this.apiBaseURI}${ApiConfig.priorityList.delete}/${id}`);
  }

  getScheduleOfBill(id) {
    return this.http.get(`${this.apiBaseURI}${ApiConfig.priorityList.schedule}/${id}`);
  }

  scheduleOfBill(body) {
    return this.http.post(`${this.apiBaseURI}${ApiConfig.priorityList.schedule}`, body);
  }

  getScheduleForBillList() {
    return this.http.get(`${this.apiBaseURI}${ApiConfig.priorityList.scheduleList}`);
  }
  getScheduleList() {
    return this.http.get(this.apiBaseURI+`/schedule/all`);
  }
}
