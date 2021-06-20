import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PmbrComponent } from './pmbr.component';

const routes: Routes = [
  { path: "", component: PmbrComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PmbrRoutingModule { }
