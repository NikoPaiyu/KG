import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { DynamicFormComponent } from '../shared/components/dynamic-form/dynamic-form.component';
import { SdfgPreViewComponent } from '../shared/components/sdfg-preview/sdfg-preview.component';
import { FieldConfig, DataConfig, AttachmentConfig } from '../shared/field.interface';
import { Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CorrespondenceService } from '../shared/services/correspondence.service';
import { NzNotificationService, UploadChangeParam } from 'ng-zorro-antd';
import { NzModalService } from 'ng-zorro-antd';


@Component({
  selector: 'correspondence-draft-correspondence',
  templateUrl: './draft-correspondence.component.html',
  styleUrls: ['./draft-correspondence.component.scss']
})
export class DraftCorrespondenceComponent implements OnInit {
  @ViewChild(DynamicFormComponent, { static: false })
  form: DynamicFormComponent = new DynamicFormComponent(this.fb);
  date = new Date();
  FinalcomponentArray: FieldConfig[] = [];
  toData: DataConfig[] = [];
  attachmentDto: AttachmentConfig[] = [];
  templateList: any;
  templateName;
  templateData: any;
  viewContent = '';
  OriginalContent = '';
  user;
  deptList: any;
  isVisible: boolean;
  typeList: any;
  templateId;
  templateText = '';
  workFlowMandatory;
  saveButtonText: any;
  toLabelText = 'Department';
  radioValue = 'department';
  notify: any;
  corrspondenceId;
  corrspondenceResponse;
  selectedData;
  code: any;
  displayName: any;
  fileList: any = [];
  uploadURL = this.correspondenceService.uploadUrl();
  showUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    hidePreviewIconInNonImage: true,
  };
  correspondenceForm = this.fb.group({
    id: [0],
    from: ['', Validators.required],
    fromDisplayName: ['', Validators.required],
    title: ['', Validators.required],
    status: [null],
    businessReferId: [null],
    businessReferType: [null],
    businessReferSubType: [null],
    businessReferValue: [null],
    workflowId: [null],
    fileId: [0],
    fileNumber: [null],
    templateId: ['', Validators.required],
    to: [[]],
    data: ['', Validators.required],
    values: [[]],
    userId: ['', Validators.required],
    refrenceLetter: [null],
    master: [true],
    toValue: [null, Validators.required],
    attachmentDto: [[]],
    masterLetter: [null],
    toTypableValue: [null, Validators.required],
    isResubmit: [null]
  });
  documentData: any;
  urlParams: any;
  disabled = false;
  toEditable  = false;
  toTypable = false;
  onSaveSupportAttch = false
  isSubmit = false;
  timeAllocationDto;
  ReplyLetterResponseDto;
  GRLresponseDto;
  budgetParams = {sdfgPreview: false, sdfgList: [], selsdfgId: '', showPreview: false, drpdwnTitle: 'SDFG/VOA' };
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private correspondenceService: CorrespondenceService,
    private notification: NzNotificationService,
    @Inject('authService') private AuthService,
    @Inject('notify') private NotificationCustomService,
    private modalService: NzModalService
  ) {
    this.urlParams = this.router.getCurrentNavigation().extras.state;
    if (this.urlParams) {
      switch (this.urlParams.business) {
        case 'CORRECTION_STATEMENT_REQUEST':
          this.radioValue = 'section';
          this.disabled = true;
          break;
        case 'DELAY_STATEMENT':
          this.radioValue = 'department';
          this.disabled = true;
          break;
      }
      let tempMaster = true;
      if (this.urlParams.refrenceLetter) {
        tempMaster = false;
      }
      if (this.urlParams.toEditable) {
        this.toEditable = true;
      }
      if (this.urlParams.toTypable) {
        this.toTypable = true;
      }
      this.correspondenceForm.patchValue({
        businessReferId: this.urlParams.businessReferId,
        businessReferType: this.urlParams.businessReferType,
        businessReferSubType: this.urlParams.businessReferSubType,
        businessReferValue: this.urlParams.businessReferValue ? this.urlParams.businessReferValue : "",
        toValue: this.urlParams.toDisplayName,
        toTypableValue :  this.urlParams.business ==('TABLE_OBITURY_FAMILY_LETTER'||this.urlParams.business === 'ELECTION_PRO_TEM_SPEAKER_GOVERNORS_LETEER') ? this.urlParams.toDisplayName : " ",
        fileId: this.urlParams.fileId,
        fileNumber: this.urlParams.fileNumber,
        master: tempMaster,
        refrenceLetter: this.urlParams.refrenceLetter,
        masterLetter: this.urlParams.masterLetter,
        isResubmit: this.urlParams.isResubmit
      });
    }
    this.notify = NotificationCustomService;
    this.user = AuthService.getCurrentUser();
    this.code = this.user.correspondenceCode.code;
    this.displayName = this.user.correspondenceCode.displayName;
    this.correspondenceForm.controls.userId.setValue(Number(this.user.userId));
    this.correspondenceForm.controls.from.setValue(this.code);
    this.correspondenceForm.controls.fromDisplayName.setValue(this.displayName);
    const templateId = this.route.snapshot.params.id;
    if (templateId && templateId > 0) {
      this.templateId = templateId;
    }
    this.getTemplateById(this.templateId);
    if (this.urlParams) {
      if (this.urlParams.business && this.urlParams.business == "COMMITTEE_NOMINEE_SUBMISSION") {
        this.correspondenceForm.addControl('businessData', this.fb.array([]))
      }
      if (this.urlParams.business && (this._checkIfTimeAllocationBusiness()) || this.urlParams.business == 'TABLE_BUSINESS_TIME_ALLOCATION_RESPONSE') {
        this.correspondenceForm.addControl('businessData', this.fb.array([]))
      }
      if (this.urlParams.business && (this.urlParams.business == "BUDGET_SDFG_LETTER_RESPONSE" || this.urlParams.business == "BUDGET_VOA_LETTER_RESPONSE") ) {
        this.correspondenceForm.addControl('businessData', this.fb.array([]))
        this.getDocType();
      }
      if (this.urlParams.business && this.urlParams.business == "BUDGET_DOCUMENT_REPLY_LETTER") {
        this.correspondenceForm.addControl('businessData', this.fb.group({
          documents: this.fb.array([]),
          budgetSpeech: this.fb.group({
            name : [null,[Validators.required]],
            url: [null,[Validators.required]],
            budgetCategory : [null,[Validators.required]],
          }),
          validFrom :[null,[Validators.required]],
          validTo:[null,[Validators.required]],
          password:[null,[Validators.required]],
        }))
      }
      if (this.urlParams.business && (
        this.urlParams.business == "BUDGET_AP_BILL_RESPONSE" ||
        this.urlParams.business == "SDG_AP_BILL_RESPONSE" ||
        this.urlParams.business == "VOA_AP_BILL_RESPONSE"
        )
         ) {
        this.correspondenceForm.addControl('businessData', this.fb.array([]))
      }
      if(this.urlParams.business && this.urlParams.business == "BUDGET_DOCUMENT_GRL_REPLY_LETTER") {
        this.correspondenceForm.addControl('businessData', this.fb.group({
          content: [null,[Validators.required]],
          forBudget: [true],
          forVoa: [false],
        }))
      } 
      if(this.urlParams.business && this.urlParams.business == "BUDGET_SDG_EG_REPLY_LETTER") {
        this.correspondenceForm.addControl('businessData', this.fb.group({
          content: [null,[Validators.required]],
          sdgAndEgId: [null,[Validators.required]],
        }))
      }
      if (this.urlParams.business && this.urlParams.business === 'PRIORITY_LIST_RESPONSE') {
        this.correspondenceForm.addControl('businessData', this.fb.group(this.urlParams.businessData));
      }
    }
  }

  ngOnInit() {
    this.getToList();
    console.log(this.correspondenceForm.value)
  }

  getToList() {
    if (this.urlParams.business === 'TABLE_GOVERNORS_ADDRESS_CORRESPONDANCE_COVERING_LETTER' ||
    this.urlParams.business === 'TABLE_LETTER_WITH_COVERING_LETTER' ||
    this.urlParams.business === 'TABLE_CORRESPONDANCE_LAW_DEPT') {
      this.getToListByBusiness(this.urlParams.business);
    } else {
      this.getList();
    }
  }

  getTemplateById(templateId) {
    this.correspondenceService
      .getTemplateFormById(templateId)
      .subscribe((Response) => {
        if (Response) {
          this.templateData = Response;
          this.workFlowMandatory = this.templateData.workFlowMandatory;
          this.templateName = this.templateData.name;
          if (this.workFlowMandatory === true) {
            this.saveButtonText = 'Save and Continue';
          } else {
            this.saveButtonText = 'Save as Draft';
          }
          this.FinalcomponentArray = this.templateData.formComponents;
          this.viewContent = this.templateData.templateData;
          this.OriginalContent = this.templateData.templateData;
        }
      });
  }
  showForm(dataFromChild) {
    if (this.templateId > 0) {
      this.viewContent = this.OriginalContent;
    } else {
      this.viewContent = this.templateText;
    }
    const contentValues = dataFromChild.formValues;
    const labelArray = dataFromChild.fields.map((x) => x.label);
    labelArray.forEach((el) => {
      if (contentValues[el]) {
        if (typeof contentValues[el] === 'object') {
          if (Array.isArray(contentValues[el])) {
            if (contentValues[el].length > 0) {
              let element = dataFromChild.fields.find(
                (element) => element.label === el
              );
              if (element.options) {
                let data = element.options
                  .filter((element) => contentValues[el].includes(element.id))
                  .map((x) => x.label)
                  .toString();
                this.viewContent = this.viewContent.split(el).join(data);
              }
              if (Array.isArray(element.value)) {
                const arrayData: [] = element.value;
                let clauseString = '';
                arrayData.forEach((ele, i) => {
                  clauseString = clauseString + '<br>' + ele;
                });
                this.viewContent = this.viewContent
                  .split(el)
                  .join(clauseString);
              }
            }
          } else if (typeof contentValues[el].getDate === 'function') {
            const d = new Date(contentValues[el]);
            const date = `${d.getDate()}/${
              d.getMonth() + 1
            }/${d.getFullYear()}`;
            this.viewContent = this.viewContent.split(el).join(date);
          } else {
            this.viewContent = this.viewContent
              .split(el)
              .join(contentValues[el].label);
          }
        } else {
          this.viewContent = this.viewContent.split(el).join(contentValues[el]);
        }
      }
    });
  }
  sendCorrespondence(value) {
    this.isSubmit = true;
    let formData = {};
    if (this.form) {
      formData = this.form.form.getRawValue();
      for (let i = 0; i < this.FinalcomponentArray.length; i++) {
        if (formData[this.FinalcomponentArray[i].label]) {
          if (typeof formData[this.FinalcomponentArray[i].label] === 'object') {
            if (Array.isArray(formData[this.FinalcomponentArray[i].label])) {
              this.FinalcomponentArray[i].inputValue = formData[
                this.FinalcomponentArray[i].label
              ].map(String);
              if (
                value === 1 &&
                (!this.FinalcomponentArray[i].inputValue ||
                  this.FinalcomponentArray[i].inputValue.length <= 0)
              ) {
                this.viewContent = this.viewContent
                  .split(this.FinalcomponentArray[i].label)
                  .join('');
              }
            } else if (
              typeof formData[this.FinalcomponentArray[i].label].getDate ===
              'function'
            ) {
              const d = formData[this.FinalcomponentArray[i].label];
              this.FinalcomponentArray[i].inputValue = d;
            } else {
              this.FinalcomponentArray[i].inputValue =
                formData[this.FinalcomponentArray[i].label].id;
            }
          } else {
            this.FinalcomponentArray[i].inputValue =
              formData[this.FinalcomponentArray[i].label];
          }
        } else {
          if (
            value === 1 &&
            (!this.FinalcomponentArray[i].value ||
              this.FinalcomponentArray[i].value.length <= 0)
          ) {
            this.viewContent = this.viewContent
              .split(this.FinalcomponentArray[i].label)
              .join('');
          }
        }
      }
      const values = this.FinalcomponentArray.map((x) => ({
        inputValue: x.inputValue,
        templateInputId: x.templateInputId,
      }));
      let to = [];
      if (
        this.urlParams &&
        this.urlParams.toCode &&
        this.urlParams.toDisplayName
      ) {
        if(Array.isArray(this.urlParams.toCode)){
          this.urlParams.toCode.forEach(element => {
            if(element){
              let data={
                  id: null,
                  toCode: element.code,
                  displayName: element.displayName,
              };
              to.push(data);
            }
          });
        } else if (this.urlParams.toDisplayName === 'All Members') {
          const toList = this.typeList.filter(x => x.type === 'MEMBER');
          toList.forEach(element => {
            const data = {
              id: null,
              toCode: element.code,
              displayName: element.displayName,
          };
            to.push(data);
          });
        } else{
        to = [
          {
            id: null,
            toCode: this.urlParams.toCode,
            displayName: this.urlParams.toDisplayName,
          },
        ];
      }
      } else {
        to = this.toData.map((x) => ({
          id: null,
          toCode: x.code,
          displayName: x.displayName,
        }));
      }
      const attachment = this.attachmentDto.map((x) => ({
        name: x.name,
        attachmentUrl: x.attachmentUrl,
        type: x.type,
      }));
      this.correspondenceForm.get('values').setValue(values);
      this.correspondenceForm.get('data').setValue(this.viewContent);
      this.correspondenceForm.get('templateId').setValue(this.templateId);
      this.correspondenceForm.get('to').setValue(to);
      this.correspondenceForm.get('attachmentDto').setValue(attachment);
      if(this.toTypable){
        this.correspondenceForm.get('toValue').setValue(this.correspondenceForm.value.toTypableValue);
      }
      // tslint:disable-next-line: forin
      for (const key in this.correspondenceForm.controls) {
        this.correspondenceForm.controls[key].markAsDirty();
        this.correspondenceForm.controls[key].updateValueAndValidity();
        if (key === "businessData") {
          const control = this.correspondenceForm.get("businessData") as FormArray;
          // tslint:disable-next-line: forin
          for (const j in control.controls) {
              const controlTwo = control.controls[j] as FormGroup;
              // tslint:disable-next-line: forin
              for (const k in controlTwo.controls) {
                controlTwo.controls[k].markAsDirty();
                controlTwo.controls[k].updateValueAndValidity();
              }
            }
          }
      }
      this.form.form.markAllAsTouched();
      if(this.urlParams && this.urlParams.business == "COMMITTEE_MEETING_SUPPORTING_DOCUMENT_RESPONSE"){
        this.onSaveSupportAttch = true
        if(this.fileList.length < 1){
           return;
        }
      }
      if (this.form.form.invalid) {
        return;
      }
      if (this.correspondenceForm.valid) {
        if(this.urlParams && this.urlParams.business == "COMMITTEE_NOMINEE_SUBMISSION"){
          this.bussinessDataForCommitteResponse();
        }
        if(this.urlParams && (this._checkIfTimeAllocationBusiness() || this.urlParams.business == 'TABLE_BUSINESS_TIME_ALLOCATION_RESPONSE')){
          if(!this.timeAllocationDto) {
            this.notification.warning('Warning', 'Assign Member Time!');
            return;
          }
          if(this.timeAllocationDto && this.timeAllocationDto.length < 3 &&  this.urlParams.business !== 'TABLE_BUSINESS_TIME_ALLOCATION_RESPONSE' ) {
            this.notification.warning('Warning', 'Please Allocate 3 Days');
            return;
          }
          this.bussinessDataForTimeAllocationResponse();
        }
        if(this.urlParams && this.urlParams.business == "BUDGET_DOCUMENT_REPLY_LETTER"){
          this.bussinessDataForbudgetDocreplyLetter();
        }
        // if(this.urlParams && this.urlParams.business == "BUDGET_DOCUMENT_GRL_REPLY_LETTER"){
        //   this.bussinessDataForbudgetGRLreplyLetter();
        // }
        if(this.toEditable){
          let toArray = [];
          if(this.toTypable){
             toArray = [{
              id: null,
              toCode: '',
              displayName: this.correspondenceForm.value.toTypableValue,
            }]
            this.correspondenceForm.get('toValue').setValue(toArray);
          }else{
           toArray = this.correspondenceForm.value.toValue.map((x) => ({
            id: null,
            toCode: x.code,
            displayName: x.displayName,
          }));
          }
          this.correspondenceForm.get('to').setValue(toArray);
        }
        if(this.urlParams && (this.urlParams.business == "BUDGET_SDFG_LETTER_RESPONSE" || this.urlParams.business == "BUDGET_VOA_LETTER_RESPONSE")){
          if(!this.budgetParams.selsdfgId) {
            this.notification.warning('Warning', 'Please Select SDFG/VOA..');
            return;
          }
          this.correspondenceForm.value.businessData = {sdfgId: this.budgetParams.selsdfgId};
        }
        if (this.workFlowMandatory === false) {
          this.correspondenceService
            .saveCorrespondence(this.correspondenceForm.value)
            .subscribe((Response) => {
              if (Response) {
                this.corrspondenceResponse = Response;
                this.corrspondenceId = this.corrspondenceResponse.id;
                if (value === 1) {
                  this.correspondenceService
                    .sendCorrespondence(this.corrspondenceId)
                    .subscribe((Response: any) => {
                      if (Response) {
                        // this.notify.showSucess('Success', 'Send Successfully!');
                        this.notification.create(
                          'success',
                          'Success',
                          'Correspondence Sent Successfully!'
                        );
                        if (this.urlParams) {
                          if (
                            this.urlParams.business ===
                            'CORRECTION_STATEMENT_REQUEST'
                          ) {
                            this.router.navigate(
                              [
                                'business-dashboard/cpl/cpl-view',
                                'view',
                                this.urlParams.businessReferId,
                              ],
                              {
                                state: {
                                  requestLetterId: Response.id,
                                },
                              }
                            );
                          } else if (
                            this.urlParams.business ===
                            'REQUEST_PRIORITY_LIST'
                          ) {
                            this.router.navigate([this.urlParams.onSuccess]);
                          } else {
                            this.router.navigate(
                              [
                                '/business-dashboard/correspondence/correspondence',
                                'view',
                                this.corrspondenceId,
                              ],
                              {}
                            );
                          }
                          if (this.urlParams.business === 'NO_BUSINESS') {
                            setTimeout(() => {
                              this.router.navigate([
                                'business-dashboard/correspondence/correspondence',
                                'view',
                                this.corrspondenceId,
                              ]);
                            }, 1500);
                          }
                        } else {
                          setTimeout(() => {
                            this.router.navigate(
                              [
                                '/business-dashboard/correspondence/correspondence',
                                'view',
                                this.corrspondenceId,
                              ],
                              {}
                            );
                          }, 1500);
                        }
                      }
                    });
                } else {
                  // this.notify.showSucess('Success', 'Saved Successfully!');
                  this.notification.create(
                    'success',
                    'Success',
                    'Saved Successfully!'
                  );
                  if (
                    this.urlParams && this.urlParams.business ===
                    'REQUEST_PRIORITY_LIST'
                  ) {
                  this.router.navigate(['business-dashboard/bill/file-view/', 'priorityRequest', this.urlParams.fileId]);
                  } else if (this.urlParams.redirectToFile) {
                    if (this.urlParams.redirectToModule === 'TABLES') {
                      this.router.navigate(['/business-dashboard/tables/file-view', this.urlParams.fileId]);
                    } else if (this.urlParams.redirectToModule === 'TABLES_PROTEM') {
                      this.router.navigate(['business-dashboard/tables/file-view', 'pro-tem-speaker', this.urlParams.fileId]);
                    } else if (this.urlParams.redirectToModule === 'TABLES_SPEAKER_ELECTION') {
                      this.router.navigate(['business-dashboard/tables/file-view', 'election', this.urlParams.fileId]);
                    } else if (this.urlParams.redirectToModule === 'PMBR') {
                      this.router.navigate(['business-dashboard/pmbr/file-view', this.urlParams.fileId]);
                    } else if (this.urlParams.redirectToModule === 'BUDGET') {
                      if(this.urlParams.business === 'BUDGET_SDFG_LETTER' 
                      || this.urlParams.business === 'BUDGET_VOA_LETTER' 
                      || this.urlParams.business === 'BUDGET_AP_BILL_REQUEST' 
                      || this.urlParams.business === 'VOA_AP_BILL_REQUEST'
                      || this.urlParams.business === 'SDG_AP_BILL_REQUEST'
                      ) {
                          this.router.navigate(['business-dashboard/budgets/files/bd-files']);
                          return;
                      }
                      this.router.navigate(['business-dashboard/budgets/file-view', this.urlParams.fileId]);
                    }
                  } 
                  else if(this.urlParams && this.urlParams.business === 'BILL_ERRATA_LETTER') {
                    this.router.navigate(['business-dashboard/bill/errata-list']);
                  } else {
                  setTimeout(() => {
                    this.router.navigate(
                      [
                        '/business-dashboard/correspondence/correspondence',
                        'view',
                        this.corrspondenceId,
                      ],
                      {}
                    );
                  }, 1500);
                 }
                }
              }
            });
        } else {
          this.correspondenceService
            .saveCorrespondence(this.correspondenceForm.value)
            .subscribe((Response) => {
              if (Response) {
                this.corrspondenceResponse = Response;
                this.corrspondenceId = this.corrspondenceResponse.id;
                // this.notify.showSucess('Success', 'Saved Successfully!');
                this.notification.create(
                  'success',
                  'Success',
                  'Saved Successfully!'
                );
                setTimeout(() => {
                  this.router.navigate(
                    [
                      '/business-dashboard/correspondence/correspondence-workflow',
                      this.corrspondenceId,
                    ],
                    {}
                  );
                }, 1500);
              }
            });
        }
      }
    } else {
      // tslint:disable-next-line: forin
      for (const key in this.correspondenceForm.controls) {
        this.correspondenceForm.controls[key].markAsDirty();
        this.correspondenceForm.controls[key].updateValueAndValidity();
        if (key === "businessData") {
          let control;
          if(this.urlParams && (this.urlParams.business == "BUDGET_DOCUMENT_REPLY_LETTER" || 
          this.urlParams.business == "BUDGET_DOCUMENT_GRL_REPLY_LETTER" || 
          this.urlParams.business == "BUDGET_SDG_EG_REPLY_LETTER")){
             control = this.correspondenceForm.get("businessData") as FormGroup;
          }else{
             control = this.correspondenceForm.get("businessData") as FormArray;
          }
        // tslint:disable-next-line: forin
        for (const j in control.controls) {
            const controlTwo = control.controls[j] as FormGroup;
            // tslint:disable-next-line: forin
            for (const k in controlTwo.controls) {
              controlTwo.controls[k].markAsDirty();
              controlTwo.controls[k].updateValueAndValidity();
            }
          }
        }
      }
    }
  }
  getList() {
    this.correspondenceService.getAllToData().subscribe((res) => {
      this.typeList = res;
      const temp = this.typeList;
      if (this.user.correspondenceCode.type === 'DEPARTMENT') {
        this.typeList = temp.filter(element => element.type !== 'DEPARTMENT');
      }
      if(this.toEditable){
        if(this.urlParams.business == 'COMMITTEE_MEETING_NOTICE' 
         ){
          this.typeList = temp.filter(element => element.type == 'MEMBER');
        }
        this.correspondenceForm.patchValue({
          toValue: this.urlParams.toDisplayName
        })
      }
    });
  }
  getToListData(event) {
    this.toData = event;
  }
  attachFiles() {
    this.isVisible = true;
  }
  handleCancel() {
    this.isVisible = false;
  }
  attach() {}
  cancel() {
    this.isVisible = false;
  }

  goToTemplateSelect() {
    this.router.navigate(['business-dashboard/correspondence/select-template'], {
      state: this.urlParams ? this.urlParams : null,
    });
  }
  handleChange(info: UploadChangeParam): void {
    let fileType = 'ATTACHMENT';
    let fileName = '';
    if(this.urlParams){
      if(this.urlParams.business == "COMMITTEE_MEETING_SUPPORTING_DOCUMENT_RESPONSE") {
        fileType = 'SUPPORTING_DOCUMENT'
      }
      if(this.urlParams.business == "TABLE_GOVERNORS_SPEECH") {
        fileType = 'GOVERNORS_SPEECH';
        fileName = 'Governors Speech English'
      }
    }
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
    this.attachmentDto = this.fileList;
    this.fileList = fileList.filter((item: any) => {
      if (item.response) {
        return item.response.status !== 'success';
      }
      return true;
    });
  }
