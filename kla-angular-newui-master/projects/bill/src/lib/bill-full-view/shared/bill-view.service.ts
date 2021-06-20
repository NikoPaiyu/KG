import { ApiConfig } from "../../shared/config/api.config";
import { HttpClient } from "@angular/common/http";
import { Injectable, Inject } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class BillViewService {
  apiBaseURI: string;
  environment: any;
  apiCommitteeURI: any;
  constructor(@Inject("environment") environment,private http: HttpClient) { 
      this.environment=environment
    this.apiBaseURI = this.environment.bill_api_url+ ApiConfig.basePathExt;
    this.apiCommitteeURI = this.environment.bill_api_url + ApiConfig.basePathCommittee;
  }
  getBillByBillId(billId) {
    const url = this.apiBaseURI + `/${billId}`;
    return this.http.get(url);
  }

  getSubjectCommitteeList(body) {
    const url = this.apiCommitteeURI + `/list`;
    return this.http.put(url, body);
  }

  sendToCommittee(billId, body) {
    const url = this.apiBaseURI + `/${billId}/sendtoCommittee`;
    return this.http.put(url, body);
  }
  sendToCommitteeOfficial(billId, body) {
    const url = this.apiBaseURI + `/${billId}/sendtoCommittee/official`;
    return this.http.put(url, body);
  }
  passBillByBillId(billId) {
    const url = this.apiBaseURI + `/pass/${billId}`;
    return this.http.post(url, {});
  }
  markBillasAct(billId) {
    const url = this.apiBaseURI + `/markAct/${billId}`;
    return this.http.post(url, {});
  }
  markBillFinalStatus(body) {
    const url = this.apiBaseURI + `/markBillFinalStatus`;
    return this.http.post(url, body);
  }
  sendGovernersRecommendation(body) {
    const url = this.apiBaseURI + `/send-governor-recommendation`;
    return this.http.post(url, body);
  }
}
