import { Component, OnInit } from "@angular/core";
import { QuestionService } from "../shared/question.service";
import { AuthService } from "src/app/auth/shared/services/auth.service";
import { resetFakeAsyncZone } from "@angular/core/testing";
import { NotificationCustomService } from "src/app/shared/services/notification.service";

@Component({
  selector: "app-question-ppoconfig",
  templateUrl: "./question-ppoconfig.component.html",
  styleUrls: ["./question-ppoconfig.component.scss"],
})
export class QuestionPPOConfigComponent implements OnInit {
  configList;
  QSubmission = "no";
  constructor(
    private question: QuestionService,
    private auth: AuthService,
    private notify: NotificationCustomService
  ) {}

  ngOnInit() {
    this.getPPOConfig();
  }

  saveConfig() {
    let ppoConfiguration = {
      userId: this.auth.getCurrentUser().userId,
      submissionThroughPPO: this.QSubmission === "yes" ? true : false,
    };
    ppoConfiguration["id"] =
      this.configList && this.configList.id ? this.configList.id : null;
    this.question.savePPOConfig(ppoConfiguration).subscribe((res) => {
      this.notify.showSuccess("Add Success", "");
      this.configList = res;
    });
  }
  getPPOConfig() {
    if (this.auth.getCurrentUser().userId) {
      this.question
        .getPPOConfig(this.auth.getCurrentUser().userId)
        .subscribe((res) => {
          if (res) {
            this.configList = res;
            this.QSubmission = res["submissionThroughPPO"] ? "yes" : "no";
          }
        });
    }
  }
  cancel(){}
}