bussinessDataForCommitteResponse(){
  this.correspondenceForm.value.businessData.forEach(element => {
    element.memberName =  element.memberId.details.fullName,
    element.memberMalayalamName =  element.memberId.details.malayalamFullName,
    element.memberId = element.memberId.userId;
    element.subjectName = element.subjectId.subjectName;
    element.subjectId = element.subjectId.id;
  });
}
bussinessDataForTimeAllocationResponse(){
  this.timeAllocationDto.forEach(element => {
    this.correspondenceForm.value.businessData.push(element)
  });
  console.log(this.timeAllocationDto)
}
bussinessDataForbudgetDocreplyLetter(){
  let modified  = this.correspondenceForm.value.businessData.documents.map((x) => ({
    name:x.name,
    url:x.url
  }));
  this.correspondenceForm.value.businessData.documents = modified;
 // this.correspondenceForm.value.businessData.push(JSON.stringify(this.ReplyLetterResponseDto))
}
bussinessDataForbudgetGRLreplyLetter(){
  this.correspondenceForm.value.businessData=this.GRLresponseDto;
 // this.correspondenceForm.value.businessData.push(JSON.stringify(this.ReplyLetterResponseDto))
}

bussinessDataForAPbillOnBudget(){
  
  this.correspondenceForm.value.businessData.forEach(element => {
    element.memberName =  element.memberId.details.fullName,
    element.memberMalayalamName =  element.memberId.details.malayalamFullName,
    element.memberId = element.memberId.userId;
    element.subjectName = element.subjectId.subjectName;
    element.subjectId = element.subjectId.id;
  });
}
getBusinessData(event) {
  this.timeAllocationDto = event;
}
getbusinessDocData(event){
  this.ReplyLetterResponseDto = event;
}
getbusinessGRLData(event){
  this.GRLresponseDto= event;
}
compareFn = (o1: any, o2: any) => (o1 && o2 ? o1.displayName === o2.displayName : o1 === o2);

