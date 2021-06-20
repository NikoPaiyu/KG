import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { User } from "../shared/models/user";
import { AuthService } from "../shared/services/auth.service";
import { UserData } from "../shared/models";
import { NgForm } from "@angular/forms";
import { NotificationCustomService } from "src/app/shared/services/notification.service";
//import { TranslateService } from '@ngx-translate/core';
import { catchError } from 'rxjs/operators';
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  @ViewChild("msg", { static: false }) msg: TemplateRef<{}>;
  @ViewChild("loginForm", { static: false }) loginForm: NgForm;
  @ViewChild("otpForm", { static: false }) otpForm: NgForm;
  @ViewChild("passwordResetForm", { static: false }) passwordResetForm: NgForm;
  public isPasswordReset: boolean = false;
  public formErrors;
  public validationMessages;
  public user: User;
  public email: string = "";
  public userName: string = "";
  public otp: string = "";
  public newPassword: string = "";
  public confirmPassword: string = "";
  public userData: UserData;
  speakerIp: string = "";
  constructor(
    private authService: AuthService,
    private notify: NotificationCustomService
  ) {}

  ngOnInit() {
    this.user = new User();
    this.user.grant_type = "password";
    this.validations();
  }

  validations() {
    this.formErrors = {
      userName: "",
      password: "",
      email: "",
      otp: "",
      newPassword: "",
      confirmPassword: "",
      errors: []
    };

    this.validationMessages = {
      userName: {
        required: "Username is required.",
        pattern: "Please enter a valid username."
      },
      password: {
        required: "Password is required."
      },
      email: {
        required: "Email is required."
      },
      otp: {
        required: "OTP is required."
      },
      newPassword: {
        required: "New password is required."
      },
      confirmPassword: {
        required: "Confirm Password is required.",
        pattern: "Password does not match."
      }
    };
  }
  ngAfterViewChecked() {
    this.formChanged();
  }
  formChanged() {
    if (this.loginForm) {
      this.loginForm.valueChanges.subscribe(() =>
        this.validateForm(false, this.loginForm)
      );
    }

    if (this.passwordResetForm) {
      this.passwordResetForm.valueChanges.subscribe(() =>
        this.validateForm(false, this.passwordResetForm)
      );
    }

    if (this.otpForm) {
      this.otpForm.valueChanges.subscribe(() =>
        this.validateForm(false, this.otpForm)
      );
    }
  }
  validateForm(onSubmit: boolean = false, currentForm: NgForm) {
    if (!currentForm) return;
    const form = currentForm.form;
    let invalidForm = false;

    for (const field in this.formErrors) {
      if (field == "errors") {
        continue;
      }

      this.formErrors[field] = "";
      const control = form.get(field);

      if (control && (control.dirty || onSubmit) && !control.valid) {
        invalidForm = true;
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + " ";
        }
      }
    }

    return invalidForm;
  }

  login() {
    if (!this.validateForm(true, this.loginForm)) 
    {
      this.authService.getSpeakerIp().pipe(catchError(err => this.authService.authenticate(this.user, this.msg, this.speakerIp)))
        .subscribe((res: any) => {
          this.speakerIp = res.ipAddress;
          this.authService.authenticate(this.user, this.msg, this.speakerIp);
        });
    }

  }

  onSendOTP() {
    // if (!this.validateForm(true, this.otpForm))
    this.authService.sendOTP(this.email, this.user.username).subscribe(
      response => {
        this.notify.showSuccess("Success", response.message);
        this.isPasswordReset = true;
        this.email = response.data;
      },
      error => {
        alert("Error Sending OTP");
      }
    );
  }
  onResetPwd() {
    if (!this.validateForm(true, this.passwordResetForm))
      this.authService
        .resetPassword(this.otp, this.userName, this.confirmPassword)
        .subscribe(
          data => {
            this.notify.showSuccess("Success", data.message);
            this.onCancelResetPwd();
          },
          error => {
            alert("Error Sending OTP");
          }
        );
  }
  onForgotPwdClick() {
    if (this.user.username) {
      this.userName = this.user.username;
      this.email = "";
      this.onSendOTP();
    } else {
      this.notify.showWarning("Warning", "Enter User Name...!");
    }
  }
  onCancelResetPwd() {
    this.isPasswordReset = false;
    this.email = "";
    this.userName = "";
    this.otp = "";
    this.newPassword = "";
    this.confirmPassword = "";
  }
}
