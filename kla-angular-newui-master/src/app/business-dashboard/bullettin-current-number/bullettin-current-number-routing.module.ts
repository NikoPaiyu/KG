import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BullettinCurrentNumberComponent } from './bullettin-current-number.component';


const routes: Routes = [
  {
    path: "",
    component: BullettinCurrentNumberComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BullettinCurrentNumberRoutingModule { }
