import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { NzNotificationService } from "ng-zorro-antd";

import { GenericfilesCommonService } from "../shared/services/genericfiles-common.service";
import { CKEConfig } from "../shared/config/ckeditor.config";
@Component({
  selector: "genericfile-templates",
  templateUrl: "./templates.component.html",
  styleUrls: ["./templates.component.css"],
})
export class TemplatesComponent implements OnInit {
  searchParam = null;
  templateList: any = [];
  tempTemplateList: any = [];
  isVisible = false;
  isCreateModal = false;
  iseditModal = false;
  viewContent;
  submitText;
  temp;
  id;
  templateForm = this.fb.group({
    name: [null, Validators.required],
    templateData: ["", Validators.required],
  });
  public Editor: any;
  ckeConfig: any = CKEConfig;
  constructor(
    @Inject("editor") public ckEditor,
    private common: GenericfilesCommonService,
    private fb: FormBuilder,
    private notify: NzNotificationService
  ) {
    this.Editor = ckEditor;
  }

  ngOnInit() {
    this.getAllTemplate();
  }
  search() {
    if (this.searchParam) {
      this.templateList = this.tempTemplateList.filter((element) =>
        element.name.toLowerCase().includes(this.searchParam.toLowerCase())
      );
    } else {
      this.templateList = this.tempTemplateList;
    }
  }
  getAllTemplate() {
    this.common.getTemplates().subscribe((res: any) => {
      this.templateList = this.tempTemplateList = res;
    });
  }
  showPreviewModal(templateData) {
    this.isVisible = true;
    if (templateData) {
      this.viewContent = templateData;
    } else {
      this.viewContent = "Nothing to preview";
    }
  }
  handleCancel() {
    this.isVisible = false;
    this.isCreateModal = false;
    this.templateForm.reset();
  }
  createTemp() {
    this.isCreateModal = true;
    this.submitText = "Create Template";
    this.temp = "Are you sure want to CreateTemplate?";
  }
  editTemp(data) {
    this.submitText = "Update Template";
    this.temp = "Are you sure want to UpdateTemplate?";
    this.id = data.id;
    this.templateForm.patchValue(data);

    this.isCreateModal = true;
  }
  createTemplate() {
    if (this.submitText == "Create Template") {
      const body = {
        active: true,
        id: null,
        name: this.templateForm.value.name,
        templateData: this.templateForm.value.templateData,
        templateInputs: [],
      };
      this.common.createTemplate(body).subscribe((res: any) => {
        this.notify.success("Success", "Template created Successfully !");
        this.isCreateModal = false;
        this.templateForm.reset();
        this.getAllTemplate();
      });
    } else {
      this.updateTemplate();
    }
  }
  updateTemplate() {
    const body = {
      active: true,
      id: this.id,
      name: this.templateForm.value.name,
      templateData: this.templateForm.value.templateData,
      templateInputs: [],
    };
    this.common.createTemplate(body).subscribe((res: any) => {
      this.notify.success("Success", "Template updated Successfully !");
      this.isCreateModal = false;
      this.templateForm.reset();
      this.getAllTemplate();
    });
  }
  deleteTemplate() {}
}
