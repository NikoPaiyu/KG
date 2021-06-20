import { Component, OnInit } from '@angular/core';
import { BulletinService } from '../shared/bulletin.service';
import { CalenderofsittingService } from '../../calender-of-sitting/shared/services/calenderofsitting.service';
import { FileService } from 'src/app/shared/services/file.service';
import { AuthService } from 'src/app/auth/shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-bullettin',
  templateUrl: './list-bullettin.component.html',
  styleUrls: ['./list-bullettin.component.scss']
})
export class ListBullettinComponent implements OnInit {
  assemblyId = null;
  assemblyList = [];
  sessionId = null;
  sessionList = null;
  sessionList2;
  pendingBulletins = [];
  allBulletins = [];
  bulletins = [];
  assemblyId2 = null;
  sessionId2 = null;
  constructor(private bulletin: BulletinService, private cos: CalenderofsittingService,
              private file: FileService, private auth: AuthService, private router: Router) {
    
  }
  ngOnInit() {
    this.getAssemblyandSession();
  }
  getAssemblyandSession() {
    this.cos.getAssemblySessionDetails().subscribe(data => {
      this.assemblyList = data.assemblySession;
      this.assemblyId = data.activeAssemblySession.assemblyId;
      this.assemblyId2 = data.activeAssemblySession.assemblyId;
      this.filterAssembly();
      this.filterAssembly2();
      this.sessionId = data.activeAssemblySession.sessionId;
      this.sessionId2 = data.activeAssemblySession.sessionId;
      this.getPendingFile();
      this.getAllFiles();
    });
  }
  filterAssembly() {
    const assemblyDetail = this.assemblyList.find(x => x.id === this.assemblyId);
    this.sessionId = null;
    this.sessionList = assemblyDetail.session;
    this.pendingBulletins = [];
  }
  filterAssembly2() {
    const assemblyDetail = this.assemblyList.find(x => x.id === this.assemblyId2);
    this.sessionId2 = null;
    this.sessionList2 = assemblyDetail.session;
    this.allBulletins = [];
  }
  viewFile(fileId) {
    this.router.navigate(['/business-dashboard/bulletin/file', fileId]);
  }
  viewAllfile(fileId) {
    this.router.navigate(['/business-dashboard/bulletin/file', fileId]);
  }
  getAll() {

  }
  getList() {

  }
  getbulletinList() {
    this.bulletin.getBulletinList().subscribe(data => {
      this.bulletins = data;
    }, error => {
      this.bulletins = [];
    });
  }
  getPendingFile() {
    const params = {
      assemblyId: this.assemblyId,
      sessionId: this.sessionId,
      userId: this.auth.getCurrentUser().userId,
      type: 'BULLETIN'
    };
    this.file.getPendingFileList(params).subscribe(data => {
      this.pendingBulletins = data;
    }, error => {

    });
  }
  getAllFiles() {
    const params = {
      assemblyId: this.assemblyId2,
      sessionId: this.sessionId2,
      userId: this.auth.getCurrentUser().userId,
      type: 'BULLETIN'
    };
    this.file.getAllFilesByType(params).subscribe(data => {
      this.allBulletins = data;
    }, error => {

    });
  }
}
