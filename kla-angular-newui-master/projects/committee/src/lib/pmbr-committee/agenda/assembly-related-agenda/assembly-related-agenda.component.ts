import { Component, OnInit,Input } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import differenceInCalendarDays from "date-fns/fp/differenceInCalendarDays";
import { AgendaServiceService } from '../shared/agenda-service.service';
@Component({
  selector: 'committee-assembly-related-agenda',
  templateUrl: './assembly-related-agenda.component.html',
  styleUrls: ['./assembly-related-agenda.component.css']
})
export class AssemblyRelatedAgendaComponent implements OnInit {
  resolution: any = [];
  agendaType: any = [];
  validateForm: FormGroup;
  today: any = new Date();
  typesofVenues: any = [];
  resolutionList: any = [];
  assemblyId: 1;
  sessionId: 4;
  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
  }
  constructor(private fb: FormBuilder,
    private agendaService: AgendaServiceService) { 
   
  }

  ngOnInit() {
    this.formValidation();
    this.getAgendaType();
    this.getVenue();
    this.getResolutionName();
    }
  formValidation(): void {
    this.validateForm = this.fb.group({
     assemblyRelatedAgenda: this.fb.array([]),
      agendaType: [null, [Validators.required]],
      venueType: [null, [Validators.required]],
      sessionTime: [null, [Validators.required]],
      sessionDate: [null, [Validators.required]],
      
      
    });
  }
  saveButtonClick(){
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }  
    console.log(this.validateForm.value);
  }
  disabledDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, this.today) > 0;
  };
  addMember() {
    this.formArrForMembers.push(this.initRowsForMembers());
  }
  get formArrForMembers() {
    return this.validateForm.get("assemblyRelatedAgenda") as FormArray;
  }
  initRowsForMembers() {
    return this.fb.group({
      resolutionName: null,
      status: [null],
      sessionTimeTable: [null],
      operationType: ['SAVE']
    });
  }
  saveMember(index, event) {
    this.resolution[index] = event.value.resolutionName;
    // this.memberIds = this.createNoticeForm.value.memberList.map( x=> x.memberId.id);
    this.validateForm.get('resolution').setValue(this.resolution);
  }
  deleteMember(index, event) {
    let controls = event.value;
    if (controls.id > 0) {
      controls.operationType = 'DELETE';
    } else {
      this.formArrForMembers.removeAt(index);
    }
    this.resolution.pop(index);
    // this.resolution = this.validateForm.value.memberList.map( x=> x.memberId.id);
    this.validateForm.get('resolution').setValue(this.resolution);
  }
  cancel() { }
  getAgendaType(){
    this.agendaService.agendaType().subscribe(res => {
      this.agendaType = res;
    });
  }
  getVenue(){
    this.agendaService.venueDetails().subscribe(res => {
      this.typesofVenues = res;
    });
  }
  getResolutionName(){
    this.agendaService.resolutionName(1,4).subscribe(res => {
      this.resolutionList.pmbrResolutionLottingResultDto = res;
    });
  }
}
