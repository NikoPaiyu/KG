import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuctionConstant, AuctionConstantApi } from '../../../constants/auction.constant';
import { Voucher } from '../../../models/auction.model';
import { AuctionApiService } from '../../../services/auction-api.service';
import { AuctionCommonService } from '../../../services/auction-common.service';

@Component({
  selector: 'app-voucher-dashboard',
  templateUrl: './voucher-dashboard.component.html',
  styleUrls: ['./voucher-dashboard.component.scss']
})
export class VoucherDashboardComponent implements OnInit {
  
    /*
      Disposal Bread Cums List
    */
    BreadCums = AuctionConstant.dashboardVoucherBreadCums;
  
    /*
      Disposal List
    */
    voucherList$: Observable<Voucher[]>;
  
    /*
      Dasboard SearchText
    */
    dashboardSearchTest: string;
    filterForm: FormGroup;
    voucherListTemp: Voucher[];
    statusList = ['Active','Draft'];
  
    constructor(private _formBuilder :FormBuilder, private _router: Router,private _auctionApiService: AuctionApiService,private _auctionCommonService: AuctionCommonService) { }
  
    ngOnInit() {
      this._getFilterForm();
      this.getAllDisposalRequest();
      this._getValues();
    }
  
    /*  
      Create Disposal Request
    */
    public navigateToCreateRequest(){
      void this._router.navigateByUrl('business-dashboard/auction/voucher/create');
    }
  
    /*
      Navigate to edit disposal request
    */
    public navigateToEditRequest(voucher: Voucher){
      this._router.navigateByUrl(`business-dashboard/auction/voucher/edit/${voucher.id}`);
    }
  
    /*
      Dashboard Search
    */
    public onDashboardSearch(searchText: string){
      this.dashboardSearchTest = searchText;
    }
  
    /*
      Filter Date is Selected
    */
    public resetFilter(){
        this.voucherList$ = of(this.voucherListTemp);
        this.filterForm.reset();
    }

    private _getValues(){
      this.filterForm.valueChanges.subscribe(values => {
        console.log(values);
        if(values.date && values.status){
          this._auctionCommonService.returnFilterDateAndStatus(values.date,values.status,this.voucherListTemp,'dateOfAuction','voucherStatus');
        }
        if(values.date){
          this.voucherList$ = of(this._auctionCommonService.returnFilterDate<Voucher>(values.date,this.voucherListTemp,'dateOfAuction'));
        }
        if(values.status){
          this.voucherList$ = of(this._auctionCommonService.returnFilterStatus<Voucher>(values.status,this.voucherListTemp,'voucherStatus'));
        }
      })
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
    private getAllDisposalRequest() {
      this.voucherList$ = this._auctionApiService.getDataForDashboard<Voucher>(AuctionConstantApi.voucher).pipe(
        map(events => events.sort((a, b) => new Date(b.dateOfAuction).getTime() - new Date(a.dateOfAuction).getTime()))
      );
      this.voucherList$.subscribe(response => {
        this.voucherListTemp = response;
      })
    }
  

}
