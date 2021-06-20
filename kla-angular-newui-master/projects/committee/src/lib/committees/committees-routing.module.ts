import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CommitteesComponent } from './committees.component';
import { CommitteeListingComponent } from './committee-listing/committee-listing.component';
import { CommitteeEditComponent } from './committee-edit/committee-edit.component';
import { CommitteeViewComponent } from './committee-view/committee-view.component';

const routes: Routes = [

  {
    path: '', component: CommitteesComponent,
    children: [
      {
        path: "",
        redirectTo: "committee-list",
      },
      {
        path: 'committee-list',
        component: CommitteeListingComponent,
      },
      {
        path: 'committee-edit',
        component: CommitteeEditComponent,
      },
      {
        path: 'committee-view',
        component: CommitteeViewComponent,
      }
    ]
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommitteesRoutingModule { }
