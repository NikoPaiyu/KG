import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { NzNotificationService, UploadFile } from "ng-zorro-antd";
import { ObituaryService } from "../../shared/services/obituary.service";
import { TablescommonService } from "../../shared/services/tablescommon.service";

@Component({
  selector: "tables-supporting-doc",
  templateUrl: "./supporting-doc.component.html",
  styleUrls: ["./supporting-doc.component.css"],
})
export class SupportingDocComponent implements OnInit {
  @Output() docChange = new EventEmitter<any>();
  @Output() reload = new EventEmitter<boolean>();
  uploadURL = this.commonService.uploadDocument();
  @Input() documentList = [];
  @Input() isFileView = false;
  @Input() obituaryDetails;
  @Input() currentAssignee;
  docFileList = [];
  viewUrl = null;
  viewTitle = null;
  isPdfVisible = false;
  showUploadDocList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    hidePreviewIconInNonImage: true,
  };
  addDoc = {
    id: null,
    showDoc: false,
    name: null,
    attachmentUrl: null,
    update: true,
    index: null,
    fileName : null
  };
  fileStatus: any;
  constructor(
    private commonService: TablescommonService,
    private notification: NzNotificationService,
    private service: ObituaryService
  ) {}
  ngOnInit() {
    if (this.isFileView) {
      this.showUploadDocList.showRemoveIcon = false;
    }
  }
  showAddDocPopup(index, doc) {
    this.clearDocData();
    if (doc) {
      this.addDoc.id = doc.id;
      this.addDoc.update = true;
      this.addDoc.name = doc.name;
      this.addDoc.attachmentUrl = doc.attachmentUrl;
      this.addDoc.index = index;
      this.docFileList = [
        {
          uid: -1,
          name: doc.fileName,
          status: "done",
          url: doc.attachmentUrl,
        },
      ];
    }
    this.addDoc.showDoc = true;
  }
  uploadDoc() {}
  handleFileChange(info: any) {
    if (info.file.response && info.fileList.length > 0) {
      this.addDoc.attachmentUrl = info.file.response.body;
      this.addDoc.fileName = info.file.name;
    } else {
      this.addDoc.attachmentUrl = null;
      this.addDoc.fileName  = null;
    }
    let fileList = info.fileList;
    fileList = fileList.map((file) => {
      if (file.response) {
        file.url = file.response.body;
      }
      return file;
    });
    this.docFileList = fileList.filter((item: any) => {
      if (item.response) {
        return item.response.status !== "success";
      }
      return true;
    });
  }
  showPdfModal(doc) {
    this.viewTitle = doc.name;
    this.viewUrl = doc.attachmentUrl;
    if (this.viewUrl) {
      this.isPdfVisible = true;
    }
  }
  hideModal() {
    this.viewUrl = null;
    this.viewTitle = null;
    this.isPdfVisible = false;
  }
  addDocument() {
    let index = this.addDoc.index;
    if (index != null) {
      this.documentList[index].name = this.addDoc.name;
      this.documentList[index].attachmentUrl = this.addDoc.attachmentUrl;
      this.documentList[index].fileName = this.addDoc.fileName;
      this.notification.success('Success', 'Supporting document updated successfully');
    } else {
      const document = {
        name: this.addDoc.name,
        attachmentUrl: this.addDoc.attachmentUrl,
        fileName : this.addDoc.fileName,
        delete: false,
      };
      this.notification.success('Success', 'Supporting document added successfully');
      this.documentList.push(document);
    }
    this.clearDocData();
  }
  clearDocData() {
    this.addDoc.showDoc = false;
    this.addDoc.name = null;
    this.addDoc.attachmentUrl = null;
    this.addDoc.index = null;
    this.addDoc.update = false;
    this.docFileList = [];
  }
  handleRemoveFile = (file: UploadFile) => {
    if (this.isFileView) {
      return false;
    }
    this.addDoc.attachmentUrl = null;
    return true;
  };
  updateDocumentList() {
    this.docChange.emit(this.documentList);
  }
  deleteDoc(index, doc) {
    let nonDeletedDoc = this.documentList.filter((d) => d.delete == false);
    if (nonDeletedDoc.length == 1) {
      this.notification.warning("Sorry", "Documents Cannot Be Empty");
      return;
    }
    if (doc.id) {
      this.documentList[index].delete = true;
      this.notification.warning("Sorry", "Document marked for deletion successfully");
    } else {
      this.documentList.splice(index, 1);
      this.notification.warning("Sorry", "Document deleted successfully");
    }
  }
  updateDocuments() {
    this.obituaryDetails.obituary.documents = this.documentList;
    const reqBody = this.service.buildUpdateRequest(this.obituaryDetails.obituary, 'UPDATE_SUPPORTING_DOCUMENT');
    this.service
      .updateObituary(reqBody)
      .subscribe((data) => {
        this.notification.success("Success", "Documents updated successfully");
        this.reload.emit(true);
      });
  }
}
