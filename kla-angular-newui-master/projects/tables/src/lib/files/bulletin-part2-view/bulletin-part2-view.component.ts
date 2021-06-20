import { Component, OnInit, Input, Inject } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { ElectionService } from '../../shared/services/election.service';
import { TablescommonService } from '../../shared/services/tablescommon.service';

@Component({
  selector: 'tables-bulletin-part2-view',
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
  constructor(@Inject('authService') private AuthService,
              private notify: NzNotificationService,
              private electionService: ElectionService,
              public commonService: TablescommonService) {
    this.user = AuthService.getCurrentUser();
    this.commonService.setTablePermissions(this.user.rbsPermissions);
  }

  ngOnInit() {
    this.getRbsPermissionsinList();
  }

  publishBulletin(bulletin) {
    this.electionService.publishBulletin(bulletin.id).subscribe((res: any) => {
      bulletin.status = res.status;
      this.notify.success('Success', 'Bulletin Published.');
    })
  }
  addClass() {
    this.fullScreenMode = !this.fullScreenMode;
  }

  getRbsPermissionsinList() {
    if (this.commonService.doIHaveAnAccess('PUBLISH_BULLETIN', 'CREATE')) {
      this.buttonControls.publish = true;
    }
  }
}
