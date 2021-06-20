import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/auth/shared/services/auth.service';
import { NotificationCustomService } from 'src/app/shared/services/notification.service';
import { SoaService } from '../../services/soa.service';

@Component({
  selector: 'app-soa-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
})
export class SoaNotesComponent implements OnInit {
  @Input() set setsoaId(value) {
    this.soaId = value;
  }
  @Input() shownotes;
  currentAssigneeValue: boolean;
  @Input() set currentAssignee(value: boolean) {
       this.currentAssigneeValue = value;
  }
  soaId;
  notesList = [];
  editedNote = '';
  noteGiven = '';
  editedNoteOn = false;
  constructor(
    private question: SoaService,
    private auth: AuthService,
    private notify: NotificationCustomService
  ) {}

  ngOnInit() {
    this.getNoteslist();
  }
  getNoteslist(id = 0) {
    if (id) {
      this.soaId = id;
    }
    this.question.getSoaNoteById(this.soaId).subscribe((res: any) => {
      this.notesList = res;
      const filterValue = 'questionVersion';
      this.notesList.sort((a, b) => {
        if (a[filterValue] > b[filterValue]) { return 1; }
        if (a[filterValue] < b[filterValue]) { return -1; }
        if (a.createDate < b.createDate) { return -1; }
        if (a.createDate > b.createDate) { return 1; }
        return 0;
      });
      this.notesList.forEach(async (item) => {
        if (
          this.auth.getCurrentUser().userId === item.ownerId &&
          item.status === 'INTERIM'
        ) {
          item.editNote = true;
        } else {
          item.editNote = false;
        }
        item.noteditable = false;
      });
    });
  }
  handleNotes() {
    this.shownotes = false;
  }
  editNotes(index): void {
    this.notesList[index].editNote = false;
    this.notesList[index].noteditable = true;
    this.notesList[index].noteditable === true
      ? (this.editedNoteOn = true)
      : (this.editedNoteOn = false);
    this.editedNote = this.notesList[index].note;
  }
  updateNotes(index, data) {
    if (!this.editedNote) {
      this.notify.showError('Error', 'Plesae Enter Notes');
      return;
    }
    this.question
      .addSoaNote(
        {
          id: data.id,
          note: this.editedNote,
          ownerId: this.auth.getCurrentUser().userId,
          createDate: new Date()
        },
        this.soaId
      )
      .subscribe((element) => {
        this.notesList[index].note = this.editedNote;
        this.notesList[index].createDate = new Date();
        this.notesList[index].editNote = true;
        this.notesList[index].noteditable = false;
        this.editedNoteOn = false;
        this.notify.showSuccess('Success', 'Note Updated Successfully');
      });
  }
  saveNotes(manual): void {
    if (this.notesList.length > 0 && this._isAddedNote()) {
      this.noteGiven = '';
      if (manual) {
        this.notify.showWarning(
          'Warning',
          'Sorry, You can only edit existing Note'
        );
      }
      return;
    }
    if (!this.noteGiven) {
      this.notify.showError('Error', 'Please Enter Notes');
      return;
    }
    this.question
      .addSoaNote(
        {
          note: this.noteGiven,
          ownerId: this.auth.getCurrentUser().userId
        },
        this.soaId
      )
      .subscribe((element) => {
        if (manual) {
          this.notify.showSuccess('Success', 'Note added successfully');
        }
        this.notesList.push(element);
        const i = this.notesList.length;
        this.notesList[i - 1].editNote = true;
        this.notesList[i - 1].noteditable = false;
        this.noteGiven = '';
      });
  }
  _isAddedNote() {
    // tslint:disable-next-line: only-arrow-functions
    const lastNote = this.notesList.reduce(function(prev, current) {
      return prev.id > current.id ? prev : current;
    });
    if (
      this.auth.getCurrentUser().userId === lastNote.ownerId &&
      lastNote.status === 'INTERIM'
    ) {
      return true;
    }
    return false;
  }
  deleteNoteById(id, index) {
    this.question.deleteNoteById(id).subscribe(data => {
      this.notify.showSuccess('Success', 'Note deleted successfully');
      this.notesList.splice(index, 1);
    });
  }
}

