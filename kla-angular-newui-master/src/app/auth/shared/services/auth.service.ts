import { Inject, Injectable, TemplateRef } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Subject, Observable } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";
import { User, UserData } from "../models";
import { environment } from "src/environments/environment";
import * as JWT from "jwt-decode";
import { NotificationCustomService } from "src/app/shared/services/notification.service";
import { NzModalService, id_ID, NzNotificationService } from "ng-zorro-antd";
import { TranslateService } from "@ngx-translate/core";

@Injectable()
export class AuthService {
  jsonUrl = "assets/config/config.json"
  environment: any;
  public currentUserSubject = new BehaviorSubject<UserData>(new UserData());
  public currentUser = this.currentUserSubject
    .asObservable()
    .pipe(distinctUntilChanged());
  isLoggedIn = false;
  getSessionData() {
    if (this.getToken()) {
      sessionStorage.setItem("authToken", this.getToken());
      if (this.getToken()) this.isLoggedIn = true;
      this.httpService
        .post(`${environment.auth_api_url}/validateToken/${this.getToken()}`, {
          withCredentials: true
        })
        .map(res => res)
        .subscribe(
          data => {
            this.existsUserResponse(data);
          },
          error => {
            this.router.navigate(["/auth"]);
          }
        );
    } else {
      this.router.navigate(["/auth"]);
    }
  }

  constructor(
    @Inject("environment") environment,
    public router: Router,
    public httpService: HttpClient,
    private http: HttpClient,
    public notify: NotificationCustomService,
    public modalService: NzModalService,
    public notificationService: NzNotificationService,
    private translate: TranslateService
  ) {
    this.isLoggedIn = false;
    this.environment = environment;
  }

  getToken() {
    return sessionStorage.getItem('authToken');
  }
  startdevice() {
    const url = environment.fingerprintauth + 'startDevice';
    return this.httpService.get<any>(url);
  }
  stopDevice() {
    const url = environment.fingerprintauth + 'stopDevice';
    return this.httpService.get<any>(url);
  }
  biometricLogin() {
    const url = environment.fingerprintauth + 'loginUser';
    return this.httpService.get<any>(url);
  }

  getHeadersWithToken() {
    let headers = new Headers({
      "Content-Type": "application/json",
      token: this.getToken()
    });

    return headers;
  }

  getSpeakerIp() {
    return this.httpService.get(`${environment.get_system_ip}`); 
  }

  authenticate(user: User, msg: TemplateRef<{}>, speakerIp: String): any {
    let userFormData = {
      userName: user.username,
      password: user.password,
      speakerIpAddress: speakerIp
    };
    return this.httpService
      .post(`${environment.login_api_url}/login`, userFormData, {
        withCredentials: false
      })
      .pipe(
        map(res => {
          return this.processResponse(res);
        })
      )
      .subscribe(
        data => {
          // this.getMenus().subscribe(
          //   (res: any) => {
          //     this.setMenus(res);
          //     this.onResetCurrentUserPwd(msg);
          //   },
          //   error => {
          //     this.router.navigate(["/auth"]);
          //   }
          // );
          this.getRbsRoleMenu().subscribe(
            (res: any) => {
              const rbsMenus = res;
              this.setDashBoardType(data.dashBoard);
              this.setRbsRoleMenu(rbsMenus);
              this.setRbsPermission(res.modules);
              this.onResetCurrentUserPwd(msg);
            },
            error => {
              this.router.navigate(['/auth']);
            }
          );
          this.getCorrespondenceCode().subscribe(
            (res: any) => {
              const code = res;
              this.setCorrespondenceCode(code);
            }
          );
        },
        error => {
          this.notify.showError(
            "Error",
            "Something went wrong.Please try after sometime."
          );
        }
      );

    //     this.getMenus().subscribe(
    //       (res: any) => {
    //         this.setMenus(res);
    //         this.onResetCurrentUserPwd(msg);
    //       },
    //       error => {
    //         this.router.navigate(["/auth"]);
    //       }
    //     );
    //   },
    //   error => {
    //     this.notify.showError(
    //       "Error",
    //       "Something went wrong.Please try after sometime."
    //     );
    //   }
    // );
  }
  logout() {
    this.httpService
      .get(`${environment.login_api_url}/logout`)
      .subscribe();
    sessionStorage.removeItem("authToken");
    this.router.navigate(["/auth"]);
  }


