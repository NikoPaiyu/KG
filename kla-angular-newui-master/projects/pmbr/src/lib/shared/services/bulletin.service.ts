import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ApiConfig } from '../../shared/config/api.config';

@Injectable({
  providedIn: 'root'
})
export class BulletinService {
  apiBaseURI: string;
  fileApiBaseURI: string;
  environment: any;
  constructor(@Inject("environment") environment, private http: HttpClient) {
    this.environment = environment;
    this.apiBaseURI = this.environment.bill_api_url + ApiConfig.billBasePathExt;
    this.fileApiBaseURI = this.environment.file_api + ApiConfig.basePathBulletinFile;
  }
  createBulletin(data) {
    return this.http.post(`${this.apiBaseURI}${ApiConfig.bulletin.create}`, data);
  }

  getAllBulletinList() {
    return this.http.get(`${this.apiBaseURI}${ApiConfig.bulletin.list}`, {});
  }

  getBulletinById(id) {
    return this.http.get(`${this.apiBaseURI}${ApiConfig.bulletin.view}/${id}`, {});
  }

  getApprovedBulletinList() {
    return this.http.get(`${this.apiBaseURI}${ApiConfig.bulletin.approvedList}`, {});
  }

  getPublishedBulletinList() {
    return this.http.get(`${this.apiBaseURI}${ApiConfig.bulletin.publishedList}`, {});
  }
  publishBulletin(id) {
    return this.http.put(`${this.apiBaseURI}/bulletin/${id}/publish`, {});
  }
}
