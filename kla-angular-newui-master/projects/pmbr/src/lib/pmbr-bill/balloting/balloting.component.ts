import { Component, OnInit, Inject } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { Data, Router, ActivatedRoute } from '@angular/router';
import { PmbrCommonService } from '../../shared/services/pmbr-common.service';
import differenceInCalendarDays from "date-fns/fp/differenceInCalendarDays";
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl,
} from "@angular/forms";
@Component({
  selector: 'pmbr-balloting',
  templateUrl: './balloting.component.html',
  styleUrls: ['./balloting.component.css']
})
export class BallotingComponent implements OnInit {
  today: any = new Date();
  dates;
  id = 0;
  resultBallot;
  fileId = 0;
  attachtofile: boolean = false;
  usersList: any = [];
  tempBallotList = [];
  ballotList = [];
  ballotResult = [];
  performList = [];
  List = [];
  details = [];
  date;
  billType;
  billPresentationDates;
  presentation;
  showballot: boolean = false;
  isEditEnable: boolean;
  preDate;
  conformButton: boolean = false;
  performbutton: boolean = false;
  users: any = [];
  user: any;
  attachtofileButton;
  constructor(private pmbrCommonService: PmbrCommonService,
    private notification: NzNotificationService,
    private fb: FormBuilder,
    private router: Router,
    @Inject('authService') private AuthService) {
    this.user = AuthService.getCurrentUser();
    console.log(this.user);
    if (this.user.authorities[0] === 'deputySecretary') {
      this.attachtofileButton = true;
    }
    this.pmbrCommonService.setPermissions(this.user.rbsPermissions);
  }

  performLot() {
    if (this.tempBallotList) {
      this.showballot = true;
      this.getPerformList();
    }
    else {
      this.showballot = false;
    }

  }
  bills = [
    {
      label: "Bill",
      value: "Bill",
    },
    {
      label: "Resolution",
      value: "B",
    }

  ];


  ngOnInit() {
    // this.getMembers();
    this.presentationDates();
  }
  confirm() {
    this.presentationDates();
    const memebers = this.getBallotResultMemebers()
    const body = {
      sessionId: 19,
      assemblyId: 17,
      status: "LOTTING_CONFIRMED",
      lottingDate: this.presentation.lottingDate,
      fileId: null,
      fileNumber: null,
      fileStatus: null,
      pmbrScheduleId: this.presentation.pmbrScheduleId,
      pmbrScheduleDTO: null,
      bulletinId: null,
      pmbrBillLottingResultDto: null,
      lottingType: this.presentation.operationType,
      businessId: this.presentation.id,
      presentationDate: this.presentation.presentationDate,
      users: memebers
    }
    this.pmbrCommonService.confirmBallot(body).subscribe((res: any) => {
      this.ballotResult = res;
      this.notification.create(
        'success',
        'Success',
        'Balloting Completed!'
      );
      this.router.navigate(['business-dashboard/pmbr/ballot-view/', res.id])
    })
  }

  getBallotResultMemebers() {
    let reutnValue = []
    this.performList.forEach((element) => {
      reutnValue.push(element.userId);
    });
    return reutnValue;
  }

  cancel() { }
  cancle() {
    this.showballot = false;

  }
  getPerformList() {
    const body = {
      presentationDate: this.presentation.presentationDate
    }
    this.pmbrCommonService.getPerformList(body).subscribe((res: any) => {
      this.performList = res;
      this.performList.forEach((element) => {
        this.usersList.push(element.userId)
      });
      this.resultBallot = true;
    })
  }
  getMember() {
    const body = {
      // presentationDate: "2021-02-22"
      presentationDate: this.presentation.presentationDate
    }
    this.pmbrCommonService.getMembers(body).subscribe((res: any) => {
      this.ballotList = this.tempBallotList = res;

    });
  }
  presentationDates() {
    const body = {
      ballotingDate: this.today,
      ballotingType: "BILL"
    }
    this.pmbrCommonService.presentationDates(body).subscribe((res: any) => {
      this.billPresentationDates = res;
      // this.billPresentationDates = res;
      // this.billPresentationDates = this.bills.filter(element => element.subtype === this.subTypes);
    })
  }

  presentDates() {
    this.getMember();
    if (this.presentation.lottingStatus == 'LOTTING_PENDING') {
      this.conformButton = true;
      this.performbutton = true;
    }
    else {
      this.conformButton = false;
      this.performbutton = false;
    }
  }

  resubmitFile() {
    const body = {
      pmBillId: this.id,
      fileForm: {
        fileId: this.fileId,
        activeSubTypes: ["PMBR_SCHEDULE_LOTTING_RESULT"],
        type: "PMBR",
        userId: this.user.userId,
        subtype: "PM_BILL",

      }

    }
    this.pmbrCommonService.attachToFile(body).subscribe((Res: any) => {
      this.notification.success(
        "Success",
        "File Resubmitted Successfully"
      );
      this.router.navigate(['business-dashboard/pmbr/file-view/', Res.fileResponse.fileId]);
    });
  }
}
