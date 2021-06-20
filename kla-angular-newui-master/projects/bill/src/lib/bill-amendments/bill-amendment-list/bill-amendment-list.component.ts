import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bill-amendment-list',
  templateUrl: './bill-amendment-list.component.html',
  styleUrls: ['./bill-amendment-list.component.scss']
})
export class BillAmendmentListComponent implements OnInit {
  private tabs = ['foo', 'bar'];
  private selectedTab = this.tabs[0];
  
  

  constructor() { }
  onInit() {
    this.selectedTab = this.tabs[0];
}

tabChanged(tab) {
    this.selectedTab = tab;
}

  ngOnInit() {
  }

}
