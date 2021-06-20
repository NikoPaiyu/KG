import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {

  constructor(private http: HttpClient,
              ) { }

  getPortfoliosForAssembly(assemblyId) {
    const url = `${environment.portfolio_mock_api_url}/kla/service/v1/portfolio/getByAssembly/${assemblyId}`;
    return this.http.get(url);
  }
  savePortFolio(portFolioData){
    const url = `${environment.portfolio_mock_api_url}/kla/service/v1/portfolio/addPortfolio`;
    return this.http.post(url,portFolioData);
  }
  saveSubject(subData){
    const url = `${environment.portfolio_mock_api_url}/kla/service/v1/portfolio/addSubject`;
    return this.http.post(url,subData);
  }
  saveSubSubject(subSubData){
    const url = `${environment.portfolio_mock_api_url}/kla/service/v1/portfolio/addSubSubject`;
    return this.http.post(url,subSubData);
  }
  getMinisterSubject(portFolioID){
    const url = `${environment.portfolio_mock_api_url}/kla/service/v1/portfolio/getAllSubjectByIds`;
    return this.http.post(url,portFolioID);
  }
  getMinisterSubSubjects(subjectId){
    const url = `${environment.portfolio_mock_api_url}/kla/service/v1/`;
    return this.http.get(url);
  }
  updatePortfolioOrder(portdata){
    // const url = `${environment.portfolio_mock_api_url}/kla/service/v1/`;
    // return this.http.get(url);
    let data = portdata.map((element, index) => {
      return {
        masterId: element.value,
        order: index,
      };
    });
    return this.http.post(
      `${environment.portfolio_mock_api_url}/kla/service/v1/portfolio/reorder`,
      data
    );
  }
  updateMinisterSubjectOrder(subjectData){
    let data = subjectData.map((element, index) => {
      return {
        masterId: element.value,
        order: index,
      };
    });
    return this.http.post(
      `${environment.portfolio_mock_api_url}mock/portfolio/subject/reorder`,
      data
    );
  }
  updateMinisterSubSubjectOrder(subsubjectData){
    let data = subsubjectData.map((element, index) => {
      return {
        masterId: element.value,
        order: index,
      };
    });
    return this.http.post(
      `${environment.portfolio_mock_api_url}mock/portfolio/subSubject/reorder`,
      data
    );
  }

  reorderSeating(body) {
    const url = `${environment.portfolio_mock_api_url}/kla/service/v1/portfolio/updateSeatinOrder`;
    return this.http.post(url, body);
  }

  getAllAssemblySession() {
    const url = `${environment.calendar_api_url}/getAllAssemblyAndSession`;
    return this.http.get(url);
  }
}
