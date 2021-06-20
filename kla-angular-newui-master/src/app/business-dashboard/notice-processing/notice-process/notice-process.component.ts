import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef, SimpleChange } from '@angular/core';
import { NoticeTemplateService } from '../shared/services/notice-template.service';
import { DynamicFormComponent } from '../shared/components/dynamic-form/dynamic-form.component';
import { FieldConfig } from '../shared/field.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationCustomService } from 'src/app/shared/services/notification.service';
import { NoticeProcessService } from '../shared/services/notice-process.service';
import { AuthService } from 'src/app/auth/shared/services/auth.service';
import { NoticeService } from '../shared/services/notice.service';
import { UserManagementService } from '../../user-management/shared/services/user-management.service';
import { FileService } from '../shared/services/file.service';

@Component({
  selector: 'app-notice-process',
  templateUrl: './notice-process.component.html',
  styleUrls: ['./notice-process.component.scss'],
})
export class NoticeProcessComponent implements OnInit {
  assemblyList = [];
  sessionList = [];
  totalChanges = 0;
  today = new Date();
  isFileFlow = false;
  showMinisterConvenience = false;
  disableConvenienceEntry = false;
  ministerConvenience = new FormControl(null, Validators.required);
  ministerConvenienceMessage = [];
  workFlowId = 0;
  mlaList: any = [];
  fileList = [];
  allFileList = [];
  approvalForm: FormGroup;
  isVisibleApprovalForm = false;
  advancedFiltersFlag = true;
  noticeForm = this.fb.group({
    noticeId: [0],
    title: [' ', Validators.required],
    noticeNumber: ['', Validators.required],
    templateId: [0, Validators.required],
    description: ['', Validators.required],
    noticeData: [''],
    assemblyId: [0, Validators.required],
    sessionId: [0, Validators.required],
    userID: [this.user.getCurrentUser().userId, Validators.required],
    primaryMemberId: [0, Validators.required],
    values: [[]],
  });
  notificationForm: FormGroup = this.fb.group({
    mlaId: [1, Validators.required],
  });
  noticeId = 0;
  assemblyId = 1;
  sessionId = 4;
  userRoleId;
  processRoles = [];
  currentUserID;
  canEdit: boolean;
  isChecked = true;
  isVisible: boolean;
  isVisibleAttachFiles: boolean = false;
  isBac = false;
  isDateList = false;
  dateList: any = [];
  TypeSelection = new FormControl('1');
  tags = "";
  showAddTag = false;
  @ViewChild("tagInput", { static: false }) inputElement: ElementRef;
  showConveniencePending: boolean;
  templateCode: any;
  constructor(
    private service: NoticeTemplateService,
    private process: NoticeProcessService,
    public notice: NoticeService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private user: AuthService,
    private file: FileService,
    private notify: NotificationCustomService,
    private usermanagement: UserManagementService
  ) {
    const id = this.route.snapshot.params.id;
    const encodedPath = this.route.snapshot.params.encodedUrl;
    if (id) {
      this.currentUserID = this.user.getCurrentUser().userId;
      this.notice.getNoticePermissions(this.currentUserID);
      this.getNoticebyNoticeId(id);
      this.getAllNotes(id);
      this.getWorkFlowRole(id, this.currentUserID);
      this.noticeId = id;
      this.getMinisterConvenience();
      if (this.isSpeaker()) {
        this.viewMinisterConvenience(id);
      }
    }
    if (encodedPath) {
      this.returnUrl = atob(encodedPath);
      if (this.returnUrl.includes('minister')) {
        this.showMinisterConvenience = true;
      }
    }
  }
  @ViewChild(DynamicFormComponent, { static: false })
  form: DynamicFormComponent = new DynamicFormComponent(this.fb);
  popupvisible = false;
  templateText = '';
  withdraw: any = [];
  current = 1;
  stepStatus = [];
  labels = ['Notice Subject', 'Notice Type', 'Starting Point', 'Creation Date'];
  visible = false;
  notesList: [];
  notesCard = [];
  roleNameList: any;
  noticeDetails = {
    versions: {},
    versionOptions: [],
    notice: {
      title: '',
      noticeNumber: '',
      currentAssignee: true,
      description: '',
      assemblyId: 0,
      sessionId: 0,
      values: null,
      noticeData: null,
      templateId: 1,
      templateName: '',
      numberOfNotes: 0,
      noticeId: 0,
      primaryMemberId: 0,
      formComponents: [],
      version: 1,
      userID: 0,
      primaryMember: { userId: 1, userName: '', details: { fullName: '' } },
      createdDate: '',
      status: '',
      fileId: '',
      rule: { code: '', englishDescription: '', id: '', malayalamDescription: '' },
      tags: null,
      disallowRule: { code: '', englishDescription: '', id: '', malayalamDescription: '' },
      attachments: [],
      workflowCode: ''
    },
  };
  statusdetail: any = [];
  statusflag;
  withdrawflag = false;
  viewContent = ' ';
  OriginalContent = ' ';
  data = [];
  noteForm: FormGroup = this.fb.group({
    id: [null],
    note: ['', Validators.required],
  });
  createFileForm: FormGroup = this.fb.group({
    assemblyId: [null, Validators.required],
    sessionId: [null, Validators.required],
    currentNumber: ['', Validators.required],
    backFileReference: [''],
    subject: ["", Validators.required],
    type: ["NOTICE", Validators.required],
    priority: ["NORMAL", Validators.required],
    description: ["", Validators.required],
    userId: [this.user.getCurrentUser().userId, Validators.required]
  });
  attachFileForm: FormGroup = this.fb.group({
    fileId: ["", Validators.required],
    fileNo: [""],
    subject: [""],
    searchParamForFiles: [""]
  });
  FinalcomponentArray: FieldConfig[] = [];
  saveList: any;
  del: any;
  id: any;
  noticeButtons: any = this.getNoticeButtons();
  hideForm = false;
  tempFlag = false;
  editFlag = false;
  noticeid: any = [];
  quickOptions = [
    { label: 'Can be admitted', disallowStatus: false },
    { label: 'Can be disallowed as per rule', disallowStatus: true },
    { label: 'Not allowed as per rule', disallowStatus: true },
  ];
  selectedTags = [];
  currentRuleStatement = '';
  ShowRules = false;
  allRules: any = [];
  latestNote: any = [];
  isEdit = false;
  disallowStatus = false;
  returnUrl = '../../../ab/list';
  fileid = 0;
  arisingFileNumber = 0;
  getArisingFileNumber() {
    this.file.getArisingFileNumber().subscribe(Response => {
      this.arisingFileNumber = Response.body;
    });
  }
  createFile() {
    let fileDetails;
    const data = {
      noticeIds: [this.noticeId],
      fileForm: this.createFileForm.value
    };
    this.file.attachToFile(data).subscribe(Response => {
      fileDetails = Response[0];
      this.file.getFileById(fileDetails.fileId, this.user.getCurrentUser().userId).subscribe( res => {
        this.notify.showSuccess('Success', 'File' + res.fileResponse.fileNumber + 'created successfully');
      });
      this.router.navigate(['/business-dashboard/notice/staff/file', fileDetails.fileId], {
        relativeTo: this.route.parent,
      });
      this.createFileForm.get('backFileReference').reset();
      this.createFileForm.get('subject').reset();
      this.createFileForm.get('description').reset();
      this.createFileForm.get('currentNumber').reset();
      this.arisingFileNumber = 0;
      this.getNoticebyNoticeId(this.noticeId);
      // this.backToList();
    }, error => {
    });
    this.isVisible = false;
  }
  getNoticebyNoticeId(id) {
    this.service.getData(id, this.user.getCurrentUser().userId).subscribe((Response) => {
      if (Response) {
        this.noticeDetails = Response as any;
        this.createFileForm.get('assemblyId').setValue(this.noticeDetails.notice.assemblyId);
        this.createFileForm.get('sessionId').setValue(this.noticeDetails.notice.sessionId);
        if (!Response.notice.tags) {
          this.noticeDetails.notice.tags = [];
        }
        // this.noticeid = Response.notice.noticeId;
        // this.onResubmitClick(this.noticeid);
        this.statusdetail = Response.notice.status;
        this.fileid = Response.notice.fileId;
        this.loadNoticeButtons(Response.notice, Response.notice.primaryMemberId);
        this.getTemplateTexts(Response.notice.templateId).subscribe((res) => {
          this.workFlowId = res.workflowId;
          this.templateText = res.templateData;
          this.templateCode = res.code;
          this.isFileFlow = res.fileFlow;
          const data = Response.notice.formComponents;
          // tslint:disable-next-line: prefer-for-of
          for (let i = 0; i < data.length; i++) {
            if (data[i].type === 'questiontype') {
              const detail = data[i].options.find(
                // tslint:disable-next-line: triple-equals
                (x) => x.id == data[i].value
              );
              data[i].value = detail;
            }
            // tslint:disable-next-line: triple-equals
            if (data[i].type == 'select' || data[i].type == 'aodministerlist' || data[i].type == 'portfoliosubject'
              || data[i].type == 'questionlist' || data[i].type == 'questionanswerdate' || data[i].type == 'sronumber') {
              if (data[i].mode && data[i].mode == 'multiple') {
                data[i].value = data[i].value ? data[i].value.map(Number) : [];
              } else {
                const mladetail = data[i].options.find(
                  (x) => {
                    if (Number(x.id)) {
                      return Number(x.id) === Number(data[i].value);
                    }
                    return x.id == data[i].value;
                  }
                );
                data[i].value = mladetail;
              }
            }
            if (data[i].type === 'date') {
              data[i].value = new Date(data[i].value);
            }
            if (data[i].type === 'aod') {
              data[i].value = new Date(data[i].value);
            }
            if (data[i].type === 'cosdates') {
              data[i].value = new Date(data[i].value);
            }
            if (data[i].type === 'questiondebatedate') {
              data[i].value = new Date(data[i].value);
            }
          }
          this.FinalcomponentArray = [];
          this.FinalcomponentArray = data;
          this.viewContent = Response.notice.noticeData;
          this.OriginalContent = this.viewContent;
        });
        if (Response.notice.fileWorkflowId) {
          this.getWorkFlowTrack(Response.notice.fileWorkflowId);
        } else {
          if (Response.notice.workFlowId) {
            this.getWorkFlowTrack(Response.notice.workFlowId);
          }
        }
      }
    });
  }
  getTemplateTexts(templateId) {
    if (templateId) {
      return this.service.getTemplateById(templateId);
    }
  }
  onAdvancedFilterclick() {
    this.advancedFiltersFlag = false;
  }
  GetRoles(roles) {
    if (roles) {
      return roles.map((x) => x.roleName).join('/');
    } else {
      return '';
    }
  }

