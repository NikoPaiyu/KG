import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuardService } from "./auth/shared/services/auth-guard.service";

const routes: Routes = [
  { path: "auth", loadChildren: "./auth/auth.module#AuthModule" },
  {
    path: "dashboard",
    loadChildren: "./dashboard/dashboard.module#DashboardModule",
   canActivate: [AuthGuardService],
    data: {
      expectedRole:
        "MLA,governor,privateSecretaryToSpeaker,secretary,speakerNote,dcSupport,swearingIn"
    }
  },
  {
    path:"business-dashboard",
    loadChildren:
      "./business-dashboard/business-dashboard.module#BusinessDashboardModule",
      canActivate: [AuthGuardService],
    data: {
      unExpectedRole:
        // "MLA,governor,privateSecretaryToSpeaker,secretary,speakerNote,dcSupport"
        "governor,speakerNote,dcSupport"
    }
  },

  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
