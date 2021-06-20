import { DatePipe } from '@angular/common';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { differenceInCalendarDays } from 'date-fns';
import { NzNotificationService } from 'ng-zorro-antd';
import { forkJoin } from 'rxjs';
import { ElectionService } from '../../shared/services/election.service';
import { TablescommonService } from '../../shared/services/tablescommon.service';

@Component({
  selector: 'tables-view-registered-documents',
  templateUrl: './view-registered-documents.component.html',
  styleUrls: ['./view-registered-documents.component.scss']
})
export class ViewRegisteredDocumentsComponent implements OnInit {
  docId: any;
  docDetails: any;
  isPdfVisible: boolean;
  docUrl: string;
  user: any;
  assemblyList: any = [];
  sessionList: any = [];
  assembly: any = null;
  session: any = null;
  isProtemVisible = false;
  protemSpeaker: any = null;
  @Input() cabNoteDetails: any = null;
  memberList: any = null;
  permission = {
    createProtemSpeaker: false,
    createSpeakerElection: false,
  };
  isSpkVisible = false;
  createSpeakerForm: FormGroup;
  today: any = new Date();
  electionType: any = null;
  assemblySession: any;
  assemblyId: any;
  sessionId: any;
  allSession: any;

  constructor(
    private electionService: ElectionService,
    private notification: NzNotificationService,
    private router: Router,
    private commonService: TablescommonService,
    private route: ActivatedRoute,
    @Inject('authService') private AuthService,
    private fb: FormBuilder,
    public datepipe: DatePipe,
  ) {
    this.user = AuthService.getCurrentUser();
    if (this.route.snapshot.params.id) {
      this.docId = this.route.snapshot.params.id;
    }
    this.commonService.setTablePermissions(this.user.rbsPermissions);
   }

  ngOnInit() {
    this.getRbsPermissionsinList();
    this.getAssemblySession();
  }

  // getAssemblyAndSession() {
  //   // tslint:disable-next-line: deprecation
  //   forkJoin(
  //     this.commonService.getAllAssembly(),
  //     this.commonService.getAllSession()
  //   ).subscribe(([assembly, session]) => {
  //     this.assemblyList = assembly;
  //     this.assemblyList.push({
  //       id: 0,
  //       assemblyId: 'No Assembly',
  //     });
  //     this.sessionList = session;
  //     this.sessionList.push({
  //       id: 0,
  //       sessionId: 'No Session',
  //     });
  //     if (this.cabNoteDetails) {
  //       this.docDetails = this.cabNoteDetails;
  //       this.assembly = this.assemblyList.find(a => a.id === this.docDetails.assemblyId);
  //       this.session = this.sessionList.find(s => s.id === this.docDetails.sessionId);
  //     } else {
  //       this.getDocInfo();
  //     }
  //   });
  // }

  // get assembly and session list
  getAssemblySession() {
    this.commonService.getAllAssemblyandSession().subscribe((Response:any)=> {
      if(Response){
        this.assemblySession = Response.assemblySession;
        this.assemblyList = Response.assembly;
        this.allSession = Response.session;
        if (this.cabNoteDetails) {
          this.docDetails = this.cabNoteDetails;
          this.assembly = this.assemblyList.find(a => a.id === this.docDetails.assemblyId);
          this.session = this.allSession.find(s => s.id === this.docDetails.sessionId);
        } else {
          this.getDocInfo();
        }
        if(this.isSpkVisible) {
          this.getSessionList();
        }
      }
    });
  }

   // get session for assembly
  getSessionList() {
    if(this.createSpeakerForm.controls.session){
      this.createSpeakerForm.controls.session.reset();
    }
    if(this.createSpeakerForm.value.assemblyId && 
      this.assemblySession.find(x=> x.id === this.createSpeakerForm.value.assemblyId)) {
        this.sessionList = this.assemblySession.find(x => x.id === this.createSpeakerForm.value.assemblyId).session;
    } else {
      this.sessionList = [{
        id: 0,
        sessionId: 'No Session',
      }];
    }
  }

  getDocInfo() {
    this.docDetails = null;
    this.electionService.getRegDocById(this.docId).subscribe((res: any) => {
      this.docDetails = res;
      this.assembly = this.assemblyList.find(a => a.id === this.docDetails.assemblyId);
      this.session = this.allSession.find(s => s.id === this.docDetails.sessionId);
    });
  }

