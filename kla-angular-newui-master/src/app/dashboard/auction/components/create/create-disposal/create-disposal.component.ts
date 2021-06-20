import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { Observable, of } from 'rxjs';
import {Location} from '@angular/common';
import { AuctionConstant, AuctionConstantApi, NoSpaceRegex, TitleNames } from '../../../constants/auction.constant';
import { Disposal, Attachment } from '../../../models/auction.model';
import { UISTATE } from '../../../models/auction.types';
import { AuctionApiService } from '../../../services/auction-api.service';
import { AuctionCommonService } from '../../../services/auction-common.service';

@Component({
  selector: 'app-create-disposal',
  templateUrl: './create-disposal.component.html',
  styleUrls: ['./create-disposal.component.scss']
})
export class CreateDisposalComponent implements OnInit {

  /*
    Disposal Bread Cums List
  */
  disposalBreadCums = AuctionConstant.createDisposalBreadCums;

  /*
    Disposal Form Group
  */
  disposalFormGroup: FormGroup;

  /*
    UI state
  */
  UIState$: Observable<UISTATE>;

  /* Screen Name */
  createTitle: string = 'Create Disposal Request';

  constructor(private _location: Location, private _activateRoute: ActivatedRoute,private _auctionCommonService: AuctionCommonService,private _formBuilder: FormBuilder,private _auctionApiService: AuctionApiService,private _notification: NzNotificationService,private _router: Router) { }

  /*
    Lifecycle Hook
  */
  ngOnInit(): void {
    this._checkForUrl();
  } 

  /*
      On Disposal Submit
  */
  public onSubmit(status = 'Draft'): void {
    this._auctionApiService.createDashboardRequestSubmit<Disposal>(this.disposalFormGroup.value,AuctionConstantApi.createDashboardApiSubmit)
    .subscribe(response => {
      this._success(TitleNames.disposal.fmsSuccess,String(response));
    });
  }

  /*
  On Disposal Save
  */
  public onSave(status = 'Draft'): void {
    this._auctionApiService.createDashboardRequest<Disposal>(this.disposalFormGroup.value,AuctionConstantApi.createDisposalRequestApi)
    .subscribe(response => {
        this._success(TitleNames.disposal.createSuccess,String(response));
    });
  }

  /*
    Editing the Request
  */

  public onEdit(): void {
    this._auctionApiService.updateDashboardRequest<Disposal>(this.disposalFormGroup.value,`${AuctionConstantApi.createDisposalRequestApi}`)
    .subscribe(response => {
      if(typeof response === 'number'){ 
        this._success('Asset disposal request Has been edited with id',String(response));
      }
    });
  }

  /*
    Go Back to Dashboard
  */
  public navigateToDashboard(){
    this._location.back();
  }

  /*
    On Create Auction
  */
  public onCreateAuction(){
    this._router.navigateByUrl(`business-dashboard/auction/auction/create/${this.disposalFormGroup.get('id').value}`);
  }

  /*
    Getting Event from file list
  */
  public fileListEvent(attachment: Attachment[]){
    this.disposalFormGroup.get('attachments').setValue(attachment);
  }

  /*
    On Edit State
  */
  public onEditState(){
    this.createTitle = 'Edit Disposal Request';
    this.UIState$ = of('EDIT');
  }

  /*
    Getting Disposal Statis
  */
   get statusOfDisposal(): AbstractControl{
     if(this.disposalFormGroup)
     return this.disposalFormGroup.get('statusOfDisposal');
   }

  /*
    Check for URL
  */
  private _checkForUrl(){
    this._activateRoute.params.subscribe(param => {
      if(param.id){
        this._checkForEdit(param.id);
        this.UIState$ = of('VIEW');
        this.createTitle = 'View Disposal Request';
      }else{
        this.UIState$ = of('CREATE');
        this.createTitle = 'Create Disposal Request';
        this._initDisposalRequestForm(new Disposal());
      }
    });
  }

  /*
    Check for Edit
  */
  private _checkForEdit(id: string){
    this._auctionApiService.getDataForRequest<Disposal>(`${AuctionConstantApi.editDisposalRequestApi}/ ${id}`).subscribe(disposal => {
      this._initDisposalRequestForm(disposal);
    });
  }

  /*
  public Success Message
  */
  private _success(message: string,id: string): void{
    this._notification.success(`Disposal Request`,`${message} ${id}`,{
      'nzPauseOnHover' : true,
    });
    this.disposalFormGroup.reset();
    this._router.navigateByUrl('business-dashboard/auction/disposal');
  }

  /*
    Init Disposal Request Form Group
  */
  private _initDisposalRequestForm(disposal?: Disposal): void {
    this.disposalFormGroup = this._formBuilder.group({
      reasonForDisposal : [disposal.reasonForDisposal,Validators.required],
      dateForDisposal: [disposal.dateForDisposal,Validators.required],
      expectedDisposalValue: [disposal.expectedDisposalValue,Validators.required],
      disposalMethod:  [disposal.disposalMethod,Validators.required],
      remarks: [disposal.remarks,[Validators.required,Validators.pattern(NoSpaceRegex)]],
      statusOfDisposal: [disposal.statusOfDisposal],
      attachments: [disposal.attachments],
      id: [disposal.id]
    });
  }
}
