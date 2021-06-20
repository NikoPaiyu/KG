import { Component, OnInit, ViewChild } from "@angular/core";
import { Role } from "../shared/models/role";
import { Policies } from "../shared/models/policies";
import { NgForm } from "@angular/forms";
import { from } from "rxjs";
import { Router } from "@angular/router";
import { RoleService } from "../shared/services/role.service";

@Component({
  selector: "app-create-role",
  templateUrl: "./create-role.component.html",
  styleUrls: ["./create-role.component.scss"]
})
export class CreateRoleComponent implements OnInit {
  @ViewChild("roleAddForm", { static: true }) roleAddForm: NgForm;
  public role: Role = new Role();
  listOfOption: Array<{ label: string; value: string }> = [];

  listOfPolicies: Array<{ label: string; value: string }> = [];
  constructor(private router: Router, private roleService: RoleService) {}

  ngOnInit() {
   
    this.getPlocies();
    this.getPolicyPrivilages();
  }
  getPlocies() {
    this.listOfPolicies = this.roleService.getPlocies();
  }
  getPolicyPrivilages() {
    this.listOfOption = this.roleService.getPolicyPrivilages();
  }

  addNewPolicy() {
    this.role.policies.push(new Policies());
  }

  deletePolcy(index: number) {
    this.role.policies.splice(index, 1);
  }
  onSave(form: NgForm) {
    this.validateForm(form);
  }
  validateForm(form: NgForm) {
    for (const key in form.controls) {
      this.roleAddForm.form.controls[key].markAsDirty();
      this.roleAddForm.form.controls[key].updateValueAndValidity();
    }
  }
  onCancel() {
    this.role = new Role();
    this.router.navigate(["business-dashboard/role-management/manage-roles"]);
  }
}