  showPdfModal(documentUrl) {
    this.docUrl = documentUrl;
    if (this.docUrl) {
      this.isPdfVisible = true;
    }
  }

  hideModal() {
    this.isPdfVisible = false;
    this.docUrl = '';
    this.isSpkVisible = false;
    this.electionType = null;
  }

  onBackClick() {
    window.history.back();
  }

  showProtemPopup() {
    this.getMemberList();
    // this.isProtemVisible = true;
  }

  hideProtemModal() {
    this.isProtemVisible = false;
    this.protemSpeaker = null;
  }

  createProtemSpeaker() {
    const body = {
      id: null,
      cabinateNoteAttachmentId: this.docDetails.id,
      proTemSpeakerId: this.protemSpeaker
    };
    // osDocuments: [ { id: this.docDetails.id, operation: 'UPDATE' } ],
    this.electionService.createProtemSpeaker(body).subscribe((res: any) => {
      this.notification.success(
        'Success',
        'Protem Speaker Created Successfully!'
      );
      this.hideProtemModal();
      this.router.navigate(['business-dashboard/tables/election/protem-speaker-list']);
    });
  }

  getMemberList() {
    const body= ["MEMBER","ELECTED"]
    this.electionService.getMemberList(body).subscribe((res: any) => {
      this.memberList = res;
      this.isProtemVisible = true;
    });
  }

  getRbsPermissionsinList() {
    if (this.commonService.doIHaveAnAccess('CREATE_PROTEM_SPEAKER', 'CREATE')) {
      this.permission.createProtemSpeaker = true;
    }
    if (this.commonService.doIHaveAnAccess('CREATE_SPEAKER_ELECTION', 'CREATE')) {
      this.permission.createSpeakerElection = true;
    }
  }

  showSpkElectionPopup(type) {
    this.isSpkVisible = true;
    this.electionType = type;
    this.createForm();
    this.getAssemblySession();
  }

  createSpeakerElection() {
    // tslint:disable-next-line: forin
    for (const i in this.createSpeakerForm.controls) {
      this.createSpeakerForm.controls[i].markAsDirty();
      this.createSpeakerForm.controls[i].updateValueAndValidity();
    }
    if (this.createSpeakerForm.valid && (this.createSpeakerForm.value.cosId || this.electionType === 'DEPUTY_SPEAKER')) {
      const body = {
        id: null,
        cosId: this.createSpeakerForm.value.cosId ,
        nominationEndDate: this.createSpeakerForm.value.nominationEndDate ,
        nominationEndTime: this.formatTime(this.createSpeakerForm.value.nominationEndTime) ,
        electionDate: this.createSpeakerForm.value.electionDate ,
        electionTime: this.formatTime(this.createSpeakerForm.value.electionTime) ,
        osDocuments: [{ id: this.docDetails.id, operation: 'UPDATE' }],
        osAttachmentId: this.docDetails.id,
        electionType: this.electionType,
        assemblyId: this.createSpeakerForm.value.assemblyId
      };
      this.electionService.createSpeakerElection(body).subscribe((res: any) => {
        this.notification.success(
          'Success',
          'Speaker Election Created Successfully!'
        );
        this.hideModal();
        this.router.navigate(['business-dashboard/tables/election/election-list']);
      });
    } else if (!this.createSpeakerForm.value.cosId) {
      this.notification.warning('Warning.', 'No COS found for selected assembly and session. Please create COS to continue!');
    }
  }

  OnAssemblySessionChange() {
    if (this.createSpeakerForm.value.assemblyId && this.createSpeakerForm.value.sessionId && this.electionType === 'SPEAKER') {
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
    } else if (this.electionType === 'DEPUTY_SPEAKER') {
      this.createSpeakerForm.get('assemblyId').clearValidators();
      this.createSpeakerForm.get('sessionId').clearValidators();
    }
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

  disabledDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, this.today) < 0;
  }

  disabledElectionDate = (current: Date): boolean => {
    return (differenceInCalendarDays(current, this.createSpeakerForm.value.nominationEndDate) <= 0);
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
