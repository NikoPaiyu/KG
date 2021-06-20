import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { AuthService } from "src/app/auth/shared/services/auth.service";

@Injectable({
  providedIn: "root"
})
export class ResetPasswordService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  upDatePassword(currentPwd: string, password: string) {
    let data = {
      userName: this.authService.getCurrentUser().userName,
      currentPassword: currentPwd,
      newPassword: password
    };
    return this.http.put(
      `${environment.user_mgmnt_api_url}/v1/users/myprofile/update/pass`,
      data
    );
  }
}
