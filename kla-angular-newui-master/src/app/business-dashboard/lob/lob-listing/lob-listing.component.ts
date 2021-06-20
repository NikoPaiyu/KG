import { Component, OnInit } from "@angular/core";
import { LobService } from "../shared/services/lob.service";
import { Router } from "@angular/router";
import { NotificationCustomService } from "src/app/shared/services/notification.service";
import { CalenderofsittingService } from "../../calender-of-sitting/shared/services/calenderofsitting.service";

@Component({
  selector: "app-lob-listing",
  templateUrl: "./lob-listing.component.html",
  styleUrls: ["./lob-listing.component.scss"]
})
export class LobListingComponent implements OnInit {
  listOfData;
  loading = true;
  assemblies = [];
  sessions = [];
  assembly: "";
  session: "";
  routeData;
  constructor(
    private lobservice: LobService,
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
    this.getAssemblyList();
    this.setDatasFromRoute();

  }
  setDatasFromRoute() {
    if (this.routeData) {
      this.assembly = this.routeData.assembly;
      this.session = this.routeData.session;
      this.getLobList()

    }
  }
  getAssemblyList() {
    this.cosservice.getAssemblySessionDetails().subscribe((res: any) => {
      this.assemblies = res.assemblySession;
    })
  }
  getSessionList() {
    this.session = null;
    this.sessions = this.filterSessionList()
  }
  filterSessionList() {
    const filterValue = this.assemblies.find(e => e.id == this.assembly);
    return filterValue.session
  }
  goToCreateLobPage() {
    if (this.assembly && this.session) {
      this.router.navigate(["/business-dashboard/lob/create"], {
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
      this.router.navigate(["/business-dashboard/lob/create"], {
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
