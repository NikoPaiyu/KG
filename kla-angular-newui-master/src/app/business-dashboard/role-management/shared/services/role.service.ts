import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Role } from "../models/role";

@Injectable()
export class RoleService {
  private rolesData: Role[] = [
    {
      roleName: "Admin",
      description: "Administrator",
      policies: [
        {
          id: "",
          policyName: "User Management",
          privilages: ["Create", "Delete"]
        }
      ],
      id: ""
    },
    {
      roleName: "User",
      description: "User",
      policies: [],
      id: ""
    }
  ];
  constructor(private http: HttpClient) {}

  getAllRoles() {
    return this.rolesData;
    this.http.get(`getUrl`);
  }

  getRole(id: string) {
    return this.rolesData.find(element => element.roleName === id);
    this.http.get(`getUrl`);
  }

  addNewRole(role: Role) {
    this.http.post(`postApi`, role);
  }

  updateRole(role: Role) {
    this.http.put(`postApi`, role);
  }

  deleteRole(role: Role) {
    this.http.delete(`deleteApi`);
  }

  getPolicyPrivilages() {
    const children: Array<{ label: string; value: string }> = [];
    children.push(
      { label: "Create", value: "Create" },
      { label: "Delete", value: "Delete" },
      { label: "Update", value: "Update" }
    );
    return children;
  }

  getPlocies() {
    const children: Array<{ label: string; value: string }> = [];
    children.push(
      { label: "User Management", value: "1" },
      { label: "Budget", value: "2" },
      { label: "Role Management", value: "3" }
    );
    return children;
  }
}
