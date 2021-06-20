import { Injectable, Inject } from "@angular/core";
import { ApiConfig } from "../config/api.config";
import { HttpClient } from "@angular/common/http";
@Injectable({
  providedIn: "root",
})
export class CurrespondenceService {
  environment: any;
  apiBaseURI_Currespondence: string;
  apiBaseURI_Reg: string;
  constructor(@Inject("environment") environment, private http: HttpClient) {
    this.environment = environment;
    this.apiBaseURI_Currespondence =
      this.environment.cpl_api_url + ApiConfig.basePathCurrespondence;
    this.apiBaseURI_Reg = this.environment.cpl_api_url + ApiConfig.basePathReg;
  }
  getTypeByDepartment() {
    return this.http.get(
      this.environment.portfolio_mock_api_url + "/mock/subject/getAllSubjects"
    );
  }
  getTypeBySection() {
    return this.http.get(
      this.apiBaseURI_Reg + ApiConfig.currespondenceTemplate.getTypeBySection
    );
  }
  getallWorkflow(type) {
    return this.http.get(
      this.apiBaseURI_Currespondence +
        ApiConfig.currespondenceTemplate.getAllWorkFlow +
        `?type=${type}`
    );
  }
  getTemplateInputTypes() {
    return this.http.get(
      this.apiBaseURI_Currespondence +
        ApiConfig.currespondenceTemplate.getAllInputType
    );
  }
  saveTemplateWithInputs(body) {
    return this.http.post(
      this.apiBaseURI_Currespondence +
        ApiConfig.currespondenceTemplate.saveTemplateWithInputs,
      body
    );
  }
  getAllBusiness() {
    return this.http.get(
      this.apiBaseURI_Currespondence +
        ApiConfig.currespondenceTemplate.getAllBusiness
    );
  }
  getTemplateById(templateId) {
    return this.http.get(
      this.apiBaseURI_Currespondence +
        ApiConfig.currespondenceTemplate.getTemplateById +
        `?templateId=${templateId}`
    );
  }
  deleteTemplateInput(body) {
    return this.http.request(
      "delete",
      this.apiBaseURI_Currespondence +
        ApiConfig.currespondenceTemplate.deleteTemplateInput,
      { body: body }
    );
  }
  getAllTemplate() {
    return this.http.get(
      this.apiBaseURI_Currespondence +
        ApiConfig.currespondenceTemplate.getAllTemplate
    );
  }

  getAllTemplateByType(body) {
    return this.http.post(
      this.apiBaseURI_Currespondence +
        ApiConfig.currespondenceTemplate.getAllTemplate,
      body
    );
  }

  getPending(id) {
    return this.http.get(
      this.apiBaseURI_Currespondence +
        ApiConfig.currespondenceTemplate.getPending +
        `?userId=${id}`
    );
  }

  getSent(code) {
    return this.http.post(
      this.apiBaseURI_Currespondence +
        ApiConfig.currespondenceTemplate.sent +
        `?code=${code}`,
      null
    );
  }

  getInbox(code) {
    return this.http.post(
      this.apiBaseURI_Currespondence +
        ApiConfig.currespondenceTemplate.inbox +
        `?code=${code}`,
      null
    );
  }

  getOutbox(code) {
    return this.http.post(
      this.apiBaseURI_Currespondence +
        ApiConfig.currespondenceTemplate.outbox +
        `?code=${code}`,
      null
    );
  }

  addNote(id, body) {
    return this.http.post(
      this.apiBaseURI_Currespondence +
        `/${id}` +
        ApiConfig.currespondenceTemplate.addNote,
      body
    );
  }

  updateNote(id, body) {
    return this.http.put(
      this.apiBaseURI_Currespondence +
        `/${id}` +
        ApiConfig.currespondenceTemplate.addNote,
      body
    );
  }

  deleteNote(noteId, correspondenceId) {
    return this.http.delete(
      this.apiBaseURI_Currespondence +
        `/${correspondenceId}` +
        ApiConfig.currespondenceTemplate.deleteNote +
        `?noteId=${noteId}`
    );
  }

  getNotes(id) {
    return this.http.get(
      this.apiBaseURI_Currespondence +
        `/${id}` +
        ApiConfig.currespondenceTemplate.addNote
    );
  }

  getCorrespondenceById(id, code) {
    return this.http.get(
      this.apiBaseURI_Currespondence + `/${id}?code=${code}`
    );
  }

  saveCorrespondence(body) {
    return this.http.post(this.apiBaseURI_Currespondence, body);
  }
  sendCorrespondence(id) {
    let body = {};
    return this.http.post(this.apiBaseURI_Currespondence + `/${id}/send`, body);
  }
  getTemplateFormById(id) {
    return this.http.get(
      this.apiBaseURI_Currespondence +
        `/template/getTemplateForm?templateId=${id}`
    );
  }

  approveCorrespondence(id, body) {
    return this.http.put(
      this.apiBaseURI_Currespondence + `/${id}/approve`,
      body
    );
  }

  forwardCorrespondence(id, body) {
    return this.http.put(
      this.apiBaseURI_Currespondence + `/${id}/forward`,
      body
    );
  }

  getWorkflowUsers(id) {
    return this.http.get(
      this.apiBaseURI_Currespondence + `/${id}/getWorkflowActionUsers`
    );
  }

  getCorrespondenceFile(fileId) {
    return this.http.get(
      this.apiBaseURI_Currespondence + `/file/get?fileId=${fileId}`
    );
  }
  currespondenceDetailView(currespondenceId, code) {
    return this.http.get(
      this.apiBaseURI_Currespondence +
        `/${currespondenceId}/detail?code=${code}`
    );
  }
  getAllCode(type) {
    return this.http.get(
      this.apiBaseURI_Currespondence +
        ApiConfig.currespondenceTemplate.getAllCode +
        `?type=${type}`
    );
  }
  getAllToData() {
    return this.http.get(this.apiBaseURI_Currespondence + `/getAllCode?type=`);
  }
  deleteTemplate(templateId) {
    return this.http.delete(
      this.apiBaseURI_Currespondence +
        ApiConfig.currespondenceTemplate.deleteTemplate +
        `?templateId=${templateId}`
    );
  }
  deleteTo(id, toListId) {
    return this.http.get(this.apiBaseURI_Currespondence + `/deleteFromToList?id=${id}&toListId=${toListId}`);
  }
}
