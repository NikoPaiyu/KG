import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'lib-obj-intoduction-view',
  templateUrl: './obj-intoduction-view.component.html',
  styleUrls: ['./obj-intoduction-view.component.css']
})
export class ObjIntoductionViewComponent implements OnInit {
  @Input()  noticeDetails;
  constructor() { }

  ngOnInit() {
  }

}
