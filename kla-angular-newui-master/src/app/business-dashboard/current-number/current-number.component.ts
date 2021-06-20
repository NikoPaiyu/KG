import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FileService } from 'src/app/shared/services/file.service';
import { NotificationCustomService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-current-number',
  templateUrl: './current-number.component.html',
  styleUrls: ['./current-number.component.scss']
})
export class CurrentNumberComponent implements OnInit {
  currentNumber;
  number: any;
  isGenerateVisibleModal = false;
  klaSections: any = [];
  currentForm = this.fb.group({
    id: [null],
    sectionId: [null, Validators.required],
  });
  current={
    subject: ""
  }
  constructor(
    private fileService : FileService,
    public notify: NotificationCustomService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.getKlaSections();
  }
  genearateCurrentNumber() {
    const body = {
      sectionId:this.currentForm.value.sectionId,
      subject: this.current.subject
    }
      this.fileService.getCurrentNumber(body).subscribe((res) => {
        if(res) {
          this.number = res as any;
          this.currentNumber = this.number.currentNumber;
          this.currentForm.reset();
          this.current.subject = null;
          this.isGenerateVisibleModal = false;
         
        } else { this.notify.showError("Error", "Something went wrong.."); }
      });
  }
  getKlaSections(){
    this.fileService.getKlaSections().subscribe((res:any)=>{
      this.klaSections = res;
    })
  }
  generateModal(){
    this.isGenerateVisibleModal = true;
  }
  handleCancel(){
    this.isGenerateVisibleModal = false;
    this.currentForm.reset();
    this.current.subject = null;
  }
}
