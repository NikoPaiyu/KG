import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BillcommonService } from '../../shared/services/billcommon.service';
import { Validators, FormBuilder } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ProrityListService } from '../../shared/services/prority-list.service';
import { NzNotificationService } from 'ng-zorro-antd';
import { PriorityListRequestsComponent } from './priority-list-requests/priority-list-requests.component';
import { PriorityListListsComponent } from './priority-list-lists/priority-list-lists.component';

@Component({
  selector: 'lib-list-priority-list',
  templateUrl: './list-priority-list.component.html',
  styleUrls: ['./list-priority-list.component.css']
})
export class ListPriorityListComponent implements OnInit {
  @ViewChild(PriorityListRequestsComponent, { static: false }) childList: PriorityListRequestsComponent;
  @ViewChild(PriorityListListsComponent, { static: false }) childList2: PriorityListListsComponent;
  isRequestModalVisible = false;
  assemblies = [];
  sessions = [];
  user;
  buttonControls = {
    create: false,
    request: false,
    priorityList: false,
    requestList: false
  };
  billForm = this.fb.group({
    id: [null],
    assemblyId: [null, Validators.required],
    sessionId: [null, Validators.required]
  });
  cosId: any = 0;
  file = {
    subject: '',
    priority: null,
    description: '',
  };
  assemblySession: any = null;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private common: BillcommonService,
    private prorityListService: ProrityListService,
    private fb: FormBuilder,
    private notify: NzNotificationService,
    @Inject("authService") private AuthService) {
    this.user = AuthService.getCurrentUser();
    this.common.setBillPermissions(this.user.rbsPermissions);
  }
  ngOnInit() {
    this.setRBSPermisson();
  }

  getAssemblySession() {
      this.common.getAllAssemblyAndSession()
      .subscribe((response: any) => {
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
    });
  }

  getSessionForAssembly() {
    this.billForm.controls.sessionId.reset();
    this.sessions = [];
    if (this.assemblySession.find(x => x.id === this.billForm.value.assemblyId)) {
      this.sessions = this.assemblySession.find(x => x.id === this.billForm.value.assemblyId).session;
    }
  }

  setRBSPermisson() {

    if (this.common.doIHaveAnAccess("PRIORITY_LIST", "CREATE")) {
      this.buttonControls.create = true;
    }
    if (this.common.doIHaveAnAccess("PRIORITY_LIST", "READ")) {
      this.buttonControls.priorityList = true;
    }
    if (this.common.doIHaveAnAccess("PRIORITY_LIST_REQUEST", "CREATE")) {
      this.buttonControls.request = true;
    }
    if (this.common.doIHaveAnAccess("PRIORITY_LIST_REQUEST", "READ")) {
      this.buttonControls.requestList = true;
    }

  }
  createPrioritylist() {
    let path = "../bill/create-priority-list";
    this.router.navigate([path], {
      relativeTo: this.route.parent,
    });
  }

  getCOSId() {
    if (this.billForm.valid) {
      this.prorityListService.getCOSId(this.billForm.value.assemblyId, this.billForm.value.sessionId).subscribe((res: any) => {
        this.cosId = res.calendarofSittingId;
        if (this.cosId === 0) {
          this.notify.warning('Warning.', 'No COS found. Please create COS!');
        }
      });
    }
  }

  requestPriorityList() {
    if (this.billForm.valid) {
      const body = {
        assemblyId: this.billForm.value.assemblyId,
        cosId: null,
        fileForm: {
          assemblyId: this.billForm.value.assemblyId,
          currentNumber: null,
          description: this.file.description,
          sessionId: this.billForm.value.sessionId,
          status: 'saved',
          subject: this.file.subject,
          activeSubTypes: ['BILL_PRIORITY_LIST_FILE'],
          subtype: 'BILL_PRIORITY_LIST_FILE',
          type: 'BILL',
          userId: this.user.userId,
          priority: this.file.priority,
        },
        priorityMasterId: null,
        id: null,
        sessionId: this.billForm.value.sessionId
      };
      this.prorityListService.requestPriorityList(body).subscribe((res: any) => {
        this.notify.success("Success.", "Priority List File Created.");
        this.childList.getData();
        this.isRequestModalVisible = false;
      });
    } else {
      for (const i in this.billForm.controls) {
        this.billForm.controls[i].markAsDirty();
        this.billForm.controls[i].updateValueAndValidity();
      }
    }
  }

  showRequestModal(): void {
    this.getAssemblySession();
    this.isRequestModalVisible = true;
  }

  handleCancel(): void {
    this.isRequestModalVisible = false;
    this.cosId = 0;
  }

  getList() {
    this.childList2.getData();
  }

  getRequest() {
    this.childList.getData();
  }
}
