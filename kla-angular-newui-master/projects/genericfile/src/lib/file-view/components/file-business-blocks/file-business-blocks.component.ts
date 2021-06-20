import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { NzNotificationService } from "ng-zorro-antd";
import { UploadFile } from "ng-zorro-antd/upload";

import { GenericfilesCommonService } from "../../../shared/services/genericfiles-common.service";
import { GenericfileService } from "./../../../shared/services/genericfile.service";
import { NzCascaderOption } from "ng-zorro-antd/cascader";
import { CKEConfig } from "../../../shared/config/ckeditor.config";
const secOrDpt = [
  {
    value: "section",
    label: "Section",
  },
  {
    value: "department",
    label: "Department",
  },
];
@Component({
  selector: "generic-file-business-blocks",
  templateUrl: "./file-business-blocks.component.html",
  styleUrls: ["./file-business-blocks.component.css"],
})
export class FileBusinessBlocksComponent implements OnInit {
  @Input() fileDetails;
  file_blocks_list: any = [];

  documentTemplateList: any = [];
  selectedDocumentTemplate: any = null;
  sectionList: any = [];
  activeTabIndex: any = 0;
  selectedDocumentListTitle: string = "";
  selectedDocumentViewTitle: string = "";
  documentListTabShow: boolean = false;
  documentViewTabShow: boolean = false;
  selectedBlock: any = [];
  selectedDocument: any = [];
  isModelVisible: boolean = false;

  isShareModelVisible: boolean = false;
  partialApproveButtonVisible: boolean = false;
  shareButtonVisible: boolean = false;
  businessForm = this.fb.group({
    title: [null, Validators.required],
    template: [""],
    description: [null, Validators.required],
    attachmentTitle: [""],
    attachmentFile: [""],
  });
  allSelectedData: any = "";
  modelTitle: any = "";
  activeBlockId: any = null;
  updateBlockId: any = 0;
  updateDocumentId: any = 0;
  activeDocumentId: any = null;
  usersList: any = [];
  selectedUsers: any = [];
  selectedUser: any;
  ckeConfig: any = CKEConfig;

  public Editor: any;

  modelWidth: any = null;
  selectedFile: any = null;
  attachmentTitle: any = "";
  fileList: any = [];
  modalTabIndex: any = 0;
  showPdfViewer = false;
  pdfDetails: any = null;
  showPdfViewerTab = false;
  @Output() getGenericFileByFileId = new EventEmitter<any>();
  documentIdList: any = [];
  user: any;
  pdfFinalUrl;
  cascaderValues: string[] | null = null;
  designationList: any[];
  loginedUser: any;
  approvedChecked: any = [];
  submittedChecked: any = [];
  constructor(
    @Inject("editor") public ckEditor,
    private fb: FormBuilder,
    private file: GenericfileService,
    private common: GenericfilesCommonService,
    private notify: NzNotificationService,
    @Inject("authService") private AuthService
  ) {
    this.loginedUser = AuthService.getCurrentUser();
    this.user = AuthService.getCurrentUser();
    this.Editor = ckEditor;
  }

  ngOnInit() {
    this.activeTabIndex = 0;
    this.loadFileDetails();
    this.loadAllDesignations();
  }
  loadFileDetails() {
    this.file
      .getAllFileBlockByFIleId(this.fileDetails.fileId)
      .subscribe((res) => {
        this.file_blocks_list = res;
      });
  }
  loadAllTemplates() {
    this.common.listAllTemplates().subscribe((res) => {
      this.documentTemplateList = res;
    });
  }
  loadAllDesignations() {
    this.common.getDesignation().subscribe((res) => {
      this.designationList = res;
    });
  }
  loadAllSections() {
    this.common.getAllSections().subscribe((res) => {
      this.sectionList = res;
    });
  }
  SaveData() {
    if (this.businessForm.valid) {
      if (this.activeTabIndex === 0) {
        const body: any = {
          fileId: this.fileDetails.fileId,
          fileNumber: this.fileDetails.fileNumber,
          title: this.businessForm.value.title,
          description: this.businessForm.value.description,
        };
        this.updateBlockId ? (body["id"] = this.updateBlockId) : "";
        this.file.createBlock(body).subscribe((res: any) => {
          this.updateBlockId
            ? this.notify.success("Success", "File Block Updated")
            : this.notify.success("Success", "File Block Created");
          this.getGenericFileByFileId.emit();
          this.file_blocks_list = res;
          this.isModelVisible = false;
          this.updateBlockId = false;
        });
      } else if (this.activeTabIndex === 1) {
        const body: any = {
          blockId: this.selectedBlock.id,
          fileId: this.fileDetails.fileId,
          fileNumber: this.fileDetails.fileNumber,
          title: this.businessForm.value.title,
          description: this.businessForm.value.description,
          attachment: this.fileList,
        };
        this.updateDocumentId ? (body["id"] = this.updateDocumentId) : "";
        this.file.createDocument(body).subscribe((res: any) => {
          this.updateDocumentId
            ? this.notify.success("Success", "File Document Updated")
            : this.notify.success("Success", "File Document Created");
          this.selectedBlock.documents = res;

          this.selectedBlock.documents &&
          this.selectedBlock.documents.length === 1
            ? (this.selectedBlock.status = "PENDING")
            : "";

          this.isModelVisible = false;
          this.updateDocumentId = false;
        });
      }
    } else {
      for (const i in this.businessForm.controls) {
        this.businessForm.controls[i].markAsDirty();
        this.businessForm.controls[i].updateValueAndValidity();
      }
    }
  }

