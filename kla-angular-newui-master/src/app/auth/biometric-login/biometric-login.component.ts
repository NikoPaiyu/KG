import { Component, OnInit } from "@angular/core";
import { AuthService } from "../shared/services/auth.service";
import { NotificationCustomService } from "src/app/shared/services/notification.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-biometric-login",
  templateUrl: "./biometric-login.component.html",
  styleUrls: ["./biometric-login.component.scss"]
})
export class BiometricLoginComponent implements OnInit {
  fingerprintImageSource = null;
  idleFingerprintImageUrl = "/assets/img/noun_Fingerprint-3.svg";
  successFingerprintImageUrl = "/assets/img/noun_Fingerprint-1.svg";
  errorFingerprintImageUrl = "/assets/img/noun_Fingerprint-2.svg";
  processing = false;

  constructor(
    private service: AuthService,
    public notify: NotificationCustomService,
    private router: Router
  ) {}

  ngOnInit() {
    this.fingerprintImageSource = this.idleFingerprintImageUrl;
    this.resetFailedLoginCount();
  }
  BiometricLogin() {
    // tslint:disable-next-line: no-debugger
    // tslint:disable-next-line: deprecation
    if (!this.processing) {
      this.processing = true;
      this.fingerprintImageSource = this.idleFingerprintImageUrl;
      // tslint:disable-next-line: deprecation
      // tslint:disable-next-line: no-shadowed-variable
      this.service.biometricLogin().subscribe(Response => {
        if (Response) {
          this.processing = false;
          if (Response.status || Response.status === 400) {
            this.fingerprintImageSource = this.errorFingerprintImageUrl;
            this.notify.showError("Error", Response.message);
            this.incrementFailedLoginCount();
          }
          if (Response.bearerToken) {
            if (!Response.isDeviceOff) {
              this.service.stopDevice();
            }
            this.fingerprintImageSource = this.successFingerprintImageUrl;
            this.resetFailedLoginCount();
            this.service.processResponse(Response);
            if (Response.attendanceMarked === true) {
              sessionStorage.setItem('attendance', 'true');
            } else {
              sessionStorage.removeItem('attendance');
            }
            // this.service.getMenus().subscribe(
            //   (res: any) => {
            //     this.service.setMenus(res);
            //   },
            this.service.getRbsRoleMenu().subscribe(
              (res: any) => {
                //const rbsMenus = Response;
                const rbsMenus = res;
                //this.service.setRbsRoleMenu(rbsMenus.menus);//changes done to fix menu issue.
                this.service.setDashBoardType(Response.dashBoard);  
                this.service.setRbsRoleMenu(rbsMenus);
                this.service.setRbsPermission(res.modules);                            
              },
              error => {
                this.fingerprintImageSource = this.errorFingerprintImageUrl;
                this.incrementFailedLoginCount();
              }
            );
          }
        }
      });
      this.processing = false;
    }
  }
  getFailedLoginCount() {
    return Number(sessionStorage.getItem("failedLogin"));
  }
  resetFailedLoginCount() {
    sessionStorage.removeItem("failedLogin");
  }
  incrementFailedLoginCount() {
    let count = this.getFailedLoginCount();
    if (!count) {
      count = 0;
    }
    count++;
    sessionStorage.setItem("failedLogin", count.toString());
    if (count > 2) {
      this.notify.showError('Error', 'Redirecting to Login Page');
      this.router.navigate(["/auth/login"]);
    }
  }
}
