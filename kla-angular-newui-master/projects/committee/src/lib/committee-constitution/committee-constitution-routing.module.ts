import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CommitteeConstitutionComponent } from './committee-constitution.component';
import { LetterToPpoComponent } from './letter-to-ppo/letter-to-ppo.component';
import { SubjectCommitteeNomineeComponent } from './subject-committee-nominee/subject-committee-nominee.component';
import { CommitteeChartComponent } from './committee-chart/committee-chart.component';
import { CommitteeListingComponent } from '../committees/committee-listing/committee-listing.component';
import { SelectCommitteeConstitutionComponent } from './select-committee-constitution/select-committee-constitution.component';
import { PmbrCommitteeNomineeComponent } from './pmbr-committee-nominee/pmbr-committee-nominee.component';

const routes: Routes = [

  {
    path: '', component: CommitteeConstitutionComponent,
    children: [
      {
        path: "",
        redirectTo: "letter-to-ppo",
      },
      {
        path: 'letter-to-ppo',
        component: LetterToPpoComponent,
      },
      {
        path: 'subject-nominee/:purpose/:id',
        component: SubjectCommitteeNomineeComponent,
      },
      {
        path: 'commitee-chart',
        component: CommitteeChartComponent,
      },
      {
        path:'committee-list',
        component:CommitteeListingComponent
      },
      {
        path:'select-committee-members/:purpose/:id',
        component:SelectCommitteeConstitutionComponent
      },
      {
        path:'pmbr-committee-members/:purpose/:id',
        component:PmbrCommitteeNomineeComponent
      },
    ]
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommitteeConstitutionRoutingModule { }
