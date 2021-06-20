import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { environment } from "../../../../../environments/environment";
import { Subject, forkJoin } from "rxjs";
import { NgxSpinnerService } from "ngx-spinner";
import { formatDate } from "@angular/common";
@Injectable()
export class LobService {
  constructor(private http: HttpClient, private spinner: NgxSpinnerService) { }
  private itemData = new Subject<any>();
  public addItemData = this.itemData.asObservable();

  getLobList(assemblyId, sessionId) {
    let params = {
      assemblyId: assemblyId,
      sessionId: sessionId,
      type: "LOB"
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
      .get(`${environment.lob_businesses_mock_url}/getAll/LOB`)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  getBusinessTypeListByRole(roleId) {
    let params = {
      type: "LOB",
      roleId: roleId
    }
    return this.http
      .get(`${environment.lob_businesses_mock_url}/getForRole`, { params: params })
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  getBusinessListByRole(assemblyId, sessionId, date, roleId) {
    let params = {
      assemblyId: assemblyId,
      sessionId: sessionId,
      date: date,
      type: "LOB",
      roleId: roleId
    };
    return this.http
      .get(`${environment.lob_api_url}/get/businessLinesForRole`, { params: params })
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
      type: "LOB"
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
    let ministerReadingFile = false;
    if (formData.file) {
      documentFile = true;
      fileUploadArray.push(this.uploadFile(formData.file));
    }
    if (formData.answerFile) {
      answerfile = true;
      fileUploadArray.push(this.uploadFile(formData.answerFile));
    }
    if (formData.speakerNoteFile) {
      speakerNote = true;
      fileUploadArray.push(this.uploadFile(formData.speakerNoteFile));
      fileUploadArray.push(
        this.uploadSpeakerNoteFile(formData.speakerNoteFile)
      );
    }
    if (formData.subbusiness && this.isValidSubbusiness(formData.subbusiness)) {
      answerfile = true;
      fileUploadArray.push(formData.subbusiness);
    }
    // if (formData.ministerReadingFile) {
    //   ministerReadingFile = true;
    //   fileUploadArray.push(this.uploadFile(formData.ministerReadingFile));
    // }
    if (fileUploadArray.length > 0) {
      forkJoin(fileUploadArray).subscribe((res: any) => {
        this.spinner.show();
        res = res.filter((item) => !item.subBusinessName);
        let data = this.generateReqDataForLOBSave1(formData, res, businessLineItem, documentFile, answerfile);
        if (formData.ministerReadingFile) {
          this.handleMinisterReading(formData, data, 'save' );
          return;
        }
        return this.http
          .post(`${environment.lob_api_url}/save`, data)
          .pipe(map(res => res))
          .subscribe(res => {
            this.spinner.hide();
            this.setModalItemDatatoParent(res);
          });
      });
    } else if (formData.ministerReadingFile) {
      let data = this.generateReqDataForLOBSave2(formData, businessLineItem);
      this.handleMinisterReading(formData, data, 'save' );
      return;
    } else {
      this.spinner.show();
      let data = this.generateReqDataForLOBSave2(formData, businessLineItem);
      return this.http
        .post(`${environment.lob_api_url}/save`, data)
        .pipe(map(res => res))
        .subscribe(res => {
          this.spinner.hide();
          this.setModalItemDatatoParent(res);
        });
    }
  }
  handleMinisterReading(formData, data, type) {
    let ministerReading = [];
    ministerReading.push(this.uploadFile(formData.ministerReadingFile));
    forkJoin(ministerReading).subscribe((file: any) => {
      data.businessLine['ministerReadingDocumentUrl'] = file[0].body;
      return this.http
      .put(`${environment.lob_api_url}/${type}`, data)
      .pipe(map(res => res))
      .subscribe(res => {
        this.spinner.hide();
        this.setModalItemDatatoParent(res);
      });
    });
  }
  generateReqDataForLOBSave1(formData, res, businessLineItem, documentFile, answerfile) {
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
      businessNameMalayalam: businessLineItem.businessNameMalayalam,
      lobBusinessAgendaResponse: this.setlobBusinessAgendaResponse(formData.subbusiness)
    };
    let data = {
      sessionId: businessLineItem.sessionId,
      assemblyId: businessLineItem.assemblyId,
      date: businessLineItem.date,
      type: "LOB",
      roleId: businessLineItem.roleId,
      businessLine: businessLine
    };
    return data
  }
  generateReqDataForLOBSave2(formData, businessLineItem) {
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
      type: "LOB",
      roleId: businessLineItem.roleId,
      businessLine: businessLine
    };
    return data;
  }
  setlobBusinessAgendaResponse(subbusiness) {
    subbusiness.forEach(e => {
      if (!e.subBusinessName) {
        subbusiness = [];
      }
      e.lobBusinessRespondentMember.forEach(mem => {
        if (e.memberId == "") {
          subbusiness = [];
        } else {
          mem.memberName = mem.memberId.label;
          mem.memberId = mem.memberId.value;
        }
      });
    });
    return subbusiness;
  }
  isValidSubbusiness(subbusiness) {
    let status = true;
    if (subbusiness.length == 0) {
      status = false;
    }
    subbusiness.forEach(e => {
      if (!e.subBusinessName) {
        status = false;
      }
      e.lobBusinessRespondentMember.forEach(mem => {
        if (e.memberId == "") {
          status = false;
        }
      });
    });
    return status;
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
  getCurrentDayList() {
    return this.http.get(`${environment.lob_api_url}/get/currentDayList`).pipe(
      map(res => {
        return res;
      })
    );
  }

  getLobListOnlyByDate(date) {
    let d = date
      .toJSON()
      .split("T")[0]
      .toString();
    return this.http.get(`${environment.lob_api_url}/get/lobOnDate/${d}`).pipe(
      map(res => {
        return res;
      })
    );
  }

  getLobListOnlyByDatebusiness(date) {
    let d = formatDate(date, "yyyy-MM-dd", "en-US", "+0530");
    // let d = date
    //   .toJSON()
    //   .split("T")[0]
    //   .toString();
    return this.http
      .get(`${environment.lob_api_url}/get/lobOnDateGroupByBusiness?date=${d}`)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  getAllLobListByDate(assemblyId, sessionId, date) {
    let params = {
      assemblyId: assemblyId,
      sessionId: sessionId,
      date: date,
      type: "LOB"
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
    let speakerNote = false;
    let ministerReadingFile = false;

    if (formData.file && formData.file.uid != -1) {
      documentFile = true;
      fileUploadArray.push(this.uploadFile(formData.file));
    }
    if (formData.answerFile && formData.answerFile.uid != -1) {
      answerfile = true;
      fileUploadArray.push(this.uploadFile(formData.answerFile));
    }
    if (formData.speakerNoteFile && formData.speakerNoteFile.uid != -1) {
      speakerNote = true;
      fileUploadArray.push(this.uploadFile(formData.speakerNoteFile));
      fileUploadArray.push(
        this.uploadSpeakerNoteFile(formData.speakerNoteFile)
      );
    }
    // if (formData.ministerReadingFile && formData.ministerReadingFile.uid != -1) {
    //   ministerReadingFile = true;
    //   fileUploadArray.push(this.uploadFile(formData.ministerReadingFile));
    // }
    if (formData.subbusiness && this.isValidSubbusiness(formData.subbusiness)) {
      answerfile = true;
      fileUploadArray.push(formData.subbusiness);
    }
    if (fileUploadArray.length > 0) {
      forkJoin(fileUploadArray).subscribe((res: any) => {
        this.spinner.show();
        res = res.filter((item) => !item.subBusinessName);
        let data = this.generateReqDataForLOBUpdate1(formData, res, businessLineItem, documentFile, answerfile);
        if (formData.ministerReadingFile && formData.ministerReadingFile.uid != -1) {
          this.handleMinisterReading(formData, data, 'update');
          return;
        }
        return this.http
          .put(`${environment.lob_api_url}/update`, data)
          .pipe(map(res => res))
          .subscribe(res => {
            this.spinner.hide();
            this.setModalItemDatatoParent(res);
          });
      });
    } else if (formData.ministerReadingFile && formData.ministerReadingFile.uid != -1) {
      let data = this.generateReqDataForLOBUpdate2(formData, businessLineItem);
      this.handleMinisterReading(formData, data, 'update' );
      return;
    }else {
      this.spinner.show();
      let data = this.generateReqDataForLOBUpdate2(formData, businessLineItem);
      return this.http
        .put(`${environment.lob_api_url}/update`, data)
        .pipe(map(res => res))
        .subscribe(res => {
          this.spinner.hide();
          this.setModalItemDatatoParent(res);
        });
    }
  }
  generateReqDataForLOBUpdate1(formData, res, businessLineItem, documentFile, answerfile) {
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
      sequenceNumber: businessLineItem.sequenceNumber,
      lobBusinessAgendaResponse: this.setlobBusinessAgendaResponse(formData.subbusiness)
    };
    let data = {
      sessionId: businessLineItem.sessionId,
      assemblyId: businessLineItem.assemblyId,
      date: businessLineItem.date,
      type: "LOB",
      roleId: businessLineItem.roleId,
      businessLine: businessLine
    };
    return data;
  }
  generateReqDataForLOBUpdate2(formData, businessLineItem) {
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
      type: "LOB",
      roleId: businessLineItem.roleId,
      businessLine: businessLine
    };
    return data;
  }

  updatelobAgendaOrder(lob, addtoBusinessList, roleId) {
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
      type: "LOB",
      roleId: roleId,
      orderedLobAgendaLines: orderedLobAgendaLine
    };
    return this.http
      .post(`${environment.lob_api_url}/reorderLobAgendaBusinessLines`, data)
      .pipe(map(res => res));
  }

  saveBusinessType(data) {
    let sendData = {
      roleId: data.roleId,
      business: data
    }
    return this.http
      .post(`${environment.lob_businesses_mock_url}/saveRoleBusiness`, [sendData])
      .pipe(
        map(res => {
          return res;
        })
      );
  }
  deleteSubbusinessAnswer(respondentId, businessListId) {
    return this.http
      .delete(
        `${environment.lob_api_url}/deleteByRespondentMemberId?respondentId=${respondentId}&businessListId=${businessListId}`
      )
      .map(res => res);
  }
  deleteSubbusiness(subBusinessId, businessListId) {
    return this.http
      .delete(
        `${environment.lob_api_url}/deleteBySubBusinessId?subBusinessId=${subBusinessId}&businessListId=${businessListId}`
      )
      .map(res => res);
  }
  generateSpeakerNote(body) {
    const url = environment.lob_api_url + '/genarateSpeakerNote';
    return this.http.put(url, body);
  }
}
