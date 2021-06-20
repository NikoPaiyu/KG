import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ApiConfig } from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class ElectionService {
  environment: any;
  apiBaseURI: string;
  officeSectionApiBaseURI: string;

  constructor(@Inject('environment') environment, private http: HttpClient) {
    this.environment = environment;
    this.apiBaseURI = this.environment.table_api_url + ApiConfig.basePathElection;
    this.officeSectionApiBaseURI = this.environment.office_api_url + ApiConfig.basePathOfficeSection;
  }

  // get list of registered documents
  getPendingDocuments(body) {
    // const url = this.apiBaseURI + ApiConfig.election.getPendingDocuments;
    // return this.http.post(url, body);
    return this.http.post(
      this.officeSectionApiBaseURI + `/documents/getPendingDocuments`, body
    );
  }

  // get registered document by id
  getRegDocById(id) {
    // const url = this.apiBaseURI + ApiConfig.election.getDocById;
    // return this.http.get(url + `/${id}`);
    return this.http.get(
      this.officeSectionApiBaseURI + `/documents/${id}`
    );
  }

  // create protem speaker
  createProtemSpeaker(body) {
    const url = this.apiBaseURI + ApiConfig.election.createProtemSpeaker;
    return this.http.post(url , body);
  }

  //get list of protem speaker
  getProtemSpeakerList(status) {
    const url = this.apiBaseURI + ApiConfig.election.getProtemList;
    return this.http.get(url + `?status=${status}`);
  } 
  //get list of election speaker
  getElectionSpeakerList(body) {
    const url = this.apiBaseURI + ApiConfig.election.getElectionSpeakerList;
    return this.http.post(url, body);
  }
  getProtemSpeakerAuthList() {
    const url = this.apiBaseURI + ApiConfig.election.getProtemSpeakerAuthList;
    return this.http.get(url);
  }

  //get protem speaker by Id
  getProtemSpeakerById(id) {
    const url = this.apiBaseURI + ApiConfig.election.getProtemById;
    return this.http.get(url + `/${id}`);
  }

  getMemberList(body) {
    const url = this.environment.user_mgmnt_api_url + `/v2/users/getByUserType`;
    return this.http.put(url, body);
  }

  createBulletin(body) {
    const url = this.apiBaseURI + ApiConfig.election.protemBulletin;
    return this.http.post(url, body);
  }

  publishBulletin(id) {
    const url = this.apiBaseURI + ApiConfig.election.protemBulletin + `/${id}` + ApiConfig.election.protemBulletinPublish;
    return this.http.put(url, null);
  }

  createSpeakerElection(body) {
    const url = this.apiBaseURI + ApiConfig.election.createSpeakerElection;
    return this.http.post(url , body);
  }

  createElectionNomination(body) {
    const url = this.apiBaseURI + ApiConfig.election.createElectionNomination;
    return this.http.post(url , body);
  }

  getSpeakerElectionById(id) {
    const url = this.apiBaseURI + ApiConfig.election.getSpeakerElectionById;
    return this.http.get(url + `/${id}`);
  }

  getCreatedNominationListForMembers(id) {
    const url = this.apiBaseURI + ApiConfig.election.getCreatedNominations + `/${id}`;
    return this.http.get(url);
  }

  getPendingForConsentNomination(id) {
    const url = this.apiBaseURI + ApiConfig.election.getPendingForConsent + `/${id}`;
    return this.http.get(url);
  }

  updateNominationStatus(body) {
    const url = this.apiBaseURI + ApiConfig.election.updateNominationStatus;
    return this.http.post(url , body);
  }

  updateNominationStatusAssistant(body) {
    const url = this.apiBaseURI + ApiConfig.election.updateNominationStatusAssistant;
    return this.http.put(url , body);
  }

  generateVoteList(id) {
    const url = this.apiBaseURI + ApiConfig.election.generateVoteList + `/${id}`;
    return this.http.get(url);
  }

  getVoteListPreview(id) {
    const url = this.apiBaseURI + ApiConfig.election.getVoteListPreview + `/${id}`;
    return this.http.get(url, {responseType: 'blob'});
  }

  getBulletinById(id) {
    const url = this.apiBaseURI + ApiConfig.election.getBulletinById + `/${id}`;
    return this.http.get(url);
  }

  getAllBulletinList() {
    const url = this.apiBaseURI + ApiConfig.election.getAllBulletin;
    return this.http.get(url);
  }

  getPublishedBulletinList() {
    const url = this.apiBaseURI + ApiConfig.election.getPublishedBulletin;
    return this.http.get(url);
  }
  getAllAssembly() {
    return this.http.get<any>(
      `${this.environment.calendar_api_url}/mock/getAllAssembly`
    );
  }
  getAllSession() {
    return this.http.get<any>(
      `${this.environment.calendar_api_url}/mock/getAllSession`
    );
  }
  createPanelList(body){
    const url = this.apiBaseURI + ApiConfig.election.createPanelOfChairman;
    return this.http.post(url , body);
  }
  getPanelList(body){
    const url = this.apiBaseURI + ApiConfig.election.panelOfChairman;
    return this.http.post(url, body);
  }
  getPanelListById(id){
    const url = this.apiBaseURI + ApiConfig.election.panelList + `/${id}`;
    return this.http.get(url);
  }
  generateReading(id, type) {
    const url = this.apiBaseURI + ApiConfig.election.generateReading + `/${id}?type=${type}`;
    return this.http.put(url, null);
  }

  getReading(id) {
    const url = this.apiBaseURI + ApiConfig.election.getReading + `/${id}`;
    return this.http.get(url, null);
  }

  createFileAttachment(body) {
    const url = this.apiBaseURI + ApiConfig.election.createFileAttachment;
    return this.http.post(url, body);
  }

  getPendingForAttach(body) {
    return this.http.post(
      this.officeSectionApiBaseURI + `/documents/getPending`, body
    );
  }

  getUserForNomination(id) {
    const url = this.apiBaseURI + ApiConfig.election.getUsersForNomination + `?electionId=${id}`;
    return this.http.get(url);
  }

  requestConsent(id) {
    const url = this.apiBaseURI + ApiConfig.election.requestConsent + `/${id}`;
    return this.http.put(url, null);
  }

  submitNomination(body) {
    const url = this.apiBaseURI + ApiConfig.election.submitNomination;
    return this.http.put(url, body);
  }

  getNominationForm(id) {
    const url = this.apiBaseURI + ApiConfig.election.getNominationForm + `?nominationId=${id}`;
    return this.http.get(url, { responseType: 'blob' });
  }

  addToLOB(id) {
    const url = this.apiBaseURI + ApiConfig.election.addToLOB + `?id=${id}`;
    return this.http.post(url, null);
  }
}
