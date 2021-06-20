import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConfig } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class CommitteeBulletinService {

  apiBaseURI: string;
  fileApiBaseURI: string;
  environment: any;
  constructor(@Inject("environment") environment, private http: HttpClient) {
    this.environment = environment;
    this.apiBaseURI = this.environment.bill_api_url + ApiConfig.basePathExt;
    this.fileApiBaseURI = this.environment.file_api + ApiConfig.basePathBulletinFile;
  }
  // createBulletin(data) {
  //   return this.http.post(`${this.apiBaseURI}${ApiConfig.bulletin.create}`, data);
  // }

  getAllBulletinList() {
    return this.http.get(`${this.apiBaseURI}${ApiConfig.bulletin.list}`, {});
  }

  getBulletinById(id) {
    return this.http.get(`${this.apiBaseURI}${ApiConfig.bulletin.view}/${id}`, {});
  }

  getApprovedBulletinList() {
    return this.http.get(`${this.apiBaseURI}${ApiConfig.bulletin.approvedList}`, {})
  }

  getPublishedBulletinList() {
    return this.http.get(`${this.apiBaseURI}${ApiConfig.bulletin.publishedList}`, {});
  }
  publishBulletin(id) {
    return this.http.put(`${this.fileApiBaseURI}${ApiConfig.bulletin.publish}/${id}`, {});
  }
}
