import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { UserManagementRoutingModule } from "./user-management-routing.module";
import { UserManagementComponent } from "./user-management.component";
import { ManageUserComponent } from "./manage-user/manage-user.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { UserManagementService } from "./shared/services/user-management.service";
import { CreateUserComponent } from "./create-user/create-user.component";
import { EditUserComponent } from "./edit-user/edit-user.component";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { ConfirmationPopoverModule } from "angular-confirmation-popover";
import { BiometricEnrollmentComponent } from './biometric-enrollment/biometric-enrollment.component';
import { NzInputModule } from 'ng-zorro-antd/input';
import { CreateRoleComponent } from './create-role/create-role.component';
import { ListRolesComponent } from './list-roles/list-roles.component';

import { NestableModule } from 'ngx-nestable';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { TranslateModule } from '@ngx-translate/core';
import { CreateMemberComponent } from './create-member/create-member.component';

@NgModule({
  declarations: [
    UserManagementComponent,
    ManageUserComponent,
    CreateUserComponent,
    EditUserComponent,
    BiometricEnrollmentComponent,
    CreateRoleComponent,
    ListRolesComponent,
    CreateMemberComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    UserManagementRoutingModule,
    NzInputModule,
    NestableModule,
    NzIconModule,
    NzButtonModule,
    NzModalModule,
    NzSelectModule,
    TranslateModule,
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: "danger"
    })
  ],
  providers: [UserManagementService]
})
export class UserManagementModule {}
