import { Component, OnInit, Inject } from '@angular/core';
import { Data, Router, ActivatedRoute } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { FileServiceService } from '../../shared/services/file-service.service';
import { PmbrCommonService } from '../../shared/services/pmbr-common.service';
import { InoticeDetails } from '../shared/models/pmbr-bill-model';
import { PmbrBillService } from '../shared/services/pmbr-bill.service';

@Component({
  selector: 'pmbr-bills-list',
  templateUrl: './bills-list.component.html',
  styleUrls: ['./bills-list.component.css']
})
export class BillsListComponent implements OnInit {
  noticeDetails: InoticeDetails;
  viewNoticeTitle = '';
  showHideCreateNotice = false;
  fileType = 'Priority List Empty Files';
  BallotFiles: any = [];
  BallotPendingFiles: any = [];
  listOfBallotPendingFiles: any = [];
  completedVettingBills: any = [];
  registeredBills: any = [];
  tempMyBillsList: any = [];
  listOfAllFiles;
  billFileType;
  allFiles;
  fileStatusType = null;
  fileTypes = ['Priority List Empty Files', 'Priority List Files'];
  params = false;
  billId = 0;
  fileId;
  userId;
  pmbillId;
  pmBillsId;
  listOfCurrentPageData: Data[] = [];
  checked = false;
  id;
  myBills;
  type = 'PMBR';
  subType = null;
  billType: any;
  billsForAction;
  submittedBills;
  assisgnedBillsList;
  setOfCheckedId = new Set<any>();
  tempBillList: any = [];
  tempBillActionList: any = [];
  submittedBillsList: any = [];
  tempSubmitList: any = [];
  tempassignedList: any = [];
  tempVettedList: any = [];
  indeterminate = false;
  billList: any = [];
  search = null;
  viewLinks = false;
  user: any;
  radioValue: any = null;
  isAssignVisible = false;
  createFilePopUp = false;
  assistantList: any = [];
  listOfAssistants: any = [];
  assemblyId = null;
  sessionId = null;
  sessionList: any = [];
  assemblyList: any = [];
  colCheckboxes = [
    { id: 0, label: 'bill', check: true, disable: false },
    { id: 1, label: 'type of bill', check: true, disable: false },
    { id: 2, label: 'language', check: true, disable: false },
    { id: 3, label: 'minstersuject', check: true, disable: false },
    { id: 4, label: 'department', check: true, disable: false },
    { id: 5, label: 'ministersubject', check: true, disable: false },
    { id: 6, label: 'status', check: true, disable: false }
  ];
  file = {
    subject: "",
    priority: null,
    description: "",
  };
  subTypes;
  showHideCreateBillMetaform = false;
  ballotBills;
  assistant;
  selectedBillId
  allBillList: any = [];
  tempAllBillList: any = [];
  assemblySession: any = null;
  constructor(private notification: NzNotificationService,
    private router: Router,
    private pmbrCommonService: PmbrCommonService,
    private route: ActivatedRoute,
    private fileService: FileServiceService,
    private pmbrBillService: PmbrBillService,


    @Inject('authService') private AuthService) {
    this.user = AuthService.getCurrentUser();
    console.log(this.user);
    if (this.user.authorities[0] === 'sectionOfficer') {
      this.submittedBills = true;
    }
    if (this.user.authorities[0] === 'underSecretary') {
      this.ballotBills = true;
    }
    if (this.user.authorities[0] === 'assistant') {
      this.assistant = true;
    }
    this.pmbrCommonService.setPermissions(this.user.rbsPermissions);
  }

  disableCheckBox() {
    let count = 0;
    for (const box of this.colCheckboxes) {
      if (box.check) {
        count++;
      }
    }

    if (count === 6) {
      for (const box of this.colCheckboxes) {
        if (!box.check) {
          box.disable = true;
        }
      }
    } else {
      for (const box of this.colCheckboxes) {
        box.disable = false;
      }
    }
  }
  getBillsList() {
    const body = {
      "assignedTo": 0,
      "departmentId": null,
      "natureOfBill": "PRIVATE",
      "isGovernerRecommendation": false,
      "isOrdinance": false,
      "status": [
        null
      ],
      "type": null
    }
    this.pmbrCommonService.getBillsList(body).subscribe(res => {
      this.billList = this.tempBillList = res;
    });
  }

