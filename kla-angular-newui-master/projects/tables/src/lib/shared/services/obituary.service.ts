import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ApiConfig } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class ObituaryService {
  apiBaseURI: string;
  environment: any;
  rbsJson = {
    modules: {}
  };
  constructor(@Inject("environment") environment, private http: HttpClient, @Inject('authService') private AuthService) {
    this.environment = environment;
    this.apiBaseURI = this.environment.table_api_url + ApiConfig.basePathExt;
  }

  // create obituary
  createObituary(body) {
    const url = this.apiBaseURI + '/obituary';
    return this.http.post<any>(url, body);
  }
  // get obituary by id
  getObituaryById(obituaryId) {
    const url = this.apiBaseURI + `/obituary?obituaryId=${obituaryId}`;
    return this.http.get<any>(url);
  }
  // get all obituary
  getAllObituary() {
    const url = this.apiBaseURI + '/obituary/all';
    return this.http.get<any>(url);
  }
  // update Obituary
  updateObituary(body) {
    const url = this.apiBaseURI + '/obituary/update';
    return this.http.put<any>(url, body);
  }
  setToLob(obituaryId){
    const url = this.apiBaseURI + `/obituary/uploadToLob/${obituaryId}`;
    return this.http.put<any>(url, {});
  }
  // obituary preview
  getObituaryPreview(obituaryId) {
    const url = this.apiBaseURI + `/obituary/preview/${obituaryId}`;
    return this.http.get(url, { responseType: 'text'});
  }
  buildUpdateRequest(obituary, action) {
    const body = {
      documents: obituary.documents,
      id: obituary.id,
      note: obituary.note || '',
      operation: action
    };
    return body;
  }
  finalizeVersion(fileId){
    const url = this.apiBaseURI + `/obituary/finalizeVersion/${fileId}`;
    return this.http.put<any>(url, {});
  }
  async compareObituary(obituaryDetails) {
    const data = await this.getObituaryById(obituaryDetails.id).toPromise();
    const oldObituaryDetails = data.obituary;
    if (oldObituaryDetails.note !== obituaryDetails.note) {
      console.log('note');
      return true;
    }
    if (
      JSON.stringify(oldObituaryDetails.documents) !==
      JSON.stringify(obituaryDetails.documents)
    ) {
      console.log('docs');
      return true;
    }
    const currentGist = obituaryDetails.gists;
    const oldGists = oldObituaryDetails.gists;
    if (
      currentGist &&
      currentGist.length > 0 &&
      oldGists &&
      oldGists.length > 0
    ) {
      if (currentGist.length !== oldGists.length) {
        console.log('gist count');
        return true;
      }
      let i = currentGist.length - 1;
      while (i > -1) {
        const x = currentGist[i];
        const y = oldGists[i];
        if (
          x.bio !== y.bio ||
          x.delete !== y.delete ||
          x.fileName !== y.fileName ||
          x.id !== y.id ||
          x.image !== y.image ||
          x.letterStatus !== y.letterStatus ||
          x.lifeTime !== y.lifeTime ||
          x.name !== y.name ||
          x.obituaryId !== y.obituaryId ||
          x.status !== y.status
        ) {
          break;
        }
        i--;
      }
      if (i > -1) {
        console.log('gist');
        return true;
      }
    }
    return false;
  }
}
