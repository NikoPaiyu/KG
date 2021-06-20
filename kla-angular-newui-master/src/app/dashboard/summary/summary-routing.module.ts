import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SummaryComponent } from "./summary.component";
import { SummaryfolderComponent } from './summaryfolder/summaryfolder.component';
const routes: Routes = [
  {
    path: "",
    component: SummaryComponent
  },
  {
    path: "miscellaneous",
    loadChildren: './Miscellaneous/msc.module#MscModule',
  },
  {
    path: "summary",
    loadChildren: './summaryfolder/summaryfolder.module#SummaryfolderModule'
  },
  {
    path: "cover",
    loadChildren: '../cover/cover.module#CoverModule'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SummaryRoutingModule { }
