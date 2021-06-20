import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CalenderofsittingService } from '../shared/services/calenderofsitting.service';
import { AuthService } from 'src/app/auth/shared/services/auth.service';

@Component({
  selector: 'app-cos-list',
  templateUrl: './cos-list.component.html',
  styleUrls: ['./cos-list.component.scss']
})
export class CosListComponent implements OnInit {

  assemblyList;
  sessionList;
  sessionList2;

  showDrop = false;
  cosList: any = [];
  allCosList: any = [];
  maxNumber: any;
  maxValue: any;
  assemblyId: any;
  sessionId: any;

  assemblyId2: any;
  sessionId2: any;

  constructor(
    private cos: CalenderofsittingService,
    private router: Router,
    private route: ActivatedRoute,
    private user: AuthService) {
    const assemblyId = this.route.snapshot.params.assemblyId;
    const sessionId = this.route.snapshot.params.sessionId;
    if (assemblyId && sessionId) {
      this.assemblyId = Number(assemblyId);
      this.sessionId = Number(sessionId);
      this.assemblyId2 = Number(assemblyId);
      this.sessionId2 = Number(sessionId);
    }
  }

  ngOnInit() {
    // this.getAssemblyandSession();
    this.getAssemblySessionDetails();
  }

  getAssemblySessionDetails() {
    this.cos.getAssemblySessionDetails().subscribe(data => {
      this.assemblyList = data.assemblySession;
      if (!this.assemblyId) {
        this.assemblyId = data.activeAssemblySession.assemblyId;
        this.assemblyId2 = data.activeAssemblySession.assemblyId;
        this.filterSession();
        this.filterSession2();
        this.sessionId = data.activeAssemblySession.sessionId;
        this.sessionId2 = data.activeAssemblySession.sessionId;
      }
      this.getCosList();
      this.getAllCosList();
    });
  }
  filterSession() {
    const assemblyDetail = this.assemblyList.find(x => x.id == this.assemblyId);
    if (assemblyDetail) {
      this.sessionList = assemblyDetail.session;
      this.sessionId = null;
      this.cosList = [];
    }
  }
  filterSession2() {
    const assemblyDetail2 = this.assemblyList.find(x => x.id == this.assemblyId2);
    if (assemblyDetail2) {
      this.sessionList2 = assemblyDetail2.session;
      this.sessionId2 = null;
      this.allCosList = [];
    }
  }
  getAssemblyandSession() {
    this.cos.getAllAssembly().subscribe((res) => {
      this.assemblyList = res;
      const ids = this.assemblyList.map( x => x.id);
      this.assemblyId = Math.max(...ids);
      this.assemblyId2 = Math.max(...ids);
      this.cos.getAllSession().subscribe((data) => {
        this.sessionList = data;
        const id = this.sessionList.map( x => x.id);
        this.sessionId = Math.max(...id);
        this.sessionId2 = Math.max(...id);
        this.getCosList();
        this.getAllCosList();
      });
    });
  }
  showDropdown() {
    this.showDrop = true;
  }

  getCosList() {
    if (this.assemblyId && this.sessionId) {
      this.cos.getAllFiles(this.assemblyId, this.sessionId, this.user.getCurrentUser().userId).subscribe((Response) => {
        if (Response) {
          this.cosList = Response;
        }
      });
    }
  }
  getAllCosList() {
    if (this.assemblyId && this.sessionId) {
      this.cos.getList(this.assemblyId2, this.sessionId2, 'COS').subscribe((Response) => {
        if (Response) {
          this.allCosList = Response;
        }
      });
    }
  }
  viewFile(fileId) {
    this.router.navigate(['business-dashboard/sitting/file', fileId, this.assemblyId, this.sessionId]);
  }
  viewAllFile(fileId) {
    this.router.navigate(['business-dashboard/sitting/file', fileId, this.assemblyId2, this.sessionId2]);
  }
}
