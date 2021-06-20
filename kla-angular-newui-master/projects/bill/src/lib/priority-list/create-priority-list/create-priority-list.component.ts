import { Component, OnInit, Inject } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProrityListService } from '../../shared/services/prority-list.service';
import { BillcommonService } from '../../shared/services/billcommon.service';
import { BillManagementService } from '../../shared/services/bill-management.service';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { FileServiceService } from '../../shared/services/file-service.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'lib-create-priority-list',
  templateUrl: './create-priority-list.component.html',
  styleUrls: ['./create-priority-list.component.css']
})
export class CreatePriorityListComponent implements OnInit {
  correspondenceId;
  billSearchParam = "";
  user;
  routeData;
  priorityListResponse;
  buttonControls = {
    save: false,
    submit: false,
    delete: false,
    addBill: false,
    removeBill: false,
    addBillRef: false,
    send: false,
    saveOrder: false,
    createBulletin: false,
    createFile: false,
    scheduleOfBills: false
  }
  ckeConfig: any;
  public Editor: any;
  categorys = [];
  listId;
  requestId;
  category;
  listlines = [];
  showBillSelection = false;
  allBillsLoaded = false;
  showAddBillReference = false;
  allBills = [];
  assemblies = [];
  sessions = [];
  billForm = this.fb.group({
    id: [null],
    assemblyId: [null, Validators.required],
    sessionId: [null, Validators.required],
    header: [""],
    status: ['SAVED'],
    categorys: []
  });
  assemblyId;
  sessionId;
  initialDaysModal = false;
  disableDates = false;
  fileStatus: any;
  withCurrentUser = false;
  bulletinData: any;
  showBulletinPart2Popup = false;
  assemblySession: any = null;

  constructor(
    @Inject('editor') public ckEditor,
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private common: BillcommonService,
    private service: ProrityListService,
    private billService: BillManagementService,
    private notify: NzNotificationService,
    private fileService: FileServiceService,
    @Inject("authService") private AuthService,
    private modalService: NzModalService,
    public translate: TranslateService
  ) {
    this.user = AuthService.getCurrentUser();
    this.common.setBillPermissions(this.user.rbsPermissions);
    this.Editor = ckEditor;
    this.listId = this.route.snapshot.params.id;
    this.requestId = this.route.snapshot.params.requestId;
    this.assemblyId = this.route.snapshot.params.assemblyId;
    this.sessionId = this.route.snapshot.params.sessionId;
  }

  ngOnInit() {
    this.routeData = window.history.state.data;
    this.setEditorConfig();
    this.getAssemblySession();

  }

  get billFormcontrol() { return this.billForm.controls; }

  isAssistant() {
    return (this.user.authorities.includes('assistant'));
  }

  setEditorConfig() {
    this.ckeConfig = {
      toolbar: [
        "bold",
        "italic",
        "underline",
        "bulletedList",
        "numberedList",
        "alignment"
      ],
      placeholder: "Enter Header Here...",
      title: {
        isEnabled: false,
      },
    };
  }

  setRBSPermisson(status) {
    if (!this.requestId) {
      if (status == 'SAVED') {
        this.buttonControls.save = true;
        if (this.common.doIHaveAnAccess("PRIORITY_LIST", "SUBMIT")) {
          this.buttonControls.submit = true;
          this.buttonControls.delete = true;
        }
      }
      else if (status == 'SUBMITTED') {
        if (this.common.doIHaveAnAccess("PRIORITY_LIST", "APPROVE"))
          this.buttonControls.save = true;
      }
      else if (status == 'SEND_TO_LEGISLATION') {
        if (this.common.doIHaveAnAccess("PRIORITY_LIST", "APPROVE")) {
          this.buttonControls.save = true;
        }
        if (!this.common.doIHaveAnAccess("PRIORITY_LIST", "APPROVE") && !this.common.doIHaveAnAccess("PRIORITY_LIST", "SUBMIT") && !this.priorityListResponse.fileId)
          this.buttonControls.saveOrder = true;
        else if (this.priorityListResponse.fileId && this.routeData && this.routeData.currentAssignee)
          this.buttonControls.saveOrder = true;
      }
    }
    else {
      if (this.common.doIHaveAnAccess("PRIORITY_LIST_REQUEST", "APPROVE"))
        this.buttonControls.send = true;
    }
    if (this.common.doIHaveAnAccess("BULLETIN", "CREATE")) {
      this.buttonControls.createBulletin = true;
    }
    if (this.common.doIHaveAnAccess("PRIORITY_LIST_REQUEST", "CREATE")) {
      this.buttonControls.createFile = true;
    }
    if (this.common.doIHaveAnAccess("SCHEDULE_OF_BILLS", "UPDATE")) {
      this.buttonControls.scheduleOfBills = true;
    }
  }

