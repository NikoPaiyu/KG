import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'budget-bill-info',
  templateUrl: './bill-info.component.html',
  styleUrls: ['./bill-info.component.css']
})
export class BillInfoComponent implements OnInit {
  @Input() billDetails;
  constructor() { }

  ngOnInit() {
  }


}
