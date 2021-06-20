import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  NgForm,
} from "@angular/forms";
import { NzFormatEmitEvent, NzDescriptionsComponent } from "ng-zorro-antd";
import { HttpClient } from "@angular/common/http";
import { Categories, Policies, RolePolicy } from "../shared/models/Policies";
import { environment } from "src/environments/environment";
import { UserManagementService } from "../shared/services/user-management.service";
import { Router, ActivatedRoute } from "@angular/router";
import { NotificationCustomService } from "src/app/shared/services/notification.service";
import { exit } from "process";

@Component({
  selector: "app-create-role",
  templateUrl: "./create-role.component.html",
  styleUrls: ["./create-role.component.scss"],
})
export class CreateRoleComponent implements OnInit {
  roleForm: FormGroup;
  sectionSelected: any;
  selectedSection: any;
  sectionArray: any = [];
  sectionRoles: any = [];
  policyVisible = false;
  // check = false;
  // id = 0;
  // menuList = [];
  // temporaryMenuList = [];
  menuIds: any = [];
  categoryselected: any;
  policyselected: any;
  selectedPolicy: any;
  selectedCategory: any;
  policyCategory: any;
  policyArray: any = [];
  policyPermissionArray: any = [];
  rolePolicyArray: any = {
    categoryList: [],
    categories: {},
    policies: {},
  };
  menuSelected: any;
  selectedMenu: any;
  menuVisible = false;
  roleMenuArray: any = [];
  menuArray: any = [];
  iteratePolicy = false;
  iterateMenu = false;
  editMode = false;
  roleEditArray: any = [];
  roleId: any = null;
  catCheck: any;
  addMenuBtn = false;
  addCat = false;
  addPol = false;
  addPolbtn = false;
  rbsmenuArr = [];
  rbsmenuObj = { path: "", menus: [] };
  deletedMenuIds: any = [];
  // nodes = [
  //   {
  //     title: 'Menu 1',
  //     key: 'Menu 1',
  //     expanded: true
  //   },
  //   {
  //     title: 'Menu 2',
  //     key: 'Menu 2',
  //     expanded: true
  //   },
  //   {
  //     title: 'Menu 3',
  //     key: 'Menu 3',
  //     expanded: true
  //   }
  // ];
  // options = {
  //   maxDepth: 3
  // };

  // list = [
  //   { id: 1 },
  //   {
  //     expanded: true,
  //     id: 2,
  //     children: [
  //       { id: 3 },
  //       { id: 4 },
  //       {
  //         expanded: true,
  //         id: 5,
  //         children: [{ id: 6 }, { id: 7 }, { id: 8 }]
  //       },
  //       { id: 9 },
  //       { id: 10 }
  //     ]
  //   },
  //   { id: 11 }
  // ];

  // nzEvent(event: NzFormatEmitEvent): void {
  //   console.log(event);
  // }

  constructor(
    private fb: FormBuilder,
    public http: HttpClient,
    private userManagementService: UserManagementService,
    public router: Router,
    public notify: NotificationCustomService,
    public route: ActivatedRoute
  ) {
    this.roleForm = this.fb.group({
      name: new FormControl("", Validators.required),
      description: new FormControl("", Validators.required),
      sectionname: new FormControl("", Validators.required),
      sectionrole: new FormControl("", Validators.required),
    });
  }

  ngOnInit() {
    this.iteratePolicy = false;
    this.iterateMenu = false;
    this.getPolicyCategory();
    this.getPolicy();
    this.getMenu();
    this.getEditRole();
    this.getSectionName();
  }

  getSectionName() {
    this.userManagementService.getSectionName().subscribe((Res) => {
      this.sectionArray = Res;
    });
  }

  getPolicyCategory() {
    this.userManagementService.getPolicyCategory().subscribe((Response) => {
      this.policyCategory = Response;
    });
  }

  getPolicy() {
    this.userManagementService.getPolicy().subscribe((Response) => {
      this.policyArray = Response;
    });
  }

