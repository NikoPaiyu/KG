import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  constructor(private http: HttpClient) { }

  getConstituency(body){
    const url = `${environment.departmentmangement_api_url}/getAllData`;
    return this.http.post(url, body);
  }
}
