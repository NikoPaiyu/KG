import { Component, OnInit } from "@angular/core";
import { QuestionService } from "../shared/question.service";
import { formatDate } from "@angular/common";
import { NotificationCustomService } from "src/app/shared/services/notification.service";

import { FormGroup } from "@angular/forms";
import { differenceInCalendarDays } from "date-fns";

@Component({
  selector: "app-question-date-shifting",
  templateUrl: "./question-date-shifting.component.html",
  styleUrls: ["./question-date-shifting.component.scss"],
})
export class QuestionDateShiftingComponent implements OnInit {
  questionDates: any = [];
  dateFormat = "dd/MM/yyyy";
  dateShiftType = "dateshift";
  sessionExtented = "no";
  fromDate;
  toDate;
  reason;
  dateshift = true;
  serialshift;
  validateForm: FormGroup;
  dates = [];
  newDate = new Date();
  assemblySession: object = [];
  cosDates = [];
  constructor(
    private question: QuestionService,
    private notify: NotificationCustomService
  ) {}

  ngOnInit() {
    this.getAssemblySession();
  }
  getAssemblySession() {
    this.question.getAllAssemblyAndSession().subscribe((res) => {
      if (res) {
        this.assemblySession = res;
        this.findSessionListByAssembly(this.assemblySession['assembly'].currentassembly)
      }
    });
  }
  findSessionListByAssembly(selAssembly) {
    if (this.assemblySession) {
      if (this.assemblySession['sessionByAssembly'].
      find(
        (element) => element.id === selAssembly)) {
        let session = this.assemblySession['sessionByAssembly'].find(
          (element) => element.id === selAssembly).session;
        this.assemblySession['session'] = session;
        this.assemblySession['session'].currentsession = session.slice(-1).pop().id
      }
    }
    if(this.assemblySession['session'].currentsession) {
      this.getAodDates();
      this.getCosDates();    
    }
  }
  getAodDates() {
    this.question
      .getDate(
        this.assemblySession["assembly"].currentassembly,
        this.assemblySession["session"].currentsession
      )
      .subscribe((res: any) => {
        // this.aodService.getAODList(
        this.dates = [];
        this._clearVaribales();
        if (res.length > 0) {
          res.forEach(async (date) => {
            this.dates.push(date);
          });
          let today = new Date().toISOString().split("T")[0];
          this.dates = this.dates.filter((date) => date > today);
          this.dates = this.dates.filter(
            (v, i, a) => a.findIndex((t) => t === v) === i
          );
          this.dates.sort();
        }
      });
  }
  _clearVaribales() {
    this.fromDate = this.toDate = null;
    this.reason = null;
  }
  disabledDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, new Date()) < 0;
  };
  decideShift() {
    this._clearVaribales();
    if (this.dateShiftType == "dateshift") {
      this.dateshift = true;
      this.serialshift = false;
    } else {
      this.serialshift = true;
      this.dateshift = false;
    }
  }
  transferDate() {
    if (!this.fromDate || !this.toDate) {
      this.notify.showWarning("Warning", "Please select Dates");
      return;
    }
    const Req = {
      fromDate: formatDate(this.fromDate, "yyyy-MM-dd", "en-US", "+0530"),
      toDate: formatDate(this.toDate, "yyyy-MM-dd", "en-US", "+0530"),
      assemblyId: this.assemblySession["assembly"].currentassembly,
      sessionId: this.assemblySession["session"].currentsession,
    };
    this.question
      .transferDate(Req, this.dateShiftType)
      .subscribe((res: any) => {
        if (res) {
          this.notify.showSuccess("Success", "Success");
          this._clearVaribales();
        }
      });
  }
  disablenewQdate(fromDate) {
    if (fromDate) {
      this.newDate = new Date(fromDate);
      var days = 1;
      let nextdate = new Date(
        new Date(this.newDate).setDate(new Date(this.newDate).getDate() + days)
      );
      this.toDate = new Date(nextdate);
    } else {
      this.toDate = new Date();
    }
  }

  disabledQuestionDate = (current: Date): boolean => {
    if (this.cosDates) {
      if (this.sessionExtented === 'yes') {
        return differenceInCalendarDays(current, new Date()) < 0;
      }
      const year  = current.getFullYear();
      const month = (current.getMonth() + 1).toString().padStart(2, '0');
      const day   = current.getDate().toString().padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      const check = this.cosDates.some(x => x === formattedDate) && differenceInCalendarDays(current, new Date()) >= 0;
      return !check;
    }
    return true;
  }
  getCosDates() {
    const assemblyId = this.assemblySession["assembly"].currentassembly;
    const sessionId = this.assemblySession["session"].currentsession;
    if (assemblyId && sessionId) {
      this.question.getCosDates(assemblyId, sessionId).subscribe(data => {
        this.cosDates = data as any;
      });
    }
  }
}
