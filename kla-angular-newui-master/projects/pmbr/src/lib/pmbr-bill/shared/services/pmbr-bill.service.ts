import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConfig } from '../../../shared/config/api.config';
import { billMetaData, billTypes } from '../models/pmbr-bill-model';

@Injectable({
  providedIn: 'root'
})
export class PmbrBillService {
  environment: any;
  pmbrApiBaseURI: string;
  billApiBaseURI: string;
  constructor(@Inject("environment") environment, private http: HttpClient) {
    this.environment = environment;
    this.pmbrApiBaseURI = this.environment.pmbr_api_url + ApiConfig.pmbrBasePathExt;
    this.billApiBaseURI = this.environment.bill_api_url + ApiConfig.billBasePathExt;
  }

  createPmbrBillMetaData(body: billMetaData) {
    const url = this.pmbrApiBaseURI + ApiConfig.pmbrBill.create
    return this.http.post(url, body)
  }
  getBillTypes() {
    const url = this.billApiBaseURI + `/type`
    return this.http.get<billTypes>(url);
  }
  createBillBlocks(body) {
    const url = this.pmbrApiBaseURI + ApiConfig.pmbrBill.createBlock;
    return this.http.post(url, body);
  }
  updateBillBlocks(body) {
    const url = this.pmbrApiBaseURI + ApiConfig.pmbrBill.updateBlock;
    return this.http.put(url, body);
  }
  removeBlock(blockId) {
    const url = this.pmbrApiBaseURI + ApiConfig.pmbrBill.deleteBlock + `${blockId}`;
    return this.http.delete(url);
  }
  getApprovedBillList() {
    const url = this.billApiBaseURI + '/act/getAll';
    return this.http.get(url);
  }
  getBillByBillId(billId) {
    const url = this.pmbrApiBaseURI + ApiConfig.pmbrBill.getBills + `/${billId}`;
    return this.http.get(url);
  }
  getSubBlockByBlockId(blockId) {
    const url = this.billApiBaseURI + `/block/getSubBlockById?blockId=${blockId}`;
    return this.http.get(url);
  }
  submitBill(body) {
    const url = this.pmbrApiBaseURI + ApiConfig.pmbrBill.submit;
    return this.http.post(url, body);
  }
  approveAndSendBill(body) {
    const url = this.pmbrApiBaseURI + `/sendToSection`;
    return this.http.post(url, body);
  }
  submitByAssistant(body) {
    const url = this.pmbrApiBaseURI + `/submittedByAssistant`;
    return this.http.post(url, body);
  }
  createFile(body) {
    return this.http.post(this.pmbrApiBaseURI + ApiConfig.pmbrBill.createFile, body);
  }
  getBillVersionDetails(versionNo, billId) {
    const url = this.pmbrApiBaseURI + `/bill/getByVersionIdAndBillId?billId=${billId}&version=${versionNo}`;
    return this.http.get(url);
  }
  createBillFile(body) {
    return this.http.post(this.billApiBaseURI + ApiConfig.pmbrBill.createFile, body);
  }
  saveNotice(body) {
    const url = this.pmbrApiBaseURI + ApiConfig.notice.saveNotice;
    return this.http.post(url, body);
  }
  getNoticeById(noticeId) {
    const url = this.pmbrApiBaseURI + ApiConfig.notice.getNoticeById + `/${noticeId}`
    return this.http.get(url);
  }
}
