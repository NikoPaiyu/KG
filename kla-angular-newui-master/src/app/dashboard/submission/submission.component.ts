import { Component, OnInit } from '@angular/core';
import { NzDrawerService } from 'ng-zorro-antd';
import { FileuploadService } from 'src/app/business-dashboard/fileupload/shared/services/fileupload.service';
import { CalenderofsittingService } from "src/app/business-dashboard/calender-of-sitting/shared/services/calenderofsitting.service";
import { Router,ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.scss']
})
export class SubmissionComponent implements OnInit {
  chosenDates;
  sessionId;
  assemblyId
  assembly:14;
  session: 17;
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
  getcurrentAssemblyandSession(){
    this.cosservice.getActiveAssemblySession().subscribe((res: any) => {
      this.response = res;
      this.assembly=this.response.assemblyId;
      this.session=this.response.sessionId;
      this.changeSession();
    });
  }

  getSavedDates(assemblyId, sessionId) {
    this.fileuploadservice.getDates("Sub", assemblyId, sessionId).subscribe((res: any) => {
      this.chosenDates = res;
    });
  }

  openSubFolderTemplate(item) {

    this.router.navigate(["../../submission", item.value],
     { relativeTo:this.activeroute,
      state: { id: item.id, assembly: this.assembly, session: this.session }
    })
  }

}
