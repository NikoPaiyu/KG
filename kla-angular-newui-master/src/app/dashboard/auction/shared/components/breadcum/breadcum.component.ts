import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-breadcum',
  templateUrl: './breadcum.component.html',
  styleUrls: ['./breadcum.component.scss']
})
export class BreadcumComponent implements OnInit {

  /*
    Bread Cum Source to be injected
  */
  @Input() breadCumSource:string[] = [];

  constructor() { }

  ngOnInit() {}

}
