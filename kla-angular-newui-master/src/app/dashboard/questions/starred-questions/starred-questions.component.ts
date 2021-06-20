import { Component, OnInit } from '@angular/core';
import { PdfViewerComponent } from 'src/app/shared/components/pdf-viewer/pdf-viewer.component';
import { NzDrawerService } from 'ng-zorro-antd';
import { FileuploadService } from 'src/app/business-dashboard/fileupload/shared/services/fileupload.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CalenderofsittingService } from "src/app/business-dashboard/calender-of-sitting/shared/services/calenderofsitting.service";
import { Location } from '@angular/common';
@Component({
  selector: 'app-starred-questions',
  templateUrl: './starred-questions.component.html',
  styleUrls: ['./starred-questions.component.scss']
})
export class StarredQuestionsComponent implements OnInit {
  chosenDates;
  chosenFiles: any;
  routeData;
  sessionId;
  assemblyId
  assembly: "";
  session: "";
  assemblies = [];
  sessions = [];
  response;

  constructor(
    private drawerService: NzDrawerService,
    private fileuploadservice: FileuploadService,
    private cosservice: CalenderofsittingService,
    private router: Router,
    private activeroute: ActivatedRoute,
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


  changeAssembly() {
    this.getSavedDates(this.assembly, this.session);
  }

  changeSession() {
    this.getSavedDates(this.assembly, this.session);
  }

  getSavedDates(assemblyId, sessionId) {
    this.fileuploadservice.getDatesBudget("StarredQuestions", assemblyId, sessionId).subscribe((res: any) => {

      this.chosenDates = res.filter((element) => { return element.fileUrl == null });
      this.chosenFiles = res.filter((element) => { return element.fileUrl != null })
    });
  }

  backToQuestions() {
    this._location.back();

    //this.router.navigate(["/dashboard/questions"])
  }

  openStarredSubFolderTemplate(item) {

    this.router.navigate(["../../questions/starred-questions/", item.id], {
      relativeTo: this.activeroute,
      state: { id: item.id, assembly: this.assembly, session: this.session }
    })
  }

  openStarredQTemplate(url): void {
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
