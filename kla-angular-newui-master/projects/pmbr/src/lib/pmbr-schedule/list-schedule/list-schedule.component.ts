import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { BulletinContentViewComponent } from '../../bulletin/bulletin-content-view/bulletin-content-view.component';
import { BulletinService } from '../../shared/services/bulletin.service';
import { FileServiceService } from '../../shared/services/file-service.service';
import { PmbrCommonService } from '../../shared/services/pmbr-common.service';
import { PmbrScheduleService } from '../shared/services/pmbr-schedule.service';

@Component({
  selector: 'pmbr-list-schedule',
  templateUrl: './list-schedule.component.html',
  styleUrls: ['./list-schedule.component.css']
})
export class ListScheduleComponent implements OnInit {
  tempScheduleList = [];
  scheduleLists = [];
  assemblyList = [];
  search = null;
  viewLinks = false;
  // activeSession: any;
  assemblyId = null;
  sessionId = null;
  currentUser: any = null;
  fileList: any = null;
  tempFileList: any = null;
  attachedFiles: any = null;
  isAttachVisible = false;
  attachId = null;
  searchFile = null;
  attachFileId = null;
  isRequestModalVisible = false;
  fileForm = this.fb.group({
    id: [null],
    assemblyId: [null, Validators.required],
    sessionId: [null, Validators.required]
  });
  sessionList = [];
  file1 = {
    subject: '',
    priority: null,
    description: '',
  };
  createFilePermission = false;
  showBulletinPart2Popup: boolean = false;
  bulletinData: any;
  resubmitFileDetails: any;
  fileStatus: any;
  assemblySession: any = null;
  activeAssemblySession: any;
  constructor(private pmbrScheuleService: PmbrScheduleService,
    private pmbrCommonService: PmbrCommonService,
    private router: Router,
    private file: FileServiceService,
    private fb: FormBuilder,
    private modalService: NzModalService,
    @Inject('authService') private AuthService,
    private notification: NzNotificationService,
    private bullettin: BulletinService) {
    this.currentUser = AuthService.getCurrentUser();
    this.pmbrCommonService.setPermissions(this.currentUser.rbsPermissions);
  }

  ngOnInit() {
    this.getPermissions();
    // this.getAssembly();
    // this.getSession();
    this.scheduleList();
    // this.getActiveSessionAndAssembly()
    this.getAssemblyandSession();
  }
  getAssemblyandSession() {
    this.pmbrCommonService.getAllAssemblyAndSession().subscribe((Res: any) => {
      this.assemblyList = Res.assembly;
      this.assemblySession = Res.assemblySession;
      this.activeAssemblySession = Res.activeAssemblySession
      this.assemblyId = this.activeAssemblySession.assemblyId;
      this.getSessionForAssembly();
      this.sessionId = this.activeAssemblySession.sessionId;
    });
  }
  getSessionForAssembly() {
    this.sessionList = []; 
      if (this.assemblyId && this.assemblySession.find(x => x.id === this.assemblyId)) {
        this.sessionId = null;
        this.sessionList = this.assemblySession.find(x => x.id === this.assemblyId).session;
      }
  }

  scheduleList() {
    this.pmbrScheuleService.getScheduleList().subscribe((res: any) => {
      this.scheduleLists = this.tempScheduleList = res;
      this.attachedFiles = this.scheduleLists.filter(s => s.fileId !== null).map(x => x.fileId);
    });
  }

  getAssembly() {
    this.pmbrCommonService.getAllAssembly().subscribe((res: any) => {
      this.assemblyList = res;
    });
  }

  getSession() {
    this.pmbrCommonService.getAllSession().subscribe((res: any) => {
      this.sessionList = res;
    });
  }

  //get actice session and assembly
  // getActiveSessionAndAssembly() {
  //   this.pmbrCommonService.getCurrentAssemblyAndSession().subscribe((res: any) => {
  //     this.activeSession = res;
  //   })
  // }

  searchList() {
    if (this.search) {
      this.scheduleLists = this.tempScheduleList.filter(element => element.sessionId == this.search ||
        (element.status &&
          element.status
            .toLowerCase()
            .includes(this.search.toLowerCase())));
    }
    else if (this.assemblyId) {
      this.scheduleLists = this.tempScheduleList.filter((element) => element.assemblyId == this.assemblyId);
    }

    else {
      this.scheduleLists = this.tempScheduleList;
    }
  }
  showLinks(id) {
    this.tempScheduleList.forEach(element => {
      if (element.id === id) {
        element.viewLinks = true;
      } else {
        element.viewLinks = false;
      }
    });
  }

  redirectToCreateSchedule(purpose, scheduleId) {
    this.router.navigate(
      [
        "/business-dashboard/pmbr/create-schedule",
        purpose,
        scheduleId,
      ],
      {}
    );
  }

  getFilesList(assembly, session) {
    const body = {
      assemblyId: assembly,
      sessionId: session,
      status: null,
      subtype: 'PMBR_SCHEDULE',
      type: 'PMBR',
      userId: this.currentUser.userId,
    };
    this.file.getAllFiles(body).subscribe((Response: any) => {
      this.fileList = Response.filter(element => element.subtype === 'PMBR_SCHEDULE');
      this.tempFileList = Response;
    });
    // && !this.attachedFiles.includes(element.fileId)
  }

