import { Component, OnInit } from "@angular/core";
import { BusinessControllerService } from "../../lob/shared/services/business-controller.service";
import {
  CountupTimerService,
  countUpTimerConfigModel,
  timerTexts
} from "ngx-timer";
import { NotificationCustomService } from "src/app/shared/services/notification.service";
import { ChatService } from "src/app/dashboard/shared/services/chat.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { UserManagementService } from "../../user-management/shared/services/user-management.service";
import { LobchangenotigicationSocketService } from "../../lob/shared/services/lobchangenotigication-socket.service";
import { NzModalService } from "ng-zorro-antd";
import { MemberswitchComponent } from "../shared/component/memberswitch/memberswitch.component";
@Component({
  selector: "app-live-business-management",
  templateUrl: "./live-business-management.component.html",
  styleUrls: ["./live-business-management.component.scss"]
})
export class LiveBusinessManagementComponent implements OnInit {
  isLobChanged = false;
  members = [];
  validateForm: FormGroup;
  fullScreenMode = false;
  unSwitchActive = false;
  isVisibleMeberSwitchDialog = false;
  runningLines = [];
  currentBusinessId;
  currentBusiness;
  pdfSrc;
  currentActiveBusinessLine;
  timerConfig;
  popoverTitle = "Are you sure you want to stop today's business?";
  canPublishQuestions = false;
  constructor(
    private fb: FormBuilder,
    private controllerservice: BusinessControllerService,
    private countupTimerService: CountupTimerService,
    private notify: NotificationCustomService,
    private chatService: ChatService,
    private userService: UserManagementService,
    private lobChangeSocket: LobchangenotigicationSocketService,
    private modalService: NzModalService
  ) { }

  ngOnInit() {
    this.lobChangeSocket.initializelobchangenotificationsocket();
    this.getRunnigLines();
    this.ngxTimerConfig();
    this.setForm();
    this.checkLobChangeOrNot();
  }
  ngOnDestroy() {
    this.lobChangeSocket.disconnect();
    this.notify.clearAll();
  }
  getRunnigLines() {
    this.controllerservice.getGroupedLiveRunnigLines().subscribe((res: any) => {
      this.runningLines = res;
      if (this.runningLines.length > 0) {
        this.currentBusinessId = res[0].businessId;
        this.currentBusiness = res[0];
        this.runningLines.forEach((value, index) => {
          this.runningLines[index].businessLines.forEach((value, subIndex) => {
            this.setPublishQPermissions(index, subIndex);
            //set value form local storage
            this.runningLines[index].businessLines[subIndex].pausebtn =
              localStorage.getItem(
                `pausebtn${this.runningLines[index].businessLines[subIndex].id}`
              ) == "true";
            this.runningLines[index].businessLines[subIndex].speakerNotebtn =
              localStorage.getItem(
                `speakerNotebtn${this.runningLines[index].businessLines[subIndex].id}`
              ) == "true";
            this.runningLines[index].businessLines[subIndex].questionbtn =
              localStorage.getItem(
                `questionbtn${this.runningLines[index].businessLines[subIndex].id}`
              ) == "true";
            this.runningLines[index].businessLines[subIndex].answerbtn =
              localStorage.getItem(
                `answerbtn${this.runningLines[index].businessLines[subIndex].id}`
              ) == "true";
            this.setSubbusinessAnwerBtn(this.runningLines[index].businessLines[subIndex]);
            if (
              // tslint:disable-next-line: no-bitwise
              this.runningLines[index].businessLines[subIndex].pausebtn |
              this.runningLines[index].businessLines[subIndex].speakerNotebtn |
              this.runningLines[index].businessLines[subIndex].questionbtn |
              this.runningLines[index].businessLines[subIndex].answerbtn
            ) {
              this.currentBusinessId = this.runningLines[index].businessId;
              this.currentActiveBusinessLine = this.runningLines[
                index
              ].businessLines[subIndex];
            }
          });
        });
      }
    });
  }
  setPublishQPermissions(index, subIndex) {
    if(this.runningLines[index].businessLines[subIndex].businessType == 'QUESTION') {
        this.canPublishQuestions = true;
    }
  }
  setSubbusinessAnwerBtn(businessLines) {
    if (businessLines.lobBusinessAgendaResponse && businessLines.lobBusinessAgendaResponse.length > 0) {
      businessLines.lobBusinessAgendaResponse.forEach(lobBusinessAgendaResponse => {
        lobBusinessAgendaResponse.lobBusinessRespondentMember.forEach(lobBusinessRespondentMember => {
          lobBusinessRespondentMember.respanswerbtn =
            localStorage.getItem(
              `respanswerbtn${lobBusinessRespondentMember.id}`
            ) == "true";
        });
      });
    }
  }
  removeSubbusinessAnwerBtn(businessLines) {
    if (businessLines.lobBusinessAgendaResponse && businessLines.lobBusinessAgendaResponse.length > 0) {
      businessLines.lobBusinessAgendaResponse.forEach(lobBusinessAgendaResponse => {
        lobBusinessAgendaResponse.lobBusinessRespondentMember.forEach(lobBusinessRespondentMember => {
          lobBusinessRespondentMember.respanswerbtn = false;
        });
      });
    }
  }
  hasSubbusinessAnswer(businessLines) {
    let status = false;
    if (businessLines.lobBusinessAgendaResponse && businessLines.lobBusinessAgendaResponse.length > 0) {
      businessLines.lobBusinessAgendaResponse.forEach(lobBusinessAgendaResponse => {
        lobBusinessAgendaResponse.lobBusinessRespondentMember.forEach(lobBusinessRespondentMember => {
          if (lobBusinessRespondentMember.respanswerbtn) { status = true }
        });
      });
    }
    return status;
  }
  removeRepAnswerBtnfromLocal() {
    this.runningLines.forEach((value, index) => {
      this.runningLines[index].businessLines.forEach((value, subIndex) => {
        let businessLines = this.runningLines[index].businessLines[subIndex];
        if (businessLines.lobBusinessAgendaResponse && businessLines.lobBusinessAgendaResponse.length > 0) {
          businessLines.lobBusinessAgendaResponse.forEach(lobBusinessAgendaResponse => {
            lobBusinessAgendaResponse.lobBusinessRespondentMember.forEach(lobBusinessRespondentMember => {
              localStorage.removeItem(`respanswerbtn${lobBusinessRespondentMember.id}`);
            });
          });
        }
      });
    });
  }

