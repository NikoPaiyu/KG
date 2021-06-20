import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'tables-governors-address-file-view',
  templateUrl: './governors-address-file-view.component.html',
  styleUrls: ['./governors-address-file-view.component.scss']
})
export class GovernorsAddressFileViewComponent implements OnInit {
  @Input() governorsAddress;

  constructor() { }

  ngOnInit() {
  }

}
