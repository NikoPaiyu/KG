import { Component, OnInit, Inject } from "@angular/core";
import { CurrespondenceService } from "../shared/services/currespondence.service";
import { FilesService } from "../shared/services/files.service";
import { Router } from "@angular/router";
import { NzNotificationService } from "ng-zorro-antd";
import { CommonService } from '../shared/services/common.service';

@Component({
  selector: "cpl-select-correspondence-template",
  templateUrl: "./select-correspondence-template.component.html",
  styleUrls: ["./select-correspondence-template.component.scss"],
})
export class SelectCorrespondenceTemplateComponent implements OnInit {
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
    private correspondenceServices: CurrespondenceService,
    private router: Router,
    private file: FilesService,
    private notification: NzNotificationService,
    private commonService: CommonService,
    @Inject('authService') private AuthService,
  ) {
    this.currentUser = AuthService.getCurrentUser();
    this.commonService.getCPLPermissions(this.currentUser.rbsPermissions);
    this.currentUserCode = this.currentUser.correspondenceCode;
    this.urlParams = this.router.getCurrentNavigation().extras.state;
  }

  ngOnInit() {
    setTimeout(() => {
    if (this.commonService.doIHaveCorrespondenceAccess('CORRESPONDENCE_WORKFLOW_DRAFT', 'CREATE')) {
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
      this.file.getTemplateById(event).subscribe((Response) => {
        if (Response) {
          this.templateData = Response;
          this.viewContent = this.templateData.templateData;
        }
      });
    } 
    // else {
    //   this.notification.warning('Info', 'You cannot create correspondence with workflow');
    // }
  }

  goBack() {
    window.history.back();
  }

  goToDraft() {
    if (this.templateData) {
      this.router.navigate(
        [
          'business-dashboard/cpl/draft-correspondence',
          this.templateData.id,
        ],
        { state: this.urlParams ? this.urlParams : null }
      );
    } else {
      this.notification.warning('Info', 'Please select a template');
    }
  }
}
