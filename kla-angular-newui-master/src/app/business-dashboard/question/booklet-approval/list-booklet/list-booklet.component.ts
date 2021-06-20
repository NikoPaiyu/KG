import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/shared/services/auth.service';
import { QnbookletService } from '../shared/qnbooklet.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { CalenderofsittingService } from 'src/app/business-dashboard/calender-of-sitting/shared/services/calenderofsitting.service';

@Component({
  selector: 'app-list-booklet',
  templateUrl: './list-booklet.component.html',
  styleUrls: ['./list-booklet.component.scss']
})
export class ListBookletComponent implements OnInit {
  assemblyId = null;
  assemblyId2 = null;
  assemblyList = [];
  sessionId = null;
  sessionId2 = null;
  sessionList = [];
  allBulletins = [];
  pendingBulletins = [];
  assemblySession;
  questionNumber = new FormControl('', Validators.required);
  viewFile(id) {
    this.router.navigate(['view', id],  {
      relativeTo: this.route.parent,
    });
  }
  constructor(private auth: AuthService, private service: QnbookletService, private router: Router,
              private route: ActivatedRoute, private cos: CalenderofsittingService) { }

  ngOnInit() {
    this.getAssemblyandSession();
  }
  // getAssemblyandSession() {
  //   this.cos.getAllAssembly().subscribe((res) => {
  //     this.assemblyList = res;
  //     const ids = this.assemblyList.map( x => x.id);
  //     this.assemblyId = Math.max(...ids);
  //     this.assemblyId2 = Math.max(...ids);
  //     this.cos.getAllSession().subscribe((data) => {
  //       this.sessionList = data;
  //       const id = this.sessionList.map( x => x.id);
  //       this.sessionId = Math.max(...id);
  //       this.sessionId2 = Math.max(...id);
  //       this.getPendingFile();
  //       this.getAllFiles();
  //     });
  //   });
  // }
  getAssemblyandSession() {
    this.cos.getAssemblySessionDetails().subscribe((res) => {
      if(res) {
        this.assemblySession = res;
        this.assemblyList = res['assembly'];
        const ids = this.assemblyList.map( x => x.id);
        this.assemblyId = res['activeAssemblySession'].assemblyId;
        this.assemblyId2 = res['activeAssemblySession'].assemblyId;
          this.sessionList = res['session'];
          const id = this.sessionList.map( x => x.id);
          this.sessionId = res['activeAssemblySession'].sessionId;
          this.sessionId2 =res['activeAssemblySession'].sessionId;
          this.findSessionListByAssembly(this.assemblyId);
          this.sessionId =  this.sessionId2 = this.sessionList.find(
            (element) => element.id === res['activeAssemblySession'].sessionId).id;
          this.getPendingFile();
          this.getAllFiles();
      }
    });
  }
  findSessionListByAssembly(selAssembly) {
    if (this.assemblySession) {
      if (this.assemblySession['assemblySession'].
      find(
        (element) => element.id === selAssembly)) {
        let session = this.assemblySession['assemblySession'].find(
          (element) => element.id === selAssembly).session;
          this.sessionList = session;
          this.sessionId =  this.sessionId2 = this.sessionList.slice(-1).pop().id
       }
    }
  }
  getPendingFile() {
    const userId = this.auth.getCurrentUser().userId;
    this.service.getPendingBooklets(userId).subscribe(data => {
      this.pendingBulletins = data;
    });
  }
  getAllFiles() {
    this.service.getAllBooklets(this.assemblyId2, this.sessionId2).subscribe(data => {
      this.allBulletins = data;
    });
  }
}
