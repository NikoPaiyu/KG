import { Component, OnInit } from '@angular/core';
import { CalenderofsittingService } from '../../calender-of-sitting/shared/services/calenderofsitting.service';
import { AodService } from '../shared/service/aod.service';
import { forkJoin } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/shared/services/auth.service';

@Component({
  selector: 'app-aod-list',
  templateUrl: './aod-list.component.html',
  styleUrls: ['./aod-list.component.scss']
})
export class AodListComponent implements OnInit {

  assemblyList;
  sessionList;
  sessionList2;
  AssemblyID: number;
  SessionID: number;
  subscribe: any;
  showDrop = false;
  maxNumber: any;
  filter: any = {
    sessionId: 0,
    assemblyId: 0
  };
  maxValue: any;
  // tslint:disable-next-line: ban-types
  aodList: any = [];
  allAodList = [];
  sessionId;
  assemblyId;

  constructor(
    private cos: CalenderofsittingService,
    private aod: AodService,
    private router: Router,
    private user: AuthService,
    private route: ActivatedRoute) {}

  ngOnInit() {
    this.getAssemblySessionDetails();
  }
  getAssemblySessionDetails() {
    this.cos.getAssemblySessionDetails().subscribe(data => {
      this.assemblyList = data.assemblySession;
      this.filter.assemblyId = data.activeAssemblySession.assemblyId;
      this.assemblyId = data.activeAssemblySession.assemblyId;
      this.filterAssembly();
      this.filterAssembly2();
      this.filter.sessionId = data.activeAssemblySession.sessionId;
      this.sessionId = data.activeAssemblySession.sessionId;
      this.getList();
      this.getAll();
    });
  }
  filterAssembly() {
    const assemblyDetail = this.assemblyList.find(x => x.id === this.filter.assemblyId);
    if (assemblyDetail) {
      this.sessionList = assemblyDetail.session;
    }
    this.filter.sessionId = null;
    this.aodList = [];
  }
  filterAssembly2() {
    const assemblyDetail = this.assemblyList.find(x => x.id === this.assemblyId);
    if (assemblyDetail) {
      this.sessionList2 = assemblyDetail.session;
    }
    this.allAodList = [];
    this.sessionId = null;
  }
  getAssembly() {
    this.cos.getAllAssembly().subscribe((res) => {
      this.assemblyList = res;
    });
  }
  getSession() {
    this.cos.getAllSession().subscribe((res) => {
      this.sessionList = res;
    });
  }

  showDropdown() {
    this.showDrop = true;
  }
  getList() {
    if (this.filter.assemblyId && this.filter.sessionId) {
      // const Type = 'AOD';
      this.aod.getAllFiles(this.filter.assemblyId, this.filter.sessionId, this.user.getCurrentUser().userId).subscribe((Response) => {
        if (Response) {
          this.aodList = Response;
        }
      });
    }
  }
  getAll() {
    if (this.assemblyId && this.sessionId) {
      // const Type = 'AOD';
      this.aod.getList(this.assemblyId, this.sessionId, 'AOD').subscribe((Response) => {
        if (Response) {
          this.allAodList = Response;
        }
      });
    }
  }

  viewFile(fileId) {
    this.router.navigate(['/business-dashboard/aod/aod-file', fileId, this.filter.assemblyId, this.filter.sessionId]);
  }
  viewAllfile(fileId) {
    this.router.navigate(['/business-dashboard/aod/aod-file', fileId, this.assemblyId, this.sessionId]);
  }

}
