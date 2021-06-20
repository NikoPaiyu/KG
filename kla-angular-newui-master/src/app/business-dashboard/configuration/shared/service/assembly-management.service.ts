import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AssemblyManagementService {

  constructor(private http: HttpClient) { }

  getKlaSections() {
    return this.http
      .get(`${environment.departmentmangement_api_url}/getsection`)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  getAllParties() {
   const url = `${environment.departmentmangement_api_url}/getparty`
    return this.http.get(url);
  }
  createAssembly(body){
    const url = `${environment.calendar_api_url}/createAssembly`;
    return this.http.post(url, body);
  }
  createSession(body){
    const url = `${environment.calendar_api_url}/createAssemblySession`;
    return this.http.post(url, body);
  }
  getSessionForAssembly(id){
    const url = `${environment.calendar_api_url}/getAllSessionForAssembly?id=${id}`;
    return this.http.get(url);
  }
  dissolveAssembly(body){
    const url = `${environment.calendar_api_url}/dissolve/assembly`;
    return this.http.post(url, body);
  }

  setCurrentAssemblyAndSession(body) {
    const url = `${environment.calendar_api_url}/current/assemblySession`;
    return this.http.put(url, body);
  }

  activateSession(body) {
    const url = `${environment.calendar_api_url}/activateSession`;
    return this.http.post(url, body);
  }

  createDraftAssembly(body) {
    const url = `${environment.calendar_api_url}/mock/createAssembly`;
    return this.http.post(url, body);
  }

  activateAssembly(body) {
    const url = `${environment.calendar_api_url}/assembly/activate`;
    return this.http.post(url, body);
  }

  dissolveAssemblySession(body){
    const url = `${environment.calendar_api_url}/dissolve/assemblySession`;
    return this.http.post(url, body);
  }
}
