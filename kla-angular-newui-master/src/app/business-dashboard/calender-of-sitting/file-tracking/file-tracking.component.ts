import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationCustomService } from 'src/app/shared/services/notification.service';
import { AuthService } from 'src/app/auth/shared/services/auth.service';
import { FormBuilder, FormGroup, Validators, ValidationErrors } from '@angular/forms';
import { CalenderofsittingService } from '../shared/services/calenderofsitting.service';
import { AodService } from 'src/app/business-dashboard/aod/shared/service/aod.service';
import { differenceInCalendarDays } from 'date-fns';

@Component({
  selector: 'app-file-tracking',
  templateUrl: './file-tracking.component.html',
  styleUrls: ['./file-tracking.component.scss']
})
export class FileTrackingComponent implements OnInit {
  showPullModal = false;
  pullRemark = null;
  userId;
  pullGroup: any;
  workFlowActionUsers = [];
  allActionUsers = [];
  latest: any = [];
  canPull = false;
  hideNormal = true;
  NoticeNoteFlag = false;
  today = new Date();
  enableOption = true;
  fileStatus = null;
  currentUserActionRow;
  isVisible1= false;
  isHidden = false;
  createFileForm: FormGroup = this.fb.group({
    subject: ["", Validators.required],
    priority: ["", Validators.required],
    userId: [this.user.getCurrentUser().userId, Validators.required]
  });
  approvalForm: FormGroup = this.fb.group({
    date: ['', Validators.required],
    checked: [false, Validators.required]
  }, {
    validators: this.disabledInputs
  });
  temporary = false;
  current;
  hideFlag = false;
  fileId = 0;
  notes: any = [];
  docDetails: any = [];
  logDetails: any = [];
  roleDetails: any = [];
  userDetails: any = [];
  notesList: any = [];
  editMode = false;
  something;
  cosDetailsList;
  disallowStatus = false;
  latestNote: any = [];
  fileDetails = {
    fileResponse: {
      assemblyId: '',
      sessionId: '',
      assigedTo: '',
      createdDate: '',
      currentNumber: '',
      currentVersion: '',
      currentAssignee: false,
      description: '',
      fileId: '',
      fileNumber: '',
      subject: '',
      priority: '',
      status: '',
      notes: {
        id: '',
        createdDate: '',
      },
      user: {
        userName: '',
      },
      subFile: null
    },
  };
  fileButtons: any = this.getFileButtons();
  isVisibleApprovalForm = false;
  notesData: any = [];
  stepStatusDetail: any = [];
  createNoteForm: FormGroup = this.fb.group({
    noteid: [null],
    note: ['', Validators.required],
    tempFlag: ['false', Validators.required]
  });
  createNoticeNoteForm: FormGroup = this.fb.group({
    id: [null],
    Note: ['', Validators.required]
  });
  createDocumentForm: FormGroup = this.fb.group({
    documentFile: ['', Validators.required],
    letter: ['', Validators.required],
  });
  viewDocument = false;
  isVisible: boolean;
  isOkLoading: false;
  tabs = ['NTC-AM 01', 'NTC-AM 02', 'NTC-AM 03'];
  noticeDetails = [];
  versionData = '';
  selectedVersion = 1;
  quickOptions = [
    { label: 'Can be admitted', disallowStatus: false },
    { label: 'Can be disallowed as per rule', disallowStatus: true },
    { label: 'Not allowed as per rule', disallowStatus: true },
  ];
  selectedTags = [];
  currentRuleStatement = '';
  ShowRules = false;
  allRules: any;
  currentUserID;
  assemblyId: any;
  sessionId: any;

  showModal(): void {
    this.isVisible = true;
  }
  showpopup() {
    this.createFileForm.patchValue({
      subject: this.fileDetails.fileResponse.subject,
      priority: this.fileDetails.fileResponse.priority
    });
    this.isVisible1 = true;
  }

