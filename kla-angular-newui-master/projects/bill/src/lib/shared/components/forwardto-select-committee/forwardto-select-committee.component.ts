import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import {
  UploadFile,
  NzNotificationService,
  NzModalService,
} from "ng-zorro-antd";
import { forkJoin } from "rxjs";

import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { BillcommonService } from "../../services/billcommon.service";
import { isNullOrUndefined } from "util";
import { differenceInCalendarDays } from "date-fns";
import { BillViewService } from "../../../bill-full-view/shared/bill-view.service";
@Component({
  selector: "bill-forwardto-select-committee",
  templateUrl: "./forwardto-select-committee.component.html",
  styleUrls: ["./forwardto-select-committee.component.css"],
})
export class ForwardtoSelectCommitteeComponent implements OnInit {
  @Input() billDetails;
  @Output() hideCreateModel = new EventEmitter();
  validateCommittee: FormGroup;
  commityCategories: [];
  assemblySessionObj = {
    assembly: [],
    session: [],
    currentAssembly: "",
    currentSession: "",
    currentAssemblyLbl: "",
  };
  user;
  constructor(
    private common: BillcommonService,
    private router: Router,
    @Inject("authService") private authService,
    @Inject("notify") public notify,
    private notification: NzNotificationService,
    private fb: FormBuilder,
    private billiViewService: BillViewService
  ) {
    this.user = authService.getCurrentUser();
  }

  ngOnInit() {
    console.log(this.billDetails);
    this.formValidation();
    this.loadData();
  }

  formValidation() {
    this.validateCommittee = this.fb.group({
      name: [null, [Validators.required]],
      category: [null, [Validators.required]],
      filesubject: [null, [Validators.required]],
      priority: [null, [Validators.required]],
      description: [null, [Validators.required]],
      forwardedDate: [null, [Validators.required]],
    });
  }
  loadData() {
    this.validateCommittee.patchValue({
      name: this.billDetails.title,
    });
    this.common
      .getCategoryBySectionId(this.user.correspondenceCode.id)
      .subscribe((res: any) => {
        this.commityCategories = res;
        this.getAssemblySession();
      });
  }
  getAssemblySession() {
    forkJoin(
      this.common.getAllAssembly(),
      this.common.getAllSession()
    ).subscribe(([assembly, session]) => {
      this.assemblySessionObj.assembly = assembly as Array<any>;
      const res = this.assemblySessionObj.assembly.map((x) => x.id);
      this.assemblySessionObj.currentAssembly = Math.max.apply(null, res);
      const labels = this.assemblySessionObj.assembly.map((x) => x.assemblyId);
      this.assemblySessionObj.currentAssemblyLbl = Math.max.apply(null, labels);
      this.assemblySessionObj.session = session as Array<any>;
      const response = this.assemblySessionObj.session.map((x) => x.id);
      this.assemblySessionObj.currentSession = Math.max.apply(null, response);
    });
  }
  createFile() {
    if (!this.validateCommittee.valid) {
      // tslint:disable-next-line: forin
      for (const i in this.validateCommittee.controls) {
        this.validateCommittee.controls[i].markAsDirty();
        this.validateCommittee.controls[i].updateValueAndValidity();
      }
      return;
    }
    let type = "COMMITTEE_FILE";
    let formData = this.validateCommittee.value;
    const body = {
      joinCommittees: [],
      parentCommitteeId: null,
      assemblyId: this.assemblySessionObj.currentAssembly,
      categoryId: formData.category,
      committeeCode: "SELECT_COMMITTEE",
      fileForm: {
        assemblyId: this.assemblySessionObj.currentAssembly,
        currentNumber: null,
        description: formData.description,
        sessionId: this.assemblySessionObj.currentSession,
        status: "SAVED",
        subject: formData.filesubject,
        activeSubTypes: [type],
        subtype: type,
        type,
        userId: this.authService.getCurrentUser().userId,
        priority: formData.priority,
      },
      name: formData.name,
      forwardedDate: formData.forwardDate
    };
    this.billiViewService
      .sendToCommittee(this.billDetails.billId, body)
      .subscribe((Res: any) => {
        this.notification.success(
          "Success",
          "File Created with fileNumber " + Res.fileNumber
        );
        this.router.navigate([
          "business-dashboard/committee/file-view/",
          Res.fileId,
        ]);
        this.CancelFilePopUp();
      });
  }

  CancelFilePopUp() {
    this.validateCommittee.reset();
    this.hideCreateModel.emit(false);
  }
  disabledDate = (current: Date): boolean => {
    // Can not select days before today and today
    return differenceInCalendarDays(current, new Date()) < 0;
  };
}
