import { Component, OnInit, Input, Inject, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'lib-erratum-file-view',
  templateUrl: './erratum-file-view.component.html',
  styleUrls: ['./erratum-file-view.component.css']
})
export class ErratumFileViewComponent implements OnInit {
  @Input() erratumData;
  bulletinData: any;
  user: any;
  showBulletinPart2Popup = false;
  @Output() bulletinCreated = new EventEmitter<string>();

  constructor(@Inject('authService') private AuthService,
              private notification: NzNotificationService,
              private router: Router) {
    this.user = AuthService.getCurrentUser();
  }

  ngOnInit() {
  }

  // createBulletinPart2(errata) {
  //   this.bulletinData = {
  //     businessId: errata.id,
  //     businessType: 'ERRATA',
  //     description: '',
  //     fileId: errata.fileId,
  //     part: '2',
  //     title: '',
  //     type: 'ERRATA',
  //     userId: this.user.userId
  //   };
  //   this.showBulletinPart2Popup = true;
  // }

  // cancelBulletin() {
  //   this.showBulletinPart2Popup = false;
  //   this.bulletinData = {};
  // }

  // afterCreateBulletin(event) {
  //   if (event) {
  //     this.cancelBulletin();
  //     this.notification.success('Success', 'Bulletin Created.');
  //     this.bulletinCreated.emit();
  //   }
  // }

  // view covering letter
  viewCorrespondance(corresId){
    this.router.navigate(["business-dashboard/correspondence/correspondence", "view", corresId]);
  }
}
