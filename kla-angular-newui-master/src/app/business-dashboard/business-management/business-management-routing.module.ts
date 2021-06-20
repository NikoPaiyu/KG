import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { BusinessManagementComponent } from "./business-management.component";
import { LiveBusinessManagementComponent } from "./live-business-management/live-business-management.component";

const routes: Routes = [
  {
    path: "",
    component: BusinessManagementComponent,
    children: [
      { path: "", redirectTo: "view", pathMatch: "full" },
      {
        path: "view",
        component: LiveBusinessManagementComponent,
        data: {
          breadcrumb: "List"
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessManagementRoutingModule {}
