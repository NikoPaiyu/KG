import { Component, OnInit } from "@angular/core";
import { FileuploadService } from "src/app/business-dashboard/fileupload/shared/services/fileupload.service";
import { NzDrawerService } from "ng-zorro-antd";
import { CalenderofsittingService } from "src/app/business-dashboard/calender-of-sitting/shared/services/calenderofsitting.service";
import { Router,ActivatedRoute, } from "@angular/router";
import {Location} from '@angular/common';

@Component({
  selector: "app-mscsummary",
  templateUrl: "./mscsummary.component.html",
  styleUrls: ["./mscsummary.component.scss"]
})
export class MscSummaryComponent implements OnInit {
  chosenDates;
  assemblyId
  assembly: "";
  session: "";
  assemblies = [];
  sessions = [];
  routeData;
  response;

  constructor(
    private drawerService: NzDrawerService,
    private fileuploadservice: FileuploadService,
    private cosservice: CalenderofsittingService,
    private router: Router,
    private activeroute:ActivatedRoute,
    private _location: Location
  ) {
    this.setRouterData();
  }

  setRouterData() {
    if (
      this.router.getCurrentNavigation() &&
      this.router.getCurrentNavigation().previousNavigation &&
      this.router.getCurrentNavigation().previousNavigation.extras
    )
      this.routeData = this.router.getCurrentNavigation().previousNavigation.extras.state;

  }

  ngOnInit() {
    this.setDatasFromRoute();
    this.getcurrentAssemblyandSession();
    this.getAssemblyList();
    this.getSessionList();

  }

  setDatasFromRoute() {
    if (this.routeData) {
      this.assembly = this.routeData.assembly;
      this.session = this.routeData.session;

      this.getSavedDates(this.assembly, this.session);

    }
  }


  changeAssembly() {
    this.getSavedDates(this.assembly, this.session);
  }

  changeSession() {
    this.getSavedDates(this.assembly, this.session);
  }


  getAssemblyList() {
    this.cosservice.getAllAssembly().subscribe((res: any) => {
      this.assemblies = res;
    });
  }
  getSessionList() {
    this.cosservice.getAllSession().subscribe((res: any) => {
      this.sessions = res;
    });
  }


  getSavedDates(assemblyId, sessionId) {
    this.fileuploadservice.getDates("Misc", assemblyId, sessionId).subscribe((res: any) => {
      this.chosenDates = res;
    });
  }

  openMscFolderTemplate(item) {

    this.router.navigate(["../../../miscellaneous", item.value], {
      relativeTo:this.activeroute,
      state: { id: item.id, assembly: this.assembly, session: this.session }
    })
  }

  backToDocuments() {
    this._location.back();
 
    //this.router.navigate(["/dashboard/documents"])
  }
  getcurrentAssemblyandSession(){
    this.cosservice.getActiveAssemblySession().subscribe((res: any) => {
      this.response = res;
      this.assembly=this.response.assemblyId;
      this.session=this.response.sessionId;
      this.changeSession();
    });
  }

}
