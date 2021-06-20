import { Component, OnInit, Inject, Input, Output, EventEmitter } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ProrityListService } from '../../shared/services/prority-list.service';
import { BillcommonService } from '../../shared/services/billcommon.service';

import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { BillManagementService } from '../../shared/services/bill-management.service';
import { Router } from '@angular/router';
import { FileServiceService } from '../../shared/services/file-service.service';
import { CategoryData } from '../../shared/model/schedule.model';

@Component({
  selector: 'lib-initial-days',
  templateUrl: './initial-days.component.html',
  styleUrls: ['./initial-days.component.scss'],
})
export class InitialDaysComponent implements OnInit {
  user;
  routeData;
  @Input() priorityListResponse;
  // categorys=[
  //   {
  //   description: "",
  //   descriptionMal: "",
  //   id: null,
  //   priorityList :[
  //     {
  //       billId: null,
  //       billTitle: "",
  //       id: null,
  //       disableDatePicker : true,
  //       scheduleDtoForm :{
  //         billId:null,
  //         billIntroduction:null,
  //         calusebyClause: null,
  //         generalAmendmentI: null,
  //         generalAmendmentII: null,
  //         id: 0,
  //         ordinanceDisapprovalMotion: null,
  //         referToCommittee:null,
  //         secondReading:null,
  //         status: "",
  //       }
  //     }
  //   ]
  //   }
  // ];
  categorys:any = null;
  dateList: any;
  disabledCosDates: any;
  initialDay: any;
  tempInitialList: any = [];
  tempDateList: any;
  @Output() dateSuccess = new EventEmitter<string>();
  @Input() disableDates;
  @Input() withCurrentUser;
  isSave = true;
  showUpdate = false;
  bulletinData: any;
  showBulletinPart2Popup = false;
  permissions = {
    createBulletin: false,
    createFile: false
  };
  scheduleForm: FormGroup;
  @Input() isListView;
  fileStatus: any = null;

  constructor(
    private fb: FormBuilder,
    private common: BillcommonService,
    private service: ProrityListService,
    @Inject('authService') private AuthService,
    private notify: NzNotificationService,
    private billService: BillManagementService,
    private router: Router,
    private modalService: NzModalService,
    private fileService: FileServiceService,
  ) {
    this.user = AuthService.getCurrentUser();
    this.common.setBillPermissions(this.user.rbsPermissions);
  }

  ngOnInit() {
    this.setRBSPermisson();
    this.scheduleForm = this.fb.group({
      bills: this.fb.array([
     ])
    });
    if (this.isAssistant()) {
      this.disableDates = true;
    }
    if (this.disableDates) {
      this.getScheduleById();
    } else if (!this.disableDates && this.isListView) {
      this.getPrioritytList( this.priorityListResponse.id);
    } else {
      this.categorys = this.priorityListResponse.categorys;
      this.categorys.forEach((elem) => {
        elem.priorityList.forEach((cat) => {
          cat.disableDatePicker = false;
          cat.scheduleDtoForm = {
            billId: cat.billId,
            billIntroduction: null,
            calusebyClause: null,
            generalAmendmentI: null,
            generalAmendmentII: null,
            ordinanceDisapprovalMotion: null,
            referToCommittee: null,
            secondReading: null,
        }
        });
      });
    }
    this.isSave = this.disableDates;
    if (this.priorityListResponse.initaialDateStatus === 'SAVED') {
      this.withCurrentUser = true;
    }
    this.isSave = this.disableDates;
    this.getDateList();
  }

  getScheduleById() {
    this.service.getScheduleOfBill(this.priorityListResponse.id).subscribe((res: any) => {
      this.categorys = res.categorys;
    });
  }

  setRBSPermisson() {
    if (this.common.doIHaveAnAccess("BULLETIN", "CREATE")) {
      this.permissions.createBulletin = true;
    }
    if (this.common.doIHaveAnAccess("PRIORITY_LIST_REQUEST", "CREATE")) {
      this.permissions.createFile = true;
    }
  }

