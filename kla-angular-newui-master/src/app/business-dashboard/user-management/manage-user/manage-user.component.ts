import { Component, OnInit } from "@angular/core";
import { UserDetails } from "../shared/models/userDetails";
import { NgForm } from "@angular/forms";
import { UserManagementService } from "../shared/services/user-management.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-manage-user",
  templateUrl: "./manage-user.component.html",
  styleUrls: ["./manage-user.component.scss"]
})
export class ManageUserComponent implements OnInit {
  users: UserDetails[] = [];
  allUsers: UserDetails[] = [];
  searchParam: string = "";
  userType = "MEMBER";
  userTypes = [
    { label: "Members", value: "MEMBER" },
    { label: "Non-Members", value: "NON_MEMBER" }
  ];
  constructor(
    public userService: UserManagementService,
    public router: Router
  ) {}

  ngOnInit() {
    this.getAllUsersByUserType(this.userType);
    if (this.router.url.includes('/user-management/user-version-2')) {
      this.userTypes.push(
        { label: 'Elected', value: 'ELECTED' },
        { label: 'Ex-MLA', value: 'EX_MLA' }
      );
    }
  }

  onSearchUser() {
    if (this.searchParam)
      this.users = this.allUsers.filter(
        element =>
          (element.userName &&
          element.userName
            .toLowerCase()
            .includes(this.searchParam.toLowerCase())) ||
          (element.firstName &&
          element.firstName
            .toLowerCase()
            .includes(this.searchParam.toLowerCase())) ||
          (element.lastName &&
          element.lastName
            .toLowerCase()
            .includes(this.searchParam.toLowerCase())) ||
          (element.email &&
          element.email
            .toLowerCase()
            .includes(this.searchParam.toLowerCase())) ||
         (element.mobileNumber && 
          element.mobileNumber
            .toLowerCase()
            .includes(this.searchParam.toLowerCase())) ||
          (element.roleDisplay &&
          element.roleDisplay
            .toString()
            .toLowerCase()
            .includes(this.searchParam.toLowerCase())) ||
          (element.constituencyName &&
            element.constituencyName
              .toLowerCase()
              .includes(this.searchParam.toLowerCase()))
      );
    else this.users = this.allUsers;
  }

  getAllUsers() {
    this.userService.getUsers().subscribe(data => {
      this.allUsers = data;
      this.users = data;
    });
  }

  getAllUsersByUserType(userType) {
    this.searchParam = "";
    this.userService.getAllUsersByUserType(userType).subscribe(data => {
      this.allUsers = data;
      this.users = data;
      this.onSearchUser();
    });
  }

  onCreateUserClick(userType: String) {
    this.router.navigate([
      "business-dashboard/user-management/create-user",
      userType
    ]);
  }

  onEditUser(user: UserDetails) {
    if (this.router.url.includes('/user-management/user-version-2') && (user.userType == 'MEMBER' || user.userType == 'ELECTED'  || user.userType == 'EX_MLA')) {
      this.router.navigate([
        "/business-dashboard/tables/assembly-election/elected-member",
        user.id
      ]);
    }else{
    this.router.navigate([
      "business-dashboard/user-management/edit-user",
      user.userName
    ]);
  }
  }

  sort(sort: { key: string; value: string }): void {
    const data = this.users.filter(item => item);
    if (sort.key && sort.value) {
      this.users = data.sort((a, b) =>
        sort.value === "ascend"
          ? a[sort.key!].toLowerCase() > b[sort.key!].toLowerCase()
            ? 1
            : -1
          : b[sort.key!].toLowerCase() > a[sort.key!].toLowerCase()
          ? 1
          : -1
      );
    } else {
      this.users = data;
    }
  }
}
