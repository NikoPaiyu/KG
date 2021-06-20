import { Component, OnInit, Input, Inject } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { BulletinService } from '../../shared/services/bulletin.service';
import { PmbrCommonService } from '../../shared/services/pmbr-common.service';

@Component({
  selector: 'pmbr-bulletin-content-view',
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
              private common: PmbrCommonService,
              private bulletinService: BulletinService,
              private notify: NzNotificationService) {
    this.user = AuthService.getCurrentUser();
    this.common.setPermissions(this.user.rbsPermissions);
  }

  ngOnInit() {
    this.setButtonControls();
  }

  setButtonControls() {
    if (this.common.doIHaveAnAccess('BULLETIN', 'CREATE') 
      || this.common.doIHaveAnAccess('PUBLISH_BULLETIN','CREATE')
    ) {
      this.buttonControls.publish = true;
    }
  }

  publishBulletin() {
    this.bulletinService.publishBulletin(this.bulletin.id).subscribe((res: any) => {
      this.notify.success("Success", "Bulletin Circulated.");
      this.bulletin.status = res.status;
    })
  }

}
