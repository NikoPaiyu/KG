import { Component, OnInit, Inject } from '@angular/core';
import { CplFile } from '../shared/models/create-file';
import { Data, ActivatedRoute, Router } from '@angular/router';
import { FilesService } from '../shared/services/files.service';
import { CommonService } from '../shared/services/common.service';
import { DocumentsService } from '../shared/services/documents.service';
import { NzNotificationService } from 'ng-zorro-antd';
import { FileListService } from '../shared/services/file-list.service';

@Component({
  selector: 'cpl-file-list-flow',
  templateUrl: './file-list-flow.component.html',
  styleUrls: ['./file-list-flow.component.scss']
})
export class FileListFlowComponent implements OnInit {
  notes: any;
  inputValue: string = null;
  docs;
  suggestions: string[] = [];
  fileId = null;
  fileLogs: any = [];
  yellow: any = false;
  update = false;
  updateBody: any;
  updateId: any;
  user: any;
  fileDocsArray: any = [];
  isAttachVisible = false;
  isfileVisible = false;
  selectedRole: any = null;
  roles: any = [];
  referenceBusiness: any = [];
  forwarded: any;
  stepStatus: any = [];
  searchDoc: any;
  listOfDoc: any = [];
  DocList: any = [];
  fromGroup: any;
  cplButtons: any = this.getCPLButtons();
  list: any;
  popConfirm = false;
  portId: any;
  fileByListId: any;
  docListTables: any;
  listId: any;
  quickOptions = [
    { label: 'Can be admitted', disallowStatus: false },
    { label: 'Can be disallowed as per rule', disallowStatus: true },
    { label: 'Not allowed as per rule', disallowStatus: true },
  ];
  selectedTags = [];
  ShowRules = false;
  allRules: any;
  currentRuleStatement = '';
  disallowStatus = false;
  checkedRule: any;

  constructor(private fileService: FilesService, private commonService: CommonService,
    private route: ActivatedRoute, private docService: DocumentsService, private router: Router,
    private notification: NzNotificationService, private fileListService: FileListService,
    @Inject('authService') private AuthService) {
    //this.user = this.commonService.getCurrentUser();
    this.user = AuthService.getCurrentUser();
    this.commonService.getCPLPermissions(this.user.rbsPermissions);
  }

  ngOnInit() {
    this.getAllRules();
    this.route.params.subscribe(params => {
      this.listId = params.id;
      this.getFileByListId(this.listId);
    });
    this.yellow = 'false';
    this.isAttachVisible = false;
    this.isfileVisible = false;
    this.roles = [
      {
        code: 'CPL_ASSISTANT',
        name: 'Assistant'
      },
      {
        code: 'CPL_SECTION_OFFICER',
        name: 'Section Officer'
      },
      {
        code: 'CPL_UNDER_SECRETARY',
        name: 'Under Secretary'
      },
      {
        code: 'CPL_DEPUTY_SECRETARY',
        name: 'Deputy Secretary'
      },
      {
        code: 'CPL_JOINT_SECRETARY',
        name: 'Joint Secretary'
      },
      {
        code: 'CPL_ADDITIONAL_SECRETARY',
        name: 'Additional Secretary'
      },
      {
        code: 'SECRETARY',
        name: 'Secretary'
      }
    ];
    this.getFromGroup();
    setTimeout(() => {
      this.loadCPLButtons();
    }, 300);
  }


  addNote() {
    if (!this.update) {
      const body = {
        fileId: this.fileId,
        note: this.inputValue,
        referenceBusiness: [
          0
        ],
        referenceRules: [
          0
        ],
        temporary: this.yellow,
        userId: this.user.userId
      };
      if (this.inputValue.charAt(0) !== ' ') {
        this.fileService.addNote(body).subscribe(Res => {
          this.notes = Res;
          this.inputValue = null;
          this.getFileByListId(this.listId);
        });
      } else {
        this.notification.create(
          'warning',
          'Warning',
          'First Character Should Not Be Space!'
        );
      }
    }
    if (this.update) {
      this.updateBody = {
        fileId: this.fileId,
        note: this.inputValue,
        noteId: this.updateId,
        referenceBusiness: [
          0
        ],
        referenceRules: [
          0
        ],
        temporary: this.yellow,
        userId: this.user.userId
      };
      if (this.inputValue.charAt(0) !== ' ') {
        this.fileService.updateNote(this.updateBody).subscribe(Res => {
          this.notes = Res;
          this.inputValue = null;
          this.update = false;
          this.getFileByListId(this.listId);
        });
      } else {
        this.notification.create(
          'warning',
          'Warning',
          'First Character Should Not Be Space!'
        );
      }
    }
  }

  editNote(nId, note, temp) {
    this.update = true;
    this.yellow = temp;
    this.inputValue = note;
    this.updateId = nId;
  }

  convertNote(nId, note) {
    this.yellow = false;
    this.update = true;
    this.updateId = nId;
    this.inputValue = note;
    this.addNote();
  }

