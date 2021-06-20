import { Component, OnInit, Input } from "@angular/core";
import { NgForm } from "@angular/forms";
import { NzModalRef } from "ng-zorro-antd";
import { ResetPasswordService } from "../../services/reset-password.service";
import { NotificationCustomService } from "../../services/notification.service";
import { Router } from "@angular/router";
@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.scss"]
})
export class ResetPasswordComponent implements OnInit {
  userName = "";
  passwordModel = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  };
  public invalidPword = false;
  constructor(
    private modal: NzModalRef,
    private resetService: ResetPasswordService,
    private notify: NotificationCustomService,
    private router: Router
  ) {}

  ngOnInit() {}

  updatePassword(event: NgForm) {
    if (this.passwordModel.newPassword !== this.passwordModel.confirmPassword) {
      this.invalidPword = true;
    } else {
      this.invalidPword = false;
    }
    if (!this.invalidPword && event.form.status == "VALID") {
      this.resetService
        .upDatePassword(
          this.passwordModel.currentPassword,
          this.passwordModel.confirmPassword
        )
        .subscribe(response => {
          this.notify.showSuccess(
            "Password Updated",
            "Login using new password."
          );
          this.onCancelResetPword();
          this.router.navigate(["/auth"]);
        });
    }
  }

  onCancelResetPword() {
    this.modal.close();
  }
}
