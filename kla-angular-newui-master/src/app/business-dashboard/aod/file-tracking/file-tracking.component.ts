import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationCustomService } from 'src/app/shared/services/notification.service';
import { AuthService } from 'src/app/auth/shared/services/auth.service';
import { FormBuilder, FormGroup, Validators, ValidationErrors } from '@angular/forms';
import { AodService } from '../shared/service/aod.service';
import { differenceInCalendarDays } from 'date-fns';
import { CalenderofsittingService } from '../../calender-of-sitting/shared/services/calenderofsitting.service';
import { MinisterGroupService } from '../shared/service/minister-group.service';

@Component({
  selector: 'app-file-tracking',
  templateUrl: './file-tracking.component.html',
  styleUrls: ['./file-tracking.component.scss']
})
export class FileTrackingComponent implements OnInit {
  allotmentId = null;
  latestone = false;
  pullRemark = null;
  showPullModal = false;
  ministerGroupDetails = [];
  userId;
  latest: any = [];
  hideNormal = true;
  NoticeNoteFlag = false;
  today = new Date();
  enableOption = true;
  currentUserActionRow;
  isHidden: boolean = false;
  isVisible1=false;
  canPull;
pullGroup;
  fileDetails = {
    subject: '',
    priority: '',
    description: '',
    returnUrl: '',
    createdDate: null,
    assemblyId: null,
    sessionId: null,
    fileNumber: '',
    status: '',
    currentAssignee: false,
    subFile: null
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
  latestNote;
  workFlowActionUsers = [];
  allActionUsers = [];
  assemblyId;
  sessionId;
  AodData: any = {
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
    documentFile: ['', Validators.required],
    letter: ['', Validators.required],
  });
  createFileForm: FormGroup = this.fb.group({
    subject: ["", Validators.required],
    priority: ["", Validators.required],
    userId: [this.user.getCurrentUser().userId, Validators.required]
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
  dateShiftType = null;
  aodDetails = {
    allotmentId: null,
    aodDetail: [],
    assemblyId: null,
    fileId: null,
    fileStatus: null,
    sessionId: null,
    status: null,
    userId: null,
    revised: null,
    dateShiftType: null
  };
  approvedCos = {
    calendarOfDaysList: []
  };
  showModal(): void {
    this.isVisible1 = true;
    this.createFileForm.get('subject').setValue(this.fileDetails.subject);
    this.createFileForm.get('priority').setValue(this.fileDetails.priority);
  }

  handleCancel(): void {
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
    private notify: NotificationCustomService,
    public aodService: AodService,
    private fb: FormBuilder,
    public service: AodService,
    private authService: AuthService,
    public cos: CalenderofsittingService,
    private minister: MinisterGroupService
  ) {
    const id = this.route.snapshot.params.id;
    if (id) {
      this.currentUserID = this.user.getCurrentUser().userId;
      this.fileId = id;
    }
  }
  ngOnInit() {
    this.getAllNotes(this.fileId);
    this.getFileByFileId(this.fileId);
    this.service.getAODPermissions(this.authService.getCurrentUser().userId);
    this.getApprovedMinisterGroup();
  //  this.getlatest();
    // this.createFileLogs();
  }
  getApprovedMinisterGroup() {
    this.minister.getApprovedMinisterGroup().subscribe(data => {
      this.ministerGroupDetails = data.groupList;
    });
  }
  getApprovedCos() {
    this.cos.getApprovedCos(this.fileDetails.assemblyId, this.fileDetails.sessionId, 'APPROVED')
    .subscribe((data: any) => {
      this.approvedCos = data;
      this.processCalendarEvent(data);
    });
  }
  processCalendarEvent(data) {
    if (data && data.calendarOfDaysList) {
      this.approvedCos = data;
      let firstData = null;
      data.calendarOfDaysList.forEach((element, i) => {
        if (firstData !== new Date(element.dateList[0]).getMonth()) {
          firstData = new Date(element.dateList[0]).getMonth();
          this.approvedCos.calendarOfDaysList[i].month = element.dateList[0];
        }
      });
      this.approvedCos = data;
    }
  }
  ShowBusiness(item) {
    if (item && item.lobBusinessGroupId === 3) {
      return item.descriptionEng;
    }
    return item.lobBusinessGroupName;
  }
  getDateShiftType() {
    if (this.aodDetails.dateShiftType === 'SERIAL') {
      this.dateShiftType = 'Serially';
    } else {
      this.dateShiftType = 'from one date to another';
    }
  }
  getFileByFileId(id) {
    this.service.getAodListFile(id, this.user.getCurrentUser().userId).subscribe(Response => {
      this.AodData = Response;
      this.loadFileButtons(this.AodData.fileResponse.status);
      this.getWorkFlowTrack(this.AodData.fileResponse.workflowId);
      this.aodDetails  = this.AodData.allotmentOfDays;
      this.fileDetails = this.AodData.fileResponse;
      this.getApprovedCos();
      this.getAllNotes(id);
      this.getAllLogs(id);
      if (this.AodData.allotmentList && this.AodData.allotmentList.length > 0) {
        this.aodDetails = this.AodData.allotmentList[0];
        this.allotmentId = this.aodDetails.allotmentId;
        this.getDateShiftType();
      }
    });
  }
  changeVersion(allotmentId) {
    this.aodDetails = this.AodData.allotmentList.find(x => x.allotmentId === allotmentId);
    this.aodDetails.revised = true;
  }
  getWorkFlowRole(workflowId, fileId) {
    this.cos.getWorkFlowRole(workflowId, fileId).subscribe((Response) => {
      if (Response) {
        const data = Response;
        this.allActionUsers = data;
        console.log(data);
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
  editaod() {
    this.fileDetails.returnUrl = `business-dashboard/aod/aod-file/${this.fileId}`;
    const data = {
      returnUrl: this.fileDetails.returnUrl,
      assemblyId: this.fileDetails.assemblyId,
      sessionId: this.fileDetails.sessionId
    };
    this.router.navigate(['/business-dashboard/aod/aod-create', btoa(JSON.stringify(data))]);
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
        this.latest = this.notesList[this.notesList.length - 1];
        // if(latest && latest['userId'] === this.currentUserID) {
        //   this.latestone = true;
        // } else{this.latestone = false;}
        const tempNote: any = this.notesList.filter(item => item.temporary === true);
        if (tempNote.length > 0) {
          this.hideNormal = false;
        }
      }
    });
  }
  // getlatest() {
  //   this.getAllNotes(this.fileId);
  //   let latest:[] = this.notesList.pop();
  //   if(latest && latest['userId'] === this.currentUserID){
  //    return  this.latestone = true;
  //   } else{this.latestone = false;}
  // }
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
    const body = {
      fromGroup: this.user.getCurrentUser().authorities[0]
    };
    if (this.isSpeaker() || this.isSecretary()) {
      this.service.forwardFile(this.fileId, body).subscribe((Response) => {
        if (Response) {
           const tex = 'Can be Submitted';
           this.createNoteForm.get('note').setValue(tex);
           this.createNote();
           this.notify.showSuccess('Success', 'file submitted successfully');
           this.getAllNotes(this.fileId);
           setTimeout(() => {
            this.router.navigate(['aod-list'], {
              relativeTo: this.route.parent,
            });
        }, 1500);
        }
      });
    } else {
    this.getAllNotes(this.fileId);
    let latestNote = this.notesList.pop();
    if (latestNote && latestNote.userId === this.currentUserID) {
    this.service.forwardFile(this.fileId, body).subscribe((Response) => {
      if (Response) {
        this.notify.showSuccess('Success', 'file Submitted successfully');
        latestNote = [];
        this.getAllNotes(this.fileId);
        setTimeout(() => {
        this.router.navigate(['aod-list'], {
            relativeTo: this.route.parent,
          });
       }, 1500);
      }
    });
  } else {
    this.notify.showWarning('Warning!', 'Add Note...!');
    this.getAllNotes(this.fileId);
}
    }
  }

  approveFile() {
    const body = {
      fileId: this.fileId,
      userId: this.user.getCurrentUser().userId,
      lobDate: this.approvalForm.value.date,
      forwardToBac: this.approvalForm.value.checked
    };
    this.service.approveFile(body).subscribe((Response) => {
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
          this.router.navigate(['aod-list'], {
              relativeTo: this.route.parent,
            });
        }, 1500);
        }
      });
  }
  disallowFile() {
    this.getAllRules();
    this.disallowStatus = true;
    this.ShowRules = true;
  }
  disallow(ruleId) {
    this.getAllNotes(this.fileId);
    // let latestNote: [] = this.notesList.pop();
    // if (latestNote && latestNote['userId'] === this.currentUserID) {
    this.service.disallowFile(this.fileId).subscribe((Response) => {
      console.log(Response);
      if (Response) {
        this.notify.showSuccess('Success', 'file disallowed successfully');
        // latestNote = [];
        this.getAllNotes(this.fileId);
        setTimeout(() => {
          this.router.navigate(['aod-list'], {
            relativeTo: this.route.parent,
          });
        }, 1500);
      }
    });
  // } else{
  //   this.notify.showWarning('Warning!', 'Add Note...!');
  //   this.getAllNotes(this.fileId);
  // }
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
    this.aodService.updateFile(this.fileId, data).subscribe((Response) => {
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
      this.service.returnFile(this.fileId, body).subscribe(Response => {
        console.log(Response);
        const tex = 'Can be Returned';
        this.createNoteForm.controls.note.setValue(tex);
        this.createNote();
        this.notify.showSuccess('Success', 'File Returned successfully');
        this.getAllNotes(this.fileId);
        setTimeout(() => {
          this.router.navigate(['aod-list'], {
            relativeTo: this.route.parent,
          });
        }, 1500);
      }, error => {
        console.log(error);
      });
    } else {
    this.getAllNotes(this.fileId);
    let latestNote = this.notesList.pop();
    if (latestNote && latestNote.userId === this.currentUserID) {
    // const body = {
    //   fromGroup: this.user.getCurrentUser().authorities[0]
    // };
    this.service.returnFile(this.fileId, body).subscribe(Response => {
      console.log(Response);
      this.notify.showSuccess('Success', 'File Returned successfully');
      latestNote = [];
      this.getAllNotes(this.fileId);
      setTimeout(() => {
        this.router.navigate(['aod-list'], {
          relativeTo: this.route.parent,
        });
      }, 1500);
    }, error => {
      console.log(error);
    });
  } else {
    this.notify.showWarning('Warning!', 'Add Note...!');
    this.getAllNotes(this.fileId);
  }
}
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
      if (this.fileDetails.status === 'SUBMITTED') {
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
    this.service.getAllRules().subscribe(Response => {
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
      this.createNote();
      this.disallow(ruleCode);
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
      let latestNote = this.notesList.pop();
      if (tempNote.length < 1 && !(latestNote && latestNote.userId === this.currentUserID)) {
        this.service.createNote(this.fileId, data).subscribe((Response) => {
          if (Response) {
            console.log(Response);
            this.createNoteForm.controls.tempFlag.setValue(false);
            this.notify.showSuccess('Success', 'Note Saved Successfully');
            latestNote = [];
            this.getAllNotes(this.fileId);
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
      if ( latestNote && latestNote.userId === this.currentUserID) {
        this.notify.showWarning('Warning!', 'Cannot Add Morethan One Note..!');
        this.getAllNotes(this.fileId);
        this.createNoteForm.reset();
      }
      if (tempNote.length > 1) {
        this.notify.showWarning('Warning!', 'Cannot Add Morethan One Yellow Note..!');
      }
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
  isMLA() {
    return this.user.getCurrentUser().authorities.includes('MLA');
  }
  isSpeaker() {
    return this.user.getCurrentUser().authorities.includes('speaker');
  }
  isSecretary() {
    return this.user.getCurrentUser().authorities.includes('secretary');
  }
  // getWorkFlowTrack(workFlowId) {
  //   this.process.checkWorkFlowStatus(workFlowId).subscribe((Response) => {
  //     this.stepStatus = Response;
  //     console.log(this.stepStatus);
  //   });
  // }
  forwardFile(fileId) {
    this.getAllNotes(this.fileId);
    let latestNote = this.notesList.pop();
    const details = this.userId.split('-');
    if (details && details.length > 0) {
      if (latestNote && latestNote.userId === this.currentUserID || this.isSpeaker() || this.isSecretary()) {
        if (latestNote && latestNote.userId !== this.currentUserID) {
          let tex;
          if (this.getCurrentAction() === 'Forward') {
            tex = 'Can be Approved';
          } else {
            tex = 'Can be Returned';
          }
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
        this.cos.forwardFile(this.fileId, body).subscribe((Response) => {
          if (Response) {
            this.notify.showSuccess('Success', 'file Forwarded successfully');
            latestNote = [];
            this.getAllNotes(this.fileId);
            setTimeout(() => {
              this.router.navigate(['aod-list'], {
                relativeTo: this.route.parent,
              });
            }, 1500);

          }
        });
      } else {
        this.notify.showWarning('Warning', 'Add Note!');
        this.getAllNotes(this.fileId);
      }
    }
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
  showPullpopup() {
    this.showPullModal = true;
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
      fromGroup: this.authService.getCurrentUser().fullName,
      assignee: this.currentUserActionRow.userId,
      fromGroupId: current.owner,
      remark: this.pullRemark
    };
    if (fromRow && groupRow && (groupRow.actionRow > fromRow.actionRow)) {
      this.cos.pullFile(body, this.fileId).subscribe((Res) => {
        this.notify.showSuccess(
          'Success',
          `File pulled from ${current.taskDefinitionKeyName} Successfully!`
        );
        this.getFileByFileId(this.fileId);
        this.pullRemark = null;
        this.showPullModal = false;
      });
    } else {
      this.notify.showWarning('Warning', 'You cannot pull from higher authority!');
    }
  }
  cancelPull() {
    this.showPullModal = false;
    this.pullRemark = null;
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

  getPullGroup() {
    const current = this.stepStatusDetail[this.stepStatusDetail.length - 1];
    this.pullGroup = current.assignee;
  }

  refresh() {
      this.aodService
        .refreshAodDates(this.fileDetails.assemblyId, this.fileDetails.sessionId)
        .subscribe((res: any) => {
           this.aodDetails.aodDetail = res.aodDetail;
           if (res) {
            res.userId = this.authService.getCurrentUser().userId;
            this.aodService.postAod(res)
              .subscribe((obj: any) => {
                this.notify.showSuccess('Success', 'refreshed successfully');
              });
          }
        });
  }

  viewFile(fileId, fileType) {
    this.router.navigate([fileType.viewPath, fileId]);
  }
}
