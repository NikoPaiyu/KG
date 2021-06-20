import { Component, OnInit, ViewChild } from "@angular/core";
import { FieldConfig } from "../../shared/field.interface";
import { Validators, FormBuilder, FormControl } from "@angular/forms";
import { NoticeTemplateService } from "../../shared/services/notice-template.service";
import { DynamicFormComponent } from "../../shared/components/dynamic-form/dynamic-form.component";
import { Router, ActivatedRoute } from "@angular/router";
import { NotificationCustomService } from "src/app/shared/services/notification.service";
import { UserManagementService } from "src/app/business-dashboard/user-management/shared/services/user-management.service";
import { NoticeProcessService } from "../../shared/services/notice-process.service";
import { AuthService } from "src/app/auth/shared/services/auth.service";
import { NoticeService } from "../../shared/services/notice.service";
import { element } from "protractor";
import { NzModalService, UploadChangeParam, UploadFile } from 'ng-zorro-antd';
import { QuestionService } from 'src/app/business-dashboard/question/shared/question.service';
@Component({
  selector: "app-create-notice",
  templateUrl: "./create-notice.component.html",
  styleUrls: ["./create-notice.component.scss"],
})
export class CreateNoticeComponent implements OnInit {
  @ViewChild(DynamicFormComponent, { static: false })
  form: DynamicFormComponent = new DynamicFormComponent(this.fb);
  componentArray: FieldConfig[] = [];
  maxValue: any = [];
  maxNumber: any = [];
  maxId: any;
  valueId: any;
  selectedValue: any;
  noticeSubject: any;
  noticeType: any;
  templateList: any = [];
  id = 1;
  isVisible = false;
  isOkLoading = false;
  FinalcomponentArray: FieldConfig[] = [];
  viewContent = "";
  OriginalContent = "";
  assemblyList = [];
  sessionList = [];
  mlaList = [];
  noticeForm = this.fb.group({
    noticeId: [0],
    title: ["", Validators.required],
    noticeNumber: ["", Validators.required],
    templateId: [0, Validators.required],
    description: [""],
    assemblyId: [null, Validators.required],
    sessionId: [null, Validators.required],
    userID: [1, Validators.required],
    primaryMemberId: [null, Validators.required],
    noticeData: ["", Validators.required],
    values: [[]],
    attachments: [[]]
  });
  noticeDetails = {
    versions: {},
    versionOptions: [],
    notice: {
      title: "",
      noticeNumber: "",
      description: "",
      assemblyId: 0,
      sessionId: 0,
      values: null,
      noticeData: null,
      templateId: 1,
      templateName: "",
      numberOfNotes: 0,
      noticeId: 0,
      primaryMemberId: 0,
      formComponents: [],
      version: 1,
      userID: 0,
      primaryMember: { userId: 1, userName: "", details: { fullName: "" } },
      createdDate: "",
      status: '',
      attachments: []
    },
  };
  templateText = "";
  templateId = 0;
  noticeId = 0;
  userName: any;
  dropDownflag = false;
  statusDetail: any = [];
  uploadURL = this.notice.uploadUrl();
  fileLists = [];
  showUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    hidePreviewIconInNonImage: true,
  };
  noticeAttachments: any = [];
  activeAssemblySession: any = null;

  constructor(
    private service: NoticeTemplateService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private notify: NotificationCustomService,
    private user: UserManagementService,
    private process: NoticeProcessService,
    private auth: AuthService,
    public notice: NoticeService,
    private question: QuestionService,
    private modalService: NzModalService
  ) {
    const templateId = this.route.snapshot.params.id;
    const noticeId = this.route.snapshot.params.noticeId;
    if (
      templateId &&
      templateId > 0 &&
      (!(this.auth.getCurrentUser().authorities.includes("ppo") || this.auth.getCurrentUser().authorities.includes("parliamentaryPartySecretary"))) 
    ) {
      this.templateId = templateId;
      this.getNoticeTemplateData(templateId, this.auth.getCurrentUser().userId);
      this.noticeForm.controls.templateId.setValue(Number(templateId));
      this.noticeForm.controls.primaryMemberId.setValue(Number(this.auth.getCurrentUser().userId));
    } else {
      this.noticeForm.controls.templateId.setValue(Number(templateId));
    }
    if (noticeId && noticeId > 0) {
      this.noticeId = noticeId;
      this.getNoticebyNoticeId(noticeId);
    }
  }

  ngOnInit() {
    this.getTemplateList();
    this.getActiveAssemblySession();
    // this.getAssemblyList();
    // this.getSessionList();
    this.getAllMembers();
    this.loadPermissions();
    this.primaryMemberChange();
    this.getCurrentUsername();
    this.getPrimaryMemberByRole();
  }
  loadPermissions() {
    this.notice.getNoticePermissions(this.auth.getCurrentUser().userId);
  }

  Submit() {
    this.FinalcomponentArray = this.componentArray;
    this.componentArray = [];
  }
  GetKeys(data) {
    return Object.keys(data);
  }

  printPreview(): void {
    this.isVisible = true;
  }

  handleCancel(): void {
    this.isVisible = false;
  }
  // get template  data
  getNoticeTemplateData(templateId, primaryMemberId) {
    this.service
      .getTemplateData(templateId, primaryMemberId)
      .subscribe((Response) => {
        this.FinalcomponentArray = [];
        this.FinalcomponentArray = Response.formComponents;
        this.viewContent = Response.templateData;
        this.OriginalContent = Response.templateData;
      });
  }
  ShowForm(dataFromChild) {
    if (this.templateId > 0) {
      this.viewContent = this.OriginalContent;
    } else {
      this.viewContent = this.templateText;
    }
    const contentValues = dataFromChild.formValues;
    const ministerData = this.FinalcomponentArray.find(x => x.type === 'aodministerlist');
    if (ministerData) {
      const ministerDataLabel = ministerData.label;
      if (ministerDataLabel && contentValues) {
        if (contentValues[ministerDataLabel]) {
          const ministerId = contentValues[ministerDataLabel].id;
          if (ministerId) {
            this.FinalcomponentArray.forEach((el, i) => {
              if (el.type === 'aod' || el.type === 'portfoliosubject') {
                this.FinalcomponentArray[i].ministerId = ministerId;
              }
            });
          }
        }
      }
    }
    const labelArray = dataFromChild.fields.map((x) => x.label);
    labelArray.forEach((el) => {
      if (contentValues[el]) {
        if (typeof contentValues[el] === "object") {
          if (Array.isArray(contentValues[el])) {
            if (contentValues[el].length > 0) {
              let element = dataFromChild.fields.find(
                (element) => element.label == el
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
                  clauseString = clauseString + '<br><br>' + `Clause ${i + 1}<br>` + ele;
                  if (i === arrayData.length - 1) {
                    clauseString = clauseString + '?';
                  } else {
                    clauseString = clauseString + ';';
                  }
                });
                this.viewContent = this.viewContent.split(el).join(clauseString);
              }
            }
          } else if (typeof contentValues[el].getDate === 'function') {
            const d = new Date(contentValues[el]);
            const date = `${('0' + d.getDate()).slice(-2)}/${
              ('0' + (d.getMonth() + 1)).slice(-2)
              }/${d.getFullYear()}`;
            // this.viewContent = this.viewContent.replace(el, date);
            this.viewContent = this.viewContent.split(el).join(date);
          } else {
            // this.viewContent = this.viewContent.replace(
            //   el,
            //   contentValues[el].label
            // );
            this.viewContent = this.viewContent
              .split(el)
              .join(contentValues[el].label);
          }
        } else {
          // this.viewContent = this.viewContent.replace(el, contentValues[el]);
          this.viewContent = this.viewContent.split(el).join(contentValues[el]);
        }
      }
    });
  }
  getTemplateList() {
    this.service.getAllTemplates().subscribe((Response) => {
      if (Response) {
        this.templateList = Response;
      }
    });
  }
  getAssemblyList() {
    this.service.getAllAssembly().subscribe((Response) => {
      this.assemblyList = Response;
      const res = this.assemblyList.map((x) => x.assemblyId);
      this.maxNumber = Math.max.apply(null, res);
      const id = this.assemblyList.map((x) => x.id);
      this.maxId = Math.max.apply(null, id);
      if (!this.noticeForm.controls['assemblyId'].value) {
        this.noticeForm.controls['assemblyId'].setValue(this.activeAssemblySession.assemblyId);
      }
    });
  }
  getSessionList() {
    this.service.getAllSession().subscribe((Response) => {
      this.sessionList = Response;
      const result = this.sessionList.map((x) => x.sessionId);
      this.maxValue = Math.max.apply(null, result);
      const Id = this.sessionList.map((x) => x.id);
      this.valueId = Math.max.apply(null, Id);
      if (!this.noticeForm.controls['sessionId'].value) {
        this.noticeForm.controls['sessionId'].setValue(this.activeAssemblySession.sessionId);
      }
    });
  }
  getAllMembers() {
    if (!(this.auth.getCurrentUser().authorities.includes("ppo") || this.auth.getCurrentUser().authorities.includes("parliamentaryPartySecretary"))) {
      this.user.getAllMembers().subscribe((Response) => {
        this.mlaList = Response;
      });
    } else {
      this.question.getMyPartyMembers(this.auth.getCurrentUser().userId).subscribe((Response) => {
        this.mlaList = Response as any;
      });
    }

  }
  async saveNotice(value) {
    let formData = {};
    if (this.form) {
      formData = this.form.form.getRawValue();
      console.log(formData);
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.FinalcomponentArray.length; i++) {
        if (formData[this.FinalcomponentArray[i].label]) {
          if (typeof formData[this.FinalcomponentArray[i].label] === 'object') {
            if (Array.isArray(formData[this.FinalcomponentArray[i].label])) {
              this.FinalcomponentArray[i].inputValue = formData[
                this.FinalcomponentArray[i].label
              ].map(String);
              if (value === 1 && (!this.FinalcomponentArray[i].inputValue || this.FinalcomponentArray[i].inputValue.length <= 0)) {
                this.viewContent = this.viewContent
                  .split(this.FinalcomponentArray[i].label)
                  .join('');
              }
            } else if (
              typeof formData[this.FinalcomponentArray[i].label].getDate ===
              'function'
            ) {
              const d = formData[this.FinalcomponentArray[i].label];
              // const date = `${d.getDate()}/${d.getMonth() +
              //   1}/${d.getFullYear()}`;
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
          if (value === 1 && (!this.FinalcomponentArray[i].value || this.FinalcomponentArray[i].value.length <= 0)) {
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
      this.noticeForm.get("values").setValue(values);
      this.noticeForm.get("noticeData").setValue(this.viewContent);
      this.noticeForm.get("noticeNumber").setValue("NTC0011");
      this.noticeForm.get("userID").setValue(this.auth.getCurrentUser().userId);
      let tempAttachmentList = [];
      if (this.noticeId && this.noticeId > 0) {
        tempAttachmentList = [...this.noticeAttachments, ...this.noticeDetails.notice.attachments];
      } else {
        tempAttachmentList = this.noticeAttachments;
      }
      this.noticeForm.get('attachments').setValue(tempAttachmentList);
      // tslint:disable-next-line: forin
      for (const key in this.noticeForm.controls) {
        this.noticeForm.controls[key].markAsDirty();
        this.noticeForm.controls[key].updateValueAndValidity();
      }
      if (value === 1) {
        this.form.form.markAllAsTouched();
        if (this.form.form.invalid) {
          return;
        }
      }
      if (this.noticeForm.valid) {
        console.log(this.noticeForm.value);
        this.service.saveNotice(this.noticeForm.value).subscribe((Response) => {
          if (Response) {
            console.log(Response);
            if (value === 1) {
              if (Response.notice.noticeId > 0) {
                this.process
                  .submitNotice({ id: Response.notice.noticeId })
                  .subscribe((Response) => {
                    console.log(Response);
                    this.notify.showSuccess(
                      "Success",
                      "Notice submitted Successfully "
                    );
                    setTimeout(() => {
                      this.router.navigate(["../../notice/ab/list"], {
                        relativeTo: this.route.parent,
                      });
                    }, 1500);
                  });
              }
            } else {
              this.notify.showSuccess("Success", "Notice Saved Successfully");
              setTimeout(() => {
                this.router.navigate(["../../notice/ab/list"], {
                  relativeTo: this.route.parent,
                });
              }, 1500);
            }
          }
        });
      }
    } else {
      // tslint:disable-next-line: forin
      for (const key in this.noticeForm.controls) {
        this.noticeForm.controls[key].markAsDirty();
        this.noticeForm.controls[key].updateValueAndValidity();
      }
    }
  }
  getNoticebyNoticeId(id) {
    this.service.getData(id, this.auth.getCurrentUser().userId).subscribe((Response) => {
      if (Response) {
        console.log(Response);
        this.noticeDetails = Response as any;
        this.noticeDetails.notice.formComponents.forEach(element => {
          if (element.type === 'date' && element.value === null) {
            element.value = new Date();
          }
        });
        this.statusDetail = Response.notice.status;
        // this.loadButtons(this.statusDetail);
        this.noticeForm.patchValue(this.noticeDetails.notice, { emitEvent: false });
        this.getTemplateTexts(Response.notice.templateId).subscribe((res) => {
          this.templateText = res.templateData;
          const data = Response.notice.formComponents;
          // tslint:disable-next-line: prefer-for-of
          for (let i = 0; i < data.length; i++) {
            // tslint:disable-next-line: triple-equals
            if (data[i].type == 'select' || data[i].type == 'aodministerlist' || data[i].type == 'portfoliosubject'
                || data[i].type == 'questionlist' || data[i].type == 'questionanswerdate' || data[i].type == 'sronumber') {
              if (data[i].mode && data[i].mode == 'multiple') {
                data[i].value = data[i].value ? data[i].value.map(Number) : [];
              } else {
                const mladetail = data[i].options.find(
                  (x) => {
                    if (Number(x.id)) {
                      return Number(x.id) === Number(data[i].value);
                    }
                    return x.id == data[i].value;
                  }
                );
                data[i].value = mladetail;
              }
            }
            if (data[i].type === 'questiontype') {
              const detail = data[i].options.find(
                // tslint:disable-next-line: triple-equals
                (x) => x.id == data[i].value
              );
              data[i].value = detail;
            }
            if (data[i].type === 'date' && data[i].value) {
              data[i].value = new Date(data[i].value);
            }
            if (data[i].type === 'aod' && data[i].value) {
              data[i].value = new Date(data[i].value);
            }
            if (data[i].type === 'cosdates' && data[i].value) {
              data[i].value = new Date(data[i].value);
            }
            if (data[i].type === 'questiondebatedate' && data[i].value) {
              data[i].value = new Date(data[i].value);
            }
          }
          this.FinalcomponentArray = data;
          this.viewContent = Response.notice.noticeData;
          this.OriginalContent = this.viewContent;
        });
      }
    });
  }
  getTemplateTexts(templateId) {
    if (templateId) {
      return this.service.getTemplateById(templateId);
    }
  }
  // function for get template by primarymember if logined user is ppo
  getTemplateByPrimaryMemberId(primaryMemberId) {
    if (this.auth.getCurrentUser().authorities.includes('ppo') || this.auth.getCurrentUser().authorities.includes("parliamentaryPartySecretary")) {
      this.FinalcomponentArray = [];
      if (!this.noticeId) {
        this.templateId = this.route.snapshot.params.id;
        this.noticeForm.controls.templateId.setValue(Number(this.templateId));
        this.getNoticeTemplateData(this.templateId, primaryMemberId);
      } else {
        this.getNoticeTemplateFormDataOnPrimaryChnage(this.noticeId, primaryMemberId);
      }
    }
  }
  getNoticeTemplateFormDataOnPrimaryChnage(noticeId, primaryMemberId) {
    this.service
      .changetPrimaryOwner(noticeId, primaryMemberId)
      .subscribe((Response) => {
        const data = Response;
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < data.length; i++) {
          // tslint:disable-next-line: triple-equals
          if (data[i].type == "select") {
            if (data[i].mode && data[i].mode == "multiple") {
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
        this.FinalcomponentArray = data;

      });
  }

  primaryMemberChange() {
    this.noticeForm.controls['primaryMemberId'].valueChanges.subscribe(
      (selectedValue) => {
        let current = (selectedValue);
        let prev = (this.noticeForm.value.primaryMemberId);
        if (prev && current != prev) {
          this.modalService.confirm({
            nzTitle: 'Unsaved entries will be lost on member change. Are you sure ?',
            nzBodyStyle: { "margin": "20px" },
            nzOkText: 'Yes',
            nzOkType: 'danger',
            nzOnOk: () => { this.getTemplateByPrimaryMemberId(selectedValue); },
            nzCancelText: 'No',
            nzOnCancel: () => {
              this.noticeForm.controls['primaryMemberId'].setValue(prev, { emitEvent: false });
            }
          });
        } else if (!prev && selectedValue) {
          this.getTemplateByPrimaryMemberId(selectedValue);
        }

      }
    );
  }

  getCurrentUsername() {
    const userData = this.auth.getCurrentUser();
    this.userName = userData.fullName;
  }
  isMLA() {
    return this.auth.getCurrentUser().authorities.includes("MLA");
  }
  isPPO() {
    return (this.auth.getCurrentUser().authorities.includes("ppo")) || (this.auth.getCurrentUser().authorities.includes("parliamentaryPartySecretary"));
  }
  isSpeaker() {
    return this.auth.getCurrentUser().authorities.includes("speaker");
  }
  getPrimaryMemberByRole() {
    if (this.isMLA() && !this.isSpeaker()) {
      this.dropDownflag = false;
      // tslint:disable-next-line: align
    } else {
      this.dropDownflag = true;
    }
  }

  backToList() {
    let path = '../../notice/ab/list';
    if (!this.noticeId) {
      path = '../../notice/ab'
    }
    this.router.navigate([
      path
    ], {
      relativeTo: this.route.parent,
    });
  }
  showModal(): void {
    this.isVisible = true;
  }
  handleCancel1(): void {
    this.isVisible = false;
  }
  /* getNoticeButtons() {
     return {
       Resubmit: false
     }
   }
   loadButtons(noticeStatus) {
     if (this.notice.doIHaveAnAccess('NOTICE', 'CREATE') && noticeStatus === 'REVOKED') {
       this.noticeButtons.Resubmit = true;
     }
   }
   reSubmitNotice() {
     // tslint:disable-next-line: deprecation
     let formData = {};
     if (this.form) {
       formData = this.form.form.value;
       // tslint:disable-next-line: prefer-for-of
       for (let i = 0; i < this.FinalcomponentArray.length; i++) {
         if (typeof formData[this.FinalcomponentArray[i].label] === "object") {
           if (Array.isArray(formData[this.FinalcomponentArray[i].label])) {
             this.FinalcomponentArray[i].inputValue = formData[
               this.FinalcomponentArray[i].label
             ].map(String);
           } else if (
             typeof formData[this.FinalcomponentArray[i].label].getDate ===
             "function"
           ) {
             const d = formData[this.FinalcomponentArray[i].label];
             // const date = `${d.getDate()}/${d.getMonth() +
             //   1}/${d.getFullYear()}`;
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
       const values = this.FinalcomponentArray.map((x) => ({
         inputValue: x.inputValue,
         templateInputId: x.templateInputId,
       }));
       if (true) {
         this.noticeForm.get("values").setValue(values);
         this.noticeForm.get("noticeData").setValue(this.viewContent);
         this.noticeForm.get("userID").setValue(this.auth.getCurrentUser().userId);
         this.service.versionCreation(this.noticeForm.value).subscribe((Response) => {
           if (Response) {
             this.saveNotice(1);
           }
         });
       }
     });
   }*/

   handleChange(info: UploadChangeParam): void {
    const fileLists = [...info.fileList];
    this.noticeAttachments = [];
    if (info.file.response) {
      for (const file of fileLists) {
        if (file.response) {
          file.url = file.response.body;
          this.noticeAttachments.push({
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

  showAttachment(url) {
    window.open(url, '_blank');
  }

  deleteAttachment(id) {
    this.noticeDetails.notice.attachments.find(a => a.id == id).delete = true;
  }

  cancel() {}

   getActiveAssemblySession() {
    this.notice.getActiveAssemblySession().subscribe((res: any) => {
      this.activeAssemblySession = res;
      this.getAssemblyList();
      this.getSessionList();
    });
  }
}
