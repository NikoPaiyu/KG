import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CalenderofsittingService } from "../shared/services/calenderofsitting.service";

@Component({
  selector: "app-view-calender",
  templateUrl: "./view-calender.component.html",
  styleUrls: ["./view-calender.component.scss"]
})
export class ViewCalenderComponent implements OnInit {
  assemblyList;
  sessionList;
  AssemblyID: number;
  SessionID: number;
  cosDetailsList;
  constructor(
    private router: Router,
    private cosservice: CalenderofsittingService
  ) { }

  ngOnInit() {
    this.getAssembly();
    this.getSession();
  }
  getAssembly() {
    this.cosservice.getAllAssembly().subscribe(res => {
      this.assemblyList = res;
    });
  }
  getSession() {
    this.cosservice.getAllSession().subscribe(res => {
      this.sessionList = res;
    });
  }
  // getAllCosDetails() {
  //   this.cosservice
  //     .getCobList(this.AssemblyID, this.SessionID)
  //     .subscribe(res => {
  //       this.cosDetailsList = res;
  //     });
  // }
  checkCalendarValidity() {
    return this.AssemblyID > 0 && this.SessionID > 0;
  }
}
