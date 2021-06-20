import { Component, OnInit, Input, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import differenceInCalendarDays from "date-fns/fp/differenceInCalendarDays";
import { NzNotificationService, UploadChangeParam } from 'ng-zorro-antd';
import { FileServiceService } from '../../../shared/services/file-service.service';
import { AgendaServiceService } from '../shared/agenda-service.service';
@Component({
  selector: 'committee-acction-taken-report-based-agenda',
  templateUrl: './acction-taken-report-based-agenda.component.html',
  styleUrls: ['./acction-taken-report-based-agenda.component.css']
})
export class AcctionTakenReportBasedAgendaComponent implements OnInit {
  validateForm: FormGroup;
  typesofVenues: any = [];
  agendaType: any = [];
  agendatype;
  agendas: any = [];
  chooseBill: any = [];
  activeSessions: any = [];
  time: Date | null = null;
  defaultOpenValue = new Date(0, 0, 0, 0, 0, 0);
  today: any = new Date();
  showUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    hidePreviewIconInNonImage: true,
  };
  fileList: any = [];
  isVisible: boolean;
  uploadURL = this.service.uploadUrl();
  listOfControl: Array<{ id: number; controlInstance: string }> = [];
  billListing: any = [];
  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
  }
  constructor(private fb: FormBuilder,
    private service: FileServiceService,
    private agendaService: AgendaServiceService) { }

  ngOnInit() {
    this.formValidation();
    this.getAgendaType();
    this.getVenue();
    this.getBillList();
    // this.getActiveSession();
  }
  formValidation(): void {
    this.validateForm = this.fb.group({
      agendaTypeArray: this.fb.array([
        this.initAgendaArray()
      ]),
      meetingTittle: [null, [Validators.required]],
      meetingAgenda: [null, [Validators.required]],
      venueType: [null, [Validators.required]],
      sessionType: [null, [Validators.required]],
      sessionDate: [null, [Validators.required]],
      sessionTime: [null, [Validators.required]],
      checked: [null]
    });
  }
  
  initAgendaArray() {
    return this.fb.group({
      agendatype: this.fb.control(null, Validators.required),
      billtype: this.fb.control(null, Validators.required),
    });
  }
  disabledDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, this.today) > 0;
  };
  createmeetings() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    console.log(this.validateForm.value);
  }
  handleChange(info: UploadChangeParam): void {
    let fileType = 'ATTACHMENT';
    let fileName = '';
    const fileList = [...info.fileList];
    this.fileList = [];
    if (info.file.response) {
      for (const file of fileList) {
        this.fileList.push({
          name: (fileName) ? fileName : info.file.name,
          attachmentUrl: info.file.response.body,
          type: fileType,
        });
      }
    }
    // this.attachmentDto = this.fileList;
    this.fileList = fileList.filter((item: any) => {
      if (item.response) {
        return item.response.status !== 'success';
      }
      return true;
    });
  }
  attachFiles() {
    this.isVisible = true;
  }
  addField(e?: MouseEvent): void {
    if (e) {
      e.preventDefault();
    }
    const id = this.listOfControl.length > 0 ? this.listOfControl[this.listOfControl.length - 1].id + 1 : 0;

    const control = {
      id,
      controlInstance: `officiomem${id}`
    };
    const index = this.listOfControl.push(control);
    this.validateForm.addControl(this.listOfControl[index - 1].controlInstance, new FormControl(null, Validators.required));
    this.formArrForMembers.push(this.initAgendaArray());
  }
  get formArrForMembers() {
    return this.validateForm.get("agendaTypeArray") as FormArray;
  }
  removeField(i: { id: number; controlInstance: string }, e: MouseEvent): void {
    e.preventDefault();
    if (this.listOfControl.length > 1) {
      const index = this.listOfControl.indexOf(i);
      this.listOfControl.splice(index, 1);
      this.validateForm.removeControl(i.controlInstance);
    }
  }

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
  getActiveSession(){
    this.agendaService.activeSession().subscribe(res => {
      this.activeSessions = res;
    });
  }
  getBillList(){
    if(this.agendatype.code == 'PMBR_DISCUSSION'){  
    const body = {
      "assemblyId":0,
      "assignedTo":0,
      "departmentId":null,
      "isGovernerRecommendation":false,
      "isOrdinance":false,
      "natureOfBill":"PRIVATE",
      "sessionId":0,
      "status":["APPROVED"],
      "type":"PRIVATE_MEMBER_BILL",
      "stage": "LOTTING_PERFORMED"
    }
    this.agendaService.billList(body).subscribe(res => {
      this.chooseBill = res;
    });
  } else if(this.agendatype.code  == 'PMR_DISCUSSION'){
    
    const body = {
      "assemblyId":0,
      "assignedTo":0,
      "departmentId":null,
      "isGovernerRecommendation":false,
      "isOrdinance":false,
      "natureOfBill":"PRIVATE",
      "sessionId":0,
      "status":["APPROVED"],
      "type":"PRIVATE_MEMBER_RESOLUTION", 
      "stage":"PMBR_FINAL_APPROVED"
    }
    this.agendaService.resolutionList(body).subscribe(res => {
      this.chooseBill = res;
    });
  }

  }
  
}
