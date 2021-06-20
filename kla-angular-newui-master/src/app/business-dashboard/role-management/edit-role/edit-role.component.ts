import { Component, OnInit, ViewChild } from "@angular/core";
import { Policies } from "../shared/models/policies";
import { Router, ActivatedRoute } from "@angular/router";
import { NgForm } from "@angular/forms";
import { Role } from "../shared/models/role";
import { RoleService } from "../shared/services/role.service";

@Component({
  selector: "app-edit-role",
  templateUrl: "./edit-role.component.html",
  styleUrls: ["./edit-role.component.scss"]
})
export class EditRoleComponent implements OnInit {
  @ViewChild("roleAddForm", { static: true }) roleAddForm: NgForm;
  public role: Role = new Role();
  appliedPolicies = ["1", "2"];
  listOfOption: Array<{ id: string; privilage: string }> = [];
  listOfPolicies: Array<{ label: string; value: string }> = [];
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private roleService: RoleService
  ) {}

  ngOnInit() {
    
    this.roleAddForm.reset();
    this.role = new Role();
    this.route.params.subscribe(params => {
      let roleId = params["id"];
      if (roleId) {
        this.getRole(roleId);
      }
    });
    this.getPlocies();
    this.getPolicyPrivilages();
  }

  getRole(id: string) {
    this.role = this.roleService.getRole(id);
  }

  getPlocies() {
    this.listOfPolicies = this.roleService.getPlocies();
  }
  getPolicyPrivilages() {
    const children: Array<{ id: string; privilage: string }> = [];
    children.push(
      { id: "Create", privilage: "Create" },
      { id: "Delete", privilage: "Delete" },
      { id: "Update", privilage: "Update" }
    );
    this.listOfOption = children;
  }

  addNewPolicy() {
    this.role.policies.push(new Policies());
  }

  deletePolcy(index: number) {
    this.role.policies.splice(index, 1);
  }
  onSave(form: any) {
    form._directives.forEach(element => {
      this.roleAddForm.form.controls[element.name].markAsDirty();
      this.roleAddForm.form.controls[element.name].markAllAsTouched();
      this.roleAddForm.form.controls[element.name].updateValueAndValidity();
    });
  }

  onCancel() {
    this.role = new Role();
    this.router.navigate(["business-dashboard/role-management/manage-roles"]);
  }
}
