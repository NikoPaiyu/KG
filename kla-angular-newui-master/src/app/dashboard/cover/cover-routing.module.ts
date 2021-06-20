import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CoverComponent } from "./cover.component";
import { CoverfolderComponent } from './coverfolder/coverfolder.component';
const routes: Routes = [
  {
    path: "",
    component: CoverComponent
  },
  {
    path:"cover/:id",
    component:CoverfolderComponent
  },
   {
    path:":folder",
    component:CoverfolderComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoverRoutingModule {}
