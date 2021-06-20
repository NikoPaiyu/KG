import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PmbrCommonService } from '../../shared/services/pmbr-common.service';

@Component({
  selector: 'pmbr-member-reading-view',
  templateUrl: './member-reading-view.component.html',
  styleUrls: ['./member-reading-view.component.css']
})
export class MemberReadingViewComponent implements OnInit {
  memberReading;
  noteId;
  createNoticeForm: FormGroup;
  button = false;
  constructor(private pmbrCommonService: PmbrCommonService, 
    private route: ActivatedRoute,
    private router: Router,private formBuilder: FormBuilder) {
      this.noteId = this.route.snapshot.params.id;
     }

  ngOnInit() {
    this.memberReadingNoteById();
  }
  initiateForm() {
    this.createNoticeForm = this.formBuilder.group({
      subject: [null, Validators.required],
      description: [null, Validators.required]
    })
  }
memberReadingNoteById(){
  this.pmbrCommonService.getMemberReadingById(this.noteId).subscribe(res => {
    this.memberReading = res;
    console.log(this.memberReading);
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
