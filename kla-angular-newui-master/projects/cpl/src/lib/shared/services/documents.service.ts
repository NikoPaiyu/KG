import { Injectable, Inject } from "@angular/core";
import { ApiConfig } from "../config/api.config";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Response } from "../config/list";
@Injectable({
  providedIn: "root",
})
export class DocumentsService {
  environment: any;
  apiBaseURI: string;
  apiBaseURI_File: string;
  portfolioURI: string;
  apiRegURI: string;
  constructor(@Inject("environment") environment, private http: HttpClient) {
    this.environment = environment;
    this.apiBaseURI = this.environment.cpl_api_url + ApiConfig.basePathExt;
    this.portfolioURI =
      this.environment.portfolio_mock_api_url + ApiConfig.portfolio;
    this.apiRegURI = this.environment.cpl_api_url + ApiConfig.basePathReg;
    this.apiBaseURI_File =
      this.environment.cpl_api_url + ApiConfig.basePathFile;
  }

  getAllAssembly() {
    return this.http.get<any>(
      `${this.environment.calendar_api_url}/mock/getAllAssembly`
    );
  }

  getAllSession() {
    return this.http.get<any>(
      `${this.environment.calendar_api_url}/mock/getAllSession`
    );
  }

  getAllPortfolios() {
    return this.http.get(this.portfolioURI + "/getAllWithMinisterName");
  }
  getAllSubjects() {
    // return this.http.get(this.portfolioURI + "/getAllWithMinisterName");
    return this.http
        .get(this.environment.portfolio_mock_api_url + `mock/subject/getAllDepartments`)
        .pipe(
          map((res) => {
            return res;
          })
        );
  }
  // getAllPortfolios() {
  //   return this.http
  //     .get(`http://45.249.111.251:7777/mock/portfolio/getAll`)
  //     .pipe(
  //       map((res) => {
  //         return res;
  //       })
  //     );
  // }

  getMinisterDepartments(portfolioId) {
    // return this.http.get(this.portfolioURI + `/getSubjects/${portfolioId}`);
    return this.http.get(this.environment.portfolio_mock_api_url + `mock/subject/getDepartmentsByPortfolioId?portfolioId=${portfolioId}`);
  }

  getAllSubjectsByDepartmentId(deptId) {
    return this.http.get(this.environment.portfolio_mock_api_url + `mock/subject/getAllSubjectByDepartmentId?departmentId=${deptId}`);
  }

  registerDocument(body) {
    return this.http.post(this.apiBaseURI + ApiConfig.documents.create, body);
  }

  getDocumentList(assembly, session, status) {
    return this.http.get(
      this.apiBaseURI +
        ApiConfig.documents.list +
        `?assemblyId=${assembly}&sessionId=${session}&status=${status}`
    );
  }

  uploadUrl() {
    return (this.environment.cpl_api_url + ApiConfig.uploadFile);
  }
  getDocumentbyID(Id, userId) {
    return this.http.get(
      this.apiBaseURI + ApiConfig.documents.view + `?id=${Id}&userId=${userId}`
    );
  }

  deleteDocumentById(id) {
    return this.http.delete(this.apiBaseURI + "/deleteById" + `?id=` + id);
  }

  getCurrentDocumentId(ids) {
    return this.http.post(this.apiBaseURI + "/listCurrentNumbers", ids);
  }

  registerAndAttachDoc(body) {
    return this.http.post(
      this.apiBaseURI + ApiConfig.documents.registerAttach,
      body
    );
  }
  getDashboard(assemblyId, sessionId) {
    return this.http.get(
      this.apiBaseURI +
        ApiConfig.documents.dashboard +
        `?assemblyId=&sessionId=`
    );
  }
  getDashboardSupersorFileDetials(userId) {
    const body = {
      userId: userId,
    };
    return this.http.post(
      this.apiBaseURI_File + ApiConfig.files.supervisor,
      body
    );
  }
  getAllDocuments(assembly, session, listType) {
    // return this.http.get(
    //   this.apiBaseURI +
    //   ApiConfig.documents.documentList +
    //   `?assemblyId=${assemblyId}&sessionId=${sessionId}`
    // );
    const body = {
      assemblyId: assembly,
      sessionId: session,
      type: listType,
    };
    return this.http.put(
      this.apiBaseURI + ApiConfig.documents.documentList,
      body
    );
  }

