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
      .post(`${environment.user_mgmnt_api_url}/users/member/findSpeaker`, "")
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
      .get(`${environment.seat_plan_url}/getMappingList`)
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
  getKlaSections() {
    return this.http
      .get(`${environment.departmentmangement_api_url}/getsection`)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  getassignseat(body) {
    return this.http
      .get(`${environment.seat_management_url}/section/seat/byId?sectionId=${body.sectionId}`)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  getallbusiness() {
    return this.http
      .get(`${environment.seat_management_url}/business`)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  saveSeat(body) {
    return this.http
      .post(`${environment.seat_management_url}/section/seat`, body)
      .pipe(
        map(res => {
          return res;
        })
      );
  }
  deleteseat(body) {
    return this.http.delete(
      `${environment.seat_management_url}/removeSeat?seatId=${body.seatId}`
    );
  }
  assignSeat(body) {
    return this.http
      .post(`${environment.seat_management_url}/section/seat/user`, body)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  getAssisstantList(body) {
    return this.http.post(`${environment.user_mgmnt_api_url}/rbs/getUsersWithSectionRoles`, body);
  }
  unAssignseat(userId) {
    return this.http.delete(
      `${environment.seat_management_url}/unassignUser?userId=${userId}`
    );
  }
  getnonmemberslist(body) {
    return this.http.post(`${environment.user_mgmnt_api_url}/v1/users/member/getNonMembers`, body);
  }

}
