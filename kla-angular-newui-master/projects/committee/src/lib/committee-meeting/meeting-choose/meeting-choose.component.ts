import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'committee-meeting-choose',
  templateUrl: './meeting-choose.component.html',
  styleUrls: ['./meeting-choose.component.css']
})
export class MeetingChooseComponent implements OnInit {
  isVisible = false;
  singleValue = "Meeting Tittle-12/10/20";
handleOk(): void {
   this.isVisible = true;
  }

  handleCancel(): void {
    this.isVisible = false;
  }
  constructor() { }

  ngOnInit() {
  }

}