  getRefreshDocuments(assembly, session, listType) {
    const body = {
      assemblyId: assembly,
      sessionId: session,
      type: listType,
    };
    return this.http.put(
      this.apiBaseURI + ApiConfig.documents.refreshList,
      body
    );
  }
  saveDocumentsList(body) {
    return this.http.post(
      this.apiBaseURI + ApiConfig.documents.saveDocumentList,
      body
    );
  }
  getLayingDateList(assemblyId, sessionId) {
    return this.http.get(
      this.apiBaseURI +
        ApiConfig.documents.layingList +
        `?assemblyId=${assemblyId}&sessionId=${sessionId}`
    );
  }

  removeDocument(body) {
    return this.http.put(
      this.apiBaseURI + ApiConfig.documents.removeFromList + `?id=${body.id}`,
      body
    );
  }
  updateDocument(body) {
    return this.http.put(this.apiBaseURI + ApiConfig.documents.update, body);
  }

  getDocumentByListId(listId) {
    return this.http.get(
      this.apiBaseURI + ApiConfig.documents.getByListId + `?listId=${listId}`
    );
  }

  deleteAttachment(aId, docId) {
    return this.http.delete(
      this.apiBaseURI +
        ApiConfig.documents.deleteAttachment +
        `?attachmentId=${aId}&documentId=${docId}`
    );
  }
  templist() {
    return Response;
  }

  saveDeptDoc(body) {
    return this.http.post(
      this.apiBaseURI + ApiConfig.documents.deptDocSave,
      body
    );
  }

  submitDeptDoc(body) {
    return this.http.put(
      this.apiBaseURI + ApiConfig.documents.deptSubmit,
      body
    );
  }

  getDeptDocs(body) {
    return this.http.post(this.apiBaseURI + ApiConfig.documents.deptDocs, body);
  }

  assignTask(body) {
    return this.http.put(this.apiBaseURI + ApiConfig.documents.assign, body);
  }
  getAllAmendments() {
    return this.http.get(
      this.apiBaseURI + ApiConfig.documents.getAllAmentments
    );
  }
  updateAmendmentsStatus(body) {
    return this.http.put(
      this.apiBaseURI + ApiConfig.documents.updateAmentmentStatus,
      body
    );
  }

  docUpload(body) {
    return this.http.post(
      this.apiBaseURI + ApiConfig.documents.officeSection,
      body
    );
  }
  deleteAllAttachmentById(documentId, body) {
    return this.http.request(
      "DELETE",
      this.apiBaseURI +
        ApiConfig.documents.deleteAllAttachmentById +
        `?documentId=${documentId}`,
      { body: body }
    );
  }
  listUploadedDocs(body) {
    return this.http.post(
      this.apiBaseURI + ApiConfig.documents.officeSectionList,
      body
    );
  }
  getDocumentDetailsById(id) {
    return this.http.get(
      this.apiBaseURI +
        ApiConfig.documents.officeSectionGetDocumentById +
        `?id=${id}`
    );
  }
  assignOfficeTask(body) {
    return this.http.post(
      this.apiBaseURI + ApiConfig.documents.officeSectionAssign,
      body
    );
  }

