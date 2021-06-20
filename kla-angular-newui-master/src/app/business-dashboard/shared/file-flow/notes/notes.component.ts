import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/shared/services/auth.service';
import { NotificationCustomService } from 'src/app/shared/services/notification.service';
import { FileService } from 'src/app/shared/services/file.service';


@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {
  @Input() fileDetails;
  @Input() notes = new EventEmitter();
  notesList: any = [];
  currentUserID;
  latest;
  fileButtons: any;
  createNoteForm: FormGroup;
  ShowRules;
  allRules;
  editMode;
  fileId = null;
  hideNormal;
  constructor(private fb: FormBuilder, private user: AuthService,
              private notify: NotificationCustomService, private file: FileService) { }

  ngOnInit() {
    this.createNoteForm = this.fb.group({
      noteid: [null],
      note: ['', Validators.required],
      tempFlag: [false, Validators.required]
    });
    this.fileId = this.fileDetails.fileId;
    this.currentUserID = this.user.getCurrentUser().userId;
    this.refreshNotes();
  }
  getRoles(roles) {
    return roles.map((x) => x.roleName).join('/');
  }
  editNote(data) {
    this.editMode = true;
    this.createNoteForm.setValue({
      noteid: data.noteId,
      note: data.note,
      tempFlag: data.temporary
    });
  }
  deleteNote(noteId) {
    const body = {
      fileId: this.fileId,
      noteId,
      userId: this.user.getCurrentUser().userId
    };
    this.file.deleteNoteById(body).subscribe(Res => {
      this.notify.showSuccess('Success', 'Note Deleted successfully');
      this.notesList = Res;
      this.refreshNotes();
      const tempNote: any = this.notesList.filter(item => item.temporary === true
      );
      if (tempNote.length > 0) {
        this.hideNormal = false;
      } else {this.hideNormal = true; }
    });
  }
  cancel() {

  }
  convertTONormal(Ntd) {
    const body = {
      fileId: this.fileId,
      noteId: Ntd,
      userId: this.user.getCurrentUser().userId
    };
    console.log(body);
    this.file.convertTONormal(body).subscribe((Response) => {
      if (Response) {
        console.log(Response);
        this.refreshNotes();
        this.notify.showSuccess('Success', 'Yellow Note Successfully Converted To Normal Note');
        this.hideNormal = true;
      }
    });
  }
  cancelRuleSelection() {

  }
  applyRule() {
    
  }
  refreshNotes() {
    this.file.getAllNotes(this.fileId).subscribe(data => {
      this.notesList = data;
      this.latest = this.notesList[this.notesList.length - 1];
        // if(latest && latest['userId'] === this.currentUserID) {
        //   this.latestone = true;
        // } else{this.latestone = false;}
      const tempNote: any = this.notesList.filter(item => item.temporary === true);
      if (tempNote.length > 0) {
          this.hideNormal = false;
      }
      this.notes.emit(this.notesList);
    });
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
      this.refreshNotes();
      const tempNote: any = this.notesList.filter(item => item.temporary === true
      );
      let latestNote = this.notesList.pop();
      if (tempNote.length < 1 && !(latestNote && latestNote.userId === this.currentUserID)) {
        this.file.createNote(this.fileId, data).subscribe((Response) => {
          if (Response) {
            console.log(Response);
            this.createNoteForm.controls.tempFlag.setValue(false);
            this.notify.showSuccess('Success', 'Note Saved Successfully');
            latestNote = [];
            this.refreshNotes();
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
        this.refreshNotes();
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
    this.file.updateNote(this.fileId, data).subscribe((Response) => {
      console.log(Response);
      if (Response) {
        this.editMode = false;
        this.notify.showSuccess('Success', 'Note Updated successfully');
        this.createNoteForm.reset();
        this.refreshNotes();
    }
    });
  }
}
