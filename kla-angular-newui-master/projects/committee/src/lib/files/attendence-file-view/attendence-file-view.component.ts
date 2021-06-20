import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { NzNotificationService } from "ng-zorro-antd";
import { CommitteeService } from "../../shared/services/committee.service";

@Component({
  selector: "committee-attendence-file-view",
  templateUrl: "./attendence-file-view.component.html",
  styleUrls: ["./attendence-file-view.component.scss"],
})
export class AttendenceFileViewComponent implements OnInit {
  @Input() listOfDatas: any;
  @Input() meetingId: any;
  @Input() showEdit = false;
  @Input() meetingDetails: any;
  attEdit = false;
  @Output() updatedAtt = new EventEmitter<any>();
  listOfAllDatas = [];

  constructor(
    private notification: NzNotificationService,
    public committeeService: CommitteeService
  ) {}

  ngOnInit() {
    this.listOfAllDatas = this.listOfDatas;
    this.listOfDatas = this.listOfDatas.filter((x) => x.present == true);
  }

  editAttendence() {
    this.attEdit = true;
  }

  cancelEditAttendence() {
    this.attEdit = false;
  }

  checkSelected() {
    if (this.listOfDatas.find((x) => x.present === true)) {
      return true;
    } else {
      return false;
    }
  }

  handleOk() {
    if (this.checkSelected()) {
      this.committeeService
        .markAttendence(this.listOfDatas, this.meetingId)
        .subscribe((res: any) => {
          this.notification.success(
            "Success",
            "Attendence Marked Successfully"
          );
          this.attEdit = false;
          this.updatedAtt.emit();
        });
    } else {
      this.notification.warning("Warning", "Please select at least one person");
    }
  }
}
