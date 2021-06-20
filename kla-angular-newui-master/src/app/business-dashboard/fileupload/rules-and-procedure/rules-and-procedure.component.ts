import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { UploadFile } from "ng-zorro-antd";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { FileuploadService } from "../shared/services/fileupload.service";
import { NotificationCustomService } from "src/app/shared/services/notification.service";
import { formatDate } from "@angular/common";

@Component({
  selector: "app-rules-and-procedure",
  templateUrl: "./rules-and-procedure.component.html",
  styleUrls: ["./rules-and-procedure.component.scss"]
})
export class RulesAndProcedureComponent implements OnInit {
  uploading;
  popoverMessage = "Are You Sure?";
  FileUpalodDetails = [];
  fileList: UploadFile[] = [];
  validateForm: FormGroup;
  formData;
  dateFormat = "dd / MM / yyyy";
  @ViewChild("myInput", { static: false })
  myInputVariable: ElementRef;
  constructor(
    private fileuploadservice: FileuploadService,
    private fb: FormBuilder,
    private notify: NotificationCustomService
  ) { }


  ngOnInit() {
    this.createForm();
    this.getFileUploadDetails();
  }

  createForm() {
    this.validateForm = this.fb.group({
      date: [null, [Validators.required]],
      FileName: [null, [Validators.required]],
      uplaodfilename: [null, [Validators.required]]
    });
  }

  onFileSelected(files: File[]) {
    this.formData = new FormData();
    if (files[0].type == "application/pdf") {
      Array.from(files).forEach(f => this.formData.append("file", f));
    } else {
      this.notify.showWarning("Warning", "InvalidFileType");
    }
  }

  handleUpload() {
    let formatedDate = formatDate(
      this.validateForm.value.date,
      "yyyy-MM-dd",
      "en-US",
      "+0530"
    );
    if (this.validateForm.valid) {
      this.fileuploadservice
        .uploadFile(
          this.formData,
          this.validateForm.value.FileName,
          "Rules",
          formatedDate
        )
        .subscribe((res: any) => {
          this.myInputVariable.nativeElement.value = "";
          this.validateForm.reset();
          this.getFileUploadDetails();
          this.notify.showSuccess("Success", "UploadedSuccessFully");
        });
    } else {
      for (const i in this.validateForm.controls) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    }
  }
  getFileUploadDetails() {
    this.fileuploadservice.getUploadedRulesDetails("Rules").subscribe((res: any) => {
      this.FileUpalodDetails = res;
    });
  }
  deleteFileUplaod(id) {
    this.fileuploadservice.deleteFileUplaod(id).subscribe((res: any) => {
      this.notify.showSuccess("Success", "DeletedSuccessFully");
      this.getFileUploadDetails();
    });
  }
}
