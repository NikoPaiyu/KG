import { Injectable } from "@angular/core";
import { environment } from "../../../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
@Injectable({
  providedIn: "root"
})
export class RunningnoteService {
  constructor(private http: HttpClient) {}
  getRunningNoteList(assemblyId, sessionId) {
    let params = {
      assemblyId: assemblyId,
      sessionId: sessionId
    };
    return this.http
      .get(`${environment.running_note_api_url}/getRunningNotes`, {
        params: params
      })
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  getRunningNotesByDate(assemblyId, sessionId, date) {
    let params = {
      assemblyId: assemblyId,
      sessionId: sessionId,
      date: date
    };
    return this.http
      .get(`${environment.running_note_api_url}/getRunnigLines`, {
        params: params
      })
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  saveRunningDate(runningNote, runningNoteLine) {
    let data = {
      assemblyId: runningNote.assemblyId,
      sessionId: runningNote.sessionId,
      date: runningNote.date,
      lobAgendaLineId: runningNoteLine.id,
      runningLine: {
        runningOrder: runningNote.runningNoteLines
          ? runningNote.runningNoteLines.length + 1
          : 1
      }
    };
    return this.http.post(`${environment.running_note_api_url}/save`, data);
  }

  deleteRunningNoteLine(itemId) {
    return this.http
      .delete(`${environment.running_note_api_url}/deleteRunningLine/${itemId}`)
      .map(res => res);
  }

  uploadFile(file) {
    const formData = new FormData();
    formData.append("file", file);
    return this.http
      .post(`${environment.fileupload_url}/uploadImage`, formData)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  uploadSpeakerNote(file) {
    const formData = new FormData();
    formData.append("file", file);
    return this.http
      .post(`${environment.fileupload_url}/uploadSpeakerNote`, formData)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  updateRunningLinesOrder(runningNote) {
    let orderedRunningLines = [];
    runningNote.runningNoteLines.forEach((element, index) => {
      let runningLine = {
        id: element.id,
        runningOrder: index + 1
      };
      orderedRunningLines.push(runningLine);
    });
    let data = {
      assemblyId: runningNote.assemblyId,
      sessionId: runningNote.sessionId,
      date: runningNote.date,
      orderedRunningLines: orderedRunningLines
    };
    return this.http
      .post(`${environment.running_note_api_url}/reorderRunningLines`, data)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  updateRunningNote(businessLineId, fileUrl, flipUrl) {
    let params = {
      businessLineId: businessLineId,
      noteUrl: fileUrl,
      flipUrl: flipUrl
    };
    return this.http
      .put(
        `${environment.lob_api_url}/editSpeakerNote?businessLineId=${businessLineId}&noteUrl=${fileUrl}&flipUrl=${flipUrl}`,
        {}
      )
      .pipe(
        map(res => {
          return res;
        })
      );
  }
}
