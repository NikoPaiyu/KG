import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/shared/services/auth.service';
import { FileService } from '../../../shared/services/file.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-list-convenience',
  templateUrl: './list-convenience.component.html',
  styleUrls: ['./list-convenience.component.scss']
})
export class ListConvenienceComponent implements OnInit {

  userId;
  noticeList: any;
  allNoticeList = [];
  constructor(
    private user: AuthService,
    private file: FileService,
    private route: ActivatedRoute,
    private router: Router

  ) {
    this.userId = this.user.getCurrentUser().userId;
   }

  ngOnInit() {
    this.getListPendingConveniences();
    this.getAllNotices();
  }
  getListPendingConveniences() {
    this.file.listPendingConveniences(this.userId).subscribe((Response) => {
      if (Response) {
        this.noticeList = Response;
      }
    });
  }
  getAllNotices() {
    this.file.listAllConveniences(this.userId).subscribe((Response) => {
      if (Response) {
        this.allNoticeList = Response;
      }
    });
  }
  OpenNotice(noticeId) {
    if (noticeId) {
      const url = btoa('../../ab/minister/list');
      this.router.navigate(['../../../notice/process', noticeId, url], {
        relativeTo: this.route.parent,
      });
    }
  }
}
