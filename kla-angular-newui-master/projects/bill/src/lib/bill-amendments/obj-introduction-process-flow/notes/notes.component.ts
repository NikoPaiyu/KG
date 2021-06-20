import { Component, Inject, Input, OnInit } from '@angular/core';
import { Route,Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { FileServiceService } from '../../../shared/services/file-service.service';
import { BillAmendmentsService } from '../../shared/bill-amendments.service';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'lib-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit {
  @Input() assignee;
  @Input() notesInfo;
  @Input() latestNote;
  newNote: string = "";
  noteType: string = "";
  updateNoteId: number;
  userId: any;
  constructor(
    private file: FileServiceService,
    private notification: NzNotificationService,
    @Inject('authService') private AuthService,
    private billAmendmentsService: BillAmendmentsService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.userId = AuthService.getCurrentUser().userId;
    
  }

  ngOnInit() {
    this.getAllNotes(); 
 
  }

  saveNote() {
    this.latestNote = this.notesInfo.notes[this.notesInfo.notes.length - 1];
    let add = false;
    if (this.latestNote) {
      if (this.latestNote.owner.userId !== this.userId) {
        add = true;
      } else {
        add = false;
      }
    } else {
      add = true;
    }
    if (this.newNote.charAt(0) !== " " 
    && add
    ) {
      let reqBody={
        masterId:this.notesInfo.id,
        note:  this.newNote,
        ownerId: this.userId
      }
      this.billAmendmentsService.createNote(reqBody).subscribe((data: any) => {
        this.notesInfo.notes = data;
        this.latestNote = this.notesInfo.notes[this.notesInfo.notes.length - 1];
        this._clearVariables();
      });
    } else if (this.newNote.charAt(0) === " ") {
      this.notification.create(
        "warning",
        "Warning",
        "First Character Should Not Be Space!"
      );
    }
    else if (!add) {
      this.notification.create(
        "warning",
        "Warning",
        "You can add only one note!"
      );
      this._clearVariables();
    }
  }
  updateNote(note) {
    if (note.note) {
      this.billAmendmentsService.updateNote(note).subscribe((data) => {
        this.notesInfo.notes = data;
        this.latestNote = this.notesInfo.notes[this.notesInfo.notes.length - 1];
        this._clearVariables();
      });
    } else {
      this.notification.create("warning", "Warning", "Please Add Note!");
    }
  }
  deleteNote(noteid) {
    debugger;
    this.billAmendmentsService.deleteNote(noteid).subscribe((data) => {
     this.notesInfo.notes = data;
    });
  this.notification.success("success","successfully deleted");
  this._clearVariables();
  this.ngOnInit();  
  this.getAllNotes();
  }
  getAllNotes() {
    if (this.notesInfo.id)
    this.billAmendmentsService.getAllNote(this.notesInfo.id).subscribe(Response => {
        this.notesInfo.notes = Response;
        this.latestNote = this.notesInfo.notes[this.notesInfo.notes.length - 1];
       // console.log(this.latestNote,this.notesInfo.notes)
      });
  }
  editNote(note) {
    note.isEdit = true;
  }
  
  // _buildReqParam(isEdit, note) {
  //   const reqBody = {
  //     // noteId: isEdit && note ? note.noteId : null,
  //     // fileId: this.notesInfo.fileId,
  //     // note: isEdit && note ? note.note : this.newNote,
  //     // referenceBusiness: [0],
  //     // referenceRules: [0],
  //     // temporary: isEdit && !this.noteType ? note.temporary : this.noteType,
  //     // userId: this.userId
  //     masterId:this.notesInfo.id,
  //     note: isEdit && note ? note.note : this.newNote,
  //     ownerId: this.userId
  //   };
  //   return reqBody;
  // }
  _clearVariables() {
    this.noteType = "";
    this.newNote = "";
   
  }

}