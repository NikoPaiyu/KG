import { Component, OnInit } from '@angular/core';
import { AuctionCommonService } from '../../../services/auction-common.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  notifications = [];

  constructor(private auctionService: AuctionCommonService) { }

  ngOnInit() {
    this.getNotification();
  }

  getNotification(){
    this.auctionService.notification$.subscribe(notifications => {
      if(notifications){
        this.notifications.push(notifications);
        console.log(this.notifications);
      }
    });
  }

}
