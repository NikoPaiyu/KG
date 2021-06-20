import { Component, OnInit, Input } from "@angular/core";
import { VotingService } from "../shared/services/voting.service";
import { NzModalRef } from "ng-zorro-antd";
import { AuthService } from "src/app/auth/shared/services/auth.service";
import { NotificationCustomService } from "src/app/shared/services/notification.service";
import { TranslateService } from "@ngx-translate/core";
import { SpeakerRBSService } from 'src/app/dashboard/shared/services/speaker-rbs.service';

@Component({
  selector: "app-cast-vote",
  templateUrl: "./cast-vote.component.html",
  styleUrls: ["./cast-vote.component.scss"]
})
export class CastVoteComponent implements OnInit {
  @Input() voteParticulars;
  fingerprintImageSource = null;
  idleFingerprintImageUrl = "/assets/img/noun_Fingerprint-3.svg";
  errorFingerprintImageUrl = "/assets/img/noun_Fingerprint-2.svg";
  successFingerprintImageUrl = "/assets/img/noun_Fingerprint-1.svg";
  processing = false;

  isVisible = false;
  deadline: any;
  yesbuttonsize = "default";
  nobuttonsize = "default";
  neutralbuttonsize = "default";
  vote = "";
  question = "";
  showAuthentication = true;
  ResponseText = '';
  ResponseStatus = true;
  voteId: any;
  clickedYes: boolean = false;
  clickedNo: boolean = false;
  clickedAbstain: boolean = false;
  newActiveSpeaker: boolean = false;
  activeSpeaker: any;

  constructor(
    public votingService: VotingService,
    public modal: NzModalRef,
    public authService: AuthService,
    public notify: NotificationCustomService,
    private translate: TranslateService,
    private rbsSerive: SpeakerRBSService
  ) {
  }

  ngOnInit() {
    this.fingerprintImageSource = this.idleFingerprintImageUrl;
    this.isVisible = true;
    this.question = this.voteParticulars.description;
    this.deadline = Date.now() + 1000 * this.voteParticulars.time;
    // this.authenticateUserFingerprint();
    setTimeout(() => {
      if ((!this.isSpeaker() && !this.isNewActiveSpeaker())) {
        this.modal.destroy();
      }
    }, 1000 * this.voteParticulars.time);
  }

  hide() {
    this.modal.destroy();
    if (this.vote) {
      this.submitVoteResultToAPI();
    }
  }



  submitVoteResultToAPI() {
    this.votingService
      .doVote(
        this.authService.getCurrentUser().userName,
        this.voteParticulars.id,
        this.vote,
        this.voteId,
        parseInt(this.authService.getCurrentUser().userId),
        this.spkOrActiveSpk(),
        this.isNewActiveSpeaker()
      )
      .subscribe((res: any) => {
        this.voteId = res.id;
        this.notify.showSuccess(this.translate.instant('dashboard.notification.success'),
          this.translate.instant('dashboard.notification.votecasted'));
      });
  }

  castVote(vote: string) {
    this.vote = vote;
    if (this.vote == "YES") {
      this.yesbuttonsize = "large";
      this.nobuttonsize = "default";
      this.neutralbuttonsize = "default";
      this.clickedYes = true;
      this.clickedNo = false;
      this.clickedAbstain = false;
      this.submitVoteResultToAPI();
    } else if (this.vote == "NO") {

      this.yesbuttonsize = "default";
      this.nobuttonsize = "large";
      this.neutralbuttonsize = "default";
      this.clickedYes = false;
      this.clickedNo = true;
      this.clickedAbstain = false;
      this.submitVoteResultToAPI();

    } else {

      this.yesbuttonsize = "default";
      this.nobuttonsize = "default";
      this.neutralbuttonsize = "large";
      this.clickedYes = false;
      this.clickedNo = false;
      this.clickedAbstain = true;
      this.submitVoteResultToAPI();

    }
  }
  authenticateUserFingerprint() {
    this.authService.fingerAuthByUserId().subscribe(Response => {
      if (Response.status && Response.status === 400) {
        this.ResponseStatus = false;
        this.showAuthentication = true;
        this.ResponseText = Response.message;
        this.fingerprintImageSource = this.errorFingerprintImageUrl;
        if (!this.processing) {
          setTimeout(() => {
            this.ResponseText = null;
            this.fingerprintImageSource = this.idleFingerprintImageUrl;
            this.authenticateUserFingerprint();
          }, 1500);
        }
      }
      if (Response.status && Response.status === true) {
        this.ResponseStatus = true;
        this.fingerprintImageSource = this.successFingerprintImageUrl;
        this.showAuthentication = false;
        this.ResponseText = Response.message;
      }
    });
  }
  ngOnDestroy() {
    this.processing = true;
  }

  spkOrActiveSpk() {
    if (this.isSpeaker() || this.isNewActiveSpeaker()) {
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
