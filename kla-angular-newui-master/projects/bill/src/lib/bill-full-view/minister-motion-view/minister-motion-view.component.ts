import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { differenceInCalendarDays } from 'date-fns';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { BillManagementService } from '../../shared/services/bill-management.service';
import { FileServiceService } from '../../shared/services/file-service.service';

@Component({
  selector: 'lib-minister-motion-view',
  templateUrl: './minister-motion-view.component.html',
  styleUrls: ['./minister-motion-view.component.scss']
})
export class MinisterMotionViewComponent implements OnInit {
  bulletinData: any;
  @Input() user: any;
  fileStatus: any;
  showBulletinPart2Popup = false;
  @Input() billDetails;
  @Input() isFileView;
  selectedMember: any;
  listOfMembers: any;
  canAddMembers: boolean = false;
  membersList: any;
  @Output() addedMembers = new EventEmitter<string>();
  showAddMem: boolean = false;
  filteredMembers: any;

  constructor(private fileService: FileServiceService,
              private modalService: NzModalService,
              private notification: NzNotificationService,
              private billService: BillManagementService,
              private router: Router,
              private datePipe: DatePipe) { }

  ngOnInit() {
    this.isMinister();
    if (!this.isFileView) {
      this.getFileStatus();
      if(this.billDetails.motion.committeeType === 'SELECT_COMMITTEE' && 
        differenceInCalendarDays(new Date(this.billDetails.schedulDtoForm.billIntroduction), new Date()) > 0) {
        this.canAddMembers = true;
        this.getAllMembers();
      } else {
        this.canAddMembers = false;
      }
      if(this.billDetails.motion.user) {
        this.membersList = this.billDetails.motion.user;
        this.selectedMember = this.billDetails.motion.userId;
      }
    }
  }

  isAssistant() {
    return (this.user.authorities.includes('assistant'));
  }
  isMinister() {
    return this.user.authorities.includes("minister");
  }
  attachToFile() {
    const body = {
      fileForm: {
        fileId: this.billDetails.fileId,
        activeSubTypes: ['BULLETIN', 'BILL_MINISTER_MOTION'],
        type: 'BILL',
        userId: this.user.userId,
      },
      ministerMotionId: this.billDetails.motion.id
    };
    this.billService.attachErrataToFile(body).subscribe((Res: any) => {
      this.notification.success('Success', 'Minister Motion Attached to File.');
      this.router.navigate(['business-dashboard/bill/file-view/', this.billDetails.fileId]);
    });
  }

  createBulletinPart2(billStatus) {
    this.bulletinData = {
      businessId: this.billDetails.motion.id,
      businessType: 'BILL_MINISTER_MOTION',
      description: '',
      fileId: this.billDetails.fileId,
      part: '2',
      title: '',
      type: 'BILL_MINISTER_MOTION',
      userId: this.user.userId,
      assemblyId: null,
      sessionId: null
    };
    if (billStatus !== 'APPROVED') {
      this.modalService.create({
        nzTitle: 'Create Bulletin Part 2',
        nzWidth : '500',
        nzContent: '&nbsp;&nbsp;<b>Bill not approved..Cannot attach now... </b>',
        nzOkText: 'OK',
        nzOnOk: () => {},
      });
    } else if (this.fileStatus === 'APPROVED' && billStatus === 'APPROVED') {
        this.showBulletinPart2Popup = true;
      } else {
        this.modalService.create({
          nzTitle: 'Create Bulletin Part 2',
          nzWidth : '500',
          nzContent: '&nbsp;&nbsp;<b>Currently file is under approval flow..Cannot attach now... </b>',
          nzOkText: 'OK',
          nzOnOk: () => {},
        });
      }
  }

  getFileStatus() {
    this.fileService.getFileById(this.billDetails.fileId, this.user.userId).subscribe((res: any) => {
      this.fileStatus = res.fileResponse.status;
    });
  }

  cancelBulletin() {
    this.showBulletinPart2Popup = false;
    this.bulletinData = {};
  }

  afterCreateBulletin(event) {
    if (event) {
      this.attachToFile();
      // this.router.navigate(['business-dashboard/bill/file-view/', this.resubmitFileDetails.fileId]);
    }
    this.cancelBulletin();
  }
  getAllMembers() {
    this.billService.getAllMembersList().subscribe((data) => {
      this.listOfMembers = data as any;
      this.filteredMembers = this.listOfMembers.filter(element => element.details.id !== 105)
    });
  }
  addMember() {
    const body ={
      billId: this.billDetails.id,
      memberIds: this.selectedMember
    }
    this.billService.addMembers(body).subscribe(res=> {
      if(res){
        // this.addedMembers.emit(this.billDetails.id);
        this.getBill(this.billDetails.id);
      }
    });
  }
  showAddMember() {
    this.showAddMem = true;
  }
  cancel() {
    this.showAddMem = false;
  }
  getBill(billId) {
    this.billService.getBillByBillId(billId).subscribe((res) => {
      if(res) {
        this.billDetails = res
      }
    });
  }
}
