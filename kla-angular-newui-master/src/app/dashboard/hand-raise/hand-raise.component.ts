import { Component, OnInit } from "@angular/core";
import { CurrentBusinessService } from "../current-business/shared/service/current-business.service";
import { SpeakerNoteService } from "../shared/services/speaker-note.service";
import { NotificationCustomService } from "src/app/shared/services/notification.service";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: "app-hand-raise",
  templateUrl: "./hand-raise.component.html",
  styleUrls: ["./hand-raise.component.scss"]
})
export class HandRaiseComponent implements OnInit {
  loading = false;
  handRiseRequestDetailList = [];
  handRiseCount;
  constructor(
    private CurrentBusinessService: CurrentBusinessService,
    private speakernotesocketapi: SpeakerNoteService,
    private notify: NotificationCustomService,
    private translate: TranslateService,
  ) {}

  ngOnInit() {
    this.handRiseRequestDetails();
    this.handRiseRequestDetails_Socket();
  }

  handRiseRequestDetails() {
    this.CurrentBusinessService.messageBody.subscribe((res: any) => {
      if (res) {
        this.handRiseRequestDetailList = res;
      }
    });
  }

  handRiseRequestDetails_Socket() {
    this.speakernotesocketapi.supplimentaryQustionList.subscribe(res => {
      if (res && res.length > 0) {
        this.handRiseRequestDetailList.push(res);
      }
    });
  }

  handRiseRequestAccept(requestId, index) {
    this.CurrentBusinessService.handRiseRequestAccept(requestId).subscribe(
      res => {
        this.handRiseRequestDetailList.splice(index, 1);
        this.CurrentBusinessService.responseMessage.next(
          this.handRiseRequestDetailList
        );
        this.notify.showSuccess(this.translate.instant('dashboard.notification.success'),
        this.translate.instant('dashboard.handraise.accepted'));
      }
    );
  }
  clearAllHandRiseRequest() {
    this.CurrentBusinessService.clearAllHandRiseRequest().subscribe(res => {
      this.handRiseRequestDetailList = [];
      this.CurrentBusinessService.responseMessage.next(
        this.handRiseRequestDetailList
      );
    });
  }
}
