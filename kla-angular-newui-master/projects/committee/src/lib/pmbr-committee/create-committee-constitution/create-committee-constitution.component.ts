import { Component, EventEmitter, Inject, OnInit, Output } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { NzNotificationService } from "ng-zorro-antd";
import { forkJoin } from "rxjs";
import { CommitteeService } from "../../shared/services/committee.service";
import { CommitteecommonService } from "../../shared/services/committeecommon.service";

@Component({
  selector: "committee-create-committee-constitution",
  templateUrl: "./create-committee-constitution.component.html",
  styleUrls: ["./create-committee-constitution.component.css"],
})
export class CreateCommitteeConstitutionComponent implements OnInit {
  validateCommittee: FormGroup;
  committeeCategories: [];
  committeeSubjects: [];
  user;
  assemblySessionObj = {
    assembly: [],
    session: [],
    currentAssembly: "",
    currentSession: "",
    currentAssemblyLbl: "",
  };
  @Output() hideCreateModel = new EventEmitter();
  subjectIds: any = [];

  constructor(
    private fb: FormBuilder,
    private common: CommitteecommonService,
    @Inject("authService") private authService,
    private committee: CommitteeService,
    @Inject("notify") public notify,
    private notification: NzNotificationService,
    private router: Router
  ) {
    this.user = authService.getCurrentUser();
  }

  ngOnInit() {
    this.formValidation();
    this.getCategory();
  }

  formValidation() {
    this.validateCommittee = this.fb.group({
      name: [null, [Validators.required]],
      category: [null, [Validators.required]],
      filesubject: [null, [Validators.required]],
      subjectId: null,
      subjectIds: [[null], [Validators.required]],
      priority: [null, [Validators.required]],
      description: [null, [Validators.required]],
      sectionId: null,
    });
  }
  getCategory() {
    if (this.user) {
      this.common
        .getCategoryBySectionId(this.user.correspondenceCode.id)
        .subscribe((res: any) => {
          this.committeeCategories = res;
          this.getAssemblySession();
        });
    }
  }

  getSubject() {
    const category = this.validateCommittee.value.category;
    this.common.getSubjectByCategoryId(category).subscribe((res: any) => {
      this.committeeSubjects = res;
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
      for (const i in this.validateCommittee.controls) {
        this.validateCommittee.controls[i].markAsDirty();
        this.validateCommittee.controls[i].updateValueAndValidity();
      }
      return;
    }
    let type = "COMMITTEE_FILE";
    this.subjectIds.push(this.validateCommittee.value.subjectId);
    this.validateCommittee.get("subjectIds").setValue(this.subjectIds);
    let formData = this.validateCommittee.value;
    const body = {
      assemblyId: this.assemblySessionObj.currentAssembly,
      categoryId: formData.category,
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
      subjectIds: this.subjectIds,
      sectionId: this.user.correspondenceCode.id,
    };
    this.committee.createFile(body).subscribe((Res: any) => {
      this.notification.success(
        "Success",
        "File Created with fileNumber " + Res.fileResponse.fileNumber
      );
      this.router.navigate([
        "business-dashboard/committee/pmbr-commitee/file-view/",
        Res.fileResponse.fileId,
      ]);
      this.CancelFilePopUp();
    });
  }
  CancelFilePopUp() {
    this.hideCreateModel.emit(false);
  }
}
