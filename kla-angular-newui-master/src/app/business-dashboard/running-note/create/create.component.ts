import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { LobService } from "../../lob/shared/services/lob.service";
import { AgendaServiceService } from "../../agenda/shared/services/agenda-service.service";
import { RunningnoteService } from "../shared/services/runningnote.service";
import { NotificationCustomService } from "src/app/shared/services/notification.service";
import { UploadFile } from "ng-zorro-antd";
import { SpeakerNoteService } from "src/app/dashboard/shared/services/speaker-note.service";
@Component({
  selector: "app-create",
  templateUrl: "./create.component.html",
  styleUrls: ["./create.component.scss"]
})
export class CreateComponent implements OnInit {
  isVisible = false;
  isOrderChanged = false;
  lobAgendaLine;
  assembly: "";
  session: "";
  speaketNoteFileList = [];
  file: UploadFile;
  routeData;
  runnigNote = {
    assemblyId: "",
    sessionId: "",
    date: "",
    runningNoteLines: []
  };
  lobDatas = [];
  agendaDatas = [];
  routerDeta;
  selectedLob = null;
  selectedAgenda = null;
  constructor(
    private router: Router,
    private lobservice: LobService,
    private agendaservice: AgendaServiceService,
    private runningNoteService: RunningnoteService,
    private notify: NotificationCustomService,
    private speakeNoteService: SpeakerNoteService
  ) {
    this.setRouterData();
  }

  ngOnInit() {
    this.setFromRouterData();
    this.setDatasFromRoute();
    this.setRouterData();
  }
  setDatasFromRoute() {
    if (this.routeData) {
      this.assembly = this.routeData.assemblyId;
      this.session = this.routeData.sessionId;
      if (this.routeData.date) {
        this.runnigNote.date = this.routeData.date;
        this.onDateChange();
      }
    }
  }
  setRouterData() {
    if (
      this.router.getCurrentNavigation() &&
      this.router.getCurrentNavigation().extras &&
      this.router.getCurrentNavigation().extras.state
    )
      this.routerDeta = this.router.getCurrentNavigation().extras.state.data;
  }
  setFromRouterData() {
    if (this.routerDeta) {
      this.runnigNote.assemblyId = this.routerDeta.assemblyId;
      this.runnigNote.sessionId = this.routerDeta.sessionId;
      this.runnigNote.date = this.routerDeta.date ? this.routerDeta.date : "";
      if (this.runnigNote.date) {
        this.onDateChange();
      }
    }
  }
  goToListRunningNotePage() {
    this.router.navigate(["/business-dashboard/runningnote/listing"], {
      state: {
        data: {
          assembly: this.runnigNote.assemblyId,
          session: this.runnigNote.sessionId
        }
      }
    });
  }

  onDateChange() {
    this.selectedAgenda = "";
    this.selectedLob = "";
    this.runnigNote.runningNoteLines = [];
    if (this.runnigNote.date) {
      // this.getLobData();
      // this.getAgendaData();
      this.getRunningNotesByDate();
    }
  }
  getLobData() {
    this.lobservice
      .getAllLobListByDate(
        this.runnigNote.assemblyId,
        this.runnigNote.sessionId,
        this.runnigNote.date
      )
      .subscribe((res: any[]) => {
        this.lobDatas = res.filter(
          element =>
            !(
              this.runnigNote.runningNoteLines &&
              this.runnigNote.runningNoteLines.some(
                item => item.lobAgendaLine.id == element.id
              )
            )
        );
      });
  }

  getAgendaData() {
    this.agendaservice
      .getAllAgendaListByDate(
        this.runnigNote.assemblyId,
        this.runnigNote.sessionId,
        this.runnigNote.date
      )
      .subscribe((res: any[]) => {
        this.agendaDatas = res.filter(
          element =>
            !(
              this.runnigNote.runningNoteLines &&
              this.runnigNote.runningNoteLines.some(
                item => item.lobAgendaLine.id == element.id
              )
            )
        );
      });
  }

