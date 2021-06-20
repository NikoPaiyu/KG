import { Component, OnInit, Input, Inject } from '@angular/core';
import { CommitteeBullettincommonService } from '../../shared/services/committeebullettin-common.service';
import { CommitteeBulletinService } from '../../shared/services/committee-bulletin.service';
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
    private common: CommitteeBullettincommonService,
    private bulletinService: CommitteeBulletinService,
    private notify: NzNotificationService) {
    this.user = AuthService.getCurrentUser();
    this.common.setBillPermissions(this.user.rbsPermissions);
  }

  ngOnInit() {
    this.setButtonControls();
  }

  setButtonControls() {
    if (this.common.doIHaveAnAccess("PUBLISH_BULLETIN", "READ")
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
