import { Component, OnInit } from "@angular/core";
import { SoaService } from "./shared/soa.service";
import { formatDate } from "@angular/common";
import { NotificationCustomService } from 'src/app/shared/services/notification.service';

@Component({
  selector: "app-schedule-of-activity",
  templateUrl: "./schedule-of-activity.component.html",
  styleUrls: ["./schedule-of-activity.component.scss"]
})

export class ScheduleOfActivityComponent implements OnInit {
  getSoa: any = [];
  sessionId = 16;
 
  
  constructor(
    private getSoaService: SoaService,
    private notify: NotificationCustomService) {}

  ngOnInit() {
    this.getSOA();
  }

  getSOA() {
    this.getSoaService.getScheduleOfActivity().subscribe(data => {
      this.getSoa = data;
    });
  }

  dateOnChange(idx){
    this.getSoa[idx].sessionId = this.sessionId;
    this.getSoa[idx].lottingDate = formatDate(this.getSoa[idx].lottingDate, "yyyy-MM-dd", "en-US", "+0530");
    this.getSoa[idx].sendToPress = formatDate(this.getSoa[idx].sendToPress, "yyyy-MM-dd", "en-US", "+0530");
    this.getSoa[idx].printedAndReceivedFromPress = formatDate(this.getSoa[idx].printedAndReceivedFromPress, "yyyy-MM-dd", "en-US", "+0530");
    this.getSoa[idx].sendToDepartments = formatDate(this.getSoa[idx].sendToDepartments, "yyyy-MM-dd", "en-US", "+0530");
    this.getSoa[idx].distributedToMembers = formatDate(this.getSoa[idx].distributedToMembers, "yyyy-MM-dd", "en-US", "+0530");
    this.getSoa[idx].answerToBeReceivedAtSecretriat = formatDate(this.getSoa[idx].answerToBeReceivedAtSecretriat, "yyyy-MM-dd", "en-US", "+0530");
    this.getSoa[idx].deadlineToIssueTempReply = formatDate(this.getSoa[idx].deadlineToIssueTempReply, "yyyy-MM-dd", "en-US", "+0530");
  }

  
  submitForm() {
    // console.log(this.getSoa);
    this.getSoaService.setScheduleOfActivity(this.getSoa, this.sessionId).subscribe(element => 
      {this.notify.showSuccess('Edited  Successfully', ''); });
    
}
}




