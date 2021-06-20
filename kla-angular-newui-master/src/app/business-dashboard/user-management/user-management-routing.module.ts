import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { UserManagementComponent } from "./user-management.component";
import { ManageUserComponent } from "./manage-user/manage-user.component";
import { CreateUserComponent } from "./create-user/create-user.component";
import { EditUserComponent } from "./edit-user/edit-user.component";
import { BiometricEnrollmentComponent } from './biometric-enrollment/biometric-enrollment.component';
import { ListRolesComponent } from './list-roles/list-roles.component';
import { CreateRoleComponent } from './create-role/create-role.component';
import { CreateMemberComponent } from './create-member/create-member.component';

const routes: Routes = [
  {
    path: '',
    component: UserManagementComponent,
    children: [
      { path: '', redirectTo: 'manage-user', pathMatch: 'full' },
      { path: 'manage-user', component: ManageUserComponent },
      { path: 'user-version-2', component: ManageUserComponent },
      { path: 'create-user/:userType', component: CreateUserComponent },
      { path: 'edit-user/:id', component: EditUserComponent },
      { path: 'create-role', component: CreateRoleComponent},
      { path: 'edit-role/:id', component: CreateRoleComponent },
      { path: 'list-roles' , component: ListRolesComponent},          
      { path: 'create-member' , component: CreateMemberComponent},
      { path: "bio-enroll",component: BiometricEnrollmentComponent},  
      { path: '**', redirectTo: 'manage-user' }      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManagementRoutingModule {}