  handleCancel(): void {
    this.isVisible = false;
    this.isVisible1 = false;
    this.viewDocument = false;
  }
  newTab(): void {
    this.tabs.push('New Tab');
  }
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private user: AuthService,
    private authService: AuthService,
    private cosservice: CalenderofsittingService,
    private notify: NotificationCustomService,
    private fb: FormBuilder,
    public cosService: CalenderofsittingService,
    private aod: AodService
  ) {
  }
  ngOnInit() {
    this.cosService.getCOSPermissions(this.authService.getCurrentUser().userId).subscribe(res => {
      const id = this.route.snapshot.params.id;
      const assemblyId = this.route.snapshot.params.assemblyId;
      const sessionId = this.route.snapshot.params.sessionId;
      if (id) {
        this.currentUserID = this.user.getCurrentUser().userId;
        this.getFileByFileId(id);
        this.getAllNotes(id);
        this.getAllLogs(id);
        this.fileId = id;
      }
      this.assemblyId = assemblyId;
      this.sessionId = sessionId;
      this.getFileByFileId(this.fileId);
      });
  }

  getFileByFileId(id) {
    this.cosservice.getFileById(id, this.user.getCurrentUser().userId).subscribe(Response => {
      this.something = Response;
      this.fileDetails = Response;
      this.cosDetailsList = this.something.calendarOfDaysListDTO;
      this.getWorkFlowTrack(Response.fileResponse.workflowId);
      this.fileStatus = Response.fileResponse.status;
      this.loadFileButtons();
      this.assemblyId = Response.fileResponse.assemblyId;
      this.sessionId = Response.fileResponse.sessionId;
      this.processCalendarEvent();
    });
  }
  processCalendarEvent() {
    if (this.cosDetailsList && this.cosDetailsList.length > 0) {
      let firstData = null;
      this.cosDetailsList.forEach((element, i) => {
        if (firstData !== new Date(element.dateList[0]).getMonth()) {
          firstData = new Date(element.dateList[0]).getMonth();
          this.cosDetailsList[i].month = element.dateList[0];
        }
      });
    }
  }
  setLatestVersion(index) {
    const versionDetails = this.noticeDetails[index].versionOptions;
    this.selectedVersion = Object.keys(versionDetails).length;
  }
  showDocument() {
    this.viewDocument = true;
  }
  getRoles(roles) {
    return roles.map((x) => x.roleName).join('/');
  }
  getAllNotes(id) {
    this.cosservice.getAllNotes(id).subscribe(Response => {
      if (Response) {
        this.notesList = Response;
        this.latest = this.notesList[this.notesList.length - 1];
        // this.temporary = Response.temporary;
        console.log(this.notesList);
        const tempNote: any = this.notesList.filter(item => item.temporary === true);
        if (tempNote.length > 0) {
          this.hideNormal = false;
        }
      }
    });
  }
  getAllLogs(id) {
    this.cosservice.getAllFileLogs(id).subscribe(Response => {
      if (Response) {
        this.logDetails = Response;
        console.log(this.logDetails);
      }
    });
  }
  getAllDocuments(id) {
    // this.file.getDocuments(id).subscribe(Response => {
    //   if (Response) {
    //     this.docDetails = Response;
    //   }
    // });
  }
  submitFile() {
    const body = {
      fromGroup: this.user.getCurrentUser().authorities[0]
    };
    if (this.isSpeaker() && !this.isMLA() || this.isSecretary()) {
      this.cosservice.forwardFile(this.fileId, body).subscribe((Response) => {
        if (Response) {
          // const tex = "Approved";
          // this.createNoteForm.controls['note'].setValue(tex);
          // this.createNote();
           const tex = "Can be Submitted";
           this.createNoteForm.controls['note'].setValue(tex);
           this.createNote();
           this.notify.showSuccess('Success', 'file submitted successfully');
           this.getAllNotes(this.fileId);
           setTimeout(() => {
          this.router.navigate(['/business-dashboard/sitting/cos-list']);
        }, 1500);
        }
      });
    } else {
    this.getAllNotes(this.fileId);
    let latestNote = this.notesList.pop();
    if (latestNote && latestNote.userId === this.currentUserID) {
    const body = {
      fromGroup: this.user.getCurrentUser().authorities[0]
    };
    this.cosservice.forwardFile(this.fileId, body).subscribe((Response) => {
      if (Response) {
        this.notify.showSuccess('Success', 'File Submitted successfully!');
        latestNote = [];
        this.getAllNotes(this.fileId);
        setTimeout(() => {
        this.router.navigate(['/business-dashboard/sitting/cos-list']);
      }, 1500);
      }
    });
  } else {
    this.notify.showWarning('Warning', 'Add Note!');
    this.getAllNotes(this.fileId); }
  }
}
  forwardFile(fileId) {
    this.getAllNotes(this.fileId);
    let latestNote = this.notesList.pop();
    const details = this.userId.split('-');
    if (details && details.length > 0) {
      if (latestNote && latestNote.userId === this.currentUserID || this.isSpeaker() || this.isSecretary()) {
        if (latestNote && latestNote.userId !== this.currentUserID) {
          let tex = 'Can be Approved';
          this.createNoteForm.get('note').setValue(tex);
          this.createNote();
        }
        const body = {
          action: 'FORWARD',
          groupId: details[2],
          fromGroup: this.user.getCurrentUser().userName,
          assignee: details[0],
          fromGroupId: this.user.getCurrentUser().userName
        };
        this.cosservice.forwardFile(this.fileId, body).subscribe((Response) => {
          if (Response) {
            this.notify.showSuccess('Success', 'file Forwarded successfully');
            latestNote = [];
            this.getAllNotes(this.fileId);
            setTimeout(() => {
              this.router.navigate(['business-dashboard/sitting/cos-list']);
            }, 1500);

          }
        });
      } else {
        this.notify.showWarning('Warning', 'Add Note!');
        this.getAllNotes(this.fileId);
      }
    }
  }

  approveFile() {
    const body = {
      userId: this.user.getCurrentUser().userId,
      fileId: this.fileId
    };
    this.cosservice.approveFile(body).subscribe((Response) => {
        if (Response) {
          const latestNote = this.notesList.pop();
          if (latestNote && latestNote.userId !== this.currentUserID) {
            const tex = 'Can be Approved';
            this.createNoteForm.get('note').setValue(tex);
            this.createNote();
          }
          this.notify.showSuccess('Success', 'file approved successfully');
          this.getAllNotes(this.fileId);
          setTimeout(() => {
          this.router.navigate(['/business-dashboard/sitting/cos-list']);
        }, 1500);
        }
      });
  }
  disallowFile() {
    this.getAllNotes(this.fileId);
    let latestNote = this.notesList.pop();
    if (latestNote && latestNote.userId === this.currentUserID) {
    this.cosservice.disallowFile(this.fileId).subscribe((Response) => {
      if (Response) {
        this.notify.showSuccess('Success', 'file disallowed successfully');
        latestNote = [];
        this.getAllNotes(this.fileId);
        setTimeout(() => {
        this.router.navigate(['business-dashboard/sitting/cos-list']);
      }, 1500);
      }
    });
  } else {
    this.notify.showWarning('Warning', 'Add Note!');
    this.getAllNotes(this.fileId);
  }
  }
  // createDocument() {
  //   const body = {};
  //   // this.file.creatFileDocument(this.fileId, body).subscribe(Response => {
  //   //   this.notify.showSuccess('Success', 'filedocument created successfully');
  //   // }, error => {
  //   //   console.log(error);
  //   // });
  // }

  // forwardFile() {
  //   this.file.forwardFile(this.fileId).subscribe(Response => {
  //     console.log(Response);
  //     this.notify.showSuccess('Success', 'file forwarded successfully');
  //   }, error => {
  //     console.log(error);
  //   });
  // }
  // createFileLogs() {
  //   const body = {};
  //   this.file.createFileLogs(this.fileId, body).subscribe(Response => {
  //     console.log(Response);
  //     this.notify.showSuccess('Success', 'file log created successfully');
  //   }, error => {
  //     console.log(error);
  //   });
  // }

  createNote() {
    if (this.createNoteForm.value.note) {
      // this.enableSave = true;
      const formValue = this.createNoteForm.value;
      const data = {
        note: formValue.note,
        noteId: formValue.noteid,
        temporary: formValue.tempFlag,
        referenceBusiness: [1],
        referenceRules: [2, 2],
        userId: this.user.getCurrentUser().userId
      };
      // console.log(this.fileId);
      this.getAllNotes(this.fileId);
      const tempNote: any = this.notesList.filter(item => item.temporary === true
      );
      let latestNote = this.notesList.pop();
      if (tempNote.length < 1 && !(latestNote && latestNote.userId === this.currentUserID)) {
        this.cosservice.createNote(this.fileId, data).subscribe((Response) => {
          if (Response) {
            this.createNoteForm.controls.tempFlag.setValue(false);
            this.notify.showSuccess('Success', 'Note Saved Successfully');
            this.getAllNotes(this.fileId);
            latestNote = [];
            const tempNote: any = this.notesList.filter(item => item.temporary === true);
            if (tempNote.length > 0) {
              this.hideNormal = false;
            }
            this.createNoteForm.reset();
          }
        });
      }
      // this.getAllNotes(this.fileId);
      // const latestNote: [] = this.notesList.pop();
      if (latestNote && latestNote.userId === this.currentUserID) {
        this.notify.showWarning('Warning!', 'Cannot Add Morethan One Note..!');
        this.getAllNotes(this.fileId);
        this.createNoteForm.reset();
      }
      if (tempNote.length > 1) {
        this.notify.showWarning('Warning!', 'Cannot Add Morethan One Yellow Note..!');
      }
    } else {
      this.notify.showWarning('Warning!', 'Add note..!');
    }
  }
  updateNote() {
    const formValue = this.createNoteForm.value;
    const data = {
      note: formValue.note,
      noteId: formValue.noteid,
      temporary: formValue.tempFlag,
      referenceBusiness: [1],
      referenceRules: [2, 2],
      userId: this.user.getCurrentUser().userId
    };
    this.cosservice.updateNote(this.fileId, data).subscribe((Response) => {
      console.log(Response);
      if (Response) {
        this.editMode = false;
        this.notify.showSuccess('Success', 'Note Updated successfully');
        this.getAllNotes(this.fileId);
        this.createNoteForm.reset();
      }
    });
  }
  deleteNote(nId) {
    const body = {
      fileId: this.fileId,
      noteId: nId,
      userId: this.user.getCurrentUser().userId
    };
    this.cosservice.deleteNoteById(body).subscribe(Res => {
      this.notify.showSuccess('Success', 'Note Deleted successfully');
      this.notes = Res;
      console.log(this.notes);
      this.getAllNotes(this.fileId);
      const tempNote: any = this.notesList.filter(item => item.temporary === true
      );
      if (tempNote.length > 0) {
        this.hideNormal = false;
      } else {this.hideNormal = true; }
    });
  }
  cancel() {
  }

  returnFile() {
    const body = {
      fromGroup: this.user.getCurrentUser().authorities[0]
    };
    if (this.isSpeaker() && !this.isMLA() || this.isSecretary()) {
      this.cosservice.returnFile(this.fileId, body).subscribe(Response => {
        console.log(Response);
        const tex = "Can be Returned";
        this.createNoteForm.controls['note'].setValue(tex);
        this.createNote();
        this.notify.showSuccess('Success', 'File Returned successfully');
        this.getAllNotes(this.fileId);
        setTimeout(() => {
          this.router.navigate(['/business-dashboard/sitting/cos-list']);
        }, 1500);
      }, error => {
        console.log(error);
      });
    }else{
    this.getAllNotes(this.fileId);
    let latestNote = this.notesList.pop();
    if (latestNote && latestNote.userId === this.currentUserID) {
    this.cosservice.returnFile(this.fileId, body).subscribe(Response => {
      console.log(Response);
      this.notify.showSuccess('Success', 'File Returned successfully');
      latestNote = [];
      this.getAllNotes(this.fileId);
      setTimeout(() => {
        this.router.navigate(['/business-dashboard/sitting/cos-list']);
      }, 1500);
    }, error => {
      console.log(error);
    });
  } else {
    this.notify.showWarning('Warning', 'Add Note!');
    this.getAllNotes(this.fileId);
  }
}
  }
  noticeProcess(noticeId) {
    if (noticeId) {
      this.router.navigate(['../../notice/process', noticeId, btoa(`../../staff/file/${this.fileId}`)], {
        relativeTo: this.route.parent
      });
    }
  }
  onVersionChange(event, versions) {
    console.log('versions', versions);
    this.versionData = versions[event];
  }
  editNote(data) {
    this.editMode = true;
    if (data.userId === this.currentUserID) {
    this.createNoteForm.setValue({
      noteid: data.noteId,
      note: data.note,
      tempFlag: data.temporary
    });
  }
  }
  // tslint:disable-next-line: adjacent-overload-signatures
  getAllNote(noticeId) {
    if (noticeId) {
      // this.service.getNoteData(noticeId).subscribe((Response) => {
      //   if (Response) {
      //     this.notesData = [];
      //     this.notesData = Response;
      //     console.log(this.notesData);
      //     // this.noticeDetails.notice.numberOfNotes = this.notesList.length;
      //   }
      // });
    }
  }

  onApproveButtonClick() {
    this.isVisibleApprovalForm = true;
  }
  // setApprovalForm() {
  //   this.approvalForm = this.fb.group({
  //     date: ['', [Validators.required]],
  //     checked: ['', [Validators.required]]
  //   });
  // }
  handleCancelApprovalForm() {
    this.isVisibleApprovalForm = false;
  }
  handleSubmitApprovalForm(value: any) {
    //  tslint:disable-next-line: forin
    for (const key in this.approvalForm.controls) {
      this.approvalForm.controls[key].markAsDirty();
      this.approvalForm.controls[key].updateValueAndValidity();
    }
    this.approveFile();
  }
  disabledDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, this.today) < 0;
  }

  getWorkFlowTrack(workFlowId) {
    this.aod.checkWorkFlowStatus(workFlowId).subscribe((Response) => {
      this.stepStatusDetail = Response;
      if (this.fileDetails.fileResponse.status === 'SUBMITTED') {
        this.getWorkFlowRole(workFlowId, this.fileId);
      }
    });
  }
  getStatusByReason(reason) {
    if (reason) {
      if (reason === 'completed') {
        return 'finish';
      }
      if (reason === 'in progress') {
        return 'wait';
      }
    }
  }
  CheckforRules(checked: boolean, tag, index: number) {
    this.currentRuleStatement = tag.label;
    this.selectedTags = [];
    this.getAllRules();
    if (tag.disallowStatus) {
      this.ShowRules = true;
    } else {
      this.addQuickOption(checked, tag.label, index);
    }
  }
  getAllRules() {
    this.aod.getAllRules().subscribe(Response => {
      if (Response) {
        this.allRules = Response;
      }
    });
  }
  addQuickOption(checked: boolean, tag: string, index) {
    this.selectedTags = [];
    this.selectedTags.push(tag);
    this.createNoteForm.patchValue({ note: tag });
  }
  cancelRuleSelection() {
    this.ShowRules = false;
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.allRules.length; i++) {
      if (this.allRules[i].checked) {
        this.allRules[i].checked = false;
      }
    }
    this.selectedTags = [];
  }
  applyRule() {
    let ruleApplyed = [];
    ruleApplyed = this.allRules.filter((x) => x.checked === true);
    const ruleCode = ruleApplyed.map((x) => x.code);
    const ruleData = ruleApplyed.map((x) => x.englishDescription);
    const noteData = this.createNoteForm.value.note;
    this.selectedTags = [];
    if (ruleApplyed.length > 0) {
      this.createNoteForm.patchValue({ note: `${this.currentRuleStatement} ${ruleCode} ${ruleData} ` });
      this.selectedTags.push(
        `${this.currentRuleStatement} ${ruleCode}`
      );
    }
    if (this.disallowStatus) {
      // this.createNote();
      //     this.disallowFile();
    }
    this.cancelRuleSelection();
    this.ShowRules = false;
  }
  getFileButtons() {
    return {
      Approve: false,
      Disallow: false,
      Return: false,
      Submit: false,
      noticeEdit: false,
      Note: false
    };
  }

  cosedit1() {
    const data = {
      returnUrl: `/business-dashboard/sitting/file/${this.fileId}/${this.assemblyId}/${this.sessionId}`,
      assemblyId: this.assemblyId,
      sessionId: this.sessionId
    };
    this.router.navigate(['/business-dashboard/sitting/view', btoa(JSON.stringify(data))]);
  }
  loadFileButtons() {
    const fileStatus = this.fileStatus;
    if (this.cosService.doIHaveAnAccess('FILE', 'APPROVE') && fileStatus === 'SUBMITTED') {
      this.fileButtons.Approve = true;
    }
    if (this.cosService.doIHaveAnAccess('FILE', 'DISALLOW') && fileStatus === 'SUBMITTED') {
      this.fileButtons.Disallow = true;
    }
    if (this.cosService.doIHaveAnAccess('FILE', 'RETURN') && fileStatus === 'SUBMITTED') {
      this.fileButtons.Return = true;
    }
    if (this.cosService.doIHaveAnAccess('FILE', 'SUBMIT') && fileStatus === 'SUBMITTED') {
      this.fileButtons.Submit = true;
    }
    if (fileStatus === 'SUBMITTED') {
      this.fileButtons.Note = true;
    }
  }
  goToList() {
    const assemblyId = this.route.snapshot.params.assemblyId;
    const sessionId = this.route.snapshot.params.sessionId;
    this.router.navigate(['cos-list', assemblyId, sessionId], {
      relativeTo: this.route.parent,
    });
  }
  disabledInputs(form: FormGroup): ValidationErrors {
    if (form.controls.checked.value) {
      if (form.controls.date.value) {
        form.controls.date.setValue(null);
      }
      if (form.controls.date.enabled) {
        form.controls.date.disable();
      }
    } else {
      if (form.controls.date.disabled) {
        form.controls.date.enable();
      }
    }
    // const entries = Object.entries(form.value);
    // if (form.dirty) {
    //   entries.forEach((el, index) => {
    //     if (!el[1]) {
    //       form.controls[el[0]].disable();
    //     }
    //   });
    //   const values = Object.values(form.value).join('');
    //   if (!values) {
    //     form.enable();
    //
    // }
    return;
  }

  convertTONormal(Ntd) {
    const body = {
      fileId: this.fileId,
      noteId: Ntd,
      userId: this.user.getCurrentUser().userId
    };
    console.log(body);
    this.cosservice.convertTONormal(body).subscribe((Response) => {
      if (Response) {
        console.log(Response);
        this.getAllNotes(this.fileId);
        this.notify.showSuccess('Success', 'Yellow Note Successfully Converted To Normal Note');
        this.hideNormal = true;
      }
    });
  }
  createNoticeNote(noticeid) {
    if (this.createNoticeNoteForm.value.Note) {
      const formValue = this.createNoticeNoteForm.value;
      const data = {
        id: formValue.id,
        note: formValue.Note,
        ownerId: this.user.getCurrentUser().userId,
        noticeVersion: 1,
        noticeId: noticeid,
        temporary: this.NoticeNoteFlag
      };
      // this.service.saveNote(data).subscribe((Response) => {
      //   if (Response) {
      //     this.notify.showSuccess('Success', 'Note saved successfully');
      //     this.getAllNote(noticeid);
      //   }
      // });
      this.createNoticeNoteForm.reset();
    } else { this.notify.showWarning('Warning!', 'Add note..!'); }
  }
  ShowBusiness(item) {
    if (item && item.lobBusinessGroupId === 3) {
      return item.descriptionEng;
    }
    return item.lobBusinessGroupName;
  }
  ShowMalayalamBusiness(item) {
    if (item && item.lobBusinessGroupId === 3) {
      return item.descriptionMal;
    }
    return item.lobBusinessDescriptionMal;
  }
  getCurrentAction() {
    let value = 'Forward';
    const actionRowData = this.workFlowActionUsers.find(x => `${x.userId}-${x.actionRow}-${x.actionGroup}` == this.userId);
    if (actionRowData) {
      if (actionRowData.actionRow > this.currentUserActionRow.actionRow) {
        value = 'Forward';
      } else {
        value = 'Return';
      }
    }
    return value;
  }
  getWorkFlowRole(workflowId, fileId) {
    this.cosservice.getWorkFlowRole(workflowId, fileId).subscribe((Response) => {
      if (Response) {
        const data = Response;
        this.allActionUsers  = data;
        if (data && data.length > 0) {
          const currentUser = data.find(x => x.userId === this.user.getCurrentUser().userId);
          if (currentUser) {
            this.currentUserActionRow = currentUser;
            this.workFlowActionUsers = data.filter(
              x => x.actionRow !== currentUser.actionRow
              && (x.actionRow - currentUser.actionRow < 3));
          }
          this.pullOrNot();
        }
      }
    });
  }
  pullOrNot() {
    this.getPullGroup();
    const fromRow = this.allActionUsers.find(user => Number(user.userId) === Number(this.pullGroup));
    const groupRow = this.currentUserActionRow;
    if (fromRow && groupRow && (groupRow.actionRow - fromRow.actionRow < 3 && groupRow.actionRow - fromRow.actionRow > 0)) {
      this.canPull = true;
    } else {
      this.canPull = false;
    }
  }
  showPullpopup() {
    this.showPullModal = true;
  }
  cancelPull() {
    this.showPullModal = false;
    this.pullRemark = null;
  }
  getPullGroup() {
    const current = this.stepStatusDetail[this.stepStatusDetail.length - 1];
    this.pullGroup = current.assignee;
  }
  pullFile() {
    this.getPullGroup();
    const current = this.stepStatusDetail[this.stepStatusDetail.length - 1];
    const fromRow = this.allActionUsers.find(user => Number(user.userId) === Number(this.pullGroup));
    const groupRow = this.currentUserActionRow;
    const body = {
      // processInstanceId: this.fileDetails.fileResponse.workflowId,
      action: 'FORWARD',
      groupId: this.currentUserActionRow.actionGroup,
      fromGroup: this.pullGroup,
      assignee: this.currentUserActionRow.userId,
      fromGroupId: current.owner
    };
    if (fromRow && groupRow && (groupRow.actionRow > fromRow.actionRow)) {
      this.cosservice.pullFile(body, this.fileId).subscribe((Res) => {
        this.notify.showSuccess(
          'Success',
          'File pulled Successfully!'
        );
        this.getFileByFileId(this.fileId);
        this.getAllLogs(this.fileId);
        this.pullRemark = null;
        this.showPullModal = false;
      });
    } else {
      this.notify.showWarning('Warning', 'You cannot pull from higher authority!');
    }
  }
  isMLA() {
    return this.user.getCurrentUser().authorities.includes("MLA");
  }
  isSpeaker() {
    return this.user.getCurrentUser().authorities.includes("speaker");
  }
  isSecretary() {
    return this.user.getCurrentUser().authorities.includes("secretary");
  }
  showModel(): void {
    this.isVisible1 = true;
  }
  handleCancal(): void {
    this.isVisible1 = false;
  }

  updateFile() {
    const fileFormValue = this.createFileForm.value;
    const fileData = {
      assemblyId: this.fileDetails.fileResponse.assemblyId,
      userId: this.user.getCurrentUser().userId,
      description: fileFormValue.fileDescription,
      priority : fileFormValue.priority,
      sectionId: fileFormValue.fileSection,
      sessionId: this.fileDetails.fileResponse.sessionId,
      subject : fileFormValue.subject
    };
    this.cosService.updateFile(this.fileDetails.fileResponse.fileId, fileData).subscribe((Response) => {
      if (Response) {
        this.isVisible1 = false;
        this.fileDetails.fileResponse.subject = fileFormValue.subject;
        this.fileDetails.fileResponse.priority = fileFormValue.priority;
        this.createFileForm.reset();
        this.createFileForm.get('userId').setValue(this.user.getCurrentUser().userId);
        this.notify.showSuccess('Success', 'File Updated Successfully');
      }
    });
  }

  viewFile(fileId, fileType) {
    this.router.navigate([fileType.viewPath, fileId]);
  }
}

