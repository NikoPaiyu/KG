import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { BudgetDocumentService } from '../../shared/services/budget-document.service';
import { SdgEgService } from '../../shared/services/sdg-eg.service';

@Component({
  selector: 'budget-create-sdgeg-request',
  templateUrl: './create-sdgeg-request.component.html',
  styleUrls: ['./create-sdgeg-request.component.css']
})
export class CreateSdgegRequestComponent implements OnInit {

  @Input() assemblySession;
  @Input() sdgRequest;
  @Output() onCloseEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  closeSDG: false;
  SDGForm: FormGroup;
  listOfDisplayData;
  listOfAllData;
  budget_documents=[];
  constructor(private fb: FormBuilder, private notify: NzNotificationService,
    private modalService:NzModalService,
    private router: Router,
    private SdgEgService: SdgEgService,
    private datePipe: DatePipe,
    private budgetDOc: BudgetDocumentService,
    ) { }
  ngOnInit() {
    this.formvalidation();
    this.getApproveddocs_dropdown();
    
  }
  formvalidation() {
    this.SDGForm = this.fb.group({
      id: [null],
      assemblyId: [null],
      sessionId: [null],
      note: [null,Validators.required],
      budget: [null,Validators.required],
      nature:[null,Validators.required],
    });
  }
  patchValues(data) {
    this.SDGForm.patchValue({
      id: data.id,
      assemblyId: data.assemblyId,
      sessionId: data.sessionId,
      note: data.note,
      budget: data.budget.id,
      nature:data.nature,
    });
  }
  getApproveddocs_dropdown(){
    this.budgetDOc.getAllApprovedBudgetDocuments(this.assemblySession["assembly"].currentassembly,this.assemblySession["session"].currentsession).subscribe((res: any) => {
      this.budget_documents = this.listOfAllData = res;
     if (this.sdgRequest) {
      this.patchValues(this.sdgRequest);
    }
    });
  }
  saveBudgetDocument() {
    let body = this.buildReqBody()
    // this.SDGForm.controls["assemblyId"].setValue(this.assemblySession["assembly"].currentassembly);
    // this.SDGForm.controls["sessionId"].setValue(this.assemblySession["session"].currentsession);
    this.SdgEgService.saveSDGRequest(body).subscribe((res: any) => {
      if (res) {
        this.notify.create('success', 'Success', 'Saved Successfully');
        this.onCloseEvent.emit(this.closeSDG);
      }
    });
  }
  buildReqBody(){
    let body={
      assemblyId:this.assemblySession["assembly"].currentassembly,
      sessionId:this.assemblySession["session"].currentsession,
      budget:{
        id : this.SDGForm.value.budget
      },
      note:this.SDGForm.value.note,
      id : this.SDGForm.value.id ? this.SDGForm.value.id : null,
      nature :  this.SDGForm.value.nature ? this.SDGForm.value.nature : null
    }
    return body;
  }
  submitBudgetDocument() {
    // this.SDGForm.controls["assemblyId"].setValue(this.assemblySession["assembly"].currentassembly);
    // this.SDGForm.controls["sessionId"].setValue(this.assemblySession["session"].currentsession);
    let body = this.buildReqBody()
    this.SdgEgService.submitSDGRequest(body).subscribe((res: any) => {
      if (res) {
        this.notify.create('success', 'Success', 'Submitted Successfully');
        this.onCloseEvent.emit(this.closeSDG);
      }
    });    
  }
  ngModelChange() {
  }
  cancelCnfrm() {
    this.SDGForm.reset();
    this.onCloseEvent.emit(this.closeSDG);
  }
}
