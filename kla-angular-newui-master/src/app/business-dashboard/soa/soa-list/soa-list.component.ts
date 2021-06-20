import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/shared/services/auth.service';
import { forkJoin } from 'rxjs';
import { SoaService } from '../shared/services/soa.service';

@Component({
  selector: 'app-soa-list',
  templateUrl: './soa-list.component.html',
  styleUrls: ['./soa-list.component.scss']
})
export class SoaListComponent implements OnInit {

  assemblyList;
  sessionList;
  filter: any = {
    sessionId: 0,
    assemblyId: 0
  };
  subscribe: any;
  showDrop = false;
  maxNumber: any;
  soaList: any = [];
  userId: any;

  constructor(private router: Router, private user: AuthService, public service: SoaService) {
    this.userId = this.user.getCurrentUser().userId;
    this.service.getQuestionPermissions(this.userId);
  }

  ngOnInit() {
    this.getAssembly();
  }

  getAssembly() {
    this.service.getAllAssembly().subscribe((res) => {
      this.assemblyList = res;
      const Ids = this.assemblyList.map(x => x.id);
      this.service.getAllSession().subscribe((res) => {
        this.sessionList = res;
        const Ids = this.sessionList.map(x => x.id);
        // this.sessionId = Math.max(...Ids);
        this.getList();
      });
    });
  }

  showDropdown() {
    this.showDrop = true;
  }
  getList() {
    this.service.getlist(this.userId).subscribe((res) => {
      this.soaList = res;
      this.formatSoaList();
    });
  }
  formatSoaList() {
     // tslint:disable-next-line: prefer-for-of
     for (let index = 0; index < this.soaList.length; index++) {
       const data = this.soaList[index];
       const SessionName = this.sessionList.find(x => x.id === data.sessionId);
       if (SessionName) {
        data.label = `SOA for Session ${SessionName.sessionId}`;
       } else {
        data.label = 'SOA';
       }
       this.soaList[index] = data;
     }
  }

  viewFile(id) {
    this.router.navigate(['/business-dashboard/soa/view', id]);
  }
  viewFile1() {
    this.router.navigate(['/business-dashboard/soa/view']);
  }

}
