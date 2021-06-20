import { Injectable, Inject} from "@angular/core";
import { HttpClient } from "@angular/common/http";

// import { environment } from "src/environments/environment";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class SeatService {
  environment: any;
  constructor(private http: HttpClient,@Inject('environment') environment) {
    this.environment = environment;
  }

  getAllUnSeatedMembers() {
    return this.http
      .get(`${this.environment.user_mgmnt_api_url}/v1/users/member/getUnSeatedMembers`)
      .pipe(
        map(res => {
          return res;
        })
      );
  }
  getSpekerDetails() {
    return this.http
      .post(`${this.environment.user_mgmnt_api_url}/users/member/findSpeaker`, "")
      .pipe(
        map(res => {
          return res;
        })
      );
  }
  updateSeatMapping(allocationId,seatNumber, memberId) {
    return this.http
      .post(`${this.environment.seat_plan_url}/allocation/saveSeatMapping`, {
        allocationId: allocationId,
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
      .get(`${this.environment.seat_management_url}/getMappingList`)
      .pipe(
        map(res => {
          return res;
        })
      );
  }
  removeSeat(allocationId,seatNumber) {
    return this.http
      .delete(`${this.environment.seat_plan_url}/allocation/removeSeat?allocationId=${allocationId}&seatNumber=${seatNumber}`
      )
      .pipe(
        map(res => {
          return res;
        })
      );
  }
  getUnseatedMembers(allocationId) {
    return this.http
      .get(`${this.environment.seat_plan_url}/allocation/getGetUnseatedMember?allocationId=${allocationId}`)
      .pipe(
        map(res => {
          return res;
        })
      );
  }
  getAllocationById(allocationId) {
    return this.http
      .get(`${this.environment.seat_plan_url}/allocation/getByAllocationId?allocationId=${allocationId}`)
      .pipe(
        map(res => {
          return res;
        })
      );
  }
  submitByAssistant(body) {
    return this.http
    .post(`${this.environment.bill_api_url}/submittedByAssistant`, body)
    .pipe(
      map(res => {
        return res;
      })
    );
  }
  createFile(body) {
    return this.http
    .post(`${this.environment.bill_api_url}/file/createFile`, body)
    .pipe(
      map(res => {
        return res;
      })
    );
    // return this.http.post(this.apiBaseURI + ApiConfig.bill.createFile, body);
  }
}
