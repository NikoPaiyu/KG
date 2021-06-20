import { Component, OnInit, Input, Inject } from '@angular/core';
import { BillcommonService } from '../../shared/services/billcommon.service';
import { BillBulletinService } from '../../shared/services/bill-bulletin.service';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'lib-bulletin-content-view',
  templateUrl: './bulletin-content-view.component.html',
  styleUrls: ['./bulletin-content-view.component.css']
})
export class BulletinContentViewComponent implements OnInit {
  user;
  buttonControls = {
    publish: false
  }
  @Input() bulletin;
  constructor(@Inject("authService") private AuthService,
    private common: BillcommonService,
    private bulletinService: BillBulletinService,
    private notify: NzNotificationService) {
    this.user = AuthService.getCurrentUser();
    this.common.setBillPermissions(this.user.rbsPermissions);
  }

  ngOnInit() {
    this.setButtonControls();
  }

  setButtonControls() {
    if (this.common.doIHaveAnAccess("BULLETIN_PUBLISH", "CREATE")
    ) {
      this.buttonControls.publish = true;
    }
  }

  publishBulletin() {
    this.bulletinService.publishBulletin(this.bulletin.id).subscribe((res: any) => {
      this.notify.success("Success", "Bulletin Published.");
      this.bulletin.status = res.status;
    })
  }

}
