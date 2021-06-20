import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { environment } from "src/environments/environment";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class SeatService {
  constructor(private http: HttpClient) { }

  getAllUnSeatedMembers() {
    return this.http
      .get(`${environment.user_mgmnt_api_url}/v1/users/member/getUnSeatedMembers`)
      .pipe(
        map(res => {
          return res;
        })
      );
  }
  getSpekerDetails() {
    return this.http
      .post(`${environment.user_mgmnt_api_url}/v1/users/member/findSpeaker`, "")
      .pipe(
        map(res => {
          return res;
        })
      );
  }
  updateSeatMapping(seatNumber, memberId) {
    return this.http
      .post(`${environment.seat_management_url}/saveSeatMapping`, {
        seatNumber: seatNumber,
        memberId: memberId
      })
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  getMappingList() {
    return this.http
      .get(`${environment.seat_management_url}/getMappingList`)
      .pipe(
        map(res => {
          return res;
        })
      );
  }
  removeSeat(seatNumber) {
    return this.http
      .delete(`${environment.seat_management_url}/removeSeat/${seatNumber}`)
      .pipe(
        map(res => {
          return res;
        })
      );
  }
}