  markAsLaid(docId) {
    return this.http.put(
      this.apiBaseURI + ApiConfig.documents.updateLaidDocument + `?id=${docId}`,
      {}
    );
  }
  getDeptUser(userId) {
    return this.http
      .get(this.environment.user_mgmnt_api_url + `/v1/users/get/id/${userId}`)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  officeSectionSubmit(id) {
    return this.http.put(
      this.apiBaseURI + ApiConfig.documents.officeSectionSubmit,
      id
    );
  }

  getOfficeSectionPendingDocuments(body) {
    return this.http.post(
      this.apiBaseURI + ApiConfig.documents.officeSectionPending,
      body
    );
  }

  getPendingForActionDocs(body) {
    return this.http.post(
      this.apiBaseURI + ApiConfig.documents.pendingForAction,
      body
    );
  }

  deleteOfficeSectionDocument(id) {
    return this.http.delete(
      this.apiBaseURI + ApiConfig.documents.deleteOSDoc + `?id=${id}`
    );
  }

  updateOfficeSectionDocument(body) {
    return this.http.put(this.apiBaseURI + ApiConfig.documents.editOSDoc, body);
  }

  createAmendementList(body) {
    return this.http.post(
      this.apiBaseURI + ApiConfig.documents.createAmendementList,
      body
    );
  }

  saveInstitution(body) {
    return this.http.post(
      this.apiRegURI + ApiConfig.documents.institution,
      body
    );
  }

  getInstitution() {
    return this.http.get(this.apiRegURI + ApiConfig.documents.institution);
  }

  saveActName(body) {
    return this.http.post(this.apiRegURI + ApiConfig.documents.actName, body);
  }

  getActName() {
    return this.http.get(this.apiRegURI + ApiConfig.documents.actName);
  }

  getDates(assembly, session) {
    return this.http.get(
      `${this.environment.calendar_api_url}/get/itemForQuestions?assemblyId=${assembly}&sessionId=${session}`
    );
  }

  getPendingAmendments(body) {
    return this.http.post(
      this.apiBaseURI + ApiConfig.documents.pendingAmendments, body
    );
  }

  getAmendmentById(id) {
    return this.http.get(
      this.apiBaseURI + ApiConfig.documents.getAmendById + `?id=${id}`
    );
  }

  // getAmendmentWorkflowActionUsers(id) {
  //   return this.http.get(
  //     this.apiBaseURI + ApiConfig.documents.workflowUser + `?id=${id}`
  //   );
  // }

  // forwardAmendment(body, id) {
  //   return this.http.put(
  //     this.apiBaseURI + ApiConfig.documents.forwardAmendment + `?id=${id}`,
  //     body
  //   );
  // }

  editAmendment(body) {
    return this.http.put(
      this.apiBaseURI + ApiConfig.documents.getAmendById,
      body
    );
  }

  getDateDetails(body) {
    return this.http.post(
      `${this.environment.calendar_api_url}/getDatesDetails`,
      body
    );
  }

  // addAmendmentNote(body) {
  //   return this.http.post(
  //     this.apiBaseURI + ApiConfig.documents.amendNote,
  //     body
  //   );
  // }

  // getAmendmentNote(id) {
  //   return this.http.get(
  //     this.apiBaseURI + ApiConfig.documents.amendNote + `?amendmentId=${id}`
  //   );
  // }

  // updateAmendmentNote(body) {
  //   return this.http.put(this.apiBaseURI + ApiConfig.documents.amendNote, body);
  // }

  // deleteAmendmentNote(id) {
  //   return this.http.delete(
  //     this.apiBaseURI + ApiConfig.documents.amendNote + `/byId?noteId=${id}`
  //   );
  // }

  getApprovedAmendments() {
    return this.http.get(
      this.apiBaseURI + ApiConfig.documents.approvedAmendments
    );
  }
  // getKlaDepartments() {
  //   return this.http
  //     .get(`${this.environment.departmentmangement_api_url}/getsection`)
  // }
  // getKlaDepartments() {
  //   return this.http
  //     .get(`${this.environment.departmentmangement_api_url}/getsection`)
  //     .map((res: any) => {
  //          return res;
  //     });
  // }

  departmentWithdraw(docId, reason) {
    const body = {
      id: docId,
      withDrawalReason: reason,
    };
    return this.http.post(
      this.apiBaseURI + ApiConfig.documents.departmentWithdraw,
      body
    );
  }

  getPendingWithdrawList(body) {
    return this.http.post(
      this.apiBaseURI + ApiConfig.documents.withdrawList,
      body
    );
  }

  departmentDashboard(body) {
    return this.http.post(
      this.apiBaseURI + ApiConfig.documents.deptDashboard, body
    );
  }

  returnDocument(body) {
    return this.http.post(
      this.apiBaseURI + ApiConfig.documents.officeSectionReturn,
      body
    );
  }

  getCorrectionStatement(body) {
    return this.http.post(
      this.apiBaseURI + ApiConfig.documents.correctionStatement,
      body
    );
  }

  correctionRequest(body) {
    return this.http.post(
      this.apiBaseURI + ApiConfig.documents.requestcorrectionStatement,
      body
    );
  }
  getAmendmentList() {
    return this.http.get( this.apiBaseURI +ApiConfig.documents.getAmendById + `/getAmendmentCount?status=`);
  }
  getPendingFilter(body) {
    return this.http.post( this.apiBaseURI +ApiConfig.documents.getAmendById + `/getPending`, body);
  }

  getAmendmentListById(id) {
    return this.http.get( this.apiBaseURI + ApiConfig.documents.getAmendmentListById + `?id=${id}`);
  }

  getAllAssemblyAndSession() {
    return this.http.get<any>(
      `${this.environment.calendar_api_url}/getAllAssemblyAndSession`
    );
  }
}
