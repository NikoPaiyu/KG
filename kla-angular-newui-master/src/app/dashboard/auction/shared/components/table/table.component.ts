import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  @Input() public tableHeaders: string[] = [];

  @Input() public tableContent = [];

  @Input() public tableDataProp: string[];

  @Input() public tableSearchProp: string;

  @Input() public tableSearchText: string;

  @Input() public tableLinkProp: string;

  constructor() { }

  ngOnInit() {
  }

  onTableAction(content: any,prop: string){
    console.log(content,prop);
  }

}
