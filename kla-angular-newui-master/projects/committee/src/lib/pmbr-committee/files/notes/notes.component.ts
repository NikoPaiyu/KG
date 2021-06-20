import { Component, Inject, Input, OnInit } from "@angular/core";
import { NzNotificationService } from "ng-zorro-antd";
import { FileServiceService } from "../../../shared/services/file-service.service";

@Component({
  selector: "committee-notes",
  templateUrl: "./notes.component.html",
  styleUrls: ["./notes.component.css"],
})
export class NotesComponent implements OnInit {
  @Input() fileResponse;
  @Input() assignee;

  user: any;
  noteType: string = "";
  newNote: string = "";
  latestNote: any;

  constructor(
    @Inject("authService") public AuthService,
    private file: FileServiceService,
    private notification: NzNotificationService
  ) {
    this.user = AuthService.getCurrentUser();
  }

  ngOnInit() {
    this.latestNote = this.fileResponse.notes[
      this.fileResponse.notes.length - 1
    ];
  }

  saveNote() {
    if (this.fileResponse && this.fileResponse.notes) {
      this.latestNote = this.fileResponse.notes[
        this.fileResponse.notes.length - 1
      ];
    }
    let add = false;
    if (this.latestNote) {
      if (this.latestNote.user.userId !== this.user.userId) {
        add = true;
      } else {
        add = false;
      }
    } else {
      add = true;
    }
    if (this.newNote.charAt(0) !== " " && add) {
      this.file
        .createNote(this._buildReqParam(false, null))
        .subscribe((data: any) => {
          this.fileResponse.notes = data;
          this.notification.create(
            "success",
            "Success",
            "Note added successfully!"
          );
          this.latestNote = this.fileResponse.notes[
            this.fileResponse.notes.length - 1
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

  _buildReqParam(isEdit, note) {
    const reqBody = {
      noteId: isEdit && note ? note.noteId : null,
      fileId: this.fileResponse.fileId,
      note: isEdit && note ? note.note : this.newNote,
      referenceBusiness: [0],
      referenceRules: [0],
      temporary: isEdit && !this.noteType ? note.temporary : this.noteType,
      userId: this.user.userId,
    };
    return reqBody;
  }

  _clearVariables() {
    this.noteType = "";
    this.newNote = "";
  }

  editNote(note) {
    note.isEdit = true;
  }
  updateNote(note) {
    if (note) {
      this.file
        .updateNote(this._buildReqParam(true, note))
        .subscribe((data) => {
          this.fileResponse.notes = data;
          this.latestNote = this.fileResponse.notes[
            this.fileResponse.notes.length - 1
          ];
          this._clearVariables();
        });
    } else {
      this.notification.create("warning", "Warning", "Please Add Note!");
    }
  }
  deleteNote(noteId) {
    const body = {
      fileId: this.fileResponse.fileId,
      noteId: noteId,
      userId: this.user.userId,
    };
    this.file.deleteNoteById(body).subscribe((data) => {
      this.fileResponse.notes = data;
      this._clearVariables();
    });
  }
}
