import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { QuillEditorComponent } from 'ngx-quill';
import { TemplateServiceService } from '../shared/services/template-service.service';

@Component({
  selector: 'tables-create-template',
  templateUrl: './create-template.component.html',
  styleUrls: ['./create-template.component.scss']
})
export class CreateTemplateComponent implements OnInit {
  @ViewChild('editor', { static: false }) editor: QuillEditorComponent;
  templateForm: FormGroup;
  radioValue = 'DEPARTMENT';
  TypesList: any;
  WorkFlowList: any;
  BusinessList: any;
  templateInputTypes: any;
  editorInstance;
  editorIndex = 0;
  editorContent = '';
  submitButtonText = 'Save Template';
  currentUserDetails: any;
  typeDdlDisable = false;
  isWorkflow = false;
  approverList: any = [];
  templateId: any = null;
  staticFields = [
    {"id": null,"inputTypeId":6,"label":"[sentDate]", businessType: 'SENT_ON'},
    {"id": null,"inputTypeId":4,"label":"[to]", businessType: 'TO'},
    {"id": null,"inputTypeId":8,"label":"[copyTo]", businessType: 'COPY_TO'},
    {"id": null,"inputTypeId":10,"label":"[enclosure]", businessType: 'ENCLOSER'},
    {"id": null,"inputTypeId":7,"label":"[No]", businessType: 'FILE_NUMBER'},
    {"id": null,"inputTypeId":11,"label":"[subject]", businessType: 'SUBJECT'},
    {"id": null,"inputTypeId":13,"label":"[content]", businessType: 'CONTENT'},
    {"id": null,"inputTypeId":12,"label":"[approvedBy]", businessType: 'APPROVED_BY_SECTION'}
  ];
  staticFieldsSet = false;
  businessDocumentList = ['SUMMONS'];
  businessType: any = null;

  constructor(  private fb: FormBuilder,
                private templateService: TemplateServiceService,
                private notification: NzNotificationService,
                private route: ActivatedRoute,
                public router: Router,
                @Inject('authService') private AuthService) {
                  this.currentUserDetails = AuthService.getCurrentUser();
                  this.createForm();
                 }

  ngOnInit() {
    if (!this.currentUserDetails.authorities.includes('admin')) {
      this.radioValue = this.currentUserDetails.correspondenceCode.type;
      this.typeDdlDisable = true;
    }
    this.templateId = this.route.snapshot.params.id;
    const templateId = this.route.snapshot.params.id;
    if (templateId > 0) {
      this.submitButtonText = 'Update Template';
      this.getTemplateById(templateId);
    } else {
      this.getAllType();
      if (!this.currentUserDetails.authorities.includes('admin')) {
        if(this.currentUserDetails.authorities.includes('ppo')|| 
         this.currentUserDetails.authorities.includes('parliamentaryPartySecretary')){
          // this.templateForm
          // .get('type')
          // .setValue(this.currentUserDetails.correspondenceCode.type);
        }else{
        // this.templateForm
        //   .get('type')
        //   .setValue(this.currentUserDetails.correspondenceCode.code);
        }
        // this.getAllWorkflow(this.templateForm.value.type);
      }
    }
    this.getTemplateInputList();
    this.getApproverList();
  }

  createForm() {
    this.templateForm = this.fb.group({
      id: [0, Validators.required],
      name: [null, Validators.required],
      businessId: [null, Validators.required],
      templateData: ['', Validators.required],
      templateInputs: this.fb.array([
        this.fb.group({
          id: [0],
          label: ['', Validators.required],
          inputTypeId: [null, Validators.required],
        }),
      ]),
    });
  }

  // fill business dropdown
  getBusinessByType(type) {
    this.templateService.getAllBusinessByType(type).subscribe((res) => {
      this.BusinessList = res;
    });
  }

  // fill type dropdown
  getAllType() {
    if (!this.staticFieldsSet && !this.templateId) {
      this.setStaticFields();
      this.staticFieldsSet = true;
    }
  }

  // fill workflow dropdown
  getAllWorkflow(type) {
    if (type && this.radioValue === 'SECTION') {
      // this.templateService.getAllWorkflow(type).subscribe((res) => {
      //   this.WorkFlowList = res;
      // });
    }
  }

  // fill variable name dropdown
  getTemplateInputList() {
    this.templateService.getTemplateInputTypes().subscribe((res) => {
      this.templateInputTypes = res;
    });
  }

