import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BudgetCommonService } from '../../shared/services/budgetcommon.service';

@Component({
  selector: 'budget-time-allocation-listing',
  templateUrl: './time-allocation-listing.component.html',
  styleUrls: ['./time-allocation-listing.component.scss']
})
export class TimeAllocationListingComponent implements OnInit {
  TimeAllocationlist: any = null;
  currentAssemblySession: any = null;
  type = 'CUT_MOTION';
  constructor(private common: BudgetCommonService,
              private router: Router) { }

  ngOnInit() {
    this.getCurrentAssemblySession();
    if (this.router.url.includes('/budgets/time-alloc-list')) {
      this.type = 'CUT_MOTION'
    }else if(this.router.url.includes('/budgets/sdgeg/time-alloc-list')){
      this.type = 'SDG_EG'
    }
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
    this.router.navigate(['business-dashboard/budgets/time-alloc-ts']);
  }

}
