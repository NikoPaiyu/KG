import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { apiConfi } from '../config/digitizationApiConfig';
import { IAccessLevelResponseDto, IAssemblySessionResponseDto, IDepartmentResponseDto, IDocumentSubTypeResponseDto, IDocumentTypeResponseDto, IKlaSectionResponseDto } from '../models/digitizationmodel'
@Injectable({
  providedIn: 'root'
})
export class DigitisationapiService {
  calerderApiUrl: string;
  digitizationApiUrl: string;
  departmentmangementApiUrl: string;
  questionApiUrl: string;
  environment: any;
  constructor(@Inject("environment") environment, private http: HttpClient) {
    this.environment = environment;
    this.calerderApiUrl = this.environment.calendar_api_url;
    this.digitizationApiUrl = this.environment.digitization_api_url;
    this.departmentmangementApiUrl = this.environment.departmentmangement_api_url;
    this.questionApiUrl = this.environment.portfolio_mock_api_url;
  }

  getAllAssemblyandSesssion() {
    const url = this.calerderApiUrl + apiConfi.master.getAssemblySessionList;
    return this.http.get<IAssemblySessionResponseDto>(url);
  }

  getDocumentType() {
    const url = this.digitizationApiUrl + apiConfi.master.getDocumentType;
    return this.http.get<IDocumentTypeResponseDto[]>(url);
  }

  getDocumentSubType() {
    const url = this.digitizationApiUrl + apiConfi.master.getDocumentSubType;
    return this.http.get<IDocumentSubTypeResponseDto[]>(url);
  }

  getKlaSection() {
    const url = this.departmentmangementApiUrl + apiConfi.master.getKlaSection;
    return this.http.get<IKlaSectionResponseDto[]>(url);
  }

  getDepartment() {
    const url = this.questionApiUrl + apiConfi.master.getDepartment;
    return this.http.get<IDepartmentResponseDto[]>(url);
  }
  getFileUploadUrl() {
    return this.environment.fileupload_url2 + '/uploadFile'
  }
  getAccesLevelList() {
    const url = this.digitizationApiUrl + apiConfi.master.getAccesLevelList;
    return this.http.get<IAccessLevelResponseDto[]>(url);
  }
}
