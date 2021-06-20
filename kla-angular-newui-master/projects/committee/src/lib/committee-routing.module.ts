import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CommitteeComponent } from "./committee.component";
const routes: Routes = [
  {
    path: "",
    component: CommitteeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommitteeRoutingModule {}
