import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { BillManagementService } from '../../shared/services/bill-management.service';
import { BillcommonService } from '../../shared/services/billcommon.service';
import { FileServiceService } from '../../shared/services/file-service.service';
import { ProrityListService } from '../../shared/services/prority-list.service';

@Component({
  selector: 'lib-schedule-for-bill',
  templateUrl: './schedule-for-bill.component.html',
  styleUrls: ['./schedule-for-bill.component.scss']
})
export class ScheduleForBillComponent implements OnInit {
  priorityList: any;
  j = 0;
  scheduleForm: FormGroup;
  billList: any = [];
  dateList: any;
  disabledCosDates: any;
  priorityMasterId: any = null;
  editMode = false;
  buttonControls = {
    scheduleOfBills: false
  };
  user: any;
  @Input() withCurrentUser = false;
  @Input() isFileView = false;
  @Output() updateSuccess = new EventEmitter<string>();
  @Input() priorityListResponse: any = [];
  fileStatus: any = null;
  @Input() priorityMaster: any;

  constructor(private router: Router,
              private fb: FormBuilder,
              private service: ProrityListService,
              private notify: NzNotificationService,
              private route: ActivatedRoute,
              private common: BillcommonService,
              @Inject('authService') private AuthService,
              private billService: BillManagementService,
              private fileService: FileServiceService) {
    this.priorityMasterId = this.route.snapshot.params.id;
    this.user = AuthService.getCurrentUser();
    this.common.setBillPermissions(this.user.rbsPermissions);
  }

  ngOnInit() {
    this.setRBSPermisson();
    this.scheduleForm = this.fb.group({
      bills: this.fb.array([])
    });
    if (!this.isFileView) {
      this.getScheduledData();
    } else {
      this.setValuesForFileView();
      this.getDateList();
    }
  }

  setValuesForFileView() {
    this.priorityList = this.priorityListResponse;
    this.priorityMasterId = this.priorityMaster;
    this.scheduleForm = this.fb.group({
      bills: this.fb.array([
     ])
    });
    this.billList = [];
    this.priorityList.categorys.forEach(cat => {
      cat.priorityList.forEach(bill => {
        this.billList.push(bill);
      });
    });
    this.getBillArray();
  }

  get bills(): FormArray {
    return this.scheduleForm.get('bills') as FormArray;
  }

  getBillArray() {
    this.priorityList.categorys.forEach(cat => {
      cat.priorityList.forEach(bill => {
        this.bills.push(this.fb.group({
          billId: [bill.billId],
          billIntroduction: [bill.scheduleDtoForm.billIntroduction],
          calusebyClause: [bill.scheduleDtoForm.calusebyClause],
          generalAmendmentI: [bill.scheduleDtoForm.generalAmendmentI],
          generalAmendmentII: [bill.scheduleDtoForm.generalAmendmentII],
          id: [bill.scheduleDtoForm.id],
          ordinanceDisapprovalMotion: [bill.scheduleDtoForm.ordinanceDisapprovalMotion],
          referToCommittee: [bill.scheduleDtoForm.referToCommittee],
          secondReading: [bill.scheduleDtoForm.secondReading]
        }));
      });
    });
  }

  getDateList() {
    this.dateList = [];
    this.service
      .getDates(
        this.priorityList.assemblyId,
        this.priorityList.sessionId
      )
      .subscribe((Res) => {
        this.dateList = Res;
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

  backToList() {
    window.history.back();
  }

  getScheduledData() {
    this.service.getScheduleOfBill(this.priorityMasterId).subscribe((res: any) => {
      this.scheduleForm = this.fb.group({
        bills: this.fb.array([
       ])
      });
      this.priorityList = res;
      this.billList = [];
      this.priorityList.categorys.forEach(cat => {
        cat.priorityList.forEach(bill => {
          this.billList.push(bill);
        });
      });
      this.getDateList();
      this.getBillArray();
      this.getFileStatus(this.priorityList.fileId);
    });
  }

  submitSchedule() {
    const tempSchedule = [];
    this.priorityList.categorys.forEach((elem) => {
      elem.priorityList.forEach((cat) => {
        tempSchedule.push(cat.scheduleDtoForm);
      });
    });
    const body = {
      prorityMasterId: this.priorityMasterId,
      schedulDtoForms: tempSchedule,
      type: 'BILL_SCHEDULE'
    };
    this.service.scheduleOfBill(body).subscribe(Res => {
      if (this.isFileView) {
        this.updateSuccess.emit();
      } else {
        this.getScheduledData();
      }
      if (this.priorityList.scheduleStatus === 'NOT_CREATED') {
        this.resubmitFile();
      }
      this.notify.success('Success', 'Schedule Created.');
      this.editMode = false;
    });
  }

  edit() {
    this.editMode = true;
  }

  cancelEdit() {
    this.editMode = false;
    if (!this.isFileView) {
      this.getScheduledData();
    }
  }

  setRBSPermisson() {
    if (this.common.doIHaveAnAccess('SCHEDULE_OF_BILLS', 'UPDATE')) {
      this.buttonControls.scheduleOfBills = true;
    }
  }

  resubmitFile() {
    const body = {
      fileForm: {
        fileId: this.priorityList.fileId,
        activeSubTypes: ['BILL_SCHEDULE_LIST'],
        type: 'BILL',
        userId: this.user.userId,
        subtype: 'BILL_PRIORITY_LIST_FILE'
      },
      priorityMasterId: this.priorityList.id
    };
    this.billService.attachErrataToFile(body).subscribe((Res: any) => {
    this.router.navigate(['business-dashboard/bill/file-view/', this.priorityList.fileId]);
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

   disableIfAdded(type, scheduleDto) {
    if ((scheduleDto.initalDate && scheduleDto.initalDate.includes(type)) ||
    (scheduleDto.initalDate && scheduleDto.schedule.includes(type))) {
      return true;
    } else {
      return false;
    }
  }

  viewBill(billId) {
    this.router.navigate([
      'business-dashboard/bill/bill-view',
      billId,
    ]);
  }

}
