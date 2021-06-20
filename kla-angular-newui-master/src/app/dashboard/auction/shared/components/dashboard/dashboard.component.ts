import { Component, Input, OnInit, Output , EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd';
import { AuctionCommonService } from '../../../services/auction-common.service';
import { NotificationComponent } from '../notification/notification.component';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  /*
    Dashboard Title
  */
  @Input() public dashboardTitle: string;

  /*
    Dashboard Breadcums
  */
  @Input() public dashboardBreadcums: string[] = [];

  /*
    Dashbord Search Placeholder
  */
  @Input() public dashboardSearchPlaceholder: string = 'Search Request No.';

  /*
    Dashboard Search
  */
  @Input() isDashboardSearch: boolean = true;

  /*
    Dashboard Search Event
  */
  @Output() public dashboardSearchEvent = new EventEmitter();

  component = NotificationComponent;
  isVisible: boolean;


  constructor(private modal: NzModalService,public auctionService: AuctionCommonService, private _router: Router) { }

  ngOnInit() {
    this.getNotification();
  }

  /*
    On Searching from the input box
  */
  public onSearch(searchTxt: string){
    this.dashboardSearchEvent.emit(searchTxt);
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }

  getNotification(){
    this.auctionService.notification$.subscribe(notifications => {
      if(notifications){
        this.auctionService.notifications.push(notifications);
      }
    });
  }

  /*
    Navigate to edit disposal request
  */
    public navigateToEditRequest(id: number){
      this._router.navigateByUrl(`business-dashboard/auction/disposal/edit/${id}`);
    }
}
