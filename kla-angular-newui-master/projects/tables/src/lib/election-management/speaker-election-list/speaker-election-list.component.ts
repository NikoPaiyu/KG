import { DatePipe } from '@angular/common';
import { nullSafeIsEquivalent } from '@angular/compiler/src/output/output_ast';
import { Component, Inject, OnInit,Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { differenceInCalendarDays } from 'date-fns';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { CosViewComponent } from '../../shared/component/cos-view/cos-view.component';
import { ElectionService } from '../../shared/services/election.service';
import { FileServiceService } from '../../shared/services/file-service.service';
import { TablescommonService } from '../../shared/services/tablescommon.service';

@Component({
  selector: 'tables-speaker-election-list',
  templateUrl: './speaker-election-list.component.html',
  styleUrls: ['./speaker-election-list.component.css']
})
export class SpeakerElectionListComponent implements OnInit {

  speakerStatus: any = null;
  speakerStatusList: any = ['SAVED', 'SUBMITTED', 'APPROVED'];
  search = null;
  electionList: any;
  tempElectionList: any;
  colCheckboxes = [
    {id:0, label:"slNo", check:true, disable:false},
    {id:1, label:"Nomination End Date",check:true, disable:false},
    {id:2, label:"Nomination End Time",check:true, disable:false},
    {id:3, label:"Election Date",check:true, disable:false},
    {id:4, label:"Election Time",check:true, disable:false},
    {id:5, label:"CosId",check:true, disable:false},
    {id:6, label:"File Number",check:true, disable:false},
    {id:7, label:"Status",check:true, disable:false},
    {id:8, label:"Election Type",check:true, disable:false}
  ]
  permission = {
    createFile: false,
    createBulletin: false,
    createNomination: false,
    publishBulletin: false,
    viewBulletin: false,
    viewFile: false,
    createSpeakerElection: false
  };
  showFileModal = false;
  speakerElectionDetails: any = null;
  bulletin = {
    bulletinData: null,
    resubmitfileId: null,
    showBulletinPart2Popup: null,
  };
  user: any = null;
  speakerNomination = {
    showPopup: false,
    nominationDetails: null
  };
  electionType: any = null;
  viewBulletinModal = false;
  bulletinData: any = null;
  isSpkPopupVisible = false;
  createSpeakerForm: FormGroup;
  assemblySession: any = null;
  assemblyList: any = null;
  sessionList: any = null;
  disabledDate: any = null;
  disabledElectionDate: any = null;
  registerElectionType: any = null;
  assemblyId: any = null;
  dateList: any = [];

  constructor(private electionService: ElectionService,
              public commonService: TablescommonService,
              @Inject('authService') private AuthService,
              private router: Router,
              private modalService: NzModalService,
              private fileService: FileServiceService,
              private notification: NzNotificationService,
              private fb: FormBuilder,
              private datepipe: DatePipe) {
                this.user = AuthService.getCurrentUser();
                this.commonService.setTablePermissions(AuthService.getCurrentUser().rbsPermissions);
   }

  getElectionSpeakerList(){
    const body = {
      electionType: this.electionType,
      status: this.speakerStatus,
      assemblyId: this.assemblyId
    };
    this.electionService.getElectionSpeakerList(body).subscribe((res: any)=> {
     this.search = null;
     this.electionList = this.tempElectionList = res;
     this.getFilteredList();
   })
  }
  searchProtemList() {
    if (this.search) {
      this.electionList = this.tempElectionList.filter(
        (element) =>
          ((element.nominationEndDate &&
            element.nominationEndDate
              .toLowerCase()
              .includes(this.search.toLowerCase())) ||
          (element.nominationEndTime &&
            element.nominationEndTime
              .toLowerCase()
              .includes(this.search.toLowerCase())) ||
              (element.electionDate &&
                element.electionDate
                  .toLowerCase()
                  .includes(this.search.toLowerCase())) ||
                  (element.electionTime &&
                    element.electionTime
                      .toLowerCase()
                      .includes(this.search.toLowerCase())) ||
                        (element.fileNumber &&
                          element.fileNumber
                            .toLowerCase()
                            .includes(this.search.toLowerCase())) ||
                          (element.status &&
                            element.status
                            .toLowerCase()
                            .includes(this.search.toLowerCase()))) &&
                            (element.electionType === this.electionType)
                          );
    } else {
      this.getFilteredList();
    }  
  }
  disableCheckBox() {
    let count = 0;
    for (const box of this.colCheckboxes) {
      if (box.check) {
        count++;
      }
    }

    if (count === 6) {
      for (const box of this.colCheckboxes) {
        if (!box.check) {
          box.disable = true;
        }
      }
    } else {
      for (const box of this.colCheckboxes) {
        box.disable = false;
      }
    }
  }
  sort(sort: { key: string; value: string }): void {
    const data = this.tempElectionList.filter((item) => item);
    if (sort.key && sort.value) {
      this.electionList = data.sort((a, b) =>
        sort.value === "ascend"
          ? a[sort.key!].toLowerCase() > b[sort.key!].toLowerCase()
            ? 1
            : -1
          : b[sort.key!].toLowerCase() > a[sort.key!].toLowerCase()
            ? 1
            : -1
      );
    } else {
      this.electionList = data;
    }
  }
  ngOnInit() {
    this.getRbsPermissionsinList();
    this.createForm();
    this.getAssemblySession();
  }

  showLinks(id) {
    this.electionList.forEach((element) => {
      if (element.id === id) {
        element.viewLinks = true;
      } else {
        element.viewLinks = false;
      }
    });
  }

  hideLinks(id) {
    this.electionList.forEach((element) => {
      if (element.id === id) {
        element.viewLinks = false;
      }
    });
  }

  showCreateFileModal(list) {
    this.showFileModal = true;
    this.speakerElectionDetails = list;
  }

  hideFileModal() {
    this.showFileModal = false;
    this.speakerElectionDetails = null;
  }
  
  getRbsPermissionsinList() {
    if (this.commonService.doIHaveAnAccess('FILE', 'CREATE')) {
      this.permission.createFile = true;
    }
    if (this.commonService.doIHaveAnAccess('CREATE_BULLETIN', 'CREATE')) {
      this.permission.createBulletin = true;
    }
    if (this.commonService.doIHaveAnAccess('CREATE_ELECTION_NOMINATION', 'CREATE')) {
      this.permission.createNomination = true;
      this.speakerStatus = 'APPROVED';
    }
    if (this.commonService.doIHaveAnAccess('PUBLISH_BULLETIN', 'CREATE')) {
      this.permission.publishBulletin = true;
    }
    if (this.commonService.doIHaveAnAccess('CREATE_BULLETIN', 'READ')) {
      this.permission.viewBulletin = true;
    }
    if (this.commonService.doIHaveAnAccess('FILE', 'READ')) {
      this.permission.viewFile = true;
    }
    if (this.commonService.doIHaveAnAccess('CREATE_SPEAKER_ELECTION', 'CREATE')) {
      this.permission.createSpeakerElection = true;
    }
  }
  viewFile(id) {
    this.router.navigate(['business-dashboard/tables/file-view', 'election', id]);
  }
  showCOS(id) {
    this.modalService.create({
      nzTitle: 'COS Preview',
      nzContent: CosViewComponent,
      nzClosable: true,
      nzFooter: null,
      nzMaskClosable: false,
      nzComponentParams: {
        calendarSittingId: id,
      }
    });
  }

  createBulletinPart2(data) {
    let electionType = null;
    if (this.registerElectionType === 'SPEAKER') {
      electionType = 'SPEAKER_ELECTION_NOMINATION';
    } else {
      electionType = 'DEPUTY_SPEAKER_NOMINATION';
    }
    this.bulletin.bulletinData = {
      businessId: data.id,
      businessType: electionType,
      description: '',
      fileId: data.fileId,
      part: '2',
      title: '',
      type: 'ELECTION',
      userId: this.user.userId,
      assemblyId: null,
      sessionId: null
    };
    this.bulletin.resubmitfileId = data.fileId;
    this.fileService.getFileByElectionFileId(data.fileId, this.user.userId).subscribe((res: any) => {
      if (res.fileResponse.status === 'APPROVED') {
        this.bulletin.showBulletinPart2Popup = true;
      } else {
        this.modalService.create({
          nzTitle: 'Create Bulletin Part 2',
          nzWidth : '500',
          nzContent: '&nbsp;&nbsp;<b>Currently file is under approval flow..Cannot create bulletin now... </b>',
          nzOkText: 'OK',
          nzOnOk: () => {},
        });
      }
    });
  }

  afterCreateBulletin(event) {
    if (event) {
      this.notification.success('Success', 'Bulletin Created.');
      this.resubmitFile();
    }
    this.cancelBulletin();
  }

  resubmitFile() {
    const body = {
      fileForm: {
        fileId: this.bulletin.resubmitfileId,
        activeSubTypes: ['BULLETIN'],
        type: 'BULLETIN',
        userId: this.user.userId,
      }
    };
    this.fileService.resubmitProtemFile(body).subscribe((Res: any) => {
     this.viewFile(this.bulletin.resubmitfileId);
    });
  }

  cancelBulletin() {
    this.bulletin.showBulletinPart2Popup = false;
    this.bulletin.bulletinData = {};
  }

  createNominationPopup(data) {
    this.speakerNomination.showPopup = true;
    this.speakerNomination.nominationDetails = data;
  }

  cancelNomination() {
    this.speakerNomination.showPopup = false;
    this.speakerNomination.nominationDetails = null;
  }

  viewNominations(id) {
    this.router.navigate(['/business-dashboard/tables/election/nomination-list', id]);
  }

  getFilteredList() {
    if (this.electionType) {
      this.electionList = this.tempElectionList.filter(x => x.electionType === this.electionType);
    } else {
      this.electionList = this.tempElectionList;
    }
  }

  viewBulletin(id) {
    this.electionService.getBulletinById(id).subscribe((res: any) => {
      this.viewBulletinModal = true;
      this.bulletinData = res;
    });
  }

  hidePreview() {
    this.viewBulletinModal = false;
    this.bulletinData = null;
  }

  publishBulletin() {
    this.electionService.publishBulletin(this.bulletinData.id).subscribe((res => {
      this.notification.success('Success', 'Bulletin Published Successfully.');
      this.viewBulletin(this.bulletinData.id);
    }));
  }

  showSpeakerElectionPopup(type) {
    this.isSpkPopupVisible = true;
    this.registerElectionType = type;
    this.createForm();
    this.nominationDateValidation();
  }

  createForm() {
    this.createSpeakerForm = this.fb.group({
      assemblyId: [null, Validators.required],
      sessionId: [null, Validators.required],
      cosId: [null],
      nominationEndDate: [null, Validators.required],
      nominationEndTime: [null, Validators.required],
      electionDate: [null, Validators.required],
      electionTime: [null, Validators.required]
    });
  }

  getAssemblySession() {
    this.commonService.getAllAssemblyandSession().subscribe((Response: any) => {
      if (Response) {
        this.assemblyId = Response.activeAssemblySession.assemblyId;
        this.getElectionSpeakerList();
        this.assemblySession = Response.assemblySession;
        this.assemblyList = Response.assembly;
        this.getSessionList();
      }
    });
  }

  getSessionList() {
    if (this.createSpeakerForm.controls.sessionId) {
      this.createSpeakerForm.controls.sessionId.reset();
    }
    if (this.createSpeakerForm.value.assemblyId &&
      this.assemblySession.find(x => x.id === this.createSpeakerForm.value.assemblyId)) {
        this.sessionList = this.assemblySession.find(x => x.id === this.createSpeakerForm.value.assemblyId).session;
    } else {
      this.sessionList = [{
        id: 0,
        sessionId: 'No Session',
      }];
    }
  }

  OnAssemblySessionChange() {
    if (this.createSpeakerForm.value.assemblyId && this.createSpeakerForm.value.sessionId) {
      this.commonService.getCOSId(this.createSpeakerForm.value.assemblyId, this.createSpeakerForm.value.sessionId).subscribe((res: any) => {
        if (res.calendarofSittingId === 0) {
          this.createSpeakerForm.patchValue({
            cosId: null
          });
          this.notification.warning('Warning.', 'No COS found for selected assembly and session. Please create COS to continue!');
        } else {
         this.createSpeakerForm.patchValue({
           cosId: res.calendarofSittingId
         });
        }
      });
    }
  }

  getCOSDates() {
    if (this.createSpeakerForm.value.assemblyId && this.createSpeakerForm.value.sessionId) {
      this.commonService.getDates(this.createSpeakerForm.value.assemblyId, this.createSpeakerForm.value.sessionId).subscribe((res: any) => {
        this.dateList = res;
      });
    }
  }


  nominationDateValidation() {
    this.disabledDate = (current: Date): boolean => {
      return (differenceInCalendarDays(current, this.createSpeakerForm.value.electionDate) >= 0
      || differenceInCalendarDays(current, new Date()) < 0);
    };
  }

  electionDateValidation() {
    this.disabledElectionDate = (current: Date): boolean => {
      const todayDate = current.getFullYear() + '-' + ('0' + (current.getMonth() + 1)).slice(-2) + '-' + ('0' + current.getDate()).slice(-2);
      return (differenceInCalendarDays(current, this.createSpeakerForm.value.nominationEndDate) <= 0)
      || !this.dateList.find(item => item === todayDate);
    };
  }

  hideModal() {
    this.isSpkPopupVisible = false;
    this.registerElectionType = null;
  }

  createSpeakerElection() {
      // tslint:disable-next-line: forin
      for (const i in this.createSpeakerForm.controls) {
        this.createSpeakerForm.controls[i].markAsDirty();
        this.createSpeakerForm.controls[i].updateValueAndValidity();
      }
      if (this.createSpeakerForm.valid) {
        const body = {
          id: null,
          cosId: this.createSpeakerForm.value.cosId ,
          nominationEndDate: this.datepipe.transform(this.createSpeakerForm.value.nominationEndDate, 'yyyy-MM-dd') ,
          nominationEndTime: this.formatTime(this.createSpeakerForm.value.nominationEndTime) ,
          electionDate: this.datepipe.transform(this.createSpeakerForm.value.electionDate, 'yyyy-MM-dd') ,
          electionTime: this.formatTime(this.createSpeakerForm.value.electionTime),
          electionType: this.registerElectionType,
          assemblyId: this.createSpeakerForm.value.assemblyId
        };
        this.electionService.createSpeakerElection(body).subscribe((res: any) => {
          this.notification.success(
            'Success',
            'Speaker Election Created Successfully!'
          );
          this.hideModal();
          this.getElectionSpeakerList();
        });
      } else if (!this.createSpeakerForm.value.cosId) {
        this.notification.warning('Warning.', 'No COS found for selected assembly and session. Please create COS to continue!');
      }
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
