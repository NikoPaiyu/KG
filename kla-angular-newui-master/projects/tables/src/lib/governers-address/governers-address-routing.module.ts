import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GovernersAddressComponent } from './governers-address.component';
import { ListGovernersAddressComponent } from './list-governers-address/list-governers-address.component';
import { CreateMinuteComponent } from "./minute-to-minute/create-minute/create-minute.component";
import { ListMinuteComponent } from "./minute-to-minute/list-minute/list-minute.component";
import { ViewMinuteComponent } from "./minute-to-minute/view-minute/view-minute.component";
import { ConfigurationComponent } from './time-allocation/configuration/configuration.component';
import { AddMembersComponent } from './time-allocation/add-members/add-members.component';
import { TimeallocationMemberComponent } from './time-allocation/timeallocation-member/timeallocation-member.component';
import { TimeallocationTsComponent } from './time-allocation/timeallocation-ts/timeallocation-ts.component';
import { ListProcessionComponent } from './procession/list-procession/list-procession.component';
import { AmendmentMOTComponent } from './amendment-mot/amendment-mot.component';
import { ApprovedMOTComponent } from './approved-mot/approved-mot.component';
import { ListMOTComponent } from './list-mot/list-mot.component';
import { TimeAllocationListingComponent } from './time-allocation/time-allocation-listing/time-allocation-listing.component';
import { AmendmentListpreparationComponent } from './amendment-listpreparation/amendment-listpreparation.component';

const routes: Routes = [

  {
    path: '', component: GovernersAddressComponent,
    children: [
      {
        path: 'list-ga',
        component: ListGovernersAddressComponent,
      },
      {
        path: 'list-m2m',
        component: ListMinuteComponent,
      },
      {
        path: 'create-m2m/:mid',
        component: CreateMinuteComponent,
      },
      {
        path: 'view/:id',
        component: ViewMinuteComponent,
      },
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
        path: 'time-alloc-ts/:sessionId',
        component: TimeallocationTsComponent,
      },
      {
        path: 'time-alloc-list',
        component: TimeAllocationListingComponent,
      },
      {
        path: 'list-procession',
        component: ListProcessionComponent,
      },
      {
        path: 'amendment-MOT',
        component:AmendmentMOTComponent,
      },
      {
        path: 'approved-MOT',
        component:ApprovedMOTComponent,
      },
      {
        path: 'list-MOT',
        component:ListMOTComponent,
      },
      {
        path: 'list-amendment',
        component:AmendmentListpreparationComponent,
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GovernerAddressRoutingModule { }