  getMenu() {
    this.userManagementService.getMenuList().subscribe((Res) => {
      this.menuArray = Res;
    });
  }
  getEditRole() {
    this.route.params.subscribe((params) => {
      this.roleId = params.id;
      if (this.roleId) {
        this.editMode = true;
        this.userManagementService.getRoleEdit(this.roleId).subscribe((Res) => {
          this.roleEditArray = Res;
          this.userManagementService.getSectionName().subscribe((Response) => {
            this.sectionArray = Response;
            if (this.roleEditArray.sectionRole) {
              for (const section of this.sectionArray) {
                if (
                  this.roleEditArray.sectionRole.sectionId ===
                  section.klaSectionId
                ) {
                  this.sectionSelected = section;
                  this.roleForm.patchValue({
                    sectionname: this.sectionSelected,
                    sectionrole: this.roleEditArray.sectionRole.id,
                  });
                }
              }
            }
          });
          this.roleForm.patchValue({
            name: this.roleEditArray.name,
            description: this.roleEditArray.description,
          });
          this.iteratePolicy = true;
          if (this.roleEditArray.categoryList.length !== 0) {
            this.rolePolicyArray = {
              categoryList: this.roleEditArray.categoryList,
              categories: this.roleEditArray.categories,
              policies: this.roleEditArray.policys,
            };
          }
          this.iterateMenu = true;
          if (this.roleEditArray.menus.length !== 0) {
            // this.roleMenuArray = this._rebuildMenus(this.roleEditArray.menus);
            this.roleMenuArray = this.roleEditArray.menus;
            this.menuIds = this.roleEditArray.menuIds;
            // for (const menu of this.roleMenuArray) {
            //   this.menuIds.push(menu.id);
            // }
          }
        });
      }
    });
  }
  _rebuildMenus(menus) {
    let tempPath = '';
    // tslint:disable-next-line: prefer-for-of
    for (var i = 0; i < menus.length; i++) {
      if (menus[i].children.length > 0) {
        if (
          menus[i].children.findIndex(
            (element) => element.type === "BUTTON"
          ) !== -1
        ) {
          this.rbsmenuObj.menus = menus[i].children;
        }
        this.rbsmenuObj.path += menus[i].name + "/";
        this._rebuildMenus(menus[i].children);
      } else {
        this.rbsmenuObj.menus.length === 0
          ? this.rbsmenuObj.menus.push(menus[i])
          : "";
        this.rbsmenuObj.path = tempPath = this.rbsmenuObj.path
          ? this.rbsmenuObj.path
          : menus[i].name;
        if (
          this.rbsmenuObj.path.charAt(this.rbsmenuObj.path.length - 1) === "/"
        ) {
          this.rbsmenuObj.path = this.rbsmenuObj.path.slice(0, -1);
        }
        this.rbsmenuArr.push(this.rbsmenuObj);
        this.rbsmenuObj = { path: "", menus: [] };
        if (tempPath.indexOf("/") !== -1) {
          break;
        }
      }
    }
    return this.rbsmenuArr;
  }
  onSelectedSection(event) {
    this.selectedSection = event;
    if (this.selectedSection && this.selectedSection.klaSectionId) {
      this.userManagementService
        .getSectionRole(this.selectedSection.klaSectionId)
        .subscribe((Res) => {
          this.sectionRoles = Res;
        });
    }
  }

  // TogglePanel(id) {
  //   this.id = id;
  //   this.check = !this.check;
  // }

  // showModal(): void {
  // tslint:disable-next-line: prefer-for-of
  // for (let i = 0; i < this.list.length; i++) {
  //   this.temporaryMenuList.push(this.list[i].id);
  //   if (this.list[i].children) {
  //     // tslint:disable-next-line: prefer-for-of
  //     for (let j = 0; j < this.list[i].children.length; j++) {
  //       if (this.list[i].children[j]) {
  //         this.temporaryMenuList.push(this.list[i].children[j].id);
  //       }
  //     }
  //   }
  // }
  // this.menuList = this.temporaryMenuList;
  // this.temporaryMenuList = [];
  // console.log('menuList new', this.menuList);
  // }

  handleCancel(): void {
    this.policyVisible = false;
    this.menuVisible = false;
  }

  showMenu(): void {
    this.menuVisible = true;
  }

  showPolicies(): void {
    this.policyVisible = true;
  }

  onSelectedCategory(event) {
    this.selectedCategory = event;
    this.addCat = true;
    if (this.addCat && this.addPol) {
      this.addPolbtn = true;
    }
  }

  onSelectedMenu(event) {
    this.selectedMenu = event;
    this.addMenuBtn = true;
  }

  onPolicySelection(event) {
    this.selectedPolicy = event;
    this.userManagementService
      .getPolicyPermissions(this.selectedPolicy.id)
      .subscribe((Res) => {
        this.policyPermissionArray = Res;
      });
    this.addPol = true;
    if (this.addCat && this.addPol) {
      this.addPolbtn = true;
    }
  }

