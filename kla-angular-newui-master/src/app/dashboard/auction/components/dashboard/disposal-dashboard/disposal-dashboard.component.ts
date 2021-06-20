import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { DisposalStatus, AuctionConstant, AuctionConstantApi } from '../../../constants/auction.constant';
import { Disposal } from '../../../models/auction.model';
import { AuctionApiService } from '../../../services/auction-api.service';
import { AuctionCommonService } from '../../../services/auction-common.service';


@Component({
  selector: 'app-disposal-dashboard',
  templateUrl: './disposal-dashboard.component.html',
  styleUrls: ['./disposal-dashboard.component.scss']
})
export class DisposalDashboardComponent implements OnInit,OnDestroy {

  /*
    Disposal Status
  */
  disposalStatusList: string[] = [DisposalStatus.awaitingApproval,DisposalStatus.draft];

  /*
    Disposal Bread Cums List
  */
  disposalBreadCums = AuctionConstant.dashboardDisposalbreadcums;

  /*
    Disposal List
  */
  disposalList$: Observable<Disposal[]>;

  /*
    Temp List
  */
  disposalListTemp: Disposal[] = [];

  /*
    Dasboard SearchText
  */
  dashboardSearchText: string;

  /*
    Filter Form
  */
  disposalFilterForm: FormGroup;

  /*
  Subscription to be unsubscribed
  */
  disSub: Subscription;

  constructor(private _formBuilder: FormBuilder ,private _router: Router,private _auctionApiService: AuctionApiService,private _auctionCommonService: AuctionCommonService) { }


  ngOnInit() {
    this._getFilterForm();
    this._getAllDisposalRequest();
    this._getValues();
  }

  /*  
    Create Disposal Request
  */
  public navigateToCreateRequest(){
    void this._router.navigateByUrl('business-dashboard/auction/disposal/create');
  }

  /*
    Navigate to edit disposal request
  */
  public navigateToEditRequest(disposal: Disposal){
    this._router.navigateByUrl(`business-dashboard/auction/disposal/edit/${disposal.id}`);
  }

  /*
    Dashboard Search
  */
  public onDashboardSearch(searchText: string){
    this.disposalList$ = of(this._auctionCommonService.returnFilterStatus<Disposal>(searchText,this.disposalListTemp,'id'));
  }

  /*
    Resetting the Filter
  */
  public resetFilter(){
    this.disposalList$ = of(this.disposalListTemp);
    this.disposalFilterForm.reset();
  }

  /*
    On Destroy Life Cycle Hook
  */
  public ngOnDestroy(): void {
    this.disSub.unsubscribe();
  }

  /*
    Getting Values when filtering the table
  */
  private _getValues(){
    this.disposalFilterForm.valueChanges.subscribe(values => {
      if(values.date && values.status){
        this.disposalList$ = of(this._auctionCommonService.returnFilterDateAndStatus(values.date,values.status,this.disposalListTemp,'dateForDisposal','statusOfDisposal'));
        return;
      }
      if(values.date){
        this.disposalList$ = of(this._auctionCommonService.returnFilterDate<Disposal>(values.date,this.disposalListTemp,'dateForDisposal'));
        return;
      }
      if(values.status){
        this.disposalList$ = of(this._auctionCommonService.returnFilterStatus<Disposal>(values.status,this.disposalListTemp,'statusOfDisposal'));
        return;
      }
    })
  }

  /*
    Creating the Filter Form
  */
  private _getFilterForm(){
    this.disposalFilterForm = this._formBuilder.group({
      date:[''],
      status:['']
    })
  }

  /*
    Get All Disposal Requests and sort by latest
  */
  private _getAllDisposalRequest() {
    this.disposalList$ = this._auctionApiService.getDataForDashboard<Disposal>(AuctionConstantApi.disposalDashboardApi).pipe(
      map(events => events.sort((a, b) => new Date(b.dateForDisposal).getTime() - new Date(a.dateForDisposal).getTime()))
    );
    this._getTempData();
  }

  /*
    Get the temp data
  */
   private _getTempData(){
    this.disSub = this.disposalList$.subscribe(result => {
      this.disposalListTemp = result;
    });
   }

}
