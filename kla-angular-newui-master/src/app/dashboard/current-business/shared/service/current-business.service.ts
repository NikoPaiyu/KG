import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../../environments/environment";
import { map } from "rxjs/operators";
import { currentBusiness } from "../model/livescreenmodel";
import { BehaviorSubject } from "rxjs";
@Injectable({
  providedIn: "root"
})
export class CurrentBusinessService {
  public responseMessage = new BehaviorSubject<any>([]);
  messageBody = this.responseMessage.asObservable();

  constructor(private http: HttpClient) {}
  getStreamingFile() {
    return this.http
      .get<currentBusiness>(
        `${environment.document_api_url}/getCurrentBusiness`
      )
      .pipe(
        map(res => {
          return res;
        })
      );
  }
  pageChangeHandler(index) {
    return this.http
      .post(`${environment.document_api_url}/changeIndex/` + index, {})
      .pipe(
        map(res => {
          return res;
        })
      );
  }
  handRiseHandler(userID) {
    return this.http
      .post(`${environment.document_api_url}/handRise/${userID}`, {})
      .pipe(
        map(res => {
          return res;
        })
      );
  }
  handRiseRequestDetails() {
    return this.http
      .get(`${environment.document_api_url}/handriseRequest`)
      .pipe(
        map(res => {
          if (res) this.responseMessage.next(res);
        })
      );
  }
  handRiseRequestAccept(requestID) {
    return this.http
      .post(`${environment.document_api_url}/attendRequest/${requestID}`, {})
      .pipe(
        map(res => {
          return res;
        })
      );
  }
  clearAllHandRiseRequest() {
    return this.http
      .delete(`${environment.document_api_url}/handriseRequest/clearAll`)
      .pipe(
        map(res => {
          return res;
        })
      );
  }
}
