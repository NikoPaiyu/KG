import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { FileServiceService } from 'projects/pmbr/src/lib/shared/services/file-service.service';

@Component({
  selector: 'pmbr-add-notes',
  templateUrl: './add-notes.component.html',
  styleUrls: ['./add-notes.component.css']
})
export class AddNotesComponent implements OnInit {
  // @Input() assignee;
  @Input() notesInfo;
  // @Input() latestNote;
  // @Input() ratificationStatus;
  @Input() fileResponse;
  assignee: any;
  // notesInfo: any = [];
  latestNote: any = null;
  ratificationStatus = null;
  // fileResponse: any = [];
  newNote: string = '';
  noteType: string = '';
  updateNoteId: number;
  userId: any;
  fileId: any;
  stepStatusDetail: any = [];
  constructor(private formBuilder: FormBuilder, private fileService: FileServiceService,
              private notification: NzNotificationService,
              @Inject('authService') private AuthService) {
    this.userId = AuthService.getCurrentUser().userId;
  }

  ngOnInit() {
    this.getAllNotes();
    this.getWorkflowStatus();
    this.latestNote = this.notesInfo.notes[this.notesInfo.notes.length - 1];
  }
  // ngAfterviewinit() {
  // }
  getWorkflowStatus() {
    this.fileService
      .checkWorkFlowStatus(this.fileResponse.workflowId)
      .subscribe((Res) => {
        this.stepStatusDetail = Res;
        const current = this.stepStatusDetail[this.stepStatusDetail.length - 1];
        this.assignee = Number(current.assignee);
      });
  }
  saveNote() {
    if (this.notesInfo && this.notesInfo.notes) {
      this.latestNote = this.notesInfo.notes[this.notesInfo.notes.length - 1];
    }
    let add = false;
    if (this.latestNote) {
      if (this.latestNote.user.userId !== this.userId) {
        add = true;
      } else {
        add = false;
      }
    } else {
      add = true;
    }
    if (this.newNote.charAt(0) !== ' ' && add) {
      this.fileService.createNote(this._buildReqParam(false, null)).subscribe((data: any) => {
        // debugger;
        // this.notesInfo.notes=[];
        this.notesInfo.notes = data;
        this.notification.create(
          'success',
          'Success',
          'Note added successfully!'
        );
        this.latestNote = this.notesInfo.notes[this.notesInfo.notes.length - 1];
        this._clearVariables();
      });
    } else if (this.newNote.charAt(0) === ' ') {
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
      this._clearVariables();
    }
  }
  updateNote(note) {
    if (note) {
      this.fileService.updateNote(this._buildReqParam(true, note)).subscribe((data) => {
        this.notesInfo.notes = data;
        this.notification.create(
          'success',
          'Success',
          'Note updated successfully!'
        );
        this.latestNote = this.notesInfo.notes[this.notesInfo.notes.length - 1];
        this._clearVariables();
      });
    } else {
      this.notification.create('warning', 'Warning', 'Please Add Note!');
    }
  }
  deleteNote(noteid) {
    const body = {
      fileId: this.fileResponse.fileId,
      noteId: noteid,
      userId: this.userId,
    };
    this.fileService.deleteNoteById(body).subscribe((data) => {
      this.notesInfo.notes = data;
      this.notification.create(
        'success',
        'Success',
        'Note deleted successfully!'
      );
      this._clearVariables();
      // this.getAllNotes();
    });
  }
  getAllNotes() {
    if (this.fileResponse.fileId) {
      this.fileService.getAllNotes(this.fileResponse.fileId).subscribe(Response => {
        this.notesInfo.notes = Response;
      });
    }
  }
  editNote(note) {
    note.isEdit = true;
  }
  _buildReqParam(isEdit, note) {
    const reqBody = {
      noteId: isEdit && note ? note.noteId : null,
      fileId: this.fileResponse.fileId,
      note: isEdit && note ? note.note : this.newNote,
      referenceBusiness: [0],
      referenceRules: [0],
      temporary: isEdit && !this.noteType ? note.temporary : this.noteType,
      userId: this.userId
    };
    return reqBody;
  }
  _clearVariables() {
    this.noteType = '';
    this.newNote = '';
  }

  setRole(roles) {
    if (roles.find(x => x.roleName === 'speaker')) {
      return [roles.find(x => x.roleName === 'speaker')];
    } else {
      return roles;
    }
  }

}
