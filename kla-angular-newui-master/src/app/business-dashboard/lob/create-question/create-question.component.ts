import { Component, OnInit, Input } from '@angular/core';
import {
  Validators,
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray
} from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { environment } from 'src/environments/environment';
import { LobService } from '../shared/services/lob.service';
import { NzModalRef, UploadFile } from 'ng-zorro-antd';
import { NotificationCustomService } from 'src/app/shared/services/notification.service';
@Component({
  selector: 'app-create-question',
  templateUrl: './create-question.component.html',
  styleUrls: ['./create-question.component.scss']
})
export class CreateQuestionComponent implements OnInit {
  @Input() item;
  @Input() members;
  @Input() lobAgendaLine;
  businessLineItem;
  isLoading = false;
  isEdit = false;
  validateForm: FormGroup;
  uploadURL = `${environment.fileupload_url}/uploadImage`;
  fileList: UploadFile[] = [];
  answerFileList: UploadFile[] = [];
  speaketNoteFileList: UploadFile[] = [];
  ministerReadingFileList: UploadFile[] = [];
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '100px',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'no',
    enableToolbar: false,
    showToolbar: false,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: 'p',
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['strikeThrough', 'subscript', 'superscript'],
      ['customClasses', 'fontName'],
      ['textColor', 'backgroundColor'],
      ['link', 'unlink', 'insertImage', 'insertVideo'],
      ['toggleEditorMode']
    ]
  };

  beforeUpload = (file: UploadFile): boolean => {
    this.fileList = [];
    this.fileList = this.fileList.concat(file);
    this.validateForm.controls['file'].setValue(file);
    return false;
  }

  handleRemoveFIle = (file: UploadFile) => {
    this.validateForm.controls['file'].setValue('');
    return true;
  }
  beforeUploadSpeakerNote = (file: UploadFile): boolean => {
    this.speaketNoteFileList = [];
    this.speaketNoteFileList = this.speaketNoteFileList.concat(file);
    this.validateForm.controls['speakerNoteFile'].setValue(file);
    return false;
  }
  handleRemoveSpeakerNoteFile = (file: UploadFile) => {
    this.validateForm.controls['speakerNoteFile'].setValue('');
    this.validateForm.controls['flipUrl'].setValue('');
    return true;
  }
  submitForm(value: any): void {
    this.isLoading = false;
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
    }
    if (value.answerFile && !value.secondaryOwnerId) {
      this.notify.showError("Alert", "Select Respondent/Minister.");
    }else if (!this.validateSubbusiness()) {return; }
    else {
      this.isLoading = true;
      if (!value.id) { this.lobService.saveBusinessLineItem(this.item, value); }
      else { this.lobService.updateBusinessLineItem(this.item, value); }
    }
  }

  resetForm(): void {
    this.isLoading = false;
    this.validateForm.reset();
    this.validateForm.controls.subbusiness.reset();
    this.fileList = [];
    this.answerFileList = [];
    this.speaketNoteFileList = [];
    this.ministerReadingFileList = [];
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsPristine();
      this.validateForm.controls[key].updateValueAndValidity();
    }
    if (this.isEdit && this.lobAgendaLine) {
      this.validateForm.controls['id'].setValue(this.lobAgendaLine.id);
    }
  }
  secondaryOwnerValidator = (): { [s: string]: boolean } => {
    if (this.validateForm.controls.answerFile.value) {
      return { confirm: true, error: true };
    } else { return {}; }
  }

  constructor(
    private fb: FormBuilder,
    public lobService: LobService,
    public modal: NzModalRef,
    private notify: NotificationCustomService
  ) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      id: [''],
      title: ['', [Validators.required]],
      memberId: ['', [Validators.required]],
      secondaryOwnerId: [null],
      description: ['', Validators.required],
      allotedTime: [''],
      flipUrl: [''],
      file: [''],
      subbusiness: this.fb.array([]),
      answerFile: [""],
      speakerNoteFile: [''],
      ministerReadingFile: [''],
      ministerId: [null]
    });
    this.setInputValueToForm();
  }

  // LOB new changes
  get subbusiness(): FormGroup {
    return this.fb.group({ id: '', subBusinessName: '', lobBusinessRespondentMember: this.fb.array([this.lobBusinessRespondentMember]) });
  }
  get lobBusinessRespondentMember(): FormGroup {
    return this.fb.group({id: '',  documentUrl: '', memberId: '', showURL: false });
  }
  lobBusinessRespondentMember2(d) {
    const controls = d.get("lobBusinessRespondentMember") as FormArray;
    return controls;
  }
  addSubbusiness() {
    if (!this._canAddSubbusiness()) { this._showErr(); return; }
    (this.validateForm.get('subbusiness') as FormArray).push(this.subbusiness);
  }
  deleteSubbusiness(index, id) {
    if (id) {
      this.lobService.deleteSubbusiness(id, this.lobAgendaLine.id).subscribe((res) => {
        this.lobAgendaLine = res;
        (this.validateForm.get('subbusiness') as FormArray).removeAt(index);
      });
    }else {
      (this.validateForm.get('subbusiness') as FormArray).removeAt(index);
    }
  }
  addRespondents(subBusiness) {
    (subBusiness.get('lobBusinessRespondentMember') as FormArray).push(this.lobBusinessRespondentMember);
  }
  deletedRespondents(subBusiness, id, index) {
    if (id) {
      this.lobService.deleteSubbusinessAnswer(id, this.lobAgendaLine.id).subscribe((res) => {
        this.lobAgendaLine = res;
        subBusiness.get('lobBusinessRespondentMember').removeAt(index);
      });
    }else {
      subBusiness.get('lobBusinessRespondentMember').removeAt(index);
    }
  }
  _canAddSubbusiness() {
    if (this.validateForm.value.subbusiness && this.validateForm.value.subbusiness.length > 0) {
      // tslint:disable-next-line: forin
      for (const i in this.validateForm.value.subbusiness) {
        const businessId = this.validateForm.value.subbusiness[i].subBusinessName;
        const lobBusinessRespondentMember = this.validateForm.value.subbusiness[i].lobBusinessRespondentMember;
        if (businessId !== null && lobBusinessRespondentMember !== null) {
          return true;
        }
      }
      return false;
    }
    return true;
  }
  _showErr() {
    // tslint:disable-next-line: forin
    for (const i in this.validateForm.controls) {
      if (i === 'subbusiness') {
        const control = this.validateForm.get('subbusiness') as FormArray;
        // tslint:disable-next-line: forin
        for (const j in control.controls) {
          const controlTwo = control.controls[j] as FormGroup;
          // tslint:disable-next-line: forin
          for (const k in controlTwo.controls) {
            controlTwo.controls[k].markAsDirty();
            controlTwo.controls[k].updateValueAndValidity();
          }
        }
      }
    }
  }
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
  addRespondentAttachment(info: any, index, subBusiness) {
    const respondentscontrols = subBusiness.get('lobBusinessRespondentMember') as FormArray;
    if (info.type === 'removed' && info.fileList.length === 0) {
      // tslint:disable-next-line: forin
      for (let i in respondentscontrols.controls) {
        const group = respondentscontrols.controls[i];
        if (i == index) {
          group.get('documentUrl').reset()
        }
      }
      return;
    }
    const ansfileList = info.fileList;
    ansfileList.filter((item: any) => {
      if (item.response) {
        // tslint:disable-next-line: forin
        for (let i in respondentscontrols.controls) {
          const group = respondentscontrols.controls[i];
          if (i == index) {
            group.get("documentUrl").setValue(item.response.body);
            group.get("showURL").setValue(false);
          }
        }
        return item.response.status !== "success";
      }
      return true;
    });
  }
  validateSubbusiness() {
    // tslint:disable-next-line: forin
    let qcontrols = this.validateForm.get("subbusiness") as FormArray;
    for (const i in this.validateForm.value.subbusiness) {
      const businessId = this.validateForm.value.subbusiness[i].subBusinessName;
      const respondents = this.validateForm.value.subbusiness[i].lobBusinessRespondentMember;
      if (businessId) {
        for (const j in respondents) {
          if (!respondents[j].memberId) {
            this.notify.showError('Alert', 'Add Respondent');
            return false;
          }
          if (!respondents[j].documentUrl) {
            this.notify.showError('Alert', 'Attach Document');
            return false;
          }
        }
      }
      if (respondents) {
        for (const j in respondents) {
          if (respondents[j].documentUrl || respondents[j].memberId) {
            if (!businessId) {
              this.notify.showError('Alert', 'Enter Sub Business');
              return false;
            }
          }
        }
      }
    }
    return true;
  }
  beforeMinisterReading = (file: UploadFile): boolean => {
    this.ministerReadingFileList = [];
    this.ministerReadingFileList = this.ministerReadingFileList.concat(file);
    this.validateForm.controls["ministerReadingFile"].setValue(file);
    return false;
  };
  handleRemoveMinisterReading = (file: UploadFile) => {
    this.validateForm.controls["ministerReadingFile"].setValue("");
    return true;
  };
  // LOB new changes
  setInputValueToForm() {
    if (this.lobAgendaLine) {
      this.isEdit = true;
      if (this.lobAgendaLine.primaryDocumentUrl) {
        this.fileList = [
          {
            uid: '-1',
            size: 0,
            type: 'pdf',
            name: 'document',
            status: 'done',
            url: this.lobAgendaLine.primaryDocumentUrl
          }
        ];
      }
      if (this.lobAgendaLine.secondaryDocumentUrl) {
        this.answerFileList = [
          {
            uid: '-1',
            size: 0,
            type: 'pdf',
            name: 'response',
            status: 'done',
            url: this.lobAgendaLine.secondaryDocumentUrl
          }
        ];
      }
      if (this.lobAgendaLine.speakerNoteUrl) {
        this.speaketNoteFileList = [
          {
            uid: '-1',
            size: 0,
            type: 'pdf',
            name: 'speaker Note',
            status: 'done',
            url: this.lobAgendaLine.speakerNoteUrl
          }
        ];
      }
      if (this.lobAgendaLine.ministerReadingDocumentUrl) {
        this.ministerReadingFileList = [
          {
            uid: '-1',
            size: 0,
            type: 'pdf',
            name: 'Minister Reading',
            status: 'done',
            url: this.lobAgendaLine.ministerReadingDocumentUrl
          }
        ];
      }
      this.validateForm.patchValue({
        id: this.lobAgendaLine.id,
        title: this.lobAgendaLine.title,
        memberId: this.members.find(
          member => member.value == this.lobAgendaLine.primaryMemberId
        ),
        secondaryOwnerId: this.lobAgendaLine.secondaryMemberId
          ? this.members.find(
            member => member.value == this.lobAgendaLine.secondaryMemberId
          )
          : '',
        description: this.lobAgendaLine.description,
        allotedTime: this.lobAgendaLine.allotedTime,
        flipUrl: this.lobAgendaLine.flipUrl,
        file: this.fileList.length > 0 ? this.fileList[0] : '',
        answerFile:
          this.answerFileList.length > 0 ? this.answerFileList[0] : '',
        speakerNoteFile:
          this.speaketNoteFileList.length > 0 ? this.speaketNoteFileList[0] : '',
        ministerReadingFile:
          this.ministerReadingFileList.length > 0 ? this.ministerReadingFileList[0] : '',
        });
      if (this.lobAgendaLine.lobBusinessAgendaResponse) {
        let  lobBusinessAgendaResponse = this.lobAgendaLine.lobBusinessAgendaResponse;
        let self = this;
        lobBusinessAgendaResponse.forEach((el) => {
              this.setSubbusinessData(el, self);
        });
      }
    }
  }
  setSubbusinessData(data, self) {
    let fg = self.fb.group({
      id: [data.id  ? data.id : null],
      subBusinessName: [data.subBusinessName  ? data.subBusinessName : null],
      lobBusinessRespondentMember: self.fb.array([]),
    });
    (<FormArray>self.validateForm.get("subbusiness")).push(fg);
    let Index = (<FormArray>self.validateForm.get("subbusiness")).length - 1;
    data.lobBusinessRespondentMember.forEach((el) => {
      this.addFormRespondents(Index, el);
    });
  }
  addFormRespondents(Index, RespondentMember) {
    let menObj = (RespondentMember.memberId) ? {label: RespondentMember.memberName, value: RespondentMember.memberId} : {} ;
    let fg = this.fb.group({
      id: [RespondentMember.id ? RespondentMember.id : null],
      documentUrl: [RespondentMember.documentUrl ? RespondentMember.documentUrl : null],
      memberId: [RespondentMember.memberId ? menObj : null],
      showURL: [RespondentMember.documentUrl ? true : false],
    });
    (<FormArray>(
      (<FormGroup>(
        (<FormArray>this.validateForm.controls["subbusiness"]).controls[Index]
      )).controls["lobBusinessRespondentMember"]
    )).push(fg);
  }
  compareFn = (o1: any, o2: any) => (o1 && o2 ? o1.value === o2.value : o1 === o2);

  // answerFileValidator() {
  //   this.validateForm.get("answerFile").valueChanges.subscribe(value => {
  //     if (value) {
  //       this.validateForm
  //         .get("secondaryOwnerId")
  //         .setValidators(Validators.required);
  //     } else {
  //       this.validateForm.get("secondaryOwnerId").setValidators([]);
  //     }

  //     this.validateForm.updateValueAndValidity();
  //   });
  // }
}