  saveNotice() {
    this.totalChanges = 1;
    let formData = {};
    if (this.form) {
      formData = this.form.form.value;
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.FinalcomponentArray.length; i++) {
        if (typeof formData[this.FinalcomponentArray[i].label] === 'object') {
          if (Array.isArray(formData[this.FinalcomponentArray[i].label])) {
            this.FinalcomponentArray[i].inputValue = formData[
              this.FinalcomponentArray[i].label
            ].map(String);
          } else if (
            typeof formData[this.FinalcomponentArray[i].label].getDate === 'function'
          ) {
            const d = new Date(formData[this.FinalcomponentArray[i].label]);
            // const date = `${d.getDate()}/${d.getMonth() +
            //   1}/${d.getFullYear()}`;
            this.FinalcomponentArray[i].inputValue = d;
          } else {
            this.FinalcomponentArray[i].inputValue =
              formData[this.FinalcomponentArray[i].label].id;
          }
        } else {
          this.FinalcomponentArray[i].inputValue =
            formData[this.FinalcomponentArray[i].label];
        }
      }
      const values = this.FinalcomponentArray.map((x) => ({
        inputValue: x.inputValue,
        templateInputId: x.templateInputId,
      }));
      this.noticeForm.get('values').setValue(values);
      this.noticeForm.get('noticeData').setValue(this.viewContent);
      this.noticeForm.get('noticeNumber').setValue('Notice-1122');
      this.noticeForm.patchValue({
        noticeId: this.noticeDetails.notice.noticeId,
        title: this.noticeDetails.notice.title,
        assemblyId: this.noticeDetails.notice.assemblyId,
        sessionId: this.noticeDetails.notice.sessionId,
        primaryMemberId: this.noticeDetails.notice.primaryMemberId,
        templateId: this.noticeDetails.notice.templateId,
      });
      if (true) {
        this.service
          .updateNoticeDetails(this.noticeForm.value)
          .subscribe((Response) => {
            if (Response) {
              this.notify.showSuccess('Success', 'Notice Updated Successfully');
              this.getNoticeVersions(this.noticeDetails.notice.noticeId);
              // this.getNoticebyNoticeId(this.noticeDetails.notice.noticeId);
              // setTimeout(() => {
              //   this.router.navigate([this.returnUrl], {
              //     relativeTo: this.route.parent,
              //   });
              // }, 1500);
            }
          });
      }
    }
  }
  getNoticeVersions(id) {
    this.service.getData(id, this.user.getCurrentUser().userId).subscribe((Response) => {
      if (Response) {
        this.noticeDetails.versions = (Response as any).versions;
        this.noticeDetails.versionOptions = (Response as any).versionOptions;
      }    
    });
  }
  getRoles(roles) {
    return roles.map((x) => x.displayRoleName).join('/');
  }
  CheckChanges() {
    if (this.totalChanges > 1) {
      return 'You have made some unsaved changes.';
    } else {
      return '';
    }
  }

  drawer(): void {
    this.visible = !this.visible;
  }

  ngOnInit() {
    this.setApprovalForm();
    this.getAllMembers();
    this.getAssemblyList();
    this.getSessionList();
  }
  // get notes
  getAllNotes(id) {
    if (id) {
      this.service.getNoteData(id).subscribe((Response) => {
        if (Response) {
          this.notesList = Response;
          this.latestNote = this.notesList[this.notesList.length -1];
          this.noticeDetails.notice.numberOfNotes = this.notesList.length;
        }
      });
    }
  }
  checkUpdatePermission(userId) {
    const currentUser = this.user.getCurrentUser().userId;
    return currentUser === userId;
  }
  saveNote() {
    if (this.noteForm.value.note) {
      const formValue = this.noteForm.value;
      const data = {
        id: formValue.id,
        note: formValue.note,
        ownerId: this.user.getCurrentUser().userId,
        noticeVersion: 1,
        noticeId: this.noticeId,
        temporary: this.tempFlag
      };
      if (data.id > 0) {
        this.service.updateNote(data).subscribe((Response) => {
          if (Response) {
            this.isEdit = false;
            this.notify.showSuccess('Success', 'Note updated successfully');
            this.getAllNotes(this.noticeId);
          }
        });
      } else {
        this.service.saveNote(data).subscribe((Response) => {
          if (Response) {
            this.notify.showSuccess('Success', 'Note saved successfully');
            this.getAllNotes(this.noticeId);
          }
        });
      }
      this.noteForm.reset();
    } else { this.notify.showWarning('Warning!', 'Add note..!'); }
  }
  editNote(item) {
    this.isEdit = true;
    if (item.ownerId === this.currentUserID) {
      this.noteForm.setValue({
        id: item.id,
        note: item.note,
      });
    }
  }
  resetNote() {
    this.noteForm.patchValue({note: ''});
    this.isEdit = false;
  }
  ShowForm(dataFromChild) {
    this.totalChanges++;
    this.viewContent = this.templateText;
    const contentValues = dataFromChild.formValues;
    const labelArray = dataFromChild.fields.map((x) => x.label);
    const ministerData = this.FinalcomponentArray.find(x => x.type === 'aodministerlist');
    if (ministerData) {
      const ministerDataLabel = ministerData.label;
      if (ministerDataLabel && contentValues) {
        if (contentValues[ministerDataLabel]) {
          const ministerId = contentValues[ministerDataLabel].id;
          if (ministerId) {
            this.FinalcomponentArray.forEach((el, i) => {
              if (el.type === 'aod' || el.type === 'portfoliosubject') {
                this.FinalcomponentArray[i].ministerId = ministerId;
              }
            });
          }
        }
      }
    }
    labelArray.forEach((el) => {
      if (contentValues[el]) {
        if (typeof contentValues[el] === 'object') {
          if (Array.isArray(contentValues[el])) {
            const element = dataFromChild.fields.find(
              (element) => element.label == el
            );
            if (element.options) {
              const data = element.options
              .filter((element) => contentValues[el].includes(element.id))
              .map((x) => x.label)
              .toString();
              this.viewContent = this.viewContent.split(el).join(data);
            }
            if (Array.isArray(element.value)) {
              const arrayData: [] = element.value;
              let clauseString = '';
              arrayData.forEach((ele, i) => {
                clauseString = clauseString + '<br><br>' + `Clause ${i + 1}<br>` + ele;
                if (i === arrayData.length - 1) {
                  clauseString = clauseString + '?';
                } else {
                  clauseString = clauseString + ';';
                }
              });
              this.viewContent = this.viewContent.split(el).join(clauseString);
            }
          } else if (typeof contentValues[el].getDate === 'function') {
            const d = new Date(contentValues[el]);
            const date = `${('0' + d.getDate()).slice(-2)}/${
              ('0' + (d.getMonth() + 1)).slice(-2)
              }/${d.getFullYear()}`;
            this.viewContent = this.viewContent.replace(el, date);
          } else {
            // this.viewContent = this.viewContent.replace(
            //   el,
            //   contentValues[el].label
            // );
            this.viewContent = this.viewContent
              .split(el)
              .join(contentValues[el].label);
          }
        } else {
          // this.viewContent = this.viewContent.replace(el, contentValues[el]);
          this.viewContent = this.viewContent.split(el).join(contentValues[el]);
        }
      }
    });
  }
  cancel() {
    //
  }
  deleteNoteById(noticeId) {
    this.service.deleteNoteById(noticeId).subscribe((Response) => {
      if (Response) {
        this.notify.showSuccess('Success', 'Note deleted successfully');
        this.getAllNotes(this.noticeId);
      }
    });
  }

  addQuickOption(checked: boolean, tag: string, index) {
    this.noteForm.patchValue({ note: tag });
  }
  CheckforRules(checked: boolean, tag, index: number) {
    this.selectedTags = [];
    this.currentRuleStatement = tag.label;
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
      }
    });
  }
  cancelRuleSelection() {
    this.ShowRules = false;
    this.selectedTags = [];
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.allRules.length; i++) {
      if (this.allRules[i].checked) {
        this.allRules[i].checked = false;
      }
    }
  }
  applyRule() {
    let ruleApplyed = [];
    ruleApplyed = this.allRules.filter((x) => x.checked === true);
    if (ruleApplyed.length !== 0) {
      const ruleCode = ruleApplyed.map((x) => x.code);
      const ruleData = ruleApplyed.map((x) => x.englishDescription);
      const noteData = this.noteForm.value.note;
      if (ruleApplyed.length > 0) {
        this.noteForm.patchValue({ note: `${this.currentRuleStatement} ${ruleCode} ${ruleData} ` });
        this.selectedTags.push(
          `${this.currentRuleStatement} ${ruleCode}`
        );
      }
      if (this.disallowStatus) {
        this.saveNote();
        this.disallow(ruleCode);
      }
      this.ShowRules = false;
      this.cancelRuleSelection();
    } else { this.notify.showWarning('Warning!', 'Select Rule!'); }
  }


  submitNotice() {
    const body = {
      id: Number(this.noticeId),
    };
    this.process.submitNotice(body).subscribe((Response) => {
      if (Response.workFlowId) {
        this.getWorkFlowTrack(Response.workFlowId);
      }
    });
  }
  admitNotice() {
    const dateStr: Date = this.approvalForm.get('date').value;
    const date = dateStr.getFullYear() + '-' + ('0' + (dateStr.getMonth() + 1)).slice(-2) + '-' + ('0' + dateStr.getDate()).slice(-2);
    const body = {
      noticeId: Number(this.noticeId),
      lobDate: date,
      userId: this.user.getCurrentUser().userId
    };
    this.process.admitNotice(body).subscribe((Response) => {
      if (Response.workFlowId) {
        this.addApprovalNote(dateStr);
        this.notify.showSuccess('Success', 'Notice admitted successfully');
        this.getWorkFlowTrack(Response.workFlowId);
        setTimeout(() => {
          this.router.navigate([this.returnUrl], {
            relativeTo: this.route.parent,
          });
        }, 1500);
        this.noticeDetails.notice.status = Response.status;
        this.noticeButtons.Note = false;
        this.noticeButtons.Forward = false;
        this.noticeButtons.Approve = false;
        this.noticeButtons.Disallow = false;
        this.getAllNotes(this.id);
        this.handleCancelApprovalForm();
      }
    });
  }
  forwardNotice() {
    if (this.isEdit) {
      this.notify.showWarning('Alert', 'Kindly finish editing note to proceed');
      return;
    }
    if (this.userRoleId) {
      this.getAllNotes(this.noticeId);
      const latestNote: any = this.notesList.pop();
      if (latestNote &&
        latestNote.ownerId == this.currentUserID) {
        const body = {
          id: this.noticeId
        };
        this.process
          .forwardNotice(
            body,
            this.userRoleId,
            this.user.getCurrentUser().userId
          )
          .subscribe((Response) => {
            if (Response.workFlowId) {
              this.notify.showSuccess(
                'Success',
                'Notice forwarded successfully'
              );
              this.getWorkFlowTrack(Response.workFlowId);
              setTimeout(() => {
                this.router.navigate([this.returnUrl], {
                  relativeTo: this.route.parent,
                });
              }, 1500);
            }
          });
      } else {
        this.notify.showWarning('Warning!', 'Add Note...!');
        /*if (!this.noticeDetails.notice.numberOfNotes) {
          this.notify.showWarning("Warning!", "Add Note...!");
        }
        else {
          this.notify.showWarning("Warning!", "Versions!");
        }*/
      }
    } else {
      this.notify.showWarning('Warning!', 'Select a Member!');
    }
  }

  withdrawNotice() {
    this.process.withdrawNotice(this.noticeId).subscribe((Response) => {
      if (Response) {
        this.notify.showSuccess('Success', 'Notice withdrawn successfully');
        this.getWorkFlowTrack(Response.workFlowId);
        this.router.navigate(['../../../notice/ab/list', this.returnUrl], {
          relativeTo: this.route.parent,
        });
      }
    });
  }
  disallowNotice() {
    this.getAllRules();
    this.disallowStatus = true;
    this.ShowRules = true;
  }
  disallow(ruleId) {
    this.getAllNotes(this.noticeId);
    const body = {
      noticeId: Number(this.noticeId),
      disallowRuleId: Number(ruleId)
    };
    this.process.disallowNotice(body, this.noticeId).subscribe((Response) => {
      if (Response.workFlowId) {
        this.notify.showSuccess('Success', 'Notice disallowed successfully');
        this.getWorkFlowTrack(Response.workFlowId);
        setTimeout(() => {
          this.router.navigate(['../../../notice/ab/list', this.returnUrl], {
            relativeTo: this.route.parent,
          });
        }, 1500);
        this.noticeDetails.notice.status = Response.status;
        this.noticeButtons.Forward = false;
        this.noticeButtons.Approve = false;
        this.noticeButtons.Disallow = false;
      }
    });
  }
  revokeNotice() {
    const body = {
      noticeId: this.noticeId,
      userId: this.user.getCurrentUser().userId
    };
    this.process.revokeNotice(body).subscribe((Response) => {
      if (Response.workFlowId) {
        this.noticeButtons.Revoke = false;
        this.notify.showSuccess('Success', 'Notice revoked successfully');
        this.getWorkFlowTrack(Response.workFlowId);
      }
    });
  }
  getWorkFlowTrack(workFlowId) {
    this.process.checkWorkFlowStatus(workFlowId).subscribe((Response) => {
      const stepDetails = Response;
      const memberDetails = this.noticeDetails.notice.primaryMember.details;
      if (stepDetails) {
        for (const item of stepDetails) {
          if (item.reason === 'stopped') {
            item.reason = 'Withdrawn';
            if (memberDetails) {
              item.taskDefinitionKeyName = memberDetails.fullName;
            }
          }
        }
        this.stepStatus = stepDetails;
        console.log(this.stepStatus);
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

  onVersionClick() {
    this.router.navigate(
      [
        '../../../notice/process',
        this.noticeDetails.notice.noticeId,
        'versions', 'view'
      ],
      {
        relativeTo: this.route.parent,
        state: { data: this.noticeDetails },
      }
    );
  }
  // function to get workflow roles
  getWorkFlowRole(noticeId, userId) {
    this.process.getWorkFlowRole(noticeId, userId).subscribe((res) => {
      this.processRoles = res;
    });
  }
  // get workflow users with hierarchy
  getWorkflowUsers(workflowId) {
    this.file.getWorkFlowRole(workflowId, 0).subscribe(data => {
      console.log(data);
    });
  }

  setApprovalForm() {
    this.approvalForm = this.fb.group({
      date: ['', [Validators.required]]
    });
  }

  handleCancelApprovalForm() {
    this.approvalForm.reset();
    this.setApprovalForm();
    this.isVisibleApprovalForm = false;
  }
  handleSubmitApprovalForm(value: any) {
    // tslint:disable-next-line: forin
    for (const key in this.approvalForm.controls) {
      this.approvalForm.controls[key].markAsDirty();
      this.approvalForm.controls[key].updateValueAndValidity();
    }
    this.admitNotice();
  }
  onApproveButtonClick(templateId) {
    this.process.approveNotice(templateId, this.noticeId).subscribe((Response) => {
        if (Response) {
          if (Response.bac) {
            this.isVisibleApprovalForm = true;
            this.isBac = false;
          } else if (Response.calender) {
            this.isVisibleApprovalForm = true;
          } else if (Response.datelist !== null) {
            this.dateList = Response.datelist;
            this.isVisibleApprovalForm = true;
            this.isDateList = true;
          }
          if (Response.ministerConveniencePending) {
            this.showConveniencePending = true;
          }
        }
    });
  }
  addApprovalNote(dateStr) {
    const latestNote: any = this.notesList.pop();
    if (latestNote && latestNote.ownerId === this.currentUserID) {
      // do nothing
    } else {
      let date = '';
      if (dateStr) {
        date = ('0' + dateStr.getDate()).slice(-2) + '-' + ('0' + (dateStr.getMonth() + 1)).slice(-2) + '-' + dateStr.getFullYear();
      }
      let note = 'Approved ';
      if (date) {
        note += `for ${date}`;
      }
      this.noteForm.patchValue({note});
      this.saveNote();
    }
  }
  getNoticeButtons() {
    return {
      Forward: false,
      Approve: false,
      Withdraw: false,
      Disallow: false,
      Note: false,
      Version: false,
      tags: false
    };
  }

  loadNoticeButtons(notice, primaryMemberId) {

    if (this.notice.doIHaveAnAccess('NOTICE', 'FORWARD') && notice.status === 'SUBMITTED') {
      this.noticeButtons.Forward = true;
    }

    if (this.notice.doIHaveAnAccess('NOTICE', 'APPROVE') && notice.status === 'SUBMITTED') {
      this.noticeButtons.Approve = true;
    }

    if (
      this.notice.doIHaveAnAccess('NOTICE', 'WITHDRAW') &&
      (notice.status === 'SUBMITTED' || notice.status === 'CONSENT_PENDING') && this.user.getCurrentUser().userId === primaryMemberId
    ) {
      this.noticeButtons.Withdraw = true;
    }

    // if (this.notice.doIHaveAnAccess('NOTICE', 'REVOKE') && noticeStatus === 'APPROVED') {
    //   this.noticeButtons.Revoke = true;
    // }

    if (this.notice.doIHaveAnAccess('NOTICE', 'DISALLOW') && notice.status === 'SUBMITTED') {
      this.noticeButtons.Disallow = true;
    }
    if (this.notice.doIHaveAnAccess('NOTE', 'TEMPORARY') && notice.status === 'SUBMITTED') {
      this.tempFlag = true;
      this.noticeButtons.Note = true;
    } else if (this.notice.doIHaveAnAccess('NOTE', 'PERMANENT') && notice.status === 'SUBMITTED') {
      this.tempFlag = false;
      this.noticeButtons.Note = true;
    }
    if (this.notice.doIHaveAnAccess('VERSION', 'READ')) {
      this.noticeButtons.Version = true;
    }
    if (this.notice.doIHaveAnAccess('TAGS', 'CREATE') && !notice.fileId) {
      this.noticeButtons.tags = true;
    }
    // if (this.notice.doIHaveAnAccess('NOTICE', 'CREATE') && noticeStatus === 'REVOKED') {
    //   this.noticeButtons.EditAndResubmit = true;
    // }
  }
  // onResubmitClick() {
  //   // tslint:disable-next-line: deprecation
  //       this.noticeid = this.noticeDetails.notice.noticeId;
  //       this.router.navigate(
  //     ['../../../notice/ab/create', 0, this.noticeid], { relativeTo: this.route.parent }
  //   );
  // }

  backToList() {
    this.router.navigate([
      this.returnUrl
    ], {
      relativeTo: this.route.parent,
    });
  }
  disabledDate = (current: Date): boolean => {
    if (this.isDateList) {
      const todayDate = current.getFullYear() + '-' + ('0' + (current.getMonth() + 1)).slice(-2) + '-' + ('0' + current.getDate()).slice(-2);
      return !this.dateList.find(item => item === todayDate);
    }
  }
  showpopup() {
    this.popupvisible = true;
  }
  popupCancel() {
    this.popupvisible = false;
  }
  getAllMembers() {
    this.usermanagement.getAllMembers().subscribe((Response) => {
      this.mlaList = Response;
    });
  }
  addConsent() {
    const body = {
      noticeId: this.noticeId,
      userId: this.notificationForm.value.mlaId,
      type: 'NOTICE_APPROVAL'
    };
    this.process.addConsentMember(body).subscribe((Response) => {
      this.notify.showSuccess('Success', 'Notification sent successfully');
      this.popupvisible = false;
    });
  }
  onChecked(event) {
    if (event === true) {
      this.isChecked = false;
    } else { this.isChecked = true; }
  }
  showModal(): void {
    this.isVisible = true;
  }
  handleCancel(): void {
    this.isVisible = false;
  }
  attachTofile() {
    this.isVisible = true;
    this.getArisingFileNumber();
    this.getFilestoAttach();
  }
  onSearchFilesForAttach() {
    const searchParam = this.attachFileForm.value.searchParamForFiles;
    if (searchParam) {
      this.fileList = this.allFileList.filter(element =>
        (element.fileNumber &&
          element.fileNumber
            .toLowerCase()
            .includes(searchParam.toLowerCase())) ||
        (element.subject &&
          element.subject
            .toLowerCase()
            .includes(searchParam.toLowerCase()))
      );
      this.fileList = this.advancedFilter(this.fileList);
    } else {
      this.fileList = this.advancedFilter(this.allFileList);
    }

  }
  getFilestoAttach() {
    this.file.getFilesToAttachByNoticeId(this.assemblyId, this.sessionId, this.noticeId).subscribe(data => {
      this.fileList = data;
      this.allFileList = data;
    });
  }
  attachFile() {
    const data = {
      noticeIds: [this.noticeId],
      fileForm: this.attachFileForm.value
    };
    this.file.attachToFile(data).subscribe(Response => {
      this.notify.showSuccess('Success', 'Notice attached to file successfully');
      this.backToList();
    }, error => {
    });
    this.isVisible = false;
  }
  advancedFilter(list) {
    if (this.attachFileForm.value.fileNo) {
      list = list.filter(
        (element) =>
          element.fileNumber &&
          element.fileNumber
            .toLowerCase()
            .includes(this.attachFileForm.value.fileNo.toLowerCase())
      );
    }
    if (this.attachFileForm.value.subject) {
      list = list.filter(
        (element) =>
          element.subject &&
          element.subject
            .toLowerCase()
            .includes(this.attachFileForm.value.subject.toLowerCase())
      );
    }
    return list;
  }
  responseConvenience() {
    if (this.ministerConvenience.valid) {
      const body = {
        noticeId: this.noticeId,
        userId: this.user.getCurrentUser().userId,
        note: this.ministerConvenience.value
      };
      this.file.respondConvienience(body).subscribe(data => {
        this.notify.showSuccess('Success', 'Responded to convenience successfully');
        this.backToList();
      });
    }
  }
  getMinisterConvenience() {
    this.file.listConveniencesByNoticeId(this.noticeId).subscribe(data => {
      if (data && data.length > 0) {
        this.ministerConvenience.setValue(data[0].note);
        this.disableConvenienceEntry = true;
      } else {
        this.ministerConvenience.setValue(null);
        this.disableConvenienceEntry = false;
      }
    });
  }
  addTag(): void {
    const newTag = this.tags;
    if (
      newTag &&
      this.noticeDetails.notice.tags &&
      this.noticeDetails.notice.tags.indexOf(newTag) === -1
    ) {
      this.noticeDetails.notice.tags = [...this.noticeDetails.notice.tags, newTag];
      this.saveOrUpdateTag();
    }
    this.tags = "";
    this.showAddTag = false;
  }

  _showAddTag(): void {
    this.showAddTag = true;
    setTimeout(() => {
      this.inputElement.nativeElement.focus();
    }, 10);
  }
  _sliceTagName(tag: string): string {
    const isLongTag = tag.length > 20;
    return isLongTag ? `${tag.slice(0, 20)}` : tag;
  }

  _removeTag(removedTag: {}): void {
    this.noticeDetails.notice.tags = this.noticeDetails.notice.tags.filter(
      (tag) => tag !== removedTag
    );
    this.saveOrUpdateTag();
  }

  saveOrUpdateTag() {
    this.process.saveTag(this.noticeId, this.noticeDetails.notice.tags).subscribe();
  }
  getAssembly(assemblyId) {
    if (assemblyId && this.assemblyList && this.assemblyList.length > 0) {
      const assembly = this.assemblyList.find(x => x.id === assemblyId);
      return assembly.assemblyId;
    }
    return '';
  }
  getSession(sessionId) {
    if (sessionId && this.sessionList && this.sessionList.length > 0) {
      const session = this.sessionList.find(x => x.id === sessionId);
      return session.sessionId;
    }
    return '';
  }
  getSessionList() {
    this.service.getAllSession().subscribe(data => {
      this.sessionList = data;
    });
  }
  getAssemblyList() {
    this.service.getAllAssembly().subscribe(data => {
      this.assemblyList = data;
    });
  }
  sendMinisterConvenience() {
    const body = {
      noticeId: this.noticeId,
      userId: this.user.getCurrentUser().userId
    };
    this.file.forwardConvenience(body).subscribe(data => {
      this.notify.showSuccess('Success', 'Convenience sent to the minister successfully');
    });
  }
  isSpeaker() {
    return this.user.getCurrentUser().authorities.includes('speaker');
  }
  viewMinisterConvenience(noticeId) {
    if (noticeId) {
      this.file.listConveniencesByNoticeId(noticeId).subscribe(data => {
        this.ministerConvenienceMessage = data;
      });
    }
  }

  showAttachment(url) {
    window.open(url, '_blank');
  }
}
