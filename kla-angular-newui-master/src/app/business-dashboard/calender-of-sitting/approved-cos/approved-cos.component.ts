import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CalenderofsittingService } from '../shared/services/calenderofsitting.service';
import { AuthService } from 'src/app/auth/shared/services/auth.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { QuestionService } from '../../question/shared/question.service';
import { first } from 'rxjs/operators';
import { QuestionRBSService } from "../../question/shared/question-rbs.service";
import { NotificationCustomService } from "src/app/shared/services/notification.service";

@Component({
  selector: "app-approved-cos",
  templateUrl: "./approved-cos.component.html",
  styleUrls: ["./approved-cos.component.scss"],
})
export class ApprovedCosComponent implements OnInit {
  today = new Date();
  assemblyList: any = [];
  sessionList: any = [];
  userid;
  filter: any = {
    assemblyId: 1,
    sessionId: 3,
  };
  calendarEvents: any = [];
  calendarSittingId;
  maxNumber;
  maxValue;
  assemblyId = null;
  sessionId = null;
  assemblySession: object = [];
  validateForm: FormGroup;
  constructor(
    public cobservice: CalenderofsittingService,
    public fb: FormBuilder,
    private auth: AuthService,
    private question: QuestionService,
    public rbsService: QuestionRBSService,
    private notify: NotificationCustomService
  ) {}

  ngOnInit() {
    // this.getAssemblySession();
    this.getAssemblySessionDetails();
    this.loadRBSPermissions();
    this.userid = this.auth.getCurrentUser().userId;
  }
  getAssemblySessionDetails() {
    this.cobservice.getAssemblySessionDetails().subscribe(data => {
      this.assemblyList = data.assemblySession;
      this.assemblyId = data.activeAssemblySession.assemblyId;
      this.filterSession();
      this.sessionId = data.activeAssemblySession.sessionId;
      this.getCodList();
    });
  }
  filterSession() {
    const assemblyDetails = this.assemblyList.find(x => x.id === this.assemblyId);
      if (assemblyDetails) {
        this.sessionList = assemblyDetails.session;
      }
  }
  getAssemblySession() {
    this.question.getAllAssembly().subscribe((assembly) => {
      this.assemblyList = assembly;
      const ids = this.assemblyList.map((x) => x.id);
      this.assemblyId = Math.max(...ids);
      this.question.getAllSession().subscribe((session) => {
        this.sessionList = session;
        const sessions = this.sessionList.map((x) => x.id);
        this.sessionId = Math.max(...sessions);
        this.getCodList();
      });
    });
  }

  getCodList() {
    console.log(this.assemblyId, this.sessionId);
    const status = "APPROVED";
    if (this.assemblyId && this.sessionId) {
      this.cobservice
        .getApprovedCos(this.assemblyId, this.sessionId, status)
        .subscribe((res: any) => {
          console.log(res);
          this.processCalendarEvent(res);
        });
    }
  }
  processCalendarEvent(data) {
    if (data && data.calendarOfDaysList) {
      this.calendarSittingId = data.calendarofSittingId;
      this.calendarEvents = data;
      let firstData = null;
      data.calendarOfDaysList.forEach((element, i) => {
        if (firstData !== new Date(element.dateList[0]).getMonth()) {
          firstData = new Date(element.dateList[0]).getMonth();
          this.calendarEvents.calendarOfDaysList[i].month = element.dateList[0];
        }
      });
      this.calendarEvents = data;
    } else {
      this.calendarEvents = null;
    }
  }
  isMLA() {
    return this.auth.getCurrentUser().authorities.includes("MLA");
  }
  ShowBusiness(item) {
    if (item && item.lobBusinessGroupId === 3) {
      return item.descriptionEng;
    }
    return item.lobBusinessGroupName;
  }
  loadRBSPermissions() {
    if (this.auth.getCurrentUser().userId) {
      this.rbsService
        .getQuestionPermissions(this.auth.getCurrentUser().userId)
        .subscribe((response) => {});
    }
  }
  sendTOMembers() {
    if (this.assemblyId && this.sessionId) {
      this.cobservice
        .getCosReportPermission(
          this.assemblyId,
          this.sessionId
        )
        .subscribe((res: any) => {
          if (res.calendarofSittingId && res.calendarOfDaysList.length > 0) {
            this.notify.showWarning("Already Sent", "");
            return;
          }
          this.cobservice
            .sendTOMembers({ calendarofSittingId: this.calendarSittingId })
            .subscribe((res: any) => {
              this.notify.showSuccess("Add Success", "");
            });
        });
    }
  }
}
