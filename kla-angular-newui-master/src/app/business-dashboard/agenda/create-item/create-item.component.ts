import { Component, OnInit, Input } from "@angular/core";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { NzModalRef, UploadFile } from "ng-zorro-antd";
import { AgendaServiceService } from "../shared/services/agenda-service.service";
import { environment } from "../../../../environments/environment";
import { NotificationCustomService } from "src/app/shared/services/notification.service";

@Component({
  selector: "app-create-item",
  templateUrl: "./create-item.component.html",
  styleUrls: ["./create-item.component.scss"]
})
export class CreateItemComponent implements OnInit {
  @Input() item;
  @Input() members;
  @Input() lobAgendaLine;
  businessLineItem;
  isEdit = false;
  isLoading = false;
  validateForm: FormGroup;
  uploadURL = `${environment.fileupload_url}/uploadImage`;
  fileList: UploadFile[] = [];
  answerFileList: UploadFile[] = [];
  speaketNoteFileList: UploadFile[] = [];
  beforeUpload = (file: UploadFile): boolean => {
    this.fileList = [];
    this.fileList = this.fileList.concat(file);
    this.validateForm.controls["file"].setValue(file);
    return false;
  };
  handleRemoveFIle = (file: UploadFile) => {
    this.validateForm.controls["file"].setValue("");
    return true;
  };
  beforeUploadAnswer = (file: UploadFile): boolean => {
    this.answerFileList = [];
    this.answerFileList = this.answerFileList.concat(file);
    this.validateForm.controls["answerFile"].setValue(file);
    return false;
  };
  handleRemoveAnswerFile = (file: UploadFile) => {
    this.validateForm.controls["answerFile"].setValue("");
    return true;
  };
  beforeUploadSpeakerNote = (file: UploadFile): boolean => {
    this.speaketNoteFileList = [];
    this.speaketNoteFileList = this.speaketNoteFileList.concat(file);
    this.validateForm.controls["speakerNoteFile"].setValue(file);
    return false;
  };
  handleRemoveSpeakerNoteFile = (file: UploadFile) => {
    this.validateForm.controls["speakerNoteFile"].setValue("");
    this.validateForm.controls["flipUrl"].setValue("");
    return true;
  };
  submitForm(value: any): void {
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
    }
    if (value.answerFile && !value.secondaryOwnerId) {
      this.notify.showError("Alert", "Select Respondent/Minister.");
    } else {
      this.isLoading = true;
      if (!value.id) this.lobService.saveBusinessLineItem(this.item, value);
      else this.lobService.updateBusinessLineItem(this.item, value);
    }
  }

  resetForm(): void {
    this.validateForm.reset();
    this.fileList = [];
    this.answerFileList = [];
    this.speaketNoteFileList = [];
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsPristine();
      this.validateForm.controls[key].updateValueAndValidity();
    }
    if (this.isEdit && this.lobAgendaLine) {
      this.validateForm.controls["id"].setValue(this.lobAgendaLine.id);
    }
  }

  constructor(
    private fb: FormBuilder,
    public lobService: AgendaServiceService,
    public modal: NzModalRef,
    private notify: NotificationCustomService
  ) {}

  ngOnInit() {
    this.validateForm = this.fb.group({
      id: [""],
      title: ["", [Validators.required]],
      memberId: ["", [Validators.required]],
      secondaryOwnerId: [null],
      description: ["", Validators.required],
      allotedTime: [""],
      flipUrl: [""],
      file: [""],
      answerFile: [""],
      speakerNoteFile: [""]
    });

    this.setInputValueToForm();
  }

  setInputValueToForm() {
    if (this.lobAgendaLine) {
      this.isEdit = true;
      if (this.lobAgendaLine.primaryDocumentUrl) {
        this.fileList = [
          {
            uid: "-1",
            size: 0,
            type: "pdf",
            name: "document",
            status: "done",
            url: this.lobAgendaLine.primaryDocumentUrl
          }
        ];
      }
      if (this.lobAgendaLine.secondaryDocumentUrl) {
        this.answerFileList = [
          {
            uid: "-1",
            size: 0,
            type: "pdf",
            name: "response",
            status: "done",
            url: this.lobAgendaLine.secondaryDocumentUrl
          }
        ];
      }
      if (this.lobAgendaLine.speakerNoteUrl) {
        this.speaketNoteFileList = [
          {
            uid: "-1",
            size: 0,
            type: "pdf",
            name: "speaker Note",
            status: "done",
            url: this.lobAgendaLine.speakerNoteUrl
          }
        ];
      }

      this.validateForm.setValue({
        id: this.lobAgendaLine.id,
        title: this.lobAgendaLine.title,
        memberId: this.members.find(
          member => member.value == this.lobAgendaLine.primaryMemberId
        ),
        secondaryOwnerId: this.lobAgendaLine.secondaryMemberId
          ? this.members.find(
              member => member.value == this.lobAgendaLine.secondaryMemberId
            )
          : "",
        description: this.lobAgendaLine.description,
        allotedTime: this.lobAgendaLine.allotedTime,
        flipUrl: this.lobAgendaLine.flipUrl,
        file: this.fileList.length > 0 ? this.fileList[0] : "",
        answerFile:
          this.answerFileList.length > 0 ? this.answerFileList[0] : "",
        speakerNoteFile:
          this.speaketNoteFileList.length > 0 ? this.speaketNoteFileList[0] : ""
      });
    }
  }
}
