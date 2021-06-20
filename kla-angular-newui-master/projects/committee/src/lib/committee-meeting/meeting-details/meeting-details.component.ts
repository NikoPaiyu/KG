import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { CommitteeService } from '../../shared/services/committee.service';
import differenceInCalendarDays from "date-fns/fp/differenceInCalendarDays";
@Component({
  selector: 'committee-meeting-details',
  templateUrl: './meeting-details.component.html',
  styleUrls: ['./meeting-details.component.scss']
})
export class MeetingDetailsComponent implements OnInit {
  time: Date | null = null;
  defaultOpenValue = new Date(0, 0, 0, 0, 0, 0);
  today: any = new Date();
  sessionDate;
  sessionTime;
  reportDate;
  // billList: any = [];
  allbillList: any = [];
  billStatus = 'APPROVED';
  isVisible = false;
  sessionType;
  validateForm: FormGroup;
  checked = false;
  billtype = "Anil";
  agendatype = "Member";
  addCommitte = 1;
  meetingAgenda;
  meetingTittle;
  venueType;
  typesofAgenda: any;
  temptypesofAgenda: any;
  typesofVenues: any;
  listOfControls: Array<{ id: number; controlInstance: string }> = [];
  listOfControl: Array<{ id: number; controlInstance: string }> = [];
  committeeList: any = [];
  selectedCommittee: any = [];
  @Output() afterCreate = new EventEmitter<any>();
  tempCommitteeList: any = [];
  // selectedBills: any = [];
  // tempBillList: any = [];
  activeSession: any;
  businessList: any;
  tempBusinessList: any;
  @Input() followUpMeeting = false;
  @Input() referenceDetails = null;
  @Output() followUpCreate = new EventEmitter<any>();
  selectedAgendas: any = [];
  user;
  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
  }
  constructor(
    public committee: CommitteeService,
    private notification: NzNotificationService,
    @Inject('authService') private AuthService,
    private fb: FormBuilder) { 
      this.user = AuthService.getCurrentUser();
    }

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }
  ngOnInit() {
   this.formValidation();
   this.currentAssemblyAndSession();
   this.typeAgenda();
   this.typesofVenue();
  //  this.getListofBills();
  //  this.getListOfBusiness();
  }
typeAgenda(){
  this.committee.agendaType().subscribe((Response) => {
    this.typesofAgenda = Response;
    this.temptypesofAgenda = Response;
    if (this.followUpMeeting) {
      this.setReferenceValues();
    }
  });
}
typesofVenue(){
  this.committee.venueType().subscribe((Response) => {
    this.typesofVenues = Response;
  });
}
// getListofBills() {
//   let body = {
//     departmentId: null,
//     isGovernerRecommendation: null,
//     isOrdinance: null,
//     status: ["APPROVED"],
//     type: null,
//   };
//   this.committee.getAllBills(body).subscribe((Response) => {
//     this.billList = Response;
//     this.tempBillList = Response;
//   });
// }

getListOfBusiness(agendaId, committeeId, i) {
  // this.billList = this.tempBillList = [];
  this.formArr.controls[i].value.businessListing = this.formArr.controls[i].value.tempBusinessListing = [];
  const body = {
      agendaIds: [
        agendaId
      ],
      committeeIds: committeeId,
      status: ['ASSIGEND']
    };
  this.committee.getAllBusiness(body).subscribe((res: any) => {
      this.formArr.controls[i].value.businessListing = res;
      this.formArr.controls[i].value.tempBusinessListing = this.formArr.controls[i].value.businessListing;
      // this.billList = res;
      // this.tempBillList = this.billList;
      if (this.formArr.controls[i].value.selectedBusiness &&
        this.formArr.controls[i].value.selectedBusiness.length > 0) {
        const tempIds = this.formArr.controls[i].value.selectedBusiness.map(x => x.id);
        const parentCommittee = this.selectedCommittee[0].id;
        let jointIds = [];
        this.selectedCommittee.forEach((element, index) => {
          if (index > 0) {
            jointIds.push(element.id);
          }
        });
        this.formArr.controls[i].value.businessListing =
        this.formArr.controls[i].value.tempBusinessListing.filter((element) => {
          const a = element.joinCommittes.map(x => x.id).sort();
          jointIds = jointIds.sort();
          let temp;
          if (JSON.stringify(a) === JSON.stringify(jointIds)) {
            temp = true;
          } else {
            temp = false;
          }
          if (!tempIds.includes(element.id) && element.parentCommitteeId === parentCommittee && temp) {
            return true;
          } else {
            return false;
          }
        });
      }
      // const tempIds = this.selectedBills.map(x => x.id);
      // this.billList = this.tempBillList.filter(element => !tempIds.includes(element.id));
    });
}

