import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserDetails, AttentenceDetails } from '../models/userDetails';
import { environment } from 'src/environments/environment';
import { Entity } from '../../../../shared/models/entity';
import { map } from 'rxjs/operators';
@Injectable()
export class UserManagementService {
  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http
      //.get(`${environment.user_mgmnt_api_url}/kla/service/v1/users/get`)
      .get(`${environment.user_mgmnt_api_url}/v1/users/get`)
      .map(users => this.mapUsersData(users));
  }
  getAllUsersByUserType(userType) {
    return this.http
      .get(
        // `${environment.user_mgmnt_api_url}/kla/service/v1/users/getBasedOnUserType/${userType}`
        `${environment.user_mgmnt_api_url}/v1/users/getBasedOnUserType/${userType}`
      )
      .map(users => this.mapUsersData(users));
  }
  getUserByUserName(userName: string) {
    return this.http
      //.get(`${environment.user_mgmnt_api_url}/kla/service/v1/users/get/userName/${userName}`)
      .get(`${environment.user_mgmnt_api_url}/v1/users/get/userName/${userName}`)
      .map((user: any) => this.mapUserData(user.data));
  }
  mapUsersData(users) {
    return users.data.map(user => {
      return this.mapUserData(user);
    });
  }

  mapUserData(user) {
    const userelement = new UserDetails();
    userelement.id = user.userId;
    userelement.userName = user.userName;
    userelement.password = user.password;
    userelement.email = user.details.email;
    userelement.firstName = user.details.firstName;
    userelement.lastName = user.details.lastName;
    userelement.fullName = user.details.fullName;
    userelement.fullNameMalayalam = user.details.malayalamFullName;
    userelement.mobileNumber = user.details.mobileNumber;
    userelement.constituencyId = user.details.keralaConstituencyId;
    userelement.constituencyName = user.details.keralaConstituencyName;
    userelement.partyId = user.details.keralaPolicticalPartyid;
    userelement.klaDepartmentId = user.details.klaSectionId;
    userelement.klaRoleId = user.details.klaDesignatoinId;
    userelement.profilePhoto = user.details.profilePhoto;
    user.roles.forEach(element => {
      userelement.role.push(element.roleId);
      userelement.roleDisplay.push(element.roleName);
    });
    userelement.userType = user.userType;
    userelement.memberType = user.details.memberType;
    userelement.memberGroup = user.details.memberGroup;
    userelement.memberDesignationId = user.details.memberDesignationId;
    userelement.keralaPartyFrontId = user.details.keralaPartyFrontId;
    userelement.rbsRole = user.rbsRole;
    userelement.portfolioId = user.details.portfolioId;
    userelement.departmentId = user.details.departmentId;
    return userelement;
  }
  addUser(user: UserDetails) {
    const klaUser = {
      klaUser: {
        userName: user.userName,
        password: user.cpassword,
        userType: user.userType,
        details: {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: user.fullName,
          malayalamFullName: user.fullNameMalayalam,
          mobileNumber: user.mobileNumber,
          keralaConstituencyId: user.constituencyId,
          keralaConstituencyName: user.constituencyName,
          keralaPolicticalPartyid: user.partyId,
          klaDesignatoinId: user.klaRoleId,
          klaSectionId: user.klaDepartmentId,
          profilePhoto: user.profilePhoto,
          memberType: user.memberType,
          memberGroup: user.memberGroup,
          memberDesignationId: user.memberDesignationId,
          keralaPartyFrontId: user.keralaPartyFrontId,
          portfolioId: user.portfolioId,
          departmentId: user.departmentId
        }
      },
      role: user.role,
      rbsRole: user.rbsRole,
    };
    return this.http.post(
      //`${environment.user_mgmnt_api_url}/kla/service/v1/users/create`,
      `${environment.user_mgmnt_api_url}/v1/users/create`,
      klaUser
    );
  }

  updateUser(user: UserDetails) {
    const roles = [];
    user.role.forEach(element => {
      const role = {
        roleId: element
      };
      roles.push(role);
    });
    const userData = {
      userId: user.id,
      userName: user.userName,
      password: user.cpassword,
      userType: user.userType,
      details: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        malayalamFullName: user.fullNameMalayalam,
        mobileNumber: user.mobileNumber,
        keralaConstituencyId: user.constituencyId,
        keralaConstituencyName: user.constituencyName,
        keralaPolicticalPartyid: user.partyId,
        klaDesignatoinId: user.klaRoleId,
        klaSectionId: user.klaDepartmentId,
        profilePhoto: user.profilePhoto,
        memberType: user.memberType,
        memberGroup: user.memberGroup,
        memberDesignationId: user.memberDesignationId,
        keralaPartyFrontId: user.keralaPartyFrontId,
        portfolioId: user.portfolioId,
        departmentId: user.departmentId
      },
      roles,
      rbsRole: user.rbsRole
    };
    return this.http.put(
      //`${environment.user_mgmnt_api_url}/kla/service/v1/users/update`,
      `${environment.user_mgmnt_api_url}/v1/users/update`,
      userData
    );
  }

  deleteUser(user: UserDetails) {
    return this.http.delete(
      `${environment.user_mgmnt_api_url}/v1/users/delete/${user.userName}`
    );
  }

  upDatePassword(userName: string, password: string) {
    const data = {
      userName,
      newPassword: password
    };
    return this.http.put(
      `${environment.user_mgmnt_api_url}/v1/users/upadate/pass`,
      data
    );
  }

  getConstituencies() {
    return this.http
      .get(`${environment.departmentmangement_api_url}/getconstituency`)
      .map((res: any) => {
        const comboDatas: Entity[] = [];

        res.forEach(constituency => {
          comboDatas.push({
            value: constituency.kerelaContituencyId,
            label: constituency.kerelaContituencyName
          });
        });

        return comboDatas;
      });
  }
  getRoles() {
    return this.http
      .get(`${environment.user_mgmnt_api_url}/v1/users/role/getAll`)
      .map((res: any) => {
        const comboDatas: Entity[] = [];

        res.forEach(role => {
          comboDatas.push({
            value: role.roleId,
            label: role.roleName
          });
        });

        return comboDatas;
      });
  }

  getRolesByUserType(userType: string) {
    // return this.getRoles();
    return this.http
      .get(
        `${environment.user_mgmnt_api_url}/v1/users/role/getSpecificRoles/${userType}`
      )
      .map((res: any) => {
        const comboDatas: Entity[] = [];

        res.forEach(role => {
          comboDatas.push({
            value: role.roleId,
            label: role.roleName
          });
        });

        return comboDatas;
      });
  }

  getParties() {
    return this.http
      .get(`${environment.departmentmangement_api_url}/getparty`)
      .map((res: any) => {
        const comboDatas: Entity[] = [];

        res.forEach(party => {
          comboDatas.push({
            value: party.kerelaPoliticalPartyId,
            label: party.kerelaPoliticalPartyName
          });
        });

        return comboDatas;
      });
  }

  getKlaDepartments() {
    return this.http
      .get(`${environment.departmentmangement_api_url}/getsection`)
      .map((res: any) => {
        const comboDatas: Entity[] = [];

        res.forEach(department => {
          comboDatas.push({
            value: department.klaSectionId,
            label: department.klaSectionName
          });
        });

        return comboDatas;
      });
  }

  getMemberDesignations() {
    return this.http
      .get(
        `${environment.departmentmangement_api_url}/getMemberDesignationList`
      )
      .map((res: any) => {
        const comboDatas: Entity[] = [];

        res.forEach(department => {
          comboDatas.push({
            value: department.memberDesignationId,
            label: department.designationName
          });
        });

        return comboDatas;
      });
  }

  getKeralaPartyFrontIds() {
    return this.http
      .get(
        `${environment.departmentmangement_api_url}/partyFront/getAll`
      )
      .map((res: any) => {
        const comboDatas: Entity[] = [];

        res.forEach(partyFront => {
          comboDatas.push({
            value: partyFront.id,
            label: partyFront.frontName
          });
        });

        return comboDatas;
      });
  }

  getKlaDesignations() {
    return this.http
      .get(`${environment.departmentmangement_api_url}/getdesignation`)
      .map((res: any) => {
        const comboDatas: Entity[] = [];

        res.forEach(designation => {
          comboDatas.push({
            value: designation.klaDesignationId,
            label: designation.klaDesignationName
          });
        });

        return comboDatas;
      });
  }

  getAllMembers() {
    return this.http
      .get(`${environment.user_mgmnt_api_url}/v1/users/member/getAll`)
      .map((res: any) => {
        const comboDatas: Entity[] = [];

        res.forEach(member => {
          comboDatas.push({
            value: member.userId,
            label: member.details.fullName
          });
        });

        return comboDatas;
      });
  }
  // get all members with fingerprint details
  getAllMembersWithBiometrics() {
    return this.http
      .get<any>(`${environment.user_mgmnt_api_url}/v1/users/member/getAll`);
  }
  getCurrentAttendance() {
    return this.http
      .get<AttentenceDetails>(
        `${environment.user_mgmnt_api_url}/v1/users/getCurrentAttendance`
      )
      .pipe(
        map(res => {
          return res;
        })
      );
  }
  registerUser(userId, fingerName) {
    const url = environment.fingerprintauth + 'registerUser';
    const body = {
      userId,
      fingerName
    };
    return this.http.post<any>(url, body);
  }
  startDevice() {
    const url = environment.fingerprintauth + 'startDevice';
    return this.http.get<any>(url);
  }
  stopDevice() {
    const url = environment.fingerprintauth + 'stopDevice';
    return this.http.get<any>(url);
  }
  deleteBiometricByUserId(userId) {
    const url = environment.user_mgmnt_api_url + `/v1/users/bio?userId=${userId}`;
    return this.http.delete(url);
  }

  getPolicyCategory() {
    return this.http.get(`${environment.user_mgmnt_api_url}/rbs/policycategory/getAll`);
  }

  getPolicy() {
    return this.http.get(`${environment.user_mgmnt_api_url}/rbs/policy/getAll`);
  }

  getPolicyPermissions(policyId: any) {
    return this.http.get(`${environment.user_mgmnt_api_url}/rbs/policypermission/getAllByPolicyId?policyId=${policyId}`)
  }
  // getMenuList() {
  //   return this.http.get(`${environment.user_mgmnt_api_url}/v1/users/menu/getAll`);
  // }
  getMenuList() {
    return this.http.get(`${environment.user_mgmnt_api_url}/v1/users/menu/getAllButton`);
  }
  getlatestMenuList(menuIds) {
    return this.http.post(`${environment.user_mgmnt_api_url}/rbs/getMenusList`, menuIds);
  }

  addRole(role: any) {
    return this.http.post(`${environment.user_mgmnt_api_url}/rbs/role/createRole`, role);
  }

  getRbsRole() {
    return this.http.get(`${environment.user_mgmnt_api_url}/rbs/role/getAll`);
  }

  getRoleEdit(roleId) {
    return this.http.get(`${environment.user_mgmnt_api_url}/rbs/getByRoleId?roleId=${roleId}`);
  }

  getSectionName() {
    return this.http.get(`${environment.departmentmangement_api_url}/getsection`);
  }

  getSectionRole(sectionId) {
    return this.http.get(`${environment.user_mgmnt_api_url}/rbs/sectionRole/getAllBySectionId?sectionId=${sectionId}`);
  }

  getAllMemberWitGroupFilter(userId) {
    return this.http
      .get(`${environment.user_mgmnt_api_url}/v1/users/member/getMemberGroupForUser?userId=${userId}`)
      .map((res: any) => {
        const comboDatas: Entity[] = [];

        res.forEach(member => {
          comboDatas.push({
            value: member.userId,
            label: member.details.fullName
          });
        });

        return comboDatas;
      });
  }
  
  getAllPortfolios() {
    return this.http.get(`${environment.portfolio_mock_api_url}mock/portfolio/getAllWithMinisterName`);
  }

  getMinisterDepartments(portfolioId) {
    return this.http.get(
     `${environment.portfolio_mock_api_url}mock/portfolio/getSubjects/${portfolioId}`
    );
  }

  getPortfolioDepartments(portfolioId) {
    return this.http.get(
     `${environment.portfolio_mock_api_url}mock/subject/getDepartmentsByPortfolioId?portfolioId=${portfolioId}`
    );
  }
}
