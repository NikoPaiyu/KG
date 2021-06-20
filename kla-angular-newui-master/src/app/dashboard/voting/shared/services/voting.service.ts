import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { UserDetails } from '../models/userDetails';

@Injectable()
export class VotingService {
  constructor(public http: HttpClient) { }

  initiateVotingByBusinessController(id, textInput) {
    let data = {
      id: "",
      description: textInput,
      time: "",
      resultDisplayTime: "",
      status: "",
      business_id: id

    };
    return this.http
      .post(`${environment.vote_url}/kla/service/v1/vote/initiateVoting`, data)
      .map(res => res);
  }

  doVote(memberId: string, voteEventId: number, selectedOption: string, voteId: number, userId: number, isSpeaker: boolean, isNewActiveSpeaker: boolean) {
    let data = {
      voteEvent: {
        id: voteEventId
      },
      memberName: memberId,
      userId: userId,
      selected_option: selectedOption,
      id: voteId,
      speakerVote: isSpeaker,
      activeSpeakerVote: isNewActiveSpeaker
    };
    return this.http
      .post(`${environment.vote_url}/kla/service/v1/vote/doVote`, data)
      .map(res => res);
  }

  publishVote(voteEventId: number) {
    return this.http
      .get(`${environment.vote_url}/kla/service/v1/vote/${voteEventId}/results`)
      .map(res => res);
  }
  getUsers() {
    return this.http
      .get(`${environment.vote_url}/kla/service/v1/vote/getVoteReport`)
      .map(users => this.mapUsersData(users));
  }

  mapUsersData(users) {
    return users.map(user => {
      return this.mapUserData(user);
    });
  }

  mapUserData(user) {
    let userelement = new UserDetails();
    userelement.assemblyId = user.assemblyId;
    userelement.sessionId = user.sessionId;
    userelement.businessName = user.business_name;
    userelement.total_yes = user.voteresults.totalYes;
    userelement.total_no = user.voteresults.totalNo;
    userelement.total_abstain = user.voteresults.totalAbstain;
    userelement.total_vote = user.voteresults.totalVotes;
    userelement.date = user.allocatedDate;
    userelement.title = user.title;
    return userelement;
  }


}
