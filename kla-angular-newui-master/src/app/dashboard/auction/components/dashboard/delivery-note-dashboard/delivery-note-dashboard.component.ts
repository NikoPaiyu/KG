import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuctionConstant, AuctionConstantApi, AuctionStatus } from '../../../constants/auction.constant';
import { DeliveryNote } from '../../../models/auction.model';
import { AuctionApiService } from '../../../services/auction-api.service';
import { AuctionCommonService } from '../../../services/auction-common.service';


@Component({
  selector: 'app-delivery-note-dashboard',
  templateUrl: './delivery-note-dashboard.component.html',
  styleUrls: ['./delivery-note-dashboard.component.scss']
})
export class DeliveryNoteDashboardComponent implements OnInit {

  /*
    deliveryNote Status
  */
    deliveryNoteStatusList: string[] = AuctionStatus;

    /*
      deliveryNote Bread Cums List
    */
    deliveryNoteBreadCums = AuctionConstant.deliveryNoteBreadCums;
  
    /*
      deliveryNote List
    */
    deliveryNoteList$: Observable<DeliveryNote[]>;
  
    /*
      Temp List
    */
    deliveryNoteListTemp: DeliveryNote[] = [];
  
    /*
      Dasboard SearchText
    */
    dashboardSearchText: string;
  
    /*
      Filter Form
    */
    deliveryNoteFilterForm: FormGroup;
  
    /*
    Subscription to be unsubscribed
    */
    disSub: Subscription;
  
    constructor(private _formBuilder: FormBuilder ,private _router: Router,private _auctionApiService: AuctionApiService,private _auctionCommonService: AuctionCommonService) { }
  
  
    ngOnInit() {
      this._getFilterForm();
      this._getAlldeliveryNoteRequest();
      this._getValues();
    }
  
    /*  
      Create deliveryNote Request
    */
    public navigateToCreateRequest(){
      void this._router.navigateByUrl('business-dashboard/auction/deliveryNote/create');
    }
  
    /*
      Navigate to edit deliveryNote request
    */
    public navigateToEditRequest(deliveryNote: DeliveryNote){
      this._router.navigateByUrl(`business-dashboard/auction/deliveryNote/edit/${deliveryNote.id}`);
    }
  
    /*
      Dashboard Search
    */
    public onDashboardSearch(searchText: string){
      this.deliveryNoteList$ = of(this._auctionCommonService.returnFilterStatus<DeliveryNote>(searchText,this.deliveryNoteListTemp,'id'));
    }
  
    /*
      Resetting the Filter
    */
    public resetFilter(){
      this.deliveryNoteList$ = of(this.deliveryNoteListTemp);
      this.deliveryNoteFilterForm.reset();
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
      this.deliveryNoteFilterForm.valueChanges.subscribe(values => {
        if(values.date && values.status){
          this.deliveryNoteList$ = of(this._auctionCommonService.returnFilterDateAndStatus(values.date,values.status,this.deliveryNoteListTemp,'dateFordeliveryNote','statusOfdeliveryNote'));
          return;
        }
        if(values.date){
          this.deliveryNoteList$ = of(this._auctionCommonService.returnFilterDate<DeliveryNote>(values.date,this.deliveryNoteListTemp,'dateFordeliveryNote'));
          return;
        }
        if(values.status){
          this.deliveryNoteList$ = of(this._auctionCommonService.returnFilterStatus<DeliveryNote>(values.status,this.deliveryNoteListTemp,'statusOfdeliveryNote'));
          return;
        }
      })
  }
  
    /*
      Creating the Filter Form
    */
    private _getFilterForm(){
      this.deliveryNoteFilterForm = this._formBuilder.group({
        date:[''],
        status:['']
      })
    }
  
    /*
      Get All deliveryNote Requests and sort by latest
    */
    private _getAlldeliveryNoteRequest() {
      this.deliveryNoteList$ = this._auctionApiService.getDataForDashboard<DeliveryNote>(AuctionConstantApi.deliveryNoteApi).pipe(
        map(events => events.sort((a, b) => new Date(b.auctionDate).getTime() - new Date(a.auctionDate).getTime()))
      );
      this._getTempData();
    }
  
    /*
      Get the temp data
    */
     private _getTempData(){
      this.disSub = this.deliveryNoteList$.subscribe(result => {
        this.deliveryNoteListTemp = result;
      });
     }
  

}
