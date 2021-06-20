import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ApiConfig } from '../../../shared/config/api.config';
import { formatDate } from '@angular/common';
import { noticeDescription, noticePpoDescription } from '../models/pmbr-resolution-model';
@Injectable({
  providedIn: 'root'
})
export class PmbrResolutionService {
  environment: any;
  pmbrApiBaseURI: string;
  billApiBaseURI: string;
  constructor(@Inject("environment") environment, private http: HttpClient) {
    this.environment = environment;
    this.pmbrApiBaseURI = this.environment.pmbr_api_url + ApiConfig.pmbrBasePathExt;
  }

  //create resolution metadata
  createResolutionMetadata(body) {
    const url = this.pmbrApiBaseURI + ApiConfig.resolution.createResolutionMetadat
    return this.http.post(url, body);
  }

  //create resolution block
  createResolutionBlock(data) {
    const url = this.pmbrApiBaseURI + ApiConfig.resolution.createResolutionBlock;
    return this.http.post(url, data)
  }

  //get resolution by id
  getResolutionById(id) {
    const url = this.pmbrApiBaseURI + ApiConfig.resolution.getResolutionById + `${id}`;
    return this.http.get(url)
  }

  //submit resolution
  submitResolution(body) {
    const url = this.pmbrApiBaseURI + ApiConfig.resolution.submit;
    return this.http.post(url, body);
  }

  //get new block object
  getNewResolutionBlock(index, typeId, id) {
    return {
      id: null,
      billId: id,
      index: index + 1,
      indexValue: '',
      parentId: null,
      type: {
        id: typeId
      }
    }
  }
  getResolutionList(body) {
    return this.http.post(this.pmbrApiBaseURI + `/resolution/list`, body);
  }
  deleteResolutionBlockById(blockId) {
    const url = this.pmbrApiBaseURI + ApiConfig.resolution.deleteResolutionBlockById + `?id=${blockId}`;
    return this.http.delete(url)
  }
  uploadUrl() {
    return 'http://45.249.111.246:8088/file/uploadImage';
  }
  getAllNotice(body) {
    const url = this.pmbrApiBaseURI + ApiConfig.resolutionLottingNotice.getAllNotice;
    return this.http.post(url, body);
  }
  getNoticeById(noticeId) {
    const url = this.pmbrApiBaseURI + ApiConfig.resolutionLottingNotice.getNoticeById + `/${noticeId}`;
    return this.http.get(url);
  }
  createResolutionNotice(body) {
    const url = this.pmbrApiBaseURI + ApiConfig.resolution.createNotice;
    return this.http.post(url, body);
  }
  getResolutionVersionDetails(versionNo, resolutionId) {
    const url = this.pmbrApiBaseURI + ApiConfig.resolution.getResolutionVersion + `${resolutionId}&version=${versionNo}`;
    return this.http.get(url);
  }
  saveNotice(body) {
    const url = this.pmbrApiBaseURI + ApiConfig.resolutionLottingNotice.create;
    return this.http.post(url, body);
  }
  submitNotice(body) {
    const url = this.pmbrApiBaseURI + ApiConfig.resolutionLottingNotice.submit;
    return this.http.post(url, body);
  }
  getResolutionLists(body) {
    return this.http.put(this.pmbrApiBaseURI + `/resolution`, body);
  }
  getResolutionSubmittedList() {
    return this.http.get(this.pmbrApiBaseURI + `/resolution/submittedBills`);
  }
  soAssigntoAssistant(body) {
    return this.http.post(this.pmbrApiBaseURI + `/resolution/assignToAssistant`, body);
  }
  soAssignedList() {
    return this.http.get(this.pmbrApiBaseURI + `/resolution/listAssignedBills`);
  }
  getResolutionForAction(body) {
    return this.http.get(this.pmbrApiBaseURI + `/resolution/listBillForAction/${body.id}`);
  }
  getResolutionProcessedByAssistant(body) {
    return this.http.get(this.pmbrApiBaseURI + `/resolution/listAssistantProcessed/${body.id}`);
  }
  getOwnNoticesList() {
    return this.http.get(this.pmbrApiBaseURI + ApiConfig.schedule.getOwnNoticesList);
  }
  getActivePresentationDates() {
    const url = this.pmbrApiBaseURI + ApiConfig.schedule.presentation + `?type=${'RESOLUTION'}`;
    return this.http.get(url);
  }
  acceptNotice(body) {
    const url = this.pmbrApiBaseURI + ApiConfig.resolutionLottingNotice.accept;
    return this.http.put(url, body);
  }
  updateResolutionPresentStatus(resolutionId) {
    const url = this.pmbrApiBaseURI + ApiConfig.resolution.updateResolutionSubmitStatus + resolutionId;
    return this.http.post(url, {});
  }
  updateResolutionFinalPresentStatus(resolutionId) {
    const url = this.pmbrApiBaseURI + ApiConfig.resolution.updateResolutionFinalPresent + resolutionId;
    return this.http.post(url, {});
  }
  getPresentedResolutionList() {
    const url = this.pmbrApiBaseURI + ApiConfig.resolutionList.getPresentedInSabha;
    return this.http.get(url);
  }
  replaceNoticeDescription(date, isMla) {
    const description = isMla?noticeDescription: noticePpoDescription;
    const finalData =`<p>സർ,</p>`+`<p> ${formatDate(date, 'dd-MM-yyyy', 'en')} ` + `${this.getDayName(date)} ` + `${description}` + `</p>`;
    return finalData;
  }
  getDayName(date) {
    switch (date.getDay()) {
      case 0:
        return "ഞായറാഴ്ച";
      case 1:
        return "തിങ്കളാഴ്ച";
      case 2:
        return "ചൊവ്വാഴ്ച";
      case 3:
        return "ബുധനാഴ്ച";
      case 4:
        return "വ്യാഴാഴ്ച";
      case 5:
        return "വെള്ളിയാഴ്ച";
      case 6:
        return "ശനിയാഴ്ച";
    }
  }
  getAdditionalResolutionList() {
    const url = this.pmbrApiBaseURI + ApiConfig.resolution.additionalToSpeakerNote;
    return this.http.get(url);
  }
}