  getControls() {
    this.filterInputTypes();
    this.templateForm.get('templateInputs').updateValueAndValidity();
    const data = (this.templateForm.get('templateInputs') as FormArray)
      .controls;
    return data;
  }

  // function call when addmore input variables
  addInputVariables(controls) {
    const inputTypeArray = controls.value.map((x) => x);
    const lastItem = inputTypeArray[inputTypeArray.length - 1];
    if (lastItem.label && lastItem.inputTypeId) {
      // tslint:disable-next-line:forin
      for (const key in this.templateForm.controls) {
        this.templateForm.controls[key].markAsDirty();
        this.templateForm.controls[key].updateValueAndValidity();
      }
      if (
        this.templateForm.controls.name.status !== 'VALID' ||
        this.templateForm.controls.workflowId.status !== 'VALID' ||
        this.templateForm.controls.type.status !== 'VALID' ||
        this.templateForm.controls.business.status !== 'VALID'
      ) {
        return;
      }
      this.templateForm.get('templateInputs').updateValueAndValidity();
      inputTypeArray.pop();
      const labels = inputTypeArray.map((x) => x.label);
      const inputTypes = inputTypeArray.map((x) => x.inputTypeId);
      if (lastItem.label && lastItem.label.length > 0) {
        let x = '[';
        x += lastItem.label;
        x += ']';
        lastItem.label = x;
        if (
          lastItem.label &&
          lastItem.inputTypeId &&
          labels.indexOf(lastItem.label) < 0
        ) {
          this.submitForm(0);
          controls.push(
            this.fb.group({
              id: [0],
              label: ['', Validators.required],
              inputTypeId: [null, Validators.required],
            })
          );
        }
      }
      if (labels.indexOf(lastItem.label) > -1) {
        this.notification.warning('Warning!', 'Input label  already exists!');
      }
      lastItem.label = null;
    } else {
      if (!lastItem.label) {
        this.notification.warning('Warning!', 'Enter Input Label!');
      } else {
        this.notification.warning('Warning!', 'Select Variable Name!');
      }
    }
  }

  // function call when remove button click
  removeInputVariable(index) {
    const data: any = (this.templateForm.get('templateInputs') as FormArray)
      .controls[index];
    const fulldata = this.templateForm.value;
    const body = {
      id: fulldata.id,
      templateInputId: [data.value.id],
      templateData: fulldata.templateData,
    };
    if (body) {
      // this.templateService
      //   .deleteTemplateInput(body)
      //   .subscribe((Response) => {
      //     (this.templateForm.get(
      //       'templateInputs'
      //     ) as FormArray).controls.splice(index, 1);
      //     const str = this.templateForm.get('templateData').value;
      //     const res = str.replace(data.value.label, '');
      //     this.templateForm.get('templateData').setValue(res);
      //     this.editor.editorElem.getElementsByClassName(
      //       'ql-editor'
      //     )[0].innerHTML = res;
      //   });
    }
  }

  SaveEditorInstance(instance) {
    this.editorInstance = instance;
  }

  SetCurrentIndex() {
    if (this.editorInstance) {
      try {
        this.editorIndex = this.editorInstance.getSelection().index;
      } catch {}
    }
  }

  // fucntion to add input lable to quill html
  addContent(label) {
    if (label) {
      // const x = '[' + label + ']';
      this.editorInstance.insertText(this.editorIndex, label, {
        bold: true,
        color: '#ff0000',
      });
      this.editorInstance.insertText(this.editorIndex, ' ', {
        bold: false,
        color: '#000000',
      });
      this.templateForm.updateValueAndValidity();
    }
  }

  setContentHtml(instance) {
    this.editorContent = instance.html;
  }

  // function to filter template inputs
  filterInputTypes() {
    this.templateForm.updateValueAndValidity();
    const controls = this.templateForm.get('templateInputs').value;
    if (controls.length > 0) {
      return controls.filter((x) => x.label && x.inputTypeId);
    }
  }
  setStaticFields() {
    for (const item of this.staticFields) {
      const typeDetail = this.TypesList.find(x => x.businessDataType == item.businessType);
      if (typeDetail) {
        item.id = typeDetail.id;
      }
    }
   (this.templateForm.get('templateInputs') as FormArray).clear();
   this.staticFields.forEach(el => {
    (this.templateForm.get('templateInputs') as FormArray).push(this.fb.group(el));
   });
   (this.templateForm.get('templateInputs') as FormArray).controls.push(
    this.fb.group({
      id: [0],
      label: ['', Validators.required],
      inputTypeId: [0, Validators.required],
    })
  );
  }

  // submit currespondence template
  submitForm(flag = 0) {
    if (
      this.templateForm.controls.name.status !== 'VALID' ||
      this.templateForm.controls.businessId.status !== 'VALID'
    ) {
      // tslint:disable-next-line:forin
      for (const key in this.templateForm.controls) {
        this.templateForm.controls[key].markAsDirty();
        this.templateForm.controls[key].updateValueAndValidity();
      }
    } else {
      if (flag > 0 && this.templateForm.controls.templateData.invalid) {
        this.notification.warning(
          'Alert!',
          'Design is Required!'
        );
      } else {
        const filteredInputTypes = this.filterInputTypes();
        this.templateForm.value.templateInputs = filteredInputTypes;
        this.templateForm.value.templateData = this.editorContent;
        this.templateService
          .saveTemplateWithInputs(this.templateForm.value)
          .subscribe((res) => {
            if (res) {
              const data: any = res;
              if (data && data.id) {
                this.templateForm.get('id').setValue(data.id);
                if (data.templateInputs.length > 0) {
                  const ids = data.templateInputs.map((x) => ({ id: x.id }));
                  this.templateForm.get('templateInputs').patchValue(ids);
                  this.getTemplateById(data.id);
                }
              }
              if (flag > 0) {
                this.notification.success('Success', 'Template Saved!');
                this.router.navigate(['business-dashboard/correspondence/template-list']);
              }
            }
          });
      }
    }
  }

  // get all template data by template id
  getTemplateById(templateId) {
    // this.templateService
    //   .getTemplateById(templateId)
    //   .subscribe((res: any) => {
    //     if (res) {
    //       const data = {
    //         id: res.id,
    //         name: res.name,
    //         workflowId: res.workflowId,
    //         templateData: res.templateData,
    //         type: res.type,
    //         business: res.business,
    //         workflowMandatory: res.workflowMandatory,
    //         approvarDisplayName:  res.approvarDisplayName
    //       };
    //       this.radioValue = res.superType;
    //       this.isWorkflow = res.workflowMandatory;
    //       this.getAllType();
    //       this.templateForm.patchValue(data);
    //       this.editor.editorElem.getElementsByClassName(
    //         'ql-editor'
    //       )[0].innerHTML = res.templateData;
    //       this.GenerateInputTypes(res.templateInputs);
    //     }
    //   });
  }

  // set value to input variable and input lable
  GenerateInputTypes(controls) {
    (this.templateForm.get('templateInputs') as FormArray).controls = [];
    if (controls) {
      controls.forEach((element) => {
        (this.templateForm.get('templateInputs') as FormArray).controls.push(
          this.fb.group({
            id: [element.id],
            label: [element.label, Validators.required],
            inputTypeId: [element.inputTypeId, Validators.required],
          })
        );
      });
      (this.templateForm.get('templateInputs') as FormArray).controls.push(
        this.fb.group({
          id: [0],
          label: ['', Validators.required],
          inputTypeId: [0, Validators.required],
        })
      );
    }
  }
  isWorkflowRadioClick(event) {
    // this.templateForm.get('workflowId').reset();
    if (event) {
      // this.templateForm.controls.workflowId.setValidators(
      //   Validators.required
      // );
      // this.templateForm.controls.workflowId.updateValueAndValidity();
    } else {
      // this.templateForm.controls.workflowId.clearValidators();
      // this.templateForm.controls.workflowId.updateValueAndValidity();
    }
  }
  onBack() {
    this.router.navigate(['business-dashboard/correspondence/template-list']);
  }

  getApproverList() {
    // this.templateService.getDesignations().subscribe((res: any) => {
    //   this.approverList = res;
    //   if (this.templateId > 0) {
    //     this.templateForm.patchValue({
    //       approvarRole: this.approverList.find(x => x.klaDesignationName === this.templateForm.value.approvarDisplayName)
    //     });
    //   }
    // });
  }
  isStaticField(value) {
    if (this.staticFields.findIndex(x => x.inputTypeId == value) > -1) {
      return true;
    }
    return false;
  }
}