  getDateList() {
    this.service
      .getDates(
        this.priorityListResponse.assemblyId,
        this.priorityListResponse.sessionId
      )
      .subscribe((Res) => {
        this.dateList = this.tempDateList = Res;
        this.disabledCosDates = (current: Date): boolean => {
          const todayDate =
            current.getFullYear() +
            '-' +
            ('0' + (current.getMonth() + 1)).slice(-2) +
            '-' +
            ('0' + current.getDate()).slice(-2);
          return !this.dateList.find((item) => item === todayDate);
        };
      });
  }

  setDate(id, date) {
    const tempIds = this.tempInitialList.map(x => x.billId);
    if (!tempIds.includes(id) && date) {
      this.tempInitialList.push({
        billId: id,
        initialDate: date,
      });
    } else if (tempIds.includes(id) && date) {
      this.tempInitialList.find(el => el.billId === id).initialDate = date;
    } else if (tempIds.includes(id) && !date) {
      this.tempInitialList.splice(tempIds.indexOf(id), 1);
    }
  }

  saveInitialDays() {
    // if (this.tempInitialList.length > 0) {
    //   const body = {
    //     id: this.priorityListResponse.id,
    //     intialList: this.tempInitialList
    //   };
      // this.service.setInitialDays(body).subscribe(Res => {
      //   if (this.showUpdate) {
      //     this.notify.success('Success.', 'Initial Days Updated.');
      //   } else {
      //     this.notify.success('Success.', 'Initial Days Set.');
      //   }
      //   this.cancelModal();
      //   this.showUpdate = false;
      // });
    // } else if (this.showUpdate) {
    //   this.cancelModal();
    // } else {
    //   this.notify.warning('Warning.', 'Please select dates.');
    // }
    const tempSchedule = [];
    this.categorys.forEach((elem) => {
      elem.priorityList.forEach((cat) => {
        tempSchedule.push(cat.scheduleDtoForm);
      });
    });
    const body = {
      prorityMasterId: this.priorityListResponse.id,
      schedulDtoForms: tempSchedule,
      type: 'BILL_INITAL_DATES'
    };
    this.service.scheduleOfBill(body).subscribe(Res => {
      this.showUpdate = false;
      if (this.isAssistant()) {
        this.attachInitialDaysToFile();
      } else {
        if (this.showUpdate) {
          this.notify.success('Success.', 'Initial Days Updated.');
        } else {
          this.notify.success('Success.', 'Initial Days Set.');
        }
        this.cancelModal();
      }
    });
  }

  cancelModal() {
    this.dateSuccess.emit();
  }

