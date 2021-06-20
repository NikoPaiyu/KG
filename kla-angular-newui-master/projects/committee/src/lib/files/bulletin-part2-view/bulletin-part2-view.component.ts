import { Component, OnInit, Input, Inject } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { BulletinServiceService } from '../../shared/services/bulletin-service.service';
import { CommitteeBullettincommonService } from '../../shared/services/committeebullettin-common.service';

@Component({
  selector: 'committee-bulletin-part2-view',
  templateUrl: './bulletin-part2-view.component.html',
  styleUrls: ['./bulletin-part2-view.component.css']
})
export class BulletinPart2ViewComponent implements OnInit {
  @Input() bulletinResponse;
  user;
  fullScreenMode = false;
  buttonControls = {
    publish: false
  }
  constructor(@Inject("authService") private AuthService,
              private notify: NzNotificationService,
              private bulletinService: BulletinServiceService,
              private common: CommitteeBullettincommonService) {
    this.user = AuthService.getCurrentUser();
    this.common.setBillPermissions(this.user.rbsPermissions);
  }

  ngOnInit() {
    this.setButtonControls();
    // if (this.bulletinResponse && this.bulletinResponse.length > 0) {
    //   this.bulletinResponse.forEach(element => {
    //     element.active = false
    //   });
    // }
  }

  setButtonControls() {
    if (this.common.doIHaveAnAccess("PUBLISH_BULLETIN", "READ")) {
      this.buttonControls.publish = true;
    }
  }

  publishBulletin(bulletin) {
    this.bulletinService.publishBulletin(bulletin.id).subscribe((res: any) => {
      bulletin.status = res.status;
      this.notify.success("Success", "Bulletin Published.");
    })
  }
  addClass() {
    this.fullScreenMode = !this.fullScreenMode;
  }
}
