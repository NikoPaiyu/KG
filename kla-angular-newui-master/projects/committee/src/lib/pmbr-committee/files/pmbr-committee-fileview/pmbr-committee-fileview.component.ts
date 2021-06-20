import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'committee-pmbr-committee-fileview',
  templateUrl: './pmbr-committee-fileview.component.html',
  styleUrls: ['./pmbr-committee-fileview.component.css']
})
export class PmbrCommitteeFileviewComponent implements OnInit {

  @Input() committeeDetails;
  @Input() userDetails
  @Input() assignee
  
  constructor() { }

  ngOnInit() {
  }

}
