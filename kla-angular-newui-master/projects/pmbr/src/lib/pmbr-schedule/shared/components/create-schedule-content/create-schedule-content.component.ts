import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { PmbrCommonService } from '../../../../shared/services/pmbr-common.service';
import { forkJoin } from 'rxjs';
import { PmbrScheduleService } from '../../services/pmbr-schedule.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'pmbr-create-schedule-content',
  templateUrl: './create-schedule-content.component.html',
  styleUrls: ['./create-schedule-content.component.css']
})
export class CreateScheduleContentComponent implements OnInit {
  @Input() inputData = {
    sceduleId: 0,
    isView: false
  };
  @Output() scheduleCreated = new EventEmitter<boolean>();
  public scheduleForm: FormGroup;
  sessionList = [];
  assemblyList = [];
  activeSession: any;
  dateFormate = "dd-MM-yyyy";
  presentationAllowedDate;
  assemblySession: any;
  assemblyId: any;
  sessionId: any;
  constructor(private pmbrCommonService: PmbrCommonService,
    private formBuilder: FormBuilder, private pmbrScheduleService: PmbrScheduleService,
    private notify: NzNotificationService, private route: ActivatedRoute, private datePipe: DatePipe) {
    this.createForm();
  }
  ngOnInit() {
    this.getAssemblySession();
    // if (this.inputData.sceduleId) {
    //   this.setAssemblyAndSession();
    // }
    // else {
    //   this.getActiveSessionAndAssembly();
    // }
  }

  //get assembly and session
  getAssemblySession() {
    this.pmbrCommonService.getAllAssemblyAndSession().subscribe((Res: any) => {
      this.assemblyList = Res.assembly;
      this.assemblySession= Res.assemblySession;
      this.assemblyId = Res.activeAssemblySession.assemblyId
      this.getSessionForAssembly();
      this.sessionId = Res.activeAssemblySession.sessionId;
      const scheduleId = this.route.snapshot.params["id"];
      if(scheduleId) {
        this.getScheduleListById(scheduleId);
      } else {
        this.scheduleForm.get('assemblyId').setValue(this.assemblyId);
        this.scheduleForm.get('sessionId').setValue(this.sessionId);
      }
    });
  }

// get session list for assembly
  getSessionForAssembly() {
    if(this.assemblyId && this.assemblySession.find(x=> x.id === this.assemblyId)){
      this.sessionList = this.assemblySession.find(x=> x.id === this.assemblyId).session;
    }
  }

  //create form
  createForm() {
    this.scheduleForm = this.formBuilder.group({
      id: [null],
      assemblyId: [null, [Validators.required]],
      pmbrScheduleBill: this.formBuilder.array([]),
      pmbrScheduleResolution: this.formBuilder.array([]),
      sessionId: [null, [Validators.required]],
      title: ['']
    });
  }

  //set pmbrScheduleBill objects 
  initRowsForBills() {
    return this.formBuilder.group({
      id: null,
      lottingDate: [null, [Validators.required]],
      operationType: ['SAVE'],
      presentationDate: [null, [Validators.required]],
      submissionDate: [null, [Validators.required]],
      controlDisable: [true]
    });
  }

  //set pmbrScheduleResolution object
  initRowsForResolution() {
    return this.formBuilder.group({
      id: null,
      lottingDate: [null, [Validators.required]],
      noticeSubmissionDate: [null, [Validators.required]],
      operationType: ['SAVE'],
      presentationDate: [null, [Validators.required]],
      submissionDate: [null, [Validators.required]],
      controlDisable: [true]
    });
  }

  //get pmbrScheduleBill controls
  get formArrForBill() {
    return this.scheduleForm.get("pmbrScheduleBill") as FormArray;
  }

  //get pmbrScheduleResolution controls
  get formArrForResolution() {
    return this.scheduleForm.get("pmbrScheduleResolution") as FormArray;
  }
  //function for add row in bill table
  addRowForBill() {
    this.formArrForBill.push(this.initRowsForBills());
  }

  //function for add row in resolution table
  addRowForResolution() {
    this.formArrForResolution.push(this.initRowsForResolution());
  }

  //function to check the validaity in form array controls
  createNewValidation(control) {
    const length = this.scheduleForm.get(control)['controls'].length;
    if (length > 0) {
      return (<FormArray>this.scheduleForm.get(control)).controls[length - 1].invalid;
    }
  }
  // check svae button validation
  saveButtonValidation() {
    if (this.scheduleForm.get('pmbrScheduleBill')['controls'].length > 0 || this.scheduleForm.get('pmbrScheduleResolution')['controls'].length > 0) {
      return false;
    }
    else {
      return true;
    }
  }
  //resolution table dated picker changes
  datePickerChange(data) {
    data.value.controlDisable = false;
  }


