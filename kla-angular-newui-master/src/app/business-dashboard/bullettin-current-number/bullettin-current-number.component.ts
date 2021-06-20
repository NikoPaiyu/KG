import { Component, OnInit } from '@angular/core';
import { NotificationCustomService } from 'src/app/shared/services/notification.service';
import { BullettinService } from '../bullettin/shared/services/bullettin.service';

@Component({
  selector: 'app-bullettin-current-number',
  templateUrl: './bullettin-current-number.component.html',
  styleUrls: ['./bullettin-current-number.component.scss']
})
export class BullettinCurrentNumberComponent implements OnInit {

  constructor(
    private bullettin: BullettinService,
    public notify: NotificationCustomService,
  ) { }

  currentNumber;
  number: any;

  ngOnInit() {
  }

  genearateCurrentNumber() {
    this.bullettin.getBullettinCurrentNumber().subscribe((res) => {
      if(res) {
        this.number = res as any;
        this.currentNumber = this.number.currentNumber;
      } else { this.notify.showError("Error", "Something went wrong.."); }
    });
}
}
