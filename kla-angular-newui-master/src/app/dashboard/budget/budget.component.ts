import { Component, OnInit } from "@angular/core";
import { FileuploadService } from "../../business-dashboard/fileupload/shared/services/fileupload.service";
import { NzDrawerService } from "ng-zorro-antd/drawer";
import { Router,ActivatedRoute } from '@angular/router';
import { PdfViewerComponent } from 'src/app/shared/components/pdf-viewer/pdf-viewer.component';
import { CalenderofsittingService } from "src/app/business-dashboard/calender-of-sitting/shared/services/calenderofsitting.service";
@Component({
  selector: "app-budget",
  templateUrl: "./budget.component.html",
  styleUrls: ["./budget.component.scss"]
})
export class BudgetComponent implements OnInit {
  chosenDates;
  chosenFiles: any;
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
    private router: Router,
    private activeroute:ActivatedRoute,
    private cosservice: CalenderofsittingService,
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


  getSavedDates(assemblyId, sessionId) {
    this.fileuploadservice.getDatesBudget("Budget", assemblyId, sessionId).subscribe((res: any) => {

      this.chosenDates = res.filter((element) => { return element.fileUrl == null });
      this.chosenFiles = res.filter((element) => { return element.fileUrl != null })
    });
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


  openSubFolderTemplate(item) {
    this.router.navigate(["../..//budget", item.id], {
      relativeTo:this.activeroute,
      state: { id: item.id, assembly: this.assembly, session: this.session }
    })
  }

  openBudgetTemplate(url): void {
    const drawerRef = this.drawerService.create<
      PdfViewerComponent,
      { url: string },
      string
    >({
      nzContent: PdfViewerComponent,
      nzContentParams: {
        url: url
      }
    });
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
