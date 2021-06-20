import { Component, OnInit } from "@angular/core";
import { ResetPasswordComponent } from "src/app/shared/components/reset-password/reset-password.component";
import { NzModalService, NzNotificationService } from "ng-zorro-antd";

@Component({
  selector: "reset-password",
  template: `
    <!---->
    <div
      class="ant-notification-notice-content ng-tns-c2-6 ng-star-inserted"
      style=""
    >
      <div
        class="ant-notification-notice-content ant-notification-notice-with-icon"
      >
        <div
          (click)="resetPwd()"
          class="ng-tns-c2-6 ant-notification-notice-with-icon"
        >
          <!----><!----><!----><!----><!----><i
            class="anticon ant-notification-notice-icon ant-notification-notice-icon-error ng-tns-c2-6 anticon-close-circle ng-star-inserted"
            nz-icon=""
            nztype="close-circle"
            ><svg
              viewBox="64 64 896 896"
              fill="currentColor"
              width="1em"
              height="1em"
              class="ng-tns-c2-6"
              data-icon="close-circle"
              aria-hidden="true"
            >
              <path
                d="M685.4 354.8c0-4.4-3.6-8-8-8l-66 .3L512 465.6l-99.3-118.4-66.1-.3c-4.4 0-8 3.5-8 8 0 1.9.7 3.7 1.9 5.2l130.1 155L340.5 670a8.32 8.32 0 00-1.9 5.2c0 4.4 3.6 8 8 8l66.1-.3L512 564.4l99.3 118.4 66 .3c4.4 0 8-3.5 8-8 0-1.9-.7-3.7-1.9-5.2L553.5 515l130.1-155c1.2-1.4 1.8-3.3 1.8-5.2z"
              ></path>
              <path
                d="M512 65C264.6 65 64 265.6 64 513s200.6 448 448 448 448-200.6 448-448S759.4 65 512 65zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"
              ></path></svg
          ></i>
          <div class="ant-notification-notice-message">{{'Alert'| translate}}</div>
          <div class="ant-notification-notice-description">
            <a href="javascript:;" style="cursor: pointer;" (click)="resetPwd()"
              >{{'Click to reset your password' | translate}}.</a
            >
          </div>
        </div>
      </div>
    </div>
    <!----><a class="ant-notification-notice-close" tabindex="0"
      ><span class="ant-notification-notice-close-x"
        ><i
          class="anticon ant-notification-close-icon anticon-close"
          nz-icon=""
          nztype="close"
          ><svg
            viewBox="64 64 896 896"
            fill="currentColor"
            width="1em"
            height="1em"
            class="ng-tns-c2-6"
            data-icon="close"
            aria-hidden="true"
          >
            <path
              d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"
            ></path></svg></i></span
    ></a>
  `
})
export class PasswordResetTemplateComponent implements OnInit {
  ngOnInit() {}
  resetPwd() {
    this.notificationService.remove();
    this.modalService.create({
      nzTitle: `<strong>പാസ്‌വേഡ് മാറ്റുക</strong>`,
      nzContent: ResetPasswordComponent,
      nzClosable: false,
      nzFooter: null,
      nzMaskClosable: false
    });
  }

  constructor(
    private modalService: NzModalService,
    private notificationService: NzNotificationService
  ) {}
}
