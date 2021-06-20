import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommitteeService } from '../../shared/services/committee.service';

@Component({
  selector: 'lib-questionnaire-listing',
  templateUrl: './questionnaire-listing.component.html',
  styleUrls: ['./questionnaire-listing.component.css']
})
export class QuestionnaireListingComponent implements OnInit {

  constructor(private committeeService: CommitteeService,
              private router: Router) { }
  searchFilter = '';
  newList: any = [];
  tempListOfData: any;
  listOfData = [];
  checkboxes = [
    { id: 1, label: 'Meeting Subject', check: true },
    { id: 2, label: 'Date of Meeting', check: true },
    { id: 3, label: 'File Number', check: true },
  ];
  filterList() {
    if (this.searchFilter) {
      this.listOfData = this.tempListOfData.filter(
        (element) =>
          (element.fileNumber &&
            element.fileNumber
              .toLowerCase()
              .includes(this.searchFilter.toLowerCase())) ||
          (element.subject &&
            element.subject
              .toLowerCase()
              .includes(this.searchFilter.toLowerCase())) ||
              (element.meetingDate &&
                element.meetingDate
                  .toLowerCase()
                  .includes(this.searchFilter.toLowerCase()))
      );
    } else {
      this.listOfData = this.tempListOfData;
    }
  }



  ngOnInit() {
    this.getQuestionnaireList();
  }

  getQuestionnaireList() {
    this.committeeService.getQuestionnaireList().subscribe((res: any) => {
      this.listOfData = res;
      this.tempListOfData = this.listOfData ;
    });
  }

  viewQuestionnaire(id) {
    this.router.navigate([
      'business-dashboard/committee/questionnaire-view/',
      id
    ]);
  }

  viewFile(id) {
    this.router.navigate(['business-dashboard/committee/file-view', id]);
  }

}
