import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { NoticeTemplateService } from "../../shared/services/notice-template.service";
import { ActivatedRoute, Router } from "@angular/router";
import { NotificationCustomService } from 'src/app/shared/services/notification.service';
import { QuillEditorComponent } from 'ngx-quill';

@Component({
  selector: "app-create-template",
  templateUrl: "./create-template.component.html",
  styleUrls: ["./create-template.component.scss"]
})
export class CreateTemplateComponent implements OnInit {
  @ViewChild('editor', { static: false }) editor: QuillEditorComponent;
  noticeTemplateForm: FormGroup = this.fb.group({
    id: [0, Validators.required],
    name: ["", Validators.required],
    workflowId: ["", Validators.required],
    templateData: ["", Validators.required],
    categoryId: ["", Validators.required],
    ruleId: ["", Validators.required],
    templateInputs: this.fb.array([
      this.fb.group({
        inputSequence: [null, Validators.required],
        id: [0, Validators.required],
        label: ["", Validators.required],
        inputTypeId: [null, Validators.required]
      })
    ])
  });
  allrules: any = [];
  allworkflow: any = [];
  templateCategories: any = [];
  templateInputTypes: any = [];
  templateInputList: any = [];
  noticeCategories: any = [];
  editorInstance;
  editorIndex = 0;
  editorContent = "";
  notice: any;
  name: any;
  f;
  isLoading: boolean;

  constructor(
    private fb: FormBuilder,
    public router: Router,
    private service: NoticeTemplateService,
    private notify: NotificationCustomService,
    private route: ActivatedRoute
  ) {
    const templateId = route.snapshot.params.id;
    if (templateId > 0) {
      this.getTemplateById(templateId);
    }
  }

