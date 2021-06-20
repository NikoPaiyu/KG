import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BillManagementService } from '../../shared/services/bill-management.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzNotificationService, UploadChangeParam } from 'ng-zorro-antd';
import { BillViewService } from '../shared/bill-view.service';
import { BillcommonService } from '../../shared/services/billcommon.service';
import { differenceInCalendarDays, parseISO } from 'date-fns';
import { AttachmentConfig } from '../../shared/field.interface';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'lib-registered-bill-view',
  templateUrl: './registered-bill-view.component.html',
  styleUrls: ['./registered-bill-view.component.css']
})
export class RegisteredBillViewComponent implements OnInit {

  billId;
  type;
  currentUser;
  billDetails = {
    billId: null,
    ministerId: null,
    blocks: [],
    errata: [],
    governerRecommendation: '',
    minister: '',
    department: '',
    fileNumber: '',
    subject: '',
    language: '',
    billReference: '',
    type: '',
    ordinanceDisapproved: null,
    objectedByMe: null,
    motion: null,
    generalAmendmentRaised: null,
    status: null,
    ordinance: false,
    referenceAct: [],
    title: '',
    memberInCharge: '',
    motionForLeaveTointroductionOfBill: '',
    publicationUserRule69: '',
    copiesToMember: '',
    firstReading: '',
    circulationOfOpinion: '',
    meetingOfCommittee: '',
    publicationUserRule72: '',
    referingBillToCommittee: '',
    reportPublicationOfCommitteReport: '',
    nameOfBillInSecondaryLan: '',
    secondaryLanguagePublication: '',
    billNumber: null,
    natureOfBill: null,
    sendToCommittee: false,
    sendToCommitteeMode : "",
    schedule: {
      secondReading: '',
      billIntroduction: null
    },
    stage: '',
    billTranslation : [],
    ministerMotion : false,
    directClauseByClause: false
  };
  validateForm: FormGroup;
  isEditEnable: boolean;
  disabled = true;
  language;
  showSubjectCommittee = false;
  mainCommitteeId: any = null;
  subjectData: any = [];
  activeSession: any = [];
  mapOfCheckedId: { [key: string]: boolean } = {};
  checkedCommIds = new Set<any>();
  tempSubjectData: any;
  committeeForm: FormGroup;
  viewModel: boolean;
  selectRes;
  isVisible: boolean;
  uploadURL = this.billService.uploadUrl();
  fileList: any = [];
  showUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    hidePreviewIconInNonImage: true,
  };
  attachmentDto: AttachmentConfig[] = [];
  reason;
  translation = {
    showpopUp : false,
    transData:null
  };
  selectCommitee = {
    showpopUp : false
  };
  constructor(
    private route: ActivatedRoute,
    private billService: BillManagementService,
    private fb: FormBuilder,
    private router: Router,
    private notification: NzNotificationService,
    private service: BillViewService,
    @Inject('authService') private AuthService,
    private commonService: BillcommonService
  ) {
    this.formValidation();
    this.currentUser = AuthService.getCurrentUser();
    this.billId = this.route.snapshot.params.id;
    this.type = this.route.snapshot.params.type;
    if (this.type === 'view') {
      this.isEditEnable = false;
    } else {
      this.isEditEnable = true;
    }
    this.currentUser = AuthService.getCurrentUser();
  }

  ngOnInit() {
    this.currentAssemblyAndSession();
    if (this.billId) {
      this.getBillById(this.billId);
    }
  }
  formValidation(): void {
    this.validateForm = this.fb.group({
      billId: [0, Validators.required],
      billNature: [null],
      motionForLeaveTointroductionOfBill: [null],
      publicationUserRule69: [null],
      copiesToMember: [null],
      firstReading: [null],
      circulationOfOpinion: [null],
      meetingOfCommittee: [null],
      publicationUserRule72: [null],
      referingBillToCommittee: [null],
      reportPublicationOfCommitteReport: [null],
      nameOfBillInSecondaryLan: [null],
      secondaryLanguagePublication: [null],
      directClauseByClause: [false]
    });
    this.committeeForm = this.fb.group({
      parentCommittee: [null, Validators.required],
      forwardDate: [null, Validators.required]
    });
  }

  getBillById(billId) {
    this.billService.getBillById(billId).subscribe((res) => {
      this.billDetails = res as any;
      this.validateForm.patchValue({
          billNature : this.billDetails.natureOfBill,
          motionForLeaveTointroductionOfBill : this.billDetails.motionForLeaveTointroductionOfBill,
          publicationUserRule69: this.billDetails.publicationUserRule69,
          copiesToMember: this.billDetails.copiesToMember,
          firstReading: this.billDetails.firstReading,
          circulationOfOpinion: this.billDetails.circulationOfOpinion,
          meetingOfCommittee: this.billDetails.meetingOfCommittee,
          publicationUserRule72: this.billDetails.publicationUserRule72,
          referingBillToCommittee: this.billDetails.referingBillToCommittee,
          reportPublicationOfCommitteReport: this.billDetails.reportPublicationOfCommitteReport,
          nameOfBillInSecondaryLan: this.billDetails.nameOfBillInSecondaryLan,
          secondaryLanguagePublication: this.billDetails.secondaryLanguagePublication
        });
    });
  }
  updateBill() {
    this.validateForm.get('billId').setValue(this.billDetails.billId);
    this.billService.addToRegister(this.validateForm.value ).subscribe((res) => {
      if (res) {
        this.notification.success('Success', 'Bill Updated Successfully');
        this.router.navigate([
          'business-dashboard/bill/bill-register-list'
        ]);
      }
    });
  }
  viewBill() {
    this.router.navigate([
      'business-dashboard/bill/bill-view',
      this.billId,
    ]);
  }
  editBill() {
    this.isEditEnable = true;
  }
  backToList() {
    window.history.back();
  }

  getSubjectCommitteeList() {
    const body =  {
        assemblyId: this.activeSession.assemblyId,
        categoryId: 1,
        isActive: true,
        status: 'APPROVED',
        subjectId: null
      };
    this.service.getSubjectCommitteeList(body).subscribe(Res => {
        this.subjectData = Res;
        this.tempSubjectData = this.subjectData;
      });
  }

  subjectCommittee() {
    this.getSubjectCommitteeList();
    this.committeeForm.reset();
    this.showSubjectCommittee = true;
  }

  subjectCommitteeCancel() {
    this.showSubjectCommittee = false;
  }

  subjectCommitteeOk() {
    // tslint:disable-next-line:forin
    for (const i in this.committeeForm.controls) {
        this.committeeForm.controls[i].markAsDirty();
        this.committeeForm.controls[i].updateValueAndValidity();
    }
    if (this.committeeForm.valid) {
      const body = {
        joinCommittees: [
          ...this.checkedCommIds
        ],
        parentCommitteeId: this.committeeForm.value.parentCommittee,
        forwardedDate: this.committeeForm.value.forwardDate,
        committeeCode: "SUBJECT_COMMITTEE",
      };
      // if(this.billDetails.sendToCommitteeMode == "NOT_SENT"){
      this.service.sendToCommittee(this.billId, body).subscribe((res: any) => {
        this.notification.success('Success', 'Bill Sent to Committee Successfully');
        this.getBillById(this.billId);
        this.subjectCommitteeCancel();
      });
    //  }else{
    //   this.service.sendToCommitteeOfficial(this.billId, body).subscribe((res: any) => {
    //     this.notification.success('Success', 'Bill Sent to Committee Successfully');
    //     this.getBillById(this.billId);
    //     this.subjectCommitteeCancel();
    //   });
    //  }
    }
  }

  currentAssemblyAndSession() {
    this.commonService.getCurrentAssemblyAndSession().subscribe((Res) => {
      this.activeSession = Res;
    });
  }

  onCommChecked(id: number, checked: boolean) {
    if (checked) {
      this.checkedCommIds.add(id);
    } else {
      this.checkedCommIds.delete(id);
    }
  }

  filtersubjectData() {
    if (this.committeeForm.value.parentCommittee) {
      this.subjectData = this.tempSubjectData.filter(x => x.id !== this.committeeForm.value.parentCommittee);
    }
  }
  passBill() {
    this.service.passBillByBillId(this.billId).subscribe(data => {
      this.billDetails.status = 'PASSED';
      this.notification.success('Success', 'Bill passed successfully');
    });
  }
  isBillPassable() {
    let check = true;
    const secondReadingcompleted = this.checkSecondReadingExpiry(this.billDetails.schedule);
    if(this.billDetails.type == "AP_BUDGET" || this.billDetails.type == 'AP_VOA' || this.billDetails.type == 'AP_SDG') {
      if(this.billDetails.status === 'APPROVED') {
        check = false;
        return check;
      }
    }
    if (this.billDetails.status !== 'PASSED' &&  secondReadingcompleted && this.billDetails.status === 'APPROVED') {
      check = false;
    }
    return check;
  }
  checkSecondReadingExpiry(schedule) {
    if (schedule && schedule.secondReading) {
      return differenceInCalendarDays(parseISO(schedule.secondReading), new Date()) < 0;
    }
    return false;
  }
  markAsAct() {
    this.service.markBillasAct(this.billId).subscribe(data => {
      this.getBillById(this.billId);
      this.notification.success('Success', 'Bill marked as ACT successfully');
    });
  }
  sendForGovernersRecommendation() {
    this.service.sendGovernersRecommendation({
      billId: this.billId
    }).subscribe(data => {
      this.getBillById(this.billId);
      this.notification.success('Success', 'Bill sent for Governer\'s recommendation');
    });
  }
  viewGovernerResponseModel() {
    this.viewModel = true;
  }
  cancel() {
    this.viewModel = false;
  }
  updateGovernerResponse() {
    this.viewModel = false;
    const body = {
      action: this.selectRes,
      billId: this.billId,
      docUrl: this.attachmentDto[0].attachmentUrl,
      reason: this.reason
    };
    this.service.markBillFinalStatus(body).subscribe( data => {
    });
    this.notification.success('Success', 'Updated Response successfully');
    this.getBillById(this.billId);
  }
  attachDocument() {
    this.isVisible = true;
  }
  handleChange(info: UploadChangeParam): void {
    const fileList = [...info.fileList];
    this.fileList = [];
    if (info.file.response) {
      for (const file of fileList) {
        this.fileList.push({
          name: info.file.name,
          attachmentUrl: info.file.response.body,
          type: 'ATTACHMENT',
        });
      }
    }
    this.attachmentDto = this.fileList;
    this.fileList = fileList.filter((item: any) => {
      if (item.response) {
        return item.response.status !== 'success';
      }
      return true;
    });
  }
showTranslate(trans){
    this.translation.transData = trans
    this.translation.showpopUp = true;
 }
 cancelTranslation(){
   this.translation.showpopUp = false;
   this.translation.transData = null;
 }
 generateSpekerNote(){
  this.billService.addSpeakerNote(this.billId).subscribe((res) => {

  });
 }
 showSelectCommitee(){
  this.selectCommitee.showpopUp = true;
 }
 cancelSelectCommitee(){
  this.selectCommitee.showpopUp = false;
 }
 isBillIntroDateOver(){
   let dateover = false;
   if(this.billDetails.schedule && this.billDetails.schedule.billIntroduction){
    dateover = differenceInCalendarDays(parseISO(this.billDetails.schedule.billIntroduction), new Date()) < 0
  }
   return dateover;
 }

 disabledDate = (current: Date): boolean => {
  return differenceInCalendarDays(current, new Date()) < 0;
};

}
