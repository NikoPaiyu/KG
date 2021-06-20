import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'pmbr-resolution-memberreading-view',
  templateUrl: './resolution-memberreading-view.component.html',
  styleUrls: ['./resolution-memberreading-view.component.css']
})
export class ResolutionMemberreadingViewComponent implements OnInit {

  @Input() pmbrMemberReadingDto;
  
  constructor() { }

  ngOnInit() {
  }

}