  ViewDocumentList(blockId) {
    this.partialApproveButtonVisible = false;
    this.shareButtonVisible = false;
    this.selectedBlock = this.getSelectedBlockOrDocument(blockId);
    if (
      this.selectedBlock.documents &&
      this.selectedBlock.documents.length > 0
    ) {
      this.selectedBlock.documents.forEach((d) => {
        // if (d.status !== "APPROVED") {
        d.checked = false;
        // }
      });
    }
    this.selectedDocumentListTitle = this.selectedBlock.title;
    this.documentListTabShow = true;
    this.showtab(1);
    this.activeBlockId = blockId;
  }
  ViewDocument(documentId) {
    this.selectedDocument = this.getSelectedBlockOrDocument(documentId);
    this.selectedDocumentViewTitle = this.selectedDocument.title;
    this.documentViewTabShow = true;
    this.showtab(2);
    this.activeDocumentId = documentId;
  }
  setSelectedBlock(Id) {
    this.selectedBlock = this.file_blocks_list.find((d) => d.id === Id);
  }
  getSelectedBlockOrDocument(Id) {
    if (this.activeTabIndex === 0) {
      return this.file_blocks_list.find((d) => d.id === Id);
    } else if (this.activeTabIndex === 1) {
      return this.selectedBlock.documents.find((d) => d.id === Id);
    }
  }
  showtab(key) {
    if (key === 0) {
      this.documentListTabShow = false;
      this.documentViewTabShow = false;
      this.selectedBlock = [];
      this.selectedDocument = [];
      this.selectedDocumentListTitle = "";
      this.activeBlockId = false;
      this.pdfDetails = null;
      this.showPdfViewerTab = false;
      this.documentIdList = [];
    } else if (key === 1) {
      this.documentViewTabShow = false;
      this.activeDocumentId = false;
      this.selectedDocument = [];
      this.pdfDetails = null;
      this.showPdfViewerTab = false;
    } else if (key === 2) {
      this.documentListTabShow = true;
      this.documentViewTabShow = true;
      this.pdfDetails = null;
      this.showPdfViewerTab = false;
      this.documentIdList = [];
    }
    this.activeTabIndex = key;
  }
  handleCancel(): void {
    this.clearbusinessForm();
    this.updateBlockId = false;
    this.isModelVisible = false;
  }
  showModel(Id: any = null) {
    this.clearbusinessForm();
    if (this.activeTabIndex == 0) {
      if (Id) {
        let block = this.getSelectedBlockOrDocument(Id);
        this.updateBlockId = Id;
        this.modelTitle = "miscellaneous-business-file.business.block.update";
        this.businessForm.setValue({
          title: block.title,
          description: block.description,
          attachmentTitle: "",
          attachmentFile: "",
          template: "",
        });
      } else {
        this.modelTitle = "miscellaneous-business-file.business.block.create";
      }

      this.modelWidth = 400;
    } else if (this.activeTabIndex == 1) {
      this.loadAllTemplates();
      if (Id) {
        let document = this.getSelectedBlockOrDocument(Id);
        this.updateDocumentId = Id;
        this.modelTitle =
          "miscellaneous-business-file.business.document.update";
        this.businessForm.setValue({
          title: document.title,
          description: document.description,
          attachmentTitle: "",
          attachmentFile: "",
          template: "",
        });
        this.fileList = document.attachment;
      } else {
        this.modelTitle =
          "miscellaneous-business-file.business.document.create";
      }
      this.modelWidth = 1200;
    }
    this.isModelVisible = true;
  }
  clearbusinessForm() {
    this.businessForm.reset();

    this.fileList = [];
  }

