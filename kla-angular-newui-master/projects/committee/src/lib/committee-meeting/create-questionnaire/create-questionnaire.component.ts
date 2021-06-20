import { Component, Inject, OnInit } from '@angular/core';
import { NzUploadModule, UploadChangeParam ,UploadFile} from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommitteeService } from '../../shared/services/committee.service';
import { NzNotificationService } from 'ng-zorro-antd';
import { FileServiceService } from '../../shared/services/file-service.service';
import { AttachmentConfig } from '../../shared/model/nominee.model';

@Component({
  selector: 'committee-create-questionnaire',
  templateUrl: './create-questionnaire.component.html',
  styleUrls: ['./create-questionnaire.component.css'],
})
export class CreateQuestionnaireComponent implements OnInit {
  isSubmit=false;
  today=new Date();
  edit = false;
  content =
    '<h1 class="ql-align-center"><strong>പൊതുഭരണ(രഹസ്യ) വകുപ്പ്</strong></h1>';
  showUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    hidePreviewIconInNonImage: true,
  };
  attachmentDto:AttachmentConfig[]=[];
  defaultFileList: NzUploadModule[] = [
    {
      uid: '-1',
      name: 'doc1.png',
      status: 'done',
      url:
        'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      thumbUrl:
        'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
    {
      uid: '-2',
      name: 'doc2.png',
      status: 'error',
    },
  ];
  urlState: any = null;
  fileList1 = [...this.defaultFileList];
  questionnaireForm: FormGroup;
  modules: any;
  user: any;
  editorInstance;
  editorIndex = 0;
  editorContent = '';
  uploadURL=this.committeeService.uploadUrl();
  FileList= [];
  mainAttachments:any=[];
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private committeeService: CommitteeService,
    @Inject('authService') private AuthService,
    private notification: NzNotificationService,
    private fileService: FileServiceService
  ) {
    this.user = AuthService.getCurrentUser();
    this.urlState = this.router.getCurrentNavigation().extras.state;
    if (this.urlState) {
      this.formValidation();
    }
  }

  ngOnInit() {
    if (this.urlState) {
      this.questionnaireForm.patchValue({
        subject: this.urlState.title,
        meetingId: this.urlState.meetingId,
        meetingDate: this.urlState.date,
        meetingFileId: this.urlState.fileId,
      });
      this.setEditorConfig();
    }
  }
  questionAdd() {
    this.edit = true;
  }
  // handleChange({ file, fileList }): void {
  //   const status = file.status;
  //   if (status !== 'uploading') {
  //     console.log(file, fileList);
  //   }
  //   if (status === 'done') {
  //     // this.msg.success(`${file.name} file uploaded successfully.`);
  //   } else if (status === 'error') {
  //     // this.msg.error(`${file.name} file upload failed.`);
  //   }
  // }

  formValidation(): void {
    this.questionnaireForm = this.fb.group({
      subject: [null, [Validators.required]],
      meetingId: [null, [Validators.required]],
      questions: [null, [Validators.required]],
      meetingDate: [null],
      meetingFileId: [null, [Validators.required]],
      header:[null, [Validators.required]],
      footer:[null, [Validators.required]],
      documents:[[]]
    });
  }

  setEditorConfig() {
    this.modules = {
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline'],
        ['link'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ indent: '-1' }, { indent: '+1' }],
      ],
    };
  }

  createQuestionnaire() {
     if (this.questionnaireForm.valid) {
      this.fileService
        .getFileById(this.urlState.fileId, this.user.userId)
        .subscribe((Res: any) => {
          if (Res.fileResponse.status === 'APPROVED') {
            const attachment = this.attachmentDto.map((x) => ({
              name: x.name,
              attachmentUrl: x.attachmentUrl,
              type: x.type,
            }));
            this.questionnaireForm.get("documents").setValue(attachment);
            this.committeeService
              .createQuestionnaire(this.questionnaireForm.value)
              .subscribe((res: any) => {
                this.attachToFile(res.id);
              });
          } else {
            this.notification.success(
              'Warning',
              'Cannot Attach now as the file is under approval flow'
            );
          }
        });
    }
  }

  attachToFile(id) {
    const reqBody = {
      meetingId: this.urlState.meetingId,
      questionnaireId: id,
      fileForm: {
        activeSubTypes: ['MEETING_QUESTIONNAIRE'],
        assemblyId: this.urlState.assemblyId,
        fileId: this.urlState.fileId,
        fileNumber: this.urlState.fileNumber,
        subtype: 'COMMITTEE_MEETING',
        type: 'COMMITTEE',
        userId: this.user.userId,
      },
    };
    this.fileService.reSubmitFile(reqBody).subscribe((Res: any) => {
      this.notification.success(
        'Success',
        ' Questionnaire Saved and Attached Successfully'
      );
      this.router.navigate([
        'business-dashboard/committee/file-view/',
        this.urlState.fileId,
      ]);
    });
  }

  handleChange(info: UploadChangeParam): void {
    const fileList = [...info.fileList];
    this.FileList = [];
    if (info.file.response) {
      for (const file of fileList) {
        file.url = file.response.body;
        this.FileList.push({
          name: info.file.name,
          attachmentUrl: info.file.response.body,
          type: "ATTACHMENT",
          delete:true
        });
      }
    }
    this.attachmentDto = this.FileList;
    console.log(this.attachmentDto,this.mainAttachments)
    this.FileList = fileList.filter((item: any) => {
      if (item.response) {
        return item.response.status !== "success";
      }
      return true;
    });
    console.log(this.FileList);
  }
//   getData(){
//     this.isSubmit=true;
//     if (this.questionnaireForm.valid){
//     const attachment = this.attachmentDto.map((x) => ({
//       name: x.name,
//       attachmentUrl: x.attachmentUrl,
//       type: x.type,
//       delete:x.delete
//     }));
//     this.questionnaireForm.get("documents").setValue(attachment);
//     console.log(this.questionnaireForm.value,attachment);
//   }else{
//     this.validationMessage();
//   }
// }
// validationMessage() {
//   // tslint:disable-next-line: forin
//   for (const key in this.questionnaireForm.controls) {
//     this.questionnaireForm.controls[key].markAsDirty();
//     this.questionnaireForm.controls[key].updateValueAndValidity();
//   }
// }
}
