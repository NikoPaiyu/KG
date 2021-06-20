import { Component, Inject, OnInit } from "@angular/core";
import { GenericfileService } from "../shared/services/genericfile.service";
import { CKEConfig } from "../shared/config/ckeditor.config";
@Component({
  selector: "genericfile-documents",
  templateUrl: "./documents.component.html",
  styleUrls: ["./documents.component.css"],
})
export class DocumentsComponent implements OnInit {
  searchParam = null;
  documentList: any = [];
  modelVisible: boolean = false;
  selectedDocument: any = [];
  selectedDescription: any = "";
  ckeConfig: any = CKEConfig;
  activeTabIndex: any = 0;
  public Editor: any;
  pdfDetails: any = null;
  showPdfViewerTab: boolean = false;
  constructor(
    @Inject("editor") public ckEditor,
    private file: GenericfileService
  ) {
    this.Editor = ckEditor;
  }

  ngOnInit() {
    this.getAllDocuments();
  }
  getAllDocuments() {
    this.file.getAllSharedDocuments().subscribe((res) => {
      this.documentList = res;
    });
  }
  showPreviewModal(data) {
    this.modelVisible = true;
    this.selectedDocument = data;
    this.selectedDescription = this.selectedDocument.description;
    // this.selectedDocument.description = "<p>dfgdfgfdgfdg</p>";
    this.selectedDocument ? (this.modelVisible = true) : "";
  }
  handleCancel() {
    this.modelVisible = false;
  }
  showtab(key) {
    if (key == 0) {
      this.showPdfViewerTab = false;
      this.pdfDetails = null;
    }
    if (key == 1) {
      this.showPdfViewerTab = true;
    }
    this.activeTabIndex = key;
  }
  showPdfTab(pdfDetails) {
    this.pdfDetails = pdfDetails;
    this.showtab(1);
  }
}
