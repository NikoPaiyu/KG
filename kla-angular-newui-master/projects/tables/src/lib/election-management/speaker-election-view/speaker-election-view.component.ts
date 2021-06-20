import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { differenceInCalendarDays, parseISO } from 'date-fns';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { ElectionService } from '../../shared/services/election.service';
import { CosViewComponent } from '../../shared/component/cos-view/cos-view.component';
import { TablescommonService } from '../../shared/services/tablescommon.service';

@Component({
  selector: 'tables-speaker-election-view',
  templateUrl: './speaker-election-view.component.html',
  styleUrls: ['./speaker-election-view.component.scss']
})
export class SpeakerElectionViewComponent implements OnInit {
  @Input() electionDetails: any = null;
  osDocuments: any = {
    cabinateNote: null,
    spkOrder: null
  };
  editMode = false;
  updateSpeakerForm: FormGroup;
  disabledDate: any = null;
  disabledElectionDate: any = null;
  dateList: any = [];
  @Output() electionUpdated = new EventEmitter<string>();
  editElectionPermission = false;

  constructor(private router: Router,
              private modal: NzModalService,
              private fb: FormBuilder,
              public commonService: TablescommonService,
              public notification: NzNotificationService,
              private electionService: ElectionService,
              private datepipe: DatePipe,
              @Inject('authService') private AuthService) {
                this.commonService.setTablePermissions(AuthService.getCurrentUser().rbsPermissions);
               }

  ngOnInit() {
    if (this.electionDetails) {
      this.getOsDocuments();
      this.getCOSById();
      this.createForm();
    }
    if (this.commonService.doIHaveAnAccess('CREATE_SPEAKER_ELECTION', 'UPDATE')) {
      this.editElectionPermission = true;
    }
  }

  getOsDocuments() {
    this.osDocuments.cabinateNote = this.electionDetails.osDocuments.find(d => d.typeCode === 'CABINET_NOTE');
    this.osDocuments.spkOrder = this.electionDetails.osDocuments.find(d => d.typeCode === 'SPEAKER_ORDER');
  }

  viewDocs(id) {
    this.router.navigate(['business-dashboard/tables/election/view-reg-docs', id]);
  }

  showCOS() {
    this.modal.create({
      nzTitle: 'COS Preview',
      nzContent: CosViewComponent,
      nzClosable: true,
      nzFooter: null,
      nzMaskClosable: false,
      nzComponentParams: {
        calendarSittingId: this.electionDetails.cosId,
      }
    });
  }

  editElection() {
    this.editMode = true;
    this.createForm();
  }

  cancelEdit() {
    this.editMode = false;
  }

  updateElection() {
    this.editMode = false;
    // tslint:disable-next-line: forin
    for (const i in this.updateSpeakerForm.controls) {
      this.updateSpeakerForm.controls[i].markAsDirty();
      this.updateSpeakerForm.controls[i].updateValueAndValidity();
    }
    if (this.updateSpeakerForm.valid) {
        const body = {
          id: this.electionDetails.id,
          cosId: this.updateSpeakerForm.value.cosId ,
          nominationEndDate: this.datepipe.transform(this.updateSpeakerForm.value.nominationEndDate, 'yyyy-MM-dd'),
          nominationEndTime: this.formatTime(this.updateSpeakerForm.value.nominationEndTime) ,
          electionDate: this.datepipe.transform(this.updateSpeakerForm.value.electionDate, 'yyyy-MM-dd') ,
          electionTime: this.formatTime(this.updateSpeakerForm.value.electionTime),
          electionType: this.electionDetails.electionType,
          assemblyId: this.updateSpeakerForm.value.assemblyId
        };
        this.electionService.createSpeakerElection(body).subscribe((res: any) => {
          this.notification.success(
            'Success',
            'Election Updated Successfully!'
        );
          this.electionUpdated.emit();
      });
    }
  }

  createForm() {
    this.updateSpeakerForm = this.fb.group({
      assemblyId: [this.electionDetails.assemblyId],
      cosId: [this.electionDetails.cosId],
      nominationEndDate: [parseISO(this.electionDetails.nominationEndDate), Validators.required],
      nominationEndTime: [parseISO(this.electionDetails.nominationEndDate + 'T' + this.electionDetails.nominationEndTime), Validators.required],
      electionDate: [parseISO(this.electionDetails.electionDate), Validators.required],
      electionTime: [parseISO(this.electionDetails.electionDate + 'T' + this.electionDetails.electionTime), Validators.required]
    });
  }

  electionDateValidation() {
    this.disabledElectionDate = (current: Date): boolean => {
      const todayDate = current.getFullYear() + '-' + ('0' + (current.getMonth() + 1)).slice(-2) + '-' + ('0' + current.getDate()).slice(-2);
      return (differenceInCalendarDays(current, this.updateSpeakerForm.value.nominationEndDate) <= 0)
      || !this.dateList.find(item => item === todayDate);
    };
  }

  nominationDateValidation() {
    this.disabledDate = (current: Date): boolean => {
      return (differenceInCalendarDays(current, this.updateSpeakerForm.value.electionDate) >= 0
      || differenceInCalendarDays(current, new Date()) < 0);
    };
  }

  getCOSById() {
    this.commonService.getCOSById(this.electionDetails.cosId).subscribe((res: any) => {
      res.calendarOfDaysList.forEach(element => {
        this.dateList = [...this.dateList, ...element.dateList];
      });
      this.nominationDateValidation();
    });
  }

  formatTime(date) {
    let hour;
    let minutes;
    let seconds;
    if (date.getHours() < 10) {
      hour = '0' + date.getHours();
    } else {
      hour = date.getHours();
    }
    if (date.getMinutes() < 10) {
      minutes = '0' + date.getMinutes();
    } else {
      minutes = date.getMinutes();
    }
    if (date.getSeconds() < 10) {
      seconds = '0' + date.getSeconds();
    } else {
      seconds = date.getSeconds();
    }
    return hour + ':' + minutes + ':' + seconds;
  }

}
