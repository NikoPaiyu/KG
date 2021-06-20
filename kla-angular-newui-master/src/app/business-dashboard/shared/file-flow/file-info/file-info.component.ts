import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/auth/shared/services/auth.service';
import { FileService } from 'src/app/shared/services/file.service';
import { NotificationCustomService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-file-info',
  templateUrl: './file-info.component.html',
  styleUrls: ['./file-info.component.scss']
})
export class FileInfoComponent implements OnInit {
  createFileForm: FormGroup = this.fb.group({
    subject: ['', Validators.required],
    priority: ['', Validators.required],
    userId: [this.user.getCurrentUser().userId, Validators.required]
  });
  @Input() fileDetails: any;
  isVisible1;
  isOkLoading;
  isVisible;
  subject;
  createdDate;
  constructor(private user: AuthService, private fb: FormBuilder,
              private file: FileService, private notify: NotificationCustomService) { }

  ngOnInit() {
  }
  handleCancel() {
    this.isVisible1 = false;
  }
  updateFile() {
    const fileFormValue = this.createFileForm.value;
    const data = {
      assemblyId: this.fileDetails.assemblyId,
      userId: this.user.getCurrentUser().userId,
      description: fileFormValue.fileDescription,
      priority : fileFormValue.priority,
      sectionId: fileFormValue.fileSection,
      sessionId: this.fileDetails.sessionId,
      subject : fileFormValue.subject
    };
    this.file.updateFile(this.fileDetails.fileId, data).subscribe((Response) => {
      if (Response) {
        this.isVisible1 = false;
        this.fileDetails.subject = fileFormValue.subject;
        this.fileDetails.priority = fileFormValue.priority;
        this.createFileForm.reset();
        this.createFileForm.get('userId').setValue(this.user.getCurrentUser().userId);
        this.notify.showSuccess('Success', 'File Updated Successfully');
      }
    });
  }
  showModal() {
    this.isVisible1 = true;
    this.createFileForm.get('subject').setValue(this.fileDetails.subject);
    this.createFileForm.get('priority').setValue(this.fileDetails.priority);
  }
}
