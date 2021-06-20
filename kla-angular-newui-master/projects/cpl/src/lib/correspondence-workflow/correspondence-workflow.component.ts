import { Component, OnInit, Inject } from '@angular/core';
import { CurrespondenceService } from '../shared/services/currespondence.service';
import { NzNotificationService } from 'ng-zorro-antd';
import { ActivatedRoute, Router } from '@angular/router';
import { FilesService } from '../shared/services/files.service';
import { CommonService } from '../shared/services/common.service';
import * as jsPdf from "jspdf";
import { HtmldiffService } from '../shared/services/htmldiff.service';
@Component({
  selector: 'cpl-correspondence-workflow',
  templateUrl: './correspondence-workflow.component.html',
  styleUrls: ['./correspondence-workflow.component.scss'],
})
export class CorrespondenceWorkflowComponent implements OnInit {
  selectedRole: any = null;
  workflowUsers: any;
  stepStatus: any;
  notes: any;
  quickOptions: any = [];
  currentRuleStatement: any;
  inputValue: any = '';
  update = false;
  correspondenceId: any;
  user: any;
  noteId: any;
  correspondenceData: any;
  code: any;
  currentPoolUser: any;
  currentPool: any;
  currentActionName: any;
  approveBtn = false;
  fromGroup: any;
  forwardAssigneeGroup: any;
  forwardAssignee: any;
  currentUserActionRow: any;
  forwardReturnBtn = 'Forward';
  latestNote: any;
  listOfData: any = [];
  versionFlag: boolean;
  currentVersion;
  attachments: any;
  toValue = [];
  diff = '';
  v1 = '';
  v2 = '';
  urlParams: any;
  constructor(
    @Inject('authService') private AuthService,
    private correspondenceService: CurrespondenceService,
    private notification: NzNotificationService,
    private route: ActivatedRoute,
    private fileService: FilesService,
    private commonService: CommonService,
    private htmlDiffService: HtmldiffService,
    private router: Router
  ) {
    this.user = AuthService.getCurrentUser();
    this.code = this.user.correspondenceCode.code;
    this.commonService.getCPLPermissions(this.user.rbsPermissions);
    this.urlParams = this.router.getCurrentNavigation().extras.state;
  }

  ngOnInit() {
    setTimeout(() => {
      this.loadPermissions();
    }, 500);
    this.correspondenceId = this.route.snapshot.params.id;
    this.getCorrespondenceById();
    this.getNotes();
  }

  getCorrespondenceById() {
    this.correspondenceService
      .getCorrespondenceById(this.correspondenceId, this.code)
      .subscribe((Res) => {
        this.correspondenceData = Res;
        this.listOfData = this.correspondenceData.data;
        this.v1 = this.v2 = this.correspondenceData.versionMap[this.correspondenceData.version];
        this.toValue = this.correspondenceData.toCode.map((x) => x.displayName);
        if (this.correspondenceData.versionOption.length > 1) {
          this.versionFlag = true;
          this.currentVersion = this.correspondenceData.version;
        }
        this.getWorkflowStatus();
        if (this.correspondenceData.attachmentDto) {
          this.attachments = this.correspondenceData.attachmentDto;
        }
      });
  }

  goBack() {
    if (this.urlParams) {
      this.router.navigate(['business-dashboard/cpl/correspondence-list'], {
        state: this.urlParams ? this.urlParams : null
      });
    } else {
      window.history.back();
    }
  }

  getWorkflowActionUsers() {
    this.correspondenceService
      .getWorkflowUsers(this.correspondenceId)
      .subscribe((Res) => {
        this.workflowUsers = Res;
        for (const user of this.workflowUsers) {
          if (this.currentPool === user.code) {
            this.currentUserActionRow = user.actionRow;
            break;
          }
        }
      });
  }

