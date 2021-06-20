import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { PmbrCommonService } from 'projects/pmbr/src/lib/shared/services/pmbr-common.service';
@Component({
  selector: 'pmbr-bulletin-part2-view',
  templateUrl: './bulletin-part2-view.component.html',
  styleUrls: ['./bulletin-part2-view.component.css']
})
export class BulletinPart2ViewComponent implements OnInit {
  
  @Input() bulletinResponse;
  @Output() onPublished = new EventEmitter<any>();
  @Output() correspondence = new EventEmitter<any>();

  user;
  buttonControls = {
    publish: false
  }
  bulletinStatus;

  constructor(private common: PmbrCommonService,
              private notify: NzNotificationService,
              @Inject('authService') private AuthService) {
                this.user = AuthService.getCurrentUser();
                this.common.setPermissions(this.user.rbsPermissions);
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
    if (this.common.doIHaveAnAccess("BULLETIN", "SUBMIT")
      || this.common.doIHaveAnAccess('PUBLISH_BULLETIN','CREATE')) {
      this.buttonControls.publish = true;
    }
  }
  publishBulletin(bulletin) {
    this.common.publishBulletin(bulletin.id).subscribe((res: any) => {
      if(res) {
        bulletin.status = res.status;
        this.notify.success("Success", "Bulletin Circulated.");
        this.onPublished.emit();
      }
    })
  }
  sendCorrespondence(bulletinId) {
    this.correspondence.emit(bulletinId);
  }
}
