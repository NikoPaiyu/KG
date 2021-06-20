import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ApiConfig } from '../../../shared/config/api.config';

@Injectable({
  providedIn: 'root'
})
export class BillViewService {
  apiBaseURI: string;
  portfolioURI: string;
  environment: any;
  constructor(@Inject('environment') environment, private http: HttpClient) {
    this.environment = environment;
    this.apiBaseURI = this.environment.bill_api_url + ApiConfig.basePathBillFile;
    this.portfolioURI =
      this.environment.portfolio_mock_api_url + ApiConfig.portfolio;
  }


  getBillVersionDetails(versionNo, billId) {
    const url = this.apiBaseURI + `/getByVersionIdAndBillId?billId=${billId}&version=${versionNo}`;
    return this.http.get(url);
  }
  getBillByBillId(billId) {
    const url = this.apiBaseURI + `/${billId}`;
    return this.http.get(url);
  }
}
