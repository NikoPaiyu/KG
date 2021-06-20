import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ApiConfig } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class TemplateServiceService {
  environment: any;
  apiBaseURI: string;

  constructor(@Inject('environment') environment, private http: HttpClient) {
    this.environment = environment;
    this.apiBaseURI = this.environment.cpl_api_url + ApiConfig.basePathDocuments;
  }

  getAllTemplate(body) {
    return this.http.post(
      this.apiBaseURI +
      ApiConfig.documents.getAllTemplate,
      body
    );
  }

  deleteTemplate(templateId) {
    return this.http.delete(
      this.apiBaseURI +
      ApiConfig.documents.deleteTemplate +
      `?templateId=${templateId}`
    );
  }

  saveTemplateWithInputs(body) {
    return this.http.post(
      this.apiBaseURI +
      ApiConfig.documents.saveTemplateWithInputs,
      body
    );
  }

  getAllBusinessByType(type) {
    return this.http.get(
      this.apiBaseURI +
      ApiConfig.documents.getAllBusinessByType + `?category=${type}`
    );
  }

  getTemplateInputTypes() {
    return this.http.get(
      this.apiBaseURI +
      ApiConfig.documents.getAllInputType);
    }
  getTemplateById(templateId){
    return this.http.delete(
      this.apiBaseURI +
      ApiConfig.documents.getTemplateById +
      `?templateId=${templateId}`
    );
  }
}
