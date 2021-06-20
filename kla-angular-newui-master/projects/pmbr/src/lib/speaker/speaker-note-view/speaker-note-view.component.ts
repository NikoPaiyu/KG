import { ActivatedRoute, Router } from '@angular/router';
import { PmbrCommonService } from '../../shared/services/pmbr-common.service';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'pmbr-speaker-note-view',
  templateUrl: './speaker-note-view.component.html',
  styleUrls: ['./speaker-note-view.component.css']
})
export class SpeakerNoteViewComponent implements OnInit {
  speakerNote;
  noteId;
  createNoticeForm: FormGroup;
  button = false;
  constructor( private pmbrCommonService: PmbrCommonService, 
    private route: ActivatedRoute,
    private router: Router,private formBuilder: FormBuilder) { 
    this.noteId = this.route.snapshot.params.id;
  }

  ngOnInit() {
    this.speakerNoteById()
  }
  initiateForm() {
    this.createNoticeForm = this.formBuilder.group({
      subject: [null, Validators.required],
      description: [null, Validators.required]
    })
  }
speakerNoteById(){
  this.pmbrCommonService.getSpeakerNoteById(this.noteId).subscribe(res => {
    this.speakerNote = res;
    console.log(this.speakerNote);
  });
}
saveOrCancel(event) {
  if(event){
    this.button = true;
  }
  else{
    this.button = false;
  }
}

}