  onClickBusiness(item) {
    this.currentBusinessId = item.businessId;
    this.currentBusiness = item;
  }

  //function to start speakerNote
  startSpeakerNote(item: any, buttonType: string) {
    if (!this.buttonValidation() || buttonType == "Stop") {
      item.speakerNotebtn = !item.speakerNotebtn;
      this.setBusinessDetailsTolocalstorage(item, "speaker");
      localStorage.removeItem(`speakerNotebtn${item.id}`);
      localStorage.setItem(`speakerNotebtn${item.id}`, item.speakerNotebtn);
      if (item.speakerNotebtn) {
        this.notify.showSuccess("Success", "Streaming Started");
        this.countupTimerService.startTimer();
        this.playSpeakerNote(item);
      } else {
        //this stop fucntion click from stop button
        this.stopBusiness(item);
      }
    } else {
      //this stop function click from  confirmation popup
      this.stopBusinessFromPopup();
      item.speakerNotebtn = !item.speakerNotebtn;
      localStorage.removeItem(`speakerNotebtn${item.id}`);
      localStorage.setItem(`speakerNotebtn${item.id}`, item.speakerNotebtn);
      this.notify.showSuccess("Success", "Streaming Started");
      this.countupTimerService.startTimer();
      this.playSpeakerNote(item);
    }
  }

  startQuestion(item: any, buttonType: string) {
    if (!this.buttonValidation() || buttonType == "Stop") {
      item.questionbtn = !item.questionbtn;
      this.setBusinessDetailsTolocalstorage(item, "Question");
      localStorage.removeItem(`questionbtn${item.id}`);
      localStorage.setItem(`questionbtn${item.id}`, item.questionbtn);
      if (item.questionbtn) {
        this.playBusiness(item, "Question");
      } else {
        //this stop fucntion click from stop button
        this.stopBusiness(item);
      }
    } else {
      //this stop function click from  confirmation popup
      this.stopBusinessFromPopup();
      item.questionbtn = !item.questionbtn;
      localStorage.removeItem(`questionbtn${item.id}`);
      localStorage.setItem(`questionbtn${item.id}`, item.questionbtn);
      this.playBusiness(item, "Question");
    }
  }

