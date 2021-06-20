import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ApiConfig } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  environment: any;
  apiBaseURI: string;
  reportApiUrl: string;

  constructor(@Inject('environment') environment, private http: HttpClient) {
    this.environment = environment;
    this.apiBaseURI = this.environment.user_mgmnt_api_url;
    this.reportApiUrl = this.environment.report_api_url;
  }

  getFormsForUser() {
    const url = this.apiBaseURI + ApiConfig.form;
    return this.http.get(url);
  }

  getFormPreviewByUserandType(body) {
    const url = this.apiBaseURI + ApiConfig.getFormPreviewByUserandType;
    return this.http.post(url, body, {responseType: 'text'});
  }

  saveForm(body) {
    const url = this.apiBaseURI + ApiConfig.form;
    return this.http.post(url, body);
  }

  getAssistants(body) {
    const url = this.apiBaseURI + ApiConfig.getAssistantList;
    return this.http.post(url, body);
  }

  downloadReport(htmlContent){
    const url = this.reportApiUrl + ApiConfig.reportStringToPdf;
    return this.http.post(url, htmlContent, { responseType: 'blob' });
  }

  uploadUrl() {
    return `${this.environment.fileupload_url}/uploadImage`;
  }

  getPreviewById(id) {
    const url = this.apiBaseURI + ApiConfig.form + `/preview?formId=${id}`;
    return this.http.get(url, { responseType: 'text' });
  }

  submitForm(body) {
    const url = this.apiBaseURI + ApiConfig.form + '/submit';
    return this.http.put(url, body);
  }

  assignToAssistant(body) {
    const url = this.apiBaseURI + ApiConfig.form + '/assign';
    return this.http.put(url, body);
  }

  markAsApproved(body) {
    const url = this.apiBaseURI + ApiConfig.form + '/markApprove';
    return this.http.put(url, body);
  }

  getFormByFilter(body) {
    const url = this.apiBaseURI + ApiConfig.form + ApiConfig.getFormByFilter;
    return this.http.post(url, body);
  }

  createFormOne(body) {
    const url = this.apiBaseURI + ApiConfig.form1;
    return this.http.post(url, body);
  }
}
