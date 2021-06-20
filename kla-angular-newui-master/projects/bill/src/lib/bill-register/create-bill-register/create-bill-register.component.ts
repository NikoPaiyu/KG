import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { BillManagementService } from '../../shared/services/bill-management.service';
// import { NotificationCustomService } from 'src/app/shared/services/notification.service';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'lib-create-bill-register',
  templateUrl: './create-bill-register.component.html',
  styleUrls: ['./create-bill-register.component.css']
})
export class CreateBillRegisterComponent implements OnInit {

  subjectData: any = [];
  selectData: any = [];
  selectSearch;
  committeeName = [];
  showSubjectCommittee = false;
  showSelectCommittee = false;
  validateForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private billService: BillManagementService,
    // private notify: NotificationCustomService,
    private router: Router,
    private route: ActivatedRoute, ) { }
  languageList = [];
  statusList = [];
  billTypeList = [];
  memberList = [];
  departmentList = [];
  billData = {
    "billName": "Test Bill",
    "language": "Malayalam",
    "billNature": "Government",
    "billType": "Original Bill",
    "billReference": "test",
    "memberinCharge": "Pinarayi Vijayan",
    "department": "Education"

  }


  ngOnInit() {
    this.formValidation();
    this.getDatas();
    // this.route.params.subscribe((params) => {
    //   const billId = params.id;
    // if(billId){
    //   this.getBillData(billId);
    //  }
    // });
    this.getBillData(1);
    this._loadMockData();
  }
  getBillData(billId) {
    // this.billService.getBillData(billId).subscribe((res: any) => {
    //   this.billData = res;
    if (this.billData) {
      this.validateForm.patchValue({
        billName: this.billData.billName,
        language: this.billData.language,
        billNature: this.billData.billNature,
        billType: this.billData.billType,
        billReference: this.billData.billReference,
        memberinCharge: this.billData.memberinCharge,
        department: this.billData.department
      })
    }
    // });
  }
  formValidation() {
    this.validateForm = this.fb.group({
      billName: [null, [Validators.required]],
      language: [null, [Validators.required]],
      status: [null, [Validators.required]],
      billNature: [null, [Validators.required]],
      billType: [null, [Validators.required]],
      billReference: [null, [Validators.required]],
      memberinCharge: [null, [Validators.required]],
      department: [null, [Validators.required]],
      dateOfMotionForLeave: [null, [Validators.required]],
      dateOfPublicationOn69: [null, [Validators.required]],
      dateOfPublicationOn72: [null, [Validators.required]],
      dateOfDispatch: [null, [Validators.required]],
      dateOfIntroduction: [null, [Validators.required]],
      dateOfreferringToCommitte: [null, [Validators.required]],
      dateForElicitingOpinion: [null, [Validators.required]],
      dateOfCommitteMeeting: [null, [Validators.required]],
      dateOfPublicationOfCommitteReport: [null, [Validators.required]],
    });
  }
  submitForm(flag) {
    if (this.isFormValid(flag)) {
      console.log(this.validateForm.value);
      // this.billService
      //   .addToBillRegister(
      //     this.validateForm.value,
      //     flag,billId
      //   )
      //   .subscribe((element) => {
      //     this.notify.showSuccess("Add Success", "");
      //   });
    }
    else {
      for (const i in this.validateForm.controls) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    }
  }
  isFormValid(flag) {
    if (!flag) {
      return true;
    } else {
      return this.validateForm.valid;
    }
  }
  viewBill() {
    this.router.navigate([""]);
  }
  getDatas() {
    this.getLanguageList();
    this.getStatusList();
    this.getBillTypeList();
    this.getMemberList();
    this.getDepartmentList();
  }
  getLanguageList() {
    // this.billService.getLanguageList().subscribe((res: any) => {
    //   this.languageList = res;
    // });
    this.languageList = [
      {
        value: "Malayalam"
      },
      {
        value: "English"
      },
    ];
  }

  getStatusList() {
    // this.billService.getLanguageList().subscribe((res: any) => {
    //   this.languageList = res;
    // });
    this.statusList = [
      {
        value: "Saved"
      },
      {
        value: "Submitted"
      },
    ];
  }
  getBillTypeList() {
    // this.billService.getBillTypeList().subscribe((res: any) => {
    //   this.billTypeList = res;
    // });
    this.billTypeList = [
      {
        value: "Original Bill"
      },
      {
        value: "Amendment bill"
      },
    ];
  }
  getMemberList() {
    // this.billService.getMemberList().subscribe((res: any) => {
    //   this.memberList = res;
    // });
    this.memberList = [{
      value: "Pinarayi Vijayan"
    },
    {
      value: "Ommen Chandy"
    },];
  }
  getDepartmentList() {
    // this.billService.getDepartmentList().subscribe((res: any) => {
    //   this.departmentList = res;
    // });
    this.departmentList = [
      {
        value: "Education"
      },
      {
        value: "Finance"
      },
    ];

  }
  forwardToCommitte() {

  }

  subjectCommittee() {
    this.showSubjectCommittee = true;
  }

  selectCommittee() {
    this.showSelectCommittee = true;
  }

  subjectCommitteeCancel() {
    this.showSubjectCommittee = false;
  }

  subjectCommitteeOk() {

  }

  _loadMockData() {
    // this.service.getBillList().subscribe((Response) => {
    this.subjectData = new Array(4).fill(0).map((_, index) => {
      if (index < 5) {
        return {
          id: index++,
          name: 'Committee name'
        };
      }
    });
    this.selectData = new Array(4).fill(0).map((_, index) => {
      if (index < 5) {
        return {
          id: index++,
          name: 'Member name'
        };
      }
    });
  }

  selectCommitteeCancel() {
    this.showSelectCommittee = false;
  }

  selectCommitteeOk() {

  }

  generateSpeakerNote() {

  }
  backToList() {
    window.history.back();
  }

}
