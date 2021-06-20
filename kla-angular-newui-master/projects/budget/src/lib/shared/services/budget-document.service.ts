import { Inject, Injectable } from '@angular/core';
import { ApiConfig } from '../config/api.config';
import { HttpClient } from '@angular/common/http';
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class BudgetDocumentService {
  apiBaseURI: string;
  environment: any;
  constructor(@Inject("environment") environment, private http: HttpClient, @Inject('authService') private AuthService) {
    this.environment = environment;
    this.apiBaseURI = this.environment.budget_api_url + ApiConfig.basePathExt;
  }

  savebudgetdoc(body) {
    let url = this.apiBaseURI + ApiConfig.budegtdocument.save;
    return this.http.post<any>(url, body)
      .pipe(
        map(res => {
          return res;
        })
      );
  }
  submitbudgetdoc(body) {
    let url = this.apiBaseURI + ApiConfig.budegtdocument.submit;
    return this.http.post<any>(url, body)
      .pipe(
        map(res => {
          return res;
        })
      );
  }
//GRL
  savebudgetdocGRL(body) {
    let url = this.apiBaseURI + ApiConfig.budegtdocument.grlRequest.save;
    return this.http.post<any>(url, body)
      .pipe(
        map(res => {
          return res;
        })
      );
  }
  submitbudgetdocGRL(body) {
    let url = this.apiBaseURI + ApiConfig.budegtdocument.grlRequest.submit;
    return this.http.post<any>(url, body)
      .pipe(
        map(res => {
          return res;
        })
      );
  }
//Budget-main
  savebudget(body) {
    let url = this.apiBaseURI + `/save`;
    return this.http.post<any>(url, body);
  }
  submitbudget(body) {
    let url = this.apiBaseURI;
    return this.http.post<any>(url, body);
  }

  getbudgetDocById(id){
    const url = this.apiBaseURI + ApiConfig.budegtdocument.getById+`/${id}/lines`;
    return this.http.get<any>(url);
  }
  getAllBudgets(paginationParams){
    const url = this.apiBaseURI + `/all?page=${paginationParams.pageIndex}&records=${paginationParams.numberOfItem}`;
    return this.http.get<any>(url);
  }
  
  getAllBudgetDocs() {
    const url = this.apiBaseURI + ApiConfig.budegtdocument.list;
    return this.http.get<any>(url);
  }
  getAllApprovedBudgetDoc() {
    const url = this.apiBaseURI + ApiConfig.budegtdocument.list;
    return this.http.get<any>(url).pipe(
      map((res) => {
        res = res.filter((el) => el.status === 'APPROVED');
        return res;
      })
    );
  }

  //getapproved list
  getAllApprovedBudgetDocuments(assemblyId,sessionId){
    const url = this.apiBaseURI + ApiConfig.budegtdocument.grlRequest.getbudget+ `?assemblyId=${assemblyId}&sessionId=${sessionId}`;
    return this.http.get<any>(url);
  }
  getAllApprovedBudgetGRLdocuments(){
    const url = this.apiBaseURI + ApiConfig.budegtdocument.grlRequest.list;
    return this.http.get<any>(url);
  }
  
  //dds API starts
  createDDS(body) {
    const url = this.apiBaseURI + ApiConfig.budegtdocument.dds.create;
    return this.http.post<any>(url, body);
  }

  // list all dds
  getAllDDS() {
    const url = this.apiBaseURI + ApiConfig.budegtdocument.dds.getAll;
    return this.http.get<any>(url);
  }

  //list of approved dds
  getApprovedDDS(){
    const url = this.apiBaseURI + ApiConfig.budegtdocument.dds.approved;
    return this.http.get<any>(url);
  }
   //dds list for opposition leader
   getDDSListForOppoLeader(){
    const url = this.apiBaseURI + ApiConfig.budegtdocument.dds.listOppo;
    return this.http.get<any>(url);
  }
  // list all viewForAssistant
  viewForAssistant() {
    const url = this.apiBaseURI + ApiConfig.budegtdocument.dds.viewForAssistant;
    return this.http.get<any>(url);
  }
  // delete draft
  DeleteDDS(draftLineId) {
    const url = this.apiBaseURI + ApiConfig.budegtdocument.dds.delete + `/${draftLineId}`;
    return this.http.delete<any>(url);
  }
  suggestionForOl(body) {
    const url = this.apiBaseURI + ApiConfig.budegtdocument.dds.suggestionForOl;
    return this.http.post<any>(url, body);
  }
  getByDemandDraftById(ddsId) {
    const url = this.apiBaseURI + ApiConfig.budegtdocument.dds.getById + `?id=${ddsId}`;
    return this.http.get<any>(url);
  }
  getByDemandDraftByIds(ids) {
    const url = this.apiBaseURI + ApiConfig.budegtdocument.dds.getByIds;
    return this.http.post<any>(url, ids);
  }
  submitDDS(body) {
    const url = this.apiBaseURI + ApiConfig.budegtdocument.dds.submit;
    return this.http.post<any>(url, body);
  }
  getDemandHeadsAndGulletin(ddsId) {
    const url = this.apiBaseURI + ApiConfig.budegtdocument.dds.getDemandHeads + `?demandDraftMasterId=${ddsId}`;
    return this.http.get<any>(url);
  }
  getDDSVersion(ddsId){
    const url = this.apiBaseURI + ApiConfig.budegtdocument.dds.getVersion + `?demandDraftMasterId=${ddsId}`;
    return this.http.get<any>(url);
  }
  setApprovedVersion(demandDraftId, sdfgMasterId){
    let url = this.apiBaseURI + ApiConfig.budegtdocument.dds.setApprovedVersion +`?masterId=${demandDraftId}&sdfgMasterId=${sdfgMasterId}`;
    return this.http.post<any>(url,demandDraftId);
  }
  getAllDemands() {
    const url = this.apiBaseURI + ApiConfig.budegtdocument.sdfg.demands.list;
    return this.http.get<any>(url);
  }

  addSpeechToLOB(budgetId){
    const url = this.apiBaseURI + `/addSpeechToLob/${budgetId}`;
    return this.http.put<any>(url,budgetId);
  }
  publishSpeech(budgetId){
    const url = this.apiBaseURI + `/publish/${budgetId}`;
    return this.http.put<any>(url,budgetId);
  }
  editGRLBulletin(body){
    const url = this.apiBaseURI + `/grlRequest/letter/editGrlBulletin`;
    return this.http.post<any>(url,body);
  }
  getDDSMaterids(fileId) {
    const url = this.apiBaseURI + ApiConfig.budegtdocument.dds.getDDSMaterids + `?fileId=${fileId}`;
    return this.http.get<any>(url);
  }
  getActiveNature(sdfgMasterId) {
    const url = this.apiBaseURI + ApiConfig.budegtdocument.dds.getActiveNature + `?sdfgMasterId=${sdfgMasterId}`;
    return this.http.get<any>(url);
  }
}


