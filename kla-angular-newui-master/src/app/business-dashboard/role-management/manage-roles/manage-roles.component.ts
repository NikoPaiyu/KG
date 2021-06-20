import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Role } from "../shared/models/role";
import { RoleService } from "../shared/services/role.service";

@Component({
  selector: "app-manage-roles",
  templateUrl: "./manage-roles.component.html",
  styleUrls: ["./manage-roles.component.scss"]
})
export class ManageRolesComponent implements OnInit {
  rolesData: Role[] = [];
  constructor(private router: Router, private roleService: RoleService) {}

  ngOnInit() {
    
    this.getAllRoles();
  }

  getAllRoles() {
    this.rolesData = this.roleService.getAllRoles();
  }
  onCreateRoleClick() {
    this.router.navigate(["business-dashboard/role-management/create-role"]);
  }

  viewRoleDetails(data: Role) {
    this.router.navigate([
      "business-dashboard/role-management/edit-role",
      data.roleName
    ]);
  }

  deleteRole(data: Role) {
    this.roleService.deleteRole(data);
  }
}
