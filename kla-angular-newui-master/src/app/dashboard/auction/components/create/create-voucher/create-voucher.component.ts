import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { Observable, of } from 'rxjs';
import {Location} from '@angular/common';
import { AuctionConstant, AuctionConstantApi, NoSpaceRegex, TitleNames } from '../../../constants/auction.constant';
import { Voucher} from '../../../models/auction.model';
import { UISTATE } from '../../../models/auction.types';
import { AuctionApiService } from '../../../services/auction-api.service';
import { AuctionCommonService } from '../../../services/auction-common.service';

@Component({
  selector: 'app-create-voucher',
  templateUrl: './create-voucher.component.html',
  styleUrls: ['./create-voucher.component.scss']
})
export class CreateVoucherComponent implements OnInit {

  /*
    Disposal Bread Cums List
  */
    BreadCums = AuctionConstant.createVoucherBreadCums;

    /*
      Disposal Form Group
    */
    voucherFormGroup: FormGroup;
  
    /*
      UI state
    */
    UIState$: Observable<UISTATE>;

    /*
      Vendor List
    */
    vendorList = ['Vendor 1','Vendor 2'];
  
    constructor(private _location: Location, private _activateRoute: ActivatedRoute,private _auctionCommonService: AuctionCommonService,private _formBuilder: FormBuilder,private _auctionApiService: AuctionApiService,private _notification: NzNotificationService,private _router: Router) { }
  
    /*
      Lifecycle Hook
    */
    ngOnInit(): void {
      this._checkForUrl();
    } 
  
    /*
      Submitting a Voucher or Saving it
    */
    public onSubmit(status?: string): void {
      this.voucherStatus.setValue(status);
      this._auctionApiService.createDashboardRequest<Voucher>(this.voucherFormGroup.value,AuctionConstantApi.voucher)
      .subscribe(response => {
          this._success(response,TitleNames.voucher.createSuccess);
      });
    }
    
    /*
      Editing a Voucher
    */
    public onEdit(status?:string): void {
      this.voucherStatus.setValue(status);
      this._auctionApiService.updateDashboardRequest<Voucher>(this.voucherFormGroup.value,`${AuctionConstantApi.voucher}`)
      .subscribe(response => {
          this._success(response,TitleNames.voucher.editSuccess);
      });
    }

    /*
      On Edit State
    */
    onEditState(){
      this.UIState$ = of('EDIT');
    }

    /*
      Go Back to Dashboard
    */
    public navigateToDashboard(){
      this._location.back();
    }
  
    /*
      Go to auction
    */
    public onAuctionRequest(){
      
    }

    public get voucherStatus(){
      if(this.voucherFormGroup)
      return this.voucherFormGroup.get('voucherStatus');
    }
  
    /*
      Check for URL
    */
    private _checkForUrl(){
      this._activateRoute.params.subscribe(param => {
        if(param.id){
          this._checkForEdit(param.id);
          this.UIState$ = of('VIEW');
  
        }else{
          this.UIState$ = of('CREATE');
          this._initDisposalRequestForm(new Voucher());
        }
      });
    }
  
    /*
      Check for Edit
    */
    private _checkForEdit(id: string){
      this._auctionApiService.getDataForRequest<Voucher>(`${AuctionConstantApi.voucher}/${id}`).subscribe(voucher => {
        this._initDisposalRequestForm(voucher);
      });
    }
  
    /*
    public Success Message
    */
    private _success(id: string,message: string): void{
      this._notification.success('Voucher Request',`${message} ${id}`);
      this.voucherFormGroup.reset();
      this._router.navigateByUrl('business-dashboard/auction/voucher');
    }
  
    /*
      Init Disposal Request Form Group
    */
    private _initDisposalRequestForm(voucher?: Voucher): void {
      this.voucherFormGroup = this._formBuilder.group({
        auctionFileNumber: [voucher.auctionFileNumber,Validators.required],
        auctionValue : [voucher.auctionValue,Validators.required],
        buyersName : [voucher.buyersName,Validators.required],
        buyersPhone : [voucher.buyersPhone,Validators.required],
        dateOfAuction : [voucher.dateOfAuction,Validators.required],
        paymentStatus : [voucher.paymentStatus,[Validators.required,Validators.pattern(NoSpaceRegex)]],
        buyersAddress : [voucher.buyersAddress,[Validators.required,Validators.pattern(NoSpaceRegex)]],
        voucherStatus: [voucher.voucherStatus,Validators.required]
      });
    }
}
