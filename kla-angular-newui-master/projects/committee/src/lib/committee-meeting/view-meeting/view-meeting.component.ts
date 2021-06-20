import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { differenceInCalendarDays, parseISO } from 'date-fns';
import { CommitteeService } from '../../shared/services/committee.service';
import { CommitteecommonService } from '../../shared/services/committeecommon.service';
import { FileServiceService } from '../../shared/services/file-service.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'committee-view-meeting',
  templateUrl: './view-meeting.component.html',
  styleUrls: ['./view-meeting.component.css']
})
export class ViewMeetingComponent implements OnInit {
  noticeId: any = null;
  meetingId: any = null;
  meetingDetails: any = null;
  @Input() isFileView  = false;
  @Input() fileMeetingDetails: any;
  @Input() meetingid;
  today: any = new Date();
  user;
  CommitteeMeetingNoticeModel = false;
  meetingNoticeTitle = '';
  isMeetingLetter = false;
  isMeetingNotice = false;
  SupportingDocModel = false;
  supportDocTitle = '';
  viewLink = false;
  editMode = false;
  validateForm: FormGroup;
  typesofVenues: any;
  fileStatus: any;
  assignee: any;
  @Output() updatedMeeting = new EventEmitter<any>();
  permissions: any = {
    fullEdit: false,
    chairmanEdit: false,
    requestConsent: false,
    pendingNotice: false,
  };
  showMeetingPopup = false;
  meetingCompleted = false;
  typesofAgenda: any = [];
  temptypesofAgenda: any = [];
  selectedCommittee: any = [];
  selectedAgendas: any = [];
  buttons: any = {
    staffAllocation: false,
    supprtingDocs: false,
    questionairre: false
  };
  specialMemberList: any = [];
  viewConsemtMembers = false;
  isRequestConsent = true;
  isConsentRequest = false;
  giveConsentForm: FormGroup;
  sessionTime;
  consentStatus = '';
  constructor(private route: ActivatedRoute,
              private committeeService: CommitteeService, private router: Router,
              private notification: NzNotificationService, private activeRoute: ActivatedRoute,
              @Inject('authService') private AuthService,  public common: CommitteecommonService,
              private fileService: FileServiceService,
              private fb: FormBuilder) {
              if (!this.isFileView) {
                this.noticeId = this.route.snapshot.params.id;
              }
              this.user = AuthService.getCurrentUser();
              this.common.setCommitteePermissions(this.user.rbsPermissions); }

  ngOnInit() {
    this.formValidation();
    this.formvalidation();
    this.loadPermissions();
    if (this.noticeId && !this.isFileView) {
      this.getMeetingDetails();
    } else if (this.isFileView) {
      this.meetingDetails = this.fileMeetingDetails;
      if (this.meetingDetails.consents.length > 0) {
        this.isRequestConsent = false;
      }
      this.getFilePool();
      this.setFormValues();
    }
  }
  formValidation(): void {
    this.validateForm = this.fb.group({
      agendaTypeArray: this.fb.array([
          this.initAgendaArray()
        ]),
      addCommitte: [null],
      meetingTittle: [null, [Validators.required]],
      meetingAgenda: [null, [Validators.required]],
      venueType: [null, [Validators.required]],
      checked: [false, [Validators.required]],
      sessionType: [null],
      reportDate: [null],
      sessionDate: [null],
      sessionTime: [null]
    });
  }

  initAgendaArray() {
    return this.fb.group({
      agendatype: this.fb.control(null, Validators.required),
      billtype: this.fb.control(null, Validators.required),
      businessListing: this.fb.control([]),
      tempBusinessListing: this.fb.control([]),
      selectedBusiness: this.fb.control([]),
    });
  }

  getMeetingDetails() {
    this.committeeService.getMeetingByNoticeId(this.noticeId).subscribe((res: any) => {
      this.meetingDetails = res;
      this.setFormValues();
      if (this.meetingDetails.fileNumber) {
        this.getFilePool();
      }
      if (differenceInCalendarDays(parseISO(this.meetingDetails.date), this.today) <= 0) {
        this.meetingCompleted = true;
      }
      if (this.meetingDetails.type === 'EVIDENCE_TAKING') {
        this.showButtons();
      }
      if (this.meetingDetails.conscent) {
      this.meetingDetails.consents.forEach(element => {
        element.members.forEach(data => {
        if (data.member.userId === this.user.userId) {
          this.consentStatus = data.status;
      }
    });
    });
  }
    });
  }

