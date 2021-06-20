import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-notice-preview',
  templateUrl: './notice-preview.component.html',
  styleUrls: ['./notice-preview.component.scss']
})
export class NoticePreviewComponent implements OnInit {
  clauseNo = ["A", "B", "C", "D", "E", "F", "G", "H"];
  @Input() questionVersion = {};
  constructor() { }

  ngOnInit() {}

}
