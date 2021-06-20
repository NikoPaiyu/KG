import { Component, OnInit, Input } from '@angular/core';
import { AttendanceService } from './shared/services/attendance.service';
import { NzModalService } from 'ng-zorro-antd';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/auth/shared/services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent implements OnInit {
  @Input() voteParticulars;
  isVisible = false;
  deadline: any;
  yesbuttonsize = 'default';
  nobuttonsize = 'default';
  neutralbuttonsize = 'default';
  vote = '';
  question = '';
  constructor(private modal: NzModalService, private auth: AuthService,
              private http: HttpClient) {}

  ngOnInit() {
  }

  hideModel() {
    sessionStorage.removeItem('attendance');
    this.modal.closeAll();
  }

  markAttendance() {
    const url = environment.user_mgmnt_api_url + '/v1/users/member/attendance';
    const body  = {
      userId: this.auth.getCurrentUser().userId
    };
    this.http.put<any>(url, body).subscribe(Response => {
      if (Response.attendanceMarked) {
        this.modal.closeAll();
      }
      sessionStorage.removeItem('attendance');
    });
  }
}
