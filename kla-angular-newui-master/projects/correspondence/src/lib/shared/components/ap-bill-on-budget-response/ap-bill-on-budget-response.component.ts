import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CorrespondenceService } from '../../services/correspondence.service';

@Component({
  selector: 'Correspondence-ap-bill-on-budget-response',
  templateUrl: './ap-bill-on-budget-response.component.html',
  styleUrls: ['./ap-bill-on-budget-response.component.css']
})
export class ApBillOnBudgetResponseComponent implements OnInit {
  @Input() businessData: FormArray;
  @Input() correspondenceFormGrp: FormGroup;
  @Input() isEdit;
  @Input() ApbillResponse = null;
  @Input() business;
  user;
  modules;
  billList =[];
  constructor(
    private fb: FormBuilder,
    @Inject("authService") private auth,
    private correspondenceService: CorrespondenceService
  ) {
    this.user = auth.getCurrentUser();
    
  }
  ngOnInit() {
    this.setEditorConfig();
    this.setForm()
    this.getAPBills();
  }
  setForm(){
    let fg = this.fb.group({
      billId: [null, Validators.required],
      grlContent: [null, Validators.required],
    });
    this.businessData.push(fg);
  }
  getAPBills(){
    let type = this.getTypebyBusiness()
    this.correspondenceService
    .getAllAPBills(type)
    .subscribe((Res: any) => {
     this.billList = Res;
     if(this.ApbillResponse){
      this.setValue();
     }
    });
  }
  getTypebyBusiness(){
    let type = 'AP_BUDGET';
    if(this.business == 'BUDGET_AP_BILL_RESPONSE'){
      type = 'AP_BUDGET'
    } 
   else if(this.business == 'VOA_AP_BILL_RESPONSE'){
      type = 'AP_VOA'
    }
   else if(this.business == 'SDG_AP_BILL_RESPONSE'){
      type = 'AP_SDG'
    }
  return type;
  }
  setValue(){
    this.ApbillResponse.forEach((element) => {
      let fg = this.fb.group({
        billId: [
          element ? element.billId : null,
          Validators.compose([Validators.required]),
        ],
        grlContent :  [
          element ? element.grlContent : null,
          Validators.compose([Validators.required]),
        ],
      });
      this.businessData.push(fg);
    });
  }
  setEditorConfig() {
    this.modules = {
      toolbar: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline'],  
        ['link'], 
        [{ 'list': 'ordered' }, { 'list': 'bullet'}],
        [{ 'indent': '-1'}, { 'indent': '+1' }], 
      ]
    };
  }
}
