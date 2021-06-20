import { Injectable } from "@angular/core";
import { environment } from "../../../../../environments/environment";
import * as Stomp from "stompjs";
import * as SockJS from "sockjs-client";
import { HttpClient } from "@angular/common/http";
import { NzModalService } from "ng-zorro-antd";
import { VotingResultComponent } from "../../voting-result/voting-result.component";
import { CastVoteComponent } from "../../cast-vote/cast-vote.component";
import { BehaviorSubject } from "rxjs";
import { AuthService } from "src/app/auth/shared/services/auth.service";
import { distinctUntilChanged } from "rxjs/operators";
import { CommonService } from 'src/app/shared/services/common.service';
import { SpeakerRBSService } from 'src/app/dashboard/shared/services/speaker-rbs.service';
import { TranslateService } from '@ngx-translate/core';
@Injectable()
export class VoteSocketService {
  public serverUrl = `${environment.vote_url}/socket`;
  public stompClient;
  public voteInitiationEventId;
  public voteResultEventId;
  public currentVoteSubject = new BehaviorSubject<Object>(new Object());
  public currentVote = this.currentVoteSubject
    .asObservable()
    .pipe(distinctUntilChanged());
  speakermsg: any;
  dataEqual: boolean = false;
  title: string;
  userData;
  newActiveSpeaker;
  noTrigger: boolean = false;
  noTrigger2: boolean = false;
  activeSpeaker: any;
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private rbsSerive: SpeakerRBSService,
    private modalService: NzModalService,
    private translate: TranslateService,
  ) {
  }


  initializeWebSocketConnection() {
    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let that = this;
    this.stompClient.connect(
      {},
      function (frame) {

        that.openInitiateVoteSocket();
        that.openVoteResultsSocket();
      },
      this.errorCallBack
    );
  }
  isVoteRequired() {
    let flag = true;

    return flag;
  }

  errorCallBack(error) {
    setTimeout(() => {
      this.initializeWebSocketConnection();
    }, 5000);
  }

  disconnect() {
    if (this.stompClient && this.stompClient.connected) this.stompClient.disconnect();
  }

  openInitiateVoteSocket() {
    this.authService.getConfigFileDetails().subscribe(res => {
      if (!res.voteNoteRequiredUserIds || !res.voteNoteRequiredUserIds.includes(this.authService.getCurrentUser().userId)) {
        var s = this.stompClient.subscribe("/vote-socket/initiateVote", message => {
          this.initiateVote(message, false);
          this.speakermsg = message;
        });
        localStorage.setItem("voteCurrentConnection", s);
      }
    })
  }

  openVoteResultsSocket() {
    this.stompClient.subscribe("/vote-socket/voteResults", message => {
      if (!this.noTrigger2) {
        this.handleVoteResults(message);
      } else if (this.noTrigger && !this.noTrigger2) {
        this.handleVoteResults(message);
      }
    });
  }

  initiateVote(data, dataEqual) {
    let body = JSON.parse(data.body);
    if (body) {
      if (dataEqual == true && (this.isSpeaker() || this.isNewActiveSpeaker())) {
        this.displayCastVoteModal(body);
      }
      if (body.id != this.voteInitiationEventId && sessionStorage.getItem("authToken") && this.isMLA() &&
        (!this.isSpeaker() && !this.isNewActiveSpeaker())
      ) {
        // this.noTrigger = false;
        // this.noTrigger2 = false;
        this.displayCastVoteModal(body);
      }
      this.voteInitiationEventId = body.id;
      this.dataEqual = false;
    }
  }

  handleVoteResults(message) {
    let body = JSON.parse(message.body);
    if (body && (this.voteInitiationEventId === body.voteEventId) && sessionStorage.getItem('authToken') && this.isMLA()) {
      this.dataEqual = (body.totalYes === body.totalNo && (body.totalYes + body.totalNo != 0));
      if ((this.isSpeaker() || this.isNewActiveSpeaker()) && !body.finalResult) {
        this.title = this.translate.instant('dashboard.vote.progress');
        this.displayVotingResultModal(body);
      }
      if ((!this.isSpeaker() && !this.isNewActiveSpeaker()) && body.finalResult && this.dataEqual) {
        this.initiateVote(this.speakermsg, this.dataEqual);
        this.dataEqual = false;
        // debugger;
        // this.noTrigger = true;  //temporary fix
      }
      if ((this.isSpeaker() || this.isNewActiveSpeaker()) && body.finalResult && this.dataEqual) {
        this.initiateVote(this.speakermsg, this.dataEqual);
        this.dataEqual = false;
        // debugger;
        // this.noTrigger = true;  //temporary fix
      } else if ((this.isSpeaker() || this.isNewActiveSpeaker()) && body.finalResult && !this.dataEqual) {
        this.title = this.translate.instant('dashboard.vote.result');
        this.displayVotingResultModal(body);
        // debugger;
        // this.noTrigger2 = true; //temporary fix
      } else if ((!this.isSpeaker() && !this.isNewActiveSpeaker()) && body.finalResult && !this.dataEqual) {
        this.title = this.translate.instant('dashboard.vote.result');
        this.displayVotingResultModal(body);
        // debugger;
        // this.noTrigger2 = true; //temporary fix
      }
    }
  }

  displayVotingResultModal(result?: any) {
    this.modalService.closeAll();
    if (result.voteEventId) {
      this.modalService.create({
        nzWidth: 1100,
        nzTitle: this.title,
        nzContent: VotingResultComponent,
        nzFooter: null,
        nzMaskClosable: false,
        nzComponentParams: {
          votingResults: result
        }
      });
    }
  }

  displayCastVoteModal(voteParticulars?: any) {
    this.modalService.closeAll();
    this.modalService.create({
      nzTitle: null,
      nzContent: CastVoteComponent,
      nzClosable: false,
      nzMaskClosable: false,
      nzComponentParams: {
        voteParticulars: voteParticulars
      }
    });
  }

  isMLA() {
    if (this.authService.getCurrentUser().authorities.includes("MLA")) {
      return true;
    }
    return false;
  }

  isSpeaker() {
    if (this.authService.getCurrentUser().authorities.includes("speaker")) {
      return true;
    }
    return false;
  }

  isNewActiveSpeaker() {
    this.activeSpeaker = this.authService.getCurrentUser().rbsRole.find(roleName =>
      roleName.role.name == 'NewActiveSpeaker');
    if (this.activeSpeaker) {
      return true;
    }
    return false;
  }

}