import { Component, Inject, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NzNotificationService } from "ng-zorro-antd";
import { GenericfileService } from "../../../shared/services/genericfile.service";
@Component({
  selector: "generic-file-tab-notes",
  templateUrl: "./file-tab-notes.component.html",
  styleUrls: ["./file-tab-notes.component.css"],
})
export class FileTabNotesComponent implements OnInit {
  @Input() fileDetails;
  userId: any = "";

  assignee: any;
  latestNote: any = null;
  ratificationStatus = "PENDING";
  newNote: string = "";
  noteType: string = "";
  modules: any;
  constructor(
    private fileService: GenericfileService,
    private notification: NzNotificationService,
    private formBuilder: FormBuilder,
    @Inject("authService") private AuthService
  ) {
    this.userId = AuthService.getCurrentUser().userId;
  }

  ngOnInit() {
    this.setEditorConfig();
    this.assignee = this.userId;
    this.latestNote = this.fileDetails.notes[this.fileDetails.notes.length - 1];
  }
  editNote(note) {
    note.isEdit = true;
  }
  saveNote() {
    if (this.fileDetails.notes && this.fileDetails.notes.notes) {
      this.latestNote = this.fileDetails.notes.notes[
        this.fileDetails.notes.notes.length - 1
      ];
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
    if (this.newNote.charAt(0) !== " " && add) {
      this.fileService
        .createNote(this._buildReqParam(false, null))
        .subscribe((data: any) => {
          // debugger;
          // this.fileDetails.notes.notes=[];
          this.fileDetails.notes = data;
          this.notification.create(
            "success",
            "Success",
            "Note added successfully!"
          );
          this.latestNote = this.fileDetails.notes[
            this.fileDetails.notes.length - 1
          ];
          this._clearVariables();
        });
    } else if (this.newNote.charAt(0) === " ") {
      this.notification.create(
        "warning",
        "Warning",
        "First Character Should Not Be Space!"
      );
    } else if (!add) {
      this.notification.create(
        "warning",
        "Warning",
        "You can add only one note!"
      );
      this._clearVariables();
    }
  }
  updateNote(note) {
    if (note) {
      this.fileService
        .updateNote(this._buildReqParam(true, note))
        .subscribe((data) => {
          this.fileDetails.notes = data;
          this.notification.create(
            "success",
            "Success",
            "Note updated successfully!"
          );
          this.latestNote = this.fileDetails.notes[
            this.fileDetails.notes.length - 1
          ];
          this._clearVariables();
        });
    } else {
      this.notification.create("warning", "Warning", "Please Add Note!");
    }
  }
  deleteNote(noteid) {
    const body = {
      fileId: this.fileDetails.fileId,
      noteId: noteid,
      userId: this.userId,
    };
    this.fileService.deleteNoteById(body).subscribe((data) => {
      this.fileDetails.notes = data;
      this.notification.create(
        "success",
        "Success",
        "Note deleted successfully!"
      );
      this._clearVariables();
      // this.getAllNotes();
    });
  }
  _buildReqParam(isEdit, note) {
    const reqBody = {
      noteId: isEdit && note ? note.noteId : null,
      fileId: this.fileDetails.fileId,
      note: isEdit && note ? note.note : this.newNote,
      referenceBusiness: [0],
      referenceRules: [0],
      temporary: isEdit && !this.noteType ? note.temporary : this.noteType,
      userId: this.userId,
    };
    return reqBody;
  }
  _clearVariables() {
    this.noteType = "";
    this.newNote = "";
  }

  setEditorConfig() {
    this.modules = {
      toolbar: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline'],
        ['link'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
      ]
    };
  }
}
