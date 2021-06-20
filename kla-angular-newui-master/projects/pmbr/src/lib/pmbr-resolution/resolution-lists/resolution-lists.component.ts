import { Component, OnInit, Inject } from '@angular/core';
import { PmbrCommonService } from '../../shared/services/pmbr-common.service';
import { PmbrResolutionService } from '../shared/services/pmbr-resolution.service';
import { Data, Router, ActivatedRoute } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { PmbrBillService } from '../../pmbr-bill/shared/services/pmbr-bill.service';
@Component({
  selector: 'pmbr-resolution-lists',
  templateUrl: './resolution-lists.component.html',
  styleUrls: ['./resolution-lists.component.css']
})
export class ResolutionListsComponent implements OnInit {
  fileId;
  id;
  file = {
    subject: "",
    priority: null,
    description: "",
  };
  resolutionList: any = [];
  resolutionForAction: any = [];
  tempResolutionProcessed: any = [];
  resolutionProcessed: any = [];
  tempResolutionForActionList: any = [];
  tempResolutionList: any = [];
  resolutionSubmittedList: any = [];
  tempResolutionSubmittedList: any = [];
  isAssignVisible = false;
  setOfCheckedId = new Set<any>();
  searchSubmitted;
  searchResolution;
  searchAssigned;
  searchForAction;
  searchMyResolution;
  listOfCurrentPageData: Data[] = [];
  checked = false;
  indeterminate = false;
  radioValue: any = null;
  createFilePopUp = false;
  assistantList: any = [];
  resolutionAssignedList: any = [];
  tempResolutionAssignedList: any = [];
  passedResolutions = [];
  colCheckboxes = [
    { id: 0, label: 'bill', check: true, disable: false },
    { id: 1, label: 'type of bill', check: true, disable: false },
    { id: 2, label: 'language', check: true, disable: false },
    { id: 3, label: 'honblemember', check: true, disable: false },
    { id: 4, label: 'department', check: true, disable: false },
    { id: 5, label: 'status', check: true, disable: false },
    { id: 6, label: 'action', check: true, disable: false}
  ];
  user;
  submittedResolution;
  assistant;
  lottingId;
  showHideResolutionMetaData = false;
  selectedResolutionId;
  constructor(private pmbrCommonService: PmbrResolutionService,
    @Inject('authService') private AuthService,
    private notification: NzNotificationService,
    private pmbrService: PmbrCommonService, private router: Router,
    private pmbrBillService: PmbrBillService,) {
    this.user = AuthService.getCurrentUser();
    if (this.user.authorities[0] === 'sectionOfficer') {
      this.submittedResolution = true;
    }
    if (this.user.authorities[0] === 'assistant') {
      this.assistant = true;
    }
    this.pmbrService.setPermissions(this.user.rbsPermissions);
  }

