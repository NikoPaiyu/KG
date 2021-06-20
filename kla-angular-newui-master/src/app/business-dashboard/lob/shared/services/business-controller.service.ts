import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { map } from "rxjs/operators";
import { AuthService } from "src/app/auth/shared/services/auth.service";
@Injectable({
  providedIn: "root"
})
export class BusinessControllerService {
  constructor(private http: HttpClient, private authService: AuthService) { }
  getLiveRunnigLines() {
    return this.http
      .get(`${environment.business_controller_api_url}/getLiveRunnigLines`)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  getLiveBusinesses() {
    return this.http
      .get(`${environment.business_controller_api_url}/liveBusiness`)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  getGroupedLiveRunnigLines() {
    return this.http
      .get(`${environment.business_controller_api_url}/getGroupedRunnigLines`)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  playBusiness(items, type) {
    let formatedBody = this.mapPlayBusinessData(items, type);
    return this.http
      .post(`${environment.document_api_url}/setCurrentBusiness`, formatedBody)
      .pipe(
        map(res => {
          return res;
        })
      );
  }
  playSpeakerNote(url) {
    let body = {
      businessCode: "SPEAKER_NOTE",
      documentUrl: url
    };
    return this.http
      .post(`${environment.document_api_url}/setCurrentSpeakerNote`, body)
      .pipe(
        map(res => {
          return res;
        })
      );
  }
  currentBusinessStop() {
    return this.http
      .post(`${environment.document_api_url}/stopBusiness`, {})
      .pipe(
        map(res => {
          return res;
        })
      );
  }
  currentBusinessPause(action) {
    return this.http
      .post(
        `${environment.document_api_url}/toggleBusiness?action=${action}`,
        {}
      )
      .pipe(
        map(res => {
          return res;
        })
      );
  }
  mapPlayBusinessData(items, type) {
    let businessCode;
    // (items.businessName == "Financial Business" && "BUDGET") ||
    //   (items.businessName == "Address by The Governor" && "GOVERNORSPEECH") ||
    //   "BC";
    if (items.businessName == "Financial Business") {
      businessCode = "BUDGET"
    }
    else if (items.businessName == "Address by The Governor") {
      businessCode = "GOVERNORSPEECH"
    }
    else if (items.businessName == "Obituary Reference") {
      businessCode = "Obituary Reference"
    }
    else {
      businessCode = "BC"
    }
    let ownerName =
      type == "Question" ? items.primaryMemberName : items.secondaryMemberName;
    let ownerId =
      type == "Question" ? items.primaryMemberId : items.secondaryMemberId;
    let documentUrl =
      type == "Question"
        ? items.primaryDocumentUrl
        : items.secondaryDocumentUrl;
    if (type != "Question" && items.respondent) {
      if (items.respondent.documentUrl && items.respondent.memberId && items.respondent.memberName) {
        ownerName = items.respondent.memberName;
        // ownerId = items.respondent.memberId;
        ownerId = this.authService.getCurrentUser().userId;
        documentUrl = items.respondent.documentUrl;
      }
    }
    let body = {
      ownerName,
      ownerId,
      businessCode,
      documentUrl,
      currentIndex: 1,
      allocatedTime: items.allotedTime,
      businessName: items.businessName,
      lobId: items.id,
      businessNameMalayalam: items.businessNameMalayalam,
      token: this.authService.getToken()
    };
    return body;
  }
  stopTodaysBusiess() {
    return this.http
      .post(`${environment.document_api_url}/closeSpeakerNote`, {})
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  switchMember(currentBusiness, member) {
    let formatedBody = {
      businessNameMalayalam: currentBusiness
        ? currentBusiness.businessNameMalayalam
        : "",
      businessName: currentBusiness ? currentBusiness.businessName : "",
      ownerId: member.userId,
      businessCode: currentBusiness.businessCode
    };
    return this.http
      .post(`${environment.document_api_url}/interruptBusiness`, formatedBody)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  unSwitchMember() {
    return this.http
      .post(`${environment.document_api_url}/releaseInterruption`, {})
      .pipe(
        map(res => {
          return res;
        })
      );
  }
  publishQuestions(questionDate) {
    const url = environment.question_api_url + `question/publish?questionDate=${questionDate}`;
    return this.http.put(url, questionDate, { responseType: 'text' });
  }
}
