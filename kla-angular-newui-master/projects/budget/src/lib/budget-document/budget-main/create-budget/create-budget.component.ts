import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BudgetSpeechService } from '../../../shared/services/budget-speech.service';
import { BudgetDocumentService } from '../../../shared/services/budget-document.service';
import { DatePipe } from '@angular/common';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { ActivatedRoute, Router } from '@angular/router';
import { differenceInCalendarDays } from 'date-fns';
import { BudgetCommonService } from '../../../shared/services/budgetcommon.service';



@Component({
  selector: 'budget-create-budget',
  templateUrl: './create-budget.component.html',
  styleUrls: ['./create-budget.component.scss']
})
export class CreateBudgetComponent implements OnInit {
  @Output() cancelModel = new EventEmitter<any>();
  @Input() assemblySession;
  @Input() Budget;
  isCreateBS: false;
  createBDGRLForm: FormGroup;
  listOfDisplayData;
  listOfAllData;
  budgetDocument;
  budget_documents;
  disabledCosDates: any;
  dateList = [];
  constructor(private fb: FormBuilder, private notify: NzNotificationService,
    private modalService: NzModalService,
    private budgetDocservice: BudgetDocumentService,
    private BudgetCommonService: BudgetCommonService,
    private router: Router,
    private datePipe: DatePipe) { }


  ngOnInit() {
    this.formvalidation();
    this.getDateList();
  }
  formvalidation() {
    this.createBDGRLForm = this.fb.group({
      id: [null],
      assemblyId: [null],
      sessionId: [null],
      note: [null,Validators.compose([Validators.required])],
      introductoryDate:[null,Validators.compose([Validators.required])]
    });
  }
  getDateList(){
    if (
      this.assemblySession["assembly"].currentassembly &&
      this.assemblySession["session"].currentsession
    ) {
      this.dateList = [];
      this.BudgetCommonService
        .getDates(
          this.assemblySession["assembly"].currentassembly,
          this.assemblySession["session"].currentsession
        )
        .subscribe((Res: any) => {
          this.dateList = Res;
          this.dateList = this.dateList.filter(
            (x) => differenceInCalendarDays(new Date(x), new Date()) >= 0
          );
          this.disabledCosDates = (current: Date): boolean => {
            return !this.dateList.includes(
              this.datePipe.transform(current, "yyyy-MM-dd")
            );
          };
          if (this.Budget) {
            this.patchValues(this.Budget);
          }
        });
    }
  }
  patchValues(data) {
    this.createBDGRLForm.patchValue({
      id: data.id,
      assemblyId: data.assemblyId,
      sessionId: data.sessionId,
      note: data.note,
      introductoryDate:data.introductoryDate
    });
  }
  saveBudgetDocument() {
    let body = { 
      id: this.createBDGRLForm.value.id ? this.createBDGRLForm.value.id : null,
      assemblyId: this.assemblySession["assembly"].currentassembly,
      sessionId: this.assemblySession["session"].currentsession,
      note: this.createBDGRLForm.value.note,
      introductoryDate:this.createBDGRLForm.value.introductoryDate,
    }
    this.createBDGRLForm.controls["assemblyId"].setValue(this.assemblySession["assembly"].currentassembly);
    this.createBDGRLForm.controls["sessionId"].setValue(this.assemblySession["session"].currentsession);
    this.redirectToList();
    this.budgetDocservice.savebudget(body).subscribe((res: any) => {});
  }
  submitBudgetDocument() {

    let body = {
      id: this.createBDGRLForm.value.id ? this.createBDGRLForm.value.id : null,
      assemblyId: this.assemblySession["assembly"].currentassembly,
      sessionId: this.assemblySession["session"].currentsession,
      note: this.createBDGRLForm.value.note,
      introductoryDate:this.createBDGRLForm.value.introductoryDate,
    }
    this.createBDGRLForm.controls["assemblyId"].setValue(this.assemblySession["assembly"].currentassembly);
    this.createBDGRLForm.controls["sessionId"].setValue(this.assemblySession["session"].currentsession);
    this.redirectToList();
    this.budgetDocservice.submitbudget(body).subscribe((res: any) => {});
  }
  cancelCnfrm() {
  }
  redirectToList() {
    this.notify.create('success', 'Success', 'Success');
    this.modalService.closeAll();
    this.cancelModel.emit(false);
  }
}





