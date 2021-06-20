import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConfig } from '../config/api.config';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FileServiceService {
environment:any;
apiBaseURI:string;
apiBaseURI3:string;
apiBaseURI2:string;
fileStatus = null;
// fileIP;
  constructor(@Inject("environment") environment, private http: HttpClient) { 
    this.environment = environment;
    this.apiBaseURI = this.environment.bill_api_url + ApiConfig.basePathExt;
    this.apiBaseURI2 = this.environment.cpl_api_url + ApiConfig.basePathFile;
    // this.fileIP= 'http://45.249.111.246';
    this.apiBaseURI3 = this.environment.file_api + ApiConfig.basePathFile;
  }
  // addNote(body) {
  //   return this.http.post(
  //    '',
  //     body
  //   );
  // }
  // getNotes(fileId) {
  //   return this.http.get('' );
  // }
  // updateNote(body) {
  //   return this.http.put('',
  //     body
  //   );
  // }
  // deleteNote(body) {
  //   return this.http.request(
  //     "DELETE",
  //     '',
  //     { body }
  //   );
  // }
  getFileById(fileId, userId) {
    const url = this.apiBaseURI + `/file/getByFileId?fileId=${fileId}&userId=${userId}`;
    return this.http.get(url);
  }
  createNote(body) {
    const url = this.environment.file_api + `:8078/kla/service/v1/files/${body.fileId}/notes`;
    return this.http.post(url, body);
  }
  createPullNote(fileId, body) {
    const url = this.environment.file_flow_api + `${fileId}/notes`;
    return this.http.post(url, body);
  }
  // update notes
  updateNote(body) {
    const url = this.environment.file_api + `:8078/kla/service/v1/files/${body.fileId}/notes`;
    return this.http.put(url, body);
  }
  // get notes
  getAllNotes(fileId) {
    const url = this.environment.file_api + `:8078/kla/service/v1/files/${fileId}/notes`;
    return this.http.get(url);
  }

    deleteNoteById(reqBody) {
    
      return this.http.request('DELETE', this.environment.file_api +
      `:8078/kla/service/v1/files/${reqBody.fileId}/notes/byId`, { body: reqBody });
    }
    checkWorkFlowStatus(workFlowId) {
      // const IP= "http://45.249.111.246";
      const url =
      this.environment.file_api + `:9000/kla/workflow/service/v1/task/tracking?processInstanceId=${workFlowId}`;
      return this.http.get<any>(url);
    }
    getPendingFiles(userId, assembly, session, type) {
      if (assembly === null && session === null) {
        return this.http.get(this.apiBaseURI3 +
          `/pending/type?userId=${userId}&assemblyId=&sessionId=&type=${type}`);
      } else {
        return this.http.get(this.apiBaseURI3 +
          `/pending/type?userId=${userId}&assemblyId=${assembly}&sessionId=${session}&type=${type}`);
      }
    }
    getWorkflowActionUsers(workFlowId, fileId) {
      // const IP= "http://45.249.111.246";
      return this.http.get(
        this.environment.file_api + `:8078/kla/service/v1/files/getWorkflowActionUsers?workflowId=${workFlowId}&fileId=${fileId}`
      );
    }
    forwardFile(body, fileId) {
      //return this.http.put(this.apiBaseURI + `/${fileId}/forward`, body);
      return this.http.put(this.apiBaseURI3 + `/${fileId}/forward`, body).pipe(
        map((res) => {
          return res;
        })
      );
    }
    approveFile(body= {}) {
      const url = this.apiBaseURI + `/file/approve`;
      return this.http.put(url, body);
    }
    getAllFiles(body) {
      return this.http.post(this.apiBaseURI3 + `/getAll`, body);
    }
    approvedByHigherOfficial(userId) {
      return this.http.get(this.apiBaseURI3 + `/all/ownerId?userId=${userId}` );
    }
    updateFile(fileId, body) {
      return this.http.put(this.apiBaseURI2 + `/${fileId}`, body);
    }
    pullFile(body, fileId) {
      // return this.http.put(this.environment.file_flow_api + `${fileId}/pull`, body);
      return this.http.put(this.environment.file_api + `:8078/kla/service/v1/files/${fileId}/pull`, body);
    }
    getAllFileLogs(fileId) {
      // const url = this.environment.file_flow_api + `${fileId}/logs`;
      const url = this.environment.file_api + `:8078/kla/service/v1/files/${fileId}/logs`;
      return this.http.get(url);
    }
    getPendingRatification(body) {
      // return this.http.post( this.environment.file_flow_api + `get/ratification/pending`, body);
      return this.http.post( this.environment.file_api + `:8078/kla/service/v1/files/get/ratification/pending`, body);
    }
    fileClosure(id, userId) {
      return this.http.get(this.environment.file_api +  `:8078/kla/service/v1/files/fileClosure?fileId=${id}&userId=${userId}`);
    }
    approveClosure(body, id) {
      return this.http.put( this.environment.file_api + `:8078/kla/service/v1/files/fileClosure/${id}/closure`, body);
    }
  }
