import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { AuthComponent } from "./auth.component";
import { BiometricLoginComponent } from "./biometric-login/biometric-login.component";
const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      { path: "", redirectTo: "login" },
      { path: 'login', component: LoginComponent },
      { path: 'bio', component: BiometricLoginComponent }//,
      //{ path: '**', component: BiometricLoginComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class AuthRoutingModule {}
