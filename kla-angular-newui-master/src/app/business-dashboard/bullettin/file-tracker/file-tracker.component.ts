import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FileService } from 'src/app/shared/services/file.service';
import { AuthService } from 'src/app/auth/shared/services/auth.service';
import { BulletinService } from '../shared/bulletin.service';
import { QuestionService } from '../../question/shared/question.service';
import { CalenderofsittingService } from '../../calender-of-sitting/shared/services/calenderofsitting.service';
import { NotificationCustomService } from 'src/app/shared/services/notification.service';
import { NotesComponent, ProcessTrackerComponent } from '../../shared/file-flow/file-flow.module';
@Component({
  selector: 'app-file-tracker',
  templateUrl: './file-tracker.component.html',
  styleUrls: ['./file-tracker.component.scss']
})
export class FileTrackerComponent implements OnInit {
  @ViewChild(NotesComponent, {static: false}) note: NotesComponent;
  @ViewChild(ProcessTrackerComponent, {static: false}) step: ProcessTrackerComponent;
  showPullModal;
  approvalForm: FormGroup;
  isVisibleApprovalForm;
  createFileForm: FormGroup;
  isVisible1;
  isOkLoading;
  pullRemark = null;
  stepStatusDetail = [];
  fileDetails = {
    fileId: null,
    currentAssignee: false,
    status: '',
    fileNumber: '',
    logs: [],
    notes: [],
    workflowId: null,
    assemblyId: null,
    sessionId: null
  };
  isVisible;
  logDetails = [];
  ShowRules;
  allRules = [];
  fileButtons: any = {
    Approve: false,
    Disallow: false,
    Return: false,
    Submit: false,
    noticeEdit: false,
    Note: false
  };
  workFlowActionUsers = [];
  notesList = [];
  fileId;
  userId;
  canPull;
  pullGroup;
  currentUserActionRow: any;
  docUrl = null;
  loading = true;
  assemblyList = [];
  sessionList = [];
  allActionUsers = [];
  constructor(private fb: FormBuilder, private route: ActivatedRoute, private file: FileService,
              public auth: AuthService, private service: BulletinService,
              private notify: NotificationCustomService, private router: Router,
              private question: QuestionService, private cos: CalenderofsittingService) {
                this.service.getPermissions(this.auth.getCurrentUser().userId);
              }

