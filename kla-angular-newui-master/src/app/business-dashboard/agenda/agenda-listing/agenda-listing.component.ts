import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AgendaServiceService } from "../shared/services/agenda-service.service";
import { NotificationCustomService } from "../../../shared/services/notification.service";
import { CalenderofsittingService } from "../../calender-of-sitting/shared/services/calenderofsitting.service";

@Component({
  selector: "app-agenda-listing",
  templateUrl: "./agenda-listing.component.html",
  styleUrls: ["./agenda-listing.component.scss"]
})
export class AgendaListingComponent implements OnInit {
  listOfData;
  loading = true;
  assemblies = [];
  sessions = [];
  assembly: "";
  session: "";
  routeData;
  constructor(
    private lobservice: AgendaServiceService,
    private router: Router,
    private notify: NotificationCustomService,
    private cosservice: CalenderofsittingService
  ) {
    this.setRouterData();
  }

  setRouterData() {
    if (
      this.router.getCurrentNavigation() &&
      this.router.getCurrentNavigation().extras &&
      this.router.getCurrentNavigation().extras.state
    )
      this.routeData = this.router.getCurrentNavigation().extras.state.data;
  }
  ngOnInit(): void {
    // this.getLobList();
    this.getAssemblyList();
    this.getSessionList();
    this.setDatasFromRoute();
  }

  setDatasFromRoute() {
    if (this.routeData) {
      this.assembly = this.routeData.assembly;
      this.session = this.routeData.session;
      this.getLobList();
    }
  }

  getAssemblyList() {
    this.cosservice.getAllAssembly().subscribe((res: any) => {
      this.assemblies = res;
    });
    // this.assemblies = [{ value: 1, label: 1 }];
  }
  getSessionList() {
    this.cosservice.getAllSession().subscribe((res: any) => {
      this.sessions = res;
    });
  }
  goToCreateLobPage() {
    if (this.assembly && this.session) {
      this.router.navigate(["/business-dashboard/agenda/create"], {
        state: { data: { assembly: this.assembly, session: this.session } }
      });
    } else {
      return this.notify.showWarning(
        "Warning",
        "Select Assembly and Session..!"
      );
    }
  }

  viewOneLobDetails(lob) {
    if (this.assembly && this.session) {
      this.router.navigate(["/business-dashboard/agenda/create"], {
        state: {
          data: {
            assembly: this.assembly,
            session: this.session,
            date: lob.date
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
  getLobList() {
    if (this.assembly && this.session) {
      this.lobservice
        .getLobList(this.assembly, this.session)
        .subscribe((res: any) => {
          if (res) {
            this.listOfData = res;
          } else {
            this.listOfData = [];
          }
        });
    }
  }

  OnRowClick() {
    this.router.navigate(["/business-dashboard/lob/create"]);
  }
}