  getAssemblySession() {
    this.common.getAllAssemblyAndSession()
    .subscribe((response) => {
      this.assemblySession = response.assemblySession;
      this.assemblies = response.assembly;
      const res = this.assemblies.map((x) => x.assemblyId);
      let maxNumber = Math.max.apply(null, res);
      this.billForm.controls.assemblyId.setValue(this.assemblies.find(x => x.assemblyId === maxNumber).id);
      this.getSessionForAssembly();
      // this.sessions = session as Array<any>;
      // const result = this.sessions.map((x) => x.id);
      // let maxValue = Math.max.apply(null, result);
      // this.billForm.controls.sessionId.setValue(maxValue);
      if (this.listId)
        this.getPrioritytList(this.listId);
      else if (this.routeData) {
        this.service.getPriorityListByAssemblySession(this.routeData.assembly, this.routeData.session)
          .subscribe((res: any) => {
            if (res && res.id) {
              this.priorityListResponse = res;
              this.billForm.patchValue(res, { emitEvent: false });
              this.setRBSPermisson(this.billForm.controls.status.value);
              this.categorys = res.categorys;
              this.setRouteDataToCategory();
            }
            else {
              this.getPriorityListCategories();
            }
          })
      }
      else {
        this.getPriorityListCategories();
      }

    });
  }

  getSessionForAssembly() {
    this.billForm.controls.sessionId.reset();
    this.sessions = [];
    if (this.assemblySession.find(x => x.id === this.billForm.value.assemblyId)) {
      this.sessions = this.assemblySession.find(x => x.id === this.billForm.value.assemblyId).session;
    }
  }

  setRouteDataToCategory() {
    let index = this.categorys.findIndex(element => element.id == this.routeData.categoryTitle);
    this.listlines = this.categorys[index].priorityList;
    this.categorys[index].priorityList = [];
    setTimeout(() => {
      let billApplyed = [];
      billApplyed = this.routeData.bills;
      let index = this.categorys.findIndex(element => element.id == this.routeData.categoryTitle);
      const currentBills = this.listlines;
      billApplyed.forEach(element => {
        currentBills.push(
          {
            "billId": element.id,
            "id": null,
            "priority": null,
            "priorityOrder": null,
            'billTitle': element.title,
             'bill':element
          });
        this.removeFromBillList(element);
      });
      this.categorys[index].priorityList = currentBills;
    }, 0);
  }
  getPriorityListCategories() {
    this.service.getPriorityLstCategories().subscribe((res: any) => {
      if (res) {
        this.categorys = res;
        this.categorys.forEach(element => {
          element.priorityList = [];
        });
        this.setRBSPermisson(this.billForm.controls.status.value);
        if (this.routeData) {
          this.setRouteDataToCategory();
        }
      }
    })
  }

