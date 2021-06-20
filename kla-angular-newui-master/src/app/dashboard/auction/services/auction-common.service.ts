import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { of } from 'rxjs';
import { BehaviorSubject, Subject } from 'rxjs';
import { Attachment, Disposal } from '../models/auction.model';

@Injectable({
  providedIn: 'root'
})
export class AuctionCommonService {

  private editDisposalRequestSource = new BehaviorSubject<any>(null);
  public editDisposal$ = this.editDisposalRequestSource.asObservable();

  private notificationSource = new Subject<any>();
  public notification$ = this.notificationSource.asObservable();

  notifications = [];
  
  constructor() { }

  /*
    Sets the Value
  */
  public setEditDisposalValue<T>(value: T){
    this.editDisposalRequestSource.next(value);
  }

    /*
    Sets the Value
  */
  public setNotificationValue<T>(value: T){
      this.notificationSource.next(value);
  }

  /* Status and Date */
  public returnFilterDateAndStatus<T>(date: string[],status: string,tempArr: T[],dateProp: string,statusProp: string){
    const filtredDataByDate = this.returnFilterDate<T>(date,tempArr,dateProp);
    console.log(this.returnFilterStatus<T>(status,filtredDataByDate,statusProp));
    return this.returnFilterStatus<T>(status,filtredDataByDate,statusProp);
  }

  /* Only Status */
  public returnFilterStatus<T>(status: string | number,tempArr: T[],statusProp: string): T[]{
    return tempArr.filter(data => {
     return String(data[statusProp]).includes(String(status));
  });
  } 

  /* Only Date */
  public returnFilterDate<T>(date: string[],tempArr: T[],dateProp: string){
    return tempArr.filter((data: T) => {
        const isBetween = moment(new Date(data[dateProp])).isBetween(new Date(date[0]), new Date(date[1]));
        if(isBetween)
        return data;
    });
  }

}