getCommiteeList() {
  const body =  {
    assemblyId: this.activeSession.assemblyId,
    categoryId: 1,
    isActive: true,
    status: 'APPROVED',
    subjectId: null
  };
  this.committee.committeeList().subscribe(Res => {
    this.committeeList = Res;
    this.tempCommitteeList = this.committeeList;
  });
  // this.committeeList = [{ id: 1, subjectName: 'SUBJECT_COMMITTEE_I'},
  // { id: 2, subjectName: 'SUBJECT_COMMITTEE_II'},
  // { id: 3, subjectName: 'SUBJECT_COMMITTEE_III'}];
  // this.tempCommitteeList = this.committeeList;
}

formValidation(): void {
  this.validateForm = this.fb.group({
    agendaTypeArray: this.fb.array([
        this.initAgendaArray()
      ]),
    addCommitte: [null],
    meetingTittle: [null, [Validators.required]],
    meetingAgenda: [null, [Validators.required]],
    venueType: [null],
    checked: [false, [Validators.required]],
    sessionType: [null],
    reportDate: [null],
    sessionDate: [null],
    sessionTime: [null],
    followUpMeeting: [false],
    evidenceTaking: [false],
    refrenceMeeting: [null]
  });
}

initAgendaArray() {
  return this.fb.group({
    agendatype: this.fb.control(null, Validators.required),
    billtype: this.fb.control(null, Validators.required),
    businessListing: this.fb.control([]),
    tempBusinessListing: this.fb.control([]),
    selectedBusiness: this.fb.control([]),
  });
}

