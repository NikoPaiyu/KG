import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ApiConfig } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class AssemblyElectionService {
  environment: any;
  apiBaseURI: string;

  constructor(@Inject('environment') environment, private http: HttpClient) {
    this.environment = environment;
    this.apiBaseURI = this.environment.user_mgmnt_api_url;
  }

  createAssemblyElection(body) {
    const url = this.apiBaseURI + ApiConfig.createElection;
    return this.http.post(url, body);
  }

  getAssemblyElectionList() {
    const url = this.apiBaseURI + ApiConfig.createElection;
    return this.http.get(url);
  }
  getActiveElections(status){
    const url = this.apiBaseURI + ApiConfig.getActiveElection + `?status=${status}`;
    return this.http.get(url);
  }
  getElectionById(id) {
    const url = this.apiBaseURI + ApiConfig.createElection + `/${id}?id=${id}`;
    return this.http.get(url);
  }
  getElectionTypeByAssemblyId(assemblyId){
    const url = this.apiBaseURI + ApiConfig.getElectionType + `?assemblyId=${assemblyId}`;
    return this.http.put(url,assemblyId);
  }
  getAllList(body) {
    const url = this.environment.departmentmangement_api_url + ApiConfig.getAllData;
    return this.http.post(url, body);
  }

  addContituency(id, body) {
    const url = this.apiBaseURI + ApiConfig.createElection + `/${id}/details`;
    return this.http.post(url, body);
  }

  addCandidate(body) {
    const url = this.apiBaseURI + ApiConfig.candidates;
    return this.http.post(url, body);
  }

  getAllContactType() {
    const url = this.apiBaseURI + ApiConfig.getAllContactType;
    return this.http.get(url);
  }

  getAllRelationType() {
    const url = this.apiBaseURI + ApiConfig.getAllRelationType;
    return this.http.get(url);
  }

  uploadUrl() {
    return `${this.environment.fileupload_url}/uploadImage`;
  }

  getDetailsById(id) {
    const url = this.apiBaseURI + ApiConfig.getDetails + `/${id}`;
    return this.http.get(url);
  }

  markWinner(body, detailId) {
    const url = this.apiBaseURI + ApiConfig.createElection + `/${detailId}` + ApiConfig.markWinner;
    return this.http.post(url, body);
  }
  getElectedUserId(userId){
    const url = this.apiBaseURI + ApiConfig.userManagementversion2 + `?id=${userId}`;
    return this.http.get(url);
  }
  saveProfileData(body){
    const url = this.apiBaseURI + ApiConfig.profile;
    return this.http.post(url,body);
  }
  markAsValid(body){
    const url = this.apiBaseURI + ApiConfig.userManagementversion2+`/validate`;
    return this.http.put(url,body);
  }
  submitOath(body){
    const url = this.apiBaseURI + ApiConfig.createElection+`/updateOathForm`;
    return this.http.put(url,body);
  }
  submitEndtype(body){
    const url = this.apiBaseURI + ApiConfig.userManagementversion1+`/member/term/updateTermEnd`;
    return this.http.put(url,body);
  }
  getCandidateById(id){
    const url = this.apiBaseURI + ApiConfig.candidates + `/${id}`;
    return this.http.get(url);
  }

  getMemberDesignations() {
    const url = this.environment.departmentmangement_api_url + ApiConfig.getMemberDesignations;
    return this.http.get(url);
  }

  getRoles() {
    const url = this.apiBaseURI + ApiConfig.getRoles;
    return this.http.get(url);
  }

  addAllRole(body) {
    const url = this.apiBaseURI + ApiConfig.addAllRole;
    return this.http.put(url, body);
  }

  getRbsRoles() {
    const url = this.apiBaseURI + ApiConfig.getRbsRoles;
    return this.http.get(url);
  }

  getAllPortfolios() {
    const url = this.environment.portfolio_mock_api_url + ApiConfig.getAllPortfolios;
    return this.http.get(url);
  }
  getDraftPortfolios(){
    const url = this.environment.portfolio_mock_api_url + ApiConfig.getDraftPortfolios;
    return this.http.get(url);
  }
  markAsDeceased(body) {
    const url = this.apiBaseURI + ApiConfig.markDeceased;
    return this.http.put(url, body);
  }
  endMemberPosition(body){
    const url = this.apiBaseURI + ApiConfig.userManagementversion1+`/member/position/updateEndTerm`;
    return this.http.put(url,body);
  }
  saveMemberPosition(body){
    const url = this.apiBaseURI + ApiConfig.userManagementversion1+`/member/position`;
    return this.http.post(url,body);
  }
  confrmMemberPosition(body){
    const url = this.apiBaseURI + ApiConfig.userManagementversion1+`/member/position/confirm`;
    return this.http.put(url,body);
  }

  getCountryDetails() {
    const url = this.environment.departmentmangement_api_url + ApiConfig.getCountryData;
    return this.http.get(url);
  }

  getAddressTypeList() {
    const url = this.apiBaseURI + ApiConfig.userManagementversion1 + ApiConfig.getAddressType;
    return this.http.get(url);
  }

  deleteCandidateById(reqBody) {
    const url = this.apiBaseURI + ApiConfig.userManagementversion1 + ApiConfig.deleteCandidate;
    return this.http.request('DELETE', url, { body: reqBody});
  }

  deleteConstituencyById(reqBody) {
    const url = this.apiBaseURI + ApiConfig.userManagementversion1 + ApiConfig.deleteConstituency;
    return this.http.request('DELETE', url, {body: reqBody});
  }
}
