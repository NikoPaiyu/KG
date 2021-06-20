import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BudgetSpeechService } from '../../../shared/services/budget-speech.service';
import { BudgetDocumentService } from '../../../shared/services/budget-document.service';
import { DatePipe } from '@angular/common';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'budget-create-budgetdoc-grl',
  templateUrl: './create-budgetdoc-grl.component.html',
  styleUrls: ['./create-budgetdoc-grl.component.scss']
})
export class CreateBudgetdocGRLComponent implements OnInit {
  @Input() assemblySession;
  @Input() BudgetDocument_GRL;
  isCreateBS: false;
  createBDGRLForm: FormGroup;
  listOfDisplayData;
  listOfAllData;
  budgetDocument;
  budget_documents;
  budgetId;
  constructor(private fb: FormBuilder, private notify: NzNotificationService,
    private modalService: NzModalService,
    private budgetDocservice: BudgetDocumentService,
    private budgetDOc: BudgetDocumentService,
    private router: Router,
    private datePipe: DatePipe) { }


  ngOnInit() {
    this.formvalidation();
    if (this.BudgetDocument_GRL) {
      this.patchValues(this.BudgetDocument_GRL);
    }
    this.getApproveddocs_dropdown();
  }
  formvalidation() {
    this.createBDGRLForm = this.fb.group({
      id: [null],
      assemblyId: [null],
      sessionId: [null],
      budget: [null],
      note: [null]
    });
  }
  select_budget() {
    this.budgetId = this.createBDGRLForm.value.budget
  }
  patchValues(data) {
    this.createBDGRLForm.patchValue({
      id: data.id,
      assemblyId: data.assemblyId,
      sessionId: data.sessionId,
      budget: data.budget,
    });
  }
  getApproveddocs_dropdown() {
    this.budgetDOc.getAllApprovedBudgetDocuments(this.assemblySession["assembly"].currentassembly, this.assemblySession["session"].currentsession).subscribe((res: any) => {
      this.budget_documents = this.listOfAllData = res;
    });
  }
  saveBudgetDocument() {
    let body = {
      id: this.createBDGRLForm.value.id ? this.createBDGRLForm.value.id : null,
      assemblyId: this.assemblySession["assembly"].currentassembly,
      sessionId: this.assemblySession["session"].currentsession,
      budgetId: this.budgetId,
      note: this.createBDGRLForm.value.note,
    }
    this.createBDGRLForm.controls["assemblyId"].setValue(this.assemblySession["assembly"].currentassembly);
    this.createBDGRLForm.controls["sessionId"].setValue(this.assemblySession["session"].currentsession);
    this.redirectToList();
    this.budgetDocservice.savebudgetdocGRL(body).subscribe((res: any) => {});
  }
  submitBudgetDocument() {
    let body = {
      id: this.createBDGRLForm.value.id ? this.createBDGRLForm.value.id : null,
      assemblyId: this.assemblySession["assembly"].currentassembly,
      sessionId: this.assemblySession["session"].currentsession,
      budgetId: this.budgetId,
      note: this.createBDGRLForm.value.note,
    }
    this.createBDGRLForm.controls["assemblyId"].setValue(this.assemblySession["assembly"].currentassembly);
    this.createBDGRLForm.controls["sessionId"].setValue(this.assemblySession["session"].currentsession);
    this.redirectToList();
    this.budgetDocservice.submitbudgetdocGRL(body).subscribe((res: any) => {});
  }
  redirectToList() {
    this.notify.create('success', 'Success', 'Success');
    this.modalService.closeAll();
  }
  cancelCnfrm() {
    this.createBDGRLForm.reset();
  }
}




