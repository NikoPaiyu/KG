import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-select-notice-type',
  templateUrl: './select-notice-type.component.html',
  styleUrls: ['./select-notice-type.component.scss']
})
export class SelectNoticeTypeComponent implements OnInit {
  rows=[1,2];
  coloums=[1,2,3];
  constructor() { }

  ngOnInit() {
    
  }

}
