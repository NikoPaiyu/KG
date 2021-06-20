import { Injectable } from "@angular/core";
import { NzNotificationService } from "ng-zorro-antd/notification";
@Injectable({ providedIn: "root" })
export class NotificationCustomService {
  constructor(public notifyService: NzNotificationService) {
    this.notifyService.config({
      nzAnimate: true,
      nzPlacement: "bottomRight"
    });
  }

  showInformation(title, body) {
    this.notifyService.info(title, body);
  }

  showSuccess(title, body) {
    this.notifyService.success(title, body);
  }

  showError(title, body) {
    this.notifyService.error(title, body);
  }

  showWarning(title, body) {
    this.notifyService.warning(title, body);
  }

  blank(title, body, time) {
    this.notifyService.warning(title, body, time);
  }
  
  clear(id: any) {
    this.notifyService.remove(id);
  }

  clearAll() {
    this.notifyService.remove();
  }
}
