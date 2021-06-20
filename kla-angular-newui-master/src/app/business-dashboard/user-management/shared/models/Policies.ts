export class CategoryList {
 categoryList: any = [];
}

export class Categories {

         id: any;
         name: string;
         moduleName: string;
         policyList: any = [];
         catCheck: any = false;
}

export class Policies {

         id: any;
         name: string;
         permissions: any = [];
}

export class RolePolicy {
    name: string = null;
    description: string = null;
    sectionRoleId: any = null;
    roleId: any = null;
    rolePolicys: any = {};
    menuIds: any = [];
}
