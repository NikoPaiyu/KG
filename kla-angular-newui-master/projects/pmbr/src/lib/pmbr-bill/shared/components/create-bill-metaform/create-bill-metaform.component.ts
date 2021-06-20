import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PmbrCommonService } from '../../../../shared/services/pmbr-common.service';
import { languages, priorities } from '../../models/pmbr-bill-model';
import { PmbrBillService } from '../../services/pmbr-bill.service';

@Component({
  selector: 'pmbr-create-bill-metaform',
  templateUrl: './create-bill-metaform.component.html',
  styleUrls: ['./create-bill-metaform.component.css']
})
export class CreateBillMetaformComponent implements OnInit {
  createBillForm: FormGroup
  // current block
  @Input() billId: any = [];
  // out put will emit after bill create
  @Output() billCreateOrCancel = new EventEmitter<boolean>();
  billLanguages = languages;
  billPriorities = priorities;
  ministerDesignationList: any = [];
  departmentList: any = [];
  subjectList: any = [];
  currentUser
  constructor(private formBuilder: FormBuilder, private pmbrManagementService: PmbrBillService,
    private common: PmbrCommonService, @Inject('authService') private AuthService,) {
    this.createForm();
    this.currentUser = AuthService.getCurrentUser();
    if (this.currentUser.authorities.includes('assistant')) {
      this.getMemberDesignation();
    }
  }

  ngOnInit() {
    if (this.billId) {
      this.getBillMetaDetails(this.billId);
    }
  }

  createForm() {
    this.createBillForm = this.formBuilder.group({
      id: [null],
      language: ['MAL'],
      priority: [null, [Validators.required]],
      title: [null, [Validators.required]],
      natureOfBill: 'PRIVATE',
      designationId: [null],
      departmentId: [null],
      subjectId: [null]
    });
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
        if (!res.some(f => f.id == this.createBillForm.controls.departmentId.value)) {
          this.createBillForm.controls['departmentId'].setValue(null);
          this.createBillForm.controls['subjectId'].setValue(null);
          this.subjectList = null;
        }
      });
    }
  }

  getSubjects(deptId) {
    if (deptId) {
      this.common.getSubjectList(deptId).subscribe((res: any) => {
        this.subjectList = res;
        if (!res.some(f => f.id == this.createBillForm.controls.subjectId.value)) {
          this.createBillForm.controls['subjectId'].setValue(null);
        }
      });
    }
  }
  getBillMetaDetails(billId) {
    this.pmbrManagementService.getBillByBillId(billId).subscribe((res) => {
      this.patchCreateBillFormData(res)
    })
  }

  patchCreateBillFormData(data) {
    this.createBillForm.patchValue({
      id: data.id,
      title: data.blocks[0].content,
      type: data.type,
      language: data.language,
      priority: data.priority,
      designationId: data.designationId,
      departmentId: data.departmentId,
      subjectId: data.subjectId
    })
  }

  createBill() {
    for (const i in this.createBillForm.controls) {
      this.createBillForm.controls[i].markAsDirty();
      this.createBillForm.controls[i].updateValueAndValidity();
    }
    if (this.createBillForm.valid) {
      this.pmbrManagementService.createPmbrBillMetaData(this.createBillForm.value).subscribe((res: any) => {
        this.billCreateOrCancel.emit(res);
      })

    }
  }

  cancelBill() {
    this.billCreateOrCancel.emit(false);
  }

}
