import { Component, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { differenceInCalendarDays } from 'date-fns';
import { SoaService } from '../shared/services/soa.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  AssemblyList,
  SessionList,
} from '../../calender-of-sitting/shared/models/cobmodel';
import { NotificationCustomService } from 'src/app/shared/services/notification.service';
import { NzDatePickerComponent } from 'ng-zorro-antd';
import { Router, ActivatedRoute } from '@angular/router';
import { UserManagementService } from '../../user-management/shared/services/user-management.service';
import { AuthService } from 'src/app/auth/shared/services/auth.service';
import { SoaNotesComponent } from '../shared/components/notes/notes.component';
import { CalenderofsittingService } from '../../calender-of-sitting/shared/services/calenderofsitting.service';

@Component({
  selector: 'app-schedule-of-activity',
  templateUrl: './schedule-of-activity.component.html',
  styleUrls: ['./schedule-of-activity.component.scss'],
})
export class ScheduleOfActivityComponent implements OnInit, OnChanges {
  showTracker = false;
  isEdit = false;
  showSessonFilter = true;
  isChecked = true;
  visible = false;
  assemblyId = null;
  sessionId = null;
  today = new Date();
  date = null;
  listOfData = [];
  listOfDetails = [];
  soaId = null;
  soaDetails;
  sessionDetails: FormGroup;
  assemblyList: AssemblyList[];
  sessionList: SessionList[];
  currentAssignee = true;
  disableNotes = true;
  quickOptions = [
    { label: 'Can be admitted', disallowStatus: false },
    { label: 'Can be disallowed as per rule', disallowStatus: true },
    { label: 'Not allowed as per rule', disallowStatus: true },
  ];
  selectedTags = [];
  currentRuleStatement = '';
  ShowRules = false;
  allRules: any = [];
  showNotes = false;
  @ViewChild(SoaNotesComponent, { static: false }) notes: SoaNotesComponent;
  noteForm: FormGroup = this.fb.group({
    id: [null],
    note: ['', Validators.required],
  });
  disabledDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, this.today) < 0;
  }
  disableSave: boolean;
  onChange(result: Date): void {
    console.log('onChange: ', result);
  }
  constructor(
    private service: SoaService,
    public Service: SoaService,
    private fb: FormBuilder,
    private notify: NotificationCustomService,
    private router: Router,
    private route: ActivatedRoute,
    private user: AuthService,
    private cos: CalenderofsittingService
  ) {
    this.soaId = this.route.snapshot.params.id;
    if (this.soaId) {
      this.getSoaById();
    }
    if (this.route.snapshot.params.id) {
      this.showSessonFilter = false;
    }
  }

  ngOnInit() {
    this.getAssemblySessionDetails();
    this.service.getQuestionPermissions(this.user.getCurrentUser().userId);
  }
  getAssemblySessionDetails() {
    this.cos.getAssemblySessionDetails().subscribe(data => {
      this.assemblyList = data.assemblySession;
      // this.assemblyId = data.activeAssemblySession.assemblyId;
      this.filterAssembly();
      // this.sessionId = data.activeAssemblySession.sessionId;
      this.getSoa();
    });
  }
  filterAssembly() {
    const assemblyDetail = this.assemblyList.find(x => x.id == this.assemblyId);
    if (assemblyDetail) {
      this.sessionList = (assemblyDetail as any).session;
    }
    this.sessionId = null;
  }
  ngOnChanges(change: SimpleChanges) {
    console.log('here');
  }
  // init session form
  initSessionForm() {
    this.sessionDetails = this.fb.group({
      assemblyId: [null, Validators.required],
      sessionId: [null, Validators.required],
    });
  }
  // refresh soa dates
  refreshSoa() {
    this.service
      .refreshSoa(this.assemblyId, this.sessionId)
      .subscribe((data) => {
        this.soaDetails = data;
        this.soaDetails.currentAssignee = true;
        this.soaId = data.id;
        this.listOfData = data.scheduleDates;
        this.notify.showSuccess('Success', 'soa refreshed successfully');
      });
  }
  blockediting(event, i) {
    console.log(event, i);
  }
  getAssembly() {
    this.service.getAllAssembly().subscribe((res) => {
      this.assemblyList = res;
      const ids = this.assemblyList.map((x) => Number(x.id));
      // this.assemblyId = Math.max(...ids);
    });
  }
  getSession() {
    this.service.getAllSession().subscribe((res) => {
      this.sessionList = res;
      const ids = this.sessionList.map((x) => Number(x.id));
      // this.sessionId = Math.max(...ids);
    });
  }
  // get soa details
  getSoa() {
    if (this.assemblyId && this.sessionId) {
      this.service.getPendingSoaData(this.assemblyId, this.sessionId, this.user.getCurrentUser().userId).subscribe(data => {
        this.soaDetails = data;
        this.soaId = data.id;
        console.log(data.id);
        this.currentAssignee = data.currentAssignee;
        if (data.scheduleDates && data.scheduleDates.length > 0) {
          this.listOfData = data.scheduleDates;
          this.notes.getNoteslist(data.id);
          this.disableNotes = false;
        } else {
          this.listOfData = [];
          this.currentAssignee = true;
        }
      });
    }
  }
  // get soa details by id
  getSoaById() {
    if (this.soaId) {
      this.service.getSoaDataById(this.soaId, this.user.getCurrentUser().userId).subscribe(data => {
        this.currentAssignee = data.currentAssignee;
        this.soaDetails = data;
        this.soaId = data.id;
        if (data.scheduleDates && data.scheduleDates.length > 0) {
          this.listOfData = data.scheduleDates;
          this.notes.getNoteslist(this.soaId);
          this.disableNotes = false;
        } else {
          this.listOfData = [];
          this.currentAssignee = true;
        }
      });
    }
  }
  // save soa
  saveSoa() {
    const tempData = this.listOfData.map(x => {return {
      answerDate: this.formatDate(x.answerDate),
      answerReceivedAtSecreteriatDate: this.formatDate(x.answerReceivedAtSecreteriatDate),
      distributedToMembersDate: this.formatDate(x.distributedToMembersDate),
      lottingDate: this.formatDate(x.lottingDate),
      printFromPressDate: this.formatDate(x.printFromPressDate),
      sendToDepartmentsDate: this.formatDate(x.sendToDepartmentsDate),
      sendToPressDate: this.formatDate(x.sendToPressDate),
      tempReplyIssueDeadlineDate: this.formatDate(x.tempReplyIssueDeadlineDate)
      };
    });
    const check = tempData.some(x => Object.values(x).includes(null));
    if (check) {
      this.notify.showWarning('Success', 'please complete schedule');
    } else {
      const finalValue = this.listOfData.map(x => {
      x.answerDate = this.formatDate(x.answerDate);
      x.answerReceivedAtSecreteriatDate = this.formatDate(x.answerReceivedAtSecreteriatDate);
      x.distributedToMembersDate = this.formatDate(x.distributedToMembersDate);
      x.lottingDate = this.formatDate(x.lottingDate);
      x.printFromPressDate = this.formatDate(x.printFromPressDate);
      x.sendToDepartmentsDate = this.formatDate(x.sendToDepartmentsDate);
      x.sendToPressDate = this.formatDate(x.sendToPressDate);
      x.tempReplyIssueDeadlineDate = this.formatDate(x.tempReplyIssueDeadlineDate);
      return x;
    });
      if (finalValue && finalValue.length > 0) {
        this.soaDetails.scheduleDates = finalValue;
        this.service.saveSoa(this.soaDetails).subscribe((data) => {
          this.soaId = data.id;
          this.disableNotes = false;
          this.notify.showSuccess('Success', 'Schedule saved successfully!');
        });
      }
    }
    this.disableSaveButton();
  }
  formatDate(date: Date) {
    if (date) {
      const d = new Date(date);
      return  d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
    }
    return null;
  }
  submitSoa() {
    if (this.checkNoteAdded()) {
      let role = this.user.getCurrentUser().authorities[0];
      if (role === 'officeAssistant') {
        role = 'assistant';
      }
      this.service.forwardSoa(this.soaId, role).subscribe(res => {
        this.notify.showSuccess('Success', 'Schedule submitted successfully!');
        this.router.navigate(['/business-dashboard/soa/list']);
      });
    } else {
      this.notify.showWarning('Warning', 'You need to add a note!');
    }
  }
  checkNoteAdded() {
    if (this.notes.notesList && this.notes.notesList.length > 0) {
      const lastNote = this.notes.notesList[this.notes.notesList.length - 1];
      if (lastNote && lastNote.ownerId === this.user.getCurrentUser().userId) {
        return true;
      }
    }
    return false;
  }
  addApproveNote() {
    if (!this.checkNoteAdded()) {
      this.notes.noteGiven = 'Can be Approved';
      this.notes.saveNotes(false);
    }
  }
  // approce soa
  approvesoa() {
    this.addApproveNote();
    this.service.approveSoa(this.soaId).subscribe((data) => {
      this.notify.showSuccess('Success', 'Schedule approved successfully!');
      this.router.navigate(['/business-dashboard/soa/list']);
    });
  }
  drawer(): void {
    this.visible = !this.visible;
    this.showTracker = false;
  }
  saveNote() {}
  cancel() {}
  deleteNote() {}
  checkDate(value, picker: NzDatePickerComponent, index, data) {
    const ansDate = new Date(data.answerDate);
    const diffInDays = differenceInCalendarDays(value, ansDate);
    if (diffInDays >= 0) {
      picker.writeValue(null);
      this.notify.showWarning('Warning!', 'Dont Add Previous date');
    } else {
      picker.writeValue(value);
    }
  }
  checkSecondDate(value, picker: NzDatePickerComponent, index, data) {
    const lotDate = new Date(data.lottingDate);
    const diffInDays = differenceInCalendarDays(value, lotDate);
    if (diffInDays < 1) {
      picker.writeValue(null);
      this.listOfData[index].sendToPressDate = null;
      this.notify.showWarning('Warning!', 'Dont Add Previous date');
    } else {
      picker.writeValue(value);
    }
    this.enableSaveButton();
  }
  checkThirdDate(value, picker: NzDatePickerComponent, index, data) {
    const pressDate = new Date(data.sendToPressDate);
    const diffInDays = differenceInCalendarDays(value, pressDate);
    if (diffInDays < 1) {
      picker.writeValue(null);
      this.listOfData[index].printFromPressDate = null;
      this.notify.showWarning('Warning!', 'Dont Add Previous date');
    } else {
      picker.writeValue(value);
    }
    this.enableSaveButton();
  }
  checkFourthDate(value, picker: NzDatePickerComponent, index, data) {
    const printDate = new Date(data.printFromPressDate);
    const diffInDays = differenceInCalendarDays(value, printDate);
    if (diffInDays < 1) {
      picker.writeValue(null);
      this.listOfData[index].sendToDepartmentsDate = null;
      this.notify.showWarning('Warning!', 'Dont Add Previous date');
    } else {
      picker.writeValue(value);
    }
    this.enableSaveButton();
  }
  checkFifthDate(value, picker: NzDatePickerComponent, index, data) {
    const depDate = new Date(data.sendToDepartmentsDate);
    const diffInDays = differenceInCalendarDays(value, depDate);
    if (diffInDays < 1) {
      picker.writeValue(null);
      this.listOfData[index].distributedToMembersDate = null;
      this.notify.showWarning('Warning!', 'Dont Add Previous date');
    } else {
      picker.writeValue(value);
    }
    this.enableSaveButton();
  }
  checkSixthDate(value, picker: NzDatePickerComponent, index, data) {
    const disDate = new Date(data.distributedToMembersDate);
    const diffInDays = differenceInCalendarDays(value, disDate);
    if (diffInDays < 1) {
      picker.writeValue(null);
      this.listOfData[index].answerReceivedAtSecreteriatDate = null;
      this.notify.showWarning('Warning!', 'Dont Add Previous date');
    } else {
      picker.writeValue(value);
    }
    this.enableSaveButton();
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
    this.service.getallrules().subscribe((Response) => {
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
      console.log('ruleData', ruleData);
      const noteData = this.noteForm.value.note;
      if (ruleApplyed.length > 0) {
        this.noteForm.patchValue({
          note: `${this.currentRuleStatement} ${ruleCode} ${ruleData} `,
        });
        this.selectedTags.push(`${this.currentRuleStatement} ${ruleCode}`);
      }
      this.ShowRules = false;
      this.cancelRuleSelection();
    } else {
      this.notify.showWarning('Warning!', 'Select Rule!');
    }
  }
  onChecked(event) {
    if (event === true) {
      this.isChecked = false;
    } else {
      this.isChecked = true;
    }
  }
  handleNotes(value) {
    this.showNotes = value;
  }
  handleTracker(value) {
    this.showTracker = value;
  }
  enableSaveButton() {
    this.disableSave = false;
  }
  disableSaveButton() {
    this.disableSave = true;
  }
}