  addPolicy() {
    this.iteratePolicy = true;
    this.policyVisible = false;
    this.addCat = false;
    this.addPol = false;
    this.addPolbtn = false;
    if (this.rolePolicyArray.categoryList.length > 0) {
      if (
        this.rolePolicyArray.categoryList.includes(this.selectedCategory.id)
      ) {
        this.rolePolicyArray.categories[
          this.selectedCategory.id
        ].catCheck = false;
        const category = this.rolePolicyArray.categories[
          this.selectedCategory.id
        ];
        const pIds: any = [];
        for (const policyList of category.policyList) {
          pIds.push(policyList.id);
        }
        if (!pIds.includes(this.selectedPolicy.id)) {
          category.policyList.push({
            id: this.selectedPolicy.id,
            deleteFlag: this.selectedPolicy.deleteFlag,
          });
          const policy = new Policies();
          policy.id = this.selectedPolicy.id;
          policy.name = this.selectedPolicy.name;
          policy.permissions.push(this.policyPermissionArray);
          this.rolePolicyArray.policies[this.selectedPolicy.id] = policy;
        } else {
          category.policyList[
            pIds.indexOf(this.selectedPolicy.id)
          ].deleteFlag = false;
        }
      } else {
        const category = new Categories();
        category.id = this.selectedCategory.id;
        category.name = this.selectedCategory.name;
        category.moduleName = this.selectedCategory.module.name;
        category.policyList.push({
          id: this.selectedPolicy.id,
          deleteFlag: false,
        });

        const policy = new Policies();
        policy.id = this.selectedPolicy.id;
        policy.name = this.selectedPolicy.name;
        policy.permissions.push(this.policyPermissionArray);

        this.rolePolicyArray.categoryList.push(this.selectedCategory.id);
        this.rolePolicyArray.categories[this.selectedCategory.id] = category;
        this.rolePolicyArray.policies[this.selectedPolicy.id] = policy;
      }
    } else {
      const category = new Categories();
      category.id = this.selectedCategory.id;
      category.name = this.selectedCategory.name;
      category.moduleName = this.selectedCategory.module.name;
      category.policyList.push({
        id: this.selectedPolicy.id,
        deleteFlag: false,
      });

      const policy = new Policies();
      policy.id = this.selectedPolicy.id;
      policy.name = this.selectedPolicy.name;
      policy.permissions.push(this.policyPermissionArray);
      this.rolePolicyArray.categoryList.push(this.selectedCategory.id);
      this.rolePolicyArray.categories[this.selectedCategory.id] = category;
      this.rolePolicyArray.policies[this.selectedPolicy.id] = policy;
    }
    this.categoryselected = null;
    this.policyselected = null;
  }

  addMenu() {
    this.iterateMenu = true;
    this.menuVisible = false;
    this.addMenuBtn = false;
    const menuArray = {
      id: null,
      children: [],
      name: null,
      menuUri: null,
      isButton: null,
      // deleteFlag: null,
      nameHi: null,
      nameKn: null,
      nameMl: null,
      nameTa: null,
      nature: null,
      parentId: null,
      type: null,
    };
    if (this.selectedMenu) {
      if (this.menuIds.includes(this.selectedMenu.id)) {
        menuArray.id = this.selectedMenu.id;
        menuArray.name = this.selectedMenu.name;
        menuArray.menuUri = this.selectedMenu.menuUri;
        menuArray.nameHi = this.selectedMenu.nameHi;
        menuArray.nameKn = this.selectedMenu.nameKn;
        menuArray.nameMl = this.selectedMenu.nameMl;
        menuArray.nameTa = this.selectedMenu.nameTa;
        menuArray.nature = this.selectedMenu.nature;
        if (this.selectedMenu.parent) {
          menuArray.parentId = this.selectedMenu.parent.id;
        }
        menuArray.type = this.selectedMenu.type;
        // if (
        //   this.roleMenuArray[this.menuIds.lastIndexOf(this.selectedMenu.id)]
        //     .deleteFlag === true
        // ) {
        //   menuArray.deleteFlag = false;
        // } else {
        //   menuArray.deleteFlag = true;
        // }
        this.menuIds.push(this.selectedMenu.id);
        this.roleMenuArray.push(menuArray);
      } else {
        menuArray.id = this.selectedMenu.id;
        menuArray.name = this.selectedMenu.name;
        menuArray.menuUri = this.selectedMenu.menuUri;
        menuArray.nameHi = this.selectedMenu.nameHi;
        menuArray.nameKn = this.selectedMenu.nameKn;
        menuArray.nameMl = this.selectedMenu.nameMl;
        menuArray.nameTa = this.selectedMenu.nameTa;
        if (this.selectedMenu.parent) {
          menuArray.parentId = this.selectedMenu.parent.id;
        }
        menuArray.nature = this.selectedMenu.nature;
        menuArray.type = this.selectedMenu.type;
        // menuArray.deleteFlag = false;
        this.menuIds.push(this.selectedMenu.id);
        if (this.deletedMenuIds.includes(this.selectedMenu.id)) {
          this.deletedMenuIds.splice(this.deletedMenuIds.indexOf(this.selectedMenu.id),1);
        }
        this.roleMenuArray.push(menuArray);
      }
    }
    this.rerenderMenus();
    this.selectedMenu = null;
    this.menuSelected = null;
  }