  setFormValues() {
    this.validateForm.patchValue({
      meetingAgenda: this.meetingDetails.agendaDescription,
      meetingTittle: this.meetingDetails.title,
      sessionType: this.meetingDetails.occasion,
      venueType: this.meetingDetails.venue.id,
      checked: this.meetingDetails.isJointMeeting
    });
    if (this.meetingDetails.reportdate) {
      this.validateForm.patchValue({
        reportDate: parseISO(this.meetingDetails.reportdate),
      });
    }
    if (this.meetingDetails.date) {
      this.validateForm.patchValue({
        sessionDate: parseISO(this.meetingDetails.date),
      });
    }
    if (this.meetingDetails.time) {
      this.validateForm.patchValue({
        sessionTime: parseISO(this.meetingDetails.time),
      });
    }
  }

  getFilePool() {
    this.fileService
    .getFileById(this.meetingDetails.fileId, this.user.userId)
    .subscribe((Response: any) => {
      this.fileStatus = Response.fileResponse.status;
      this.fileService
      .checkWorkFlowStatus(Response.fileResponse.workflowId)
      .subscribe((Res: any) => {
        const current = Res[Res.length - 1];
        this.assignee = current.assignee;
      });
    });
  }

  goToMinutes() {
    if (this.meetingDetails.fileNumber == null ) {
      this.notification.warning('Sorry', 'Can\'t do it now ....Please attach Meeting to File!');
    } else if (this.fileStatus !== 'APPROVED') {
      this.notification.success(
        'Warning',
        'Cannot create now as the file is under approval flow'
      );
    } else {
      this.router.navigate(['create-minute'], {
        relativeTo: this.activeRoute.parent,
        state: {
          fileId: this.meetingDetails.fileId,
          fileNumber: this.meetingDetails.fileNumber,
          meetingId: this.meetingId,
          title: this.meetingDetails.title,
          committee: this.meetingDetails.committee
        }
        });
    }
  }

  goToMinuteView() {
    this.router.navigate(['minute-view', this.meetingId], {
      relativeTo: this.activeRoute.parent
      });
  }

  gotoSpecialInvitee(purpose){
    // if(this.meetingDetails.fileId == "" || this.meetingDetails.fileNumber ==null ){
    //   this.notification.warning("Sorry","Can't do it now ....Please attach Meeting to File!");
    //   return;
    // }
    this.router.navigate(['/business-dashboard/committee/invitee', purpose, this.meetingId]);
  }
  gotoStaffAllocation(purpose){
    if (this.meetingDetails.fileId === '' || this.meetingDetails.fileNumber === null ) {
      this.notification.warning('Sorry', 'Can\'t do it now ....Please attach Meeting to File!');
      return;
    }
    this.router.navigate(['/business-dashboard/committee/staff-allocation', purpose, this.meetingId]);
  }

  showMinuteButton() {
    if (this.meetingDetails) {
      return differenceInCalendarDays(parseISO(this.meetingDetails.date), this.today) <= 0;
    }
  }
  viewLinks() {
    this.viewLink = !this.viewLink;
  }
  createQuestionnaire() {
    if (this.meetingDetails.fileId === '' || this.meetingDetails.fileNumber == null ) {
      this.notification.warning('Sorry', 'Can not done now...Please attach Meeting to File!');
    } else if (this.fileStatus !== 'APPROVED') {
      this.notification.success(
        'Warning',
        'Cannot create now as the file is under approval flow'
      );
    } else {
      this.router.navigate(['create-questionnaire'], {
        relativeTo: this.route.parent,
        state: {
          meetingId: this.meetingId,
          title: this.meetingDetails.title,
          date: this.meetingDetails.date,
          fileId: this.meetingDetails.fileId,
          fileNumber: this.meetingDetails.fileNumber
        }
      });
    }
  }

