import { Component, OnInit, TemplateRef, Inject } from '@angular/core';
import { NzNotificationService,NzModalService } from  'ng-zorro-antd';
import { color } from 'html2canvas/dist/types/css/types/color';
import { BallotingService } from '../shared/balloting.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BillManagementService } from '../../shared/services/bill-management.service';
import { FileServiceService } from '../../shared/services/file-service.service';
import { BillcommonService } from '../../shared/services/billcommon.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-perform-balloting',
  templateUrl: './perform-balloting.component.html',
  styleUrls: ['./perform-balloting.component.scss']
})

export class PerformBallotingComponent implements OnInit {

  ballotbody;
  reqbody;
  listOfData;
  listballotData;
  reponse;
  confirmedballotdata;

  ballotId;
  ballotedList;
  billFileId;
  ballotStatus;
  billFileStatus;
  billFileNumber = null;
  showperformballot:boolean = false;

  billId = 0;
  title;
  user: any;
  balloting_flag: boolean = false;
  Responsedata;
  showBulletinPart2Popup = false;
  bulletinData: any;
  currentUser;
  rbsPermission = {
    create: false,
    update: false,
    addResponse: false,
    objectionToIntro: false,
    generalAmendment: false,
    ordinanceDisapproval: false,
    reSubmitFile: false,
    createBulletin: false,
    publish: false
  };
  urlParams: any;
  showBallotList = false;
  ballotResponse: any;

  constructor(private notification: NzNotificationService,
    private ballotingService: BallotingService,
    private route: ActivatedRoute,
    private billService: BillManagementService,
    private router: Router,
    @Inject('authService') private AuthService,
    @Inject('notify') public notify,
    private modalService: NzModalService,
    private fileService: FileServiceService,
    private commonService: BillcommonService,
    private _location: Location
    ) {
      this.user = AuthService.getCurrentUser();
      this.commonService.setBillPermissions(this.user.rbsPermissions);
      this.urlParams = this.router.getCurrentNavigation().extras.state;
      if(this.urlParams==undefined){
        console.log('this is undefined')
        this.goToPrevpage();
      }
    }

  ngOnInit() {
    this.getRbsPermissionsinList();
    if (this.route.snapshot.params.id) {
      this.billId = this.route.snapshot.params.id;
      this.title = this.urlParams.code;
      console.log(this.title)
      this.loadballoting_List();
    }
    }
  //left side list for balloting/if balloting already done then there are two lists
  loadballoting_List() {
    this.ballotingService.getballotList(this.billId, this.title).subscribe((Res: any) => {
      //console.log(Res);
      this.ballotResponse = Res;
      this.listOfData = Res.initialList;
      this.ballotId = Res.ballotId;
      this.ballotedList = Res.ballotedList;
      this.ballotStatus=Res.ballotStatus;
      console.log(this.ballotStatus)
      this.billFileId=Res.billFileId;
      this.billFileNumber=Res.billFileNumber;
      this.billFileStatus=Res.billFileStatus;
      if (this.ballotStatus =='SAVED'||this.ballotStatus=='DRAFT'||this.ballotStatus=='SUBMITTED'
      ||this.ballotStatus=='APPROVED'||this.ballotStatus=='PUBLISHED') {
        this.showperformballot=true;
        this.listOfData=Res.initialList;
        this.listballotData = this.ballotedList;
      //  console.log(this.listballotData)
      }

    });
  }

  //perform lot button/load list for balloting
  perform_lot() {
    this.ballotbody = {
      ballotList: this.listOfData,
      billId: this.billId,
      fileId: 0,
      noticeType: this.title,
      status: 'string'
    }

    if(this.listOfData!=null){
      this.ballotingService.performBallot(this.ballotbody).subscribe((Res: any) => {
      this.Responsedata = Res;
      this.listballotData=Res.ballotedList;
      this.ballotId = Res.ballotId;
      this.ballotStatus=Res.ballotStatus;
      if (this.ballotStatus =='SAVED'||this.ballotStatus=='DRAFT' ||this.ballotStatus=='SUBMITTED'
       ||this.ballotStatus=='APPROVED' ||this.ballotStatus=='PUBLISHED') {
        this.showperformballot=true;
      }
      else{
        this.showperformballot=false;
      }
    //  console.log(this.ballotId);
    });
  }

  }
  //confirm button
  confirm_balloting(): void {
    if (this.ballotId) {
      this.ballotingService.confirmBallot(this.ballotId).subscribe((Res: any) => {
        this.confirmedballotdata = Res;
        this.notification.success(
          'Success','Ballot List confirmed successfully'
        );
        this.loadballoting_List();
      });
    }

  }

