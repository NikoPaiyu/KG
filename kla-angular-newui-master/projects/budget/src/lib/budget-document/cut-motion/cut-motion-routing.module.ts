import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CutMotionComponent } from './cut-motion.component';
import { ListCutMotionComponent } from './list-cut-motion/list-cut-motion.component';
import { PrepareBitListComponent } from './bit-list/prepare-bit-list/prepare-bit-list.component';
import { ViewCutMotionComponent } from './view-cut-motion/view-cut-motion.component';
import { ApprovedListComponent } from './approved-list/approved-list.component';
import { ListAllComponent } from './bit-list/list-all/list-all.component';

const routes: Routes = [
  {
    path: "",
    component: CutMotionComponent,
    children: [
      {
        path: "cutmotion/submitted/view/:id",
        component: ListCutMotionComponent
      },
      {
        path: "cutmotion/submit/:id",
        component: ViewCutMotionComponent
      },
      {
        path: "cutmotion/bit-list/create",
        component: PrepareBitListComponent
      },
      {
        path: "cutmotion/bit-list/view/:id",
        component: PrepareBitListComponent
      },
      {
        path: "cutmotion/approved",
        component: ApprovedListComponent
      },
      {
        path: "cutmotion/published",
        component: ApprovedListComponent
      },
      {
        path: 'cutmotion/bit-list',
        component: ListAllComponent,
      },
    ],
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CutMotionRoutingModule { }