  ngOnInit() {
    this.fileId = this.route.snapshot.params.id;
    this.getFileById();
    this.getAssemblyandSession();
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
    // if (this.notice.doIHaveAnAccess('NOTE', 'TEMPORARY') && fileStatus === 'SUBMITTED') {
    //   this.NoticeNoteFlag = true;
    // } else if (this.notice.doIHaveAnAccess('NOTE', 'PERMANENT') && fileStatus === 'SUBMITTED') {
    //   this.NoticeNoteFlag = false;
    // }
  }
  stopLoading() {
    this.loading = false;
  }
  handleCancelApprovalForm() {

  }
  approveFile() {
    const body = {
      fileId: this.fileId,
      userId: this.auth.getCurrentUser().userId,
    };
    this.service.approveBulletin(body).subscribe((Response) => {
        if (Response) {
          const latestNote = this.note.notesList.pop();
          if (latestNote && latestNote.userId !== this.auth.getCurrentUser().userId) {
            const tex = 'Can be Approved';
            this.note.createNoteForm.get('note').setValue(tex);
            this.note.createNote();
          }
          this.notify.showSuccess('Success', 'file approved successfully');
          this.note.refreshNotes();
          setTimeout(() => {
            this.router.navigate(['/business-dashboard/bulletin'], {
              relativeTo: this.route.parent,
            });
          }, 1500);
        }
      });
  }
  disabledDate = (current: Date) => {

  }
  handleCancel() {

  }
  updateFile() {

  }
  showModal() {

  }
  cancelRuleSelection() {

  }
  applyRule() {

  }
  goToList() {
    this.router.navigate(['/business-dashboard/bulletin'], {
      relativeTo: this.route.parent,
    });
  }
  cancel() {
    
  }
  setLatestNote(value) {
    this.notesList = value;
    console.log(value);
  }
  isSpeaker() {
    if (this.auth.getCurrentUser().authorities.includes("speaker")) {
      return true;
    }
    return false;
  }
  isSecretary() {
    return this.auth.getCurrentUser().authorities.includes("secretary");
  }
  forwardFile(fileId) {
    let latestNote = this.note.notesList.pop();
    const details = this.userId.split('-');
    if (details && details.length > 0) {
      if (latestNote && latestNote.userId === this.auth.getCurrentUser().userId || this.isSpeaker() || this.isSecretary()) {
        if (latestNote && latestNote.userId !== this.auth.getCurrentUser().userId) {
          let tex;
          if (this.getCurrentAction() === 'Forward') {
            tex = 'Can be Approved';
          } else {
            tex = 'Can be Returned';
          }
          this.note.createNoteForm.get('note').setValue(tex);
          this.note.createNote();
        }
        const body = {
          action: 'FORWARD',
          groupId: details[2],
          fromGroup: this.auth.getCurrentUser().userName,
          assignee: details[0],
          fromGroupId: this.auth.getCurrentUser().userName
        };
        this.cos.forwardFile(this.fileId, body).subscribe((Response) => {
          if (Response) {
            this.notify.showSuccess('Success', 'file Forwarded successfully');
            latestNote = [];
            this.note.refreshNotes();
            setTimeout(() => {
              this.router.navigate(['/business-dashboard/bulletin'], {
                relativeTo: this.route.parent,
              });
            }, 1500);

          }
        });
      } else {
        this.notify.showWarning('Warning', 'Add Note!');
        this.note.refreshNotes();
      }
    }
  }
  getFileById() {
    const userId = this.auth.getCurrentUser().userId;
    this.file.getFileById(this.fileId, userId).subscribe(data => {
      this.fileDetails = data;
      if (this.fileDetails.status !== 'APPROVED') {
        this.getWorkFlowRole(this.fileDetails.workflowId, this.fileDetails.fileId);
      }
      this.getAodDetails();
      this.loadFileButtons(this.fileDetails.status);
      this.getPullGroup();
      this.step.getSteps();
    });
  }
  getAodDetails() {
    this.question.getAODReport(this.fileDetails.assemblyId, this.fileDetails.sessionId)
    .subscribe(res => {
      res.aodMasterDataDto.assemblyId = this.findAssemblyById(this.fileDetails.assemblyId);
      res.aodMasterDataDto.sessionId = this.findSessionById(this.fileDetails.sessionId);
      res.reportType = "AODReport";
      res.location = "report.pdf";
      res.IsBulletin = true;
      this.getPDF(res);
    });
  }
  getPDF(body) {
    const mediaType = "application/pdf";
    // this.loading = true;
    // this.finalUrl = null;
    this.question.getReport(body).subscribe((response) => {
      if (response) {
        var blob = new Blob([response], { type: mediaType });
        this.docUrl = URL.createObjectURL(blob);
        // this.showPdf = (this.finalUrl) ? true : false;
        // this.finalUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
        // this.loading = (this.showPdf && this.finalUrl) ? false : true;
      } else {
        // this.showPdf = false;
        // this.notify.showWarning("Sorry Report is not Available", "");
      }
    });
  }
  getAssemblyandSession() {
    this.cos.getAllAssembly().subscribe((res) => {
      this.assemblyList = res;
      this.cos.getAllSession().subscribe((data) => {
        this.sessionList = data;
      });
    });
  }
  findAssemblyById(id) {
    return this.assemblyList.find(x => x.id == id).assemblyId;
  }
  findSessionById(id) {
    return this.sessionList.find(x => x.id == id).sessionId;
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
      fromGroup: this.auth.getCurrentUser().fullName,
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
        this.getFileById();
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
      console.log(this.canPull);
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
  setStepStatus(value) {
    this.stepStatusDetail = value;
    this.getPullGroup();
    this.pullOrNot();
  }
  getWorkFlowRole(workflowId, fileId) {
    this.cos.getWorkFlowRole(workflowId, fileId).subscribe((Response) => {
      if (Response) {
        const data = Response;
        this.allActionUsers = data;
        if (data && data.length > 0) {
          const currentUser = data.find(x => x.userId === this.auth.getCurrentUser().userId);
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
}
