import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ApiConfig } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class DocsManagementService {
  environment: any;
  apiBaseURI: string;
  apiBaseURI_File: string;
  portfolioURI: string;
  apiRegURI: string;
  officeSection_apiBaseURI:string;
  electionApiURI: string;

  constructor(@Inject("environment") environment, private http: HttpClient) {
    this.environment = environment;
    this.apiBaseURI = this.environment.cpl_api_url + ApiConfig.basePathExt;
    this.portfolioURI =
      this.environment.portfolio_mock_api_url + ApiConfig.portfolio;
    this.apiRegURI = this.environment.cpl_api_url + ApiConfig.basePathReg;
    this.apiBaseURI_File =
      this.environment.cpl_api_url + ApiConfig.basePathFile;
    this.officeSection_apiBaseURI =
      this.environment.office_api_url + ApiConfig.basePathOfficeSection;
    this.electionApiURI = this.environment.table_api_url + ApiConfig.basePathElection;
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
  
  getMinisterDepartments(portfolioId) {
    // return this.http.get(this.portfolioURI + `/getSubjects/${portfolioId}`);
    return this.http.get(this.environment.portfolio_mock_api_url + `mock/subject/getDepartmentsByPortfolioId?portfolioId=${portfolioId}`);
  }

  getAllSubjectsByDepartmentId(deptId) {
    return this.http.get(this.environment.portfolio_mock_api_url + `mock/subject/getAllSubjectByDepartmentId?departmentId=${deptId}`);
  }

  ////////////////////////////// CPL APIS/////////////////////////////
  uploadUrl() {
    return (this.environment.cpl_api_url + ApiConfig.uploadFile);
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
  getDocumentDetailsById(id) {
    return this.http.get(
      this.apiBaseURI +
        ApiConfig.documents.officeSectionGetDocumentById +
        `?id=${id}`
    );
  }
  
  docUpload(body) {
    return this.http.post(
      this.apiBaseURI + ApiConfig.documents.officeSection,
      body
    );
  }
  officeSectionSubmit(id) {
    return this.http.put(
      this.apiBaseURI + ApiConfig.documents.officeSectionSubmit,
      id
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
  
  updateOfficeSectionDocument(body) {
    return this.http.put(this.apiBaseURI + ApiConfig.documents.editOSDoc, body);
  }
  listUploadedDocs(body) {
    return this.http.post(
      this.apiBaseURI + ApiConfig.documents.officeSectionList,
      body
    );
  }
  assignOfficeTask(body) {
    return this.http.post(
      this.apiBaseURI + ApiConfig.documents.officeSectionAssign,
      body
    );
  }
  getOfficeSectionPendingDocuments(body) {
    return this.http.post(
      this.apiBaseURI + ApiConfig.documents.officeSectionPending,
      body
    );
  }
  deleteOfficeSectionDocument(id) {
    return this.http.delete(
      this.apiBaseURI + ApiConfig.documents.deleteOSDoc + `?id=${id}`
    );
  }
  
  returnDocument(body) {
    return this.http.post(
      this.apiBaseURI + ApiConfig.documents.officeSectionReturn,
      body
    );
  }





  ////////////////////////////// CPL APIS/////////////////////////////


  ///////////////////////// Office section API///////////////////////////////
  getOfficeDocTypes(){
    return this.http.get(
      this.officeSection_apiBaseURI + `/documents/attachmentType/getAll`
    );
  }
  docUploadExceptCpl(body){
    return this.http.post(
      this.officeSection_apiBaseURI +`/documents`,
      body
    );
  }
  submitDocumentExceptCpl(docId){
    return this.http.get(
      this.officeSection_apiBaseURI +`/documents/submit/${docId}`,
    );
  }
  getAllDocsListExceptCpl(status){
    return this.http.get(
      this.officeSection_apiBaseURI +`/documents/getByStatus?status=${status}`,
    );
  }
  getAllDocsListBysection(id){
    return this.http.get(
      this.officeSection_apiBaseURI +`/documents/getBySection/${id}`,
    );
  }
  getAllPendingDocsListBysection(body){
    return this.http.post(
      this.officeSection_apiBaseURI +`/documents/getPendingDocuments`,body
    );
  }
  getDocByIdexceptCPL(id){
    return this.http.get(
      this.officeSection_apiBaseURI +`/documents/${id}`
    );
  }
  updateDocExceptCpl(body){
    return this.http.put(
      this.officeSection_apiBaseURI +`/documents/update`,
      body
    );
  }
  deleteDoc(id){
    return this.http.put(
      this.officeSection_apiBaseURI +`/documents/delete/${id}`,id
    );
  }
  returnDocToOfficeSection(body){
    return this.http.post(
      this.officeSection_apiBaseURI +`/documents/return`,
      body
    );
  }
  assignDocsToAssistant(body){
    return this.http.post(
      this.officeSection_apiBaseURI +`/documents/assignToAssistant`,
      body
    );
  }
  getdocTypeList() {
    return this.http.get(
      this.officeSection_apiBaseURI +`/documentType/getAll`
    );
  }
    ///////////////////////// Office section API///////////////////////////////

  // register election document
  createElectionDocument(body) {
    return this.http.post(
      this.electionApiURI +  ApiConfig.tables.createDocument,
      body
    );
  }

}
