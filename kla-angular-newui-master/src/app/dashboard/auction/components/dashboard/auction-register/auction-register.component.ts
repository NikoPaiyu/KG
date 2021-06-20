import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuctionConstantApi } from '../../../constants/auction.constant';
import { AuctionRegister } from '../../../models/auction.model';
import { AuctionApiService } from '../../../services/auction-api.service';


@Component({
  selector: 'app-auction-register',
  templateUrl: './auction-register.component.html',
  styleUrls: ['./auction-register.component.scss']
})
export class AuctionRegisterComponent implements OnInit {

  public registerList$: Observable<AuctionRegister[]> = of([]);

  constructor(private _router: Router, private _auctionApiService: AuctionApiService) { }

  ngOnInit() {
    this._getAllRegisters();
  }

  public createRequest(){
    this._router.navigateByUrl('business-dashboard/auction/auctionRegister/create')
  }

  private _getAllRegisters(){
    this.registerList$ = this._auctionApiService.getDataForDashboard<AuctionRegister>(AuctionConstantApi.auctionRegisterApi).pipe(
      map(events => events.sort((a, b) => a.id - b.id))
    );
  }


}
