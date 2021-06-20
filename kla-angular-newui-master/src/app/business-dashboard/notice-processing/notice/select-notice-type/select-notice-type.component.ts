import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { NoticeTemplateService } from "../../shared/services/notice-template.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "src/app/auth/shared/services/auth.service";
import { NoticeService } from "../../shared/services/notice.service";
import { NotificationCustomService } from "src/app/shared/services/notification.service";

@Component({
  selector: "app-select-notice-type",
  templateUrl: "./select-notice-type.component.html",
  styleUrls: ["./select-notice-type.component.scss"],
})
export class SelectNoticeTypeComponent implements OnInit {
  rows = [1, 2];
  coloums = [1, 2, 3];
  data = "";
  templateList: any = [];
  categoryTemplateList: any = [];
  noticeTemplate: any;
  searchParam = "";
  constructor(
    private fb: FormBuilder,
    public router: Router,
    private service: NoticeTemplateService,
    private auth: AuthService,
    public notice: NoticeService,
    private route: ActivatedRoute,
    private notify: NotificationCustomService
  ) {}

  ngOnInit() {
    this.getTemplateList();
    this.loadPermissions();
  }
  loadPermissions() {
    this.notice.getNoticePermissions(this.auth.getCurrentUser().userId);
  }

  getTemplateList() {
    this.service.getTemplateListByUser().subscribe((Response) => {
      if (Response) {
        this.templateList = Response;
      }
    });
  }
  getTemplate(templateId) {
    this.service.getTemplateById(templateId).subscribe((Response) => {
      if (Response) {
        this.noticeTemplate = Response;
        this.data = this.noticeTemplate.templateData;
      }
    });
  }
  goTo(templateData) {
    if (templateData) {
      this.router.navigate(["../../notice/ab/create", templateData.id, 0], {
        relativeTo: this.route.parent,
      });
    } else {
      this.notify.showInformation("Info", "Please selece a template");
    }
  }

  backToList() {
    this.router.navigate(["../../notice/ab/list"], {
      relativeTo: this.route.parent,
    });
  }
  searchNotice() {
    // this.templateList = this._tempArrayList.filter((element) =>
    //   element.categoryName
    //     .toLowerCase()
    //     .includes(this.searchParam.toLowerCase())
    //categoryTemplate
    // );
  }
}
