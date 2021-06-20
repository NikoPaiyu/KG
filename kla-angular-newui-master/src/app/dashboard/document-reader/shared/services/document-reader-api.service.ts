import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../../environments/environment";
import { map } from "rxjs/operators";
@Injectable({
  providedIn: "root"
})
export class DocumentReaderApiService {
  constructor(private http: HttpClient) {}
  uploadBudget(body) {
    return this.http
      .post(`${environment.document_api_url}/uploadBudget`, body, {
        reportProgress: true,
        observe: "events"
      })
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
}
