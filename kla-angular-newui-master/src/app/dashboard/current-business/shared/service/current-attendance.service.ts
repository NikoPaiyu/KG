import { Injectable } from '@angular/core';
import * as Stomp from "stompjs";
import * as SockJS from "sockjs-client";
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { AttentenceDetails } from 'src/app/business-dashboard/user-management/shared/models/userDetails';
import { HttpClient } from '@angular/common/http';
import { map } from "rxjs/operators";
@Injectable({
  providedIn: 'root'
})
export class CurrentAttendanceService {

  public serverUrl = environment.user_management_api +  'socket';
  public stompClient;
  public currentAttendanceSubject = new BehaviorSubject<Object>(new Object());
  constructor(private http: HttpClient) { }

  getCurrentAttendence() {
    return this.http
      .get<AttentenceDetails>(
        `${environment.user_mgmnt_api_url}/v1/users/member/attendance/current`
      )
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  initializeWebSocketConnection() {
    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let that = this;
    this.stompClient.connect(
      {},
      function (frame) {
        that.openCurrentAttendanceSocket();
      },
      this.errorCallBack
    );
  }

  errorCallBack(error) {
    setTimeout(() => {
      this.initializeWebSocketConnection();
    }, 5000);
  }

  disconnect() {
    if (this.stompClient && this.stompClient.connected) this.stompClient.disconnect();
  }

  openCurrentAttendanceSocket() {
    console.log('subscribe method');
    this.stompClient.subscribe("/attendance-socket/current", data => {
      if (data) {
        const response = JSON.parse(data.body);
        if (response) {
          this.currentAttendanceSubject.next(response);
        }
      }
    });
  }

}