  attachmentUpload() {
    this.file.attachmentFileUpload(this.selectedFile).subscribe((res: any) => {
      if (res.body) {
        this.fileList.push({
          title: this.businessForm.controls["attachmentTitle"].value,
          url: res.body,
        });
        this.selectedFile = null;
        this.businessForm.controls["attachmentTitle"].setValue("");
        this.attachmentTitle = "";
      }
    });
  }

  deleteBlock(blockId) {
    this.file
      .deleteBlock(this.fileDetails.fileId, blockId)
      .subscribe((res: any) => {
        this.notify.success("Success", "Block Deleted");
        this.file_blocks_list = this.file_blocks_list.filter(
          (r) => r.id != blockId
        );
      });
  }
  beforeUpload = (file: UploadFile): boolean => {
    this.selectedFile = file;
    return false;
  };

  showModalTab(index, pdfDetails) {
    if (index === 0) {
      this.showPdfViewer = false;
      this.pdfDetails = null;
      this.modalTabIndex = index;
    } else {
      this.showPdfViewer = true;
      this.pdfDetails = pdfDetails;
      this.modalTabIndex = index;
    }
  }

  showPdfTab(pdfDetails) {
    this.pdfDetails = pdfDetails;
    this.showPdfViewerTab = true;
    this.activeTabIndex = 3;
  }

  deleteAttachment(id) {
    this.file
      .deleteAttachment(id, this.fileDetails.fileId)
      .subscribe((res: any) => {
        this.notify.success("Success", "Attachment Deleted");
        this.file
          .getAllFileBlockByFIleId(this.fileDetails.fileId)
          .subscribe((res) => {
            this.file_blocks_list = res;
            this.setSelectedBlock(this.activeBlockId);
          });
      });
  }

  partialApprove() {
    this.selectedBlock.documents.forEach((d) => {
      if (d.checked) {
        this.documentIdList.push(d.id);
      }
    });
    if (this.documentIdList.length > 0) {
      const body: any = {
        fileId: this.fileDetails.fileId,
        approvedById: this.user.userId,
        ratification: false,
        fromGroup: this.user.fullName,
        attachmentsIds: this.documentIdList,
      };
      this.file
        .partiallyApproveFile(this.fileDetails.fileId, body)
        .subscribe((res) => {
          this.documentIdList = [];
          this.getGenericFileByFileId.emit();
          this.notify.success(
            "Success",
            "The selected documents are approved!"
          );
          this.partialApproveButtonVisible = false;
          this.file
            .getAllFileBlockByFIleId(this.fileDetails.fileId)
            .subscribe((res) => {
              this.file_blocks_list = res;
              this.setSelectedBlock(this.activeBlockId);
            });
        });
    } else {
      this.notify.warning("Warning", "No documents selected to approve!");
    }
  }

