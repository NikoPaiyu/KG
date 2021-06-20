import { Component, OnInit } from "@angular/core";
import { BusinessControllerService } from "../shared/services/business-controller.service";
import {
  CountupTimerService,
  countUpTimerConfigModel,
  timerTexts
} from "ngx-timer";
import { NotificationCustomService } from "src/app/shared/services/notification.service";
import { ChatService } from "src/app/dashboard/shared/services/chat.service";
@Component({
  selector: "app-business-controller-view",
  templateUrl: "./business-controller-view.component.html",
  styleUrls: ["./business-controller-view.component.scss"]
})
export class BusinessControllerViewComponent implements OnInit {
  runningLines = [];
  timerConfig;
  popoverTitle = "Are Sure Want to Stop today's business?";
  constructor(
    private controllerservice: BusinessControllerService,
    private countupTimerService: CountupTimerService,
    private notify: NotificationCustomService,
    private chatService: ChatService
  ) {}

  ngOnInit() {
    this.getRunnigLines();
    this.ngxTimerConfig();
  }
  getRunnigLines() {
    this.controllerservice.getGroupedLiveRunnigLines().subscribe((res: any) => {
      this.runningLines = res;
      if (this.runningLines != null) {
        this.runningLines.forEach((value, index) => {
          this.runningLines[index].businessLines.forEach((value, subIndex) => {
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
          });
        });
      }
    });
  }

  startSpeakerNote(item: any, buttonType: string) {
    if (!this.buttonValidation() || buttonType == "Stop") {
      item.speakerNotebtn = !item.speakerNotebtn;
      localStorage.removeItem(`speakerNotebtn${item.id}`);
      localStorage.setItem(`speakerNotebtn${item.id}`, item.speakerNotebtn);
      if (item.speakerNotebtn) {
        this.notify.showSuccess("Success", "Streaming Started");
        this.countupTimerService.startTimer();
        this.controllerservice
          .playSpeakerNote(item.speakerNoteUrl)
          .subscribe(res => {});
      } else {
        this.stopBusiness(item);
      }
    } else {
      this.notify.showInformation("Info", "One Business Already Streaming...");
    }
  }

  startQuestion(item: any, buttonType: string) {
    if (!this.buttonValidation() || buttonType == "Stop") {
      item.questionbtn = !item.questionbtn;
      localStorage.removeItem(`questionbtn${item.id}`);
      localStorage.setItem(`questionbtn${item.id}`, item.questionbtn);
      if (item.questionbtn) {
        this.playBusiness(item, "Question");
      } else {
        this.stopBusiness(item);
      }
    } else {
      this.notify.showInformation("Info", "One Business Already Streaming...");
    }
  }

  startAnswer(item: any, buttonType: string) {
    if (!this.buttonValidation() || buttonType == "Stop") {
      item.answerbtn = !item.answerbtn;
      localStorage.removeItem(`answerbtn${item.id}`);
      localStorage.setItem(`answerbtn${item.id}`, item.answerbtn);
      if (item.answerbtn) {
        this.playBusiness(item, "Answer");
      } else {
        this.stopBusiness(item);
      }
    } else {
      this.notify.showInformation("Info", "One Business Already Streaming...");
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
      this.notify.showSuccess("Success", "Streaming Started");
      this.countupTimerService.startTimer();
    });
  }
  stopBusiness(item: any) {
    this.removeLocalStorageValue(item.id);
    item.pausebtn = false;
    this.countupTimerService.stopTimer();
    this.controllerservice.currentBusinessStop().subscribe(res => {
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
        this.chatService.clearAllMessage().subscribe((res: any) => {
          if (res.statusCodeValue == 200) {
            this, this.notify.showSuccess("Success", "Success");
          }
        });
        this.controllerservice.playSpeakerNote("").subscribe();
      } else {
        this, this.notify.showError("Error", "Something Went Wrong...");
      }
    });
  }
  buttonValidation() {
    let data = this.runningLines.find(element =>
      element.businessLines.some(
        item => item.speakerNotebtn || item.questionbtn || item.answerbtn
      )
    );
    return data;
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
  }
}
