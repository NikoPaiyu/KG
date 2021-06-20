import { Injectable } from "@angular/core";
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";
import { AuthService } from "./auth.service";
import { UserData } from "../models";
@Injectable()
export class AuthGuardService implements CanActivate {
  public currentUser: UserData;
  constructor(public router: Router, public authService: AuthService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    let url: string = state.url;
    if (this.checkLogin(url)) {
      this.currentUser = this.authService.setUserData(
        this.authService.getToken()
      );
      return this.checkRole(url, route);
    } else {
      return false;
    }
  }

  checkLogin(url: string): boolean {
    if (this.getToken()) {
      return true;
    }
    // Navigate to the login page with extras
    this.router.navigate(["/auth"]);
    return false;
  }

  checkRole(url: string, route: ActivatedRouteSnapshot): boolean {
    if (url.includes("/dashboard")) {
      let roles = route.data.expectedRole.split(",");
      if (roles.some(item => this.currentUser.authorities.includes(item))) {
        return true;
      } else {
        return false;
      }
    } else if (url.includes("/business-dashboard")) {
      let roles = route.data.unExpectedRole.split(",");
      if (roles.some(item => this.currentUser.authorities.includes(item))) {
        return false;
      } else {
        return true;
      }
    }
    return false;
  }

  getToken() {
    return sessionStorage.getItem("authToken");
  }
}
