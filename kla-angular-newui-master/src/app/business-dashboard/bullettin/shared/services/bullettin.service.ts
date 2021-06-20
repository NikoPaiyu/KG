import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: "root"
})
export class BullettinService {
  constructor(private http: HttpClient) {}

  getAllBullettinList() {
    const url = environment.bullettin_list_api + "getAll";
    return this.http.get<any>(url);
  }
  getBullettinListById(id) {
    const url = environment.bullettin_list_api + `${id}`;
    return this.http.get<any>(url);
  }
  getBullettinCurrentNumber() {
    const url =  environment.bulletin_api + `currentNumber`
    return this.http.get(url);
  }
}
