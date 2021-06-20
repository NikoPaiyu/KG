import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})
export class LogsComponent implements OnInit {
  @Input() logDetails = [];
  constructor() { }

  ngOnInit() {
  }

}
