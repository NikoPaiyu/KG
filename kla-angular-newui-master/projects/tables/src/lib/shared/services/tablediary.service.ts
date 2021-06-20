import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ApiConfig } from '../config/api.config';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TablediaryService {
  apiBaseURI: string;
  apiBaseURIresume : string;
  environment: any;
  reportApiUrl;
  constructor(@Inject("environment") environment,
   private http: HttpClient, @Inject('authService') private AuthService) {
    this.environment = environment;
    this.apiBaseURI = this.environment.lob_service_api_uri + ApiConfig.basePathTableDiary;
    this.apiBaseURIresume = this.environment.lob_service_api_uri + ApiConfig.basePathResume;
    this.reportApiUrl = environment.report_api_url;
  }
    //  table diary APIs
    createTableDiary(body) {
      const url = this.apiBaseURI + `/save`;
      return this.http.post<any>(url, body);
    }
    getTableDiaryList(assemblyId,sessionId){
      const url = this.apiBaseURI + `/list?assemblyId=${assemblyId}&sessionId=${sessionId}`;
      return this.http.get<any>(url);
    }
    getDiarybyId(id){
      const url = this.apiBaseURI + `/${id}`;
      return this.http.get<any>(url);
    }
    saveDiaryLines(body){
      const url = this.apiBaseURI + `/diaryline/save`;
      return this.http.post<any>(url,body);
    }
    // Socket API for BC 
    getSocket(){
      return `${this.environment.document_socket_api_url}/socket`
    }
    getStreamingFile(){
      const url = `${this.environment.document_api_url}/getCurrentBusiness`;
      return this.http.get<any>(url);
    }

    /// Bulletin part 1 APIs
    generateBulletinPart1(id) {
      const url = this.apiBaseURI + `/bulletin/generate/${id}`;
      return this.http.post<any>(url, id);
    }
    saveBulletinPart1Line(body){
      const url = this.apiBaseURI + `/bulletin/line/save`;
      return this.http.post<any>(url,body);
    }
    getListTableDiaryBulletinPart1(assemblyId,sessionId){
      const url = this.apiBaseURI + `/bulletin/list?assemblyId=${assemblyId}&sessionId=${sessionId}`;
      return this.http.get<any>(url);
    }
    getPreviewBulletinPart1byId(id){
      const url = this.apiBaseURI + `/bulletin/preview/${id}`;
      return this.http.get<any>(url);
    }
    bulletinPart1Publish(id){
      const url = this.apiBaseURI + `/bulletin/publish/${id}`;
      return this.http.get<any>(url);
    }
    getListResume(assemblyId,sessionId){
      const url = this.apiBaseURIresume + `/list?assemblyId=${assemblyId}`;
      return this.http.get<any>(url);
    }
    saveResume(body){
      const url = this.apiBaseURIresume + `/save`;
      return this.http.post<any>(url,body);
    }
    getResumeById(id){
      const url = this.apiBaseURIresume + `/${id}`;
      return this.http.get<any>(url);
    }
    publishResume(id){
      const url = this.apiBaseURIresume + `/publish/${id}`;
      return this.http.get<any>(url);
    }
    getBulletinData(id){
      const url = this.environment.bulletin_api + `/${id}`;
      return this.http.get<any>(url);
    }
    getPublishedBulletins(body){
      const url = this.environment.bulletin_api + `list/published`; 
      return this.http.put<any>(url,body);
    }
    getDiaryBulIletinByld(id){
      const url = this.apiBaseURI + `/bulletin/${id}`;
      return this.http.get<any>(url);
    }
    getListResumePublished(assemblyId,sessionId){
      const url = this.apiBaseURIresume + `/list/published?assemblyId=${assemblyId}`;
      return this.http.get<any>(url);
    }
    getAllAssemblyAndSession() {
      return this.http.get<any>(
        `${this.environment.calendar_api_url}/getAllAssemblyAndSession`
      )}
    downloadReport(htmlContent){
      const url = this.reportApiUrl + `/string-to-pdf`;
      return this.http.post(url, htmlContent, { responseType: "blob" }).pipe(
        map((res) => {
          return res;
        })
      );
    }
}
