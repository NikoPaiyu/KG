import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConfig } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class BillNoticeService {
  environment: any;
  apiBaseURI;
  constructor(private http: HttpClient, @Inject('environment') environment, @Inject('authService') private AuthService) {
    this.environment = environment;
    this.apiBaseURI = this.environment.bill_api_url + ApiConfig.basePathExt;
  }
  // load notice template
  loadNoticeTemplate() {
    const url = '/assets/notice-templates/bill-notice.html';
    return this.http.get(url, {responseType: 'text'});
  }
  getNoticeNameByType(noticeType, billDetails) {
    const notices = [{
      type: 'objection',
      nameMl: billDetails.blocks[0].content
    }, {
      type: 'ordinance',
      nameMl: 'ഓർഡിനൻസ് നിരസിക്കൽ'
    }];
    const data = notices.find(x => x.type === noticeType);
    if (data) {
      return data.nameMl;
    }
    return null;
  }
  getMyPartyMembers(userId) {
    const url = `${this.environment.question_api_url}consents/getMyParty?userId=${userId}`;
    return this.http.get(url);
  }
  submitObjectIntrodution(body) {
    const url = this.apiBaseURI + '/objection/introduction';
    return this.http.post(url, body);
  }
  submitOrdinanceDisapproval(body) {
    const url = this.apiBaseURI + '/ordinanceDisapproval';
    return this.http.post(url, body);
  }
  getMemberByPpo(billId, noticeType) {
    if (noticeType === 'ordinance') {
      noticeType = 'ORDINANCE_DISAPPROVAL';
    }
    if (noticeType === 'objection') {
      noticeType = 'OBJECTION_TO_INTRODCTION';
    }
    const url = this.apiBaseURI + `/${billId}/permitted/user/notice/creation?type=${noticeType}`;
    return this.http.get<any>(url);
  }
}