  showCommitteeMeetingNotice(action) {
   if (this.checkFileStatus()) {
    this.CommitteeMeetingNoticeModel = action;
    this.isMeetingNotice = true;
   }
  }
  showCommitteeMeetingLetter(action) {
    if (this.checkFileStatus()) {
     this.CommitteeMeetingNoticeModel = action;
     this.isMeetingLetter = true;
    }
   }
   createCommitteeMeetingNoticeorLetter(type) {
    this.fileService
        .getFileById(this.meetingDetails.fileId, this.user.userId)
        .subscribe((res: any) => {
          if (res.fileResponse.status === 'APPROVED') {
    const body = {
      meetingId: this.meetingId,
      correspondenceId: null,
      title: this.meetingNoticeTitle,
    };
    if (type === 'notice') {
    this.committeeService.createMeetingNotice(body).subscribe((Response) => {
      this.notification.success('Success', 'Success');
      this.showCommitteeMeetingNotice(false);
      this.router.navigate([
        'business-dashboard/committee/file-view/',
        this.meetingDetails.fileId,
      ]);
    });
  } else {
    this.committeeService.createMeetingLetter(body).subscribe((Response) => {
      this.notification.success('Success', 'Success');
      this.showCommitteeMeetingNotice(false);
      this.router.navigate([
        'business-dashboard/committee/file-view/',
        this.meetingDetails.fileId,
      ]);
    });
  }

  } else{
    this.notification.warning('Sorry..', 'Can\'t do it now ....File is under Flow');
  }
  });
  }
checkFileStatus() {
  let fileStatus = true;
  if (this.meetingDetails.fileId === '' || this.meetingDetails.fileNumber == null ) {
    this.notification.warning('Sorry', 'Can\'t do it now .....Please attach Meeting to File!');
    fileStatus = false;
  } else {
    fileStatus = true;
  }
  return fileStatus;
}
goback() {
  window.history.back();
}
viewCommitteeMeetingNoticeorLetter(meetingDetails, category) {
  let corresId;
  let fileId;
  if (category === 'letter') {
    corresId = meetingDetails.meetingLetter.correspondenceId;
    fileId = meetingDetails.meetingLetter.fileId;
  } else {
    corresId = meetingDetails.meetingNotice[0].correspondenceId;
    fileId = meetingDetails.meetingNotice[0].fileId;
  }
  if (corresId) {
    this.router.navigate([
      'business-dashboard/correspondence/correspondence',
      'view',
      corresId,
    ]);
  } else {
    this.router.navigate([
      'business-dashboard/committee/file-view/',
      fileId
    ]);
  }
}
showSupportingDoc(action) {
  if (this.checkFileStatus()) {
    this.SupportingDocModel = action;
   }
}
createLetterForSupportDoc() {
  this.fileService
  .getFileById(this.meetingDetails.fileId, this.user.userId)
  .subscribe((res: any) => {
  if (res.fileResponse.status === 'APPROVED') {
    const body = {
      meetingId: this.meetingId,
      correspondenceId: null,
      title: this.supportDocTitle,
    };
    this.committeeService.createSupportingDoc(body).subscribe((Response) => {
      this.notification.success('Success', 'Success');
      this.showCommitteeMeetingNotice(false);
      this.router.navigate([
        'business-dashboard/committee/file-view/',
        this.meetingDetails.fileId,
      ]);
    });
  }
  });
}
isMeetingStarted() {
  let started = false;
  if (this.meetingDetails) {
    let today = new Date();
    var curtime = today.getHours() + ':' + today.getMinutes();
    var curdate = today.toISOString().split('T')[0];
    let meetigDate = new Date(this.meetingDetails.time);
    var meetingTime = meetigDate.getHours() + ':' + meetigDate.getMinutes();
    const getTime = (time) =>
      new Date(2019, 9, 2, time.substring(0, 2), time.substring(3, 5), 0, 0);
    let res = getTime(curtime) > getTime(meetingTime);
    if (this.meetingDetails.date <= curdate && res) {
      started = true;
    } else {
      started = false;
    }
  }
  return started;
}
gotoBillView(id) {
  // this.router.navigate([
  //   "business-dashboard/bill/add-clauses",id
  // ]);
}
createSuggestions(businessId,subagenda) {
  this.router.navigate([
    'business-dashboard/committee/add-clauses', businessId
  ]
  ,
  {
    state: {
      meetingInfo : this.meetingDetails,
      subagenda : subagenda,
    }  
  });
}

edit() {
  this.typeAgenda();
  this.typesofVenue();
  this.setFormValues();
  this.editMode = !this.editMode;
}

disabledDate = (current: Date): boolean => {
  return differenceInCalendarDays(current, this.today) < 0;
}

typeAgenda() {
  this.committeeService.agendaType().subscribe((Response) => {
    this.typesofAgenda = Response;
    this.temptypesofAgenda = Response;
    this.setAgendaFormArrayValues();
  });
}

typesofVenue() {
  this.committeeService.venueType().subscribe((Response) => {
    this.typesofVenues = Response;
  });
}

updateMeet() {
  // tslint:disable-next-line: forin
  for (const i in this.validateForm.controls) {
    this.validateForm.controls[i].markAsDirty();
    this.validateForm.controls[i].updateValueAndValidity();
  }
  if (this.validateForm.valid) {
  const busIds = [];
  const committees = [];
  this.meetingDetails.committee.forEach((element) => {
    committees.push({id: element.id,
                    parentCommittee: element.parentCommittee,
                    operationType: '',
                    metCommitteeId: element.metCommitteeId});
  });
  const subAgendaArray = [];
  this.meetingDetails.subAgenda.forEach((x) => {
    const subAgendaBusinessArray = [];
    x.subAgendaBusiness.forEach(y => {
        subAgendaBusinessArray.push({
              id: y.id,
              businessId: y.businessId,
              businessNumber: y.businessNumber,
              businessTitle: y.businessTitle,
              operationType: '',
              forwardedBusinessId: y.forwardedBusinessId
            });
        busIds.push(y.id);
      });
    subAgendaArray.push(
      {
        agendaType: {
          id: x.agendaType.id
        },
        subAgendaBusiness: subAgendaBusinessArray,
        id: x.id,
        operationType: ''
      }
    );
  });
  const body = {
    agendaDescription: this.validateForm.value.meetingAgenda,
    committee: committees,
    date: this.validateForm.value.sessionDate,
    id: this.meetingDetails.id,
    isJointMeeting: this.validateForm.value.checked,
    occasion: this.validateForm.value.sessionType,
    reportdate: this.validateForm.value.reportDate,
    subAgenda: subAgendaArray,
    time: this.validateForm.value.sessionTime,
    title: this.validateForm.value.meetingTittle,
    venue: {
      id: this.validateForm.value.venueType
    }
  };
  this.committeeService.updateMeeting(body).subscribe((Response) => {
    this.notification.create(
      'success',
      'Success',
      'Meeting Updated Successfully!'
    );
    this.editMode = !this.editMode;
    if (this.isFileView) {
      this.updatedMeeting.emit();
    } else {
      this.getMeetingDetails();
    }
  });
} else {
  this.notification.create(
    'warning',
    'Warning',
    'Please fill in the required fields!'
  );
}
}

viewQuestionnaire(id) {
  this.router.navigate([
    'business-dashboard/committee/questionnaire-view/',
    id
  ]);
}

loadPermissions() {
  if (this.common.doIHaveAnAccess('MEETING_FULL_EDIT', 'UPDATE')) {
    this.permissions.fullEdit = true;
  }
  if (this.common.doIHaveAnAccess('MEETING_CHAIRMAN_EDIT', 'UPDATE')) {
    this.permissions.chairmanEdit = true;
    this.validateForm.get('sessionType').setValidators([Validators.required]);
    this.validateForm.get('reportDate').setValidators([Validators.required]);
    this.validateForm.get('sessionTime').setValidators([Validators.required]);
    this.validateForm.get('sessionDate').setValidators([Validators.required]);
  }
  if (this.common.doIHaveAnAccess('REQUEST_CONSENT', 'CREATE')) {
    this.permissions.requestConsent = true;
  }
  if (this.common.doIHaveAnAccess('PENDING_MEETING_NOTICES', 'APPROVE')) {
    this.permissions.pendingNotice = true;
  }
}

creatFollowUpMeeting() {
  if (this.fileStatus !== 'APPROVED') {
    this.notification.success(
      'Warning',
      'Cannot create now as the file is under approval flow'
    );
  } else {
    this.showMeetingPopup = true;
  }
}

closeMeetingPopup() {
  this.showMeetingPopup = false;
}

resubmitFile(id) {
  const fileReqbody = {
    meetingId: id,
    fileForm: {
      activeSubTypes: ['COMMITTEE_MEETING'],
      fileId: this.meetingDetails.fileId,
      subtype: 'COMMITTEE_MEETING',
      type: 'COMMITTEE_MEETING',
      userId: this.user.userId,
    },
  };
  this.fileService
  .reSubmitFile(fileReqbody)
  .subscribe((Res: any) => {
    this.notification.success(
      'Success',
      'Attached to File Successfully'
    );
    this.router.navigate([
      'business-dashboard/committee/file-view/',
      this.meetingDetails.fileId,
    ]);
  });
}

get formArr() {
  return this.validateForm.get('agendaTypeArray') as FormArray;
}

addAgendaType() {
  this.formArr.push(this.initAgendaArray());
}

filterBills(i) {
  if (this.formArr.controls[i].value.selectedBusiness.length > 0 &&
    this.formArr.controls[i].value.selectedBusiness[0].joinCommittes.length > 0) {
    this.validateForm.patchValue({
      checked: true
    });
  } else {
    this.validateForm.patchValue({
      checked: false
    });
  }
  this.selectedCommittee = [];
  if (this.formArr.controls[i].value.selectedBusiness.length > 0) {
    this.selectedCommittee.push(this.formArr.controls[i].value.selectedBusiness[0].parentCommittee);
    if (this.formArr.controls[i].value.selectedBusiness[0].joinCommittes.length > 0) {
      this.formArr.controls[i].value.selectedBusiness[0].joinCommittes.forEach(element => {
        this.selectedCommittee.push(element);
      });
    }
  }
  this.formArr.controls[i].get('billtype').reset();
  this.getListOfBusiness(this.formArr.controls[i].value.agendatype, this.selectedCommittee.map(x => x.id), i);
}

setAgendaFormArrayValues() {
  this.meetingDetails.subAgenda.forEach((x, i) => {
    if (i > 0) {
      this.addAgendaType();
    }
    this.formArr.controls[i].patchValue({
      agendatype: x.agendaType.id
    });
    x.subAgendaBusiness.forEach((y) => {
      if (y.forwardedBusiness.status !== 'COMPLETED') {
        this.formArr.controls[i].value.selectedBusiness.push({
          refernceTitle: y.businessTitle,
          parentCommitteeId: this.meetingDetails.committee.find(a => a.parentCommittee === true).id,
          parentCommittee: this.meetingDetails.committee.find(a => a.parentCommittee === true),
          joinCommittes: this.meetingDetails.committee.filter(a => a.parentCommittee === false),
          refrenceId: y.businessId,
          refrenceNumber: y.businessNumber,
          id: y.forwardedBusiness.id,
          operationType: '',
          existing: true
        });
      }
  });
    if ( this.formArr.controls[i].value.selectedBusiness.length > 0) {
    this.formArr.controls[i].get('billtype').clearValidators();
    }
    this.filterBills(i);
});
  this.filterAgendaType();
}

getListOfBusiness(agendaId, committeeId, i) {
  this.formArr.controls[i].value.businessListing = this.formArr.controls[i].value.tempBusinessListing = [];
  const body = {
      agendaIds: [
        agendaId
      ],
      committeeIds: committeeId,
      status: ['ASSIGEND']
    };
  this.committeeService.getAllBusiness(body).subscribe((res: any) => {
      this.formArr.controls[i].value.businessListing = res;
      this.formArr.controls[i].value.tempBusinessListing = this.formArr.controls[i].value.businessListing;
      if (this.formArr.controls[i].value.selectedBusiness &&
        this.formArr.controls[i].value.selectedBusiness.length > 0) {
        const tempIds = this.formArr.controls[i].value.selectedBusiness.map(x => x.id);
        const parentCommittee = this.selectedCommittee[0].id;
        let jointIds = [];
        this.selectedCommittee.forEach((element, index) => {
          if (index > 0) {
            jointIds.push(element.id);
          }
        });
        this.formArr.controls[i].value.businessListing =
        this.formArr.controls[i].value.tempBusinessListing.filter((element) => {
          const a = element.joinCommittes.map(x => x.id).sort();
          jointIds = jointIds.sort();
          let temp;
          if (JSON.stringify(a) === JSON.stringify(jointIds)) {
            temp = true;
          } else {
            temp = false;
          }
          if (!tempIds.includes(element.id) && element.parentCommitteeId === parentCommittee && temp) {
            return true;
          } else {
            return false;
          }
        });
      }
    });
}

filterAgendaType() {
  this.selectedAgendas = [];
  this.validateForm.value.agendaTypeArray.forEach(x => {
    if (x.agendatype) {
      this.selectedAgendas.push(x.agendatype);
    }
  });
}

removeAgendaType(i) {
  this.formArr.removeAt(i);
}

addBill(i) {
  this.formArr.controls[i].value.selectedBusiness.push(this.formArr.controls[i].value.billtype);
  this.filterBills(i);
  this.formArr.controls[i].get('billtype').clearValidators();
}

removeBill(id, i) {
  const removedBill = this.formArr.controls[i].value.selectedBusiness.find(element => element.id === id);
  if (removedBill.existing) {
    this.formArr.controls[i].value.selectedBusiness.find(element => element.id === id).operationType = 'DELETE';
  } else {
    this.formArr.controls[i].value.selectedBusiness.splice(this.formArr.controls[i].value.selectedBusiness.indexOf(removedBill), 1);
  }
  if (this.formArr.controls[i].value.selectedBusiness.length === 0 ||
    !this.formArr.controls[i].value.selectedBusiness.map(x => x.operationType).includes('')) {
    this.formArr.controls[i].get('billtype').setValidators([Validators.required]);
  }
  this.filterBills(i);
}

showButtons() {
  if (this.meetingDetails.staffAllocationId && !this.meetingDetails.supportingDocumentLetter) {
    this.buttons.supprtingDocs = true;
  }
  if (this.meetingDetails.supportingDocumentLetter) {
    this.buttons.questionairre = true;
  }
  // this.buttons.questionairre = true;
}


showConsentPopup() {
  this.getSpecialMemberInMeeting();
  }
  handlePreviewCancel() {
    this.viewConsemtMembers = false;
  }
  getSpecialMemberInMeeting() {
    this.committeeService.getSpecialMemberInMeeting(this.meetingid).subscribe(Res => {
  this.specialMemberList = Res;
  if (Res) {
    this.viewConsemtMembers = true;
  }
    });
  }
  requestConsent() {
  this.committeeService.requestConsent(this.meetingid, this.specialMemberList).subscribe((res) => {
  if (res) {
    this.notification.create('Success', 'Success', 'Consent Requested Seccessfully');
    this.viewConsemtMembers = false;
    if (this.meetingDetails.consents.length > 0) {
      this.isRequestConsent = false;
    }
  }
  });
  }
  giveConsentPopup() {
    this.giveConsentForm.patchValue({
      consentDate: this.meetingDetails.date,
      consentTime: this.meetingDetails.time
    });
    this.isConsentRequest = true;
  }
  cancelConsent() {
    this.isConsentRequest = false;
  }
  giveConsent() {
  if (this.giveConsentForm.valid) {
    const body = {
      date: this.giveConsentForm.value.consentDate,
      time: this.giveConsentForm.value.consentTime
    };
    this.committeeService.giveConsent(this.meetingId, body).subscribe(Res => {
      if (Res) {
        this.notification.create('success', 'Success', 'Consent Send succesfully');
        this.isConsentRequest = false;
      }
    });
  }
}
  formvalidation() {
    this.giveConsentForm = this.fb.group({
      consentDate: [null, [Validators.required]],
      consentTime: [null, [Validators.required]]
    });
  }
  approveMeetingNotice() {
    const body = {};
    this.committeeService.approveMeeting(body, this.noticeId).subscribe(Res => {
      if (Res) {
        this.notification.success('Success', 'Approved Successfully');
        this.getMeetingDetails();
      }
    });
  }
}
