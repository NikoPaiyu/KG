import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CurrespondenceService } from "../shared/services/currespondence.service";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { DataConfig, FieldConfig, AttachmentConfig } from "../shared/field.interface";
import { CommonService } from "../shared/services/common.service";
import { DynamicFormComponent } from "../shared/components/dynamic-form/dynamic-form.component";
import * as jsPdf from "jspdf";
import { NzNotificationService, UploadChangeParam } from 'ng-zorro-antd';
import { DocumentsService } from '../shared/services/documents.service';
@Component({
  selector: "cpl-correspondence",
  templateUrl: "./correspondence.component.html",
  styleUrls: ["./correspondence.component.scss"],
})
export class CorrespondenceComponent implements OnInit {
  @ViewChild(DynamicFormComponent, { static: false })
  form: DynamicFormComponent = new DynamicFormComponent(this.fb);
  correspondenceId: any;
  correspondenceData: any;
  code: any;
  user: any;
  isEdit: boolean;
  typeList;
  selectedData;
  toData: DataConfig[] = [];
  FinalcomponentArray: FieldConfig[] = [];
  templateId;
  viewContent = "";
  OriginalContent = "";
  templateText = "";
  templateData: any;
  to;
  toCode;
  toValue = [];
  toTypeList = [];
  status: boolean;
  validateForm: FormGroup;
  editButton = false;
  sendButton = false;
  attachments: any = [];
  listOfData: any = [];
  versionFlag: boolean;
  uploadURL = this.docService.uploadUrl();
  fileList: any = [];
  purpose: any;
  filteredData = [];
  showUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    hidePreviewIconInNonImage: true,
  };
  attachmentDto: AttachmentConfig[] = [];
  urlParams: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private correspondenceService: CurrespondenceService,
    private fb: FormBuilder,
    private commonService: CommonService,
    private notification: NzNotificationService,
    private docService: DocumentsService,
    @Inject('authService') private AuthService
  ) {
    this.formValidation();
    this.user = AuthService.getCurrentUser();
    this.code = this.user.correspondenceCode.code;
    this.commonService.getCPLPermissions(this.user.rbsPermissions);
    this.urlParams = this.router.getCurrentNavigation().extras.state;
  }

  ngOnInit() {
    this.correspondenceId = this.route.snapshot.params.id;
    this.getList();
    this.getCorrespondenceById();
    setTimeout(() => {
      this.loadPermissions();
      if (this.route.snapshot.params.purpose === "edit") {
        this.purpose = 'edit';
      }
    }, 500);
  }
  formValidation(): void {
    this.validateForm = this.fb.group({
      id: [0, Validators.required],
      from: ["", Validators.required],
      fromDisplayName: ["", Validators.required],
      title: ["", Validators.required],
      status: [null],
      businessReferId: [null],
      businessReferType: [null],
      businessReferSubType: [null],
      workflowId: [null],
      fileId: [0],
      fileNumber: [null],
      templateId: ["", Validators.required],
      to: [[]],
      data: ["", Validators.required],
      values: [[]],
      userId: ["", Validators.required],
      refrenceLetter: [null],
      master: [true],
      toValue: [],
      attachmentDto: [[]],
      currentVersion: []
    });
  }
  getCorrespondenceById() {
    this.correspondenceService
      .getCorrespondenceById(this.correspondenceId, this.code)
      .subscribe((Res) => {
        if (Res) {
        this.correspondenceData = Res;
        if (this.purpose) {
          this.editCorrespondence();
        }
        this.listOfData = this.correspondenceData.data;
        if (this.correspondenceData.versionOption.length > 1) {
          this.versionFlag = true;
        }
        // this.getTemplateById(this.correspondenceData.templateId);
        if (
          this.correspondenceData.status === "DRAFT" ||
          this.correspondenceData.status === "APPROVAL_PENDING"
        ) {
          this.status = true;
        }
        this.toValue = this.correspondenceData.toCode.map((x) => x.displayName);
        this.validateForm.patchValue({
          title: this.correspondenceData.title,
          toValue: this.toValue,
        });
        if (this.correspondenceData.attachmentDto) {
          this.attachments = this.correspondenceData.attachmentDto;
        }
        }
  });
}
  editCorrespondence() {
    this.isEdit = true;
    this.viewContent = this.correspondenceData.templateData;
    this.OriginalContent = this.correspondenceData.templateData;
    const data = this.correspondenceData.form;
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < data.length; i++) {
      if (data[i].type === "select") {
        if (data[i].mode && data[i].mode === "multiple") {
          data[i].value = data[i].value ? data[i].value.map(Number) : [];
        } else {
          const mladetail = data[i].options.find(
            (x) => x.id === Number(data[i].value)
          );
          data[i].value = mladetail;
        }
      }
      if (data[i].type === "date") {
        data[i].value = new Date(data[i].value);
      }
    }
    this.FinalcomponentArray = [];
    this.FinalcomponentArray = data;
  }
  getList() {
      this.correspondenceService.getAllToData().subscribe((res) => {
        this.typeList = res;
        this.toTypeList = this.typeList.map((x) => ({
          label: x.displayName,
          value: x.displayName,
        }));
      });
  }
  getToListData(event) {
    if (event) {
      this.toData = [];
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < event.length; i++) {
        this.typeList.forEach((el) => {
          if (el.displayName === event[i]) {
            this.toData.push(el);
          }
        });
      }
      this.filteredData = this.toValue.filter(
        item => !event.includes(item));
    }
  }
  // getTemplateById(templateId) {
  //   this.correspondenceService
  //     .getTemplateFormById(templateId)
  //     .subscribe((Response) => {
  //       if (Response) {
  //         this.templateData = Response;
  //         this.FinalcomponentArray = this.templateData.formComponents;
  //         this.viewContent = this.templateData.templateData;
  //         this.OriginalContent = this.templateData.templateData;
  //       }
  //     });
  // }
  showForm(dataFromChild) {
    if (this.correspondenceId) {
      this.viewContent = this.OriginalContent;
    }
    const contentValues = dataFromChild.formValues;
    const labelArray = dataFromChild.fields.map((x) => x.label);
    labelArray.forEach((el) => {
      if (contentValues[el]) {
        if (typeof contentValues[el] === "object") {
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
                let clauseString = "";
                arrayData.forEach((ele, i) => {
                  clauseString = clauseString + "<br>" + ele;
                });
                this.viewContent = this.viewContent
                  .split(el)
                  .join(clauseString);
              }
            }
          } else if (typeof contentValues[el].getDate === "function") {
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
  updateCorrespondence() {
    let formData = {};
    if (this.form) {
      formData = this.form.form.getRawValue();
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.FinalcomponentArray.length; i++) {
        if (formData[this.FinalcomponentArray[i].label]) {
          if (typeof formData[this.FinalcomponentArray[i].label] === "object") {
            if (Array.isArray(formData[this.FinalcomponentArray[i].label])) {
              this.FinalcomponentArray[i].inputValue = formData[
                this.FinalcomponentArray[i].label
              ].map(String);
              if (
                !this.FinalcomponentArray[i].inputValue ||
                this.FinalcomponentArray[i].inputValue.length <= 0
              ) {
                this.viewContent = this.viewContent
                  .split(this.FinalcomponentArray[i].label)
                  .join("");
              }
            } else if (
              typeof formData[this.FinalcomponentArray[i].label].getDate ===
              "function"
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
        }
      }
      const values = this.FinalcomponentArray.map((x) => ({
        inputValue: x.inputValue,
        templateInputId: x.templateInputId,
      }));
      if (this.toData.length <= 0) {
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < this.toValue.length; i++) {
          this.typeList.forEach((el) => {
            if (el.displayName === this.toValue[i]) {
              this.toData.push(el);
            }
          });
        }
      }
      this.to = this.toData.map((x) => ({
        id: x.id,
        toCode: x.code,
        displayName: x.displayName,
      }));
      if (this.attachments.length > 0) {
        this.attachments.forEach(element => {
          this.attachmentDto.push(element);
        });
      }
      if (this.filteredData) {
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < this.filteredData.length; i++) {
          this.correspondenceData.toCode.forEach((el) => {
            if (el.displayName === this.filteredData[i]) {
              this.correspondenceService.deleteTo(this.correspondenceId, el.id).subscribe(res => {
              });
            }
          });
        }
      }
      const attachment = this.attachmentDto.map((x) => ({
        name: x.name,
        attachmentUrl: x.attachmentUrl,
        type: x.type
      }));
      this.validateForm.get('from').setValue(this.correspondenceData.fromCode);
      this.validateForm.get('fromDisplayName').setValue(this.correspondenceData.fromDisplayName);
      this.validateForm.get('values').setValue(values);
      this.validateForm.get('to').setValue(this.to);
      this.validateForm.get('data').setValue(this.viewContent);
      this.validateForm.get('id').setValue(this.correspondenceId);
      this.validateForm.get('templateId').setValue(this.correspondenceData.templateId);
      this.validateForm.get('userId').setValue(this.user.userId);
      this.validateForm.get('attachmentDto').setValue(attachment);
      this.validateForm.patchValue({
        status: this.correspondenceData.status,
        businessReferId: this.correspondenceData.businessReferId,
        businessReferType: this.correspondenceData.businessReferType,
        businessReferSubType: this.correspondenceData.businessReferSubType,
        workflowId: this.correspondenceData.workflowId,
        fileId: this.correspondenceData.fileId,
        fileNumber: this.correspondenceData.fileNumber,
        refrenceLetter: this.correspondenceData.refrenceLetter,
        master: this.correspondenceData.master
      });
      if (this.validateForm.valid) {
      this.correspondenceService.saveCorrespondence(this.validateForm.value).subscribe( Response => {
        if (Response) {
          // this.notify.showSucess('Success', 'Updated Successfully!');
          if (this.correspondenceData.status === 'APPROVAL_PENDING') {
            this.router.navigate([
              "business-dashboard/cpl/correspondence-workflow",
              this.correspondenceId,
            ]);
          } else {
            this.isEdit = false;
            this.router.navigate(['/business-dashboard/cpl/correspondence-list']);
          }
        }
      });
    }
    } else {
      // tslint:disable-next-line: forin
      for (const key in this.validateForm.controls) {
        this.validateForm.controls[key].markAsDirty();
        this.validateForm.controls[key].updateValueAndValidity();
      }
    }
  }
  sendCorrespondence() {
    this.correspondenceService
      .sendCorrespondence(this.correspondenceId)
      .subscribe((Response: any) => {
        if (Response) {
          // this.notify.showSucess('Success', 'Send Successfully!');
          this.notification.create(
            "success",
            "Success",
            "Correspondence sent Successfully!"
          );
          this.router.navigate([
            "business-dashboard/cpl/correspondence-list"
          ]);
        }
      });
  }

  goBack() {
    if (this.urlParams) {
      this.router.navigate(['business-dashboard/cpl/correspondence-list'], {
        state: this.urlParams ? this.urlParams : null
      });
    } else {
      window.history.back();
    }
  }

  loadPermissions() {
    if (
      this.commonService.doIHaveCorrespondenceAccess("CORRESPONDENCE", "UPDATE")
    ) {
      this.editButton = true;
    }
    if (
      this.commonService.doIHaveCorrespondenceAccess("CORRESPONDENCE", "SUBMIT")
    ) {
      this.sendButton = true;
    }
  }

  cancelUpdate() {
    if (this.correspondenceData.status === "APPROVAL_PENDING") {
      this.router.navigate([
        "business-dashboard/cpl/correspondence-workflow",
        this.correspondenceId,
      ]);
    } else {
      this.isEdit = false;
    }
  }

  replyLetter() {
    this.router.navigate(["business-dashboard/cpl/select-template"], {
      state: {
        business: 'NO_BUSINESS',
        type: this.user.correspondenceCode.code,
        fileId: this.correspondenceData.fileId,
        businessReferId: this.correspondenceData.businessReferId,
        businessReferType: this.correspondenceData.businessReferType,
        businessReferSubType: this.correspondenceData.businessReferSubType,
        businessReferNumber: this.correspondenceData.typeNumber,
        fileNumber: this.correspondenceData.fileNumber,
        departmentId: null,
        masterLetter: this.correspondenceData.masterLetter,
        refrenceLetter: this.correspondenceData.id,
        toCode: this.correspondenceData.fromCode,
        toDisplayName: this.correspondenceData.fromDisplayName,
      },
    });
  }
  currespondenceDetailView() {
    this.router.navigate([
      "business-dashboard/cpl/correspondencedetailview",
      this.correspondenceId,
    ]);
  }

  showReference(id) {
    if (this.correspondenceData.businessCode === 'AMENDMENT') {
      this.router.navigate(['business-dashboard/cpl/amendment-view', id]);
    } else {
      this.router.navigate(['business-dashboard/cpl/cpl-view', 'view', id]);
    }
  }

  showAttachment( url) {
    window.open(url, '_blank');
  }
  getVersion(version) {
    this.listOfData = this.correspondenceData.versionMap[version];
  }

  cancel() {}

  deleteAttachment(item) {
    this.attachments.forEach(element => {
      if (element.name === item.name) {
        this.attachments.pop(element);
      }
    });
  }
  handleChange(info: UploadChangeParam): void {
    const fileList = [...info.fileList];
    this.fileList = [];
    if (info.file.response) {
      for (const file of fileList) {
        this.fileList.push({
          name: info.file.name,
          attachmentUrl: info.file.response.body,
          type: 'ATTACHMENT'
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
//   download(){
//     var doc = new jsPdf("p", "pt", "a6");
//     var elementHandler = {
//       '#ignorePDF': function (element, renderer) {
//         return true;
//       }
//     }; 
   
//  const printContents = this.correspondenceData.data;
//     const popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
//     popupWin.document.open();
// popupWin.document.write(`
// <html>
// <head>
// <title>Print tab</title>
// <style>
// //........Customized style.......
// </style>
// </head>
// <body onload="window.print();window.close()">${printContents}</body>
// </html>`
// );
// popupWin.document.close();
//   }
download() {
  let printContents, popupWin;
  printContents = this.correspondenceData.data;
  let doc = new jsPdf("p", "pt");
  printContents = this.correspondenceData.data;
  var blob = doc.output("blob");
  popupWin =  window.open(URL.createObjectURL(blob));
  // popupWin = window.open('', '_blank', 'top=0,right=25%,left=25%,height=100%,width=auto');
  popupWin.document.open();
  popupWin.document.write(`
    <html>
      <head>
        <title>Detalied View</title>
        <style>
        .ql-editor {
          box-sizing: border-box;
          line-height: 1.42;
          height: 100%;
          outline: none;
          padding: 12px 15px;
          tab-size: 4;
          -moz-tab-size: 4;
          text-align: left;
          white-space: pre-wrap;
          word-wrap: break-word;
        }
        .ql-editor p,
        .ql-editor ol,
        .ql-editor ul,
        .ql-editor pre,
        .ql-editor blockquote,
        .ql-editor h1,
        .ql-editor h2,
        .ql-editor h3,
        .ql-editor h4,
        .ql-editor h5,
        .ql-editor h6 {
          margin: 0;
          padding: 0;
          counter-reset: list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
        }
        .ql-editor ol,
        .ql-editor ul {
          padding-left: 1.5em;
        }
        .ql-editor ol > li,
        .ql-editor ul > li {
          list-style-type: none;
        }
        
        .ql-editor ul[data-checked=true],
        .ql-editor ul[data-checked=false] {
          pointer-events: none;
        }
        .ql-editor ul[data-checked=true] > li *,
        .ql-editor ul[data-checked=false] > li * {
          pointer-events: all;
        }
        .ql-editor ul[data-checked=true] > li::before,
        .ql-editor ul[data-checked=false] > li::before {
          color: #777;
          cursor: pointer;
          pointer-events: all;
        }
        
        
        .ql-editor li::before {
          display: inline-block;
          white-space: nowrap;
          width: 1.2em;
        }
        .ql-editor li:not(.ql-direction-rtl)::before {
          margin-left: -1.5em;
          margin-right: 0.3em;
          text-align: right;
        }
        .ql-editor li.ql-direction-rtl::before {
          margin-left: 0.3em;
          margin-right: -1.5em;
        }
        .ql-editor ol li:not(.ql-direction-rtl),
        .ql-editor ul li:not(.ql-direction-rtl) {
          padding-left: 1.5em;
        }
        .ql-editor ol li.ql-direction-rtl,
        .ql-editor ul li.ql-direction-rtl {
          padding-right: 1.5em;
        }
        .ql-editor ol li {
          counter-reset: list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
          counter-increment: list-0;
        }
        .ql-editor ol li:before {
          content: counter(list-0, decimal) '. ';
        }
        .ql-editor ol li.ql-indent-1 {
          counter-increment: list-1;
        }
        .ql-editor ol li.ql-indent-1:before {
          content: counter(list-1, lower-alpha) '. ';
        }
        .ql-editor ol li.ql-indent-1 {
          counter-reset: list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
        }
        .ql-editor ol li.ql-indent-2 {
          counter-increment: list-2;
        }
        .ql-editor ol li.ql-indent-2:before {
          content: counter(list-2, lower-roman) '. ';
        }
        .ql-editor ol li.ql-indent-2 {
          counter-reset: list-3 list-4 list-5 list-6 list-7 list-8 list-9;
        }
        .ql-editor ol li.ql-indent-3 {
          counter-increment: list-3;
        }
        .ql-editor ol li.ql-indent-3:before {
          content: counter(list-3, decimal) '. ';
        }
        .ql-editor ol li.ql-indent-3 {
          counter-reset: list-4 list-5 list-6 list-7 list-8 list-9;
        }
        .ql-editor ol li.ql-indent-4 {
          counter-increment: list-4;
        }
        .ql-editor ol li.ql-indent-4:before {
          content: counter(list-4, lower-alpha) '. ';
        }
        .ql-editor ol li.ql-indent-4 {
          counter-reset: list-5 list-6 list-7 list-8 list-9;
        }
        .ql-editor ol li.ql-indent-5 {
          counter-increment: list-5;
        }
        .ql-editor ol li.ql-indent-5:before {
          content: counter(list-5, lower-roman) '. ';
        }
        .ql-editor ol li.ql-indent-5 {
          counter-reset: list-6 list-7 list-8 list-9;
        }
        .ql-editor ol li.ql-indent-6 {
          counter-increment: list-6;
        }
        .ql-editor ol li.ql-indent-6:before {
          content: counter(list-6, decimal) '. ';
        }
        .ql-editor ol li.ql-indent-6 {
          counter-reset: list-7 list-8 list-9;
        }
        .ql-editor ol li.ql-indent-7 {
          counter-increment: list-7;
        }
        .ql-editor ol li.ql-indent-7:before {
          content: counter(list-7, lower-alpha) '. ';
        }
        .ql-editor ol li.ql-indent-7 {
          counter-reset: list-8 list-9;
        }
        .ql-editor ol li.ql-indent-8 {
          counter-increment: list-8;
        }
        .ql-editor ol li.ql-indent-8:before {
          content: counter(list-8, lower-roman) '. ';
        }
        .ql-editor ol li.ql-indent-8 {
          counter-reset: list-9;
        }
        .ql-editor ol li.ql-indent-9 {
          counter-increment: list-9;
        }
        .ql-editor ol li.ql-indent-9:before {
          content: counter(list-9, decimal) '. ';
        }
        .ql-editor .ql-indent-1:not(.ql-direction-rtl) {
          padding-left: 3em;
        }
        .ql-editor li.ql-indent-1:not(.ql-direction-rtl) {
          padding-left: 4.5em;
        }
        .ql-editor .ql-indent-1.ql-direction-rtl.ql-align-right {
          padding-right: 3em;
        }
        .ql-editor li.ql-indent-1.ql-direction-rtl.ql-align-right {
          padding-right: 4.5em;
        }
        .ql-editor .ql-indent-2:not(.ql-direction-rtl) {
          padding-left: 6em;
        }
        .ql-editor li.ql-indent-2:not(.ql-direction-rtl) {
          padding-left: 7.5em;
        }
        .ql-editor .ql-indent-2.ql-direction-rtl.ql-align-right {
          padding-right: 6em;
        }
        .ql-editor li.ql-indent-2.ql-direction-rtl.ql-align-right {
          padding-right: 7.5em;
        }
        .ql-editor .ql-indent-3:not(.ql-direction-rtl) {
          padding-left: 9em;
        }
        .ql-editor li.ql-indent-3:not(.ql-direction-rtl) {
          padding-left: 10.5em;
        }
        .ql-editor .ql-indent-3.ql-direction-rtl.ql-align-right {
          padding-right: 9em;
        }
        .ql-editor li.ql-indent-3.ql-direction-rtl.ql-align-right {
          padding-right: 10.5em;
        }
        .ql-editor .ql-indent-4:not(.ql-direction-rtl) {
          padding-left: 12em;
        }
        .ql-editor li.ql-indent-4:not(.ql-direction-rtl) {
          padding-left: 13.5em;
        }
        .ql-editor .ql-indent-4.ql-direction-rtl.ql-align-right {
          padding-right: 12em;
        }
        .ql-editor li.ql-indent-4.ql-direction-rtl.ql-align-right {
          padding-right: 13.5em;
        }
        .ql-editor .ql-indent-5:not(.ql-direction-rtl) {
          padding-left: 15em;
        }
        .ql-editor li.ql-indent-5:not(.ql-direction-rtl) {
          padding-left: 16.5em;
        }
        .ql-editor .ql-indent-5.ql-direction-rtl.ql-align-right {
          padding-right: 15em;
        }
        .ql-editor li.ql-indent-5.ql-direction-rtl.ql-align-right {
          padding-right: 16.5em;
        }
        .ql-editor .ql-indent-6:not(.ql-direction-rtl) {
          padding-left: 18em;
        }
        .ql-editor li.ql-indent-6:not(.ql-direction-rtl) {
          padding-left: 19.5em;
        }
        .ql-editor .ql-indent-6.ql-direction-rtl.ql-align-right {
          padding-right: 18em;
        }
        .ql-editor li.ql-indent-6.ql-direction-rtl.ql-align-right {
          padding-right: 19.5em;
        }
        .ql-editor .ql-indent-7:not(.ql-direction-rtl) {
          padding-left: 21em;
        }
        .ql-editor li.ql-indent-7:not(.ql-direction-rtl) {
          padding-left: 22.5em;
        }
        .ql-editor .ql-indent-7.ql-direction-rtl.ql-align-right {
          padding-right: 21em;
        }
        .ql-editor li.ql-indent-7.ql-direction-rtl.ql-align-right {
          padding-right: 22.5em;
        }
        .ql-editor .ql-indent-8:not(.ql-direction-rtl) {
          padding-left: 24em;
        }
        .ql-editor li.ql-indent-8:not(.ql-direction-rtl) {
          padding-left: 25.5em;
        }
        .ql-editor .ql-indent-8.ql-direction-rtl.ql-align-right {
          padding-right: 24em;
        }
        .ql-editor li.ql-indent-8.ql-direction-rtl.ql-align-right {
          padding-right: 25.5em;
        }
        .ql-editor .ql-indent-9:not(.ql-direction-rtl) {
          padding-left: 27em;
        }
        .ql-editor li.ql-indent-9:not(.ql-direction-rtl) {
          padding-left: 28.5em;
        }
        .ql-editor .ql-indent-9.ql-direction-rtl.ql-align-right {
          padding-right: 27em;
        }
        .ql-editor li.ql-indent-9.ql-direction-rtl.ql-align-right {
          padding-right: 28.5em;
        }
        .ql-editor .ql-video {
          display: block;
          max-width: 100%;
        }
        .ql-editor .ql-video.ql-align-center {
          margin: 0 auto;
        }
        .ql-editor .ql-video.ql-align-right {
          margin: 0 0 0 auto;
        }
        .ql-editor .ql-bg-black {
          background-color: #000;
        }
        .ql-editor .ql-bg-red {
          background-color: #e60000;
        }
        .ql-editor .ql-bg-orange {
          background-color: #f90;
        }
        .ql-editor .ql-bg-yellow {
          background-color: #ff0;
        }
        .ql-editor .ql-bg-green {
          background-color: #008a00;
        }
        .ql-editor .ql-bg-blue {
          background-color: #06c;
        }
        .ql-editor .ql-bg-purple {
          background-color: #93f;
        }
        .ql-editor .ql-color-white {
          color: #fff;
        }
        .ql-editor .ql-color-red {
          color: #e60000;
        }
        .ql-editor .ql-color-orange {
          color: #f90;
        }
        .ql-editor .ql-color-yellow {
          color: #ff0;
        }
        .ql-editor .ql-color-green {
          color: #008a00;
        }
        .ql-editor .ql-color-blue {
          color: #06c;
        }
        .ql-editor .ql-color-purple {
          color: #93f;
        }
        .ql-editor .ql-font-serif {
          font-family: Georgia, Times New Roman, serif;
        }
        .ql-editor .ql-font-monospace {
          font-family: Monaco, Courier New, monospace;
        }
        .ql-editor .ql-size-small {
          font-size: 0.75em;
        }
        .ql-editor .ql-size-large {
          font-size: 1.5em;
        }
        .ql-editor .ql-size-huge {
          font-size: 2.5em;
        }
        .ql-editor .ql-direction-rtl {
          direction: rtl;
          text-align: inherit;
        }
        .ql-editor .ql-align-center {
          text-align: center;
        }
        .ql-editor .ql-align-justify {
          text-align: justify;
        }
        .ql-editor .ql-align-right {
          text-align: right;
        }
        .ql-editor.ql-blank::before {
          color: rgba(0,0,0,0.6);
          content: attr(data-placeholder);
          font-style: italic;
          left: 15px;
          pointer-events: none;
          position: absolute;
          right: 15px;
        }
        </style>
      </head>
  <body onload="window.print();window.close()"><div class="ql-editor">${printContents}</div></body>
    </html>`
  );
  popupWin.document.close();
}

}
