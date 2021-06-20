import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PmbrCommonService } from '../../shared/services/pmbr-common.service';

@Component({
  selector: 'pmbr-ballot-list',
  templateUrl: './ballot-list.component.html',
  styleUrls: ['./ballot-list.component.css']
})
export class BallotListComponent implements OnInit {
  ballotListing: any = [];
  ballotListingForDepartment: any = [];
  ballotResultById = false;
  presentationDate;
  assemblyId = null;
  sessionId = null;
  sessionList: any = [];
  assemblyList: any = [];
  assemblySession: any = null;
  constructor(private pmbrCommonService: PmbrCommonService, private router: Router, ) { }

  ngOnInit() {
    // this.ballotlist();
    // this.ballotlistforSection();
    // this.getAssembly();
    // this.getSessions();
    this.getAssemblyandSession();
  }
  getAssemblyandSession() {
    this.pmbrCommonService.getAllAssemblyAndSession().subscribe((Res: any) => {
      this.assemblyList = Res.assembly;
      this.assemblySession = Res.assemblySession;
      this.assemblyId = Res.activeAssemblySession.assemblyId;
      this.getSessionForAssembly();
      this.sessionId = Res.activeAssemblySession.sessionId;
      this.ballotlistforSection();
    });
  }
  getSessionForAssembly() {
    this.sessionList = []; 
      if (this.assemblyId && this.assemblySession.find(x => x.id === this.assemblyId)) {
        this.sessionId = null;
        this.sessionList = this.assemblySession.find(x => x.id === this.assemblyId).session;
      }
  }
ballotlist(){
  this.pmbrCommonService.getBallotList().subscribe(res => {
    this.ballotListingForDepartment = res;
  });
}
ballotlistforSection(){
  const body ={
    assemblyId: this.assemblyId,
    sessionId: this.sessionId
  }
  this.pmbrCommonService.getBallotListforSection(body).subscribe(res => {
    this.ballotListing  = res;
  });
}
ViewBallotResult(id){
  this.router.navigate(['business-dashboard/pmbr/ballot-view/', id])
}
getSessions(){
  this.pmbrCommonService.getAllSession().subscribe(res => {
    this.sessionList = res;
    // console.log(this.sessionList);
  });
}
getAssembly(){
  this.pmbrCommonService.getAllAssembly().subscribe(res => {
    this.assemblyList = res;
    // console.log(this.assemblyList);
  });
}
}