  createBulletinPart2() {
    this.bulletinData = {
      businessId: this.priorityListResponse.id,
      businessType: 'BILL_PRIORITY_LIST_INITAL_DATES',
      description: '',
      fileId: this.priorityListResponse.fileId,
      part: '2',
      title: '',
      type: 'BILL_PRIORITY_LIST_INITAL_DATES',
      userId: this.user.userId,
      assemblyId: null,
      sessionId: null
    };
    this.fileService.getFileById(this.priorityListResponse.fileId, this.user.userId).subscribe((res: any) => {
      const fileStatus = res.fileResponse.status;
      if (fileStatus === 'APPROVED') {
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
    });
  }

  cancelBulletin() {
    this.showBulletinPart2Popup = false;
    this.bulletinData = {};
  }

  afterCreateBulletin(event) {
    if (event) {
      this.notify.success('Success', 'Bulletin Created.')
      this.resubmitFile();
    }
    this.cancelBulletin();
  }

  resubmitFile() {
    const body = {
        fileForm: {
          fileId: this.priorityListResponse.fileId,
          activeSubTypes: ['BULLETIN'],
          type: 'BILL',
          userId: this.user.userId,
          subtype: 'BILL_PRIORITY_LIST_FILE'
        }
      };
    this.billService.attachErrataToFile(body).subscribe((Res: any) => {
      this.router.navigate(['business-dashboard/bill/file-view/', 'bulletins', this.priorityListResponse.fileId]);
    });
  }

  // setDate(id, date) {
  //   let tempIds = this.tempInitialList.map(x => x.billId);
  //   if (this.tempInitialList.length < 2 && date && !tempIds.includes(id)) {
  //     this.tempInitialList.push(
  //       {
  //         billId: id,
  //         initialDate: date
  //       }
  //     );
  //     tempIds = this.tempInitialList.map(x => x.billId);
  //   } else if (tempIds.includes(id) && date) {
  //     this.tempInitialList.find(el => el.billId === id).initialDate = date;
  //     tempIds = this.tempInitialList.map(x => x.billId);
  //   } else if (tempIds.includes(id) && !date) {
  //     this.tempInitialList.splice(tempIds.indexOf(id), 1);
  //     tempIds = this.tempInitialList.map(x => x.billId);
  //   }
  //   if (tempIds.length === 2) {
  //     this.categorys.forEach(elem => {
  //       elem.priorityList.forEach(cat => {
  //         if (!tempIds.includes(cat.billId)) {
  //           cat.disableDatePicker = true;
  //         }
  //       });
  //     });
  //   } else {
  //     this.categorys.forEach(elem => {
  //       elem.priorityList.forEach(cat => {
  //         cat.disableDatePicker = false;
  //       });
  //     });
  //   }
  //   console.log(this.tempInitialList);
  // }

  disableIfAdded(type, scheduleDto) {
    if ((scheduleDto.initalDate && scheduleDto.initalDate.includes(type)) ||
    (scheduleDto.initalDate && scheduleDto.schedule.includes(type))) {
      return true;
    } else {
      return false;
    }
  }
  getPrioritytList(listId) {
    this.service.getPriorityListById(listId).subscribe((res: any) => {
      this.getFileStatus(res.fileId);
      this.priorityListResponse = res;
      this.categorys = res.categorys;
      this.categorys.forEach((elem) => {
        elem.priorityList.forEach((cat) => {
          cat.disableDatePicker = false;
          cat.scheduleDtoForm = {
            billId: cat.billId,
            billIntroduction: null,
            calusebyClause: null,
            generalAmendmentI: null,
            generalAmendmentII: null,
            ordinanceDisapprovalMotion: null,
            referToCommittee: null,
            secondReading: null,
        }
        });
      });
      if (this.priorityListResponse.initaialDateStatus === 'SAVED') {
        this.withCurrentUser = true;
      }
    });
  }

  getFileStatus(fileId) {
    if (fileId) {
      this.fileService.getFileById(fileId, this.user.userId).subscribe((res: any) => {
        this.fileStatus = res.fileResponse.status;
        this.getWorkflowStatus(res.fileResponse.workflowId);
      });
    }
  }

  getWorkflowStatus(workflowId) {
    this.fileService
      .checkWorkFlowStatus(workflowId)
      .subscribe((Res: any) => {
        const current = Res[Res.length - 1];
        if (current.assignee == this.user.userId) {
          this.withCurrentUser = true;
        }
      });
  }

  viewBill(billId) {
    this.router.navigate([
      'business-dashboard/bill/bill-view',
      billId,
    ]);
  }

  isAssistant() {
    return (this.user.authorities.includes('assistant'));
  }

  attachInitialDaysToFile() {
    let body;
    body = {
        fileForm: {
          fileId: this.priorityListResponse.fileId,
          activeSubTypes: ['BILL_PRIORITY_LIST_INITAL_DATES'],
          type: 'BILL',
          userId: this.user.userId,
          subtype: 'BILL_PRIORITY_LIST_FILE'
        },
        priorityMasterId: this.priorityListResponse.id
    };
    this.billService.attachErrataToFile(body).subscribe((Res: any) => {
      this.notify.success(
        'Success',
        'File resubmitted successfully.'
      );
      this.cancelModal();
      this.router.navigate(['business-dashboard/bill/file-view/', 'initialDateList',  this.priorityListResponse.fileId]);
    });
  }

}
