import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { forwardProceedingDiaryDto, IDiaryResponse, IWorkFlowUsers, reportDiaryResponse, IPermissionProceedings, saveDiaryDto } from '../models/proceedingReporter.model'
import { ApiConfig } from '../../../shared/config/api.config'
import { TablescommonService } from '../../../shared/services/tablescommon.service';
@Injectable({
  providedIn: 'root'
})
export class ProceedingReportService {
  apiReporterBaseURI: string;
  apiProceedingBaseURL: string;
  environment: any;

  constructor(@Inject("environment") environment,
    private http: HttpClient, private common: TablescommonService,) {
    this.environment = environment;
    this.apiReporterBaseURI = this.environment.lob_ProceedingReporter_api_uri + ApiConfig.basePathReporter;
    this.apiProceedingBaseURL = this.environment.lob_ProceedingReporter_api_uri;
  }



  //http request
  createReporterDiary(body) {
    const url = this.apiReporterBaseURI + ApiConfig.ReporterDiary.create;
    return this.http.post<any>(url, body);
  }
  getReporterDiaryList(assemblyId, sessionId) {
    const url = this.apiReporterBaseURI + `${ApiConfig.ReporterDiary.list}?assemblyId=${assemblyId}&sessionId=${sessionId}`;
    return this.http.get<any>(url);
  }
  getReporterDiaryById(id) {
    const url = this.apiReporterBaseURI + `/${id}`;
    return this.http.get<IDiaryResponse>(url);
  }
  saveDiaryLines(body: saveDiaryDto) {
    const url = this.apiReporterBaseURI + ApiConfig.ReporterDiary.saveReporterDiary;
    return this.http.post<saveDiaryDto>(url, body);
  }
  submitDiaryReport(id) {
    const url = this.apiReporterBaseURI + ApiConfig.ReporterDiary.submitReorterDiary + `/${id}`;
    return this.http.put(url, {});
  }

  createProceedingDiary(body) {
    const url = this.apiProceedingBaseURL + ApiConfig.proccedingReporter.create;
    return this.http.post<any>(url, body);
  }

  getProceedingDiaryById(id) {
    const url = this.apiProceedingBaseURL + `/${id}`;
    return this.http.get<IDiaryResponse>(url);
  }

  getSubmittedProceedingReporterListByLobId(lobId) {
    const url = this.apiReporterBaseURI + ApiConfig.ReporterDiary.submittedReporterListByLobId + `=${lobId}`;
    return this.http.get<any>(url);
  }

  forwardProceedingDiaryReports(body: forwardProceedingDiaryDto) {
    const url = this.apiProceedingBaseURL + ApiConfig.proccedingReporter.forwardReporterDiary + `/${body.proceedigDiaryMasterId}`;
    return this.http.put(url, body);
  }

  approveProceedingDiary(id) {
    const url = this.apiProceedingBaseURL + ApiConfig.proccedingReporter.approveProceedingDiary + `/${id}`;
    return this.http.put(url, {});
  }
  getForActionProceesingReportList() {
    const url = this.apiProceedingBaseURL + ApiConfig.proccedingReporter.getForActionReports;
    return this.http.get(url);
  }
  getApprovedProceedginDiaryList(assemblyId, sessionId) {
    const url = this.apiProceedingBaseURL + ApiConfig.proccedingReporter.getApprovedReports + `?assemblyId=${assemblyId}&sessionId=${sessionId}`;
    return this.http.get(url);
  }
  getMyProceedingReportsDiary(assemblyId, sessionId) {
    const url = this.apiProceedingBaseURL + ApiConfig.proccedingReporter.getMySubmissionReports + `?assemblyId=${assemblyId}&sessionId=${sessionId}`;
    return this.http.get(url);
  }
  publishProceddingReportDiary(id) {
    const url = this.apiProceedingBaseURL + ApiConfig.proccedingReporter.publish + `/${id}`;
    return this.http.get(url);
  }
  getPublishedProceedingReportsDiary(assemblyId, sessionId) {
    const url = this.apiProceedingBaseURL + ApiConfig.proccedingReporter.publishDiaryList + `?assemblyId=${assemblyId}&sessionId=${sessionId}`;
    return this.http.get(url);
  }
  //business logics

  addNewBlock(): reportDiaryResponse {
    const newType = {
      id: null,
      time: null,
      description: null,
      startTime: null,
      endTime: null,
      lobAgendaBusinessLineId: null,
      type: null,
      isEdit: false,
      userName: ''
    };
    return newType;
  }

  setQuillEditorConfig() {
    const modules = {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],

        [{ 'header': 1 }, { 'header': 2 }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],

        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

        [{ 'color': [] }, { 'background': [] }],
        [{ 'font': [] }],
        [{ 'align': [] }],
        ['clean']]
    };
    return modules;
  }
  setAllWorkFlowUsers(data: IWorkFlowUsers[], userId) {
    const filteredWorkFlowUsers: IWorkFlowUsers[] = data.filter(filter =>
      filter.userId !== userId
    );
    return filteredWorkFlowUsers;
  }
  getCurrentUserForwardAction(data: IWorkFlowUsers[], userId) {
    const filteredWorkFlowUsers: IWorkFlowUsers = data.find(filter =>
      filter.userId == userId
    );
    return filteredWorkFlowUsers;
  }

  checkRbsPermission() {
    let permissions: IPermissionProceedings = new IPermissionProceedings();
    if (this.common.doIHaveAnAccess("PROCEEDINGS", "CREATE")) {
      permissions.allowCreateOption = true
    }
    if (this.common.doIHaveAnAccess("PROCEEDINGS", "FORWARD")) {
      permissions.allowForwardOption = true
    }
    if (this.common.doIHaveAnAccess("PROCEEDINGS", "APPROVE")) {
      permissions.allowApproveOption = true
    }
    if (this.common.doIHaveAnAccess("PROCEEDINGS_DOWNLOAD", "READ")) {
      permissions.allowDownloadOption = true
    }
    if (this.common.doIHaveAnAccess("PROCEEDINGS_FOR_ACTION", "READ")) {
      permissions.allowForactionTab = true
    }
    if (this.common.doIHaveAnAccess("PROCEEDINGS_MY_LIST", "READ")) {
      permissions.allowMyListTab = true
    }
    if (this.common.doIHaveAnAccess("PROCEEDINGS_PUBLISH", "READ")) {
      permissions.allowPublishOption = true
    }
    return permissions;
  }

}
