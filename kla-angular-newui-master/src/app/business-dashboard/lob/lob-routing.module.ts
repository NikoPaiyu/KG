import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LobListingComponent } from "./lob-listing/lob-listing.component";
import { LobCreateComponent } from "./lob-create/lob-create.component";
import { LobWorkflowComponent } from "./lob-workflow/lob-workflow.component";
import { LobComponent } from "./lob.component";
import { BusinessControllerViewComponent } from "./business-controller-view/business-controller-view.component";
import { StaffLobViewComponent } from "./stafflobview/stafflobview.component";

const routes: Routes = [
  {
    path: "",
    component: LobComponent,
    children: [
      { path: "", redirectTo: "listing", pathMatch: "full" },
      {
        path: "listing",
        component: LobListingComponent,
        data: {
          breadcrumb: "List"
        }
      },
      {
        path: "create",
        component: LobCreateComponent,
        data: {
          breadcrumb: "Create"
        }
      },
      {
        path: "workflow",
        component: LobWorkflowComponent,
        data: {
          breadcrumb: "Update"
        }
      },
      {
        path: "view",
        component: BusinessControllerViewComponent
      },
      {
        path: "lobview",
        component: StaffLobViewComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LobRoutingModule {}
