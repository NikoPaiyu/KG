import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserManagementService } from '../shared/services/user-management.service';

@Component({
  selector: 'app-list-roles',
  templateUrl: './list-roles.component.html',
  styleUrls: ['./list-roles.component.scss']
})
export class ListRolesComponent implements OnInit {
  sortName: string;
  sortValue: string;
  mapOfCheckedId: any;
  listOfDisplayData: any = [];
  searchParam = '';
  listOfData: Array<{ id: any; name: string; description: string; [key: string]: any }>  = [];
  searchRoleName: any;
  listOfSearchName: string[] = [];

  constructor(public http: HttpClient, public router: Router, public userService: UserManagementService) { }

  ngOnInit() {
    this.userService.getRbsRole().subscribe(Res => {
      this.listOfDisplayData = Res;
      this.listOfData = this.listOfDisplayData;
    });

  }

  onSearchUser() {
    if (this.searchParam) {
      this.listOfData = this.listOfDisplayData.filter(
        element =>
          (element.name &&
            element.name
              .toLowerCase()
              .includes(this.searchParam.toLowerCase()))
      );
    } else {
      this.listOfData = this.listOfDisplayData;
    }
  }

  sort(sort: { key: string; value: string }): void {
    this.sortName = sort.key;
    this.sortValue = sort.value;
    const data = this.listOfDisplayData.filter(item => item);
    if (this.sortName && this.sortValue) {
      this.listOfData = data.sort((a, b) =>
      this.sortValue === 'ascend'
          ? a[this.sortName].toLowerCase() > b[this.sortName].toLowerCase()
            ? 1
            : -1
          : b[this.sortName].toLowerCase() > a[this.sortName].toLowerCase()
          ? 1
          : -1
      );
    } else {
      this.listOfData = data;
    }
  }

  createRole() {
    this.router.navigate([
      'business-dashboard/user-management/create-role',
    ]);
  }

  editRole(role) {
    this.router.navigate([
      'business-dashboard/user-management/edit-role',
      role.id
    ]);
  }
}