createmeetings() {
  // if (this.selectedCommittee.length === 0) {
    // this.committeeList = this.tempCommitteeList;
    // this.validateForm.controls.addCommitte.reset();
    // this.validateForm.controls.addCommitte.setValidators([Validators.required]);
  // }
  
  // tslint:disable-next-line: forin
  for (const i in this.validateForm.controls) {
    this.validateForm.controls[i].markAsDirty();
    this.validateForm.controls[i].updateValueAndValidity();
  }
  const control = this.validateForm.get('agendaTypeArray') as FormArray;
  let jIndex = 0;
  // tslint:disable-next-line: forin
  for (const j in control.controls) {
      jIndex++;
      const controlTwo = control.controls[j] as FormGroup;
      if (this.formArr.controls[jIndex - 1].value.selectedBusiness.length === 0) {
        controlTwo.controls.billtype.reset();
      }
      // tslint:disable-next-line: forin
      for (const k in controlTwo.controls) {
          controlTwo.controls[k].markAsDirty();
          controlTwo.controls[k].updateValueAndValidity();
      }
      this.getListOfBusiness(this.formArr.controls[jIndex - 1].value.agendatype, this.selectedCommittee.map(x => x.id), jIndex - 1);
    }

  if (this.validateForm.valid) {
    const tempIds = this.selectedCommittee.map(x => x.id);
    const committees: any = [];
    const busIds: any = [];
    tempIds.forEach((element, index) => {
      let tempPId;
      if (index > 0) {
        tempPId = false;
      } else {
        tempPId = true;
      }
      committees.push({id: element, parentCommittee: tempPId});
    });
    const subAgendaArray = [];
    this.validateForm.value.agendaTypeArray.forEach((x, index) => {
      const subAgendaBusinessArray = [];
      // this.selectedBills.forEach(y => {
      //   subAgendaBusinessArray.push({
      //         businessId: y.id,
      //         businessNumber: y.billNumber,
      //         businessTitle: y.title,
      //       });
      // });
      this.formArr.controls[index].value.selectedBusiness.forEach(y => {
          subAgendaBusinessArray.push({
            businessId: y.refrenceId,
            businessNumber: y.refrenceNumber,
            businessTitle: y.refernceTitle,
            forwardedBusinessId: y.id
          });
          busIds.push(y.id);
        });
      subAgendaArray.push(
        {
          agendaType: {
            id: x.agendatype
          },
          subAgendaBusiness: subAgendaBusinessArray
        }
      );
    });
    let meetType;
    if (this.validateForm.value.evidenceTaking) {
      meetType = 'EVIDENCE_TAKING';
    } else {
      meetType = 'BUSINESS_MEETING';
    }
    const body = {
      agendaDescription: this.validateForm.value.meetingAgenda,
      committee: committees,
      date: this.validateForm.value.sessionDate,
      isJointMeeting: this.validateForm.value.checked,
      occasion: this.validateForm.value.sessionType,
      reportdate: this.validateForm.value.reportDate,
      subAgenda: subAgendaArray,
      time: this.validateForm.value.sessionTime,
      title: this.validateForm.value.meetingTittle,
      venue: {
        id: this.validateForm.value.venueType
      },
      followUpMeeting: this.validateForm.value.followUpMeeting,
      type:  meetType,
      refrenceMeeting: this.validateForm.value.refrenceMeeting
  };
    console.log(body);
    this.committee.CreateMeeting(body).subscribe((res: any) => {
      const temp: any = res;
      this.notification.create(
        "success",
        "Success",
        "Meeting Created Successfully!"
      );
      this.validateForm.reset();
      this.afterCreate.emit(true);
      if (this.followUpMeeting) {
      this.followUpCreate.emit(res.id);
      }
      // this.notification.success("Success", "Succesfully submitted..");
      // this.router.navigate(["business-dashboard/bill/bills"]);
    });
  }
}

disabledDate = (current: Date): boolean => {
  return differenceInCalendarDays(current, this.today) > 0;
};

addCommittee() {
  if (this.validateForm.value.checked) {
    this.selectedCommittee.push(this.validateForm.value.addCommitte);
  } else {
    this.selectedCommittee = [this.validateForm.value.addCommitte];
  }
  this.filterCommittee();
  this.validateForm.controls.addCommitte.clearValidators();
}

removeCommittee(id) {
  const removedComm = this.selectedCommittee.find(element => element.id === id);
  this.selectedCommittee.splice(this.selectedCommittee.indexOf(removedComm), 1);
  if (this.selectedCommittee.length === 0) {
    this.validateForm.controls.addCommitte.setValidators([Validators.required]);
  }
  this.filterCommittee();
}

filterCommittee() {
  const tempIds = this.selectedCommittee.map(x => x.id);
  this.committeeList = this.tempCommitteeList.filter(element => !tempIds.includes(element.id));
  this.validateForm.controls.addCommitte.reset();
}

closePopup() {
  this.afterCreate.emit(true);
}

addAgendaType() {
  this.formArr.push(this.initAgendaArray());
}

removeAgendaType(i) {
  this.formArr.removeAt(i);
}

get formArr() {
  return this.validateForm.get('agendaTypeArray') as FormArray;
}

addBill(i) {
  this.formArr.controls[i].value.selectedBusiness.push(this.formArr.controls[i].value.billtype);
  // this.selectedBills.push(this.formArr.controls[i].value.billtype);
  this.filterBills(i);
  this.formArr.controls[i].get('billtype').clearValidators();
}

removeBill(id, i) {
  // const removedBill = this.selectedBills.find(element => element.id === id);
  const removedBill = this.formArr.controls[i].value.selectedBusiness.find(element => element.id === id);
  // this.selectedBills.splice(this.selectedBills.indexOf(removedBill), 1);
  this.formArr.controls[i].value.selectedBusiness.splice(this.formArr.controls[i].value.selectedBusiness.indexOf(removedBill), 1);
  // if (this.selectedBills.length === 0) {
  //   this.formArr.controls[i].get('billtype').setValidators([Validators.required]);
  // }
  if (this.formArr.controls[i].value.selectedBusiness.length === 0) {
    this.formArr.controls[i].get('billtype').setValidators([Validators.required]);
  }
  this.filterBills(i);
}

