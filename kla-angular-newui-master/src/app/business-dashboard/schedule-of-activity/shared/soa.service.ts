import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root"
})
export class SoaService {
  constructor(private http: HttpClient) {}

  getScheduleOfActivity() {
    return this.http.get(`${environment.question_api_url}soa/16`);
  }

  setScheduleOfActivity(editedSoa, id: number) {
    console.log('inside service page ' , editedSoa);
    return this.http.post(`${environment.question_api_url}soa/save`, editedSoa);
  }
}



