import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConfig } from '../config/api.config';
import { map } from "rxjs/operators";
@Injectable({
  providedIn: 'root'
})
export class GovernersAddressService {
  apiBaseURI: string;
  environment: any;
  rbsJson = {
    modules: {}
  };
  constructor(@Inject("environment") environment, private http: HttpClient, @Inject('authService') private AuthService) {
    this.environment = environment;
    this.apiBaseURI = this.environment.table_api_url + ApiConfig.basePathExt;
  }

  saveGovernerAddrss(body) {
    const url = this.apiBaseURI + ApiConfig.governersAddress.save;
    return this.http.post(url, body);
  }
  submitGovernerAddrss(body) {
    const url = this.apiBaseURI + ApiConfig.governersAddress.submit;
    return this.http.post(url, body);
  }

  getGovernerAddrssList(status) {
    let body = (status) ? { status } : {};
    const url = this.apiBaseURI + ApiConfig.governersAddress.list;
    return this.http.post<any>(url, body);
  }
  getGovernerAddrssById(gvId) {
    const url = this.apiBaseURI + ApiConfig.governersAddress.getById;
    return this.http.get<any>(url + `/${gvId}`);
  }
  saveMinutetominute(body) {
    const url = this.apiBaseURI + ApiConfig.governersAddress.miniutetominute.save;
    return this.http.post<any>(url, body);
  }
  getMinutetominuteList() {
    const url = this.apiBaseURI + ApiConfig.governersAddress.miniutetominute.list;
    return this.http.get<any>(url);
  }
  getMinutetominuteById(mId) {
    const url = this.apiBaseURI + ApiConfig.governersAddress.miniutetominute.getById + `/${mId}`;
    return this.http.get<any>(url);
  }
  getProcessionList() {
    const url = this.apiBaseURI + ApiConfig.governersAddress.procession.list;
    return this.http.get<any>(url);
  }
  saveProcession(formData) {
    const url = this.apiBaseURI + ApiConfig.governersAddress.procession.save;
    return this.http.post(url, formData);
  }
  createCoveringLetter(formData) {
    const url = this.apiBaseURI + ApiConfig.governersAddress.letter1.create;
    return this.http.post(url, formData);
  }
  getAllAmendmentbyUserId(Id) {
    const url = this.apiBaseURI + ApiConfig.governersAddress.mot.amendementByUser + `?userId=${Id}`;
    return this.http.get<any>(url);
  }
  getApprovedMOT() {
    const url = this.apiBaseURI + ApiConfig.governersAddress.mot.approvedList;
    return this.http.get<any>(url);
  }
  createAmendmentForMOT(body) {
    const url = this.apiBaseURI + ApiConfig.governersAddress.mot.createAmendment;
    return this.http.post<any>(url, body);
  }
  getAllAmendmentByMotId(Id) {
    const url = this.apiBaseURI + ApiConfig.governersAddress.mot.getById + `?motId=${Id}`;
    return this.http.get<any>(url);
  }
  generateTA(body){
    const url = this.apiBaseURI + ApiConfig.governersAddress.timeAllocation.generate;
    return this.http.post<any>(url, body);
  }
  saveTA(body){
    const url = this.apiBaseURI + ApiConfig.governersAddress.timeAllocation.save;
    return this.http.post<any>(url, body);
  }
  submitTA(body){
    const url = this.apiBaseURI + ApiConfig.governersAddress.timeAllocation.submit+ `?fileId=${body.fileId}`;
    return this.http.get<any>(url, body);
  }
  addSpeakerNote(body) {
    const url = this.apiBaseURI + ApiConfig.governersAddress.addSpeakerNote;
    return this.http.post<any>(url, body);
  }
  setSpeakerNoteToLOB(fileId) {
    const url = this.apiBaseURI + ApiConfig.governersAddress.setToLOB + `?fileId=${fileId}`;
    return this.http.get<any>(url);
  }
  getByFileIdAndDay(day, fileId) {
    const url = this.apiBaseURI + ApiConfig.governersAddress.timeAllocation.getByFileIdAndDay + `?day=${day}&fileId=${fileId}`;
    return this.http.get<any>(url);
  }
  getTimeByFileIdAndDay(day, fileId) {
    const url = this.apiBaseURI + ApiConfig.governersAddress.timeAllocation.getTimeByFileIdAndDay + `?day=${day}&fileId=${fileId}`;
    return this.http.get<any>(url);
  }
  getDayAndDates(fileId) {
    const url = this.apiBaseURI + ApiConfig.governersAddress.timeAllocation.getDayAndDates + `?fileId=${fileId}`;
    return this.http.get<any>(url);
  }
  getAllMOT() {
    let status="SUBMITTED";
    const url = this.apiBaseURI + ApiConfig.governersAddress.mot.allMOT+ `?status=${status}`;
    return this.http.get<any>(url);
  }
  resubmitMOT(body) {
    const url = this.apiBaseURI + ApiConfig.governersAddress.mot.resubmitFile;
    return this.http.put<any>(url,body);
  }
  setTAToLOB(body) {
    const url = this.apiBaseURI + ApiConfig.governersAddress.timeAllocation.setToLOB;
    return this.http.post<any>(url, body);
  }
  createAmendmentList(body,Id){
    const url = this.apiBaseURI + `/mot/amendmentList/create?motId=${Id}`;
    return this.http.post<any>(url,body);
  }
  getAllAmendmentForMotByStatus(Id) {
    const url = this.apiBaseURI + `/mot/amendments/getAllForMot?motId=${Id}`;
    return this.http.get<any>(url);
  }
  resubmitAmendmentList(body) {
    const url = this.apiBaseURI + `/file/resubmitFile`;
    return this.http.post<any>(url,body);
  }
  getAllAmendmentsByListId(Id){
    const url = this.apiBaseURI + `/mot/amendmentList?listId=${Id}`;
    return this.http.get<any>(url);
  }
  cancelAmendmentBySpeaker(Id){
    const url = this.apiBaseURI + `/mot/amendments/cancel?id=${Id}`;
    return this.http.get<any>(url);
  }
}
