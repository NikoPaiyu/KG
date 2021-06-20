import { Component, OnInit } from '@angular/core';
import { NzDrawerService } from 'ng-zorro-antd';
import { FileuploadService } from 'src/app/business-dashboard/fileupload/shared/services/fileupload.service';
import { Router } from '@angular/router';
import { CalenderofsittingService } from "src/app/business-dashboard/calender-of-sitting/shared/services/calenderofsitting.service";
import { PdfViewerComponent } from 'src/app/shared/components/pdf-viewer/pdf-viewer.component';

@Component({
  selector: 'app-cover',
  templateUrl: './cover.component.html',
  styleUrls: ['./cover.component.scss']
})
export class CoverComponent implements OnInit {
  chosenDates;
  sessionId;
  assemblyId
  assembly: "";
  session: "";
  assemblies = [];
  sessions = [];
  routeData;

  constructor(
    private drawerService: NzDrawerService,
    private fileuploadservice: FileuploadService,
    private cosservice: CalenderofsittingService,
    private router: Router
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
    this.fileuploadservice.getAllprevdocs("Cover", assemblyId, sessionId).subscribe((res: any) => {
      this.chosenDates = res;
    });
  }

  openCoverTemplate() {

    this.router.navigate(["/business-dashboard/home"])
  }

  openCoverFolderTemplate(item) {

    this.router.navigate(["/business-dashboard/cover", item.id], {
      state: { id: item.id, assembly: this.assembly, session: this.session }
    })
  }

}