  deleteNote(nId) {
    const body = {
      fileId: this.fileId,
      noteId: nId,
      userId: this.user.userId
    };
    this.fileService.deleteNoteById(body).subscribe(Res => {
      this.notes = Res;
      this.getFileByListId(this.listId);
    });
  }

  handleCancel() {
    this.isAttachVisible = false;
    this.isfileVisible = false;
  }

  showAttachModal(): void {
    this.isAttachVisible = true;
  }

  fileInfo() {
    this.isfileVisible = true;
  }

  cancel() {
  }

  getFromGroup() {
    if (this.user.authorities.includes('officeAssistant')) {
      this.fromGroup = 'Assistant';
    } else if (this.user.authorities.includes('sectionOfficer')) {
      this.fromGroup = 'Section Officer';
    } else if (this.user.authorities.includes('underSecretary')) {
      this.fromGroup = 'Under Secretary';
    } else if (this.user.authorities.includes('deputySecretary')) {
      this.fromGroup = 'Deputy Secretary';
    } else if (this.user.authorities.includes('jointSecretary')) {
      this.fromGroup = 'Joint Secretary';
    } else if (this.user.authorities.includes('additionalSecretary')) {
      this.fromGroup = 'Additional Secretary';
    } else if (this.user.authorities.includes('secretary')) {
      this.fromGroup = 'Secretary';
    }
  }

  forwardFile(group, fileId) {
    let latestNote: any;
    if (this.fileByListId) {
      latestNote = this.fileByListId.fileResponse.notes.pop();
    }
    if (latestNote &&
      latestNote.user.userId === this.user.userId) {
      this.popConfirm = true;
      const body = {
        fromGroup: this.fromGroup,
        groupId: group.code,
      };
      this.fileService.forwardFile(body, fileId).subscribe(Res => {
        this.getFileByListId(this.listId);
        this.selectedRole = null;
        this.router.navigate(['business-dashboard/cpl/documents-list']);
      });
    } else {
      this.notification.create(
        'warning',
        'Warning',
        'Please Add Note!'
      );
    }
  }

  approveFile(fileId) {
    let latestNote: any;
    if (this.fileByListId) {
      latestNote = this.fileByListId.fileResponse.notes.pop();
    }
    if (latestNote &&
      latestNote.user.userId === this.user.userId) {
      this.popConfirm = true;
      const body = {
        fromGroup: this.fromGroup,
        approvedById: this.user.userId
      };
      this.fileService.approveFile(body, fileId).subscribe(Res => {
        this.getFileByListId(this.listId);
        this.selectedRole = null;
        this.router.navigate(['business-dashboard/cpl/documents-list']);
      });
    } else {
      this.notification.create(
        'warning',
        'Warning',
        'Please Add Note!'
      );
    }
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

  getCPLButtons() {
    return {
      Forward: false,
      Approve: false,
      Edit: false,
      Return: false
    }
  }

  loadCPLButtons() {

    if (this.commonService.doIHaveAnAccess('BUTTONS', 'FORWARD')) {
      this.cplButtons.Forward = true;
    }

    if (this.commonService.doIHaveAnAccess('BUTTONS', 'APPROVE')) {
      this.cplButtons.Approve = true;
    }

    if (this.commonService.doIHaveAnAccess('BUTTONS', 'UPDATE')) {
      this.cplButtons.Edit = true;
    }

    if (this.commonService.doIHaveAnAccess('BUTTONS', 'BACKWARD')) {
      this.cplButtons.Return = true;
    }
  }

  editDoc(listId) {
    this.router.navigate([
      'business-dashboard/cpl/document-preparation', listId]);
  }

  getFileByListId(listId) {
    this.docService.getDocumentByListId(listId).subscribe(Res => {
      this.fileByListId = Res;
      this.docListTables = this.fileByListId.documentsByPortfolioDtos;
      this.fileId = this.fileByListId.fileId;
    });
  }

  CheckforRules(checked: boolean, tag, index: number) {
    this.currentRuleStatement = tag.label;
    if (tag.disallowStatus) {
      this.ShowRules = true;
      this.addQuickOption(checked, tag.label, index);
    } else {
      this.addQuickOption(checked, tag.label, index);
    }
  }

  getAllRules() {
    this.fileService.getAllRules().subscribe(Response => {
      this.allRules = Response;
    });
  }

  addQuickOption(checked: boolean, tag: string, index) {
    this.inputValue = tag;
    console.log(this.inputValue);
  }

  cancelRuleSelection() {
    this.ShowRules = false;
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
    const ruleCode = ruleApplyed.map((x) => x.code);
    const ruleData = ruleApplyed.map((x) => x.englishDescription);
    const noteData = this.inputValue;
    if (ruleApplyed.length > 0) {
      this.inputValue = this.inputValue + ' ' + ruleCode + ' ' + ruleData;
      this.selectedTags.push(
        `${this.currentRuleStatement} ${ruleCode}`
      );
    }
    this.cancelRuleSelection();
    this.ShowRules = false;
  }

  onRuleChecked(code, checked) {
    if (checked) {
      this.checkedRule = code;
    }
  }
}

