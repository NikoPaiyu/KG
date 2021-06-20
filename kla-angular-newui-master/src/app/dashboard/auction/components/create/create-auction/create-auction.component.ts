import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { Observable, of } from 'rxjs';
import {Location} from '@angular/common';
import { AuctionConstant, AuctionConstantApi, NoSpaceRegex, TitleNames } from '../../../constants/auction.constant';
import { Auction, Attachment } from '../../../models/auction.model';
import { UISTATE } from '../../../models/auction.types';
import { AuctionApiService } from '../../../services/auction-api.service';
import { AuctionCommonService } from '../../../services/auction-common.service';

@Component({
  selector: 'app-create-auction',
  templateUrl: './create-auction.component.html',
  styleUrls: ['./create-auction.component.scss']
})
export class CreateAuctionComponent implements OnInit {

  /*
    Create Title
  */
   createTitle: string = TitleNames.auction.create;

  /*
    Disposal Bread Cums List
  */
    auctionBreadCums = AuctionConstant.createAuctionBreadcums;

    /*
      Disposal Form Group
    */
    auctionFormGroup: FormGroup;
  
    /*
      UI state
    */
    UIState$: Observable<UISTATE>;
  
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
    public onSubmit(status: string): void {
      this.statusOfAuction.setValue(status);
      this._auctionApiService.createDashboardRequest<Auction>(this.auctionFormGroup.value,AuctionConstantApi.createAuctionRequestApi)
      .subscribe(response => {
        if(typeof response === 'number'){ 
          this._success(TitleNames.auction.createSuccess,response);
        }
      });
    }
  
    public onEdit(status: string): void {
      this.statusOfAuction.setValue(status);
      this._auctionApiService.updateDashboardRequest<Auction>(this.auctionFormGroup.value,`${AuctionConstantApi.editAuctionRequestApi}`)
      .subscribe(response => {
        if(typeof response === 'number'){ 
          this._success(TitleNames.auction.editSuccess,response);
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
      Going the edit state
    */
    public onEditState(){
      this.UIState$ = of('EDIT');
      this.createTitle = TitleNames.auction.edit;
    } 


    /*
      Geting the File List From File List Component
    */
    public fileListEvent(attachment: Attachment[]){
      this.auctionFormGroup.get('attachments').setValue(attachment);
    }

    /*
    Going to Bids after auction has been aprroved
    */
    public viewBids(){
      this._router.navigateByUrl(`business-dashboard/auction/bids/create/${this.auctionFormGroup.get('id').value}`)
    }

    public get statusOfAuction(){
      return this.auctionFormGroup.get('statusOfAuction');
    }
  
    /*
      Check for URL
    */
    private _checkForUrl(){
      this._activateRoute.params.subscribe(param => {
        if(param.disposalRequest){
          this._createProcessing();
          this.auctionFormGroup.get('disposalRequestId').setValue(param.disposalRequest); // Setting the Disposal Requst
          return;
        }
        if(param.id){
          this._checkForEdit(param.id);
          this.UIState$ = of('VIEW');
          this.createTitle = TitleNames.auction.view;
        }else{
          this._createProcessing();
        }
      });
    }

    private _createProcessing(){
      this.UIState$ = of('CREATE');
      this._initDisposalRequestForm(new Auction());
    }
  
    /*
      Check for Edit
    */
    private _checkForEdit(id: string){
      this._auctionApiService.getDataForRequest<Auction>(`${AuctionConstantApi.editAuctionRequestApi}/${id}`).subscribe(auction => {
        this._initDisposalRequestForm(auction);
      });
    }
  
    
    /*
    public Success Message
    */
    private _success(message: string ,id :number,type?: string): void{
      console.log(message);
      this._notification.success(`${message} ${id}`,'');
      this.auctionFormGroup.reset();
      this._router.navigateByUrl('business-dashboard/auction/auction');
      if(type && type === 'create'){
        this._auctionCommonService.setNotificationValue({
          id: id,
          name : 'Auction Request'
        })
      }
    }
  
    /*
      Init Disposal Request Form Group
    */
    private _initDisposalRequestForm(auction?: Auction): void {
      this.auctionFormGroup = this._formBuilder.group({
          id: [auction.id],
          disposalRequestId: [auction.disposalRequestId, Validators.required],
          auctionDate:[auction.auctionDate, Validators.required],
          placeOfAuction:[auction.placeOfAuction, [Validators.required,Validators.pattern(NoSpaceRegex)]],
          depositAmount:[auction.depositAmount, Validators.required],
          description:[auction.description, [Validators.required,Validators.pattern(NoSpaceRegex)]],
          bidSubmissionDate:[auction.bidSubmissionDate, Validators.required],
          statusOfAuction:[auction.statusOfAuction],
          attachments: [auction.attachments]
      });
    }

}
