import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TablescommonService } from '../../../shared/services/tablescommon.service';

@Component({
  selector: 'tables-time-allocation-listing',
  templateUrl: './time-allocation-listing.component.html',
  styleUrls: ['./time-allocation-listing.component.scss']
})
export class TimeAllocationListingComponent implements OnInit {
  TimeAllocationlist: any = null;
  currentAssemblySession: any = null;

  constructor(private common: TablescommonService,
              private router: Router) { }

  ngOnInit() {
    this.getCurrentAssemblySession();
  }

  getCurrentAssemblySession() {
    this.common.getCurrentAssemblyAndSession().subscribe(res => {
      this.currentAssemblySession = [res];
    });
  }

  showLinks(id) {
    this.currentAssemblySession.forEach((element) => {
      if (element.id === id) {
        element.viewLinks = true;
      } else {
        element.viewLinks = false;
      }
    });
  }

  hideLinks(id) {
    this.currentAssemblySession.forEach((element) => {
      if (element.id === id) {
        element.viewLinks = false;
      }
    });
  }

  viewTimeAllocation(session) {
    this.router.navigate(['business-dashboard/tables/time-alloc-ts', session]);
  }

}
