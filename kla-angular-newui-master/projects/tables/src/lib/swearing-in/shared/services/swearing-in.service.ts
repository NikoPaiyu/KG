import { HttpClient, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class SwearingInService {
  environment: any;
  apiBaseURI: string;
  reportApiUrl: string;

  constructor(@Inject("environment") environment, private http: HttpClient) {
    this.environment = environment;
    this.apiBaseURI = this.environment.user_mgmnt_api_url;
    this.reportApiUrl = this.environment.report_api_url;
  }

  getSwearingInList(id) {
    const url =
      this.apiBaseURI +
      `/v1/users/election/getListForSweringIn?electionId=${id}`;
    return this.http.get(url);
  }

  getAssemblyElectionList() {
    const url = this.apiBaseURI + "/v1/users/election";
    return this.http.get(url);
  }

  submitOathForm(body) {
    const url = this.apiBaseURI + "/v1/users/election/updateOathForm";
    return this.http.put(url, body);
  }

  markAsSwornIn(body) {
    const url = this.apiBaseURI + "/v1/users/election/maskAsSwornIn";
    return this.http.put(url, body);
  }

  addToLOB(body) {
    const url = this.apiBaseURI + "/v1/users/election/sendToLob";
    return this.http.put(url, body);
  }

  swearingInCompleted(body) {
    const url = this.apiBaseURI + "/v1/users/election/swearing/complete";
    return this.http.put(url, body);
  }
  swornReport(id) {
    const url =
      this.apiBaseURI +
      `/v1/users/election/getSwornMembersReport?electionId=${id}`;
    return this.http.get(url, { responseType: "text" }).pipe(
      map((res) => {
        return res;
      })
    );
  }
  getPreviewById(id) {
    const url = this.apiBaseURI +`/v1/users/form/preview?formId=${id}`;
    return this.http.get(url, { responseType: 'text' });
  }
  downloadReport(htmlContent){
    const url = this.reportApiUrl + `/string-to-pdf`;
    return this.http.post(url, htmlContent, { responseType: 'blob' });
  }
}