  docToPDF() {
    const body: any = {
      htmlString: this.selectedDocument.description,
    };
    var mediaType = "application/pdf";
    this.common.stringToPDF(body).subscribe((res) => {
      if (res) {
        var blob = new Blob([res], { type: mediaType });
        this.pdfFinalUrl = URL.createObjectURL(blob);
        window.open(this.pdfFinalUrl, "_blank");
      }
    });
  }
  //Load template list  on document create or update model(Tab2)
  SelectTemplate(Id) {
    let doc: any = "";
    let templateData: any = "";
    if (Id) {
      doc = this.documentTemplateList.find((d) => d.id === parseInt(Id));
      templateData = doc.templateData;
    } else {
      templateData = "";
    }

    this.businessForm.setValue({
      title: this.businessForm.value.title,
      description: templateData,
      attachmentTitle: "",
      attachmentFile: "",
      template: this.businessForm.value.template,
    });
  }
  // Document toogle selection for SUBMITTED and APPROVED(Tab2)
  documentCheckbox(Id) {
    let doc = this.selectedBlock.documents.find((d) => d.id === parseInt(Id));
    let prev = doc.checked;
    doc.checked = !doc.checked;
    doc.status === "SUBMITTED" ? this.clearDocumentSelection("APPROVED") : "";

    doc.status === "APPROVED" ? this.clearDocumentSelection("SUBMITTED") : "";
    if (prev !== doc.checked) {
      this.populateApprovedChecked();
      this.populateSubmittedChecked();
    }
  }
  SelectAll(value) {
    this.clearDocumentSelection();
    if (value === "APPROVED") {
      this.selectedBlock.documents.map((item) => {
        item.status === "APPROVED" ? (item.checked = true) : "";
      });
      this.populateApprovedChecked();
    }

    if (value === "SUBMITTED") {
      this.selectedBlock.documents.map((item) => {
        item.status === "SUBMITTED" ? (item.checked = true) : "";
      });
      this.populateSubmittedChecked();
    }
  }
  clearDocumentSelection(type: any = null) {
    this.selectedBlock.documents.map((item) => {
      if (!type) {
        this.partialApproveButtonVisible = false;
        this.shareButtonVisible = false;
        item.checked = false;
      } else if (type === "APPROVED" && item.status === "APPROVED") {
        this.partialApproveButtonVisible = false;
        item.checked = false;
      } else if (type === "SUBMITTED" && item.status === "SUBMITTED") {
        this.shareButtonVisible = false;
        item.checked = false;
      }
    });
  }
  populateApprovedChecked() {
    // this.submittedChecked = [];
    let approvedChecked = [];
    approvedChecked = this.selectedBlock.documents.filter(
      (d) => d.status === "APPROVED" && d.checked === true
    );
    if (approvedChecked.length > 0) {
      this.partialApproveButtonVisible = false;
      this.shareButtonVisible = true;
    } else {
      this.shareButtonVisible = false;
    }
  }
  populateSubmittedChecked() {
    // this.approvedChecked = [];
    let submittedChecked = [];
    submittedChecked = this.selectedBlock.documents.filter(
      (d) => d.status === "SUBMITTED" && d.checked === true
    );
    if (submittedChecked.length > 0) {
      this.partialApproveButtonVisible = true;
      this.shareButtonVisible = false;
    } else {
      this.partialApproveButtonVisible = false;
    }
  }
  showShareModel() {
    this.loadAllSections();
    this.modelWidth = 900;
    this.isShareModelVisible = true;
  }
  //Trigger on Cascader select the final item
  onChanges(values: string[]): void {
    this.selectedUser = null;
    this.usersList = [];
    if (values[2]) {
      let data = {
        klaDesignatoinId: values[2][0],
        kladesignationCode: values[2][1],
        klaSectionId: values[1].toString(),
      };
      this.common.getAllNonMemberUsers(data).subscribe((res) => {
        res.map((item) => {
          item.userId !== this.loginedUser.userId
            ? this.usersList.push({
                value: item.userId,
                label: item.details.fullName,
                isLeaf: true,
              })
            : "";
        });
      });
    }
  }
  selectUser(Id) {
    if (Id) {
      let usr = this.usersList.find((d) => d.value === parseInt(Id));

      this.selectedUsers.indexOf(Id) === -1 && usr
        ? this.selectedUsers.push(usr)
        : "";
    }
  }
  handleSelectedUserClose(id) {
    this.selectedUsers = this.selectedUsers.filter((d) => d.value !== id);
    this.selectedUser = null;
  }
  /** load data async execute by `nzLoadData` method (Cascader)*/
  loadData = (node: NzCascaderOption, index: number): PromiseLike<void> => {
    return new Promise((resolve) => {
      // setTimeout(() => {
      if (index < 0) {
        // if index less than 0 it is root node
        node.children = secOrDpt;
      } else if (index == 0) {
        if (node.value === "section") {
          let result = this.sectionList.map((m) => ({
            value: m.klaSectionId,
            label: m.klaSectionName,
          }));

          node.children = result;
        } else if (node.value === "department") {
          node.children = [];
        }
      } else if (index == 1) {
        if (node.parent.value === "section") {
          let result = this.designationList.map((m) => ({
            value: [m.klaDesignationId, m.code],
            label: m.klaDesignationName,
            isLeaf: true,
          }));
          node.children = result;
        }
      }

      resolve();
      // }, 1000);
    });
  };
  handleShareCancel(): void {
    this.usersList = [];
    this.selectedUser = null;
    this.selectedUsers = [];
    this.isShareModelVisible = false;
    this.cascaderValues = null;
  }
  // Selected documents shre to multiple users
  ShareDocument() {
    let documentIdList = [];
    this.selectedBlock.documents
      .filter((d) => d.status === "APPROVED" && d.checked === true)
      .map((m) => {
        documentIdList.push(m.id);
      });
    let userIdList = [];
    this.selectedUsers.map((m) => {
      userIdList.push(m.value);
    });

    const body: any = {
      userIds: userIdList,
      documentIds: documentIdList,
    };
    this.file.shareDocument(body).subscribe((res: any) => {
      if (res.message === "success") {
        this.selectedBlock.documents.map((m) => {
          m.checked = false;
        });
        this.notify.success("Success", "Shared Successfully!");
        this.shareButtonVisible = false;
        this.handleShareCancel();
      }
    });
  }
}
