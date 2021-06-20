import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { environment } from '../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class CplService {

  constructor(private http: HttpClient) { }

  getAllAssembly() {
    // return this.http.get<any>(
    //   `${environment.calendar_api_url}/mock/getAllAssembly`
    // );
  }

  getAllSession() {
    // return this.http.get<any>(
    //   `${environment.calendar_api_url}/mock/getAllSession`
    // );
  }

  createFile(body) {
  }
}