  startRespAnswer(item: any, respondent: any, buttonType: string) {
    console.log(item);
    if (!this.buttonValidation() || buttonType == "Stop") {
      respondent.respanswerbtn = !respondent.respanswerbtn;
      this.setBusinessDetailsTolocalstorage(respondent, "Answer");
      localStorage.removeItem(`respanswerbtn${respondent.id}`);
      localStorage.setItem(`respanswerbtn${respondent.id}`, respondent.respanswerbtn);
      if (respondent.respanswerbtn) {
        item.respondent = respondent;
        this.playBusiness(item, "Answer");
      } else {
        //this stop fucntion click from stop button
        this.stopBusiness(item);
      }
    } else {
      //this stop function click from  confirmation popup
      this.stopBusinessFromPopup();
      respondent.respanswerbtn = !respondent.respanswerbtn;
      localStorage.removeItem(`respanswerbtn${respondent.id}`);
      localStorage.setItem(`respanswerbtn${respondent.id}`, respondent.respanswerbtn);
      item.respondent = respondent;
      this.playBusiness(item, "Answer");
    }
  }
  startAnswer(item: any, buttonType: string) {
    if (!this.buttonValidation() || buttonType == "Stop") {
      item.answerbtn = !item.answerbtn;
      this.setBusinessDetailsTolocalstorage(item, "Answer");
      localStorage.removeItem(`answerbtn${item.id}`);
      localStorage.setItem(`answerbtn${item.id}`, item.answerbtn);
      if (item.answerbtn) {
        this.playBusiness(item, "Answer");
      } else {
        //this stop fucntion click from stop button
        this.stopBusiness(item);
      }
    } else {
      //this stop function click from  confirmation popup
      this.stopBusinessFromPopup();
      item.answerbtn = !item.answerbtn;
      localStorage.removeItem(`answerbtn${item.id}`);
      localStorage.setItem(`answerbtn${item.id}`, item.answerbtn);
      this.playBusiness(item, "Answer");
    }
  }

  pauseBusiness(item: any) {
    item.pausebtn = !item.pausebtn;
    localStorage.removeItem(`pausebtn${item.id}`);
    localStorage.setItem(`pausebtn${item.id}`, item.pausebtn);
    if (!item.pausebtn == true) {
      this.pauseCurrentBusiness("Play");
      this.countupTimerService.startTimer();
    } else {
      this.countupTimerService.pauseTimer();
      this.pauseCurrentBusiness("Pause");
    }
  }

  playBusiness(item, type) {
    this.controllerservice.playBusiness(item, type).subscribe(res => {
      item.read = true;
      this.currentActiveBusinessLine = item;
      this.notify.showSuccess("Success", "Streaming Started");
      this.countupTimerService.startTimer();
    });
  }
  playSpeakerNote(item) {
    this.controllerservice
      .playSpeakerNote(item.speakerNoteUrl)
      .subscribe(res => {
        this.currentActiveBusinessLine = item;
      });
  }
  stopBusiness(item: any) {
    this.removeLocalStorageValue(item.id);
    item.pausebtn = false;
    this.countupTimerService.stopTimer();
    this.controllerservice.currentBusinessStop().subscribe(res => {
      this.currentActiveBusinessLine = null;
      this.notify.showSuccess("Success", "Streaming Stopped");
    });
  }

  pauseCurrentBusiness(action) {
    this.controllerservice.currentBusinessPause(action).subscribe(res => {
      if (res) {
        if (action == "Play") {
          this.notify.showSuccess("Success", "Streaming Started");
        } else {
          this.notify.showSuccess("Success", "Streaming Paused");
        }
      }
    });
  }
  stopTodaysBusiness() {
    this.controllerservice.stopTodaysBusiess().subscribe((res: any) => {
      if (res.statusCodeValue == 200) {
        this.countupTimerService.stopTimer();
        this.chatService.clearAllMessage().subscribe((res: any) => {
          if (res.statusCodeValue == 200) {
            this, this.notify.showSuccess("Success", "Success");
          }
        });
        this.controllerservice.playSpeakerNote("").subscribe();
        this.stopBusinessesOnStopTodays();
      } else {
        this, this.notify.showError("Error", "Something Went Wrong...");
      }
    });
  }
  buttonValidation() {
    let data = this.runningLines.find(element =>
      element.businessLines.some(
        item => item.speakerNotebtn || item.questionbtn || item.answerbtn || this.hasSubbusinessAnswer(item)
      )
    );
    return data ? true : false;
  }
  ngxTimerConfig() {
    this.timerConfig = new countUpTimerConfigModel();
    this.timerConfig.timerTexts = new timerTexts();
    this.timerConfig.timerTexts.hourText = ":";
    this.timerConfig.timerTexts.minuteText = ":";
    this.timerConfig.timerTexts.secondsText = " ";
  }
  removeLocalStorageValue(id) {
    localStorage.removeItem(`pausebtn${id}`);
    localStorage.removeItem(`questionbtn${id}`);
    localStorage.removeItem(`answerbtn${id}`);
    localStorage.removeItem(`speakerNotebtn${id}`);
    localStorage.setItem('isSwitched', 'false')
    this.removeRepAnswerBtnfromLocal();
  }

