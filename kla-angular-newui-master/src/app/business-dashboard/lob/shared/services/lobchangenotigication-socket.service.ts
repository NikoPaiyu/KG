import { Injectable } from "@angular/core";
import { environment } from "../../../../../environments/environment";
import * as Stomp from "stompjs";
import * as SockJS from "sockjs-client";
import { BehaviorSubject } from "rxjs";
@Injectable({
  providedIn: "root"
})
export class LobchangenotigicationSocketService {
  public serverUrl = `${environment.document_socket_api_url}/socket`;
  public stompClient;

  //behaviour subject for check whether the lob data change or not
  private responseLobChangeorNot = new BehaviorSubject<string>("");
  lobChangeOrNot = this.responseLobChangeorNot.asObservable();

  constructor() { }

  initializelobchangenotificationsocket() {
    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let that = this;
    this.stompClient.connect(
      {},
      function (frame) {
        that.ckeckLobIsChanged();
      },
      this.errorCallBack
    );
  }
  //function to error call back
  errorCallBack(error) {
    setTimeout(() => {
      this.initializelobchangenotificationsocket();
    }, 5000);
  }
  //function to disconnect socket
  disconnect() {
    if (this.stompClient && this.stompClient.connected) this.stompClient.disconnect();
    this.responseLobChangeorNot.next("");
  }

  //function to losten whether lob change or note
  ckeckLobIsChanged() {
    var s = this.stompClient.subscribe("/session-socket/lobChange", message => {
      this.hnagleLobChangedResults(message);
    });
  }
  //function to handle the result
  hnagleLobChangedResults(data) {
    this.responseLobChangeorNot.next(data.body);
  }
}