  setUserData(accessToken) {
    const decodedToken = JWT(accessToken);
    const usr = new UserData();
    usr.token = accessToken;
    usr.userName = decodedToken.user_name;
    usr.firstName = decodedToken.firstName;
    usr.lastName = decodedToken.lastName;
    usr.fullName = decodedToken.fullName;
    usr.photoUrl = decodedToken.profileUrl;
    usr.userId = decodedToken.userId;
    usr.passwordChanged = decodedToken.passwordChanged;
    usr.malayalamFullName = decodedToken.malayalamFullName;
    usr.userType = decodedToken.userType;
    decodedToken.authorities.forEach(role => {
      usr.authorities.push(role.roleName);
      usr.roleIds.push(role.roleId)
    });
    return usr;
  }
  existsUserResponse(json) {
    let res = json;
    if (res) {
      sessionStorage.setItem("authToken", this.getToken());
      this.setAuth(this.setUserData(this.getToken()));
      // this.getMenus().subscribe(
      //   (res: any) => {
      //     this.setMenus(res);
      //   },
      //   error => {
      //     this.router.navigate(["/auth"]);
      //   }
      // );
      this.getCorrespondenceCode().subscribe(
        (res: any) => {
          const code = res;
          this.setCorrespondenceCode(code);
        }
      );
      this.getRbsRoleMenu().subscribe(
        (Response: any) => {
          const rbsMenus = Response;
          this.setRbsRoleMenu(rbsMenus);
          this.setRbsPermission(Response.modules);
        },
        error => {
          this.router.navigate(['/auth']);
        }
      );
    }
    return res;


  }
  processResponse(response) {
    if (response) {
      sessionStorage.setItem('authToken', response.bearerToken);
      this.setAuth(this.setUserData(response.bearerToken));
      if (this.getToken()) {
        this.isLoggedIn = true;
      }
    }
    return response;
  }

  redirctBasedOnRole() {
    ///// redirect to dashboard page
    //const inHouse = localStorage.getItem('ls_inhouse');
    let currentUser = this.getCurrentUser();
    console.log('Test:', currentUser.userDashBoardType);
    if (
      (currentUser.authorities.includes("MLA") && currentUser.userDashBoardType === 'IN_HOUSE') ||
      (currentUser.authorities.includes("secretary") && currentUser.userDashBoardType === 'IN_HOUSE') ||
      (currentUser.authorities.includes("privateSecretaryToSpeaker") && currentUser.userDashBoardType === 'IN_HOUSE') ||
      currentUser.authorities.includes("governor") ||      
      currentUser.authorities.includes("speakerNote") ||
      currentUser.authorities.includes("dcSupport") ||
      currentUser.authorities.includes("swearingIn")
    ) {
      this.translate.setDefaultLang("mal");
      this.router.navigate(["dashboard"]);
    } else if (currentUser.authorities.includes("MLA") && currentUser.userDashBoardType === 'MEMBER_PORTAL'){
      this.translate.setDefaultLang("mal");
      if(this.getCurrentUser().validated == false){
        this.router.navigate(["business-dashboard/tables/assembly-election/elected-member"]);
      }else{
        this.router.navigate(["business-dashboard"]);
      }
    } else if (currentUser.userDashBoardType === 'KLA_USER_DASHBOARD') {
      this.translate.setDefaultLang("en");
      this.router.navigate(["business-dashboard/main"]);
    }
  }
  setAuth(user: UserData) {
    // Set current user data into observable
    this.currentUserSubject.next(user);
  }
  getCurrentUser(): UserData {
    return this.currentUserSubject.value;
  }


  sendOTP(email: String, userName: String): any {
    let body = {
      email: email,
      userName: userName
    };
    return this.httpService
      .put(
        `${environment.user_mgmnt_api_url}/v1/users/forgetpassword/sendemail`,
        body
      )
      .map(res => res);
  }

