import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PmbrCommitteeComponent } from './pmbr-committee.component';


const routes: Routes = [{
  path: "", component: PmbrCommitteeComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PmbrCommitteeRoutingModule { }
