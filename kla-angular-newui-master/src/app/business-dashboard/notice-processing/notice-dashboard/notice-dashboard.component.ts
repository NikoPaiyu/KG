import { Component, OnInit } from '@angular/core';
import { NoticeTemplateService } from '../shared/services/notice-template.service';
import { NoticeService } from '../shared/services/notice.service';
import { AuthService } from 'src/app/auth/shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notice-dashboard',
  templateUrl: './notice-dashboard.component.html',
  styleUrls: ['./notice-dashboard.component.scss']
})
export class NoticeDashboardComponent implements OnInit {
  userName = '';
  listOfData: any ;
  constructor( private service: NoticeTemplateService,
               private auth: AuthService,
               public router: Router) { }

  ngOnInit() {
    this.getData();
    this.getCurrentUsername();
  }
  getData() {
    const userId = this.auth.getCurrentUser().userId;
    if (userId) {
      this.service.getDashboardData(userId).subscribe(Response => {
        if (Response) {
          this.listOfData = Response;
        }
      });
    }
  }
  getCurrentUsername() {
    const userData = this.auth.getCurrentUser();
    this.userName = userData.fullName;
  }
  goTo(status) {
    console.log(status);
    this.router.navigate(['business-dashboard/notice/ab/list', status]);
  }
}