  resetPassword(otp: string, username: string, newPassword: string): any {
    let resetDetails = {
      otp: otp,
      userName: username,
      newPassword: newPassword
    };
    return this.httpService
      .put(
        `${environment.user_mgmnt_api_url}/v1/users/forgetpassword/updatepass`,
        JSON.stringify(resetDetails),
        {
          withCredentials: false
        }
      )
      .map(res => res);
  }

  // getMenus() {
  //   return this.httpService
  //     .get(`${environment.user_menu_url}/getMenu`, {
  //       withCredentials: true
  //     })
  //     .pipe(map(res => res));
  // }

  // setMenus(menus) {
  //   let userData = this.getCurrentUser();
  //   userData.menu = menus ? menus : [];
  //   this.setAuth(userData);
  //   this.redirctBasedOnRole();
  // }

  onResetCurrentUserPwd(msg) {
    // &&
    // (this.getCurrentUser().authorities.includes("MLA") ||
    //   this.getCurrentUser().authorities.includes("governor") ||
    //   this.getCurrentUser().authorities.includes("secretary") ||
    //   this.getCurrentUser().authorities.includes("privateSecretaryToSpeaker"))
    if (
      !this.getCurrentUser().passwordChanged
    ) {
      this.notificationService.remove();
      this.notificationService.template(msg, {
        nzDuration: 15000,
        nzPauseOnHover: true,
        nzAnimate: true
      });
    }
  }

  fingerAuthByUserId() {
    const userId = this.getCurrentUser().userId;
    const url = environment.fingerprintauth + 'authenticateUserById';
    const body = { userId };
    return this.httpService.post<any>(url, body);
  }

  getConfigFileDetails(): Observable<any> {
    return this.httpService.get(this.jsonUrl)
      .map((response: any) => { return response });
  }

  getCorrespondenceCode() {
    const userId = this.getCurrentUser().userId;
    return this.httpService.get(`${environment.correspondence_api}/getCode?userId=${userId}`, {
      withCredentials: true
    })
      .pipe(map(res => res));
  }

  setCorrespondenceCode(code) {
    const userData = this.getCurrentUser();
    userData.correspondenceCode = code ? code : [];
    this.setAuth(userData);
  }

  setRbsPermission(permissions) {
    const userData = this.getCurrentUser();
    userData.rbsPermissions = permissions ? permissions : [];
    this.setAuth(userData);
  }

  setDashBoardType(dashBoardType) {
    const userData = this.getCurrentUser();
    userData.userDashBoardType = dashBoardType;
    this.setAuth(userData);
  }

  getRbsRoleMenu() {
    const userId = this.getCurrentUser().userId;
    return this.httpService.get(`${environment.user_mgmnt_api_url}/rbs/getUserRoleDetails?userId=${userId}`, {
      withCredentials: true
    })
      .pipe(map(res => res));
  }

  setRbsRoleMenu(rbsMenus) {
    const userData = this.getCurrentUser();
    userData.rbsRoleMenu = rbsMenus.insideSabhaMenus ? rbsMenus.insideSabhaMenus : [];
    userData.rbsRole = rbsMenus.userRole ? rbsMenus.userRole : [];
    userData.menu = rbsMenus.menus ? rbsMenus.menus : [];
    userData.validated = rbsMenus.validated;
    this.setAuth(userData);
    this.redirctBasedOnRole();
  }
  setAssemblyandSession() {
    return this.http.get<any>(
      `${this.environment.calendar_api_url}/getCurrentAssemblySession`
    );
  }

  getLoginLocation(ip) {
    return this.http.post<any>(
      `${this.environment.login_api_url}/login/checkLocation`, ip
    );
  }
  reloadMenu(){
    this.getRbsRoleMenu().subscribe(
      (Response: any) => {
        const rbsMenus = Response;
        this.setRbsRoleMenu(rbsMenus);
        this.setRbsPermission(Response.modules);
      },
      error => {
        this.router.navigate(['/auth']);
      }
    );
  }
}
