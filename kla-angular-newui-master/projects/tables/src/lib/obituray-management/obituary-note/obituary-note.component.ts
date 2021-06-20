import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { HtmldiffferenceService } from '../../shared/services/html-differences.service';
import { ObituaryService } from '../../shared/services/obituary.service';

@Component({
  selector: 'tables-obituary-note',
  templateUrl: './obituary-note.component.html',
  styleUrls: ['./obituary-note.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ObituaryNoteComponent implements OnInit {
  @Input() isFileView = false;
  @Input() noteContent = null;
  @Input() obituaryDetails;
  @Output() notechange = new EventEmitter<string>();
  @Output() reload = new EventEmitter<boolean>();
  @Input() currentAssignee = false;
  showPreview = false;
  notePreview = '';
  editMode = false;
  selectedVersion;
  versionDetails = [];
  versionOptions = [];
  note: any;
  disableUpdateNote;
  fileStatus: any;
  constructor(private service: ObituaryService, private notification: NzNotificationService, private diff: HtmldiffferenceService) { }
  currentVersion;
  ngOnInit() {
    console.log(this.obituaryDetails);
    if (this.isFileView) {
      this.getVersionDetails();
    }
  }
  noteContentChange(event) {
    if (event.event === 'text-change') {
      this.notechange.emit(event.html);
      if (this.isFileView) {
        this.note = event.html;
      }
    }
  }
  getVersionDetails(){
    let item = Object.values(this.obituaryDetails.version);
    if (item) {
      this.versionOptions = (item as any).map(x => ({cretationDate: x.cretationDate, id: x.id, roles: x.klaRoles, ownerName: x.ownerName, version: x.version}));
      this.selectedVersion = this.versionOptions[this.versionOptions.length -1].version;
    }
    return item;
  }
  updateNote() {
    this.obituaryDetails.obituary.note = this.note;
    const reqBody = this.service.buildUpdateRequest(this.obituaryDetails.obituary, 'UPDATE_NOTE');
    this.service.updateObituary(reqBody).subscribe(data => {
      this.reload.emit(true);
      this.notification.success('Success', 'Note updated successfully');
      this.editMode = false;
    });
  }
  
  GetRoles(roles) {
    if (roles) {
      return roles.map((x) => x.roleName).join('/');
    } else {
      return '';
    }
  }
  versionChange(event) {
    const versionDetails: any = Object.values(this.obituaryDetails.version);
    const version = versionDetails.find(x => x.version === Number(event));
    const latestVersion = versionDetails[versionDetails.length - 1];
    if (version && version.obituaryNote && latestVersion && latestVersion.obituaryNote) {
      this.noteContent = this.diff.htmlDiff(latestVersion.obituaryNote, version.obituaryNote);
    }
    if (event !== versionDetails.length) {
      this.disableUpdateNote = true;
      this.editMode = false;
    } else {
      this.disableUpdateNote = false;
    }
  }
  editNote() {
    this.editMode = true;
    const versionDetails: any = Object.values(this.obituaryDetails.version);
    const latestVersion = versionDetails[versionDetails.length -1];
    this.noteContent = latestVersion.obituaryNote;
  }
  getObituaryPreview() {
    const obituaryId  = this.obituaryDetails.id || this.obituaryDetails.obituary.id;
    this.service.getObituaryPreview(obituaryId).subscribe(data => {
      this.notePreview = data;
      this.notePreview = this.notePreview.replace('PDF Result Template', '');
      this.showPreview = true;
    });
  }
  closePreview() {
    this.showPreview = false;
  }
}