  ngOnInit() {
    this.getSubmittedBillList();
    this.getAssignedBillList();
    this.getBillsForAction();
    this.getMyBills();
    this.getAssistants();
    this.getVettingCompletedBills();
    this.getBills();
    this.getAssemblyandSession();
  }
  getBills() {
    this.pmbrCommonService.getAllBillList().subscribe(res => {
      this.allBillList = this.tempAllBillList = res;
    });
  }
  getAssemblyandSession() {
    this.pmbrCommonService.getAllAssemblyAndSession().subscribe((Res: any) => {
      this.assemblyList = Res.assembly;
      this.assemblySession = Res.assemblySession;
      this.assemblyId = Res.activeAssemblySession.assemblyId;
      this.getSessionForAssembly();
      this.sessionId = Res.activeAssemblySession.sessionId;
    });
  }
  getSessionForAssembly() {
    this.sessionList = []; 
      if (this.assemblyId && this.assemblySession.find(x => x.id === this.assemblyId)) {
        this.sessionId = null;
        this.sessionList = this.assemblySession.find(x => x.id === this.assemblyId).session;
      }
  }
  searchBills() {
    if (this.search) {
      this.allBillList = this.tempAllBillList.filter(
        (element) =>
          (element.billMetaDataDto.title &&
            element.billMetaDataDto.title
              .toLowerCase()
              .includes(this.search.toLowerCase())) ||
          (element.billMetaDataDto.createdDate &&
            element.billMetaDataDto.createdDate
              .toLowerCase()
              .includes(this.search.toLowerCase())) ||
          (element.billMetaDataDto.priority &&
            element.billMetaDataDto.priority
              .toLowerCase()
              .includes(this.search.toLowerCase())) ||
          (element.billMetaDataDto.session &&
            element.billMetaDataDto.session
              .toLowerCase()
              .includes(this.search.toLowerCase())) ||
          (element.billMetaDataDto.status &&
            element.billMetaDataDto.status
              .toLowerCase()
              .includes(this.search.toLowerCase()))
      );
    } else {
      this.allBillList = this.tempAllBillList;
    }
  }
  searchList() {
    if (this.search) {
      this.allBillList = this.tempAllBillList.filter(
        (element) =>
          (element.billMetaDataDto.title &&
            element.billMetaDataDto.title
              .toLowerCase()
              .includes(this.search.toLowerCase())) ||
          (element.billMetaDataDto.createdDate &&
            element.billMetaDataDto.createdDate
              .toLowerCase()
              .includes(this.search.toLowerCase())) ||
          (element.billMetaDataDto.priority &&
            element.billMetaDataDto.priority
              .toLowerCase()
              .includes(this.search.toLowerCase())) ||
          (element.billMetaDataDto.session &&
            element.billMetaDataDto.session
              .toLowerCase()
              .includes(this.search.toLowerCase())) ||
          (element.billMetaDataDto.status &&
            element.billMetaDataDto.status
              .toLowerCase()
              .includes(this.search.toLowerCase()))
      );
    } else {
      this.billList = this.tempBillList;
    }
  }
  searchActionList() {
    if (this.search) {
      this.billsForAction = this.tempBillActionList.filter(
        (element) =>
          (element.title &&
            element.title
              .toLowerCase()
              .includes(this.search.toLowerCase())) ||
          (element.createdDate &&
            element.createdDate
              .toLowerCase()
              .includes(this.search.toLowerCase())) ||
          (element.priority &&
            element.priority
              .toLowerCase()
              .includes(this.search.toLowerCase())) ||
          (element.session &&
            element.session
              .toLowerCase()
              .includes(this.search.toLowerCase())) ||
          (element.status &&
            element.status
              .toLowerCase()
              .includes(this.search.toLowerCase()))
      );
    } else {
      this.billsForAction = this.tempBillActionList;
    }
  }

  searchSubmitList() {
    if (this.search) {
      this.submittedBillsList = this.tempSubmitList.filter(
        (element) =>
          (element.title &&
            element.title
              .toLowerCase()
              .includes(this.search.toLowerCase())) ||
          (element.bill.createdDate &&
            element.bill.createdDate
              .toLowerCase()
              .includes(this.search.toLowerCase())) ||
          (element.bill.priority &&
            element.bill.priority
              .toLowerCase()
              .includes(this.search.toLowerCase())) ||
          (element.bill.session &&
            element.bill.session
              .toLowerCase()
              .includes(this.search.toLowerCase())) ||
          (element.bill.status &&
            element.bill.status
              .toLowerCase()
              .includes(this.search.toLowerCase()))
      );
    } else {
      this.submittedBillsList = this.tempSubmitList;
    }
  }
  searchMyBillList(search) {
    if (search) {
      this.myBills = this.tempMyBillsList.filter(
        (element) =>
          (element.title && element.title.toLowerCase().includes(search.toLowerCase())) ||
          (element.bill.createdDate &&element.bill.createdDate.toLowerCase().includes(search.toLowerCase())) ||
          (element.bill.priority &&element.bill.priority.toLowerCase().includes(search.toLowerCase())) ||
          (element.bill.session &&element.bill.session.toLowerCase().includes(search.toLowerCase())) ||
          (element.bill.status &&element.bill.status.toLowerCase().includes(search.toLowerCase()))
      );
    } else {
      this.myBills = this.tempMyBillsList;
    }
  }


