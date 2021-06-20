import {
  Component,
  OnInit,
  Input,
  Inject,
  EventEmitter,
  Output,
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import {
  UploadFile,
  NzNotificationService,
  NzModalService,
} from "ng-zorro-antd";
import { forkJoin } from "rxjs";
import { CommitteeService } from "../../shared/services/committee.service";
import { CommitteecommonService } from "../../shared/services/committeecommon.service";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
@Component({
  selector: "committee-create-file",
  templateUrl: "./create-file.component.html",
  styleUrls: ["./create-file.component.scss"],
})
export class CreateFileComponent implements OnInit {
  @Input() showCreateModel;
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
  committeeSubjects: any;
  subjectIds: any = [];
  constructor(
    private common: CommitteecommonService,
    private router: Router,
    @Inject("authService") private authService,
    @Inject("notify") public notify,
    private notification: NzNotificationService,
    private committee: CommitteeService,
    private fb: FormBuilder
  ) {
    this.user = authService.getCurrentUser();
  }

  ngOnInit() {
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
      subjectId: null,
      subjectIds: [[null]],
    });
  }
  loadData() {
    this.common
      .getCategoryBySectionId(this.user.correspondenceCode.id)
      .subscribe((res: any) => {
        this.commityCategories = res;
        // if(this.user.correspondenceCode.code == 'SUBJECT_COMMITTEE_B_SECTION'){
        //   this.commityCategories = res.filter(x => x.code == 'SUBJECT_COMMITTEE');
        // }
        // else if(this.user.correspondenceCode.code == 'LEGISLATION_SECTION'){
        //   this.commityCategories = res.filter(x => x.code == 'SELECT_COMMITTEE');
        // }
        this.getAssemblySession();
        this.getActiveAssemblyAndSession();
      });
  }
  getAssemblySession() {
    forkJoin(
      this.common.getAllAssembly(),
      this.common.getAllSession()
    ).subscribe(([assembly, session]) => {
      this.assemblySessionObj.assembly = assembly as Array<any>;
      // const res = this.assemblySessionObj.assembly.map((x) => x.id);
      // this.assemblySessionObj.currentAssembly = Math.max.apply(null, res);

      // const labels = this.assemblySessionObj.assembly.map((x) => x.assemblyId);
      // this.assemblySessionObj.currentAssemblyLbl = Math.max.apply(null, labels);
      this.assemblySessionObj.session = session as Array<any>;
      // const response = this.assemblySessionObj.session.map((x) => x.id);
      // this.assemblySessionObj.currentSession = Math.max.apply(null, response);
    });
  }
  getActiveAssemblyAndSession() {
    this.common.getCurrentAssemblyAndSession().subscribe((res: any) => {
      this.assemblySessionObj.currentAssembly = res.assemblyId;
      this.assemblySessionObj.currentAssemblyLbl = res.assemblyValue;
      this.assemblySessionObj.currentSession = res.sessionId;
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
    this.subjectIds.push(this.validateCommittee.value.subjectId);
    let type = "COMMITTEE_FILE";
    let formData = this.validateCommittee.value;
    const body = {
      assemblyId: this.assemblySessionObj.currentAssembly,
      categoryId: formData.category.id,
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
        "business-dashboard/committee/file-view/",
        Res.fileResponse.fileId,
      ]);
      this.CancelFilePopUp();
    });
  }
  stockValueChanged() {}
  CancelFilePopUp() {
    this.validateCommittee.reset();
    this.hideCreateModel.emit(false);
  }

  // get subject for pmbr committee
  getSubject() {
    const category = this.validateCommittee.value.category.id;
    this.common.getSubjectByCategoryId(category).subscribe((res: any) => {
      this.committeeSubjects = res;
    });
  }
}
