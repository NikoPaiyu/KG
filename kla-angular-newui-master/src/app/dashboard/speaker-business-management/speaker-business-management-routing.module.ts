import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SpeakerBusinessManagementComponent } from "./speaker-business-management.component";
import { SpeakerLiveBusinessManagementComponent } from "./speaker-live-business-management/speaker-live-business-management.component";

const routes: Routes = [
  {
    path: "",
    component: SpeakerBusinessManagementComponent,
    children: [
      { path: "", redirectTo: "view", pathMatch: "full" },
      {
        path: "view",
        component: SpeakerLiveBusinessManagementComponent,
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
export class SpeakerBusinessManagementRoutingModule {}
