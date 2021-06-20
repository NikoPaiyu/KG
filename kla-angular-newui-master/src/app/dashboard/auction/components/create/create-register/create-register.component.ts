import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Location } from '@angular/common';
import { NzNotificationService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { AuctionConstantApi, NoSpaceRegex } from '../../../constants/auction.constant';
import { AuctionRegister } from '../../../models/auction.model';
import { UISTATE } from '../../../models/auction.types';
import { AuctionApiService } from '../../../services/auction-api.service';

@Component({
  selector: 'app-create-register',
  templateUrl: './create-register.component.html',
  styleUrls: ['./create-register.component.scss']
})
export class CreateRegisterComponent implements OnInit {

  /*
    Form Group
  */
  registerformGroup: FormGroup;

  /*
  UI State
  */
  uiState: UISTATE = 'CREATE';

  constructor(private _router: Router,private _notification:NzNotificationService, private _formBuilder: FormBuilder,private _auctionServiceApi: AuctionApiService,private _location: Location) { }

  ngOnInit() {
    this._initForm(new AuctionRegister());
  }

  onSubmit(){
    console.log(this.registerformGroup.value);
    this._auctionServiceApi.createDashboardRequest<AuctionRegister>(this.registerformGroup.value,AuctionConstantApi.auctionRegisterApi).subscribe(id => {
      if(typeof id === 'number'){
        this._successMessage('New Register Request has been created with id',id);
      }
    });
  }

  public navigateToDashboard(){
    this._location.back();
  }

  private _successMessage(message: string,id: number){
    this._notification.success('New Register',`${message} - ${id}`);
    this.registerformGroup.reset();
    this._router.navigateByUrl('business-dashboard/auction/auctionRegister');
  }

  private _initForm(register: AuctionRegister){
    this.registerformGroup = this._formBuilder.group({
      id: [register.id],
      articleName: [register.articleName,[Validators.required,Validators.pattern(NoSpaceRegex)]],
      quantity: [register.quantity,Validators.required],
      bookRateRs: [register.bookRateRs,Validators.required],
      bookAmountRs: [register.bookAmountRs,Validators.required],
      storageChangeRs: [register.storageChangeRs,Validators.required],
      commissionRs: [register.commissionRs,Validators.required],
      amountRealisedRs: [register.amountRealisedRs,Validators.required],
      lossRs: [register.lossRs,Validators.required],
      soldToAndWhen: [register.soldToAndWhen,[Validators.required,Validators.pattern(NoSpaceRegex)]],
      receiptClass: [register.receiptClass,[Validators.required,Validators.pattern(NoSpaceRegex)]],
      remittanceChallan: [register.remittanceChallan,[Validators.required,Validators.pattern(NoSpaceRegex)]],
      entryStatus: [register.entryStatus,[Validators.required,Validators.pattern(NoSpaceRegex)]]
    });
  }

}
