import { Component, OnInit, Inject } from "@angular/core";
import { CurrespondenceService } from "../shared/services/currespondence.service";
import { NzNotificationService } from "ng-zorro-antd/notification";

@Component({
  selector: "cpl-template-list",
  templateUrl: "./template-list.component.html",
  styleUrls: ["./template-list.component.scss"],
})
export class TemplateListComponent implements OnInit {
  templateList: any;
  tempTemplateList: any;
  searchParam;
  isVisible = false;
  viewContent;
  currentUser;
  currentUserCurrespondenceDetails;
  constructor(
    private currespondenceServices: CurrespondenceService,
    @Inject("authService") private AuthService,
    private notification: NzNotificationService
  ) {
    this.currentUser = AuthService.getCurrentUser();
    this.currentUserCurrespondenceDetails = this.currentUser.correspondenceCode;
  }

  ngOnInit() {
    this.getAllTemplate();
  }

  getAllTemplate() {
    let body = {
      type: this.currentUserCurrespondenceDetails
        ? this.currentUserCurrespondenceDetails.code
        : null,
    };
    this.currespondenceServices.getAllTemplateByType(body).subscribe((res) => {
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
      this.viewContent = "Nothing to preview";
    }
  }
  handleCancel() {
    this.isVisible = false;
  }
  deleteTemplate(templateId) {
    this.currespondenceServices.deleteTemplate(templateId).subscribe((res) => {
      this.notification.success("Success", "Deleted successfully..");
      this.templateList = this.templateList.filter(
        (element) => element.id !== templateId
      );
      this.tempTemplateList = this.templateList;
    });
  }
}
