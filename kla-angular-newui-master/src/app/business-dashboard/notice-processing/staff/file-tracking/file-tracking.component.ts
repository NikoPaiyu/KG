import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationCustomService } from 'src/app/shared/services/notification.service';
import { AuthService } from 'src/app/auth/shared/services/auth.service';
import { FileService } from '../../shared/services/file.service';
import { FormBuilder, FormGroup, Validators, ValidationErrors } from '@angular/forms';

import { NoticeTemplateService } from '../../shared/services/notice-template.service';

import { NoticeService } from '../../shared/services/notice.service';
import { NoticeProcessService } from '../../shared/services/notice-process.service';
import { NzCascaderOption } from 'ng-zorro-antd';
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
  selector: 'app-file-tracking',
  templateUrl: './file-tracking.component.html',
  styleUrls: ['./file-tracking.component.scss']
})
export class FileTrackingComponent implements OnInit {
  showPullModal = false;
  showFileInfo = false;
  showFileDetails = false;
  pullRemark = null;
  questionDuplicateDetails;
  pullButton = false;
  pullGroup: any;
  canPull = false;
  latest: any = [];
  getUserData: any = [];
  noticeId = null;
  hideNormal = true;
  workFlowActionUsers = [];
  userId;
  NoticeNoteFlag = false;
  today = new Date();
  enableOption = true;
  isHidden: boolean = false;
  currentUserActionRow;
  approvalForm: FormGroup = this.fb.group({
    date: ['', Validators.required],
    checked: [false, Validators.required]
  }, {
    validators: this.disabledInputs
  });
  userDataForm: FormGroup = this.fb.group({
    userId: [0, Validators.required]
  });
  createFileForm: FormGroup = this.fb.group({
    subject: ['', Validators.required],
    priority: ['', Validators.required],
    userId: [this.user.getCurrentUser().userId, Validators.required]
  });
  temporary = false;
  current: any;
  hideFlag = false;
  fileId = 0;
  workflowId = 0;
  notes: any = [];
  docDetails: any = [];
  logDetails: any = [];
  roleDetails: any = [];
  userDetails: any = [];
  notesList: any = [];
  editMode = false;
  disallowStatus = false;
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
      sectionId:'',
      subtype: '',
      priority: '',
      status: '',
      type: '',
      notes: {
        id: '',
        createdDate: '',
      },
      user: {
        userId:'',
        userName: '',
      },
      workflowId:'',
      subFile: null
    },
  };
  currentUserID;
  fileButtons: any = this.getFileButtons();
  isVisibleApprovalForm = false;
  notesData: any = [];
  stepStatusDetail: any = [];
  createNoteForm: FormGroup = this.fb.group({
    noteid: [null],
    note: ['', Validators.required],
    tempFlag: ['false', Validators.required],
    searchParam: ['']
  });
  createNoticeNoteForm: FormGroup = this.fb.group({
    id: [null],
    Note: ['', Validators.required]
  });
  createDocumentForm: FormGroup = this.fb.group({
    documentFile: ["", Validators.required],
    letter: ["", Validators.required],
  });
  fileForm: FormGroup = this.fb.group({
    fileNumber: ['', Validators.required],
    fileSubject: ['', Validators.required],
    createdDate: ['', Validators.required],
    filePriority: ['', Validators.required],
    fileSection: ['', Validators.required],
    fileDescription: ['', Validators.required]
  });
  viewDocument = false;
  isVisible: boolean;
  isVisible1: boolean;
  isOkLoading: false;
  checked = false;
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
  rulesList: any;
  lobView = {
    bac: true,
    customLobDate: true,
    lob: true,
    lobDates: [],
    ministerConveniencePending: false
  };

  latestNote: any = [];
  processRoles: any = [];
  forwardAssigneeGroup: any;
  forwardAssignee: any;
  showDetails = false;
  isFileEdit = true;
  ministerConvenience = '';
  searchParam = [''];
  skip = false;
  showSkipModal = false;
  reason = '';
  isEditPrio: boolean;
  priority;
  departmentOrSection: string = "S";
  selectedDepartmentORSection: any = null;
  selectedDepartmentORSectionPH: string = "Select Section";
  deparmentOrSectionList: any = [];
  selectedUser: any = null;
  userList: any = [];
  forwardOrReturnShow: boolean = false;
  designationList: any[];
  bulletinEditMode: any = false;
  bulletinContent: any = null;
  tempBulletinContent: any = null;
  previewContent: any = null;
  showBulletinPreview = false;
  currentUser: any = null;
  cascaderValues: string[] | null = null;
  sectionList: any = [];
  options = [
    {
      value: 0,
      label: "Section",
      children: [],
    },
    {
      value: 1,
      label: "SectiDepartmenton",
      children: [],
    },
  ];

  showModal(): void {
    this.isVisible = true;
  }

  handleCancel(): void {
    this.isVisible = false;
    this.viewDocument = false;
    this.showFileDetails = false;
  }
  newTab(): void {
    this.tabs.push('New Tab');
  }
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private user: AuthService,
    private notify: NotificationCustomService,
    private file: FileService,
    private fb: FormBuilder,
    private service: NoticeTemplateService,
    private process: NoticeProcessService,
    public notice: NoticeService
  ) {
    this.currentUser = this.user.getCurrentUser();
    const id = this.route.snapshot.params.id;
    if (id) {
      this.currentUserID = this.user.getCurrentUser().userId;
      this.getFileByFileId(id);
      this.getAllNotes(id);
      // this.file.getAllNotes(id).subscribe(Response => 
      //   if (Response) {
      // this.notesList = Response;
      // console.log(this.notesList);
      //   }
      // });
      // const tempNote: any = this.notesList.filter(item => item.temporary === true);
      // if (tempNote.length > 0) {
      //   this.hideNormal = false;
      // }
      this.fileId = id;
    }
  }
  ngOnInit() {
    this.notice.getNoticePermissions(this.user.getCurrentUser().userId);
    this.getUserByUserType();
    // this.createFileLogs();
  }
  
  getFileByFileId(id) {
    const userId = this.user.getCurrentUser().userId;
    this.file.getFileById(id, userId).subscribe(Response => {
      this.fileDetails = Response;
      if (this.fileDetails.fileResponse.subtype === 'MISCELLANEOUS_BUSINESS_FILE') {
        this.file.getDesignation().subscribe((res) => {
          this.designationList = res;
          // this.PopulateSectionOrDepartmenttSelect();
        });
        this.file.getAllSections().subscribe((res) => {
          this.sectionList = res;
          this.options[0].children = res.map((r) => {
            return {
              value: r.klaSectionId,
              label: r.klaSectionName,
              children: [],
            };
          });
        });
      }
      this.getWorkFlowTrack(Response.fileResponse.workflowId);
      this.loadFileButtons(Response.fileResponse.status);
      this.notesList = Response.fileResponse.notes;
      this.userDetails = Response.fileResponse.user;
      this.roleDetails = Response.fileResponse.user.roles;
      this.logDetails = Response.fileResponse.logs;
      this.noticeDetails = Response.notices;
      if (this.noticeDetails && this.noticeDetails.length > 0) {
        this.noticeId = this.noticeDetails[0].notice.noticeId;
      }
      this.setLatestVersion(0);
    });
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
    this.file.getAllNotes(id).subscribe(Response => {
      if (Response) {
        this.notesList = Response;
        this.latest = this.notesList[this.notesList.length - 1];
        // this.temporary = Response.temporary;
        const tempNote: any = this.notesList.filter(item => item.temporary === true);
        if (tempNote.length > 0) {
          this.hideNormal = false;
        }
      }
    });
  }
  getAllLogs(id) {
    this.file.getAllFileLogs(id).subscribe(Response => {
      if (Response) {
        this.logDetails = Response;
      }
    });
  }
  getAllDocuments(id) {
    this.file.getDocuments(id).subscribe(Response => {
      if (Response) {
        this.docDetails = Response;
      }
    });
  }
  submitFile() {
    this.getAllNotes(this.fileId);
    let latestNote: [] = this.notesList.pop();
    if (latestNote && latestNote['userId'] === this.currentUserID) {
      const body = {
        fromGroup: this.user.getCurrentUser().authorities[0]
      };
      this.file.forwardFile(this.fileId, body).subscribe((Response) => {
        if (Response) {
          this.notify.showSuccess('Success', 'file Submitted successfully');
          latestNote = [];
          this.getAllNotes(this.fileId);
          setTimeout(() => {
            this.router.navigate(['../../notice/ab/list'], {
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

  approveFile() {
    this.isVisibleApprovalForm = false;
    this.getAllNotes(this.fileId);
    let latestNote: [] = this.notesList.pop();
    const check = this.approvalForm.value.checked;
    let date = this.approvalForm.value.date;
    if (check) {
      date = null;
    }
    const body = {
      fileId: this.fileId,
      userId: this.user.getCurrentUser().userId,
      lobDate: date,
      forwardToBac: check
    };
    this.file.approveFile(body).subscribe((Response) => {
      if (Response) {
        latestNote = [];
        this.getAllNotes(this.fileId);
        if (this.approvalForm.value.checked) {
          this.notify.showSuccess('Success', 'File forwarded to BAC successfully');
          const tex = 'Forwarded To BAC';
          this.createNoteForm.controls.note.setValue(tex);
          const formValue = this.createNoteForm.value;
          const data = {
            note: formValue.note,
            noteId: formValue.noteid,
            temporary: formValue.tempFlag,
            referenceBusiness: [1],
            referenceRules: [2, 2],
            userId: this.user.getCurrentUser().userId
          };
          this.file.createNote(this.fileId, data).subscribe(Res => {
            if (Res) {
              // this.createNoteForm.controls.tempFlag.setValue(false);
              this.notify.showSuccess('Success', 'Note Saved Successfully');
              this.getFileByFileId(this.fileId);
              this.getAllNotes(this.fileId);
              this.getAllLogs(this.fileId);
              this.createNoteForm.reset();
            }
          });
          // this.createNote();
          this.getAllNotes(this.fileId);
          setTimeout(() => {
            this.router.navigate(['../../notice/ab/list'], {
                relativeTo: this.route.parent,
              });
            }, 1500);
        } else {
          const Date = body.lobDate;
          const lobdate = Date.getFullYear() + '-' + ('0' + (Date.getMonth() + 1)).slice(-2) + '-' + ('0' + Date.getDate()).slice(-2);
          const tex = `File approved with scheduled date - ${lobdate}`;
          this.createNoteForm.controls.note.setValue(tex);
          const formValue = this.createNoteForm.value;
          const data = {
            note: formValue.note,
            noteId: formValue.noteid,
            temporary: formValue.tempFlag,
            referenceBusiness: [1],
            referenceRules: [2, 2],
            userId: this.user.getCurrentUser().userId
          };
          this.file.createNote(this.fileId, data).subscribe(Res => {
            if (Res) {
              this.notify.showSuccess('Success', 'Note Saved Successfully');
              // this.createNoteForm.controls.tempFlag.setValue(false);
              this.getFileByFileId(this.fileId);
              this.getAllNotes(this.fileId);
              this.getAllLogs(this.fileId);
              this.createNoteForm.reset();
            }
          });
          this.notify.showSuccess('Success', 'file approved successfully');
          setTimeout(() => {
            this.router.navigate(['../../notice/ab/list'], {
                relativeTo: this.route.parent,
              });
            }, 1500);
        }
      }
    });
  }
  // disallowFile() {
  //   this.file.disallowFile(this.fileId).subscribe((Response) => {
  //     console.log(Response);
  //     if (Response) {
  //       const tex = "Disallowed";
  //       this.createNoteForm.controls['note'].setValue(tex);
  //       this.createNote();
  //       this.getAllNotes(this.fileId);
  //       this.notify.showSuccess('Success', 'file disallowed successfully');
  //       setTimeout(() => {
  //       this.router.navigate(['../../notice/ab/list'], {
  //         relativeTo: this.route.parent,
  //       });
  //     }, 1500);
  //   }
  //   });
  // }
  createDocument() {
    const body = {};
    this.file.creatFileDocument(this.fileId, body).subscribe(Response => {
      this.notify.showSuccess('Success', 'filedocument created successfully');
    }, error => {
      console.log(error);
    });
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


  // disallowFile() {
  //   this.file.disallowFile(this.fileId).subscribe((Response) => {
  //     console.log(Response);
  //     if (Response) {
  //       const tex = "Disallowed";
  //       this.createNoteForm.controls['note'].setValue(tex);
  //       this.createNote();
  //       this.getAllNotes(this.fileId);
  //       this.notify.showSuccess('Success', 'file disallowed successfully');
  //       setTimeout(() => {
  //       this.router.navigate(['../../notice/ab/list'], {
  //         relativeTo: this.route.parent,
  //       });
  //     }, 1500);
  //   }
  //   });
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
      let latestNote: [] = this.notesList.pop();
      if (tempNote.length < 1 && !(latestNote && latestNote['userId'] === this.currentUserID)) {
        this.file.createNote(this.fileId, data).subscribe((Response) => {
          if (Response) {
            this.createNoteForm.controls.tempFlag.setValue(false);
            this.notify.showSuccess('Success', 'Note Saved Successfully');
            this.getAllNotes(this.fileId);
            this.getAllLogs(this.fileId);
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
      if (latestNote && latestNote['userId'] === this.currentUserID) {
        this.notify.showWarning('Warning!', 'Only One Note can be added');
        this.getAllNotes(this.fileId);
        this.createNoteForm.reset();
      }
      if (tempNote.length > 1) {
        this.notify.showWarning('Warning!', 'Cannot Add Morethan One Yellow Note..!');
      };
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
    this.file.updateNote(this.fileId, data).subscribe((Response) => {
      if (Response) {
        this.editMode = false;
        this.notify.showSuccess('Success', 'Note Updated successfully');
        this.getAllNotes(this.fileId);
        this.getAllLogs(this.fileId);
        this.createNoteForm.reset();
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
    this.file.deleteNoteById(body).subscribe(Res => {
      this.notify.showSuccess('Success', 'Note Deleted successfully');
      this.notes = Res;
      this.getAllNotes(this.fileId);
      this.getAllLogs(this.fileId);
      const tempNote: any = this.notesList.filter(item => item.temporary === true
      );
      if (tempNote.length > 0) {
        this.hideNormal = false;
      } else { this.hideNormal = true; }
    });
  }
  cancel() {
  }

  returnFile() {
    const body = {
      fromGroup: this.user.getCurrentUser().authorities[0]
    };
    this.getAllNotes(this.fileId);
    let latestNote: [] = this.notesList.pop();
    if (latestNote && latestNote['userId'] === this.currentUserID) {
      this.file.returnFile(this.fileId, body).subscribe(Response => {
        this.notify.showSuccess('Success', 'File Returned successfully');
        latestNote = [];
        this.getAllNotes(this.fileId);
        setTimeout(() => {
          this.router.navigate(['../../notice/ab/list'], {
            relativeTo: this.route.parent,
          });
        }, 1500);
      }, error => {
        console.log(error);
      });
    } else {
      this.notify.showWarning('Warning', 'Add Note!');
      this.getAllNotes(this.fileId);
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
    this.versionData = versions[event];
  }
  editNote(data) {
    this.editMode = true;
    if (data.userId === this.currentUserID) {
      this.createNoteForm.patchValue({
        noteid: data.noteId,
        note: data.note,
        tempFlag: data.temporary
      });
    }
  }
  // tslint:disable-next-line: adjacent-overload-signatures
  getAllNote(noticeId) {
    if (noticeId) {
      this.service.getNoteData(noticeId).subscribe((Response) => {
        if (Response) {
          this.notesData = [];
          this.notesData = Response;
          // this.noticeDetails.notice.numberOfNotes = this.notesList.length;
        }
      });
    }
  }

  onApproveButtonClick() {
    if (this.noticeId) {
      this.file.preFileApprovalCheck(this.noticeId).subscribe(data => {
        this.lobView = data;
        this.isVisibleApprovalForm = true;
      });
    }
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
    const date = current.getFullYear() + '-' + ('0' + (current.getMonth() + 1)).slice(-2) + '-' + ('0' + current.getDate()).slice(-2);
    // console.log(this.lobView);
    if (this.lobView.customLobDate) {
      // tslint:disable-next-line: triple-equals
      return !(this.lobView.lobDates.find(x => x == date));
    } else {
      return false;
    }
  }

  getWorkFlowTrack(workFlowId) {
    this.process.checkWorkFlowStatus(workFlowId).subscribe((Response) => {
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
    this.service.getallrules().subscribe(Response => {
      if (Response) {
        this.allRules = Response;
        this.rulesList = this.allRules;
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
    if (ruleApplyed && ruleApplyed.length > 0) {
      const ruleCode = ruleApplyed.map((x) => x.code);
      const ruleData = ruleApplyed.map((x) => x.englishDescription);
      const ruleId = ruleApplyed[0].id;
      const noteData = this.createNoteForm.value.note;
      this.selectedTags = [];
      this.createNoteForm.patchValue({ note: `${this.currentRuleStatement} ${ruleCode} ${ruleData} ` });
      this.selectedTags.push(`${this.currentRuleStatement} ${ruleCode}`);
      if (this.disallowStatus) {
        this.createNote();
        this.disallow(ruleId);
      }
      this.cancelRuleSelection();
      this.ShowRules = false;
    } else {
      this.notify.showWarning('Warning!', 'Please select a rule!');
    }
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
  loadFileButtons(fileStatus) {
    if (this.notice.doIHaveAnAccess('FILE', 'APPROVE') && fileStatus === 'SUBMITTED') {
      this.fileButtons.Approve = true;
    }
    if (this.notice.doIHaveAnAccess('FILE', 'DISALLOW') && fileStatus === 'SUBMITTED') {
      this.fileButtons.Disallow = true;
    }
    if (this.notice.doIHaveAnAccess('FILE', 'RETURN') && fileStatus === 'SUBMITTED') {
      this.fileButtons.Return = true;
    }
    if (this.notice.doIHaveAnAccess('FILE', 'SUBMIT') && fileStatus === 'SUBMITTED') {
      this.fileButtons.Submit = true;
    }
    if (this.notice.doIHaveAnAccess('NOTICE_EDIT', 'READ') && fileStatus === 'SUBMITTED') {
      this.fileButtons.noticeEdit = true;
    }
    if (this.notice.doIHaveAnAccess('NOTE', 'TEMPORARY') && fileStatus === 'SUBMITTED') {
      this.NoticeNoteFlag = true;
    } else if (this.notice.doIHaveAnAccess('NOTE', 'PERMANENT') && fileStatus === 'SUBMITTED') {
      this.NoticeNoteFlag = false;
    }
    if (fileStatus === 'SUBMITTED') {
      this.fileButtons.Note = true;
    }
    if (this.notice.doIHaveAnAccess('PULL_BUTTON', 'READ')) {
      this.pullButton = true;
    }
  }
  goToList() {
    this.router.navigate(['../../notice/ab/list'], {
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
    return;
  }

  convertTONormal(Ntd) {
    const body = {
      fileId: this.fileId,
      noteId: Ntd,
      userId: this.user.getCurrentUser().userId
    };
    this.file.convertTONormal(body).subscribe((Response) => {
      if (Response) {
        this.getAllNotes(this.fileId);
        this.getAllLogs(this.fileId);
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
      let latestNote = this.notesData.pop();
      if (!(latestNote && latestNote['ownerId'] === this.currentUserID)) {
        this.service.saveNote(data).subscribe((Response) => {
          if (Response) {
            this.notify.showSuccess('Success', 'Note saved successfully');
            this.getAllNote(noticeid);
            this.createNoticeNoteForm.reset();
          }
        });
      }
      if (latestNote && latestNote['ownerId'] === this.currentUserID) {
        this.notify.showWarning('Warning!', 'cannot add more than one note');
        this.getAllNote(noticeid);
      }
    } else { this.notify.showWarning('Warning!', 'Add note..!'); }
  }
  disallowFile() {
    this.getAllRules();
    this.disallowStatus = true;
    this.ShowRules = true;
  }
  disallow(ruleId) {
    if (!ruleId) {
      return;
    }
    const body  = {
      disallowRuleId: Number(ruleId)
    };
    this.notice.disallowFileNotices(this.fileId, body).subscribe(x => {
      this.notify.showSuccess('Success', 'file disallowed successfully');
      // this.getAllNotes(this.fileId);
      this.getFileByFileId(this.fileId);
      setTimeout(() => {
        this.router.navigate(['../../notice/ab/list'], {
            relativeTo: this.route.parent,
          });
        }, 1500);
    });
  }
  showModel(): void {
    this.isVisible1 = true;
  }
  handleCancel1(): void {
    this.isVisible1 = false;
  }
  getUserByUserType() {
    this.file.getUsersBasedOnUserType().subscribe((Response) => {
      if (Response) {
        this.getUserData = Response;
      }
    });
  }
  assignFile() {
    const body = {
      fromGroup: this.user.getCurrentUser().authorities[0],
      assignee: this.userDataForm.value.userId
    };
    this.file.assignFile(this.fileId, body).subscribe((Response) => {
      if (Response) {
      }
    });
  }
  getWorkFlowRole(workflowId, fileId) {
    this.file.getWorkFlowRole(workflowId, fileId).subscribe((Response) => {
      if (Response) {
        const data = Response;
        if (data && data.length > 0) {
          const currentUser = data.find(x => x.userId == this.user.getCurrentUser().userId);
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
  getCurrentAction() {
    let value = 'Forward';
    const actionRowData = this.workFlowActionUsers.find(x => `${x.userId}-${x.actionRow}-${x.actionGroup}` == this.userId);
    if (actionRowData) {
      if (actionRowData.actionRow > this.currentUserActionRow.actionRow) {
        value = 'Forward';
      } else {
        value = 'Return';
      }
      if (actionRowData.actionRow > this.currentUserActionRow.actionRow + 1) {
        this.skip = true;
      } else {
        this.skip = false;
      }
    }
    return value;
  }
  forwardFile(fileId) {
    this.getAllNotes(this.fileId);
    let latestNote: [] = this.notesList.pop();
    const details = this.userId.split('-');
    if (details && details.length > 0) {
      if (latestNote && latestNote['userId'] === this.currentUserID) {
        if (this.skip) {
          this.showSkipModal = true;
        } else {
        const body = {
          action: 'FORWARD',
          groupId: details[2],
          fromGroup: this.user.getCurrentUser().userName,
          assignee: details[0],
          fromGroupId: this.user.getCurrentUser().userName,
          remark: this.reason,
          skipped: this.showSkipModal
        };
        this.file.forwardFile(this.fileId, body).subscribe((Response) => {
          if (Response) {
            this.showSkipModal = false;
            this.notify.showSuccess('Success', 'File Forwarded successfully');
            this.getFileByFileId(this.fileId);
            latestNote = [];
            this.getAllNotes(this.fileId);
            setTimeout(() => {
              this.router.navigate(['../../notice/ab/list'], {
                  relativeTo: this.route.parent,
                });
              }, 1500);
            }
        });
      }
      } else {
        this.notify.showWarning('Warning', 'Add Note!');
        this.getAllNotes(this.fileId);
      }
    }
  }
  showFileDetail() {
    this.showDetails = true;
  }
  editFile(fileResponse) {
    this.isFileEdit = false;
    this.fileForm.setValue({
      fileNumber: fileResponse.fileNumber,
      fileSubject: fileResponse.subject,
      createdDate: fileResponse.createdDate,
      filePriority: fileResponse.priority,
      fileSection: fileResponse.user.details.firstName,
      fileDescription: fileResponse.description
    });
  }
  editFilePriority() {
    this.isEditPrio = true;
  }

  updateFile() {
    const fileFormValue = this.fileForm.value;
    const fileData = {
      assemblyId: this.fileDetails.fileResponse.assemblyId,
      userId: this.user.getCurrentUser().userId,
      description: fileFormValue.fileDescription,
      priority: fileFormValue.filePriority,
      sectionId: fileFormValue.fileSection,
      sessionId: this.fileDetails.fileResponse.sessionId,
      subject: fileFormValue.fileSubject
    };
    this.file.updateFile(this.fileDetails.fileResponse.fileId, fileData).subscribe((Response) => {
      if (Response) {
        this.notify.showSuccess('Success', 'File Updated Successfully');
      }
    });
    this.showDetails = false;
    this.isFileEdit = true;
  }
  updateFilePriority() {
    const fileResponse = this.fileDetails.fileResponse;
    const body = {
      assemblyId: fileResponse.assemblyId,
      assigedTo: fileResponse.assigedTo,
      createdDate: fileResponse.createdDate,
      currentNumber: fileResponse.currentNumber,
      description: fileResponse.description,
      fileId: fileResponse.fileId,
      fileNumber: fileResponse.fileNumber,
      priority: this.priority,
      sectionId: fileResponse.sectionId,
      sessionId: fileResponse.sessionId,
      status: fileResponse.status,
      subject: fileResponse.subject,
      subType: fileResponse.subtype,
      type: fileResponse.type,
      userId: fileResponse.user.userId,
      // workflowEngineCode: string: '',
      workflowId: fileResponse.workflowId,
    };
    this.isEditPrio = false;
    this.file.updateFile(this.fileId, body)
      .subscribe((Res) => {
        this.getFileByFileId(this.fileId);
      });
  }
  onCancel() {
    this.isFileEdit = true;
    this.showDetails = false;
  }

  _cancel() {
    this.isEditPrio = false;
  }

  pullFile() {
    this.getPullGroup();
    const current = this.stepStatusDetail[this.stepStatusDetail.length - 1];
    // const noteBody = {
    //   fileId: this.fileId,
    //   note: 'Pulled to ' + this.user.getCurrentUser().userName,
    //   referenceBusiness: [0],
    //   referenceRules: [0],
    //   temporary: false,
    //   userId: current.assignee,
    //   fromGroupId: current.owner
    // };
    // this.file.createNote(this.fileId
    //   , noteBody).subscribe((Res) => {
    //     this.notes = Res;
    //     this.showPullModal = false;
    //     this.latestNote = this.notes[this.notes.length - 1];
    //     this.getAllLogs(this.fileId);
    //   });
    const fromRow = this.workFlowActionUsers.find(user => Number(user.userId) === Number(this.pullGroup));
    const groupRow = this.currentUserActionRow;
    const body = {
      // processInstanceId: this.fileDetails.fileResponse.workflowId,
      action: 'FORWARD',
      groupId: this.currentUserActionRow.actionGroup,
      fromGroup: this.user.getCurrentUser().fullName,
      assignee: this.currentUserActionRow.userId,
      fromGroupId: current.owner,
      remark: this.pullRemark
    };
    if (fromRow && groupRow && (groupRow.actionRow > fromRow.actionRow)) {
      this.file.pullFile(body, this.fileId).subscribe((Res) => {
        this.notify.showSuccess(
          "Success",
          "File pulled Successfully!"
        );
        this.showPullModal = false;
        this.getFileByFileId(this.fileId);
      });
    } else {
      this.notify.showWarning("Warning", "You cannot pull from higher authority!");
    }
  }

  pullOrNot() {
    this.getPullGroup();
    const fromRow = this.workFlowActionUsers.find(user => Number(user.userId) === Number(this.pullGroup));
    const groupRow = this.currentUserActionRow;
    if (fromRow && groupRow && (groupRow.actionRow - fromRow.actionRow < 3 && groupRow.actionRow - fromRow.actionRow > 0)) {
      this.canPull = true;
    } else {
      this.canPull = false;
    }
  }

  getPullGroup() {
    const current = this.stepStatusDetail[this.stepStatusDetail.length - 1];
    if (current) {
      this.pullGroup = current.assignee;
    }
  }
  sendMinisterConvenience() {
    const body = {
      fileId: this.fileId,
      userId: this.user.getCurrentUser().userId
    };
    this.file.forwardConvenience(body).subscribe(data => {
      this.notify.showSuccess('Success', 'Convenience sent to the minister successfully');
    });
  }
  viewMinisterConvenience(noticeId) {
    if (noticeId) {
      this.file.listConveniencesByNoticeId(noticeId).subscribe(data => {
        this.ministerConvenience = data;
      });
    }
  }
  isSpeaker() {
    return this.user.getCurrentUser().authorities.includes('speaker');
  }

  viewDuplicates(notice) {
    if (notice.tags && notice.tags.length > 0) {
      let body = {
        tags: notice.tags,
        assemblyId: notice.assemblyId,
        sessionId: notice.sessionId,
      };
      this.process.checkQuesstionDuplication(body).subscribe((res: any) => {
        if (res) {
          this.questionDuplicateDetails = res;
        } else {
          this.questionDuplicateDetails = null;
        }
      });
    }
    else {
      this.questionDuplicateDetails = null;
    }

  }
  cancelPull() {
    this.showPullModal = false;
  }
  showPullpopup() {
    this.showPullModal = true;
  }
  showFilePopup() {
    this.showFileDetails = true;
  }
  searchRules() {
    let  searchParam = this.createNoteForm.value.searchParam;
    this.rulesList = this.allRules.filter((element) =>
                      element.code.includes(searchParam) || element.englishDescription &&
                      element.englishDescription.toLowerCase().includes(searchParam.toLowerCase()));
  }


  cancelSkip() {
    this.showSkipModal = false;
    this.reason = '';
  }

  // PopulateSectionOrDepartmenttSelect() {
  //   this.forwardOrReturnShow = false;
  //   this.selectedDepartmentORSection = false;
  //   this.selectedUser = false;
  //   this.userList = [];
  //   if (this.departmentOrSection === "S") {
  //     this.file.getAllSections().subscribe((res) => {
  //       this.deparmentOrSectionList = res;
  //       this.selectedDepartmentORSection = this.user.getCurrentUser().correspondenceCode.id.toString();
  //       this.PopulateUserWithDesignationSelect(this.selectedDepartmentORSection);
  //     });
  //   } else {
  //     this.deparmentOrSectionList = [];
  //   }
  // }

  // PopulateUserWithDesignationSelect(Id) {
  //   this.forwardOrReturnShow = false;
  //   this.selectedUser = false;
  //   this.selectedDepartmentORSection = Id;
  //   this.userList = [];
  //   if (this.designationList && this.designationList.length > 0) {
  //     this.designationList.forEach((element) => {
  //       let data = {
  //         klaDesignatoinId: element.klaDesignationId,
  //         klaSectionId: Id,
  //       };
  //       this.file.getAllNonMemberUsers(data).subscribe((res) => {
  //         res.map((item) => {
  //           item.userId !== this.currentUserID
  //             ? this.userList.push(item)
  //             : "";
  //         });
  //       });
  //     });
  //   }
  // }

  ForwardOrReturnEnable(Id) {
    this.selectedUser = Id;
    this.forwardOrReturnShow = true;
  }

  showAttachment(url) {
    window.open(url, '_blank');
  }

  editBulletin(bulletinContent) {
    this.bulletinEditMode = true;
    this.tempBulletinContent = bulletinContent;
  }

  cancelEditBulletin(noticeId) {
    this.bulletinEditMode = false;
    this.bulletinContent = this.tempBulletinContent;
    this.tempBulletinContent = null;
  }

  updateBulletin(id) {
    const body = {
      noticeId: id,
      bulletinContent: this.bulletinContent
    };
    this.file.editBulletinContent(body).subscribe((res: any) => {
      this.getFileByFileId(this.fileId);
      this.bulletinEditMode = false;
      this.bulletinContent = null;
      this.tempBulletinContent = null;
      this.notify.showSuccess('Success', 'Bulletin Updated Successfully');
    });
  }

  setBulletinData(bulletinContent, notice) {
    if (notice && (notice.status === 'SUBMITTED' || notice.status === 'PUBLISHED')) {
      this.bulletinContent = bulletinContent;
    } else {
      this.file.getBulletinPreview(notice.noticeId).subscribe((res: any) => {
        this.bulletinContent = res;
      });
    }
  }

  showPreview(id, bulletin) {
    const body = {
      content: bulletin,
      noticeId: id
    };
    this.file.postBulletinPreview(body).subscribe((res: any) => {
      this.previewContent = res;
      this.showBulletinPreview = true;
    });
  }

  cancelPreview() {
    this.previewContent = null;
    this.showBulletinPreview = false;
  }

  publishBulletin(noticeId) {
    this.file.publishBulletin(noticeId).subscribe((res: any) => {
      this.getFileByFileId(this.fileId);
      this.notify.showSuccess('Success', 'Bulletin Published Successfully');
    });
  }

   /** load data async execute by `nzLoadData` method (Cascader)*/
   loadData = (node: NzCascaderOption, index: number): PromiseLike<void> => {
    this.selectedUser = null;
    this.forwardOrReturnShow = false;
    this.userList = [];
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
            value: m.klaDesignationId,
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

  onChanges(values: string[]): void {
    this.forwardOrReturnShow = false;
    this.selectedUser = null;
    this.userList = [];
    if (values[2]) {
      let data = {
        klaDesignatoinId: values[2],
        klaSectionId: values[1].toString(),
      };
      this.file.getAllNonMemberUsers(data).subscribe((res) => {
        res.map((item) => {
          item.userId !== this.currentUser.userId
            ? this.userList.push({
                value: item.userId,
                label: item.details.fullName,
              })
            : "";
        });
      });
    }
  }

  viewFile(fileId, fileType) {
    this.router.navigate([fileType.viewPath, fileId]);
  }
}
