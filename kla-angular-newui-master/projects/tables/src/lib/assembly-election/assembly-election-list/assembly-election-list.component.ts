import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { AssemblyElectionService } from '../shared/services/assembly-election.service';

@Component({
  selector: 'tables-assembly-election-list',
  templateUrl: './assembly-election-list.component.html',
  styleUrls: ['./assembly-election-list.component.scss']
})
export class AssemblyElectionListComponent implements OnInit {
  createModalVisible = false;
  electionList: any = [];
  tempElectionList: any = [];
  search: any = null;

  constructor(private electionService: AssemblyElectionService,
              private router: Router,
              private notification: NzNotificationService,
              ) { }

  ngOnInit() {
    this.getElectionList();
  }

  getElectionList() {
    this.electionService.getAssemblyElectionList().subscribe((res: any) => {
      this.electionList = this.tempElectionList = res;
    });
  }

  showCreateModal() {
    this.electionService.getActiveElections('ACTIVE').subscribe((res: any) => {
    if(res){
     if(res.length!= 0){
       this.notification.create("warning","Warning","An assembly election is already active,You cannot create one right now")
     }else{
      this.createModalVisible = true;
     }
    }
    });
    
  }

  hideCreateModal() {
    this.createModalVisible = false;
  }

  showLinks(id) {
    this.electionList.forEach((element) => {
      if (element.id === id) {
        element.viewLinks = true;
      } else {
        element.viewLinks = false;
      }
    });
  }

  hideLinks(id) {
    this.electionList.forEach((element) => {
      if (element.id === id) {
        element.viewLinks = false;
      }
    });
  }

  viewElection(id) {
    this.router.navigate(['business-dashboard/tables/assembly-election/view', id]);
  }

  searchElectionList() {
    if (this.search) {
      this.electionList = this.tempElectionList.filter(x =>
        (x.assembly && x.assembly.toString().toLowerCase().includes(this.search.toLowerCase())) ||
        (x.subject && x.subject.toLowerCase().includes(this.search.toLowerCase())) ||
        (x.type && x.type.toLowerCase().includes(this.search.toLowerCase())) ||
        (x.description && x.description.toLowerCase().includes(this.search.toLowerCase())) ||
        (x.year && x.year.toLowerCase().includes(this.search.toLowerCase())));
    } else {
      this.electionList = this.tempElectionList;
    }
  }

}
