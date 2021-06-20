import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuthRoutingModule } from "./auth-routing.module";
import { FormsModule } from "@angular/forms";
import { LoginComponent } from "./login/login.component";
import { AuthComponent } from "./auth.component";
import { BiometricLoginComponent } from "./biometric-login/biometric-login.component";
import { NzIconModule } from "ng-zorro-antd/icon";
import { PasswordResetTemplateComponent } from "./shared/components/passwordreset-notification.component";
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    LoginComponent,
    AuthComponent,
    BiometricLoginComponent,
    PasswordResetTemplateComponent
  ],
  imports: [CommonModule, FormsModule, AuthRoutingModule, NzIconModule,TranslateModule],
  providers: []
})
export class AuthModule {}