  addNewRunnigNoteLine(selectedOne) {
    if (this.isOrderChanged) {
      this.notify.showWarning(
        "Warning",
        "Save Current Order Before Adding New LOB/Agenda."
      );
    } else {
      if (selectedOne) {
        this.runningNoteService
          .saveRunningDate(this.runnigNote, selectedOne)
          .subscribe((res: any) => {
            this.notify.showSuccess("Success", "Added.");
            this.getRunningNotesByDate();
          });
      }
    }
  }
  getRunningNotesByDate() {
    this.runningNoteService
      .getRunningNotesByDate(
        this.runnigNote.assemblyId,
        this.runnigNote.sessionId,
        this.runnigNote.date
      )
      .subscribe((res: any[]) => {
        this.runnigNote.runningNoteLines = res;
        this.getLobData();
        this.getAgendaData();
        this.selectedAgenda = null;
        this.selectedLob = null;
      });
  }

  openFiePDF(url): void {
    if (url) {
      window.open(url, "_blank");
      // this.speakeNoteService.displayModal(url);
    } else {
      this.notify.showWarning("Warning", "No Speaker Note Available to Show.");
    }
  }

  deleteRunningNoteLine(id) {
    if (this.isOrderChanged) {
      this.notify.showWarning(
        "Warning",
        "Save Current Order Before Deleting Running Note."
      );
    } else {
      this.runningNoteService.deleteRunningNoteLine(id).subscribe(res => {
        this.notify.showSuccess("Success", "Deleted.");
        // this.runnigNote.runningNoteLines = this.runnigNote.runningNoteLines.filter(
        //   note => note.id !== id
        // );
        this.getRunningNotesByDate();
      });
    }
  }

  onEditSpeakerNoteClick(lobAgendaLine) {
    if (this.isOrderChanged) {
      this.notify.showWarning(
        "Warning",
        "Save Current Order Before Edit Speaker Note."
      );
    } else {
      this.lobAgendaLine = lobAgendaLine;
      if (lobAgendaLine.speakerNoteUrl) {
        this.speaketNoteFileList = [
          {
            uid: -1,
            name: "speakernotefile",
            status: "done",
            url: lobAgendaLine.speakerNoteUrl
          }
        ];
      } else {
        this.speaketNoteFileList = [];
      }
      this.isVisible = true;
    }
  }

  handleOk(): void {
    if (this.speaketNoteFileList.length > 0) {
      this.runningNoteService
        .uploadFile(this.speaketNoteFileList[0])
        .subscribe((res: any) => {
          this.runningNoteService
            .uploadSpeakerNote(this.speaketNoteFileList[0])
            .subscribe((flip: any) => {
              this.runningNoteService
                .updateRunningNote(this.lobAgendaLine.id, res.body, flip.body)
                .subscribe(res => {
                  this.notify.showSuccess("Success", "Speaker Note Updated");
                  this.runnigNote.runningNoteLines.find(element => {
                    element.id == this.lobAgendaLine.id;
                  });
                  this.handleCancel();
                  this.getRunningNotesByDate();
                });
            });
        });
    } else {
      this.runningNoteService
        .updateRunningNote(this.lobAgendaLine.id, "", "")
        .subscribe(res => {
          this.notify.showSuccess("Success", "Speaker Note Updated");
          this.handleCancel();
          this.getRunningNotesByDate();
        });
    }
  }

  handleCancel(): void {
    this.speaketNoteFileList = [];
    this.lobAgendaLine = "";
    this.isVisible = false;
  }

  beforeUploadSpeakerNote = (file: UploadFile): boolean => {
    this.speaketNoteFileList = [];
    this.file = file;
    this.speaketNoteFileList = this.speaketNoteFileList.concat(file);
    return false;
  };

  listSorted($event) {
    this.isOrderChanged = true;
  }

  updateRunningLineOrder() {
    this.runningNoteService
      .updateRunningLinesOrder(this.runnigNote)
      .subscribe(res => {
        this.notify.showSuccess("Success", "Updated.");
        this.isOrderChanged = false;
        this.getRunningNotesByDate();
      });
  }
}
