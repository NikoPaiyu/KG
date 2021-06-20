import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bullettin-flow',
  templateUrl: './bullettin-flow.component.html',
  styleUrls: ['./bullettin-flow.component.scss']
})
export class BullettinFlowComponent implements OnInit {

  constructor() { }
  listOfData = [
    {
      billTitle: 'Bill Title Goes Here',
      otherImportantColoumns: 'Content',
    },
    {
      billTitle: 'Bill Title Goes Here',
      otherImportantColoumns: 'Content',
    },
    {
      billTitle: 'Bill Title Goes Here',
      otherImportantColoumns: 'Content',
    }

  ];

  ngOnInit() {
  }

}
