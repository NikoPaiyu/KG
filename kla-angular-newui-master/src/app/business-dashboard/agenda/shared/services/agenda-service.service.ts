import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { environment } from "../../../../../environments/environment";
import { Subject, forkJoin } from "rxjs";
import { NgxSpinnerService } from "ngx-spinner";
@Injectable()
export class AgendaServiceService {
  constructor(private http: HttpClient, private spinner: NgxSpinnerService) {}
  private itemData = new Subject<any>();
  public addItemData = this.itemData.asObservable();

  getLobList(assemblyId, sessionId) {
    let params = {
      assemblyId: assemblyId,
      sessionId: sessionId,
      type: "AGENDA"
    };
    return this.http
      .get(`${environment.lob_api_url}/get/dayList`, { params: params })
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  getBusinessTypeList() {
    return this.http
      .get(`${environment.lob_businesses_mock_url}/getAll/AGENDA`)
      .pipe(
        map(res => {
          return res;
        })
      );
  }
  getBusinessList(assemblyId, sessionId, date, businessId) {
    let params = {
      assemblyId: assemblyId,
      sessionId: sessionId,
      date: date,
      type: "AGENDA"
    };
    return this.http
      .get(`${environment.lob_api_url}/get/businessLines`, { params: params })
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  setModalItemDatatoParent(data) {
    this.itemData.next(data);
  }

  uploadFile(file) {
    const formData = new FormData();
    formData.append("file", file);
    return this.http.post(
      `${environment.fileupload_url}/uploadImage`,
      formData
    );
  }
  uploadSpeakerNoteFile(file) {
    const formData = new FormData();
    formData.append("file", file);
    return this.http.post(
      `${environment.fileupload_url}/uploadSpeakerNote`,
      formData
    );
  }
  saveBusinessLineItem(businessLineItem, formData) {
    let speakerNoteFlipUrl = "";
    let fileUploadArray = [];
    let documentFile = false;
    let answerfile = false;
    let speakerNote = false;
    if (formData.file) {
      documentFile = true;
      fileUploadArray.push(this.uploadFile(formData.file));
    }
    if (formData.answerFile) {
      answerfile = true;
      fileUploadArray.push(this.uploadFile(formData.answerFile));
    }
    if (formData.speakerNoteFile) {
      fileUploadArray.push(this.uploadFile(formData.speakerNoteFile));
      fileUploadArray.push(
        this.uploadSpeakerNoteFile(formData.speakerNoteFile)
      );
    }
    if (fileUploadArray.length > 0) {
      forkJoin(fileUploadArray).subscribe((res: any) => {
        this.spinner.show();
        let businessLine = {
          title: formData.title,
          description: formData.description,
          primaryDocumentUrl: documentFile ? res[0].body : "",
          secondaryDocumentUrl: documentFile
            ? answerfile
              ? res[1]
                ? res[1].body
                : ""
              : ""
            : answerfile
            ? res[0]
              ? res[0].body
              : ""
            : "",
          speakerNoteUrl: documentFile
            ? answerfile
              ? res[2]
                ? res[2].body
                : ""
              : res[1]
              ? res[1].body
              : ""
            : answerfile
            ? res[1]
              ? res[1].body
              : ""
            : res[0]
            ? res[0].body
            : "",
          flipUrl: documentFile
            ? answerfile
              ? res[3]
                ? res[3].body
                : ""
              : res[2]
              ? res[2].body
              : ""
            : answerfile
            ? res[2]
              ? res[2].body
              : ""
            : res[1]
            ? res[1].body
            : "",
          primaryMemberId: formData.memberId.value,
          secondaryMemberId: formData.secondaryOwnerId
            ? formData.secondaryOwnerId.value
            : "",
          primaryMemberName: formData.memberId.label,
          secondaryMemberName: formData.secondaryOwnerId
            ? formData.secondaryOwnerId.label
            : "",
          allotedTime: formData.allotedTime,
          businessId: businessLineItem.businessId,
          businessName: businessLineItem.businessName,
          businessNameMalayalam: businessLineItem.businessNameMalayalam
        };
        let data = {
          sessionId: businessLineItem.sessionId,
          assemblyId: businessLineItem.assemblyId,
          date: businessLineItem.date,
          type: "AGENDA",
          businessLine: businessLine
        };
        return this.http
          .post(`${environment.lob_api_url}/save`, data)
          .pipe(map(res => res))
          .subscribe(res => {
            this.spinner.hide();
            this.setModalItemDatatoParent(res);
          });
      });
    } else {
      this.spinner.show();
      let businessLine = {
        title: formData.title,
        description: formData.description,
        primaryMemberId: formData.memberId.value,
        secondaryMemberId: formData.secondaryOwnerId
          ? formData.secondaryOwnerId.value
          : "",
        primaryMemberName: formData.memberId.label,
        secondaryMemberName: formData.secondaryOwnerId
          ? formData.secondaryOwnerId.label
          : "",
        allotedTime: formData.allotedTime,
        businessId: businessLineItem.businessId,
        businessName: businessLineItem.businessName,
        businessNameMalayalam: businessLineItem.businessNameMalayalam
      };
      let data = {
        sessionId: businessLineItem.sessionId,
        assemblyId: businessLineItem.assemblyId,
        date: businessLineItem.date,
        type: "AGENDA",
        businessLine: businessLine
      };
      return this.http
        .post(`${environment.lob_api_url}/save`, data)
        .pipe(map(res => res))
        .subscribe(res => {
          this.spinner.hide();
          this.setModalItemDatatoParent(res);
        });
    }
  }

  deleteBusinessLIneItem(businessLineItemId) {
    return this.http
      .delete(
        `${environment.lob_api_url}/delete/businessLine/${businessLineItemId}`
      )
      .map(res => res);
  }

  deleteAllByBusinessId(assemblyId, sessionId, date, businessId) {
    let params = {
      assemblyId: assemblyId,
      sessionId: sessionId,
      date: date,
      businessId: businessId
    };
    return this.http
      .delete(`${environment.lob_api_url}/delete/all`, { params: params })
      .map(res => res);
  }

  getAllAgendaListByDate(assemblyId, sessionId, date) {
    let params = {
      assemblyId: assemblyId,
      sessionId: sessionId,
      date: date,
      type: "AGENDA"
    };
    return this.http
      .get(`${environment.lob_api_url}/get/getAllBusinessLines`, {
        params: params
      })
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  updateBusinessLineItem(businessLineItem, formData) {
    let fileUploadArray = [];
    let documentFile = false;
    let answerfile = false;
    if (formData.file && formData.file.uid != -1) {
      documentFile = true;
      fileUploadArray.push(this.uploadFile(formData.file));
    }
    if (formData.answerFile && formData.answerFile.uid != -1) {
      answerfile = true;
      fileUploadArray.push(this.uploadFile(formData.answerFile));
    }
    if (formData.speakerNoteFile && formData.speakerNoteFile.uid != -1) {
      fileUploadArray.push(this.uploadFile(formData.speakerNoteFile));
      fileUploadArray.push(
        this.uploadSpeakerNoteFile(formData.speakerNoteFile)
      );
    }
    if (fileUploadArray.length > 0) {
      forkJoin(fileUploadArray).subscribe((res: any) => {
        this.spinner.show();
        let businessLine = {
          id: formData.id,
          title: formData.title,
          description: formData.description,
          primaryDocumentUrl: documentFile
            ? res[0].body
            : formData.file
            ? formData.file.url
            : "",
          secondaryDocumentUrl: documentFile
            ? answerfile
              ? res[1]
                ? res[1].body
                : formData.answerFile
                ? formData.answerFile.url
                : ""
              : formData.answerFile
              ? formData.answerFile.url
              : ""
            : answerfile
            ? res[0]
              ? res[0].body
              : formData.answerFile
              ? formData.answerFile.url
              : ""
            : formData.answerFile
            ? formData.answerFile.url
            : "",
          speakerNoteUrl: documentFile
            ? answerfile
              ? res[2]
                ? res[2].body
                : formData.speakerNoteFile
                ? formData.speakerNoteFile.url
                : ""
              : res[1]
              ? res[1].body
              : formData.speakerNoteFile
              ? formData.speakerNoteFile.url
              : ""
            : answerfile
            ? res[1]
              ? res[1].body
              : formData.speakerNoteFile
              ? formData.speakerNoteFile.url
              : ""
            : res[0]
            ? res[0].body
            : formData.speakerNoteFile
            ? formData.speakerNoteFile.url
            : "",
          flipUrl: documentFile
            ? answerfile
              ? res[3]
                ? res[3].body
                : formData.flipUrl
              : res[2]
              ? res[2].body
              : formData.flipUrl
            : answerfile
            ? res[2]
              ? res[2].body
              : formData.flipUrl
            : res[1]
            ? res[1].body
            : formData.flipUrl,
          primaryMemberId: formData.memberId.value,
          secondaryMemberId: formData.secondaryOwnerId
            ? formData.secondaryOwnerId.value
            : "",
          primaryMemberName: formData.memberId.label,
          secondaryMemberName: formData.secondaryOwnerId
            ? formData.secondaryOwnerId.label
            : "",
          allotedTime: formData.allotedTime,
          businessId: businessLineItem.businessId,
          businessName: businessLineItem.businessName,
          businessNameMalayalam: businessLineItem.businessNameMalayalam,
          sequenceNumber: businessLineItem.sequenceNumber
        };
        let data = {
          sessionId: businessLineItem.sessionId,
          assemblyId: businessLineItem.assemblyId,
          date: businessLineItem.date,
          type: "AGENDA",
          businessLine: businessLine
        };
        return this.http
          .put(`${environment.lob_api_url}/update`, data)
          .pipe(map(res => res))
          .subscribe(res => {
            this.spinner.hide();
            this.setModalItemDatatoParent(res);
          });
      });
    } else {
      this.spinner.show();
      let businessLine = {
        id: formData.id,
        title: formData.title,
        description: formData.description,

        primaryDocumentUrl: formData.file ? formData.file.url : "",
        secondaryDocumentUrl: formData.answerFile
          ? formData.answerFile.url
          : "",
        speakerNoteUrl: formData.speakerNoteFile
          ? formData.speakerNoteFile.url
          : "",
        flipUrl: formData.flipUrl,
        primaryMemberId: formData.memberId.value,
        secondaryMemberId: formData.secondaryOwnerId
          ? formData.secondaryOwnerId.value
          : "",
        primaryMemberName: formData.memberId.label,
        secondaryMemberName: formData.secondaryOwnerId
          ? formData.secondaryOwnerId.label
          : "",
        allotedTime: formData.allotedTime,
        businessId: businessLineItem.businessId,
        businessName: businessLineItem.businessName,
        businessNameMalayalam: businessLineItem.businessNameMalayalam,
        sequenceNumber: businessLineItem.sequenceNumber
      };
      let data = {
        sessionId: businessLineItem.sessionId,
        assemblyId: businessLineItem.assemblyId,
        date: businessLineItem.date,
        type: "AGENDA",
        businessLine: businessLine
      };
      return this.http
        .put(`${environment.lob_api_url}/update`, data)
        .pipe(map(res => res))
        .subscribe(res => {
          this.spinner.hide();
          this.setModalItemDatatoParent(res);
        });
    }
  }

  updatelobAgendaOrder(lob, addtoBusinessList) {
    let sequenceNo = 0;
    let orderedLobAgendaLine = [];
    addtoBusinessList.forEach(business => {
      business.businessLines.forEach(element => {
        let line = {
          id: element.id,
          sequenceNumber: ++sequenceNo
        };
        orderedLobAgendaLine.push(line);
      });
    });

    let data = {
      sessionId: lob.session,
      assemblyId: lob.assembly,
      date: lob.date,
      type: "AGENDA",
      orderedLobAgendaLines: orderedLobAgendaLine
    };
    return this.http
      .post(`${environment.lob_api_url}/reorderLobAgendaBusinessLines`, data)
      .pipe(map(res => res));
  }

  saveBusinessType(data) {
    let body = [];
    body.push(data);
    return this.http
      .post(`${environment.lob_businesses_mock_url}/saveList`, body)
      .pipe(
        map(res => {
          return res;
        })
      );
  }
  generateSpeakerNote(body) {
    const url = environment.lob_api_url + '/genarateSpeakerNote';
    return this.http.put(url, body);
  }
}
