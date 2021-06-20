import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InoticeDetails } from '../../models/pmbr-bill-model';
import { PmbrBillService } from '../../services/pmbr-bill.service';

@Component({
  selector: 'pmbr-create-notice',
  templateUrl: './create-notice.component.html',
  styleUrls: ['./create-notice.component.css']
})
export class CreateNoticeComponent implements OnInit {
  createNoticeForm: FormGroup
  @Input() noticeDetails: InoticeDetails;
  @Output() noticeCreateOrCancel = new EventEmitter<boolean>();
  isEditMode = false;
  constructor(private formBuilder: FormBuilder, private billService: PmbrBillService) {

  }

  ngOnInit() {
    this.initiateForm();
    if (this.noticeDetails.noticeId) {
      this.getNoticeDetailsById(this.noticeDetails.noticeId);
    }
    else { this.isEditMode = true; }
  }
  initiateForm() {
    this.createNoticeForm = this.formBuilder.group({
      id: [null],
      pmBillId: [this.noticeDetails.billId],
      noticeType: [this.noticeDetails.noticeType],
      subject: [null, Validators.required],
      description: [null, Validators.required]
    })
  }
  saveOrCancel(event) {
    if (event) {
      for (const i in this.createNoticeForm.controls) {
        this.createNoticeForm.controls[i].markAsDirty();
        this.createNoticeForm.controls[i].updateValueAndValidity();
      }
      if (this.createNoticeForm.valid) {
        this.billService.saveNotice(this.createNoticeForm.value).subscribe(res => {
          this.noticeCreateOrCancel.emit(event)
        })
      }
    }
    else {
      this.noticeCreateOrCancel.emit(false)
    }
  }
  getNoticeDetailsById(noticeId) {
    this.billService.getNoticeById(noticeId).subscribe((res: any) => {
      this.patchValueToForm(res);
    })
  }
  patchValueToForm(data) {
    this.createNoticeForm.patchValue({
      id: data.id,
      pmBillId: data.pmBillId,
      noticeType: data.noticeType,
      subject: data.subject,
      description: data.description
    })
  }
}
