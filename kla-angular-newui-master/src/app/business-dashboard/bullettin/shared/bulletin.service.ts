import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BulletinService {
  rbsJson;
  reportApiUrl;
  constructor(private http: HttpClient) {
    this.reportApiUrl = environment.report_api_url;
   }

  getBulletinList() {
    const url = environment.bulletin_api + 'getAll';
    return this.http.get<any>(url);
  }
  getPermissions(userId) {
    if (userId) {
      const url = environment.user_mgmnt_api_url + `/rbs/getUserRoleDetails?userId=${userId}`;
      this.http.get(url).subscribe(Response => {
        this.rbsJson = Response as any;
      });
    }
  }
  // approve bulletin
  approveBulletin(body) {
    const url = environment.bulletin_api + 'approve';
    return this.http.put(url, body);
  }
  // check for permission
  doIHaveAnAccess(pCategory, permission) {
    let permObj;
    if (this.rbsJson) {
      permObj = this.rbsJson.modules['BULLETIN'];
      if (permObj) {
        if (permObj.categorys) {
          const permCategorys = permObj.categorys;
          if (permCategorys[pCategory]) {
            const permCat = permCategorys[pCategory];
            return permCat.includes(permission);
          }
        }
      }
    }
    return false;
  }
  getBullettinList() {
    const url = environment.bulletin_api + '/list/published';
    return this.http.get(url);
  }
  downloadReport(htmlContent){
    const url = this.reportApiUrl + `/string-to-pdf`;
    return this.http.post(url, htmlContent, { responseType: "blob" }).pipe(
      map((res) => {
        return res;
      })
    );
  }
}
