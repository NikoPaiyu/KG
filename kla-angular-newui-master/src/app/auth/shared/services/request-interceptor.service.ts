import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
} from "@angular/common/http";
import * as _ from "lodash";
import "rxjs/add/operator/catch";
import "rxjs/add/observable/throw";
import { Observable } from "rxjs/Rx";
import { AuthService } from "./auth.service";
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from "@angular/router";
import { NotificationCustomService } from "src/app/shared/services/notification.service";

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  public count: number = 0;
  public spinnerShow: boolean = true;
  constructor(
    public auth: AuthService,
    public spinner: NgxSpinnerService,
    public router: Router,
    public notify: NotificationCustomService
  ) { }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.spinnerShow = true;
    this.count++;
    req = req.clone({ headers: req.headers.set("Accept", "application/json") });
    if (!(req.body instanceof FormData)) {
      req = req.clone({
        headers: req.headers.set("Content-Type", "application/json"),
      });
    }

    if (this.auth.getToken()) {
      req = req.clone({
        headers: req.headers.set(
          "Authorization",
          "Bearer " + this.auth.getToken()
        ),
      });
    }
    req = req.clone({
      url: req.url,
      withCredentials: false,
    });



    if (this.spinnerShow) this.spinner.show();
    return next
      .handle(req)
      .pipe()
      .map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          this.spinner.hide();
          return new HttpResponse({
            body: event.body,
          });
        }
        if (req.url.includes("readMessages")) {
          this.spinner.hide();

        }
        return event;
      })
      .catch((event) => {
        if (event instanceof HttpErrorResponse) {
          this.spinner.hide();
          if (event.error && event.error.fieldErrors) return Observable.throw(event);
          if (event.error && event.status == 400) {
            if (
              event.error &&
              (event.error.error_description || event.error.message)
            ) {
              this.notify.showError(
                "Alert",
                event.error.error_description
                  ? event.error.error_description
                  : event.error.message
              );
              return Observable.empty();
            }
          }

          if (event.status === 401) {
            if (!event.url.includes("validateToken")) {
              this.notify.showError("Error", "Session Expired.");
            }
            sessionStorage.removeItem("authToken");
            // redirect to Login page for example
            this.router.navigate(["/auth/login"]);
          }
          if (event.status === 500) {
            if (
              event.error &&
              (event.error.error_description || event.error.message)
            ) {
              this.notify.showError(
                "Error",
                event.error.error_description
                  ? event.error.error_description
                  : event.error.message
              );
              return Observable.empty();
            } else {
              this.notify.showError("Error", "Something went wrong..");
            }
          }

          if (event.status === 404) {
            this.notify.showError("Error", "Something went wrong..");
          }

          if (event.status === 0) {
            if (event.url.includes("/getIp") || event.url.includes("getSpeakerIp")) // For Production or other Environment
            //if (event.url.includes("/getIp")) //Other Environment
              return Observable.throw(event);
            this.notify.showError("Error", "Something went wrong.Try Again..!");
          }
          return Observable.empty();
        }

        if (event instanceof HttpResponse) {
          this.spinner.hide();
          return Observable.throw(event);
        }
        this.spinner.hide();
        return Observable.throw(event);
      })
      .do((event) => {
        if (event instanceof HttpResponse) {
          this.count--;
          if (this.count == 0) this.spinner.hide();
        }
      });
  }
}