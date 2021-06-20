import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PmbrCommonService } from 'projects/pmbr/src/lib/shared/services/pmbr-common.service';
import { PmbrResolutionService } from '../../services/pmbr-resolution.service';

@Component({
  selector: 'pmbr-create-resolution-metadata',
  templateUrl: './create-resolution-metadata.component.html',
  styleUrls: ['./create-resolution-metadata.component.css']
})
export class CreateResolutionMetadataComponent implements OnInit {

  resolutionForm: FormGroup
  // current block
  @Input() resolutionId: any;
  @Input() resolutionLottingResultId: any;
  // out put will emit after bill create
  @Output() resolutionCreateOrCancel = new EventEmitter<any>();
  resolutionLanguages = [
    {
      label: "MALAYALAM",
      value: "MAL",
    },
    {
      label: "ENGLISH",
      value: "ENG",
    },
  ];
  ministerDesignationList: any = [];
  departmentList: any = [];
  subjectList: any = [];
  currentUser
  constructor(private formBuilder: FormBuilder, private pmbrResolutionService: PmbrResolutionService,
    private common: PmbrCommonService, @Inject('authService') private AuthService
  ) {
    this.createForm();
    this.currentUser = AuthService.getCurrentUser();
    if (this.currentUser.authorities.includes('assistant')) {
      this.getMemberDesignation();
    }
  }

  ngOnInit() {
    this.createForm();
    if (this.resolutionId) {
      this.getResolutionMetaDetails(this.resolutionId);
    }
  }

  createForm() {
    this.resolutionForm = this.formBuilder.group({
      id: [null],
      language: ['MAL'],
      title: [null, [Validators.required]],
      resolutionLottingResultId: [this.resolutionLottingResultId],
      designationId: [null],
      departmentId: [null],
      subjectId: [null]
    })
  }

  getMemberDesignation() {
    this.common.getMemberDesignation().subscribe((res: any) => {
      this.ministerDesignationList = res;
    });
  }

  getDepartments(portfolioId) {
    if (portfolioId) {
      this.common.getDepartmentList(portfolioId).subscribe((res: any[]) => {
        this.departmentList = res;
        if (!res.some(f => f.id == this.resolutionForm.controls.departmentId.value)) {
          this.resolutionForm.controls['departmentId'].setValue(null);
          this.resolutionForm.controls['subjectId'].setValue(null);
          this.subjectList = null;
        }
      });
    }
  }

  getSubjects(deptId) {
    if (deptId) {
      this.common.getSubjectList(deptId).subscribe((res: any) => {
        this.subjectList = res;
        if (!res.some(f => f.id == this.resolutionForm.controls.subjectId.value)) {
          this.resolutionForm.controls['subjectId'].setValue(null);
        }
      });
    }
  }

  getResolutionMetaDetails(billId) {
    this.pmbrResolutionService.getResolutionById(billId).subscribe((res) => {
      this.patchCreateBillFormData(res)
    })
  }

  patchCreateBillFormData(data) {
    this.resolutionForm.patchValue({
      id: data.id,
      title: data.blocks[0].content,
      language: data.language,
      designationId: data.designationId,
      departmentId: data.departmentId,
      subjectId: data.subjectId
    })
  }

  createResolutionMetadata() {
    for (const i in this.resolutionForm.controls) {
      this.resolutionForm.controls[i].markAsDirty();
      this.resolutionForm.controls[i].updateValueAndValidity();
    }
    if (this.resolutionForm.valid) {
      this.pmbrResolutionService.createResolutionMetadata(this.resolutionForm.value).subscribe((res: any) => {
        this.resolutionCreateOrCancel.emit(res);
      })

    }
  }
  cancelResolution() {
    this.resolutionCreateOrCancel.emit(false);
  }

}
