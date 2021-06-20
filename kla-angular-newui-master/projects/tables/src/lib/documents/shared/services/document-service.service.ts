import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ApiConfig } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class DocumentServiceService {
  environment: any;
  apiBaseURI: string;

  constructor(@Inject('environment') environment, private http: HttpClient) {
    this.environment = environment;
    this.apiBaseURI = this.environment.cpl_api_url + ApiConfig.basePathDocuments;
  }

  getDocumentList(body) {
    return this.http.get(
      this.apiBaseURI +
      ApiConfig.documents.getDocumentList
    );
  }

}
