import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { ActivatedRoute, Router } from '@angular/router';
import { CalenderofsittingService } from 'src/app/business-dashboard/calender-of-sitting/shared/services/calenderofsitting.service';
import { PortfolioService } from '../shared/services/portfolio.service';

@Component({
  selector: 'app-portfolio-listing',
  templateUrl: './portfolio-listing.component.html',
  styleUrls: ['./portfolio-listing.component.scss']
})
export class PortfolioListingComponent implements OnInit {
  assemblyId: any = null;
  assemblyList: any = [];
  activeAssembly: any = null;
  portfolioList: any = null;
  tabs = {
    subjectTab: false,
    subSubjectTab: false
  };
  tabIndex = 0;
  reorderPortfolio = false;
  subjectData: any = null;
  reorderSubjects = false;
  subSubjectData: any = null;
  reorderSubSubjects = false;

  constructor(private cosService: CalenderofsittingService,
              private portfolioService: PortfolioService,
              private notify: NzNotificationService,
              private router: Router,
              private route: ActivatedRoute,
              ) { }

  ngOnInit() {
    this.getAllAssembly();
  }

  getAllAssembly() {
    this.portfolioService.getAllAssemblySession().subscribe((res: any) => {
      this.assemblyList = res.assembly;
      this.activeAssembly = res.activeAssemblySession;
      this.assemblyId = this.assemblyList.find(a => a.id === this.activeAssembly.assemblyId);
    });
  }

  getPortfolioForAssembly() {
    if (this.assemblyId) {
      this.portfolioList  = [];
      this.portfolioService.getPortfoliosForAssembly(this.assemblyId.id).subscribe((res: any) => {
        this.portfolioList = res.sort((a, b) => a.priorityOrder > b.priorityOrder ? 1 : -1);
      });
    }
  }

  createPortfolio() {
    this.router.navigate([
      "business-dashboard/configuration/portfolio/create",this.assemblyId.id
    ]);
  }

  closeAllTabs() {
    this.tabIndex = 0;
    this.tabs = {
      subjectTab: false,
      subSubjectTab: false,
    };
  }

  showLinks(id) {
    this.portfolioList.forEach((element) => {
      if (element.id === id) {
        element.viewLinks = true;
      } else {
        element.viewLinks = false;
      }
    });
  }

  hideLinks(id) {
    this.portfolioList.forEach((element) => {
      if (element.id === id) {
        element.viewLinks = false;
      }
    });
  }

  reorderPortfolioList() {
    this.reorderPortfolio = !this.reorderPortfolio;
  }

  viewSubjects(portfolio) {
    this.tabs.subjectTab = true;
    this.tabIndex = 2;
    this.subjectData = portfolio;
    this.subjectData.subjects = portfolio.subjects.sort((a, b) => a.seatingOrder > b.seatingOrder ? 1 : -1);
  }

  showSubjectLinks(id) {
    this.subjectData.subjects.forEach((element) => {
      if (element.id === id) {
        element.viewLinks = true;
      } else {
        element.viewLinks = false;
      }
    });
  }

  hideSubjectLinks(id) {
    this.subjectData.subjects.forEach((element) => {
      if (element.id === id) {
        element.viewLinks = false;
      }
    });
  }

  viewSubSubjects(subject) {
    this.subSubjectData = subject;
    this.subSubjectData.ministerSubSubjects = subject.ministerSubSubjects.sort((a, b) => a.priorityOrder > b.priorityOrder ? 1 : -1);
    this.tabs.subSubjectTab = true;
    this.tabIndex = 3;
  }

  closeSubSubjectTab() {
    this.tabIndex = 2;
    this.tabs.subSubjectTab = false;
  }

  showSubSubjectLinks(id) {
    this.subSubjectData.ministerSubSubjects.forEach((element) => {
      if (element.id === id) {
        element.viewLinks = true;
      } else {
        element.viewLinks = false;
      }
    });
  }

  hideSubSubjectLinks(id) {
    this.subSubjectData.ministerSubSubjects.forEach((element) => {
      if (element.id === id) {
        element.viewLinks = false;
      }
    });
  }

  saveSeatingOrder() {
    const body = this.portfolioList.map((p, index) => ({
      masterId: p.id,
      order: index
    }));
    this.portfolioService.reorderSeating(body).subscribe((res: any) => {
      this.getPortfolioForAssembly();
      this.reorderPortfolioList();
      this.notify.success('Success', 'Seat Order Updated Successfully!');
    });
  }

}