  ngOnInit() {
    this.getAssistants();
    this.getSubmittedResolutionList();
    this.getResolutionList();
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
  getResolutionList() {
    const body = {
      assemblyId: 0,
      assignedTo: 0,
      departmentId: null,
      isGovernerRecommendation: false,
      isOrdinance: false,
      natureOfBill: "string",
      sessionId: 0,
      status: [
        null
      ],
      type: "PRIVATE_MEMBER_RESOLUTION",

    }
    this.pmbrCommonService.getResolutionList(body).subscribe(res => {
      this.resolutionList = this.tempResolutionList = res;
    });
  }
  searchResolutionList() {
    if (this.searchResolution) {
      this.resolutionList = this.tempResolutionList.filter(
        (element) => (element.billMetaDataDto.title && element.billMetaDataDto.title
          .toLowerCase().includes(this.searchResolution.toLowerCase())) ||
          (element.billMetaDataDto.createdDate && element.billMetaDataDto.createdDate
            .toLowerCase().includes(this.searchResolution.toLowerCase())) ||
          (element.billMetaDataDto.priority && element.billMetaDataDto.priority
            .toLowerCase().includes(this.searchResolution.toLowerCase())) ||
          (element.billMetaDataDto.session && element.billMetaDataDto.session
            .toLowerCase().includes(this.searchResolution.toLowerCase())) ||
          (element.billMetaDataDto.status && element.billMetaDataDto.status
            .toLowerCase().includes(this.searchResolution.toLowerCase()))
      );
    } else {
      this.resolutionList = this.tempResolutionList;
    }
  }
  getSubmittedResolutionList() {
    this.pmbrCommonService.getResolutionSubmittedList().subscribe(res => {
      this.resolutionSubmittedList = this.tempResolutionSubmittedList = res;
    });
  }
  searchSubmittedList() {
    if (this.searchSubmitted) {
      this.resolutionSubmittedList = this.tempResolutionSubmittedList.filter(
        (element) =>
          (element.title && element.title.toLowerCase().includes(this.searchSubmitted.toLowerCase())) ||
          (element.bill.type && element.bill.type.toLowerCase().includes(this.searchSubmitted.toLowerCase())) ||
          (element.bill.language && element.bill.language.toLowerCase().includes(this.searchSubmitted.toLowerCase())) ||
          (element.bill.minister && element.bill.minister.toLowerCase().includes(this.searchSubmitted.toLowerCase())) ||
          (element.bill.department && element.bill.department.toLowerCase().includes(this.searchSubmitted.toLowerCase())) ||
          (element.bill.status && element.bill.status.toLowerCase().includes(this.searchSubmitted.toLowerCase()))
      );
    } else {
      this.resolutionSubmittedList = this.tempResolutionSubmittedList;
    }
  }
  showLinks(id) {
    this.tempResolutionForActionList.forEach(element => {
      if (element.bill.id === id) {
        element.viewLinks = true;
      } else {
        element.viewLinks = false;
      }
    });
  }
  showResolutionLinks(id) {
    this.tempResolutionList.forEach(element => {
      if (element.billMetaDataDto.id === id) {
        element.viewLinks = true;
      } else {
        element.viewLinks = false;
      }
    });
  }
  showAssignedLinks(id) {
    this.tempResolutionAssignedList.forEach(element => {
      if (element.bill.id === id) {
        element.viewLinks = true;
      } else {
        element.viewLinks = false;
      }
    });
  }
  showMyResolutionLinks(id) {
    this.tempResolutionProcessed.forEach(element => {
      if (element.bill.id === id) {
        element.viewLinks = true;
      } else {
        element.viewLinks = false;
      }
    });
  }
  assignModal() {
    this.isAssignVisible = true;

  }
  attachFile(event) {
    // this.createFilePopUp = true;
    this.fileId = event.fileId;
    this.id = event.bill.id;
    this.lottingId = event.sheduleLottResultId;
    if (event.bill.departmentId > 0) {
      this.attachToFile();
    }
    else {
      this.notification.warning('Warning', 'Please update department..')
    }
  }
  onCancelCreateFilePopup() {
    this.createFilePopUp = false;
    this.isAssignVisible = false;
    this.radioValue = null;
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
      this.getSubmittedResolutionList();
      this.notification.create(
        'success',
        'Success',
        'Resolution Assigned Succesfully!'
      );
    });
  }
  getAssistants() {
    this.pmbrService.getAssisstantList(['PMBR_ASSISSTANT']).subscribe((Res) => {
      this.assistantList = Res;
    });
  }
  getAssignedResolutionList() {
    this.pmbrCommonService.soAssignedList().subscribe(res => {
      this.resolutionAssignedList = this.tempResolutionAssignedList = res;
    });
  }
  searchAssignedList() {
    if (this.searchAssigned) {
      this.resolutionAssignedList = this.tempResolutionAssignedList.filter(
        (element) =>
          (element.title && element.title.toLowerCase().includes(this.searchAssigned.toLowerCase())) ||
          (element.bill.type && element.bill.type.toLowerCase().includes(this.searchAssigned.toLowerCase())) ||
          (element.bill.language && element.bill.language.toLowerCase().includes(this.searchAssigned.toLowerCase())) ||
          (element.bill.minister && element.bill.minister.toLowerCase().includes(this.searchAssigned.toLowerCase())) ||
          (element.bill.department && element.bill.department.toLowerCase().includes(this.searchAssigned.toLowerCase())) ||
          (element.bill.status && element.bill.status.toLowerCase().includes(this.searchAssigned.toLowerCase()))
      );
    } else {
      this.resolutionAssignedList = this.tempResolutionAssignedList;
    }
  }
  getResolutionsForAction() {
    const body = {
      id: this.user.userId,
    }
    this.pmbrCommonService.getResolutionForAction(body).subscribe(res => {
      this.resolutionForAction = this.tempResolutionForActionList = res;
    });
  }
  searchResolutionForActionList() {
    if (this.searchForAction) {
      this.resolutionForAction = this.tempResolutionForActionList.filter(
        (element) =>
          (element.title && element.title.toLowerCase().includes(this.searchForAction.toLowerCase())) ||
          (element.bill.type && element.bill.type.toLowerCase().includes(this.searchForAction.toLowerCase())) ||
          (element.bill.language && element.bill.language.toLowerCase().includes(this.searchForAction.toLowerCase())) ||
          (element.bill.minister && element.bill.minister.toLowerCase().includes(this.searchForAction.toLowerCase())) ||
          (element.bill.department && element.bill.department.toLowerCase().includes(this.searchForAction.toLowerCase())) ||
          (element.bill.status && element.bill.status.toLowerCase().includes(this.searchForAction.toLowerCase()))
      );
    } else {
      this.resolutionForAction = this.tempResolutionForActionList;
    }
  }
  getResolutionsProcessed() {
    const body = {
      id: this.user.userId,
    }
    this.pmbrCommonService.getResolutionProcessedByAssistant(body).subscribe(res => {
      this.resolutionProcessed = this.tempResolutionProcessed = res;
    });
  }
  searchMyResolutionList() {
    if (this.searchMyResolution) {
      this.resolutionProcessed = this.tempResolutionProcessed.filter(
        (element) =>
          (element.title && element.title.toLowerCase().includes(this.searchMyResolution.toLowerCase())) ||
          (element.bill.type && element.bill.type.toLowerCase().includes(this.searchMyResolution.toLowerCase())) ||
          (element.bill.language && element.bill.language.toLowerCase().includes(this.searchMyResolution.toLowerCase())) ||
          (element.bill.minister && element.bill.minister.toLowerCase().includes(this.searchMyResolution.toLowerCase())) ||
          (element.bill.department && element.bill.department.toLowerCase().includes(this.searchMyResolution.toLowerCase())) ||
          (element.bill.status && element.bill.status.toLowerCase().includes(this.searchMyResolution.toLowerCase()))
      );
    } else {
      this.resolutionProcessed = this.tempResolutionProcessed;
    }
  }
  attachToFile() {
    const body = {
      pmBillId: this.id,
      billId: this.id,
      pmbrLottingId: this.lottingId,
      fileForm: {
        assemblyId: 1,
        sessionId: 4,
        fileId: this.fileId,
        currentNumber: null,
        description: this.file.description,
        status: "SAVED",
        subject: this.file.subject,
        activeSubTypes: ["PM_RESOLUTION"],
        requestedAdditionalSubtype: ["PM_RESOLUTION"],
        type: "PM_RESOLUTION",
        userId: this.user.userId,
        subtype: "PM_RESOLUTION",
        priority: this.file.priority
        // pmbrScheduleId: this.ballotResult.pmbrScheduleId    
      }
    }
    this.pmbrService.resubmitOrAttachFile(body).subscribe((Res: any) => {
      this.notification.success(
        "Success",
        "File Attached Successfully"
      );
      this.router.navigate(['business-dashboard/pmbr/file-view/', Res.fileResponse.fileId]);
      // this.router.navigate(['business-dashboard/pmbr/file-view/'], Res.fileResponse.fileId);
    });
  }
  createFile() {
    const body = {
      billId: null,
      resolutionLottingResultId: this.lottingId,
      id: this.id,
      // pmbrLottingId: this.lottingId,
      fileForm: {
        assemblyId: 1,
        sessionId: 4,
        currentNumber: null,
        description: this.file.description,
        status: "SAVED",
        subject: this.file.subject,
        activeSubTypes: ["PM_RESOLUTION"],
        subtype: "PM_RESOLUTIONL",
        type: "PM_RESOLUTION",
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
  updateOrCancelResolutionMetaData(res) {
    if (res) {
      this.notification.success('Success', 'Resolution updated succesfully..');
      this.getResolutionsForAction();
    }
    this.hidePopUp();
  }
  editResolutionMetaData(resolutionId) {
    this.selectedResolutionId = resolutionId;
    this.showHideResolutionMetaData = true;
  }
  hidePopUp() {
    this.showHideResolutionMetaData = false;
  }
  viewFile(fileId) {
    this.router.navigate(['business-dashboard/pmbr/file-view/', fileId]);
  }

  updateResolutionStatus(id, index) {
    this.pmbrCommonService.updateResolutionPresentStatus(id).subscribe(data => {
      this.resolutionList[index].billMetaDataDto.stage = 'FIRST_READING_COMPLETED';
      this.notification.success('Success', 'Resolution status updated successfully');
      this.getResolutionList();
    });
  }
  updateFinalResolutionPresent(id, index) {
    this.pmbrCommonService.updateResolutionFinalPresentStatus(id).subscribe(data => {
      this.resolutionList[index].billMetaDataDto.stage = 'SECOND_READING_COMPLETED';
      this.notification.success('Success', 'Resolution status updated successfully');
      this.getResolutionList();
    });
  }
  isMLA() {
    return this.AuthService.getCurrentUser().authorities.includes('MLA');
  }
  viewResolutionContent(resolutionId) {
    this.router.navigate(["business-dashboard/pmbr/resolution-view", resolutionId]);
  }
}
