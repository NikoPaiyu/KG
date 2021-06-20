import { Component, OnInit, Inject } from '@angular/core';
import { CorrespondenceService } from '../shared/services/correspondence.service';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'Correspondence-select-template',
  templateUrl: './select-template.component.html',
  styleUrls: ['./select-template.component.scss']
})
export class SelectTemplateComponent implements OnInit {
  templateList: any;
  tempTemplateList: any;
  templateData: any;
  viewContent: any;
  searchParam: any = "";
  urlParams: any;
  currentUser;
  currentUserCode;
  workflowTemplates = false;
  constructor(
    private correspondenceServices: CorrespondenceService,
    private router: Router,
    private notification: NzNotificationService,
    @Inject('authService') private AuthService,
  ) {
    this.currentUser = AuthService.getCurrentUser();
    this.correspondenceServices.getCorrespondencePermissions(this.currentUser.rbsPermissions);
    this.currentUserCode = this.currentUser.correspondenceCode;
    this.urlParams = this.router.getCurrentNavigation().extras.state;
  }

  ngOnInit() {
    setTimeout(() => {
    if (this.correspondenceServices.doIHaveCorrespondenceAccess('CORRESPONDENCE_WORKFLOW_DRAFT', 'CREATE')) {
      this.workflowTemplates = true;
    }
    this.getAllTemplate(this.urlParams);
    }, 500);
  }

  getAllTemplate(filterParams) {
      const body = {
        business: filterParams ? filterParams.business : 'NO_BUSINESS',
        type: this.currentUserCode.code ? this.currentUserCode.code : null,
        workflowMandatory: null
      };
      this.correspondenceServices.getAllTemplateByType(body).subscribe((res) => {
        this.templateList = res;
        this.tempTemplateList = res;
      });
  }

  getTemplateById(event, workflow) {
    if (this.workflowTemplates || (!this.workflowTemplates && !workflow)) {
      this.correspondenceServices.getTemplateById(event).subscribe((Response) => {
        if (Response) {
          this.templateData = Response;
          this.viewContent = this.templateData.templateData;
        }
      });
    }
  }

  goBack() {
    window.history.back();
  }

  goToDraft() {
    if (this.templateData) {
      this.router.navigate(
        [
          'business-dashboard/correspondence/draft-correspondence',
          this.templateData.id,
        ],
        { state: this.urlParams ? this.urlParams : null }
      );
    } else {
      this.notification.warning('Info', 'Please select a template');
    }
  }
}
