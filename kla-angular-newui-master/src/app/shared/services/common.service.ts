import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import * as Stomp from "stompjs";
import * as SockJS from "sockjs-client";
import { BehaviorSubject } from "rxjs";
@Injectable()
export class CommonService {
  constructor(private http: HttpClient) {}

  getAllMembers() {
    return this.http
      .get(`${environment.user_mgmnt_api_url}/users/member/getAll`)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  
}
