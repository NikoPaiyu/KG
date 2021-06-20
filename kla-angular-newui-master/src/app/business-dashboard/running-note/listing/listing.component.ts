import { Component, OnInit } from "@angular/core";
import { CalenderofsittingService } from "../../calender-of-sitting/shared/services/calenderofsitting.service";
import { RunningnoteService } from "../shared/services/runningnote.service";
import { Router } from "@angular/router";
import { NotificationCustomService } from "src/app/shared/services/notification.service";

@Component({
  selector: "app-listing",
  templateUrl: "./listing.component.html",
  styleUrls: ["./listing.component.scss"]
})
export class ListingComponent implements OnInit {
  runningNoteList;
  assemblyList;
  sessionList;
  routeData;
  selectedAssemblyId = "";
  selectedSessionId = "";
  constructor(
    private router: Router,
    private notify: NotificationCustomService,
    private cosservice: CalenderofsittingService,
    private runningnoteservice: RunningnoteService
  ) {
    this.setRouterData();
  }

  ngOnInit() {
    this.getAssemblyList();
    this.getSessionList();
    this.getRunningNoteList();
    this.setDatasFromRoute();
  }
  setDatasFromRoute() {
    if (this.routeData) {
      this.selectedAssemblyId = this.routeData.assembly;
      this.selectedSessionId = this.routeData.session;
      this.getRunningNoteList();
    }
  }
  getAssemblyList() {
    this.cosservice.getAllAssembly().subscribe((res: any) => {
      this.assemblyList = res;
    });
  }
  getSessionList() {
    this.cosservice.getAllSession().subscribe((res: any) => {
      this.sessionList = res;
    });
  }
  getRunningNoteList() {
    if (this.selectedAssemblyId && this.selectedSessionId) {
      this.runningnoteservice
        .getRunningNoteList(this.selectedAssemblyId, this.selectedSessionId)
        .subscribe(res => {
          this.runningNoteList = res;
        });
    }
  }
  setRouterData() {
    if (
      this.router.getCurrentNavigation() &&
      this.router.getCurrentNavigation().extras &&
      this.router.getCurrentNavigation().extras.state
    )
      this.routeData = this.router.getCurrentNavigation().extras.state.data;
  }
  gotToCreateRunningNotePage() {
    if (this.selectedAssemblyId && this.selectedSessionId) {
      this.router.navigate(["/business-dashboard/runningnote/create"], {
        state: {
          data: {
            assemblyId: this.selectedAssemblyId,
            sessionId: this.selectedSessionId
          }
        }
      });
    } else {
      return this.notify.showWarning(
        "Warning",
        "Select Assembly and Session..!"
      );
    }
  }

  onEditRunningNote(runningNote) {
    if (this.selectedAssemblyId && this.selectedSessionId) {
      this.router.navigate(["/business-dashboard/runningnote/create"], {
        state: {
          data: {
            assemblyId: this.selectedAssemblyId,
            sessionId: this.selectedSessionId,
            date: runningNote.date
          }
        }
      });
    } else {
      return this.notify.showWarning(
        "Warning",
        "Select Assembly and Session..!"
      );
    }
  }
}
