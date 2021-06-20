import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-quick-options',
  templateUrl: './quick-options.component.html',
  styleUrls: ['./quick-options.component.scss']
})
export class QuickOptionsComponent implements OnInit {
@Input() showNote;
quickOptions = [];
selectedTags = [];

  constructor() { }

  ngOnInit() {
  }
  CheckforRules(value, tag, i) {

  }
}
