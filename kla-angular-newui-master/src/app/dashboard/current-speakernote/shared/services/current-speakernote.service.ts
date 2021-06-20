import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { currentBusiness } from "src/app/dashboard/current-business/shared/model/livescreenmodel";
import { map } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
@Injectable({
  providedIn: "root"
})
export class CurrentSpeakernoteService {
  constructor(private http: HttpClient) {}
  getStreamingSpeakerNote() {
    return this.http
      .get(`${environment.document_api_url}/currentSpeakerNote`)
      .pipe(
        map(res => {
          return res;
        })
      );
  }
  pageChangeHandler(index) {
    return this.http
      .post(
        `${environment.document_api_url}/changeSpeakerNoteIndex/` + index,
        {}
      )
      .pipe(
        map(res => {
          return res;
        })
      );
  }
}
