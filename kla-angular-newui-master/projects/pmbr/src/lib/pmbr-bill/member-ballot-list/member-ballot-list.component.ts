import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PmbrCommonService } from '../../shared/services/pmbr-common.service';

@Component({
  selector: 'pmbr-member-ballot-list',
  templateUrl: './member-ballot-list.component.html',
  styleUrls: ['./member-ballot-list.component.scss']
})
export class MemberBallotListComponent implements OnInit {
  ballotListing: any = [];
  ballotListingForMembers: any = [];
  ballotResultById = false;
  presentationDate;
  assemblyId = null;
  sessionId = null;
  sessionList: any = [];
  assemblyList: any = [];
  showResultPopup = false;
  selectedBallot: any = null;
  assemblySession: any = null;
  constructor(private pmbrCommonService: PmbrCommonService, private router: Router) { }

  ngOnInit() {
    this.getAssemblyandSession();
  }

ballotlistforMembers() {
  this.ballotListing = [];
  if (this.assemblyId && this.sessionId) {
    this.pmbrCommonService.getBallotListforMembers(this.assemblyId, this.sessionId).subscribe(res => {
      this.ballotListing  = res;
    });
  }
}
getAssemblyandSession() {
  this.pmbrCommonService.getAllAssemblyAndSession().subscribe((Res: any) => {
    this.assemblyList = Res.assembly;
    this.assemblySession = Res.assemblySession;
    this.assemblyId = Res.activeAssemblySession.assemblyId;
    this.getSessionForAssembly();
    this.sessionId = Res.activeAssemblySession.sessionId;
    this.ballotlistforMembers();
  });
}
getSessionForAssembly() {
  this.sessionList = []; 
  if (this.assemblyId === 0) {
    this.sessionId = 0;
    this.sessionList = [{
      id: 0,
      sessionId: 'No Session',
    }];
  } else {
    if (this.assemblyId && this.assemblySession.find(x => x.id === this.assemblyId)) {
      this.sessionId = null;
      this.sessionList = this.assemblySession.find(x => x.id === this.assemblyId).session;
    }
  }
}


viewResult(ballot) {
  this.showResultPopup = true;
  this.selectedBallot = ballot;
}

hidePopup() {
  this.showResultPopup = false;
  this.selectedBallot = null;
}

}
