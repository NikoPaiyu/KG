import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConfig } from '../../../shared/config/api.config'
import { map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class PmbrScheduleService {
  environment: any;
  apiBaseURI: string;
  apiBaseURI1: string;
  apiBaseURI2: string;
  constructor(@Inject("environment") environment, private http: HttpClient, private datePipe: DatePipe) {
    this.environment = environment;
    this.apiBaseURI = this.environment.pmbr_api_url + ApiConfig.pmbrBasePathExt;
    this.apiBaseURI1 = this.environment.calendar_api_url
    this.apiBaseURI2 = this.environment.bill_api_url
  }

  saveSchedule(data) {
    const url = `${this.apiBaseURI}${ApiConfig.schedule.create}`
    const body = data
    return this.http.post(url, body);
  }
  getScheduleList() {
    const url = `${this.apiBaseURI}${ApiConfig.schedule.view}`
    return this.http.get(url);
  }
  getScheduleById(id) {
    const url = `${this.apiBaseURI}${ApiConfig.schedule.viewById}${id}`;
    return this.http.get(url);
  }
  createBullettin(bulletinData) {
    const url = this.apiBaseURI2 + `${ApiConfig.billBasePathExt}${ApiConfig.bulletin.create}`
    const body = bulletinData
    return this.http.post(url, body);
  }
  membersBillDates(body) {
    return this.http.get(this.apiBaseURI1 + `/get/allCalenderDates?assemblyId=${body.assemblyId}&sessionId=${body.sessionId}`);
  }
  getCOSId(assemblyId, sessionId) {
    return this.http.get(`${this.environment.calendar_api_url}/get/item?assemblyId=${assemblyId}&sessionId=${sessionId}&status=APPROVED`);
  }
  getReport(body) {
    // let Url = `http://localhost:5000/create-pdf`;
    let Url = `${this.environment.report_api_url}/create-pdf`;
    return this.http.post(Url, body, { responseType: "blob" }).pipe(
      map((res) => {
        return res;
      })
    );
  }
  //funtion for get dates in between selected dates
  getDatesBetweenDates(startDate, endDate) {
    let dates = []
    const stDate = new Date(startDate);
    const edDate = new Date(endDate);
    while (stDate <= edDate) {
      dates = [...dates, this.datePipe.transform(stDate, 'yyyy-MM-dd')]
      stDate.setDate(stDate.getDate() + 1)
    }
    return dates
  }
  //get schedule list by session and assembly id
  getScheduleByAssemblyandSession(body) {
    const url = this.apiBaseURI + ApiConfig.schedule.getScheduleByAssemblyandSession + `?assemblyId=${body.assemblyId}&sessionId=${body.sessionId}`;
    return this.http.get(url);
  }
}