getToListByBusiness(code) {
  this.correspondenceService.getToListGovernorsAddress(code).subscribe(res => {
    this.typeList = res;
  });
}
  _canShowSaveBtn() {
    if (this.urlParams) {
      if (this.urlParams.business == "TABLE_TIME_ALLOCATION_RESPONSE") {
        return false;
      } else if (this.urlParams.business == "BUDGET_TIME_ALLOCATION_BUDGET_SPEECH_RESPONSE") {
        return false;
      } else if (this.urlParams.business == "BUDGET_TIME_ALLOCATION_CUT_MOTION_RESPONSE") {
        return false;
      }else if (this.urlParams.business == "BUDGET_SDFG_LETTER_RESPONSE") {
        return false;
      }else if (this.urlParams.business == "BUDGET_VOA_LETTER_RESPONSE") {
        return false;
      } else if (this.urlParams.business == "BUDGET_AP_BILL_RESPONSE") {
        return false;
      } else if (this.urlParams.business == "VOA_AP_BILL_RESPONSE") {
        return false;
      } else if (this.urlParams.business == "SDG_AP_BILL_RESPONSE") {
        return false;
      } else if (this.urlParams.business == "BUDGET_DOCUMENT_REPLY_LETTER") {
        return false;
      }else if (this.urlParams.business == "BUDGET_DOCUMENT_GRL_REPLY_LETTER") {
        return false; 
      }else if (this.urlParams.business == "BUDGET_SDG_EG_REPLY_LETTER") {
        return false; 
      }else if (this.urlParams.business == "SDG_EG_TIME_ALLOCATION_RESPONSE") {
        return false; 
      }else if (this.urlParams.business == "BUDGET_TIME_ALLOCATION_AP_BILL_ON_BUDGET_RESPONSE") {
        return false; 
      }else if (this.urlParams.business == "BUDGET_TIME_ALLOCATION_AP_BILL_ON_SDG_RESPONSE") {
        return false; 
      }else if (this.urlParams.business == "BUDGET_TIME_ALLOCATION_AP_BILL_ON_VOA_RESPONSE") {
        return false; 
      }else if (this.urlParams.business == "TABLE_BUSINESS_TIME_ALLOCATION_RESPONSE") {
        return false; 
      }
    }
    return true;
  }
  _checkIfTimeAllocationBusiness() {
    if (this.urlParams) {
      if (this.urlParams.business == "TABLE_TIME_ALLOCATION_RESPONSE") {
        return true;
      } else if (this.urlParams.business == "BUDGET_TIME_ALLOCATION_BUDGET_SPEECH_RESPONSE") {
        return true;
      } else if (this.urlParams.business == "BUDGET_TIME_ALLOCATION_CUT_MOTION_RESPONSE") {
        return true;
      }else if (this.urlParams.business == "SDG_EG_TIME_ALLOCATION_RESPONSE") {
        return true;
      }else if (this.urlParams.business == "BUDGET_TIME_ALLOCATION_AP_BILL_ON_BUDGET_RESPONSE") {
        return true; 
      }else if (this.urlParams.business == "BUDGET_TIME_ALLOCATION_AP_BILL_ON_SDG_RESPONSE") {
        return true; 
      }else if (this.urlParams.business == "BUDGET_TIME_ALLOCATION_AP_BILL_ON_VOA_RESPONSE") {
        return true; 
      }
    }
    return false;
  }
  getDocType() {
    this.correspondenceService.getBudgetNature(this.urlParams.masterLetter).subscribe((res: any) => {
      if(res && res.body) {
        this.budgetParams.drpdwnTitle = (res.body === 'INTERIM') ? 'VOA': 'SDFG';
        this.sdfgListForBudgetBusiness();
      }
    });
  }
  sdfgListForBudgetBusiness() {
    this.correspondenceService.getAllSDFG(this.urlParams.masterLetter).subscribe((res: any) => {
      if(res && res.content) {
        this.budgetParams.sdfgList = res.content.filter((el) => el.status === 'SUBMITTED');
      }
    });
  }
  selectSDFG(sdfgId) {
    this.budgetParams.showPreview = true;
    this.budgetParams.selsdfgId = sdfgId;
  }
  showSDFGPreview() {
    this.modalService.create({
      nzContent: SdfgPreViewComponent,
      nzWidth: "650",
      nzStyle: () => {'overflow:auto;'},
      nzFooter: null,
      nzTitle: 'SDFG',
      nzClosable: true,
      nzOnOk: () => {},
      nzOnCancel: () => {this.budgetParams.sdfgPreview = false},
      nzComponentParams: {
        sdfgId: this.budgetParams.selsdfgId
      },
    });
  }
}
