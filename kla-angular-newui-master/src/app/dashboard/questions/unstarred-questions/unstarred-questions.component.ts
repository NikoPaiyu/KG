import { Component, OnInit } from '@angular/core';
import { PdfViewerComponent } from 'src/app/shared/components/pdf-viewer/pdf-viewer.component';
import { FileuploadService } from 'src/app/business-dashboard/fileupload/shared/services/fileupload.service';
import { NzDrawerService } from 'ng-zorro-antd';
import { CalenderofsittingService } from "src/app/business-dashboard/calender-of-sitting/shared/services/calenderofsitting.service";
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { Location } from '@angular/common';


@Component({
  selector: 'app-unstarred-questions',
  templateUrl: './unstarred-questions.component.html',
  styleUrls: ['./unstarred-questions.component.scss']
})
export class UnstarredQuestionsComponent implements OnInit {

  chosenDates;
  sessionId;
  assemblyId
  assembly: "";
  session: "";
  assemblies = [];
  sessions = [];
  routeData;
  pickAssembly;
  pickSession;
  response;

  constructor(
    private drawerService: NzDrawerService,
    private fileuploadservice: FileuploadService,
    private router: Router,
    private cosservice: CalenderofsittingService,
    private location: Location,
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


  ngOnInit(): void {

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

  getSavedDates(assembly, session) {
    this.fileuploadservice.getDates("UnStarredQuestions", assembly, session).subscribe((res: any) => {
      this.chosenDates = res;
    });
  }

  openUnstarredTemplate() {
    this._location.back();

  }

  openUnstarredFolderTemplate(item) {
    if (this.assembly, this.session) {

      this.router.navigate(["../../questions/unstarred-questions//", item.value,], {
        relativeTo:this.activeroute,
        state: { id: item.id, assembly: this.assembly, session: this.session }

      })

    }

    
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
