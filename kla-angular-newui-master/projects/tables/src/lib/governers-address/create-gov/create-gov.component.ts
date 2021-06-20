import { Component, OnInit, Inject, Input, Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { NzNotificationService } from 'ng-zorro-antd';
import { TablescommonService } from '../../shared/services/tablescommon.service';
import { GovernersAddressService } from '../../shared/services/governersaddress.service';
import { differenceInCalendarDays, parseISO } from 'date-fns';
import { NzModalService, UploadChangeParam, UploadFile } from 'ng-zorro-antd';

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'tables-create-gov',
  templateUrl: './create-gov.component.html',
  styleUrls: ['./create-gov.component.scss']
})
export class CreateGovComponent implements OnInit {
  @Input() assemblySession;
  @Input() govData;

  createAddressForm: FormGroup;
  today: any = new Date();
  uploadURL = this.common.uploadUrl();
  govStatus;  fileLists = [];
  showUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    hidePreviewIconInNonImage: true,
  };
  cosAttachments: any = [];
  constructor(public common: TablescommonService,
    private router: Router,
    private fb: FormBuilder,
    private notification: NzNotificationService,
    private route: ActivatedRoute,
    private governerAddrss: GovernersAddressService,
    @Inject('authService') public auth
  ) {
  }
  uploadUrl

  ngOnInit() {
    this.formvalidation();
    this.patchValues()
  }
  formvalidation() {
    this.createAddressForm = this.fb.group({
      Date: [null, [Validators.required]],
      Assembly: [null, [Validators.required]],
      Session: [null, [Validators.required]],
      note: [null, [Validators.required]],
      id: [null]
    });
  }
  patchValues() {
    if (this.govData) {
      this.govStatus = this.govData.status;
      this.createAddressForm.patchValue({
        Assembly: this.assemblySession["assembly"].currentassembly,
        Session: this.assemblySession["session"].currentsession,
        Date: this.govData.governorsAddressDate,
        id: this.govData.id,
        note: this.govData.note
      });
    }
  }
  saveGovernerAddress(type) {
    let reqParam = {
      "id": (this.createAddressForm.value.id) ? this.createAddressForm.value.id : null,
      "assemblyId": this.createAddressForm.value.Assembly,
      "sessionId": this.createAddressForm.value.Session,
      "governorsAddressDate": this.createAddressForm.value.Date,
      note: this.createAddressForm.value.note
    }
    this.governerAddrss.saveGovernerAddrss(reqParam).subscribe((res: any) => {
      if (!res) {
        return;
      }
      this.createAddressForm.value.id = res.id;
      if (type === 'SUBMIT') {
        //this.submitGovernerAddress();
        return;
      }
     // this.getGovernersddressList();
    });
  }
  // submitGovernerAddress() {
  //   let reqParam = this._buildReqForGovAddrss();
  //   this.file.createFile(reqParam).subscribe((res: any) => {
  //     this.notify.create('success', 'Success', ' Submitted successfully');
  //     this.getGovernersddressList();
  //   });
  // }
  _buildReqForGovAddrss() {
    return ({
      "governorsAddressId": (this.createAddressForm.value.id) ? this.createAddressForm.value.id : null,
      "fileForm": {
        "assemblyId": this.createAddressForm.value.Assembly,
        "currentNumber": null,
        "description": "FILE GOVERNORS ADDRESS",
        "sessionId": this.createAddressForm.value.Session,
        "status": "saved",
        "subject": "GOVERNORS ADDRESS",
        "activeSubTypes": [
          "TABLE_GOVERNORS_ADDRESS"
        ],
        "subtype": "TABLE_GOVERNORS_ADDRESS",
        "type": "TABLE",
        "userId": this.auth.getCurrentUser().userId,
        "priority": "ASSEMBLY_URGENT"
      }
    })
  }
  disabledDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, this.today) < 0;
  }
  findAssembly(assemblyId) {
    if (this.assemblySession["assembly"])
      return this.assemblySession["assembly"].find(o => o.id === assemblyId).assemblyId;
  }
  findSession(sessionId) {
    if (this.assemblySession["session"]){
      let session = this.assemblySession["session"].find(o => o.id === sessionId);
      if(session) {
        return session.sessionId;
      }
    }
  }
  handleChange(info: UploadChangeParam): void {
    const fileLists = [...info.fileList];
    this.cosAttachments = [];
    if (info.file.response) {
      for (const file of fileLists) {
        if (file.response) {
          file.url = file.response.body;
          this.cosAttachments.push({
          id: null,
          name: file.name,
          url: file.response.body,
          delete: false
        });
       }
      }
    }
    this.fileLists = fileLists.filter((item: any) => {
      if (item.response) {
        return item.response.status !== "success";
      }
      return true;
    });
  }

  handlePreview = async (file: UploadFile) => {
    window.open(file.url, '_blank');
  }
}
