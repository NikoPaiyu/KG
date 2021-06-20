import { Component, OnInit } from "@angular/core";
import { BusinessControllerService } from "../../../business-dashboard/lob/shared/services/business-controller.service";
import { SpeakerNoteService } from "../../shared/services/speaker-note.service";
import { DashBoardPdfViewerComponent } from "../../shared/components/pdf-viewer/pdf-viewer.component";
import { NzDrawerService } from "ng-zorro-antd";
import { LobchangenotigicationSocketService } from "src/app/business-dashboard/lob/shared/services/lobchangenotigication-socket.service";
import { NotificationCustomService } from "src/app/shared/services/notification.service";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: "app-rnview",
  templateUrl: "./rnview.component.html",
  styleUrls: ["./rnview.component.scss"]
})
export class RnviewComponent implements OnInit {
  currentDayList = [];
  public drawerRef;
  isLobChanged = false;
  constructor(
    private lobService: BusinessControllerService,
    private speakeNoteService: SpeakerNoteService,
    private drawerService: NzDrawerService,
    private lobChangeSocket: LobchangenotigicationSocketService,
    private notify: NotificationCustomService,
    private translate: TranslateService,
  ) {}
  ngOnInit() {
    this.getCurrentDayRunningNoteList();
  }
  getCurrentDayRunningNoteList() {
    this.lobService.getGroupedLiveRunnigLines().subscribe((res: any) => {
      if (res) this.currentDayList = res;
      else this.currentDayList = [];
    });
  }

  openSpeakerNote(agendaLine): void {
    if (agendaLine.flipUrl) {
      this.speakeNoteService.displayModal(agendaLine.flipUrl);
    } else if (agendaLine.speakerNoteUrl) {
      if (this.drawerRef) {
        this.drawerRef.close();
      }
      const drawerRef = this.drawerService.create<
        DashBoardPdfViewerComponent,
        { url: string },
        string
      >({
        nzContent: DashBoardPdfViewerComponent,
        nzContentParams: {
          url: agendaLine.speakerNoteUrl
        }
      });
      this.drawerRef = drawerRef;
    }
  }
  //function to check whether lob changeornot
  checkLobChangeOrNot() {
    this.lobChangeSocket.lobChangeOrNot.subscribe(res => {
      this.notify.clearAll();
      if (res == "LOB") {
        this.isLobChanged = true;
        this.notify.blank(this.translate.instant('dashboard.notification.updatenotification'),
        this.translate.instant('dashboard.rnview.updatemsg'),
          { nzDuration: 0 }
        );
      } else if (res == "RUNNING_NOTE") {
        this.isLobChanged = true;
        this.notify.blank(this.translate.instant('dashboard.notification.updatenotification'),
        this.translate.instant('dashboard.rnview.runningnotemsg'),
          { nzDuration: 0 }
        );
      }
    });
  }
  //function to refresh api
  refreshButtonClick() {
    this.isLobChanged = false;
    this.notify.clearAll();
    this.getCurrentDayRunningNoteList();
  }
}
