import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuctionConstantApi } from '../../../constants/auction.constant';
import { Attachment, Auction, Bid } from '../../../models/auction.model';
import { UISTATE } from '../../../models/auction.types';
import { AuctionApiService } from '../../../services/auction-api.service';
import { AuctionCommonService } from '../../../services/auction-common.service';
import * as _ from 'underscore';
import { NzNotificationService } from 'ng-zorro-antd';
import {Location} from '@angular/common';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-create-bid',
  templateUrl: './create-bid.component.html',
  styleUrls: ['./create-bid.component.scss']
})
export class CreateBidComponent implements OnInit {

  BidList: Bid[] = [];
  uistate: UISTATE;
  auctionFileNumber: string;
  finalised: boolean = false;

  constructor(private activatedRoute: ActivatedRoute,private _location: Location,private _notification: NzNotificationService,private _fb: FormBuilder,private _auctionCommon: AuctionCommonService , private _auctionApi: AuctionApiService) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(param => {
      this.auctionFileNumber = param.auctionId;
    });
    this.bidDetails();
  }


  public addBid(){
    if(this.BidList.some(bid => bid.isChecked === true)){
      return;
    }
    this.BidList.push(new Bid(true));
  }

  public delete(index: number){
    this.BidList.splice(index,1);
  }

  public save(bid: Bid){
    bid.isChecked = false;
    if(bid.id){
      this._editBidApi(bid);
    }else {
      this._saveBidApi(bid);
    }
  }

  finalise(bid: Bid){
    this.finalised = true;
    bid.statusOfBid = 'Finalised';
    this._editBidApi(bid);
  }

  public duplicate(index: number,bid: Bid){
    this.BidList.push(_.clone(bid));
  }

  public onFileEvent(attachments: Attachment[],bid: Bid){
    bid.attachments.concat(attachments);
  }

  public navigateToAuction(){
    this._location.back();
  }

  private _saveBidApi(bid: Bid){
    bid.auctionRequestId = this.auctionFileNumber;
    this._auctionApi.createDashboardRequest<Bid>(bid,AuctionConstantApi.bidApi).subscribe(response => {
      console.log(response);
    });
  }

  private _editBidApi(bid: Bid){
    bid.auctionRequestId = this.auctionFileNumber;
    this._auctionApi.updateDashboardRequest<Bid>(bid,AuctionConstantApi.bidApi).subscribe(response => {
      console.log(response);
    });
  }

  private bidDetails(){
    this._auctionApi.getDataForRequest<Auction>(`${AuctionConstantApi.editAuctionRequestApi}/${this.auctionFileNumber}`).subscribe(auction => {
      this.BidList = auction.bids;
      const anyFinalisedBid = this.BidList.some(bid => bid.statusOfBid === 'Finalised');
      if(anyFinalisedBid){
        this.finalised = true;
      }
    });
  }
}