  approveNoteCheck() {
    if (this.latestNote && this.latestNote.owner.userId === this.user.userId) {
      this.approve();
    } else {
      const body = {
        note: 'Correspondence approved and sent',
        ownerId: this.user.userId,
        correspondenceId: this.correspondenceId,
        temporary: false,
      };
      this.correspondenceService
        .addNote(this.correspondenceId, body)
        .subscribe((Res) => {
          this.inputValue = '';
          this.notification.create(
            'success',
            'Success',
            'Note added successfully!'
          );
          this.getNotes();
          this.approve();
        });
    }
  }

  approve() {
    const body = {
      fromGroup: this.fromGroup,
    };
    this.correspondenceService
      .approveCorrespondence(this.correspondenceId, body)
      .subscribe((Res) => {
        this.notification.create(
          'success',
          'Success',
          'Correspondence Sent Successfully!'
        );
        this.router.navigate(['business-dashboard/cpl/correspondence-list']);
      });
  }

  forward() {
    if (this.latestNote && this.latestNote.owner.userId === this.user.userId) {
      const body = {
        action: 'FORWARD',
        groupId: this.forwardAssigneeGroup,
        fromGroup: this.fromGroup,
        assignee: this.forwardAssignee,
      };
      this.correspondenceService
        .forwardCorrespondence(this.correspondenceId, body)
        .subscribe((Res) => {
          this.notification.create(
            'success',
            'Success',
            'Correspondence ' + this.forwardReturnBtn + 'ed Successfully!'
          );
          this.router.navigate(['business-dashboard/cpl/correspondence-list']);
        });
    } else {
      this.notification.create('warning', 'Warning', 'Please Add Note!');
    }
  }

  ForwardOrReturn() {
    const arrForwardUserInfo = this.selectedRole.split('-');
    const forwardActionRow = arrForwardUserInfo[1];
    this.forwardAssignee = arrForwardUserInfo[0];
    this.forwardAssigneeGroup = arrForwardUserInfo[2];
    if (
      this.currentUserActionRow === null ||
      forwardActionRow >= this.currentUserActionRow
    ) {
      this.forwardReturnBtn = 'Forward';
    } else {
      this.forwardReturnBtn = 'Return';
    }
  }

  cancel() {}

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

  editCorrespondence(correspondenceId) {
    this.router.navigate(
      [
        "/business-dashboard/cpl/correspondence",
        "edit",
        correspondenceId,
      ],
      {}
    );
  }

  getNotes() {
    this.correspondenceService
      .getNotes(this.correspondenceId)
      .subscribe((Res) => {
        this.notes = Res;
        this.latestNote = this.notes[this.notes.length - 1];
      });
  }

  editNote(id, note) {
    this.noteId = id;
    this.inputValue = note;
    this.update = true;
  }

  deleteNote(noteId) {
    this.correspondenceService
      .deleteNote(noteId, this.correspondenceId)
      .subscribe((Res) => {
        this.notification.create(
          'success',
          'Success',
          'Note deleted successfully!'
        );
        this.getNotes();
      });
  }

  cancelEdit() {
    this.update = false;
    this.inputValue = '';
  }

  addNote() {
    let body;
    if (!this.update) {
      let add = false;
      if (this.latestNote) {
        if (this.latestNote.owner.userId !== this.user.userId) {
          add = true;
        } else {
          add = false;
        }
      } else {
        add = true;
      }
      if (add && this.inputValue.charAt(0) !== ' ') {
      body = {
        note: this.inputValue,
        ownerId: this.user.userId,
        correspondenceId: this.correspondenceId,
        temporary: false,
      };
      this.correspondenceService
        .addNote(this.correspondenceId, body)
        .subscribe((Res) => {
          this.inputValue = '';
          this.notification.create(
            'success',
            'Success',
            'Note added successfully!'
          );
          this.getNotes();
          this.update = false;
        });
      } else if (this.inputValue.charAt(0) === ' ') {
        this.notification.create(
          'warning',
          'Warning',
          'First Character Should Not Be Space!'
        );
      } else if (!add) {
        this.notification.create(
          'warning',
          'Warning',
          'You can add only one note!'
        );
      }
    } else {
      body = {
        id: this.noteId,
        note: this.inputValue,
        ownerId: this.user.userId,
        correspondenceId: this.correspondenceId,
        temporary: false,
      };
      this.correspondenceService
        .updateNote(this.correspondenceId, body)
        .subscribe((Res) => {
          this.inputValue = '';
          this.notification.create(
            'success',
            'Success',
            'Note updated successfully!'
          );
          this.getNotes();
          this.update = false;
        });
      }
  }