  ngOnInit() {
    this.getNoticeCategories();
    this.getTemplateInputTypes();
    this.getworkflow();
    this.getAllRules();
  }
  getTemplateInputTypes() {
    this.service.getNoticeTemplateInputTypes().subscribe(Response => {
      if (Response) {
        this.templateInputTypes = Response;
      }
    });
  }
  getTemplateInputs(templateId) {
    this.service.getTemplateInputs(templateId).subscribe(Response => {
      if (Response) {
        this.templateInputList = Response;
        this.filterInputTypes();
      }
    });
  }
  getNoticeCategories() {
    this.service.getNoticeCategories().subscribe(Response => {
      if (Response) {
        this.templateCategories = Response;
      }
    });
  }
  getTemplateById(templateId) {
    this.service.getTemplateById(templateId).subscribe(Response => {
      if (Response) {
        const response: any = Response;
        const data = {
          id: response.id,
          name: response.name,
          workflowId: response.workflowId,
          templateData: response.templateData,
          categoryId: response.categoryId,
          ruleId: response.ruleId
        };
        this.noticeTemplateForm.patchValue(data);
        this.editor.editorElem.getElementsByClassName("ql-editor")[0].innerHTML = response.templateData;
        this.GenerateInputTypes(response.templateInputs);
      }
    });
  }
  GenerateInputTypes(controls) {
    (this.noticeTemplateForm.get("templateInputs") as FormArray).controls = [];
    if (controls) {
      controls.forEach(element => {
        (this.noticeTemplateForm.get("templateInputs") as FormArray).controls.push(
          this.fb.group({
            id: [element.id],
            label: [element.label, Validators.required],
            inputTypeId: [element.inputTypeId, Validators.required]
          })
        );
      });
      (this.noticeTemplateForm.get("templateInputs") as FormArray).controls.push(
        this.fb.group({
          id: [0],
          label: ['', Validators.required],
          inputTypeId: [0, Validators.required]
        })
      );
    }
  }
  filterInputTypes() {
    this.noticeTemplateForm.updateValueAndValidity();
    const controls = this.noticeTemplateForm.get("templateInputs").value;
    if (controls.length > 0) {
      return controls.filter(x => x.label && x.inputTypeId);
    }
  }
  saveTemplate(flag = 0) {
    const filteredInputTypes = this.filterInputTypes();
    this.noticeTemplateForm.get("templateData").setValue(this.editorContent);
    for (const key in this.noticeTemplateForm.controls) {
      this.noticeTemplateForm.controls[key].markAsDirty();
      this.noticeTemplateForm.controls[key].updateValueAndValidity();
    }
    if (this.noticeTemplateForm.controls["name"].status != "VALID" ||
      this.noticeTemplateForm.controls["workflowId"].status != "VALID" ||
      this.noticeTemplateForm.controls["categoryId"].status != "VALID" ||
      this.noticeTemplateForm.controls["ruleId"].status != "VALID")
      return;
    if (flag > 0 && this.noticeTemplateForm.controls["templateData"].invalid) {
      this.notify.showError("Alert!", "Notice Design is Required.");
      return;
    }
    this.noticeTemplateForm.value.templateInputs = filteredInputTypes;
    this.service
      .saveTemplateWithInputs(this.noticeTemplateForm.value)
      .subscribe(Response => {
        if (Response) {
          const data: any = Response;
          if (data && data.id) {
            this.noticeTemplateForm.get("id").setValue(data.id);
            if (data.templateInputs.length > 0) {
              const ids = data.templateInputs.map(x => ({ id: x.id }));
              this.noticeTemplateForm.get("templateInputs").patchValue(ids);
              this.getTemplateById(data.id);
            }
          }
          if (flag > 0) {
            this.notify.showSuccess("Success", "Template Saved!");
            setTimeout(() => {
              this.router.navigate(['business-dashboard/notice/template/list']);
            }, 1500);
          }
        }
      });
    this.isLoading = true;
  }
  getControls() {
    this.filterInputTypes();
    this.noticeTemplateForm.get("templateInputs").updateValueAndValidity();
    const data = (this.noticeTemplateForm.get("templateInputs") as FormArray)
      .controls;
    return data;
  }
  removeInputTypes(index) {
    const data: any = (this.noticeTemplateForm.get("templateInputs") as FormArray)
      .controls[index];
    const fulldata = this.noticeTemplateForm.value;
    let body = {
      id: fulldata.id,
      templateInputId: [data.value.id],
      templateData: fulldata.templateData
    }
    if (body) {
      this.service.deleteTemplateInput(body).subscribe(Response => {
        (this.noticeTemplateForm.get("templateInputs") as FormArray)
          .controls.splice(index, 1);
        let str = this.noticeTemplateForm.get("templateData").value;
        const res = str.replace(data.value.label, '');
        this.noticeTemplateForm.get("templateData").setValue(res);
      });
    }
  }
  AddData(controls) {
    const inputTypeArray = controls.value.map(x => x);
    const lastItem = inputTypeArray[inputTypeArray.length - 1];
    if (lastItem.label && lastItem.inputTypeId) {
      for (const key in this.noticeTemplateForm.controls) {
        this.noticeTemplateForm.controls[key].markAsDirty();
        this.noticeTemplateForm.controls[key].updateValueAndValidity();
      }
      if (this.noticeTemplateForm.controls["name"].status != "VALID" ||
        this.noticeTemplateForm.controls["workflowId"].status != "VALID" ||
        this.noticeTemplateForm.controls["categoryId"].status != "VALID" ||
        this.noticeTemplateForm.controls["ruleId"].status != "VALID") return;
      this.noticeTemplateForm.get('templateInputs').updateValueAndValidity();
      inputTypeArray.pop();
      const labels = inputTypeArray.map(x => x.label);
      const inputTypes = inputTypeArray.map(x => x.inputTypeId);
      if (lastItem.label && lastItem.label.length > 0) {
        let x = '[';
        x += lastItem.label;
        x += ']';
        lastItem.label = x;
        if (lastItem.label && lastItem.inputTypeId && labels.indexOf(lastItem.label) < 0) {
          this.saveTemplate(0);
          controls.push(
            this.fb.group({
              id: [0, Validators.required],
              label: ['', Validators.required],
              inputTypeId: [null, Validators.required]
            })
          );
        }
      }
    // tslint:disable-next-line: triple-equals
      if (labels.indexOf(lastItem.label) > -1) {
        this.notify.showWarning('Warning!', 'Input label  already exists!');
      }
      lastItem.label = null;
    } else {
      if (!lastItem.label) {
        this.notify.showWarning('Warning!', 'Enter Input Label!');
      } else { this.notify.showWarning('Warning!', 'Select Variable Name!'); }
    }
  }
  SaveEditorInstance(instance) {
    this.editorInstance = instance;
    console.log(this.editorInstance);
  }
  SetCurrentIndex() {
    if (this.editorInstance) {
      try {
        this.editorIndex = this.editorInstance.getSelection().index;
      } catch { }
    }
  }
  addContent(label) {
    if (label) {
      // const x = '[' + label + ']';
      this.editorInstance.insertText(
        this.editorIndex, label, {
        bold: true,
        color: '#ff0000',
      }
      );
      this.editorInstance.insertText(
        this.editorIndex, ' ', {
        bold: false,
        color: '#000000'
      }
      );
      this.noticeTemplateForm.updateValueAndValidity();
    }
  }
  replaceText(label, inputTypeId) {
    const content = new RegExp(label.trim(), "gi");
    this.editorContent = this.editorContent.replace(
      content,
      ` ${label}(${inputTypeId}) `
    );
    console.log(this.editorContent);
    this.noticeTemplateForm.get("templateData").setValue(this.editorContent);
    console.log(this.noticeTemplateForm.get("templateData").value);
  }
  setContentHtml(instance) {
    this.editorContent = instance.html;
  }
  getAllRules() {
    this.service.getallrules().subscribe(Response => {
      if (Response) {
        this.allrules = Response;
        console.log(this.allrules);
      }
    });
  }
  getworkflow() {
    this.service.getallWorkflow().subscribe(Response => {
      if (Response) {
        this.allworkflow = Response;
        console.log(this.allworkflow);
      }
    });
  }

  backToList() {
    this.router.navigate([
      '../../notice/template/list'
    ], {
      relativeTo: this.route.parent,
    });
  }
}
