import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { RoleManagementRoutingModule } from "./role-management-routing.module";
import { RoleManagementComponent } from "./role-management.component";
import { CreateRoleComponent } from "./create-role/create-role.component";
import { ManageRolesComponent } from "./manage-roles/manage-roles.component";
import { EditRoleComponent } from "./edit-role/edit-role.component";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { FormsModule } from "@angular/forms";
import { RoleService } from "./shared/services/role.service";
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    RoleManagementComponent,
    CreateRoleComponent,
    ManageRolesComponent,
    EditRoleComponent
  ],
  imports: [
    CommonModule,TranslateModule,
    RoleManagementRoutingModule,
    NgZorroAntdModule,
    FormsModule
  ],
  providers: [RoleService]
})
export class RoleManagementModule {}
