import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConfig } from '../../../shared/config/api.config';
@Injectable({
  providedIn: 'root'
})
export class AgendaServiceService {
  environment: any;
  apiBaseURI: string;
  apiBaseURI1: string;
  apiBaseURI2: string;
  constructor(@Inject("environment") environment, private http: HttpClient) {
    this.environment = environment;
    this.apiBaseURI = this.environment.committee_api_url + ApiConfig.basePathExt;
    this.apiBaseURI1 = this.environment.committee_api_url + ApiConfig.agendaPath;
    this.apiBaseURI2 = this.environment.committee_api_url + ApiConfig.basePathBill
   }
   agendaType() {
    return this.http.get(this.apiBaseURI + `/agendaType`);
  }
  venueDetails(){
    return this.http.get(this.apiBaseURI + `/venue`);
  }
  activeSession(){
    return this.http.get(this.apiBaseURI1 + `/getActiveSession`);
  }
  agendaList(){
    return this.http.get(this.apiBaseURI + ApiConfig.meeting.list);
  }
  billList(body){
    return this.http.post(this.apiBaseURI2 + `/bill/list`, body);
  }
  resolutionList(body){
    return this.http.post(this.apiBaseURI2 + `/resolution/list`, body);
  }
  resolutionName(assemblyId,sessionId){
    return this.http.get(this.apiBaseURI2 + `/schedule/lotting/ballotResultBySeesion?assemblyId=${assemblyId}&sessionId=${sessionId}` );
  }
}