  onViewFile(url) {
    if (url) this.pdfSrc = url;
    // this.pdfViewerService.displayNormalPDFModal(url);
  }
  addClass() {
    this.fullScreenMode = !this.fullScreenMode;
  }

  onMemberSwitchClick() {
    if (this.currentActiveBusinessLine) {
      this.modalService.create({
        nzTitle: null,
        nzContent: MemberswitchComponent,
        nzClosable: true,
        nzMaskClosable: false,
        nzFooter: null,
        nzWidth: 1100,
        nzComponentParams: {
          currentActiveBusinessLine: this.currentActiveBusinessLine
        }
      });
    } else {
      this.notify.showWarning("Info", "Currently no business is playing");
    }
  }

  setForm() {
    this.validateForm = this.fb.group({
      businessId: [null, [Validators.required]],
      memberId: [null, [Validators.required]]
    });
  }

  handleCancel() {
    this.validateForm.reset();
    this.isVisibleMeberSwitchDialog = false;
  }

  stopBusinessesOnStopTodays() {
    if (this.currentActiveBusinessLine) {
      let businessIndex = this.runningLines.findIndex(
        element =>
          element.businessId == this.currentActiveBusinessLine.businessId
      );

      let businessLineIndex = this.runningLines[
        businessIndex
      ].businessLines.findIndex(
        element => element.id == this.currentActiveBusinessLine.id
      );
      this.runningLines[businessIndex].businessLines[
        businessLineIndex
      ].pausebtn = this.runningLines[businessIndex].businessLines[
        businessLineIndex
      ].answerbtn = this.runningLines[businessIndex].businessLines[
        businessLineIndex
      ].questionbtn = this.runningLines[businessIndex].businessLines[
        businessLineIndex
      ].speakerNotebtn = false;
      this.removeSubbusinessAnwerBtn(this.runningLines[businessIndex].businessLines[businessLineIndex]);
      this.controllerservice.currentBusinessStop().subscribe(res => {
        this.currentActiveBusinessLine = null;
        // this.notify.showSuccess("Success", "Streaming Stopped");
      });
      this.removeLocalStorageValue(this.currentActiveBusinessLine.id);
    }
  }
  //fucntion to stop business from popup confirmation
  stopBusinessFromPopup() {
    this.runningLines.forEach((value, index) => {
      this.runningLines[index].businessLines.forEach((value, subIndex) => {
        this.runningLines[index].businessLines[subIndex].pausebtn = false;
        this.runningLines[index].businessLines[subIndex].speakerNotebtn = false;
        this.runningLines[index].businessLines[subIndex].questionbtn = false;
        this.runningLines[index].businessLines[subIndex].answerbtn = false;
        this.removeSubbusinessAnwerBtn(this.runningLines[index].businessLines[subIndex]);
      });
    });
    this.stopBusiness(this.currentActiveBusinessLine);
  }
  //function to check whether lob changeornot
  checkLobChangeOrNot() {
    this.lobChangeSocket.lobChangeOrNot.subscribe(res => {
      this.notify.clearAll();
      if (res == "LOB") {
        this.isLobChanged = true;
        this.notify.blank(
          "Update Notification",
          "The lob has been has been updated.Please click on the refresh button for the latest changes..",
          { nzDuration: 0 }
        );
      } else if (res == "RUNNING_NOTE") {
        this.isLobChanged = true;
        this.notify.blank(
          "Update Notification",
          "The running note has been updated.Please click on the refresh button for the latest changes..",
          { nzDuration: 0 }
        );
      }
    });
  }
  //function to refresh api
  refreshButtonClick() {
    this.getRunnigLines();
    this.notify.clearAll();
    this.isLobChanged = false;
  }
  //function to set currently business details to local storage
  setBusinessDetailsTolocalstorage(item, type) {
    localStorage.removeItem("businessName");
    localStorage.removeItem("memberName");
    localStorage.setItem("businessName", item.businessNameMalayalam);
    if (type == "Question") {
      localStorage.setItem("memberName", item.primaryMemberMalayalamFullName);
    } else {
      localStorage.setItem("memberName", item.secondaryMemberMalayalamFullName);
    }
  }
  publishQuestions() {
    const qDate = new Date().toISOString().split("T")[0];
    this.controllerservice.publishQuestions(qDate).subscribe((res: any) => {
      if(res) {
        this.notify.showSuccess("Success", res);
      }
    });
  }
}
