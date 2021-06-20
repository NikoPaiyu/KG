import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SwearingInService } from '../shared/services/swearing-in.service';

@Component({
  selector: 'tables-election-list',
  templateUrl: './election-list.component.html',
  styleUrls: ['./election-list.component.scss']
})
export class ElectionListComponent implements OnInit {
  electionList: any = [];
  tempElectionList: any = [];
  search: any = null;
  constructor(private service: SwearingInService,
              private router: Router) { }

  ngOnInit() {
    this.getElectionList();
  }

  getElectionList() {
    this.service.getAssemblyElectionList().subscribe((res: any) => {
      this.electionList = this.tempElectionList = res;
    });
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

  viewSwearingIn(id) {
    this.router.navigate(['business-dashboard/tables/swearing-in/list', id]);
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
