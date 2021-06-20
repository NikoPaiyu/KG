import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import * as Stomp from "stompjs";
import * as SockJS from "sockjs-client";
import { HttpClient } from "@angular/common/http";
import { NzModalService, NzDrawerService, NzDrawerRef } from "ng-zorro-antd";
import { AuthService } from "../../../auth/shared/services/auth.service";
import { PdfViewerComponent } from "src/app/shared/components/pdf-viewer/pdf-viewer.component";
import { BehaviorSubject } from "rxjs";
import {SpeakerRBSService } from '../services/speaker-rbs.service';
import { NotificationCustomService } from "src/app/shared/services/notification.service";
@Injectable()
export class SpeakerNoteService {
  public serverUrl = `${environment.document_socket_api_url}/socket`;
  public stompClient;
  public voteInitiationEventId;
  public voteResultEventId;
  public drawerRef;
  private responsedocChangeorNot = new BehaviorSubject<string>("");
  public responseSupplimentaryQuestion = new BehaviorSubject<any>([]);
  supplimentaryQustionList = this.responseSupplimentaryQuestion.asObservable();
  public userId = "";
  rbsroles;
  constructor(
    public http: HttpClient,
    public modalService: NzModalService,
    private drawerService: NzDrawerService,
    private authService: AuthService,
    private rbsService: SpeakerRBSService,
    public notify: NotificationCustomService,
  ) {
    this.userId = this.authService.getCurrentUser().userId;
  }

  initializeWebSocketConnection() {
    if (this.isSpeaker|| this.isSecretaryOrPs()) {
      let ws = new SockJS(this.serverUrl);
      this.stompClient = Stomp.over(ws);
      let that = this;
      this.stompClient.connect(
        {},
        function(frame) {
          that.supplimentaryQuestion();
        },
        this.errorCallBack
      );
    }
  }

  initializeSpeakerNoteSocketConnection() {
    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let that = this;
    this.stompClient.connect(
      {},
      function(frame) {
        that.openInitiateSocket();
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
    if (this.stompClient) this.stompClient.disconnect();
  }

  openInitiateSocket() {
    var s = this.stompClient.subscribe(
      "/session-socket/speakerNote",
      message => {
        this.handleResult(message.body);
      }
    );
  }
  handleResult(data) {
    let body = data;
    if (body) {
      if (sessionStorage.getItem("authToken") && this.isSpeakerNoteRole())
        this.displayModal(body);
    }
  }

  supplimentaryQuestion() {
    var s = this.stompClient.subscribe(
      "/session-socket/supplementaryQuestion",
      message => {
        this.handleSupplimentaryQuestion(message.body);
      }
    );
  }
  handleSupplimentaryQuestion(data) {
    let body = JSON.parse(data);
    if (body) {
      this.responseSupplimentaryQuestion.next(body);
    }
  }

  displayModal(url?: any) {
    if (this.drawerRef) {
      // this.drawerRef.close();
    }
    const drawerRef = this.drawerService.create<
      PdfViewerComponent,
      { url: string },
      string
    >({
      nzContent: PdfViewerComponent,
      nzContentParams: {
        url: url
      }
    });
    this.drawerRef = drawerRef;
  }
  isSpeaker() {
    this.rbsService.getrbsrole(this.userId).subscribe((res: any) => {
      this.rbsroles= res.find(roleName => roleName.role.name == "Speaker" || roleName.role.name == "NewActiveSpeaker"||roleName.role.name=="secretary"||roleName.role.name=="PrivateSecretaryToSpeaker");
    if (this.rbsroles) {
      return true;
    }
    return false;
  })
}
   isSecretaryOrPs() {
    this.rbsService.getrbsrole(this.userId).subscribe((res: any) => {
      this.rbsroles= res.find(roleName => roleName.role.name == "Speaker" || roleName.role.name == "NewActiveSpeaker"||roleName.role.name=="secretary"||roleName.role.name=="PrivateSecretaryToSpeaker");
    if (this.rbsroles) {
      return true;
    }
    return false;
  })
  }
  isSpeakerNoteRole() {
    if (this.authService.getCurrentUser().authorities.includes("speakerNote")) {
      return true;
    }
    return false;
  }
  initializedocchangenotificationsocket() {
  
    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let that = this;
    this.stompClient.connect(
      {},
      function (frame) {
        that.ckeckdocIsChanged();
        
      },
      this.errorCallBackdoc
    );
    
  }
  errorCallBackdoc(error) {
    setTimeout(() => {
      this.initializedocchangenotificationsocket();
    }, 5000);
  }
  ckeckdocIsChanged() {
    
    var s = this.stompClient.subscribe("/session-socket/newDocCreate", message => {
     // this.hnagledocChangedResults(message);
      this.notify.showSuccess("Notification", 'new document uploaded');
    //  console.log(message);
      
    });
  }
  //function to handle the result
  hnagledocChangedResults(data) {
    this.responsedocChangeorNot.next(data.body);
    console.log(data.body)
    
  }

}
