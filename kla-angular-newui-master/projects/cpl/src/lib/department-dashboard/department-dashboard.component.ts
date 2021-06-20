import { Component, OnInit, Inject, Input } from '@angular/core';
import { DocumentsService } from '../shared/services/documents.service';
import { CommonService } from '../shared/services/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'cpl-department-dashboard',
  templateUrl: './department-dashboard.component.html',
  styleUrls: ['./department-dashboard.component.scss']
})
export class DepartmentDashboardComponent implements OnInit {
  @Input() fromMainDash;
  dashboardDetails: any;
  buttonColors: any = ['green_btn', 'blue_btn', 'red_btn', 'orange_btn', 'yellow_btn', 'lblue_btn', 'violet_btn'];
  currentUser: any;
  deptUser: any;

  constructor(private docService: DocumentsService,
              @Inject('authService') private AuthService,
              private router: Router) {
                this.currentUser = this.AuthService.getCurrentUser();
              }

  ngOnInit() {
    this.getDeptuser();
  }

  getDepartmentDashboard() {
    const body = {
      documentId: null,
      status: null,
      assemblyId: null,
      sessionId: null,
      portfolioId: this.deptUser.data.details.portfolioId,
      ministerDepartmentId: this.deptUser.data.details.departmentId,
      type: null,
      subtype: null,
      userId: this.currentUser.userId
  };
    this.docService.departmentDashboard(body).subscribe(Res => {
      this.dashboardDetails = Res;
    });
  }

  getDeptuser() {
    this.docService.getDeptUser(this.currentUser.userId).subscribe((Res) => {
      this.deptUser = Res;
      this.getDepartmentDashboard();
    });
  }

  routeToDocs(docType, docStatus) {
    this.router.navigate(['/business-dashboard/cpl/documents', docType],
    {
      state: {status: docStatus}
    });
  }

}
