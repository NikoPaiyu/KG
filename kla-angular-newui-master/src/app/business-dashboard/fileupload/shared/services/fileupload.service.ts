import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { docUploadModel } from "src/app/shared/models/docUploadModel";
import { Entity } from 'src/app/shared/models/entity';
import { formatDate } from '@angular/common';
import { AssemblyList, SessionList } from 'src/app/business-dashboard/calender-of-sitting/shared/models/cobmodel';
@Injectable({
  providedIn: "root"
})
export class FileuploadService {
  constructor(private http: HttpClient) { }

  uploadFile(body, FileName, DocType, date) {
    return this.http
      .post(
        `${environment.fileupload_url}/uploadFile/${FileName}/${DocType}/${date}`,
        body
      )
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  uploadDocFile(body, DocType, date) {
    let data = new FormData();
    data.append("file", body[0]);
    data.append("docType", DocType);
    data.append("date", date);

    return this.http.post(`${environment.fileupload_url}/saveFile`, data).pipe(
      map(res => {
        return res;
      })
    );
  }

  uploadDocFiles(body, DocType, date, fname, assembly, session) {
    let url = "saveFileList";
    let data = new FormData();
    if (body.length > 1) {
      for (let i = 0; i < body.length; i++) {
        data.append("files", body[i]);
      }
    } else {
      url = "saveFile";
      data.append("file", body[0]);
    }

    data.append("docType", DocType);
    data.append("date", date);
    data.append("folderName", fname)
    data.append("assemblyId", assembly);
    data.append("sessionId", session);

    return this.http.post(`${environment.fileupload_url}/${url}`, data).pipe(
      map(res => {
        return res;
      })
    );
  }

  getUploadedRulesDetails(DocType) {
    return this.http
      .get(`${environment.fileupload_url}/getAll/${DocType}`)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  getUploadDetails(DocType, assembly, session) {
    return this.http
      .get(`${environment.fileupload_url}/getAll/${DocType}/${assembly}/${session}`)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  getDocUploadDetails(folderId) {
    let params = {
      folderId: folderId
    };
    return this.http
      .get(`${environment.fileupload_url}/getFilesByFolderId`, {
        params: params
      })
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  getDates(DocType, assembly, session) {
    return this.http
      .get(`${environment.fileupload_url}/getAll/${DocType}/${assembly}/${session}`)
      .map((res: any) => {
        let comboDatas: docUploadModel[] = [];

        res.forEach(chosenDates => {
          comboDatas.push({
            value: chosenDates.label.split("-").reverse().join("-"),
            label: chosenDates.createdAt.split("-").reverse().join("-"),
            id: chosenDates.id,
          });
        });

        return comboDatas;
      });
  }

  getDatesBudget(DocType, assembly, session) {
    return this.http
      .get(`${environment.fileupload_url}/getAll/${DocType}/${assembly}/${session}`)
      .map(res => {
        return res;
      })
  }

  getAllprevdocs(Sub, assembly, session){
    return this.http
      .get(`${environment.fileupload_url}/getAllPrevious/${Sub}/${assembly}/${session}`)
      .map(res => {
        return res;
      })
 

  }

  getDistinctDates(DocType, assembly, session) {
    let data2 = new FormData();
    data2.append("docType", DocType);
    data2.append("assemblyId", assembly);
    data2.append("sessionId", session);
    return this.http
      .post(`${environment.fileupload_url}/getAllDates/`, data2)
      .map((res: any) => {
        let comboDatas: docUploadModel[] = [];

        res.forEach(chosenDates => {
          comboDatas.push({
            value: formatDate(chosenDates, "dd-MM-yyyy", "en-US", "+0530"),
            label: formatDate(chosenDates, "dd-MM-yyyy", "en-US", "+0530"),
            id: formatDate(chosenDates, "dd-MM-yyyy", "en-US", "+0530"),

          });
        });

        return comboDatas;
      });
  }


  getFolderListOnDate(DocType, date, assemblyId, sessionId) {
    let data1 = new FormData();
    data1.append("docType", DocType);
    data1.append("date", date.split("-").reverse().join("-"));
    data1.append("assemblyId", assemblyId);
    data1.append("sessionId", sessionId);
    return this.http
      .post(`${environment.fileupload_url}/getFolderListOnDate`, data1)
      .map((res: any) => {
        let comboDatas: docUploadModel[] = [];

        res.forEach(chosenFolderNames => {
          comboDatas.push({
            label: chosenFolderNames.label,
            value: formatDate(chosenFolderNames.createdAt, "dd-MM-yyyy", "en-US", "+0530"),
            id: chosenFolderNames.id,

          });
        });

        return comboDatas;
      });
  }


  deleteFileUplaod(id) {
    return this.http.delete(`${environment.fileupload_url}/delete/${id}`).pipe(
      map(res => {
        return res;
      })
    );
  }

  deleteDocFileUpload(id) {
    return this.http
      .delete(`${environment.fileupload_url}/deleteFile/${id}`)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  getCurrentDateAndId(DocType) {
    return this.http
      .get(`${environment.fileupload_url}/getCurrentFolder?docType=${DocType}`)
      .pipe(
        map(res => {
          return res;
        })
      );
  }
getAllcoverdetails(DocType){
  return this.http
      .get(`${environment.fileupload_url}/getAllPrevious?Sub=${DocType}`)
      .pipe(
        map(res => {
          return res;
        })
      );
}
  getAllAssembly() {
    return this.http
      .get<AssemblyList>(`${environment.calendar_api_url}/mock/getAllAssembly`)
      .pipe(
        map(res => {
          return res;
        })
      );
  }
  getAllSession() {
    return this.http
      .get<SessionList>(`${environment.calendar_api_url}/mock/getAllSession`)
      .pipe(
        map(res => {
          return res;
        })
      );
  }
}
