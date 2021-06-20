import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Location } from '@angular/common';
import { PmbrScheduleService } from '../shared/services/pmbr-schedule.service';

@Component({
  selector: 'pmbr-create-schedule',
  templateUrl: './create-schedule.component.html',
  styleUrls: ['./create-schedule.component.css']
})
export class CreateScheduleComponent implements OnInit {
  scheduleCreatePassingData = {
    sceduleId: 0,
    isView: false
  }
  reportParams = {
    showPdf : false,
    finalUrl : null
  }
  constructor(private route: ActivatedRoute, private notify: NzNotificationService,
    private router: Router, private _location: Location,
    private pmbrSchedule: PmbrScheduleService,
    private notification: NzNotificationService,) {

  }

  ngOnInit() {
    this.showCreateScheduleContentComponent();
  }

  //function for show create scedule component
  showCreateScheduleContentComponent() {
    const scheduleId = this.route.snapshot.params["id"];
    if (scheduleId) {
      this.scheduleCreatePassingData.sceduleId = scheduleId;
      const purpose = this.route.snapshot.params["purpose"];
      if (purpose == 'view') {
        this.scheduleCreatePassingData.isView = true;
      }
      else {
        this.scheduleCreatePassingData.isView = false;
      }
    }
    else {
      this.scheduleCreatePassingData = {
        sceduleId: 0,
        isView: false
      }
    }
  }

  scheduleCreated(event) {
    if (event) {
      // this.notify.success('Success', 'Schedule Created Successfully');
      // this.router.navigate(['business-dashboard/pmbr/schedule-list']);
      window.history.back();
    }
  }
  back() {
    this._location.back();
  }
  cancelCos(){
    this.reportParams.finalUrl = null;
    this.reportParams.showPdf = null;
  }

  showCOS() {
    // this.modal.create({
    //   nzTitle: 'COS Preview',
    //   nzContent: CosViewComponent,
    //   nzClosable: true,
    //   nzFooter: null,
    //   nzMaskClosable: false,
    //   nzComponentParams: {
    //     calendarSittingId: cosId,
    //   }
    // });
    this.pmbrSchedule.getCOSId(1, 4).subscribe((res: any) => {
        if (res) {
          res.assemblyId = 14
          res.sessionId =  20
          res.reportType = "COSReport";
          res.location = "report.pdf";
          if (res.calendarOfDaysList) {
            this.getPDF(res);
          } else {
            this.reportParams.showPdf = false;
            this.notification.warning("Sorry Report is not Available","");
          }
        }
      });
  }
  getPDF(body){
    var mediaType = "application/pdf";
    this.reportParams.finalUrl = null;
    this.pmbrSchedule.getReport(body).subscribe((response) => {
      if (response) {
        var blob = new Blob([response], { type: mediaType });
        this.reportParams.finalUrl = URL.createObjectURL(blob);
        this.reportParams.showPdf = true;
      } else {
        this.reportParams.showPdf = false;
        this.notification.warning("Sorry Report is not Available","");
      }
    });
  }
}