  searchAssignedList() {
    if (this.search) {
      this.assisgnedBillsList = this.tempassignedList.filter(
        (element) =>
          (element.title &&
            element.title
              .toLowerCase()
              .includes(this.search.toLowerCase())) ||
          (element.bill.createdDate &&
            element.bill.createdDate
              .toLowerCase()
              .includes(this.search.toLowerCase())) ||
          (element.bill.priority &&
            element.bill.priority
              .toLowerCase()
              .includes(this.search.toLowerCase())) ||
          (element.bill.session &&
            element.bill.session
              .toLowerCase()
              .includes(this.search.toLowerCase())) ||
          (element.bill.status &&
            element.bill.status
              .toLowerCase()
              .includes(this.search.toLowerCase()))
      );
    } else {
      this.assisgnedBillsList = this.tempassignedList;
    }
  }
  searchVettedList() {
    if (this.search) {
      this.completedVettingBills = this.tempVettedList.filter(
        (element) =>
          (element.title &&
            element.title
              .toLowerCase()
              .includes(this.search.toLowerCase())) ||
          (element.bill.createdDate &&
            element.bill.createdDate
              .toLowerCase()
              .includes(this.search.toLowerCase())) ||
          (element.bill.priority &&
            element.bill.priority
              .toLowerCase()
              .includes(this.search.toLowerCase())) ||
          (element.bill.session &&
            element.bill.session
              .toLowerCase()
              .includes(this.search.toLowerCase())) ||
          (element.bill.status &&
            element.bill.status
              .toLowerCase()
              .includes(this.search.toLowerCase()))
      );
    } else {
      this.completedVettingBills = this.tempVettedList;
    }
  }
  showLinks(id) {
    this.tempAllBillList.forEach(element => {
      if (element.billMetaDataDto.id === id) {
        element.viewLinks = true;
      } else {
        element.viewLinks = false;
      }
    });
  }
  showMyLinks(id) {
    this.tempMyBillsList.forEach(element => {
      if (element.bill.id === id) {
        element.viewLinks = true;
      } else {
        element.viewLinks = false;
      }
    });
  }
  showLinkSubmitted(id) {
    this.tempSubmitList.forEach(element => {
      if (element.billMetaDataDto.id === id) {
        element.viewLinks = true;
      } else {
        element.viewLinks = false;
      }
    });
  }
  showLink(id) {
    this.tempBillActionList.forEach(element => {
      if (element.bill.id === id) {
        element.viewLinks = true;
      } else {
        element.viewLinks = false;
      }
    });
  }
  showSubmittedLink(id) {
    this.tempSubmitList.forEach(element => {
      if (element.bill.id === id) {
        element.viewLinks = true;
      } else {
        element.viewLinks = false;
      }
    });
  }
  viewVettedBill(id) {
    this.tempVettedList.forEach(element => {
      if (element.bill.id === id) {
        element.viewLinks = true;
      } else {
        element.viewLinks = false;
      }
    });
  }

