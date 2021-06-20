import { Inject, Injectable } from '@angular/core';
import { ApiConfig } from '../config/api.config';
import { HttpClient } from '@angular/common/http';
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class StmtDemandsGrantsService {
  apiBaseURI: string;
  environment: any;
  constructor(@Inject("environment") environment, private http: HttpClient, @Inject('authService') private AuthService) {
    this.environment = environment;
    this.apiBaseURI = this.environment.budget_api_url + ApiConfig.basePathExt;
  }

  // list all demands
  getAllDemands() {
    const url = this.apiBaseURI + ApiConfig.budegtdocument.sdfg.demands.list;
    return this.http.get<any>(url);
  }
  // change order of demands
  chnageDemandOrder(body) {
    const url = this.apiBaseURI + ApiConfig.budegtdocument.sdfg.demands.changeOrdr;
    return this.http.post<any>(url, body);
  }
  // list all demands
  getAllSDFG(paginationParams) {
    let url = this.apiBaseURI + ApiConfig.budegtdocument.sdfg.getAllSDFG;
    url += this._appendPaginationParams(paginationParams)
    return this.http.get<any>(url);
  }
  // list all published sdfg
  getAllPublishedSDFG() {
    const url = this.apiBaseURI + ApiConfig.budegtdocument.sdfg.published;
    return this.http.get<any>(url);
  }
   // list for bit list
   listForBitListPreparation() {
    const url = this.apiBaseURI + ApiConfig.budegtdocument.cutmotion.bitlist.getAll;
    return this.http.get<any>(url);
  }
  // list all published sdfg
  getAllApprovedSDFG() {
    const url = this.apiBaseURI + ApiConfig.budegtdocument.sdfg.approved;
    return this.http.get<any>(url);
  }
  publishSDFG(sdfgMasterId) {
    const url = this.apiBaseURI + ApiConfig.budegtdocument.sdfg.publishSdfgs + `?sdfgMasterId=${sdfgMasterId}`;
    return this.http.get<any>(url);
  }
  // save SDFG
  saveSDFG(body) {
    const url = this.apiBaseURI + ApiConfig.budegtdocument.sdfg.saveSDFG;
    return this.http.post<any>(url, body);
  }
  // to save all SDFG
  saveAllSDFG(body) {
    const url = this.apiBaseURI + ApiConfig.budegtdocument.sdfg.saveAllSDFG;
    return this.http.post<any>(url, body);
  }
  // to submit all SDFG
  submitSDFG(body) {
    const url = this.apiBaseURI + ApiConfig.budegtdocument.sdfg.submitSDFG;
    return this.http.post<any>(url, body);
  }
  // SDFG By Id
  getSDFGById(id) {
    const url = this.apiBaseURI + ApiConfig.budegtdocument.sdfg.getById + `?id=${id}`;
    return this.http.get<any>(url);
  }
  // SDFG By Id
  getSDFGByLinesId(LinesId) {
    const url = this.apiBaseURI + ApiConfig.budegtdocument.sdfg.getByLinesId + `?sdfgId=${LinesId}`;
    return this.http.get<any>(url);
  }
  // to delete  all SDFG line
  DeleteDemands(demandId) {
    const url = this.apiBaseURI + ApiConfig.budegtdocument.sdfg.deleteSDFG + `/${demandId}`;
    return this.http.delete<any>(url);
  }

  //cut motion create
  createCutMotion(body) {
    const url = this.apiBaseURI + ApiConfig.budegtdocument.cutmotion.create;
    return this.http.post<any>(url, body);
  }
  submitCutMotion(sdfgId) {
    const url = this.apiBaseURI + ApiConfig.budegtdocument.cutmotion.submit;
    return this.http.post<any>(url, sdfgId);
  }
  DeleteCutMotion(cId) {
    const url = this.apiBaseURI + ApiConfig.budegtdocument.cutmotion.delete + `?id=${cId}`;
    return this.http.delete<any>(url);
  }
  getAllCutMotion(body) {
    const url = this.apiBaseURI + ApiConfig.budegtdocument.cutmotion.getAllForMembers;
    return this.http.post<any>(url, body);
  }
  getSdfgDetails(sdfgMasterId) {
    const url = this.apiBaseURI + ApiConfig.budegtdocument.cutmotion.getSdfgById + `?sdfgMasterId=${sdfgMasterId}`;
    return this.http.get<any>(url);
  }
  resubmitCutmotion(sdfgMasterId) { // to resubmit cut motion list
    const url = this.apiBaseURI + ApiConfig.budegtdocument.cutmotion.resubmit + `?sdfgMasterId=${sdfgMasterId}`;
    return this.http.post<any>(url, sdfgMasterId);
  }
  getAllSubmitted(body) { // to get submitted cut motion list
    const url = this.apiBaseURI + ApiConfig.budegtdocument.cutmotion.getAllSubmitted;
    return this.http.post<any>(url, body);
  }
  _appendPaginationParams(paginationParams) {
    return (`?limit=${paginationParams.numberOfItem}&page=${paginationParams.pageIndex}`)
  }

  getCosDatesForSdfgId(sdfgId) { // to get cos dates for bit list
    const url = this.apiBaseURI + ApiConfig.budegtdocument.dds.getCosDatesForSdfgId  + `?sdfgId=${sdfgId}`;
    return this.http.get<any>(url);
  }
  getDemandMasterById(demandDraftId) {
    const url = this.apiBaseURI + ApiConfig.budegtdocument.dds.getDemandMasterById  + `?demandDraftId=${demandDraftId}`;
    return this.http.get<any>(url);
  }
  getPublishedCutmotionList() {
    const url = this.apiBaseURI + ApiConfig.budegtdocument.cutmotion.getPublishedCutMotionList;
    return this.http.get<any>(url);
  }
  getApprovedCutmotionList() {
    const url = this.apiBaseURI + ApiConfig.budegtdocument.cutmotion.getApprovedCutMotionList;
    return this.http.get<any>(url);
  }
  publishCutMotion(sdfgMasterId) {
    const url = this.apiBaseURI + ApiConfig.budegtdocument.cutmotion.publishCutMotion + `?sdfgMasterId=${sdfgMasterId}`;
    return this.http.get<any>(url);
  }
  isResubmit(sdfgMasterId) {
    const url = this.apiBaseURI + ApiConfig.budegtdocument.cutmotion.isResubmit + `?sdfgMasterId=${sdfgMasterId}`;
    return this.http.get<any>(url);
  }
  cutMotionSetToLOB(cutMotionId) {
    const url = this.apiBaseURI + ApiConfig.budegtdocument.cutmotion.setToLOB + `?cutMotionId=${cutMotionId}`;
    return this.http.put<any>(url, cutMotionId);
  }
  passCutMotion(cutMotionId) {
    const url = this.apiBaseURI + ApiConfig.budegtdocument.cutmotion.passCutMotion + `?cutMotionId=${cutMotionId}`;
    return this.http.put<any>(url, cutMotionId);
  }
  createGreenBook(body) {
    const url = this.apiBaseURI + ApiConfig.budegtdocument.greenbook.create;
    return this.http.post<any>(url, body);
  }
  updateGreenBook(body) {
    const url = this.apiBaseURI + ApiConfig.budegtdocument.greenbook.save;
    return this.http.post<any>(url, body);
  }
  getGreenBookById(id) {
    const url = this.apiBaseURI + ApiConfig.budegtdocument.greenbook.getById + `?id=${id}`;
    return this.http.get<any>(url);
  }
  createBitList(body) {
    const url = this.apiBaseURI + ApiConfig.budegtdocument.cutmotion.bitlist.createBitList;
    return this.http.post<any>(url, body);
  }
  bitlistGetById(bitListMasterId) {
    const url = this.apiBaseURI + ApiConfig.budegtdocument.cutmotion.bitlist.getById  + `?bitListMasterId=${bitListMasterId}`;
    return this.http.get<any>(url);
  }
  listToAddHeads(demandDraftId) {
    const url = this.apiBaseURI + ApiConfig.budegtdocument.cutmotion.bitlist.listToAddHeads  + `?demandDraftId=${demandDraftId}`;
    return this.http.get<any>(url);
  }
  submitBitList(body) {
    const url = this.apiBaseURI + ApiConfig.budegtdocument.cutmotion.bitlist.submitBitList;
    return this.http.post<any>(url, body);
  }
  // list for bit list
  generateMinisterAndSpeakerReadingAndAttach(bitListMasterId) {
    const url = this.apiBaseURI + ApiConfig.budegtdocument.cutmotion.bitlist.generateMr  + `?bitListMasterId=${bitListMasterId}`;
    return this.http.get<any>(url);
  }
  getPdfUrlByDemandDraftIdAndType(demandDraftId, type) {
    const url = this.apiBaseURI + ApiConfig.budegtdocument.cutmotion.bitlist.getPdfUrl  + `?demandDraftId=${demandDraftId}&type=${type}`;
    return this.http.get<any>(url);
  }
  getDemandWithRevenueDetails(demandDraftId) {
    const url = this.apiBaseURI + ApiConfig.budegtdocument.cutmotion.bitlist.revenueDetails  + `?demandDraftId=${demandDraftId}`;
    return this.http.get<any>(url);
  }
  bitlistSetToLOB(bitListMasterId) {
    const url = this.apiBaseURI + ApiConfig.budegtdocument.cutmotion.bitlist.setToLob + `?bitListMasterId=${bitListMasterId}`;
    return this.http.get<any>(url);
  }
  generateCutmotionReport(demandDraftId) {
    const url = this.apiBaseURI + ApiConfig.budegtdocument.cutmotion.listReport + `?demandDraftId=${demandDraftId}`;
    return this.http.get(url,{ responseType: "text" });
  }
}