filterBills(i) {
  // if (this.selectedBills.length > 0 && this.selectedBills[0].joinCommittes.length > 0) {
  //   this.validateForm.patchValue({
  //     checked: true
  //   });
  // } else {
  //   this.validateForm.patchValue({
  //     checked: false
  //   });
  // }
  if (this.formArr.controls[i].value.selectedBusiness.length > 0 &&
    this.formArr.controls[i].value.selectedBusiness[0].joinCommittes.length > 0) {
    this.validateForm.patchValue({
      checked: true
    });
  } else {
    this.validateForm.patchValue({
      checked: false
    });
  }
  this.selectedCommittee = [];
  // if (this.selectedBills.length > 0) {
  //   this.selectedCommittee.push(this.selectedBills[0].parentCommittee);
  //   if (this.selectedBills[0].joinCommittes.length > 0) {
  //     this.selectedBills[0].joinCommittes.forEach(element => {
  //       this.selectedCommittee.push(element);
  //     });
  //   }
  // }
  if (this.formArr.controls[i].value.selectedBusiness.length > 0) {
    this.selectedCommittee.push(this.formArr.controls[i].value.selectedBusiness[0].parentCommittee);
    if (this.formArr.controls[i].value.selectedBusiness[0].joinCommittes.length > 0) {
      this.formArr.controls[i].value.selectedBusiness[0].joinCommittes.forEach(element => {
        this.selectedCommittee.push(element);
      });
    }
  }
  console.log(this.selectedCommittee);
  this.formArr.controls[i].get('billtype').reset();
  this.getListOfBusiness(this.formArr.controls[i].value.agendatype, this.selectedCommittee.map(x => x.id), i);
}

filterAgendaType() {
  const temp: any = [];
  this.selectedAgendas = [];
  this.validateForm.value.agendaTypeArray.forEach(x => {
    if (x.agendatype) {
      temp.push(x.agendatype);
      this.selectedAgendas.push(x.agendatype);
    }
  });
  // this.typesofAgenda = this.temptypesofAgenda.filter(e =>  !temp.includes(e.id));
}

currentAssemblyAndSession() {
  this.committee.getCurrentAssemblyAndSession().subscribe((Res) => {
    this.activeSession = Res;
    this.getCommiteeList();
  });
}

committeCheck(event) {
  if (!event) {
    if (this.selectedCommittee.length > 1) {
      this.selectedCommittee = this.selectedCommittee.slice(0, 1);
      this.filterCommittee();
    }
  }
}

setReferenceValues() {
  this.validateForm.patchValue({
  meetingTittle: this.referenceDetails.title,
  meetingAgenda: this.referenceDetails.agendaDescription,
  followUpMeeting: true,
  refrenceMeeting: this.referenceDetails.id
  });
  this.referenceDetails.subAgenda.forEach((x, i) => {
      if (i > 0) {
        this.addAgendaType();
      }
      this.formArr.controls[i].patchValue({
        agendatype: x.agendaType.id
      });
      x.subAgendaBusiness.forEach((y) => {
        if (y.forwardedBusiness.status !== 'COMPLETED') {
          this.formArr.controls[i].value.selectedBusiness.push({
            refernceTitle: y.businessTitle,
            parentCommitteeId: this.referenceDetails.committee.find(a => a.parentCommittee === true).id,
            parentCommittee: this.referenceDetails.committee.find(a => a.parentCommittee === true),
            joinCommittes: this.referenceDetails.committee.filter(a => a.parentCommittee === false),
            refrenceId: y.businessId,
            refrenceNumber: y.businessNumber,
            id: y.forwardedBusiness.id,
            followUp: true
          });
        }
    });
      if ( this.formArr.controls[i].value.selectedBusiness.length > 0) {
      this.formArr.controls[i].get('billtype').clearValidators();
      }
      this.filterBills(i);
  });
  this.filterAgendaType();
}

}
