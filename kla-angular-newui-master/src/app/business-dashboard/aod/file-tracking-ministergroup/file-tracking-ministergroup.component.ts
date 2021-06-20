import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationCustomService } from 'src/app/shared/services/notification.service';
import { AuthService } from 'src/app/auth/shared/services/auth.service';
import { FormBuilder, FormControl, FormGroup, Validators, ValidationErrors } from '@angular/forms';
import { AodService } from '../shared/service/aod.service';
import { differenceInCalendarDays } from 'date-fns';

@Component({
  selector: 'app-file-tracking-ministergroup',
  templateUrl: './file-tracking-ministergroup.component.html',
  styleUrls: ['./file-tracking-ministergroup.component.scss']
})
export class FileTrackingMinistergroupComponent implements OnInit {
  hideNormal = true;
  NoticeNoteFlag = false;
  today = new Date();
  enableOption = true;
  isHidden: boolean = false;
  fileDetails = {
    returnUrl: '',
    assemblyId: null,
    sessionId: null,
  };
  approvalForm: FormGroup = this.fb.group({
    date: ['', Validators.required],
    checked: [false, Validators.required]
  }, {
    validators: this.disabledInputs
  });
  temporary = false;
  assemblySession: object = [];
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
  disallowStatus = false;
  AodData :any = {
    // allotmentOfDays:{
    //   allotmentId: null,
    // aodDetail: [],
    // assemblyId: null,
    // fileId: null,
    // fileStatus: null,
    // sessionId: null,
    // status: null,
    // userId: null
    // },
    fileResponse: {
      assemblyId: '',
      assigedTo: '',
      createdDate: '',
      currentNumber: '',
      currentVersion: '',
      description: '',
      fileId: '',
      fileNumber: '',
      subject: '',
      status: '',
      priority: '',
      notes: {
        id: '',
        createdDate: '',
      },
      user: {
        userName: '',
      },
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
    documentFile: ["", Validators.required],
    letter: ["", Validators.required],
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
  something;
  // AodData;
  AodDataKeys;
  currentUserID;
  aodDetails = {
    allotmentId: null,
    aodDetail: [],
    assemblyId: null,
    fileId: null,
    fileStatus: null,
    sessionId: null,
    status: null,
    userId: null
  };
  showModal(): void {
    this.isVisible = true;
  }

  handleCancel(): void {
    this.isVisible = false;
    this.viewDocument = false;
  }
  newTab(): void {
    this.tabs.push('New Tab');
  }
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private user: AuthService,
    private notify: NotificationCustomService,
    public aodService: AodService,
    private fb: FormBuilder,
    public service: AodService,
    private authService: AuthService
  ) { 
    const id = this.route.snapshot.params.id;
    if (id) {
      this.currentUserID = this.user.getCurrentUser().userId;
      console.log(this.currentUserID);
      this.getFileByFileId(id);
      this.getAllNotes(id);
      this.getAllLogs(id);
      this.fileId = id;
    }
  }

  ngOnInit() {
    this.getFileByFileId(this.fileId);
    this.service.getAODPermissions(this.authService.getCurrentUser().userId);
  }
  getFileByFileId(id) {
    this.service.getAodListFile(id, this.user.getCurrentUser().userId).subscribe(Response => {
      this.AodData = Response;
      this.loadFileButtons(this.AodData.fileResponse.status);
      this. getWorkFlowTrack(this.AodData.fileResponse.workflowId);
      console.log(this.AodData.fileResponse.fileId);
      this.aodDetails  = this.AodData.allotmentOfDays;
      this.fileDetails = {
        returnUrl: '',
        assemblyId: this.AodData.fileResponse.assemblyId,
        sessionId: this.AodData.fileResponse.sessionId,
      };
    });
  }
  editaod() {
    this.fileDetails.returnUrl = `business-dashboard/aod/aod-file/${this.fileId}`;
    this.router.navigate(['/business-dashboard/aod/aod-create', btoa(JSON.stringify(this.fileDetails))]);
  }
  editMinisterGroup() {
    this.router.navigate(['/business-dashboard/aod/aod-ministergroup', btoa(`/business-dashboard/aod/aod-file/${this.fileId}`)]);
  }
  showDocument() {
    this.viewDocument = true;
  }
  getRoles(roles) {
    return roles.map((x) => x.roleName).join('/');
  }
  getAllNotes(id) {
    this.service.getAllNotes(id).subscribe(Response => {
      if (Response) {
        this.notesList = Response;
        // this.temporary = Response.temporary;
        console.log(this.notesList);
        const tempNote: any = this.notesList.filter(item => item.temporary === true);
        if (tempNote.length > 0) {
          this.hideNormal = false;
        };
      }
    });
  }
  getAllLogs(id) {
    this.service.getAllFileLogs(id).subscribe(Response => {
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
    this.getAllNotes(this.fileId);
    const latestNote: [] = this.notesList.pop();
    if (latestNote && latestNote['userId'] === this.currentUserID) {
    const body = {
      fromGroup: this.user.getCurrentUser().authorities[0]
    };
    this.service.forwardFile(this.fileId, body).subscribe((Response) => {
      if (Response) {
        this.notify.showSuccess('Success', 'file Submitted successfully');
        setTimeout(() => {
          this.router.navigate(['aod-list'], {
            relativeTo: this.route.parent,
          });
        }, 1500);
      }
    });
  } else{this.notify.showWarning("Warning!", 'Add Note...!');}
  }

  approveFile() {
    this.getAllNotes(this.fileId);
    const latestNote: [] = this.notesList.pop();
    if (latestNote && latestNote['userId'] === this.currentUserID) {
    const body = {
      fileId: this.fileId,
      userId: this.user.getCurrentUser().userId,
      lobDate: this.approvalForm.value.date,
    forwardToBac: this.approvalForm.value.checked
    };
    console.log(body);
    this.service.approveFile(body).subscribe((Response) => {
      if (Response) {
        const tex = "Approved";
        this.createNoteForm.controls['note'].setValue(tex);
        this.createNote();
        this.getAllNotes(this.fileId);
        if (this.approvalForm.value.checked) {
          this.notify.showSuccess('Success', 'file forwarded to BAC successfully');
        } else {
          this.notify.showSuccess('Success', 'file approved successfully');
        }
        setTimeout(() => {
          this.router.navigate(['aod-list'], {
            relativeTo: this.route.parent,
          });
        }, 1500);
        this.isVisibleApprovalForm = false;
      }
    });
  } else{this.notify.showWarning('Warning!', 'Add Note...!');}
  }
  disallowFile() {
    this.getAllNotes(this.fileId);
    const latestNote: [] = this.notesList.pop();
    if (latestNote && latestNote['userId'] === this.currentUserID) {
    this.service.disallowFile(this.fileId).subscribe((Response) => {
      console.log(Response);
      if (Response) {
        this.notify.showSuccess('Success', 'file disallowed successfully');
        setTimeout(() => {
          this.router.navigate(['aod-list'], {
            relativeTo: this.route.parent,
          });
        }, 1500);
      }
    });
  } else{this.notify.showWarning('Warning!', 'Add Note...!');}
  }
  createDocument() {
    const body = {};
    // this.file.creatFileDocument(this.fileId, body).subscribe(Response => {
    //   this.notify.showSuccess('Success', 'filedocument created successfully');
    // }, error => {
    //   console.log(error);
    // });
  }

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

 
  // updateNote() {
  //   const body = {};
  //   this.file.updateNote(this.fileId, body).subscribe(Response => {
  //     console.log(Response);
  //     this.notify.showSuccess('Success', 'Note Updated successfully');
  //   }, error => {
  //     console.log(error);
  //   });
  // }
  // deleteNoteById(fileId) {
  //   this.file.deleteNoteById(fileId).subscribe(Response => {
  //     console.log(Response);
  //     this.notify.showSuccess('Success', 'Note Deleted successfully');
  //   }, error => {
  //     console.log(error);
  //   });
  // }
  deleteNote(nId) {
    const body = {
      fileId: this.fileId,
      noteId: nId,
      userId: this.user.getCurrentUser().userId
    };
    this.service.deleteNoteById(body).subscribe(Res => {
      this.notify.showSuccess('Success', 'Note Deleted successfully'); 
      this.notes = Res;
      console.log(this.notes); 
      this.getAllNotes(this.fileId);
      const tempNote: any = this.notesList.filter(item => item.temporary === true
        );
      if(tempNote.length < 1) {
        this.hideNormal = true;
        }
      });
  }
  cancel() {
  }

  returnFile() {
    this.getAllNotes(this.fileId);
    const latestNote: [] = this.notesList.pop();
    if (latestNote && latestNote['userId'] === this.currentUserID) {
    const body = {
      fromGroup: this.user.getCurrentUser().authorities[0]
    };
    this.service.returnFile(this.fileId, body).subscribe(Response => {
      console.log(Response);
      this.notify.showSuccess('Success', 'File Returned successfully');
      setTimeout(() => {
        this.router.navigate(['aod-list'], {
          relativeTo: this.route.parent,
        });
      }, 1500);
    }, error => {
      console.log(error);
    });
  } else{this.notify.showWarning('Warning!', 'Add Note...!');}
  }

  editNote(data) {
    this.editMode = true;
    this.createNoteForm.setValue({
      noteid: data.noteId,
      note: data.note,
      tempFlag: data.temporary
    });
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
  // handleSubmitApprovalForm(value: any) {
  //   // tslint:disable-next-line: forin
  //   for (const key in this.approvalForm.controls) {
  //     this.approvalForm.controls[key].markAsDirty();
  //     this.approvalForm.controls[key].updateValueAndValidity();
  //   }
  //   this.approveFile();
  // }
  disabledDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, this.today) < 0;
  }

  getWorkFlowTrack(workFlowId) {
    this.service.checkWorkFlowStatus(workFlowId).subscribe((Response) => {
      this.stepStatusDetail = Response;
      console.log(this.stepStatusDetail);
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
    // this.service.getallrules().subscribe(Response => {
    //   if (Response) {
    //     this.allRules = Response;
    //   }
    // });
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
      this.createNote();
      this.disallowFile();
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
      Note : false
    };
  }
  loadFileButtons(fileStatus) {
    if (this.service.doIHaveAnAccess('FILE', 'APPROVE') && fileStatus === 'SUBMITTED') {
      this.fileButtons.Approve = true;
    }
    if (this.service.doIHaveAnAccess('FILE', 'DISALLOW') && fileStatus === 'SUBMITTED') {
      this.fileButtons.Disallow = true;
    }
    if (this.service.doIHaveAnAccess('FILE', 'RETURN') && fileStatus === 'SUBMITTED') {
      this.fileButtons.Return = true;
    }
    if (this.service.doIHaveAnAccess('FILE', 'SUBMIT') && fileStatus === 'SUBMITTED') {
      this.fileButtons.Submit = true;
    }
    if (fileStatus === 'SUBMITTED') {
      this.fileButtons.Note = true;
    }
    // if (this.notice.doIHaveAnAccess('NOTE', 'TEMPORARY') && fileStatus === 'SUBMITTED') {
    //   this.NoticeNoteFlag = true;
    // } else if (this.notice.doIHaveAnAccess('NOTE', 'PERMANENT') && fileStatus === 'SUBMITTED') {
    //   this.NoticeNoteFlag = false;
    // }
  }
  goToList() {
    const assemblyId = this.route.snapshot.params.assemblyId;
    const sessionId = this.route.snapshot.params.sessionId;
    if (assemblyId && sessionId) {
      this.router.navigate(['business-dashboard/aod/aod-list', assemblyId, sessionId]);
    } else {
      this.router.navigate(['business-dashboard/aod/aod-list']);
    }
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
    this.service.convertTONormal(body).subscribe((Response) => {
      if (Response) {
        console.log(Response);
        this.getAllNotes(this.fileId);
        this.notify.showSuccess('Success', 'Yellow Note Successfully Converted To Normal Note');
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
  getAllNote(noteId) {

  }
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
    //   if (data.noteId > 0) {
    //     this.file.updateNote(this.fileId, data).subscribe((Response) => {
    //     if (Response) {
    //       this.editMode = false;
    //       this.notify.showSuccess('Success', 'Note Updated Successfully');
    //       this.getAllNotes(this.fileId);
    //     }
    //   });
    // } else {
      this.getAllNotes(this.fileId);
      const tempNote: any = this.notesList.filter(item => item.temporary === true
      );
      console.log(tempNote);
      const latestNote: [] = this.notesList.pop();
      if (tempNote.length < 1 && !(latestNote && latestNote['userId'] === this.currentUserID)) {
        this.service.createNote(this.fileId, data).subscribe((Response) => {
          if (Response) {
            console.log(Response);
            this.createNoteForm.controls.tempFlag.setValue(false);
            this.notify.showSuccess('Success', 'Note Saved Successfully');
            this.getAllNotes(this.fileId);
            const tempNote: any = this.notesList.filter(item => item.temporary === true);
            if(tempNote.length > 0) {
            this.hideNormal = false;
            }
            this.createNoteForm.reset();
          }
        });
      } 
      // this.getAllNotes(this.fileId);
      // const latestNote: [] = this.notesList.pop();
      if ( latestNote && latestNote['userId'] === this.currentUserID) {
        this.notify.showWarning('Warning!', 'Cannot Add Morethan One Note..!');
      }
      if(tempNote.length > 1) {
        this.notify.showWarning('Warning!', 'Cannot Add Morethan One Yellow Note..!');
      };
    } else { this.notify.showWarning('Warning!', 'Add note..!');
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
    this.service.updateNote(this.fileId, data).subscribe((Response) => {
      console.log(Response);
      if (Response) {
        this.editMode = false;
        this.notify.showSuccess('Success', 'Note Updated successfully');
        this.createNoteForm.reset();
        this.getAllNotes(this.fileId);
    }
    });
  }
  // getWorkFlowTrack(workFlowId) {
  //   this.process.checkWorkFlowStatus(workFlowId).subscribe((Response) => {
  //     this.stepStatus = Response;
  //     console.log(this.stepStatus);
  //   });
  // }
}
