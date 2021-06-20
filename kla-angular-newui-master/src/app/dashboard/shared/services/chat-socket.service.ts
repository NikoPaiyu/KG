import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import * as Stomp from "stompjs";
import * as SockJS from "sockjs-client";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import { BehaviorSubject } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";
import { NotificationCustomService } from "src/app/shared/services/notification.service";
@Injectable()
export class ChatSocketService {
  public messages = new BehaviorSubject<any>(Object);
  public messageForChatScreen = new BehaviorSubject<any>(Object);
  public currentMeaage = this.messages
    .asObservable()
    .pipe(distinctUntilChanged());
  serverUrl = environment.chat_api_url + "/socket";
  stompClient;
  chats = null;
  currentUserChats = null;
  constructor(private notify: NotificationCustomService) { }

  initializeWebSocketConnection(userName) {
    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let that = this;
    this.stompClient.connect({}, function (frame) {
      that.openGlobalSocket(userName);
    });
  }

  errorCallBack(userName) {
    setTimeout(() => {
      this.initializeWebSocketConnection(userName);
    }, 5000);
  }

  disconnect() {
    if (this.stompClient) this.stompClient.disconnect();
  }
  openGlobalSocket(userName) {
    this.stompClient.subscribe("/socket-publisher/" + userName, message => {
      this.handleResult(message, userName);
    });
  }

  handleResult(message, userName) {
    let body = JSON.parse(message.body);
    let chat = {
      sendTo: body.sendTo,
      sendBy: body.sendBy,
      message: body.message,
      read: body.read,
      id: body.id,
      createDate: body.createDate,
      important: body.important,
      image: body.image,
      isImg: body.isImg
    };
    this.notify.clearAll();
    if (chat.important && chat.sendTo == userName) {
      this.notify.showInformation("New Important Message Received.", "");
    }

    this.chats = chat;
    this.currentUserChatItems(userName);
  }
  currentUserChatItems(userId) {
    if (this.chats.sendBy == userId || this.chats.sendTo == userId) {
      this.currentUserChats = this.chats;
      this.messages.next(this.currentUserChats);
      this.messageForChatScreen.next(this.currentUserChats);
    }
  }
}