  createBill(isCreate) {
    if (isCreate) {
      this.getBillsForAction();
      this.notification.success('Success', 'Private bill updated.');
    }
    this.hideCreateBillMetaForm();
  }
  showCreateBillMetaForm() {
    this.showHideCreateBillMetaform = true;
  }
  hidePopUp() {
    this.showHideCreateBillMetaform = false;
    this.showHideCreateNotice = false;
  }
  hideCreateBillMetaForm() {
    this.showHideCreateBillMetaform = false;
  }
  sort(sort: { key: string; value: string }): void {
    const data = this.tempBillList.filter((item) => item);
    if (sort.key && sort.value) {
      this.billList = data.sort((a, b) =>
        sort.value === "ascend"
          ? a[sort.key!].toLowerCase() > b[sort.key!].toLowerCase()
            ? 1
            : -1
          : b[sort.key!].toLowerCase() > a[sort.key!].toLowerCase()
            ? 1
            : -1
      );
    } else {
      this.billList = data;
    }
  }
  balloting() {
    this.router.navigate(['business-dashboard/pmbr/balloting'])
  }
  getSubmittedBillList() {
    this.pmbrCommonService.getSubmittedBills().subscribe(res => {
      this.submittedBillsList = this.tempSubmitList = res;
    });
  }
  onItemChecked(id, checked): void {
    // this.pmbillId = id;
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }
  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }
  _checkAllRows(value: boolean): void {
    this.listOfCurrentPageData.forEach((item) =>
      this.updateCheckedSet(item.id, value)
    );
    this.refreshCheckedStatus();
  }
  refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every((item) =>
      this.setOfCheckedId.has(item.id)
    );
    this.indeterminate =
      this.listOfCurrentPageData.some((item) =>
        this.setOfCheckedId.has(item.id)
      ) && !this.checked;
  }
  assignTOAssistant() {
    this.isAssignVisible = false;
    const body = {
      id: [...this.setOfCheckedId],
      assignedTo: this.radioValue,
      actionTaken: 0
    };
    this.pmbrCommonService.soAssigntoAssistant(body).subscribe((Res) => {
      this.setOfCheckedId = new Set<any>();
      this.radioValue = null;
      this.getSubmittedBillList();
      this.getVettingCompletedBills();
      this.notification.create(
        'success',
        'Success',
        'Bill Assigned Succesfully!'
      );
    });
  }
  getAssignedBillList() {
    this.pmbrCommonService.getAssignedbills().subscribe(res => {
      this.assisgnedBillsList = this.tempassignedList = res;
    });
  }
  getBillsForAction() {
    const body = {
      id: this.user.userId,
    }
    this.pmbrCommonService.getBillForAction(body).subscribe(res => {
      this.billsForAction = res;
      this.tempBillActionList = res;
    });
  }
  getMyBills() {
    const body = {
      id: this.user.userId,
    }
    this.pmbrCommonService.getBillsProcessedByAssistant(body).subscribe(res => {
      this.myBills = this.tempMyBillsList = res;
    });
  }
  getAssistants() {
    this.pmbrCommonService.getAssisstantList(['PMBR_ASSISSTANT']).subscribe((Res) => {
      this.assistantList = Res;
    });
  }
  createFilePop(id) {
    this.pmbillId = id;
    this.createFilePopUp = true;
  }
  onCancelCreateFilePopup() {
    this.createFilePopUp = false;
    this.isAssignVisible = false;
    this.radioValue = null;
  }
  createFile() {
    const body = {
      billId: null,
      pmbrScheduleId: null,
      pmBillId: this.pmbillId,
      fileForm: {
        assemblyId: this.assemblyId,
        sessionId: this.sessionId,
        currentNumber: null,
        description: this.file.description,
        status: "SAVED",
        subject: this.file.subject,
        activeSubTypes: ["PM_BILL"],
        subtype: "PM_BILL",
        type: "PMBR",
        // userId: 521,
        userId: this.user.userId,
        priority: this.file.priority
      },
      priorityMasterId: 0
    };

    this.pmbrBillService.createBillFile(body).subscribe((Res: any) => {
      this.notification.success(
        "Success",
        "File Created with file number :" + Res.fileResponse.fileNumber
      );
      this.file = {
        subject: "",
        priority: null,
        description: "",
      };
      setTimeout(() => {
        this.router.navigate(["business-dashboard/pmbr/file-view", Res.fileResponse.fileId]);
      }, 1500);
    });
    this.createFilePopUp = false;
  }

  assignModal() {
    this.isAssignVisible = true;
  }
  getVettingCompletedBills() {
    this.pmbrCommonService.completedVettingBills().subscribe((Res) => {
      this.completedVettingBills = this.tempVettedList = Res;
      // console.log(this.completedVettingBills);
    });
  }


  resubmitFile(id, fileId) {
    const body = {
      pmBillId: id,
      fileForm: {
        fileId: fileId,
        activeSubTypes: ["PM_BILL"],
        type: "PMBR",
        userId: this.user.userId,
        subtype: "PM_BILL",

      }

    }
    this.pmbrCommonService.attachToFile(body).subscribe((Res: any) => {
      this.notification.success("Success","File Resubmitted Successfully");
      // setTimeout(() => {
        this.router.navigate(["business-dashboard/pmbr/file-view", Res.fileResponse.fileId]);
      // }, 1500);
      // this.router.navigate(["business-dashboard/pmbr/file-list"]);
    });
  }
  cancel() {

  }

  viewBill(id) {
    this.router.navigate(['business-dashboard/pmbr/bill-view', id]);
    // this.router.navigate(['business-dashboard/pmbr/bill-register-list']);
  }
  billRegister(billId) {
    const body = {
      billId: billId
    }
    this.pmbrCommonService.addBillRegister(body).subscribe((Res: any) => {
      this.notification.success(
        "Success",
        "Bill added to Register"
      );
      this.router.navigate(['business-dashboard/pmbr/bill-register-list']);
    });
  }
  editMetaData(billId) {
    this.selectedBillId = billId;
    this.showHideCreateBillMetaform = true;
  }
  viewFile(id) {
    this.router.navigate(['business-dashboard/pmbr/file-view/', id]);
  }

}
