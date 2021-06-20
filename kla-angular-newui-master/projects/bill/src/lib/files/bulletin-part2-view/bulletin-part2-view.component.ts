import { Component, OnInit, Input, Inject } from '@angular/core';
import { BillcommonService } from '../../shared/services/billcommon.service';
import { BillBulletinService } from '../../shared/services/bill-bulletin.service';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'lib-bulletin-part2-view',
  templateUrl: './bulletin-part2-view.component.html',
  styleUrls: ['./bulletin-part2-view.component.css']
})
export class BulletinPart2ViewComponent implements OnInit {
  @Input() bulletinResponse;
  user;
  buttonControls = {
    publish: false
  }
  constructor(@Inject("authService") private AuthService,
    private common: BillcommonService,
    private bulletinService: BillBulletinService,
    private notify: NzNotificationService) {
    this.user = AuthService.getCurrentUser();
    this.common.setBillPermissions(this.user.rbsPermissions);
  }

  ngOnInit() {
    this.setButtonControls();
    if (this.bulletinResponse && this.bulletinResponse.length > 0) {
      this.bulletinResponse.forEach(element => {
        element.active = false
      });
    }
  }

  setButtonControls() {
    if (this.common.doIHaveAnAccess("BULLETIN_PUBLISH", "CREATE")) {
      this.buttonControls.publish = true;
    }
  }

  publishBulletin(bulletin) {
    this.bulletinService.publishBulletin(bulletin.id).subscribe((res: any) => {
      bulletin.status = res.status;
      this.notify.success("Success", "Bulletin Published.");
    })
  }
}
