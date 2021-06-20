import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { Observable, of } from 'rxjs';

import {Location} from '@angular/common';
import { AuctionConstant, AuctionConstantApi } from '../../../constants/auction.constant';
import { DeliveryNote } from '../../../models/auction.model';
import { UISTATE } from '../../../models/auction.types';
import { AuctionApiService } from '../../../services/auction-api.service';
import { AuctionCommonService } from '../../../services/auction-common.service';
@Component({
  selector: 'app-create-delivery-note',
  templateUrl: './create-delivery-note.component.html',
  styleUrls: ['./create-delivery-note.component.scss']
})
export class CreateDeliveryNoteComponent implements OnInit {

  /*
    Disposal Bread Cums List
  */
    deliveryNoteBreadCums = AuctionConstant.createDeliveryNoteBreadCums;

    /*
      Disposal Form Group
    */
    deliveryNoteFormGroup: FormGroup;
  
    /*
      UI state
    */
    UIState$: Observable<UISTATE>;

    /*
      Page Title
    */
    requestTitle = 'Create New Delivery Note'
  
    constructor(private _location: Location, private _activateRoute: ActivatedRoute,private _auctionCommonService: AuctionCommonService,private _formBuilder: FormBuilder,private _auctionApiService: AuctionApiService,private _notification: NzNotificationService,private _router: Router) { }
  
    /*
      Lifecycle Hook
    */
    ngOnInit(): void {
      this._checkForUrl();
    } 


    /*
      On Form Submit
    */
    public onSubmit(status: string,type: string): void {
      if(status === 'Draft'){
        this.deliveryNoteFormGroup.get('requestStatus').setValue(status);
      }
      this._auctionApiService.createDashboardRequest<DeliveryNote>(this.deliveryNoteFormGroup.value,AuctionConstantApi.deliveryNoteApi)
      .subscribe(response => {
        if(typeof response === 'number'){ 
          this._success('Delivery Note Request has been succesfully created',response,type);
        }
      });
    }
  
    public onEdit(): void {
      this._auctionApiService.updateDashboardRequest<DeliveryNote>(this.deliveryNoteFormGroup.value,`${AuctionConstantApi.deliveryNoteApi}`)
      .subscribe(response => {
        if(typeof response === 'number'){ 
          this._success('DeliveryNote Request has been succesfully edited',response);
        }
      });
    }
  
    /*
      Go Back to Dashboard
    */
    public navigateToDashboard(){
      this._location.back();
    }

    onEditState(){
      this.requestTitle = 'Edit Delivery Note';
      this.UIState$ = of('EDIT');
    }
  
    /*
      Check for URL
    */
    private _checkForUrl(){
      this._activateRoute.params.subscribe(param => {
        if(param.id){
          this.UIState$ = of('VIEW');
          this._checkForEdit(param.id);
          this.requestTitle = 'View Delivery Note';
        }else{
          this.UIState$ = of('CREATE');
          this._initRequestForm(new DeliveryNote());
        }
      });
    } 
  
    /*
      Check for Edit and init the form
    */
    private _checkForEdit(id: string){
      this._auctionApiService.getDataForRequest<DeliveryNote>(`${AuctionConstantApi.deliveryNoteApi}/${id}`).subscribe(deliveryNote => {
        this._initRequestForm(deliveryNote);
      });
    }
    
    /*
      Success Message
    */
    private _success(message: string ,id :number,type?: string): void{
      this._notification.success(`${message} ${id}`,'');
      this.deliveryNoteFormGroup.reset();
      this._router.navigateByUrl('business-dashboard/auction/deliveryNote');
      this._auctionCommonService.setNotificationValue({
          id: id,
          name : 'Delivery Note Request'
     });
    }
  
    /*
      Init Disposal Request Form Group
    */
    private _initRequestForm(deliveryNote?: DeliveryNote): void {
      this.deliveryNoteFormGroup = this._formBuilder.group({
        id: [deliveryNote.id],
        auctionFileNumber: [{value: deliveryNote.auctionFileNumber,disabled: true},Validators.required],
        auctionValue: [{value: deliveryNote.auctionValue,disabled: true},Validators.required],
        buyersName: [{value: deliveryNote.buyersName,disabled: true},Validators.required],
        buyersAddress:[{value: deliveryNote.buyersAddress,disabled: true}],
        contactNumber:[{value: deliveryNote.contactNumber,disabled: true},Validators.required],
        issueDate:[deliveryNote.issueDate,Validators.required],
        deliveryStatus: [deliveryNote.deliveryStatus],
        paymentStatus: [deliveryNote.paymentStatus,Validators.required],
        assetDescription: [{value: deliveryNote.assetDescription,disabled: true},Validators.required],
        requestStatus:[deliveryNote.requestStatus],
        auctionDate:[{value: deliveryNote.auctionDate,disabled: true},Validators.required]
      });
    }
}
