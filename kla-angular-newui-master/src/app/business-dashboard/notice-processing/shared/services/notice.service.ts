import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NoticeService {
  rbsJson = {
    modules: {}
  };
  constructor(private http: HttpClient) { }

  // get all notices with pagination
  getAllNoticeswithPage(body) {
    const url = environment.notice_processing_api + 'page';
    return this.http.post(url, body);
  }
  // get all notices with pagination
  getAllNoticeswithPageandStatus(body) {
    const url = environment.notice_processing_api + 'page/status';
    return this.http.post(url, body);
  }
  getAllNoticeswithAssemblySessionStatus(body) {
    console.log(body);
    const url = environment.notice_processing_api + 'getAll';
    return this.http.get(url, { params: body });
  }
  // get notice by userid
  getNoticeListByUserId(body) {
    const url = environment.notice_processing_api + 'page/getByUser';
    return this.http.post(url, body);
  }
  // disallow notices with file
  disallowFileNotices(fileId, body = {}) {
    const url = environment.notice_processing_api + `file/${fileId}/disallow`;
    return this.http.put(url, body);
  }
  // get permission details
  getNoticePermissions(userId) {
    if (userId) {
      const url = environment.user_mgmnt_api_url + `/rbs/getUserRoleDetails?userId=${userId}`;
      this.http.get(url).subscribe(Response => {
        this.rbsJson = Response as any;
      });
    }
  }
  // check for permission
  doIHaveAnAccess(pCategory, permission) {
    let permObj;
    permObj = this.rbsJson.modules['NOTICE_PROCESSING'];
    if (permObj) {
      if (permObj.categorys) {
        let permCategorys = permObj.categorys;
        if (permCategorys[pCategory]) {
          let permCat = permCategorys[pCategory];
          return permCat.includes(permission);
        }
      }
    }
    return false;
  }

  uploadUrl() {
    return (environment.cpl_api_url + ':8088/file/uploadImage');
  }

  getPendingForTimeAllocation() {
    const url = environment.notice_processing_api + `timeallocation/page/getAll/pending`;
    return this.http.post(url, null);
  }

  forwardForTimeAllocation(body) {
    const url = environment.table_api_url + `:8075/kla/service/v2/table/timeAllocation/forwardedBusiness`;
    return this.http.post(url, body);
  }

  getActiveAssemblySession() {
    return this.http.get(`${environment.calendar_api_url}/getActiveSession`);
  }

  getCOSDates(assembly, session) {
    return this.http.get(`${environment.calendar_api_url}/get/itemForQuestions?assemblyId=${assembly}&sessionId=${session}`);
  }

  getBusinessMapForTA() {
    const url = environment.table_api_url + `:8075/kla/service/v2/table/timeAllocation/businessTypes/map`;
    return this.http.get(url);
  }
}