  getWorkflowStatus() {
    this.fileService
      .checkWorkFlowStatus(this.correspondenceData.workflowId)
      .subscribe((Res) => {
        this.stepStatus = Res;
        const current = this.stepStatus[this.stepStatus.length - 1];
        this.currentPoolUser = current.owner;
        this.getCurrentPool();
        if (this.correspondenceData.status !== 'SENT') {
        this.getWorkflowActionUsers();
        }
      });
  }

  getCurrentPool() {
    if (this.user.authorities.includes('assistant')) {
      this.currentPool = 'CPL_ASSISTANT';
      this.fromGroup = 'Assistant';
      this.currentActionName = 'Assistant';
    } else if (this.user.authorities.includes('sectionOfficer')) {
      this.currentPool = 'CPL_SECTION_OFFICER';
      this.fromGroup = 'Section Officer';
      this.currentActionName = 'SectionOfficer';
    } else if (this.user.authorities.includes('underSecretary')) {
      this.currentPool = 'CPL_UNDER_SECRETARY';
      this.fromGroup = 'Under Secretary';
      this.currentActionName = 'UnderSecretary';
    } else if (this.user.authorities.includes('deputySecretary')) {
      this.currentPool = 'CPL_DEPUTY_SECRETARY';
      this.fromGroup = 'Deputy Secretary';
      this.currentActionName = 'DeputySecretary';
    } else if (this.user.authorities.includes('jointSecretary')) {
      this.currentPool = 'CPL_JOINT_SECRETARY';
      this.fromGroup = 'Joint Secretary';
      this.currentActionName = 'JS/AS/SS';
    } else if (this.user.authorities.includes('additionalSecretary')) {
      this.currentPool = 'CPL_JOINT_SECRETARY';
      this.fromGroup = 'Additional Secretary';
      this.currentActionName = 'JS/AS/SS';
    } else if (this.user.authorities.includes('secretary')) {
      this.currentPool = 'SECRETARY';
      this.fromGroup = 'Secretary';
      this.currentActionName = 'Secretary';
    } else if (this.user.authorities.includes('specialSecretary')) {
      this.currentPool = 'CPL_JOINT_SECRETARY';
      this.fromGroup = 'Special Secretary';
      this.currentActionName = 'JS/AS/SS';
    } else if (this.user.authorities.includes('speaker')) {
      this.currentPool = 'SPEAKER';
      this.fromGroup = 'Speaker';
      this.currentActionName = 'Speaker';
    }
  }

