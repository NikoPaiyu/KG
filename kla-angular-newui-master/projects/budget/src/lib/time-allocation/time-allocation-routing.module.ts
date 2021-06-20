import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TimeAllocationComponent } from './time-allocation.component'; 
import { AddMembersComponent } from './add-members/add-members.component'; 
import { ConfigurationComponent } from './configuration/configuration.component'; 
import { TimeAllocationListingComponent } from './time-allocation-listing/time-allocation-listing.component'; 
import { TimeallocationMemberComponent } from './timeallocation-member/timeallocation-member.component'; 
import { TimeallocationTsComponent } from './timeallocation-ts/timeallocation-ts.component'; 

const routes: Routes = [
  {
    path: '',
    component: TimeAllocationComponent,
    children: [
      {
        path: 'time-alloc-cof',
        component: ConfigurationComponent,
      },
      {
        path: 'time-alloc-mem',
        component: TimeallocationMemberComponent, 
      },
      {
        path: 'time-alloc/member/add',
        component: AddMembersComponent,
      },
      {
        path: 'time-alloc-ts',
        component: TimeallocationTsComponent,
      },
      {
        path: 'time-alloc-list',
        component: TimeAllocationListingComponent,
      },
      // {
      //   path: 'sdgeg/time-alloc-cof',
      //   component: ConfigurationComponent,
      // },
      // {
      //   path: 'sdgeg/time-alloc-list',
      //   component: TimeAllocationListingComponent,
      // }
    ],
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimeAllocationRoutingModule { }
