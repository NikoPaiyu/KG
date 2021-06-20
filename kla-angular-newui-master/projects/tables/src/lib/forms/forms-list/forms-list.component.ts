import { Component, Inject, OnInit } from '@angular/core';
import { Data } from '@angular/router';
import { NzNotificationService, UploadChangeParam, UploadFile } from 'ng-zorro-antd';
import { TablescommonService } from '../../shared/services/tablescommon.service';
import { FormService } from '../shared/services/form.service';

@Component({
  selector: 'tables-forms-list',
  templateUrl: './forms-list.component.html',
  styleUrls: ['./forms-list.component.scss']
})
export class FormsListComponent implements OnInit {
  search: any = null;
  formList: any = null;
  tempFormList: any = null;
  chooseFormModalVisible = false;
  formType: any = null;
  formTypes = ['FORM_II', 'FORM_III', 'FORM_A', 'FORM_B', 'FORM_C'];
  user: any = null;
  formData: any = null;
  previewModal = false;
  permissions = {
    createForms: false,
    assignTask: false,
    markAsApproved: false,
    createForm1: false
  };
  checked = false;
  indeterminate = false;
  listOfCurrentPageData: Data[] = [];
  setOfCheckedId = new Set<any>();
  assignModalVisible = false;
  searchPerson: any = null;
  assistantList: any = null;
  assignedAssistant: any = null;
  listOfAssistants: any = null;
  uploadedAttachmentUrl: any = null;
  updateData: any = null;
  pdfData: any = null;
  uploadURL = this.service.uploadUrl();
  fileList = [];
  showUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    hidePreviewIconInNonImage: true,
  };
  previewPurpose: any = null;
  createForm1 = false;

  constructor(private service: FormService,
              @Inject('authService') private AuthService,
              private notification: NzNotificationService,
              private commonService: TablescommonService) {
                this.user = AuthService.getCurrentUser();
                this.commonService.setTablePermissions(this.user.rbsPermissions);
               }

  ngOnInit() {
    this.getRbsPermissionsinList();
  }

  getFormList() {
    this.service.getFormsForUser().subscribe((res: any) => {
      this.formList = this.tempFormList = res;
      if (this.formList.length > 0 && this.permissions.createForms) {
        this.formTypes = this.formTypes.filter(x => !this.formList.map(f => f.type).includes(x));
      }
    });
  }

  chooseFormModal() {
    this.formType = null;
    this.chooseFormModalVisible = true;
  }

  cancelChooseModal() {
    this.chooseFormModalVisible = false;
  }

  searchList() {
    if (this.search) {
      this.formList = this.tempFormList.filter(x =>
        (x.type && x.type.toLowerCase().includes(this.search.toLowerCase())));
    } else {
      this.formList = this.tempFormList;
    }
    // ||
    //     (x.data.details.fullName && x.data.details.fullName.toLowerCase().includes(this.search.toLowerCase()))
  }

  getFormPreviewByUserAndType() {
    const body = {
      type: this.formType,
      userId: this.user.userId
    };
    this.service.getFormPreviewByUserandType(body).subscribe((res: any) => {
      this.formData = res;
      this.getPDF();
      this.previewPurpose = 'create';
    });
  }

  hidePreview() {
    this.formData = null;
    this.previewModal = false;
    this.uploadedAttachmentUrl = null;
    this.fileList = [];
  }

  saveForm(isSave) {
    let body = null;
    if (isSave) {
      body = {
        type: this.formType,
        signedUrl: this.uploadedAttachmentUrl
      };
    } else {
      body = {
        id: this.updateData.id,
        type: this.updateData.type,
        signedUrl: this.uploadedAttachmentUrl
      };
    }
    if (this.permissions.createForms) {
      this.service.saveForm(body).subscribe((res: any) => {
        this.getFormList();
        this.uploadedAttachmentUrl = null;
        this.fileList = [];
        this.notification.success('Success', 'Form Saved Successfully');
        this.hidePreview();
      });
    } else {
      this.service.createFormOne(body).subscribe((res: any) => {
        this.getFormList();
        this.uploadedAttachmentUrl = null;
        this.fileList = [];
        this.notification.success('Success', 'Form Saved Successfully');
        this.hidePreview();
      });
    }
  }

  getRbsPermissionsinList() {
    if (this.commonService.doIHaveAnAccess('CREATE_FORMS', 'READ')) {
      this.permissions.createForms = true;
      this.getFormList();
    }
    if (this.commonService.doIHaveAnAccess('ASSIGN_TASK', 'READ')) {
      this.permissions.assignTask = true;
      this.getFormListByFilter('SUBMITTED');
      this.getAssistants();
    }
    if (this.commonService.doIHaveAnAccess('MARK_APPROVED', 'READ')) {
      this.permissions.markAsApproved = true;
      this.getFormListByFilter('ASSIGNED');
    }
    if (this.commonService.doIHaveAnAccess('CREATE_FORM_1', 'CREATE')) {
      this.permissions.createForm1 = true;
      this.getFormList();
    }
  }

  _checkAllRows(value: boolean): void {
    this.listOfCurrentPageData.forEach((item) =>
      this.updateCheckedSet(item.id, value)
    );
    this.refreshCheckedStatus();
  }

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every((item) =>
      this.setOfCheckedId.has(item.id)
    );
    this.indeterminate =
    this.listOfCurrentPageData.some((item) =>
      this.setOfCheckedId.has(item.id)
    ) && !this.checked;
  }

  onItemChecked(id, checked): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  assignModal() {
    this.assignModalVisible = true;
  }

  cancelAssignModal() {
    this.assignModalVisible = false;
    this.setOfCheckedId = new Set<any>();
    this.assignedAssistant = null;
  }

  personSearch() {
    if (this.searchPerson) {
      this.assistantList = this.listOfAssistants.filter(
        (element) =>
          element.fullName &&
          element.fullName
            .toLowerCase()
            .includes(this.searchPerson.toLowerCase())
      );
    } else {
      this.assistantList = this.listOfAssistants;
    }
  }

  assignToAssistant() {
    const body = {
      formIds: [...this.setOfCheckedId],
      userId: this.assignedAssistant
    };
    this.service.assignToAssistant(body).subscribe((res: any) => {
      this.notification.success('Success', 'Task Assigned Successfully');
      this.cancelAssignModal();
      this.getFormListByFilter('SUBMITTED');
    });
  }

  getAssistants() {
    // const body = {
    //   klaDesignatoinId: 10,
    //   klaSectionId: this.user.correspondenceCode.id
    // };
    const body = ['TABLE_OFFICE_ASSISTANT'];
    this.service.getAssistants(body).subscribe((Res: any) => {
      this.assistantList = Res;
      this.listOfAssistants = this.assistantList;
    });
  }

  getPDF() {
    if (this.formData) {
      const body = {
          htmlString: this.formData
      };
      const mediaType = 'application/pdf';
      this.service.downloadReport(body).subscribe((response) => {
        if (response) {
          const blob = new Blob([response], { type: mediaType });
          this.pdfData = URL.createObjectURL(blob);
          if (this.pdfData) {
           this.cancelChooseModal();
           this.previewModal = true;
          }
        } else {
          this.notification.warning('Warning', 'PDF not avilable!');
        }
      });
    }
  }

  handleChange(info: UploadChangeParam): void {
    const fileList = info.fileList;
    if (info.file.response) {
      for (const file of fileList) {
        file.url = file.response.body;
        this.uploadedAttachmentUrl = info.file.response.body;
      }
    }
    this.fileList = fileList.filter((item: any) => {
      if (item.response) {
        return item.response.status !== 'success';
      }
      return true;
    });
  }

  handlePreview = async (file: UploadFile) => {
    window.open(file.url, '_blank');
  }

  showPreview(purpose, form) {
    this.previewPurpose = purpose;
    this.updateData = form;
    const mediaType = 'application/pdf';
    this.service.getPreviewById(form.id).subscribe((res: any) => {
      this.formData = res;
      this.getPDF();
    });
  }

  showSignedForm(url) {
    window.open(url, '_blank');
  }

  submitForm(form) {
    if (form.signedUrl) {
      const body = {
        id: form.id,
        signedUrl: form.signedUrl
      };
      this.service.submitForm(body).subscribe((res: any) => {
        this.notification.success('Success', 'Form Submitted Successfully!');
        this.getFormList();
      });
    } else {
      this.notification.warning('Warning', 'Please Upload Signed Form to Continue!');
    }
  }

  markAsApproved(form) {
    const body = {
      id: form.id
    };
    this.service.markAsApproved(body).subscribe((res: any) => {
      this.notification.success('Success', 'Form Marked as Approved!');
      this.getFormListByFilter('ASSIGNED');
    });
  }

  getFormListByFilter(formStatus) {
    const body = {
      type: null,
      status: formStatus,
      memberId: null
    };
    this.service.getFormByFilter(body).subscribe((res: any) => {
      this.formList = this.tempFormList = res;
    });
  }

  showFormOneModal() {
    this.formType = 'FORM_I';
    this.getFormPreviewByUserAndType();
  }

}
