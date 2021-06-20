import { Component, OnInit, Input, Inject } from "@angular/core";
import { FileServiceService } from "../../shared/services/file-service.service";
import { NzNotificationService } from "ng-zorro-antd";

@Component({
  selector: "committee-notes",
  templateUrl: "./notes.component.html",
  styleUrls: ["./notes.component.scss"],
})
export class NotesComponent implements OnInit {
  @Input() assignee;
  @Input() notesInfo;
  @Input() latestNote;
  @Input() ratificationStatus;
  @Input() fileResponse;
  newNote: string = "";
  noteType: string = "";
  updateNoteId: number;
  userId: any;
  stepStatusDetail: any = [];
  constructor(
    private file: FileServiceService,
    private notification: NzNotificationService,
    @Inject("authService") private AuthService
  ) {
    this.userId = AuthService.getCurrentUser().userId;
  }

  ngOnInit() {
    this.getAllNotes();
    this.getWorkflowStatus();
  }
  getWorkflowStatus() {
    this.file
      .checkWorkFlowStatus(this.fileResponse.workflowId)
      .subscribe((Res) => {
        this.stepStatusDetail = Res;
        const current = this.stepStatusDetail[this.stepStatusDetail.length - 1];
        this.assignee = Number(current.assignee);
        // console.log('assignee', this.assignee);
        // console.log('userId', this.userId);
    });
  }
  saveNote() {
    this.latestNote = this.notesInfo.notes[this.notesInfo.notes.length - 1];
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
    if (this.newNote.charAt(0) !== "" && add) {
      this.file
        .createNote(this._buildReqParam(false, null))
        .subscribe((data: any) => {
          this.notesInfo.notes = data;
          this.latestNote = this.notesInfo.notes[
            this.notesInfo.notes.length - 1
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
      this.file
        .updateNote(this._buildReqParam(true, note))
        .subscribe((data) => {
          this.notesInfo.notes = data;
          this.latestNote = this.notesInfo.notes[
            this.notesInfo.notes.length - 1
          ];
          this._clearVariables();
        });
    } else {
      this.notification.create("warning", "Warning", "Please Add Note!");
    }
  }
  deleteNote(noteid) {
    const body = {
      fileId: this.notesInfo.fileId,
      noteId: noteid,
      userId: this.userId,
    };
    this.file.deleteNoteById(body).subscribe((data) => {
      this.notesInfo.notes = data;
      this._clearVariables();
    });
  }
  getAllNotes() {
    if (this.notesInfo.fileId)
      this.file.getAllNotes(this.notesInfo.fileId).subscribe((Response) => {
        this.notesInfo.notes = Response;
      });
  }
  editNote(note) {
    note.isEdit = true;
  }
  _buildReqParam(isEdit, note) {
    const reqBody = {
      noteId: isEdit && note ? note.noteId : null,
      fileId: this.notesInfo.fileId,
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
}
