import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GenerateTimeAllocationComponent } from './generate-time-allocation/generate-time-allocation.component';
import { PendingTimeAllocationBusinessComponent } from './pending-time-allocation-business/pending-time-allocation-business.component';
import { TimeAllocationComponent } from './time-allocation.component';
import { ViewTimeAllocationComponent } from './view-time-allocation/view-time-allocation.component';


const routes: Routes = [
  {
    path: 'time-allocation', component: TimeAllocationComponent,
    children: [
      {
        path: "pending-business",
        component: PendingTimeAllocationBusinessComponent
      },
      {
        path: "generate-time-allocation/:id",
        component: GenerateTimeAllocationComponent
      },
      {
        path: "view-time-allocation/:id",
        component: ViewTimeAllocationComponent
      }
    ]  
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimeAllocationRoutingModule { }
