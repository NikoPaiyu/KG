import { Inject, Injectable } from '@angular/core';
import { ApiConfig } from '../config/api.config';
import { HttpClient } from '@angular/common/http';
import { map } from "rxjs/operators";
@Injectable({
  providedIn: 'root'
})
export class SdgEgService {
  apiBaseURI: string;
  environment: any;
  constructor(@Inject("environment") environment, private http: HttpClient, @Inject('authService') private AuthService) {
    this.environment = environment;
    this.apiBaseURI = this.environment.budget_api_url + ApiConfig.basePathExt;
  }
  saveSDGRequest(body) {
    let url = this.apiBaseURI + ApiConfig.sdgEg.save;
    return this.http.post<any>(url, body)
      .pipe(
        map(res => {
          return res;
        })
      );
  }
  submitSDGRequest(body) {
    let url = this.apiBaseURI + ApiConfig.sdgEg.submit;
    return this.http.post<any>(url, body)
      .pipe(
        map(res => {
          return res;
        })
      );
  }
  getAllSdgegReuqests(paginationParams) {
    let url = this.apiBaseURI + ApiConfig.sdgEg.list;
    url += this._appendPaginationParams(paginationParams)
    return this.http.get<any>(url);
  }
  // list all demands
  getAllSDGEG(paginationParams) {
    let url = this.apiBaseURI + ApiConfig.sdgEg.getAllSdgEg;
    url += this._appendPaginationParams(paginationParams)
    return this.http.get<any>(url);
  }
  getAllSDGEGReceived(paginationParams) {
    let url = this.apiBaseURI + ApiConfig.sdgEg.receviedSDGEGinTS;
    // url += this._appendPaginationParams(paginationParams)
    return this.http.get<any>(url);
  }
  // save SDGEG
  saveSDGEG(body) {
    const url = this.apiBaseURI + ApiConfig.sdgEg.saveSDGEG;
    return this.http.post<any>(url, body);
  }
  // to save all SDGEG
  saveAllSDGEG(body) {
    const url = this.apiBaseURI + ApiConfig.sdgEg.saveAllSDGEG;
    return this.http.post<any>(url, body);
  }
  // to submit all SDGEG
  submitSDGEG(body) {
    const url = this.apiBaseURI + ApiConfig.sdgEg.submitSDGEG;
    return this.http.post<any>(url, body);
  }
  // SDFG By Id
  getSDGEGById(id) {
    const url = this.apiBaseURI + ApiConfig.sdgEg.getById + `?id=${id}`;
    return this.http.get<any>(url);
  }
  editGRLBulletin(body) {
    const url = this.apiBaseURI + ApiConfig.sdgEg.editGRLBulletin;
    return this.http.post<any>(url, body);
  }
  addToLOB(sdgegId) {
    const url = this.apiBaseURI + ApiConfig.sdgEg.addToLOB + `${sdgegId}`;
    return this.http.put<any>(url, sdgegId);
  }
  sentToLegislation(sdgegId) {
    const url = this.apiBaseURI + ApiConfig.sdgEg.sentToLS + `${sdgegId}`;
    return this.http.put<any>(url, sdgegId);
  }
  sentToMembers(sdgegId){
    const url = this.apiBaseURI + ApiConfig.sdgEg.publish+`?sdgAndEgId=${sdgegId}`;
    return this.http.put<any>(url, sdgegId);
  }
  getAllSdgEgDDSList() {
    const url = this.apiBaseURI + ApiConfig.sdgEg.dds.getAll;
    return this.http.get<any>(url);
  }
  getApprovedSdgEgDDSList() {
    const url = this.apiBaseURI + ApiConfig.sdgEg.dds.approved;
    return this.http.get<any>(url);
  }
  createDDS(body) {
    const url = this.apiBaseURI + ApiConfig.sdgEg.dds.create;
    return this.http.post<any>(url, body);
  }
  submitDDS(body) {
    const url = this.apiBaseURI + ApiConfig.sdgEg.dds.submit;
    return this.http.post<any>(url, body);
  }
  // getAllPublishedSDGEG() {
  //   let url = this.apiBaseURI + ApiConfig.sdgEg.receviedSDGEG;
  //   // url += this._appendPaginationParams(paginationParams)
  //   return this.http.get<any>(url);
  // }
  getAllLegiApprovedSDGEG(paginationParams) {
    let url = this.apiBaseURI + ApiConfig.sdgEg.LSApproved;
    // url += this._appendPaginationParams(paginationParams)
    return this.http.get<any>(url);
  }
  getByDemandDraftById(id) {
  const url = this.apiBaseURI + ApiConfig.sdgEg.dds.getById+ `?id=${id}`;
    return this.http.get<any>(url);
  }
  suggestionForOl(body) {
    const url = this.apiBaseURI + ApiConfig.sdgEg.dds.suggestionForOl;
    return this.http.post<any>(url, body);
  }
  getDDSMaterids(fileId) {
    const url = this.apiBaseURI + ApiConfig.sdgEg.dds.getDDSMaterids + `?fileId=${fileId}`;
    return this.http.get<any>(url);
  }
  getActiveNature(sdfgMasterId) {
    const url = this.apiBaseURI + ApiConfig.sdgEg.dds.getActiveNature + `?sdfgMasterId=${sdfgMasterId}`;
    return this.http.get<any>(url);
  }
  setApprovedVersion(demandDraftId, sdfgMasterId){
    let url = this.apiBaseURI + ApiConfig.sdgEg.dds.setApprovedVersion +`?masterId=${demandDraftId}&sdfgMasterId=${sdfgMasterId}`;
    return this.http.post<any>(url,demandDraftId);
  }
  _appendPaginationParams(paginationParams) {
    return (`?page=${paginationParams.pageIndex}&records=${paginationParams.numberOfItem}`)
  }
  getPublishedSDGEGwithoutPagination(){
    let url = this.apiBaseURI + ApiConfig.sdgEg.publishedSdfg;
    return this.http.get<any>(url);
  }
  getPublishedSDGEGWithPagination(paginationParams){
    let url = this.apiBaseURI + ApiConfig.sdgEg.publishedSdfg +`/`;
    url += this._appendPaginationParams(paginationParams)
    return this.http.get<any>(url);
  }
  getReceivedListOnLegislation(paginationParams){
    let url = this.apiBaseURI + ApiConfig.sdgEg.receviedSDGEGinLS;
    // url += this._appendPaginationParams(paginationParams)
    return this.http.get<any>(url);
  }
  addToLOBforSpeakerNote(sdgegId){
    const url = this.apiBaseURI + ApiConfig.sdgEg.setToLOB + `${sdgegId}`;
    return this.http.put<any>(url, sdgegId);
  }
}
