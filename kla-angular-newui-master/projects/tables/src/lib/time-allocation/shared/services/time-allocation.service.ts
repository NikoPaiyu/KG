import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ApiConfig } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class TimeAllocationService {
  apiBaseURI: string;
  environment: any;
  constructor(@Inject("environment") environment,
   private http: HttpClient, @Inject('authService') private AuthService) {
    this.environment = environment;
    this.apiBaseURI = this.environment.table_api_url + ApiConfig.basePathTableVersion2;
  }

  generateTA(body){
    const url = this.apiBaseURI + ApiConfig.timeAllocation.generate;
    return this.http.post<any>(url, body);
  }
  saveTA(body){
    const url = this.apiBaseURI + ApiConfig.timeAllocation.save;
    return this.http.post<any>(url, body);
  }
  submitTA(body){
    const url = this.apiBaseURI + ApiConfig.timeAllocation.submit;
    return this.http.get<any>(url, body);
  }
  getDayAndDates(businessId){
    const url = this.apiBaseURI + ApiConfig.timeAllocation.getDayAndDates +`?businessId=${businessId}`;
    return this.http.get<any>(url);
  }
  getByBusinessIdAndDay(businessId,day){
    const url = this.apiBaseURI + ApiConfig.timeAllocation.getByBusinessIdAndDay +`?businessId=${businessId}&day=${day}`;
    return this.http.get<any>(url);
  }
  getBuisnessDetailsById(businessId){
    const url = this.apiBaseURI + ApiConfig.timeAllocation.buisnessDetails +`?businessId=${businessId}`;
    return this.http.get<any>(url);
  }
  getMemberTimeAllocation(businessId,day){
    const url = this.apiBaseURI + ApiConfig.timeAllocation.getMemberAllocation +`?businessId=${businessId}&day=${day}`;
    return this.http.get<any>(url);
  }
  getAllPendingBusiness(body) {
    const url = this.apiBaseURI + ApiConfig.timeAllocation.getPendingBusiness;
    return this.http.post<any>(url, body);
  }

  getAssistants(body){
    return this.http.post(`${this.environment.user_mgmnt_api_url}/v1/users/member/getNonMembers`, body);
  }

  assignToAssistant(body, userId) {
    const url = this.apiBaseURI + ApiConfig.timeAllocation.assignToAssistant + `?userId=${userId}`;
    return this.http.post<any>(url, body);
  }
  addToLOB(body){
    const url = this.apiBaseURI + ApiConfig.timeAllocation.uploadToLOB;
    return this.http.post<any>(url, body);
  }
}
