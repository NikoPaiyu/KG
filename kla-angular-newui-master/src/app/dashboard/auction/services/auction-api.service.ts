import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuctionApiService {

  private _apiUrl = 'http://localhost:8080/';

  constructor(private _http: HttpClient) {}

  /*
    Get Data For Dashboards
  */
  public getDataForDashboard<T>(url: string): Observable<T[]>{
    return this._http.get<T[]>(`${this._apiUrl}${url}`).pipe(retry(2),catchError((err) => {
      return [];
    })); 
  }

    /*
    Get Data For Dashboards
  */
    public getDataForRequest<T>(url: string): Observable<T>{
      return this._http.get<T>(`${this._apiUrl}${url}`).pipe(retry(2),catchError((err) => {
        return [];
      })); 
    }

  /*
    Create Request on save
  */
  public createDashboardRequest<T>(data: T,url: string): Observable<any>{
    return this._http.post<T>(`${this._apiUrl}${url}`,data);
  }


  /*
    Create Request on Submit
  */
    public createDashboardRequestSubmit<T>(data: T,url: string): Observable<any>{
    const requestOptions: Object = { responseType: 'text'};
    return this._http.post<T>(`${this._apiUrl}${url}`,data,requestOptions);
    }

  /*
    Create Request
  */
    public updateDashboardRequest<T>(data: T,url: string): Observable<any>{
      return this._http.put<T>(`${this._apiUrl}${url}`,data).pipe(retry(2),catchError((err) => {
        return EMPTY;
      }));
    }

}
