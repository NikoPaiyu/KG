import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QnbookletService {
  rbsJson;
  constructor(private http: HttpClient) { }

  getPendingBooklets(userId) {
    const url = environment.question_api_url + `QPBalloting/booklet/pending?userId=${userId}`;
    return this.http.get<any>(url);
  }
  getAllBooklets(assemblyId, sessionId) {
    const url = environment.question_api_url + `QPBalloting/booklet/all?assemblyId=${assemblyId}&sessionId=${sessionId}`;
    return this.http.get<any>(url);
  }
  approveBooklet(bookletId, questionBooklet) {
    const url = environment.question_api_url + `QPBalloting/booklet/approve?bookletId=${bookletId}`;
    return this.http.put(url, questionBooklet);
  }
  forwardBooklet(bookletId, body) {
    const url = environment.question_api_url + `QPBalloting/booklet/forward?bookletId=${bookletId}`;
    return this.http.put(url, body);
  }
  getBookletById(bookletId, userId) {
    const url = environment.question_api_url + `QPBalloting/booklet/${bookletId}?userId=${userId}`;
    return this.http.get<any>(url);
  }
  // add note
  addBookletNote(body, bookletId) {
    const url = environment.question_api_url + `booklet/note/addNote?bookletId=${bookletId}`;
    return this.http.post(url, body);
  }
  // get note by id
  getBookletNoteById(bookletId) {
    const url = environment.question_api_url + `booklet/note/getAll/${bookletId}`;
    return this.http.get(url);
  }
  // delete note by id
  deleteNoteById(noteId) {
    const url = environment.question_api_url + `booklet/note/${noteId}`;
    return this.http.delete(url);
  }
   // get permission details
   getUserPermissions(userId) {
    if (userId) {
      const url = environment.user_mgmnt_api_url + `/rbs/getUserRoleDetails?userId=${userId}`;
      this.http.get(url).subscribe(Response => {
        this.rbsJson = Response as any;
      });
    }
  }
  // check for permission
  doIHaveAnAccess(pCategory, permission) {
    let permObj;
    if (this.rbsJson) {
      permObj = this.rbsJson.modules['QUESTION_PROCESSING'];
      if (permObj) {
        if (permObj.categorys) {
          const permCategorys = permObj.categorys;
          if (permCategorys[pCategory]) {
            const permCat = permCategorys[pCategory];
            return permCat.includes(permission);
          }
        }
      }
    }
    return false;
  }
}
