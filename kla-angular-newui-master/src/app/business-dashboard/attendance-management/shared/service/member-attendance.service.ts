import { Injectable } from '@angular/core';
import { NumberFormatStyle, JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs-compat/operator/map';
import { SenetResponse } from '../model/senet.response';

@Injectable({
  providedIn: 'root'
})

export class MemberAttendanceService {
  constructor(private http:HttpClient){
  }
// private memberAttendance:MemberAttendanceModel[]=[{id:1,absentCount:3,presentCount:4,
//     absentMembers:[{id:1,constituencyName:'',politicalParty:'',username:'',seatNumber:'A2_4'},
//     {id:4,constituencyName:'',politicalParty:'',username:'',seatNumber:'A4_4'},
//     {id:1,constituencyName:'',politicalParty:'',username:'',seatNumber:'B4_16'}],date:'12-05-2019',
//      presentMembers:[{id:5,constituencyName:'',politicalParty:'',username:'',seatNumber:'B2_12'},
//      {id:6,constituencyName:'',politicalParty:'',username:'',seatNumber:'B2_11'},
//      {id:7,constituencyName:'',politicalParty:'',username:'',seatNumber:'B3_14'},
//      {id:8,constituencyName:'',politicalParty:'',username:'',seatNumber:'A3_14'}]},
//      {id:1,absentCount:3,presentCount:4,
//         absentMembers:[{id:1,constituencyName:'',politicalParty:'',username:'',seatNumber:'A2_4'},
//         {id:4,constituencyName:'',politicalParty:'',username:'',seatNumber:'A5_4'},
//         {id:1,constituencyName:'',politicalParty:'',username:'',seatNumber:'B5_16'}],date:'25-05-2019',
//          presentMembers:[{id:5,constituencyName:'',politicalParty:'',username:'',seatNumber:'B2_12'},
//          {id:6,constituencyName:'',politicalParty:'',username:'',seatNumber:'B3_13'},
//          {id:7,constituencyName:'',politicalParty:'',username:'',seatNumber:'B6_12'},
//          {id:8,constituencyName:'',politicalParty:'',username:'',seatNumber:'A3_14'}]}];
    
     getAttendance(){
       return this.http.get<SenetResponse>('member-attendance-register/recent-attendances')
    }
}