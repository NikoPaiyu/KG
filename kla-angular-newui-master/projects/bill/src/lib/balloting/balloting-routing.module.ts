import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BallotingComponent } from './balloting.component';
import { PerformBallotingComponent } from './perform-balloting/perform-balloting.component';

const routes: Routes = [

  { path: '', component: BallotingComponent ,
  children: [
    {
      path: 'perform-balloting/:id',
      component: PerformBallotingComponent,
    },
    // {
    //   path:"perform-balloting/:id/:title",
    //   component:PerformBallotingComponent,
    // }
  ]
},

    
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BallotingRoutingModule { }