  showAttachModal(id, assembly, session) {
    this.getFilesList(assembly, session);
    this.isAttachVisible = true;
    this.attachId = id;
  }

  attachToFile() {
    const body = {
      fileForm: {
        fileId: this.attachFileId,
        activeSubTypes: ['PMBR_SCHEDULE'],
        type: 'PMBR',
        userId: this.currentUser.userId,
      },
      pmbrScheduleId: this.attachId
    };
    this.file.attachToFile(body).subscribe((Res: any) => {
      this.notification.success(
        'Success',
        'File resubmitted successfully.'
      );
      this.router.navigate(['business-dashboard/bill/file-view/', this.attachFileId]);
    });
  }

  onSearchFile() { }

  handleCancel() {
    this.isAttachVisible = false;
    this.attachFileId = null;
    this.attachId = null;
    this.searchFile = null;
    this.isRequestModalVisible = false;
  }

  createFile() {
    if (this.fileForm.valid) {
      const body = {
        pmbrScheduleId: this.attachId,
        fileForm: {
          assemblyId: this.fileForm.value.assemblyId,
          currentNumber: null,
          description: this.file1.description,
          sessionId: this.fileForm.value.sessionId,
          status: "saved",
          subject: this.file1.subject,
          activeSubTypes: ["PMBR_SCHEDULE"],
          subtype: "PMBR_SCHEDULE",
          type: "PMBR_SCHEDULE",
          userId: this.currentUser.userId,
          priority: this.file1.priority,
        },
      };
      this.file.createFile(body).subscribe((res: any) => {
        this.notification.success("Success",
          "File Created with file number :" + res.fileResponse.fileNumber);
        this.isRequestModalVisible = false;
        this.viewFile(res.fileResponse.fileId);
      });
    } else {
      // tslint:disable-next-line: forin
      for (const i in this.fileForm.controls) {
        this.fileForm.controls[i].markAsDirty();
        this.fileForm.controls[i].updateValueAndValidity();
      }
    }
  }

  showRequestModal(reqId, assembly, session) {
    this.fileForm.patchValue({
      assemblyId: assembly,
      sessionId: session
    });
    this.attachId = reqId;
    this.isRequestModalVisible = true;
  }

  getPermissions() {
    if (this.pmbrCommonService.doIHaveAnAccess('FILE', 'CREATE')) {
      this.createFilePermission = true;
    }
  }

  viewFile(fileId) {
    this.router.navigate(['business-dashboard/pmbr/file-view/', fileId]);
  }
  showBullettinPopup() {
    this.showBulletinPart2Popup = true;
  }
  createBullettin(scheduleData) {
    this.bulletinData = {
      title: '',
      businessId: scheduleData.id,
      businessType: 'PMBR_SCHEDULE',
      assemblyId: null,
      sessionId: null,
      fileId: scheduleData.fileId,
      description: '',
      type: 'PMBR_SCHEDULE',
      part: '2',
      // approvedBy: this.currentUser.userId,
      userId: this.currentUser.userId,
      pmbrScheduleId: scheduleData.id,
    };
    this.resubmitFileDetails = {
      scheduleId: scheduleData.id,
      fileId: scheduleData.fileId
    };
    this.file.getFileById(scheduleData.fileId, this.currentUser.userId).subscribe((res: any) => {
      if (res) {
        this.fileStatus = res.fileResponse.status;
        if (this.fileStatus === 'APPROVED') {
          this.showBulletinPart2Popup = true;
        } else {
          this.modalService.create({
            nzTitle: 'Create Bulletin Part 2',
            nzWidth: '500',
            nzContent: '&nbsp;&nbsp;<b>Currently file is under approval flow..Cannot create bulletin now... </b>',
            nzOkText: 'OK',
            nzOnOk: () => { },
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
      this.scheduleList();
      this.resubmitFile();
    }
    this.cancelBulletin();
  }
  resubmitFile() {
    const body = {
      fileForm: {
        fileId: this.resubmitFileDetails.fileId,
        activeSubTypes: ['BULLETIN'],
        type: 'PMBR',
        userId: this.currentUser.userId,
      }
    };
    this.file.attachToFile(body).subscribe((Res: any) => {
      this.router.navigate(['business-dashboard/pmbr/file-view/', this.resubmitFileDetails.fileId]);
    });
  }

  viewBulletin(bulletinId) {
    this.bullettin.getBulletinById(bulletinId).subscribe(res => {
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
  checkScheduleExistinThisSession(): boolean {
    const returnValue = this.scheduleLists.some(f => f.assemblyId == this.activeAssemblySession.assemblyId && f.sessionId == this.activeAssemblySession.sessionId);
    return returnValue;
  }
  createSchedule() {
    if (!this.checkScheduleExistinThisSession()) {
      this.router.navigateByUrl('/business-dashboard/pmbr/create-schedule')
    }
    else {
      this.notification.warning('Warning', 'Schedule already created in this session..')
    }
  }
}
