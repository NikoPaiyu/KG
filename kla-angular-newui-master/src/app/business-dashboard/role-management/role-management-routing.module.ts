import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { RoleManagementComponent } from "./role-management.component";
import { ManageRolesComponent } from "./manage-roles/manage-roles.component";
import { CreateRoleComponent } from "./create-role/create-role.component";
import { EditRoleComponent } from "./edit-role/edit-role.component";

const routes: Routes = [
  {
    path: "",
    component: RoleManagementComponent,
    children: [
      { path: "manage-roles", component: ManageRolesComponent },
      { path: "create-role", component: CreateRoleComponent },
      { path: "edit-role/:id", component: EditRoleComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoleManagementRoutingModule {}
