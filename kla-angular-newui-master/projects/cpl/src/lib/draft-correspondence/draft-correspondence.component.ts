import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import {
  FieldConfig,
  DataConfig,
  AttachmentConfig,
} from "../shared/field.interface";
import { DocumentsService } from "../shared/services/documents.service";
import { FilesService } from "../shared/services/files.service";
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { DynamicFormComponent } from "../shared/components/dynamic-form/dynamic-form.component";
import { CurrespondenceService } from "../shared/services/currespondence.service";
import { UploadChangeParam, NzNotificationService } from "ng-zorro-antd";

@Component({
  selector: "cpl-draft-correspondence",
  templateUrl: "./draft-correspondence.component.html",
  styleUrls: ["./draft-correspondence.component.css"],
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
  viewContent = "";
  OriginalContent = "";
  user;
  deptList: any;
  isVisible: boolean;
  typeList: any;
  templateId;
  templateText = "";
  workFlowMandatory;
  saveButtonText: any;
  toLabelText = "Department";
  radioValue = "department";
  notify: any;
  corrspondenceId;
  corrspondenceResponse;
  selectedData;
  code: any;
  displayName: any;
  fileList: any = [];
  uploadURL = this.docService.uploadUrl();
  showUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    hidePreviewIconInNonImage: true,
  };
  correspondenceForm = this.fb.group({
    id: [0],
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
    toValue: [null, Validators.required],
    attachmentDto: [[]],
    masterLetter: [null],
  });
  documentData: any;
  urlParams: any;
  disabled = false;

  constructor(
    private docService: DocumentsService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private file: FilesService,
    private correspondenceService: CurrespondenceService,
    private notification: NzNotificationService,
    @Inject("authService") private AuthService,
    @Inject("notify") private NotificationCustomService
  ) {
    this.urlParams = this.router.getCurrentNavigation().extras.state;
    if (this.urlParams) {
      switch (this.urlParams.business) {
        case "CORRECTION_STATEMENT_REQUEST":
          this.radioValue = "section";
          this.disabled = true;
          break;
        case "DELAY_STATEMENT":
          this.radioValue = "department";
          this.disabled = true;
          break;
      }
      let tempMaster = true;
      if (this.urlParams.refrenceLetter) {
        tempMaster = false;
      }
      this.correspondenceForm.patchValue({
        businessReferId: this.urlParams.businessReferId,
        businessReferType: this.urlParams.businessReferType,
        businessReferSubType: this.urlParams.businessReferSubType,
        toValue: this.urlParams.toDisplayName,
        fileId: this.urlParams.fileId,
        fileNumber: this.urlParams.fileNumber,
        master: tempMaster,
        refrenceLetter: this.urlParams.refrenceLetter,
        masterLetter: this.urlParams.masterLetter,
      });
      // this.correspondenceForm.controls.businessReferId.setValue(this.urlParams.businessReferId);
      // this.correspondenceForm.controls.businessReferType.setValue(this.urlParams.businessReferType);
      // this.correspondenceForm.controls.businessReferSubType.setValue(this.urlParams.businessReferSubType);
      // this.correspondenceForm.controls.toValue.setValue(this.urlParams.toDisplayName);
      // this.correspondenceForm.controls.fileId.setValue(this.urlParams.fileId);
      // this.correspondenceForm.controls.fileNumber.setValue(this.urlParams.fileNumber);
      // this.correspondenceForm.controls.master.setValue(this.urlParams.masterLetter);
    }
    this.notify = NotificationCustomService;
    this.user = AuthService.getCurrentUser();
    this.code = this.user.correspondenceCode.code;
    this.displayName = this.user.correspondenceCode.displayName;
    // if (this.user.authorities.includes('Department')) {
    //   this.code = 'GENERAL_ADMINISTRATION';
    //   this.displayName = 'General Administration';
    // } else {
    //   this.code = 'CPL_SECTION';
    //   this.displayName = 'CPL';
    // }
    this.correspondenceForm.controls.userId.setValue(Number(this.user.userId));
    this.correspondenceForm.controls.from.setValue(this.code);
    this.correspondenceForm.controls.fromDisplayName.setValue(this.displayName);
    const templateId = this.route.snapshot.params.id;
    if (templateId && templateId > 0) {
      this.templateId = templateId;
    }
    this.getTemplateById(this.templateId);
  }

  ngOnInit() {
    this.getList();
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
            this.saveButtonText = "Save and Continue";
          } else {
            this.saveButtonText = "Save as Draft";
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
  sendCorrespondence(value) {
    let formData = {};
    if (this.form) {
      formData = this.form.form.getRawValue();
      for (let i = 0; i < this.FinalcomponentArray.length; i++) {
        if (formData[this.FinalcomponentArray[i].label]) {
          if (typeof formData[this.FinalcomponentArray[i].label] === "object") {
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
        } else {
          if (
            value === 1 &&
            (!this.FinalcomponentArray[i].value ||
              this.FinalcomponentArray[i].value.length <= 0)
          ) {
            this.viewContent = this.viewContent
              .split(this.FinalcomponentArray[i].label)
              .join("");
          }
        }
      }
      const values = this.FinalcomponentArray.map((x) => ({
        inputValue: x.inputValue,
        templateInputId: x.templateInputId,
      }));
      let to: any;
      if (
        this.urlParams &&
        this.urlParams.toCode &&
        this.urlParams.toDisplayName
      ) {
        to = [
          {
            id: null,
            toCode: this.urlParams.toCode,
            displayName: this.urlParams.toDisplayName,
          },
        ];
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
      this.correspondenceForm.get("values").setValue(values);
      this.correspondenceForm.get("data").setValue(this.viewContent);
      this.correspondenceForm.get("templateId").setValue(this.templateId);
      this.correspondenceForm.get("to").setValue(to);
      this.correspondenceForm.get("attachmentDto").setValue(attachment);
      // tslint:disable-next-line: forin
      for (const key in this.correspondenceForm.controls) {
        this.correspondenceForm.controls[key].markAsDirty();
        this.correspondenceForm.controls[key].updateValueAndValidity();
      }
      this.form.form.markAllAsTouched();
      if (this.form.form.invalid) {
        return;
      }

      if (this.correspondenceForm.valid) {
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
                          "success",
                          "Success",
                          "Correspondence Sent Successfully!"
                        );
                        if (this.urlParams) {
                          if (
                            this.urlParams.business ===
                            "CORRECTION_STATEMENT_REQUEST"
                          ) {
                            this.router.navigate(
                              [
                                "business-dashboard/cpl/cpl-view",
                                "view",
                                this.urlParams.businessReferId,
                              ],
                              {
                                state: {
                                  requestLetterId: Response.id,
                                },
                              }
                            );
                          }  else if (
                            this.urlParams.business ===
                            "DELAY_STATEMENT"
                          ) {
                            this.router.navigate(["business-dashboard/cpl/file-workflow", this.urlParams.fileId]);
                          } else {
                            this.router.navigate(
                              [
                                "/business-dashboard/cpl/correspondence",
                                "view",
                                this.corrspondenceId,
                              ],
                              {}
                            );
                          }
                          if (this.urlParams.business === "NO_BUSINESS") {
                            setTimeout(() => {
                              this.router.navigate([
                                "business-dashboard/cpl/correspondence-list",
                              ]);
                            }, 1500);
                          }
                        } else {
                          setTimeout(() => {
                            this.router.navigate(
                              [
                                "/business-dashboard/cpl/correspondence",
                                "view",
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
                    "success",
                    "Success",
                    "Saved Successfully!"
                  );
                  setTimeout(() => {
                    this.router.navigate(
                      [
                        "/business-dashboard/cpl/correspondence",
                        "view",
                        this.corrspondenceId,
                      ],
                      {}
                    );
                  }, 1500);
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
                  "success",
                  "Success",
                  "Saved Successfully!"
                );
                setTimeout(() => {
                  this.router.navigate(
                    [
                      "/business-dashboard/cpl/correspondence-workflow",
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
    this.router.navigate(["business-dashboard/cpl/select-template"], {
      state: this.urlParams ? this.urlParams : null,
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
          type: "ATTACHMENT",
        });
      }
    }
    this.attachmentDto = this.fileList;
    this.fileList = fileList.filter((item: any) => {
      if (item.response) {
        return item.response.status !== "success";
      }
      return true;
    });
  }
}
