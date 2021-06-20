import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { PmbrCommonService } from '../../shared/services/pmbr-common.service';
import { noticeDetailsDto } from '../shared/models/pmbr-resolution-model';
import { PmbrResolutionService } from '../shared/services/pmbr-resolution.service';

@Component({
  selector: 'pmbr-lotting-notice-list',
  templateUrl: './lotting-notice-list.component.html',
  styleUrls: ['./lotting-notice-list.component.css']
})
export class LottingNoticeListComponent implements OnInit {

  noticeDetails: noticeDetailsDto;
  searchPending;
  listOfNotice;
  viewLinks = false;
  acceptedStatus;
  loadCreateForm: boolean;
  showHideCreateNotice: boolean;
  noticeId: any;
  isView: boolean = false;
  showHideViewNotice: boolean;
  user: any;
  modelTitle: string;
  submittedNotices: any = [];
  acceptedNotices: any = [];
  allNotices: any = [];
  submitStatus;
  soLogin;
  assemblyId = null;
  sessionId = null;
  sessionList: any = [];
  assemblyList: any = [];
  ppo;
  mla;
  listOfMyNotice: any = [];
  tempListOfMyNotices: any = [];
  search;
  idValue;
  tempListOfNotice: any = [];
  tempSubmittedNotices: any = [];
  tempAcceptedNotices: any = [];
  searchSubmitted;
  assemblySession: any;
  permissions={
    balloting: false
  }

  constructor(private notification: NzNotificationService,
    private pmbrService: PmbrResolutionService,
    private common: PmbrCommonService,
    private router: Router,
    @Inject("authService") private AuthService,) {
    this.user = AuthService.getCurrentUser();
    this.common.setPermissions(this.user.rbsPermissions);
    if (this.user.authorities.includes('sectionOfficer')) {
      this.soLogin = true;
    }
    if (this.user.authorities.includes('MLA')) {
      this.mla = true;
    }
    if (this.user.authorities.includes('parliamentaryPartySecretary')) {
      this.ppo = true;
    }
    // if (this.user.authorities.includes('deputySecretary')) {
    //   this.ballot = true;
    // }
  }

  ngOnInit() {
    this.getRbsPermissions();
    this.getAssemblyandSession();
  }

  // get permissions
  getRbsPermissions() {
    if(this.common.doIHaveAnAccess('BALLOTING', 'CREATE')) {
      this.permissions.balloting= true;
    }
  }

  //get all assembly and session
  getAssemblyandSession() {
    this.common.getAllAssemblyAndSession().subscribe((Res: any) => {
      this.assemblyList = Res.assembly;
      this.assemblySession = Res.assemblySession;
      this.assemblyId = Res.activeAssemblySession.assemblyId;
      this.getSessionForAssembly();
      this.sessionId = Res.activeAssemblySession.sessionId;
      this.getNoticeList();
      this.getMYNoticeList();
    });
  }

  //get session for assembly
  getSessionForAssembly() {
    this.sessionList = []; 
      if (this.assemblyId && this.assemblySession.find(x => x.id === this.assemblyId)) {
        this.sessionId = null;
        this.sessionList = this.assemblySession.find(x => x.id === this.assemblyId).session;
      }
  }

  // get lotting notice list
  getNoticeList() {
    let body = {
      assemblyId: this.assemblyId,
      noticeType: "PMR_LOT_REQUEST",
      pmResolutionId: 0,
      resolutionDate: null,
      sessionId: this.sessionId,
      stage: null,
      status: null
    }
    this.submitStatus = 'SUBMITTED';
    this.acceptedStatus = 'APPROVED';
    this.pmbrService.getAllNotice(body).subscribe(res => {
      if (res) {
        this.listOfNotice = res;
        this.listOfNotice = this.tempListOfNotice = res;
        this.submittedNotices = this.listOfNotice.filter(element => element.status === this.submitStatus);
        this.tempSubmittedNotices =  this.listOfNotice.filter(element => element.status === this.submitStatus);
        this.acceptedNotices = this.listOfNotice.filter(element => element.status === this.acceptedStatus);
        this.tempAcceptedNotices = this.listOfNotice.filter(element => element.status === this.acceptedStatus);
      }
    });
  }
  getMYNoticeList() {
    let body = {
      assemblyId: this.assemblyId,
      noticeType: "PMR_LOT_REQUEST",
      pmResolutionId: 0,
      resolutionDate: null,
      sessionId: this.sessionId,
      stage: null,
      status: null,
      createdBy: this.user.userId
    }
    this.pmbrService.getAllNotice(body).subscribe(res => {
      if (res) {
        this.listOfMyNotice = res;
        this.listOfMyNotice = this.tempListOfMyNotices = res
      }
    });
  }

