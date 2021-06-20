import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: "root"
})
export class RulesAndDirectionsService {
  getListOfRulesAndDirections(value) {
    return this.http.get(`http://45.249.111.150:8089/kla/service/v1/departmentMangement/${value}/QUESTIONS`).pipe(
        map(res => {
          return res;
        })
      );
  }
  constructor(private http: HttpClient) {}
}
