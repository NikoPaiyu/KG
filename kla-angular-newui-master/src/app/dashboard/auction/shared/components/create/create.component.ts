import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  /*
    Create Breadcums
  */
  @Input() createBreadCums: string[] = [];

  /*
    Create Title
  */
  @Input() createTitle: string;

  /*
    Create Status
  */
  @Input() createStatus: string;

  constructor() { }

  ngOnInit() {
  }

}
