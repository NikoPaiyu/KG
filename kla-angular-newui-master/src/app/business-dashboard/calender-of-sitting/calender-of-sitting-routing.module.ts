import { CosListComponent } from './cos-list/cos-list.component';
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CalenderOfSittingComponent } from "./calender-of-sitting.component";
import { ViewCalenderComponent } from './view-calender/view-calender.component';
import { AddCalenderComponent } from './add-calender/add-calender.component';
import { FileTrackingComponent } from './file-tracking/file-tracking.component';
import { ApprovedCosComponent } from './approved-cos/approved-cos.component';

const routes: Routes = [
  {
    path: "",
    component: CalenderOfSittingComponent,
    children: [
      { path: "", redirectTo: "view", pathMatch: "full" },
      {
        path: 'add',
        component: ViewCalenderComponent
      },
      {
        path: "view/:details",
        component: AddCalenderComponent
      },
      {
        path: "view",
        component: AddCalenderComponent
      },
      {
        path: "file",
        component: FileTrackingComponent
      },
      {
        path: "cos-list/:assemblyId/:sessionId",
        component: CosListComponent
      },
      {
        path: 'cos-list',
        component: CosListComponent
      },
      {
        path: "file/:id/:assemblyId/:sessionId",
        component: FileTrackingComponent
      },
      {
        path: 'file/:id',
        component: FileTrackingComponent
      },
      {
        path: 'approved-cos',
        component: ApprovedCosComponent
      }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalenderOfSittingRoutingModule { }
