import { Injectable, Inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ApiConfig } from "../../shared/config/api.config";
@Injectable({
  providedIn: 'root'
})
export class BallotingService {

  apiBaseURI: string;
  portfolioURI: string;
  environment: any;
  constructor(@Inject("environment") environment, private http: HttpClient) {
    this.environment = environment;
    this.apiBaseURI = this.environment.bill_api_url + ApiConfig.basePathExt;
    this.portfolioURI =
      this.environment.portfolio_mock_api_url + ApiConfig.portfolio;
  }
//   getballotList(billId){
//     return this.http.post(this.apiBaseURI +`/ballot`, ballotbody);
  
// }
getballotList(billId,title) {
  const url = this.apiBaseURI +`/ballot/initialData?billId=${billId}&type=${title}`;
  return this.http.get(url);
}

performBallot(ballotbody){
  return this.http.post(this.apiBaseURI +`/ballot/performBallot`,ballotbody);

}
confirmBallot(ballotId){
  return this.http.post(this.apiBaseURI +`/ballot/confirm/${ballotId}`, ballotId); 
}
// cancelballot(ballotbody){
//   return this.http.post(this.apiBaseURI +`/ballot/cancel`, ballotbody);
// }

cancelballot(ballotId) {
  const url = this.apiBaseURI +`/ballot/cancel/${ballotId}`;
  return this.http.delete(url);
}

publistBallotList(ballotId) {
  return this.http.put(this.apiBaseURI + `/ballot/publishBallot/${ballotId}`, {});
}
}
