import { Component, OnInit } from '@angular/core';
import { MemberAttendanceService } from '../shared/service/member-attendance.service';

@Component({
  selector: 'app-member-attendance',
  templateUrl: './member-attendance.component.html',
  styleUrls: ['./member-attendance.component.scss']
})
export class MemberAttendanceComponent implements OnInit {
  private memberAttendances:MemberAttendanceModel;
  
  private previousAttendaceObj:MemberAttendanceModel;

  constructor(private memberAttendanceService:MemberAttendanceService) { }

  ngOnInit() {
    this.memberAttendanceService.getAttendance().subscribe(obj=>{
      this.memberAttendances = obj.data;
      this.memberAttendances.absentMembers = obj.data.absentMembers;
      this.memberAttendances.presentMembers = obj.data.presentMembers;
    });
  }

  showAttendance(memberAttendance:MemberAttendanceModel){
    if(this.previousAttendaceObj){
      this.resetSeatColors(this.previousAttendaceObj);
    }
    document.getElementById('wholeContent').classList.contains('st1');
    document.getElementById('wholeContent').classList.remove('st5');
   memberAttendance.presentMembers.forEach(obj=>{
     document.getElementById(obj.seatNumber).classList.add('st1');
   })
  
   memberAttendance.absentMembers.forEach(obj=>{
    document.getElementById(obj.seatNumber).classList.add('st5');
  })

  this.previousAttendaceObj = memberAttendance;
 }

 private resetSeatColors(memberAttendance:MemberAttendanceModel){
  memberAttendance.presentMembers.forEach(obj=>{
    document.getElementById(obj.seatNumber).classList.remove('st1');
  })
 
  memberAttendance.absentMembers.forEach(obj=>{
   document.getElementById(obj.seatNumber).classList.remove('st5');
 })
 }
  }

