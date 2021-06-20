import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { BulletinContentViewComponent } from '../../bulletin/bulletin-content-view/bulletin-content-view.component';
import { BulletinService } from '../../shared/services/bulletin.service';
import { FileServiceService } from '../../shared/services/file-service.service';
import { PmbrCommonService } from '../../shared/services/pmbr-common.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'pmbr-resolution-ballot-list',
  templateUrl: './resolution-ballot-list.component.html',
  styleUrls: ['./resolution-ballot-list.component.css']
})
export class ResolutionBallotListComponent implements OnInit {
  ballotListing: any = [];
  ballotListingForDepartment: any = [];
  ballotResultById = false;
  presentationDate;
  assemblyId = null;
  sessionId = null;
  sessionList = [];
  assemblyList = [];
  bulletinData: any = null;
  fileStatus: any = null;
  showBulletinPart2Popup = false;
  user: any = null;
  createBulletinPermission = false;
  resubmitFileDetails: any = null;
  assemblySession: any;
  
  constructor(private pmbrCommonService: PmbrCommonService, private router: Router,
              private fileService: FileServiceService,
              private modalService: NzModalService,
              private notification: NzNotificationService,
              private bulletin: BulletinService,
              @Inject('authService') private AuthService) {
                this.user = AuthService.getCurrentUser();
                this.pmbrCommonService.setPermissions(this.user.rbsPermissions);
              }

  ngOnInit() {
    this.getPermissions();
    // this.ballotlistforSection();
    this.getAssemblyandSession();
  }

  // get assembly and session
  getAssemblyandSession() {
    this.pmbrCommonService.getAllAssemblyAndSession().subscribe((Res: any) => {
      this.assemblyList = Res.assembly;
      this.assemblySession = Res.assemblySession;
      this.assemblyId = Res.activeAssemblySession.assemblyId;
      this.getSessionForAssembly();
      this.sessionId = Res.activeAssemblySession.sessionId;
      this.ballotlistforSection();
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
  ballotlist(){
    this.pmbrCommonService.getBallotList().subscribe(res => {
      this.ballotListingForDepartment = res;
    });
  }
  ballotlistforSection(){
    this.ballotListing=[];
    const body ={
      assemblyId: this.assemblyId,
      sessionId: this.sessionId
    }
    this.pmbrCommonService.getBallotListforSection(body).subscribe(res => {
      this.ballotListing  = res;
    });
  }
  ViewBallotResult(id){
    this.router.navigate(['business-dashboard/pmbr/resolution-ballot-view/', id])
  }
  // getSessions(){
  //   this.pmbrCommonService.getAllSession().subscribe(res => {
  //     this.sessionList = res;
  //   });
  // }
  // getAssembly(){
  //   this.pmbrCommonService.getAllAssembly().subscribe(res => {
  //     this.assemblyList = res;
  //   });
  // }

  showLinks(id) {
    this.ballotListing.forEach(element => {
      if (element.id === id) {
        element.viewLinks = true;
      } else {
        element.viewLinks = false;
      }
    });
  }
  
  hideLinks(id) {
    this.ballotListing.forEach((element) => {
      if (element.id === id) {
        element.viewLinks = false;
      }
    });
  }
  
  createBulletin(list) {
    this.bulletinData = {
      title: '',
      businessId: list.id,
      businessType: 'PM_RESOLUTION',
      assemblyId: null,
      sessionId: null,
      fileId: list.fileId,
      description: '',
      type: 'PM_RESOLUTION',
      part: '2',
      // approvedBy: this.currentUser.userId,
      userId: this.user.userId
    };
    this.resubmitFileDetails = {
      fileId: list.fileId
    };
    this.fileService.getFileById(list.fileId, this.user.userId).subscribe((res: any) => {
      if(res) {
        this.fileStatus = res.fileResponse.status;
        if (this.fileStatus === 'APPROVED') {
          this.showBulletinPart2Popup = true;
        } else {
          this.modalService.create({
            nzTitle: 'Create Bulletin Part 2',
            nzWidth : '500',
            nzContent: '&nbsp;&nbsp;<b>Currently file is under approval flow..Cannot create bulletin now... </b>',
            nzOkText: 'OK',
            nzOnOk: () => {},
          });
        }
      }
    });
  }
  
  cancelBulletin() {
    this.showBulletinPart2Popup = false;
    this.bulletinData = {};
  }
  
  afterCreateBulletin(e) {
    if (e) {
      this.notification.success('Success', 'Bulletin Created.');
      this.resubmitBulletinFile();
    }
    this.cancelBulletin();
  }
  
  resubmitBulletinFile() {
    const body = {
      fileForm: {
        fileId: this.resubmitFileDetails.fileId,
        activeSubTypes: ['BULLETIN'],
        type: 'PM_RESOLUTION',
        userId: this.user.userId,
      }
    };
    this.fileService.attachToFile(body).subscribe((Res: any) => {
      this.router.navigate(['business-dashboard/pmbr/file-view/', this.resubmitFileDetails.fileId]);
    });
  }
  
  getPermissions() {
    if (this.pmbrCommonService.doIHaveAnAccess('BULLETIN', 'CREATE')) {
      this.createBulletinPermission = true;
    }
  }
  
  viewBulletin(bulletinId) {
    this.bulletin.getBulletinById(bulletinId).subscribe(res => {
      this.modalService.create({
        nzTitle: null,
        nzWidth: '800',
        nzContent: BulletinContentViewComponent,
        nzClosable: true,
        nzFooter: null,
        nzMaskClosable: false,
        nzComponentParams: {
          bulletin: res,
        }
      });
    });
  }
}