  //delete row
  deleteRow(index, type, event) {
    let controls = event.value;
    if (type == "Bill") {
      if (controls.id > 0) {
        controls.operationType = "DELETE"
      }
      else {
        this.formArrForBill.removeAt(index);
      }
    }
    else {
      if (controls.id > 0) {
        controls.operationType = "DELETE"
      }
      else {
        this.formArrForResolution.removeAt(index);
      }
    }
  }

  //get actice session and assembly
  getActiveSessionAndAssembly() {
    this.pmbrCommonService.getCurrentAssemblyAndSession().subscribe((res: any) => {
      this.activeSession = res;
      this.setAssemblyAndSession();
    })
  }

  //set assemby and session
  setAssemblyAndSession() {
    forkJoin(
      this.pmbrCommonService.getAllAssembly(),
      this.pmbrCommonService.getAllSession()
    ).subscribe(([assemblyList, sessionList]) => {
      const scheduleId = this.route.snapshot.params["id"];
      //if schedule update
      if (scheduleId) {
        this.assemblyList = assemblyList;
        this.sessionList = sessionList;
        this.getScheduleListById(scheduleId);
      }
      else {
        const temAssemblyList: any = assemblyList;
        this.assemblyList = assemblyList.filter(x => x.id >= this.activeSession.assemblyId);
        const tempSessionList: any = sessionList;
        this.sessionList = tempSessionList.filter(x => x.id >= this.activeSession.sessionId);
        this.scheduleForm.controls.assemblyId.setValue(this.activeSession.assemblyId);
        this.scheduleForm.controls.sessionId.setValue(this.activeSession.sessionId);
      }
    });
  }

  //get schedule list
  getScheduleListById(id) {
    this.pmbrScheduleService.getScheduleById(id).subscribe((res: any) => {
      this.patchValueToForm(res)
    })
  }

  //set value to form
  patchValueToForm(data: any) {
    this.scheduleForm.patchValue(data);
    data.pmbrScheduleBill.forEach((value) => {
      this.formArrForBill.push(this.formBuilder.group({
        id: value.id,
        lottingDate: value.lottingDate,
        operationType: ['SAVE'],
        presentationDate: value.presentationDate,
        submissionDate: value.submissionDate,
        controlDisable: [true]
      }));
    });
    data.pmbrScheduleResolution.forEach((value) => {
      this.formArrForResolution.push(this.formBuilder.group({
        id: value.id,
        lottingDate: value.lottingDate,
        noticeSubmissionDate: value.noticeSubmissionDate,
        operationType: ['SAVE'],
        presentationDate: value.presentationDate,
        submissionDate: value.submissionDate,
        controlDisable: [true]
      }));
    });
  }


  //save form
  saveButtonClick() {
    for (const i in this.scheduleForm.controls) {
      this.scheduleForm.controls[i].markAsDirty();
      this.scheduleForm.controls[i].updateValueAndValidity();
    }
    if (this.scheduleForm.valid) {
      this.saveForm()
    }
    else {
      this.notify.warning('Alert', 'Please fill all the dates');
    }
  }

  saveForm() {
    this.pmbrScheduleService.saveSchedule(this.scheduleForm.value).subscribe(res => {
      this.scheduleCreated.emit(true);
      if (!this.inputData.sceduleId) {
        this.notify.success('Success', 'Schedule Saved Successfully');
      } else {
        this.notify.success('Success', 'Schedule Updated Successfully');
      }
    });

  }

  //date for private member bill
  privateBillDates() {
    if (this.scheduleForm.controls.assemblyId.value && this.scheduleForm.controls.sessionId.value) {
      const body = {
        assemblyId: this.scheduleForm.controls.assemblyId.value,
        sessionId: this.scheduleForm.controls.sessionId.value,
      }
      this.pmbrScheduleService.membersBillDates(body).subscribe((res: any) => {
        this.findPresentationAllowedDate(res)
      })
    }
  }

  findPresentationAllowedDate(dates) {
    const startDate = this.datePipe.transform(new Date, 'yyyy-MM-dd');
    const endDate = dates[dates.length - 1]
    this.presentationAllowedDate = this.pmbrScheduleService.getDatesBetweenDates(startDate, endDate)
  }

  presentationAllowedDates = (current: Date): boolean => {
    const eventDate = this.datePipe.transform(current, 'yyyy-MM-dd');
    return !this.presentationAllowedDate.includes(eventDate);
  };
}
