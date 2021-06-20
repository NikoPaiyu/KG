import { Component, OnInit } from '@angular/core';
import { PdfViewerComponent } from 'src/app/shared/components/pdf-viewer/pdf-viewer.component';
import { NzDrawerService } from 'ng-zorro-antd';
import { FileuploadService } from 'src/app/business-dashboard/fileupload/shared/services/fileupload.service';
import { CalenderofsittingService } from "src/app/business-dashboard/calender-of-sitting/shared/services/calenderofsitting.service";
import { Router,ActivatedRoute } from '@angular/router';
import {Location} from '@angular/common';

@Component({
  selector: 'app-summaryfolder',
  templateUrl: './summaryfolder.component.html',
  styleUrls: ['./summaryfolder.component.scss']
})
export class SummaryfolderComponent implements OnInit {
  chosenDates;
  chosenFiles: any;
  sessionId;
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
    private cosservice: CalenderofsittingService,
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
    this.fileuploadservice.getDatesBudget("Summary", assemblyId, sessionId).subscribe((res: any) => {

      this.chosenDates = res.filter((element) => { return element.fileUrl == null });
      this.chosenFiles = res.filter((element) => { return element.fileUrl != null })
    });
  }

  openSummarySubFolderTemplate(item) {

    this.router.navigate(["../../../summary", item.id], {
      relativeTo:this.activeroute,
      state: { id: item.id, assembly: this.assembly, session: this.session }
    })
  }

  openSummaryFileTemplate(url): void {
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

  backToDocuments() {
    this._location.back();
 
  //  this.router.navigate(["/dashboard/documents"])
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
