import { Component, Inject, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { TemplateServiceService } from '../shared/services/template-service.service';

@Component({
  selector: 'tables-list-template',
  templateUrl: './list-template.component.html',
  styleUrls: ['./list-template.component.scss']
})
export class ListTemplateComponent implements OnInit {
  templateList: any;
  tempTemplateList: any;
  searchParam;
  isVisible = false;
  viewContent;
  currentUser;
  currentUserCurrespondenceDetails;
  constructor(
    @Inject('authService') private AuthService,
    private notification: NzNotificationService,
    private templateService: TemplateServiceService) { }

    ngOnInit() {
      this.getAllTemplate();
    }
  
    getAllTemplate() {
      const body = {
        type: this.currentUserCurrespondenceDetails
          ? this.currentUserCurrespondenceDetails.code
          : null,
      };
      this.templateService.getAllTemplate(body).subscribe((res) => {
        this.templateList = res;
        this.tempTemplateList = res;
      });
    }
  
    search() {
      if (this.searchParam) {
        this.templateList = this.tempTemplateList.filter(
          (element) =>
            element.name.toLowerCase().includes(this.searchParam.toLowerCase()) ||
            element.type.toLowerCase().includes(this.searchParam.toLowerCase()) ||
            element.business
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())
        );
      } else {
        this.templateList = this.tempTemplateList;
      }
    }
    // function to preview notice template
    showPreviewModal(templateData) {
      this.isVisible = true;
      if (templateData) {
        this.viewContent = templateData;
      } else {
        this.viewContent = 'Nothing to preview';
      }
    }
    handleCancel() {
      this.isVisible = false;
    }
    deleteTemplate(templateId) {
      this.templateService.deleteTemplate(templateId).subscribe((res) => {
        this.notification.success('Success', 'Deleted successfully..');
        this.templateList = this.templateList.filter(
          (element) => element.id !== templateId
        );
        this.tempTemplateList = this.templateList;
      });
    }

}
