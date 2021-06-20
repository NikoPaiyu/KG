import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuctionConstant, AuctionConstantApi } from '../../../constants/auction.constant';
import { Auction } from '../../../models/auction.model';
import { AuctionApiService } from '../../../services/auction-api.service';
import { AuctionCommonService } from '../../../services/auction-common.service';


@Component({
  selector: 'app-auction-dashboard',
  templateUrl: './auction-dashboard.component.html',
  styleUrls: ['./auction-dashboard.component.scss']
})
export class AuctionDashboardComponent implements OnInit {

  /*
    Disposal Status Model
  */  
    public auctionFilterStatusModel: 'Active' | 'Closed';

    /*
      Disposal Status Model
    */  
    public disposalFilterDateModel: Date[];
  
    /*
      Disposal Status
    */
    public disposalStatusList: string[] = ['Active','Closed'];
  
    /*
      Disposal Bread Cums List
    */
    public auctionBreadCums = AuctionConstant.dashbordAuctionbreadcums;
  
    /*
      Disposal List
    */
    public auctionList$: Observable<Auction[]>;
    auctionListTemp: Auction[] = [];
  
    /*
      Dasboard SearchText
    */
    public auctionSearchTest: string;

    /*
    auction (Not using this prop for now )
    */
    filterForm: FormGroup;
    disSub: Subscription;

    constructor(private _formBuilder: FormBuilder,private _router: Router,private _auctionApiService: AuctionApiService,private _auctionCommonService: AuctionCommonService) { }
  
    ngOnInit() {
      this._getFilterForm();
      this._getAllDisposalRequest();
      this._getValues();
    }
  
    /*  
      Create Disposal Request
    */
    public navigateToCreateRequest(){
      void this._router.navigateByUrl('business-dashboard/auction/auction/create');
    }
  
    /*
      Navigate to edit disposal request
    */
    public navigateToEditRequest(auction: Auction){
      this._router.navigateByUrl(`business-dashboard/auction/auction/edit/${auction.id}`);
    }
  
  /*
    Dashboard Search
  */
    public onDashboardSearch(searchText: string){
      this.auctionList$ = of(this._auctionCommonService.returnFilterStatus<Auction>(searchText,this.auctionListTemp,'id'));
    }
  
    private _getValues(){
      this.filterForm.valueChanges.subscribe(values => {
        if(values.date && values.status){
          this._auctionCommonService.returnFilterDateAndStatus(values.date,values.status,this.auctionListTemp,'auctionDate','statusOfAuction');
        }
        if(values.date){
          this.auctionList$ = of(this._auctionCommonService.returnFilterDate<Auction>(values.date,this.auctionListTemp,'auctionDate'));
        }
        if(values.status){
          this.auctionList$ = of(this._auctionCommonService.returnFilterStatus<Auction>(values.status,this.auctionListTemp,'statusOfAuction'));
        }
      })
    }
    /*
      Clear Filter
    */
    public resetFilter(){
      this.auctionList$ = of(this.auctionListTemp);
      this.filterForm.reset();
    }

      /*
    Creating the Filter Form
  */
    private _getFilterForm(){
        this.filterForm = this._formBuilder.group({
            date:[''],
            status:['']
        })
    }

    /*
      Get All Disposal Requests and sort by latest
    */
    private _getAllDisposalRequest() {
      this.auctionList$ = this._auctionApiService.getDataForDashboard<Auction>(AuctionConstantApi.auctionDashboardApi).pipe(
        map(events => events.sort((a, b) => new Date(b.auctionDate).getTime() - new Date(a.auctionDate).getTime()))
      );
      this.auctionList$.subscribe(list => {
        this.auctionListTemp = list;
      })
    }
  
}
