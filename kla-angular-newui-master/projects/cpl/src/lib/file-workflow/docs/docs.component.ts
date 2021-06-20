import { Component, OnInit, Input, Inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FilesService } from "../../shared/services/files.service";
import { CommonService } from "../../shared/services/common.service";

@Component({
  selector: "cpl-docs",
  templateUrl: "./docs.component.html",
  styleUrls: ["./docs.component.scss"],
})
export class DocsComponent implements OnInit {
  tabs: any = [];
  type = "doc";
  fileId;
  fileDocsArray: any = [];
  tabs1 = [1, 2, 3];
  extraTabs: any = [];
  isPdfVisible = false;
  docUrl: any = null;
  attachment: any;
  @Input() forward = null;
  user = null;

  constructor(
    private route: ActivatedRoute,
    private fileService: FilesService,
    private router: Router,
    private commonService: CommonService,
    @Inject("authService") private AuthService
  ) {
    this.user = AuthService.getCurrentUser();
  }

  ngOnInit() {
    //this.user = this.commonService.getCurrentUser();
    this.route.params.subscribe((params) => {
      this.fileId = params.id;
      this.getFileById(this.fileId);
    });
  }

  getFileById(fileId) {
    this.fileService.getDocumentsByFileId(fileId).subscribe((Res) => {
      this.fileDocsArray = Res;
      this.tabContents();
    });
  }

  editDoc(docId) {
    this.router.navigate(["business-dashboard/cpl/cpl-view", "edit", docId]);
  }

  tabContents() {
    if (this.fileDocsArray.cplDocuments.length > 3) {
      for (let i = 0; i < 3; i++) {
        this.tabs.push(this.fileDocsArray.cplDocuments[i]);
      }
      for (let i = 3; i < this.fileDocsArray.cplDocuments.length; i++) {
        this.extraTabs.push(this.fileDocsArray.cplDocuments[i]);
      }
    } else {
      this.tabs = this.fileDocsArray.cplDocuments;
    }
  }

  changeTabContents(doc) {
    this.extraTabs.splice(this.extraTabs.indexOf(doc), 1);
    this.extraTabs.push(this.tabs[2]);
    this.tabs.pop();
    this.tabs.unshift(doc);
  }

  showPdfModal(attachment, isMainOrDelay) {
    this.isPdfVisible = true;
    this.docUrl = null;
    if (isMainOrDelay === "main") {
      for (const att of attachment) {
        if (att.isMainDocument === true) {
          this.docUrl = att.attachmentUrl;
        }
      }
    } else if (isMainOrDelay === "delay") {
      for (const att of attachment) {
        if (att.isDelayStatement === true) {
          this.docUrl = att.attachmentUrl;
        }
      }
    } else {
      this.docUrl = attachment.attachmentUrl;
    }
  }

  hideModal() {
    this.isPdfVisible = false;
  }
}