  //cancel button
  cancel_balloting() {
    if (this.ballotId) {
      this.ballotingService.cancelballot(this.ballotId).subscribe((Res: any) => {
        this.reponse = Res;
       this.notification.success(
        'Success',Res.message
        
      );
      
      });
      this.showperformballot=false;
      //this.loadballoting_List();
    }
  }
  getRbsPermissionsinList() {
  if (this.commonService.doIHaveAnAccess('BALLOTING', 'CREATE')) {
    this.rbsPermission.create = true;
  }
  if (this.commonService.doIHaveAnAccess('FILE', 'CREATE')){
    this.rbsPermission.reSubmitFile = true;
  }
  if (this.commonService.doIHaveAnAccess('BULLETIN', 'CREATE')) {
    this.rbsPermission.createBulletin = true;
  }
  if (this.commonService.doIHaveAnAccess('AMENDMENT_LIST_PUBLISH', 'READ')
  ) {
    this.rbsPermission.publish = true;
  }
  }
  //file creation

  attachBallotingtoFile() {
    let content;
    if (this.billFileId == null) {
      content = '&nbsp;&nbsp;<b > Currently bill is not added to file..Cannot attach at this time ... </b>'
      this.generateAttchFileConfm(content);
      return;
    }
    if (this.billFileStatus && this.billFileStatus == 'APPROVED') {
      this.modalService.create({
        nzTitle: 'Attach to file',
        nzWidth: '500',
        nzContent: '&nbsp;&nbsp;<b >Are you sure to attach this ballot-result to file : ' + this.billFileNumber + '</b>',
        nzOkText: 'Yes',
        nzOnOk: () => { this.attachtoFile(); },
        nzCancelText: 'No',
        nzOnCancel: () => { }
      });
    } else {
      content = '&nbsp;&nbsp;<b > Currently file is under approval flow.Cannot attach at this time ... </b>'
      this.generateAttchFileConfm(content);
    }
  }
  generateAttchFileConfm(content) {
    this.modalService.create({
      nzTitle: 'Attach to file',
      nzWidth: '500',
      nzContent: content,
      nzOkText: 'OK',
      nzOnOk: () => { },
    });
  }
  attachtoFile() {
    const body = {
      ballotId: this.ballotId,
      fileForm: {
        fileId: this.billFileId,
        activeSubTypes: ['BALLOT'],
        type: 'BILL',
        userId: this.user.userId,
      }
    };
    this.billService.attachBallotingToFile(body).subscribe((Res: any) => {
      this.notification.success(
        'Success',
        'Successfully attached to file.'
      );
      this.router.navigate([
         'business-dashboard/bill/file-view', 'ballot',
         Res.fileResponse.fileId,
       ]);
      //   this.getErrataForAction();
      // this.viewErrata.showpopUp = false;
    });
  }

  viewFile(id) {
    this.router.navigate(['business-dashboard/bill/file-view/', id]);
  }

  createBulletinPart2() {
    this.bulletinData = {
      businessId: this.ballotId,
      businessType: 'BILL_BALLOTING',
      description: '',
      fileId: this.billFileId,
      part: '2',
      title: '',
      type: 'BILL_BALLOTING',
      userId: this.user.userId,
      assemblyId: null,
      sessionId: null
    };
    this.showBallotList = false;
    if (this.billFileStatus === 'APPROVED') {
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

  cancelBulletin() {
    this.showBulletinPart2Popup = false;
  }

  afterCreateBulletin(event) {
    if (event) {
      this.resubmitFile(this.billFileId);
      this.notification.success('Success', 'Bulletin Created.');
    }
    this.cancelBulletin();
  }

  resubmitFile(fileId) {
    const body = {
      fileForm: {
        fileId: fileId,
        activeSubTypes: ['BULLETIN'],
        type: 'BILL',
        userId: this.user.userId,
      }
    };
    this.billService.attachErrataToFile(body).subscribe((Res: any) => {
      this.router.navigate(['business-dashboard/bill/file-view/', 'bulletins', fileId]);
    });
  }

  viewBallotList() {
  
    this.showBallotList = true;
  }

  closeBallotList() {
    this.showBallotList = false;
  }

  publishList() {
    this.ballotingService.publistBallotList(this.ballotId).subscribe((Res: any) => {
      this.notification.success(
        'Success',
        'Ballot List published successfully'
      );
      this.loadballoting_List();
      this.showBallotList = false;
    });
  }

  goToPrevpage() {
    this._location.back();
    // debugger;
    // if (this.urlParams.code== 'ORDINANCE_DISAPPROVAL')
    // {
    //   this.router.navigate([
    //     'business-dashboard/bill/ordinance-disapproval-list',this.billId]);
    // }
    // else{
    //   this.router.navigate([
    //     'business-dashboard/bill/general-amendment-list',this.billId]);
    // }
    }
    
}