  loadPermissions() {
    if (this.commonService.doIHaveAnAccess('BUTTONS', 'APPROVE')) {
      this.approveBtn = true;
    }
  }
  getVersion(version) {
    this.v2 = this.correspondenceData.versionMap[version];
    this.diff = this.htmlDiffService.htmlDiff(this.v1, this.v2);
    this.listOfData = this.diff;
  }
  showAttachment( url) {
    window.open(url, '_blank');
  }
  download() {
    let printContents, popupWin;
    let doc = new jsPdf("p", "pt");
    printContents = this.correspondenceData.data;
    // popupWin = window.open('', '_blank', 'top=0,right=25%,left=25%,height=100%,width=auto');
    var blob = doc.output("blob");
    popupWin =  window.open(URL.createObjectURL(blob));
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Detailed View</title>
          <style>
          .ql-editor {
            box-sizing: border-box;
            line-height: 1.42;
            height: 100%;
            outline: none;
            padding: 12px 15px;
            tab-size: 4;
            -moz-tab-size: 4;
            text-align: left;
            white-space: pre-wrap;
            word-wrap: break-word;
          }
          .ql-editor p,
          .ql-editor ol,
          .ql-editor ul,
          .ql-editor pre,
          .ql-editor blockquote,
          .ql-editor h1,
          .ql-editor h2,
          .ql-editor h3,
          .ql-editor h4,
          .ql-editor h5,
          .ql-editor h6 {
            margin: 0;
            padding: 0;
            counter-reset: list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
          }
          .ql-editor ol,
          .ql-editor ul {
            padding-left: 1.5em;
          }
          .ql-editor ol > li,
          .ql-editor ul > li {
            list-style-type: none;
          }
          
          .ql-editor ul[data-checked=true],
          .ql-editor ul[data-checked=false] {
            pointer-events: none;
          }
          .ql-editor ul[data-checked=true] > li *,
          .ql-editor ul[data-checked=false] > li * {
            pointer-events: all;
          }
          .ql-editor ul[data-checked=true] > li::before,
          .ql-editor ul[data-checked=false] > li::before {
            color: #777;
            cursor: pointer;
            pointer-events: all;
          }
          
          
          .ql-editor li::before {
            display: inline-block;
            white-space: nowrap;
            width: 1.2em;
          }
          .ql-editor li:not(.ql-direction-rtl)::before {
            margin-left: -1.5em;
            margin-right: 0.3em;
            text-align: right;
          }
          .ql-editor li.ql-direction-rtl::before {
            margin-left: 0.3em;
            margin-right: -1.5em;
          }
          .ql-editor ol li:not(.ql-direction-rtl),
          .ql-editor ul li:not(.ql-direction-rtl) {
            padding-left: 1.5em;
          }
          .ql-editor ol li.ql-direction-rtl,
          .ql-editor ul li.ql-direction-rtl {
            padding-right: 1.5em;
          }
          .ql-editor ol li {
            counter-reset: list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
            counter-increment: list-0;
          }
          .ql-editor ol li:before {
            content: counter(list-0, decimal) '. ';
          }
          .ql-editor ol li.ql-indent-1 {
            counter-increment: list-1;
          }
          .ql-editor ol li.ql-indent-1:before {
            content: counter(list-1, lower-alpha) '. ';
          }
          .ql-editor ol li.ql-indent-1 {
            counter-reset: list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
          }
          .ql-editor ol li.ql-indent-2 {
            counter-increment: list-2;
          }
          .ql-editor ol li.ql-indent-2:before {
            content: counter(list-2, lower-roman) '. ';
          }
          .ql-editor ol li.ql-indent-2 {
            counter-reset: list-3 list-4 list-5 list-6 list-7 list-8 list-9;
          }
          .ql-editor ol li.ql-indent-3 {
            counter-increment: list-3;
          }
          .ql-editor ol li.ql-indent-3:before {
            content: counter(list-3, decimal) '. ';
          }
          .ql-editor ol li.ql-indent-3 {
            counter-reset: list-4 list-5 list-6 list-7 list-8 list-9;
          }
          .ql-editor ol li.ql-indent-4 {
            counter-increment: list-4;
          }
          .ql-editor ol li.ql-indent-4:before {
            content: counter(list-4, lower-alpha) '. ';
          }
          .ql-editor ol li.ql-indent-4 {
            counter-reset: list-5 list-6 list-7 list-8 list-9;
          }
          .ql-editor ol li.ql-indent-5 {
            counter-increment: list-5;
          }
          .ql-editor ol li.ql-indent-5:before {
            content: counter(list-5, lower-roman) '. ';
          }
          .ql-editor ol li.ql-indent-5 {
            counter-reset: list-6 list-7 list-8 list-9;
          }
          .ql-editor ol li.ql-indent-6 {
            counter-increment: list-6;
          }
          .ql-editor ol li.ql-indent-6:before {
            content: counter(list-6, decimal) '. ';
          }
          .ql-editor ol li.ql-indent-6 {
            counter-reset: list-7 list-8 list-9;
          }
          .ql-editor ol li.ql-indent-7 {
            counter-increment: list-7;
          }
          .ql-editor ol li.ql-indent-7:before {
            content: counter(list-7, lower-alpha) '. ';
          }
          .ql-editor ol li.ql-indent-7 {
            counter-reset: list-8 list-9;
          }
          .ql-editor ol li.ql-indent-8 {
            counter-increment: list-8;
          }
          .ql-editor ol li.ql-indent-8:before {
            content: counter(list-8, lower-roman) '. ';
          }
          .ql-editor ol li.ql-indent-8 {
            counter-reset: list-9;
          }
          .ql-editor ol li.ql-indent-9 {
            counter-increment: list-9;
          }
          .ql-editor ol li.ql-indent-9:before {
            content: counter(list-9, decimal) '. ';
          }
          .ql-editor .ql-indent-1:not(.ql-direction-rtl) {
            padding-left: 3em;
          }
          .ql-editor li.ql-indent-1:not(.ql-direction-rtl) {
            padding-left: 4.5em;
          }
          .ql-editor .ql-indent-1.ql-direction-rtl.ql-align-right {
            padding-right: 3em;
          }
          .ql-editor li.ql-indent-1.ql-direction-rtl.ql-align-right {
            padding-right: 4.5em;
          }
          .ql-editor .ql-indent-2:not(.ql-direction-rtl) {
            padding-left: 6em;
          }
          .ql-editor li.ql-indent-2:not(.ql-direction-rtl) {
            padding-left: 7.5em;
          }
          .ql-editor .ql-indent-2.ql-direction-rtl.ql-align-right {
            padding-right: 6em;
          }
          .ql-editor li.ql-indent-2.ql-direction-rtl.ql-align-right {
            padding-right: 7.5em;
          }
          .ql-editor .ql-indent-3:not(.ql-direction-rtl) {
            padding-left: 9em;
          }
          .ql-editor li.ql-indent-3:not(.ql-direction-rtl) {
            padding-left: 10.5em;
          }
          .ql-editor .ql-indent-3.ql-direction-rtl.ql-align-right {
            padding-right: 9em;
          }
          .ql-editor li.ql-indent-3.ql-direction-rtl.ql-align-right {
            padding-right: 10.5em;
          }
          .ql-editor .ql-indent-4:not(.ql-direction-rtl) {
            padding-left: 12em;
          }
          .ql-editor li.ql-indent-4:not(.ql-direction-rtl) {
            padding-left: 13.5em;
          }
          .ql-editor .ql-indent-4.ql-direction-rtl.ql-align-right {
            padding-right: 12em;
          }
          .ql-editor li.ql-indent-4.ql-direction-rtl.ql-align-right {
            padding-right: 13.5em;
          }
          .ql-editor .ql-indent-5:not(.ql-direction-rtl) {
            padding-left: 15em;
          }
          .ql-editor li.ql-indent-5:not(.ql-direction-rtl) {
            padding-left: 16.5em;
          }
          .ql-editor .ql-indent-5.ql-direction-rtl.ql-align-right {
            padding-right: 15em;
          }
          .ql-editor li.ql-indent-5.ql-direction-rtl.ql-align-right {
            padding-right: 16.5em;
          }
          .ql-editor .ql-indent-6:not(.ql-direction-rtl) {
            padding-left: 18em;
          }
          .ql-editor li.ql-indent-6:not(.ql-direction-rtl) {
            padding-left: 19.5em;
          }
          .ql-editor .ql-indent-6.ql-direction-rtl.ql-align-right {
            padding-right: 18em;
          }
          .ql-editor li.ql-indent-6.ql-direction-rtl.ql-align-right {
            padding-right: 19.5em;
          }
          .ql-editor .ql-indent-7:not(.ql-direction-rtl) {
            padding-left: 21em;
          }
          .ql-editor li.ql-indent-7:not(.ql-direction-rtl) {
            padding-left: 22.5em;
          }
          .ql-editor .ql-indent-7.ql-direction-rtl.ql-align-right {
            padding-right: 21em;
          }
          .ql-editor li.ql-indent-7.ql-direction-rtl.ql-align-right {
            padding-right: 22.5em;
          }
          .ql-editor .ql-indent-8:not(.ql-direction-rtl) {
            padding-left: 24em;
          }
          .ql-editor li.ql-indent-8:not(.ql-direction-rtl) {
            padding-left: 25.5em;
          }
          .ql-editor .ql-indent-8.ql-direction-rtl.ql-align-right {
            padding-right: 24em;
          }
          .ql-editor li.ql-indent-8.ql-direction-rtl.ql-align-right {
            padding-right: 25.5em;
          }
          .ql-editor .ql-indent-9:not(.ql-direction-rtl) {
            padding-left: 27em;
          }
          .ql-editor li.ql-indent-9:not(.ql-direction-rtl) {
            padding-left: 28.5em;
          }
          .ql-editor .ql-indent-9.ql-direction-rtl.ql-align-right {
            padding-right: 27em;
          }
          .ql-editor li.ql-indent-9.ql-direction-rtl.ql-align-right {
            padding-right: 28.5em;
          }
          .ql-editor .ql-video {
            display: block;
            max-width: 100%;
          }
          .ql-editor .ql-video.ql-align-center {
            margin: 0 auto;
          }
          .ql-editor .ql-video.ql-align-right {
            margin: 0 0 0 auto;
          }
          .ql-editor .ql-bg-black {
            background-color: #000;
          }
          .ql-editor .ql-bg-red {
            background-color: #e60000;
          }
          .ql-editor .ql-bg-orange {
            background-color: #f90;
          }
          .ql-editor .ql-bg-yellow {
            background-color: #ff0;
          }
          .ql-editor .ql-bg-green {
            background-color: #008a00;
          }
          .ql-editor .ql-bg-blue {
            background-color: #06c;
          }
          .ql-editor .ql-bg-purple {
            background-color: #93f;
          }
          .ql-editor .ql-color-white {
            color: #fff;
          }
          .ql-editor .ql-color-red {
            color: #e60000;
          }
          .ql-editor .ql-color-orange {
            color: #f90;
          }
          .ql-editor .ql-color-yellow {
            color: #ff0;
          }
          .ql-editor .ql-color-green {
            color: #008a00;
          }
          .ql-editor .ql-color-blue {
            color: #06c;
          }
          .ql-editor .ql-color-purple {
            color: #93f;
          }
          .ql-editor .ql-font-serif {
            font-family: Georgia, Times New Roman, serif;
          }
          .ql-editor .ql-font-monospace {
            font-family: Monaco, Courier New, monospace;
          }
          .ql-editor .ql-size-small {
            font-size: 0.75em;
          }
          .ql-editor .ql-size-large {
            font-size: 1.5em;
          }
          .ql-editor .ql-size-huge {
            font-size: 2.5em;
          }
          .ql-editor .ql-direction-rtl {
            direction: rtl;
            text-align: inherit;
          }
          .ql-editor .ql-align-center {
            text-align: center;
          }
          .ql-editor .ql-align-justify {
            text-align: justify;
          }
          .ql-editor .ql-align-right {
            text-align: right;
          }
          .ql-editor.ql-blank::before {
            color: rgba(0,0,0,0.6);
            content: attr(data-placeholder);
            font-style: italic;
            left: 15px;
            pointer-events: none;
            position: absolute;
            right: 15px;
          }
          </style>
        </head>
    <body onload="window.print();window.close()"><div class="ql-editor">${printContents}</div></body>
      </html>`
    );
    popupWin.document.close();
  }

  showReference(id) {
    if (this.correspondenceData.businessCode === 'AMENDMENT') {
      this.router.navigate(['business-dashboard/cpl/amendment-view', id]);
    } else {
      this.router.navigate(['business-dashboard/cpl/cpl-view', 'view', id]);
    }
  }

}