  getPrioritytList(listId) {
    this.service.getPriorityListById(listId).subscribe((res: any) => {
      this.getFileStatus(res.fileId);
      this.priorityListResponse = res;
      this.billForm.patchValue(res, { emitEvent: false });
      this.setRBSPermisson(this.billForm.controls.status.value);
      this.categorys = res.categorys
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

  getAllBills(categoryId) {
    const assemblyId = this.billForm.get('assemblyId').value;
    const sessionId = this.billForm.get('sessionId').value;
    this.billService.getAllBillsNotAddedInPriorityList(assemblyId, sessionId, categoryId).subscribe((res: any) => {
      this.allBills = res.filter(res => !this.categorys.some(cat => cat.priorityList.some(bill => bill.billId == res.id)));
      this.allBillsLoaded = true;
    });
  }
  savePrioriryList() {
    if (this.billForm.valid) {
      this.setBlockOrder();
      this.billForm.get('categorys').setValue(this.categorys);
      this.service.savePriorityList(this.billForm.value).subscribe((res: any) => {
        this.notify.success("Success.", "Priority List Saved.");
        this.backToList();
      });
    }
    else {
      for (const key in this.billForm.controls) {
        this.billForm.controls[key].markAsDirty();
        this.billForm.controls[key].updateValueAndValidity();
      }
    }
  }
  submitPrioriryList() {
    if (this.billForm.valid) {
      this.setBlockOrder();
      this.billForm.get('categorys').setValue(this.categorys);
      this.service.submitPriorityList(this.billForm.value).subscribe((res: any) => {
        this.notify.success("Success.", "Priority List Submitted.")
        this.backToList();
      });
    }
    else {
      for (const key in this.billForm.controls) {
        this.billForm.controls[key].markAsDirty();
        this.billForm.controls[key].updateValueAndValidity();
      }
    }
  }

  setBlockOrder() {
    this.categorys.forEach(block => {
      block.priorityList.forEach((line, index) => {
        line.priority = line.priorityOrder = index;
      });
    });
  }
  backToList() {
    window.history.back();
  }

  addBillToList() {
    let index = this.categorys.findIndex(element => element.id == this.category.id);
    this.listlines = this.categorys[index].priorityList;
    this.categorys[index].priorityList = [];
    setTimeout(() => {
      let billApplyed = [];
      billApplyed = this.allBills.filter((x) => x.checked === true);
      let index = this.categorys.findIndex(element => element.id == this.category.id);
      const currentBills = this.listlines;
      billApplyed.forEach(element => {
        currentBills.push(
          {
            "billId": element.id,
            "id": null,
            "priority": null,
            "priorityOrder": null,
            'billTitle': element.title,
            'bill':element
          });
        this.removeFromBillList(element);
      });
      this.categorys[index].priorityList = currentBills;
      this.cancelBillSelection();
      this.showBillSelection = false;
    }, 0);

  }

  removeFromBillList(bill) {
    this.allBills = this.allBills.filter(element => element.id != bill.id);
  }

  addToBillList(bill) {
    this.allBills.push({ id: bill.billId, title: bill.billTitle });
  }
  removeFromList(bill, category) {
    let index = this.categorys.findIndex(element => element.id == category.id);
    this.categorys[index].priorityList = this.categorys[index].priorityList.filter(element => element.billId != bill.billId);
    this.addToBillList(bill);
  }
  openBillSelection(category) {
    this.billSearchParam = "";
    this.getAllBills(category.id);
    this.category = category;
    this.showBillSelection = true;
  }

  cancelBillSelection() {
    this.category = {};
    this.listlines = [];
    this.showBillSelection = false;
    for (let i = 0; i < this.allBills.length; i++) {
      if (this.allBills[i].checked) {
        this.allBills[i].checked = false;
      }
    }
  }
  openBillReference(category) {
    this.category = category;
    this.showAddBillReference = true;
  }

  cancelAddBillReference() {
    this.category = {};
    this.listlines = [];
    this.showAddBillReference = false;
  }

  addBillReferenceToList(billData: any) {
    if (billData) {
      let index = this.categorys.findIndex(element => element.id == this.category.id);
      this.listlines = this.categorys[index].priorityList;
      this.categorys[index].priorityList = [];
      setTimeout(() => {

        const currentBills = this.listlines;
        currentBills.push(
          {
            "billId": billData.id,
            "id": null,
            "priority": null,
            "priorityOrder": null,
            "billTitle": billData.title,
            'bill':billData
          });
        this.categorys[index].priorityList = currentBills;
        this.cancelAddBillReference();
      }, 0);
    }
    else {
      this.cancelAddBillReference();
    }
  }

  showAllBills() {
    return this.allBills;
  }

  sendPrioriryList(requestId, listId) {
    // let body = {
    //   assemblyId: this.priorityListResponse.assemblyId,
    //   sessionId: this.priorityListResponse.sessionId,
    //   id: requestId,
    //   priorityMaster: {
    //     id: listId
    //   }
    // }
    // this.service.sendPriorityListRequestResponse(body).subscribe(res => {
    //   this.notify.success("Success.", "Priority List Sent.")
    //   this.backToList();
    // });
    this.router.navigate(
      ['business-dashboard/correspondence/select-template'],
      {
        state: {
          business: 'PRIORITY_LIST_RESPONSE',
          type: 'LAW',
          fileId: this.priorityListResponse.fileId,
          businessReferId: listId,
          businessReferType: 'PRIORITY_LIST',
          businessReferSubType: 'PRIORITY_LIST_RESPONSE',
          businessReferNumber: null,
          businessReferName: null,
          fileNumber: this.priorityListResponse.fileNumber,
          departmentId: null,
          masterLetter: this.priorityListResponse.bilPriorityRequest.correspondenceId,
          refrenceLetter: this.priorityListResponse.bilPriorityRequest.correspondenceId,
          toCode: 'LEGISLATION_SECTION',
          toDisplayName: 'Legislation Section',
          onSuccess: 'business-dashboard/bill/list-priority-list',
          businessData: {
            assemblyId: this.priorityListResponse.assemblyId,
            sessionId: this.priorityListResponse.sessionId
          }
        },
      }
    );
  }

  showInitialDaysModal(disableDates) {
    this.disableDates = disableDates;
    this.initialDaysModal = true;
  }

  closeInitialDaysModal() {
    this.initialDaysModal = false;
    this.getPrioritytList(this.listId);
  }

  deletePrioriryList() {
    this.service.deletePriorityList(this.listId).subscribe(res => {
      this.notify.success("Success.", "Priority List Deleted.")
      this.backToList();
    });
  }

  resubmitFile(activeSubType, fileContent) {
    let body;
    if (activeSubType === 'BULLETIN') {
      body = {
        fileForm: {
          fileId: this.priorityListResponse.fileId,
          activeSubTypes: [activeSubType],
          type: 'BILL',
          userId: this.user.userId,
          subtype: 'BILL_PRIORITY_LIST_FILE'
        }
      };
    } else {
        body = {
        fileForm: {
          fileId: this.priorityListResponse.fileId,
          activeSubTypes: [activeSubType],
          type: 'BILL',
          userId: this.user.userId,
          subtype: 'BILL_PRIORITY_LIST_FILE'
        },
        priorityMasterId: this.priorityListResponse.id
      };
    }
    if (this.fileStatus === 'APPROVED') {
        this.billService.attachErrataToFile(body).subscribe((Res: any) => {
          this.notify.success(
            'Success',
            'File resubmitted successfully.'
          );
          this.router.navigate(['business-dashboard/bill/file-view/', fileContent, this.priorityListResponse.fileId]);
        });
    } else {
        this.modalService.create({
          nzTitle: 'Resubmit File',
          nzWidth : '500',
          nzContent: '&nbsp;&nbsp;<b>Currently file is under approval flow..Cannot resubmit now... </b>',
          nzOkText: 'OK',
          nzOnOk: () => {},
        });
      }
  }

  createBulletinPart2() {
    this.bulletinData = {
      "businessId": this.priorityListResponse.id,
      "businessType": "PRIORITY_LIST",
      "description": "",
      "fileId": this.priorityListResponse.fileId,
      "part": "2",
      "title": "",
      "type": "PRIORITY_LIST",
      "userId": this.user.userId,
      assemblyId: null,
      sessionId: null
    };
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

  cancelBulletin() {
    this.showBulletinPart2Popup = false;
    this.bulletinData = {};
  }

  afterCreateBulletin(event) {
    if (event) {
      this.notify.success("Success", "Bulletin Created.")
      this.resubmitFile('BULLETIN', 'bulletins');
    }
    this.cancelBulletin();
  }

  scheduleForBill() {
    this.router.navigate(['schedule-for-bill', this.listId], {
      relativeTo: this.route.parent
    });
  }
  romanize(num) {
    if (isNaN(num))
        return NaN;
    let digits = String(+num).split(""),
        key = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM",
            "", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC",
            "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"],
        roman = "",
        i = 3;
    while (i--)
        roman = (key[+digits.pop() + (i * 10)] || "") + roman;
    return Array(+digits.join("") + 1).join("M") + roman;
 }
 getIndex(list,billId){
   let index = list.findIndex(x => x.billId === billId);
   return index;
 }

 viewCorrespondence(){
   this.correspondenceId = this.priorityListResponse.correspondenceId;
  this.router.navigate(["business-dashboard/correspondence/correspondence", "view", this.correspondenceId]);
 }
}
