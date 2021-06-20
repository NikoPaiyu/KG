import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd';
import { AttendanceComponent } from '../../attendance.component';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/auth/shared/services/auth.service';
import { User, UserData } from 'src/app/auth/shared/models/';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
ShowAttendance = new BehaviorSubject<boolean>(false);
public currentUserSubject = new BehaviorSubject<UserData>(new UserData());
  constructor(private modalservice: NzModalService, private user: AuthService) {
  }

  getCurrentUser(): UserData {
    return this.currentUserSubject.value;
  }

  initiateAttendance() {
      if (sessionStorage.getItem('attendance')) {
        if(this.user.getCurrentUser().authorities.includes("minister")|| 
        this.user.getCurrentUser().authorities.includes("speaker")||
        this.user.getCurrentUser().authorities.includes("Deputyspeaker")||
        this.user.getCurrentUser().authorities.includes("oppositionleader")||
        this.user.getCurrentUser().authorities.includes("cheif Whip"))
        {
          console.log('minister attendance');
        } else { 
          sessionStorage.removeItem('attendance');
          this.modalservice.create({
            nzTitle: null,
            nzContent: AttendanceComponent,
            nzClosable: false,
            nzMaskClosable: false
          });
        }
      }
  }
}
