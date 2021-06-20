import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ApiConfig } from '../config/api.config';
import { Subject, forkJoin } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class BudgetSpeechService {
  apiBaseURI: string;
  environment: any;
  rbsJson = {
    modules: {}
  };
  constructor(@Inject("environment") environment, private http: HttpClient, @Inject('authService') private AuthService) {
    this.environment = environment;
    this.apiBaseURI = this.environment.table_api_url + ApiConfig.basePathExt;
  }

  // create budget speech
  saveSubmitBudgetSpeech(formData, type) {
    let fileUploadArray = [];
    let url = this.apiBaseURI + ApiConfig.budgetspeech.save;
    if (type === 'SUBMIT') {
      url = this.apiBaseURI + ApiConfig.budgetspeech.submit;
    }
    if (formData.budgetUrl && formData.budgetUrl.uid && formData.budgetUrl.uid != -1) {
      fileUploadArray.push(this.uploadFile(formData));
      forkJoin(fileUploadArray).subscribe((res: any) => {
        this._rebuildFormData(formData, res);
        return this.http.post(`${url}`, formData).pipe(map(res => res)).subscribe(res => { });
      });
    } else {
      return this.http.post<any>(url, formData);
    }
  }
  _rebuildFormData(formData, file) {
    formData.budgetUrl = file && file[0] ? file[0].body : "";
  }
  // get budget speech by id
  getBudgetSpeechById(bId) {
    const url = this.apiBaseURI + ApiConfig.budgetspeech.getById;
    return this.http.get<any>(url + `/${bId}`);
  }
  // get all budget speech
  getAllBudgetSpeech() {
    const url = this.apiBaseURI + ApiConfig.budgetspeech.list;
    return this.http.get<any>(url);
  }
  // get all published budget speech
  getAllPublishedBudgetSpeech(paginationParams) {
    let  url = this.apiBaseURI + ApiConfig.budgetspeech.publishedlist;
    url += this._appendPaginationParams(paginationParams)
    return this.http.get<any>(url);
  }
  getSDFGByLineId() {
    const url = this.apiBaseURI + ApiConfig.budgetspeech.publishedlist;
    return this.http.get<any>(url);
  }
  getSDFGById() {
    const url = this.apiBaseURI + ApiConfig.budgetspeech.publishedlist;
    return this.http.get<any>(url);
  }
  setToLob(obituaryId) {
    const url = this.apiBaseURI + `/obituary/uploadToLob/${obituaryId}`;
    return this.http.put<any>(url, {});
  }
  uploadFile(form) {
    const formData = new FormData();
    formData.append("file", form.budgetUrl);
    // formData.append("assemblyId",form.assemblyId);
    // formData.append("sessionId",form.sessionId);
    // formData.append("business","BUDGET");
    // formData.append('date','2021-01-25');
    return this.http.post(
      `${this.environment.fileupload_url}/uploadImage`,
      formData
    );
  }


  // time allocation starts
  generateTA(body){
    const url = this.apiBaseURI + ApiConfig.budgetspeech.timeAllocation.generate;
    return this.http.post<any>(url, body);
  }
  saveTA(body){
    const url = this.apiBaseURI + ApiConfig.budgetspeech.timeAllocation.save;
    return this.http.post<any>(url, body);
  }
  submitTA(body){
    const url = this.apiBaseURI + ApiConfig.budgetspeech.timeAllocation.submit+ `?fileId=${body.fileId}&type=${body.type}`;
    return this.http.get<any>(url, body);
  }
  getByFileIdAndDay(day, fileId, type) {
    const url = this.apiBaseURI + ApiConfig.budgetspeech.timeAllocation.getByFileIdAndDay + `?day=${day}&fileId=${fileId}&type=${type}`;
    return this.http.get<any>(url);
  }
  getTimeByFileIdAndDay(day, fileId, type) {
    const url = this.apiBaseURI + ApiConfig.budgetspeech.timeAllocation.getTimeByFileIdAndDay + `?day=${day}&fileId=${fileId}&type=${type}`;
    return this.http.get<any>(url);
  }
  getDayAndDates(fileId, type) {
    const url = this.apiBaseURI + ApiConfig.budgetspeech.timeAllocation.getDayAndDates + `?fileId=${fileId}&type=${type}`;
    return this.http.get<any>(url);
  }
  setTAToLOB(body) {
    const url = this.apiBaseURI + ApiConfig.budgetspeech.timeAllocation.setToLOB;
    return this.http.post<any>(url, body);
  }
  getTimeAllocationMember(masterId) {
    const url = this.apiBaseURI + ApiConfig.budgetspeech.timeAllocation.getTimeAllocationMember + `?masterId=${masterId}`;
    return this.http.get<any>(url);
  }
  _appendPaginationParams(paginationParams) {
    let page = '';
    if(paginationParams) {
      page =  (`?limit=${paginationParams.numberOfItem}&page=${paginationParams.pageIndex}`)
    }
    return page;
  }
  // ends
}