  categoryCheck() {
    for (const category of this.rolePolicyArray.categoryList) {
      const policyFlags: any = [];
      for (const policyList of this.rolePolicyArray.categories[category]
        .policyList) {
        policyFlags.push(policyList.deleteFlag);
      }
      if (policyFlags.includes(false)) {
        this.rolePolicyArray.categories[category].catCheck = false;
      } else {
        this.rolePolicyArray.categories[category].catCheck = true;
      }
    }
  }

  saveRole(value: any) {
    for (const key in this.roleForm.controls) {
      if (key) {
        this.roleForm.controls[key].markAsDirty();
        this.roleForm.controls[key].updateValueAndValidity();
      }
    }
    let policyList: any = [];
    const body = new RolePolicy();
    body.name = this.roleForm.value.name;
    body.description = this.roleForm.value.description;
    body.sectionRoleId = this.roleForm.value.sectionrole;
    if (this.roleId) {
      body.roleId = this.roleId;
    } else {
      body.roleId = null;
    }
    for (const categoryId of this.rolePolicyArray.categoryList) {
      for (const policy of this.rolePolicyArray.categories[categoryId]
        .policyList) {
        policyList.push({
          id: policy.id,
          deleteFlag: policy.deleteFlag,
        });
      }
      body.rolePolicys[categoryId] = policyList;
      policyList = [];
    }
    // for (const menu of this.roleMenuArray) {
    //   if (menu.menus) {
    //     for (const m of menu.menus) {
    //       body.menuIds.push({
    //         id: m.id,
    //         deleteFlag: m.deleteFlag ? m.deleteFlag : false,
    //       });
    //     }
    //   }
    // }
    const totalMenuIds = this.menuIds.concat(this.deletedMenuIds);
    for ( const menuId of totalMenuIds) {
      body.menuIds.push({
        id: menuId,
        deleteFlag: this.deletedMenuIds.includes(menuId) ? true : false,
      });
    }
    if (this.roleForm.valid) {
      this.userManagementService.addRole(body).subscribe((Res) => {
        this.roleForm.reset();
        this.rolePolicyArray = {
          categoryList: [],
          categories: {},
          policies: {},
        };
        this.roleMenuArray = [];
        if (!this.editMode) {
          this.notify.showSuccess("Success", "Role Created Successfully");
        } else {
          this.notify.showSuccess("Success", "Role Updated Successfully");
        }
        setTimeout(() => {
          this.router.navigate([
            "business-dashboard/user-management/list-roles",
          ]);
        }, 1500);
      });
    } else {
      this.notify.showError("Error", "Fill in the required fields!");
    }
  }

  clearRole() {
    if (!this.editMode) {
      this.roleForm.reset();
      this.menuSelected = null;
      this.categoryselected = null;
      this.policyselected = null;
      this.rolePolicyArray = {
        categoryList: [],
        categories: {},
        policies: {},
      };
      this.roleMenuArray = [];
    } else {
      this.router.navigate(["business-dashboard/user-management/list-roles"]);
    }
  }
  rerenderMenus() {
    this.userManagementService
      .getlatestMenuList(this.menuIds)
      .subscribe((res) => {
        this.rbsmenuArr = [];
        this.roleMenuArray = (res['menus']);
      });
  }
  deleteMenu(deleteMenu) {
    if (deleteMenu) {
      if (this.menuIds.includes(deleteMenu.id)) {
        this.menuIds.splice(this.menuIds.indexOf(deleteMenu.id), 1);
        this.deletedMenuIds.push(deleteMenu.id);
        this.rerenderMenus();
      }
    }
  }
}