  createNotice() {
    this.modelTitle = 'Create Lotting Notice';
    this.showHideCreateNotice = true;
    this.isView = false;
    this.noticeDetails = null
  }
  viewNotice(id) {
    this.showHideViewNotice = true;
    this.noticeId = id;
  }
  editNotice(data) {
    this.modelTitle = 'Edit Lotting Notice'
    this.noticeId = data.id;
    this.noticeDetails = {
      pmResolutionId: null,
      noticeId: data.id,
      status: data.status,
    }
    this.showHideCreateNotice = true;
  }
  onCancel() {
    this.showHideCreateNotice = false;
    this.showHideViewNotice = false;
  }
  filtering() {

  }
  saveNotice(event) {
    this.getNoticeList();
    this.getMYNoticeList();
    this.showHideCreateNotice = false;
    this.onCancel();
  }
  submittedNotice(event){
    this.getNoticeList();
    this.getMYNoticeList();
    this.showHideViewNotice = false;
    this.onCancel();
  }
  showLinks(id) {
    this.listOfNotice.forEach(element => {
      if (element.id === id) {
        element.viewLinks = true;
      } else {
        element.viewLinks = false;
      }
    });
  }
  showMyLinks(id) {
    this.listOfMyNotice.forEach(element => {
      if (element.id === id) {
        element.viewLinks = true;
      } else {
        element.viewLinks = false;
      }
    });
  }
  hideNoticeView(event) {
    this.getNoticeList();
    this.onCancel();
  }
  isMember() {
    if( this.user.authorities.includes("minister")) {
      return false;
    }
    return (this.user.authorities.includes("MLA"));
  }
  isPPO() {
    return (
      this.AuthService.getCurrentUser().authorities.includes('ppo') ||
      this.AuthService.getCurrentUser().authorities.includes(
        'parliamentaryPartySecretary'
      )
    );
  }
  balloting() {
    this.router.navigate(["business-dashboard/pmbr/resolution-balloting"]);
  }
  searchNoticeList() {
    if (this.search) {
      this.acceptedNotices = this.tempAcceptedNotices.filter(
        (element) =>
          (element.subject &&element.subject.toLowerCase().includes(this.search.toLowerCase())) ||
          (element.sessionId && element.sessionId.toString().includes(this.search.toLowerCase())) ||
          (element.resolutionDate && element.resolutionDate.toLowerCase().includes(this.search.toLowerCase())) ||
          (element.status &&element.status.toLowerCase().includes(this.search.toLowerCase()))
      );
    } else {
      this.acceptedNotices = this.tempAcceptedNotices;
    }
    if (this.searchSubmitted) {
      this.submittedNotices = this.tempSubmittedNotices.filter(
        (element) =>
          (element.subject && element.subject.toLowerCase().includes(this.searchSubmitted.toLowerCase())) ||
          (element.sessionId && element.sessionId.toString().includes(this.search.toLowerCase())) ||
          (element.resolutionDate && element.resolutionDate.toLowerCase().includes(this.search.toLowerCase())) ||
          (element.status &&element.status.toLowerCase().includes(this.searchSubmitted.toLowerCase()))
      );
    } else {
      this.submittedNotices = this.tempSubmittedNotices;
    }
  }
  searchMyNoticeList() {
    if (this.search) {
      this.listOfMyNotice = this.tempListOfMyNotices.filter(
        (element) =>
          (element.subject && element.subject.toLowerCase().includes(this.search.toLowerCase())) ||
          (element.sessionId && element.sessionId.toString().toLowerCase().includes(this.search.toLowerCase())) ||
          (element.resolutionDate && element.resolutionDate.toLowerCase().includes(this.search.toLowerCase())) ||
          (element.status &&element.status.toLowerCase().includes(this.search.toLowerCase()))
      );
    } else {
      this.listOfMyNotice = this.tempListOfMyNotices;
    }
  }
  acceptNotice(id) {
    this.idValue = id;
    let body = {
      assemblyId: null,
      description: null,
      id: this.idValue,
      memberIds: [],
      noticeType: "PMR_LOT_REQUEST",
      ownerId: 0,
      pmResolutionId: 0,
      resolutionDate: null,
      sessionId: null,
      stage: null,
      status: null,
      subject: null
    }
    this.pmbrService.acceptNotice(body).subscribe(res => {
      this.notification.success('Success', 'Notice has been Accepted');
      this.getNoticeList();
    });
  }
}
