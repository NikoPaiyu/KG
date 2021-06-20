import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
@Component({
  selector: 'committee-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.css']
})
export class QuestionnaireComponent implements OnInit {
  fileNumber;
  fileSubject;
  dateofMeeting;
  backfileno;
  status;
  createdon;
  listOfSelection = [
    {
      text: 'Select All Row',
      onSelect: () => {
        this.onAllChecked(true);
      }
    },
    {
      text: 'Select Odd Row',
      onSelect: () => {
        this.listOfCurrentPageData.forEach((data, index) => this.updateCheckedSet(data.id, index % 2 !== 0));
        this.refreshCheckedStatus();
      }
    },
    {
      text: 'Select Even Row',
      onSelect: () => {
        this.listOfCurrentPageData.forEach((data, index) => this.updateCheckedSet(data.id, index % 2 === 0));
        this.refreshCheckedStatus();
      }
    }
  ];
  checked = false;
  indeterminate = false;
  listOfCurrentPageData = [];
  listOfData = [];
  setOfCheckedId = new Set<number>();

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(value: boolean): void {
    this.listOfCurrentPageData.forEach(item => this.updateCheckedSet(item.id, value));
    this.refreshCheckedStatus();
  }

  onCurrentPageDataChange(): void {
    this.listOfCurrentPageData;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every(item => this.setOfCheckedId.has(item.id));
    this.indeterminate = this.listOfCurrentPageData.some(item => this.setOfCheckedId.has(item.id)) && !this.checked;
  }
  constructor( private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() : void {
    this.listOfData = new Array(200).fill(0).map((_, index) => {
      return {
        id: index,
        fileNumber: `Edward King ${index}`,
        fileSubject: 32,
        dateofMeeting: `London, Park Lane no. ${index}`,
        backfileno: 1,
        status: `true`,
        createdon: `r`
      };
    });
    this.listOfData = [
      {
      fileNumber: `2224/Table02/ni.e`,
      fileSubject: `Committe Constition`,
      dateofMeeting: `26/08/2020`,
      backfileno: `228765/Table02/ni.e`,
      status: `Yes`,
      createdon: `27/08/2020`
    },
    {
      fileNumber: `2224/Table02/ni.e`,
      fileSubject: `Committe Constition`,
      dateofMeeting: `26/08/2020`,
      backfileno: `228765/Table02/ni.e`,
      status: `Yes`,
      createdon:  `27/08/2020`
    },
    {
      fileNumber: `2224/Table02/ni.e`,
      fileSubject: `Committe Constition`,
      dateofMeeting: `26/08/2020`,
      backfileno: `228765/Table02/ni.e`,
      status: `No`,
      createdon:  `27/08/2020`
    },
    {
      fileNumber: `2224/Table02/ni.e`,
      fileSubject: `Committe Constition`,
      dateofMeeting: `26/08/2020`,
      backfileno: `228765/Table02/ni.e`,
      status: `Yes`,
      createdon:  `27/08/2020`
    },
    {
      fileNumber: `2224/Table02/ni.e`,
      fileSubject: `Committe Constition`,
      dateofMeeting: `26/08/2020`,
      backfileno: `228765/Table02/ni.e`,
      status: `Yes`,
      createdon:  `27/08/2020`
    },
    {
      fileNumber: `2224/Table02/ni.e`,
      fileSubject: `Committe Constition`,
      dateofMeeting: `26/08/2020`,
      backfileno: `228765/Table02/ni.e`,
      status: `Yes`,
      createdon:  `27/08/2020`
    },
    {
      fileNumber: `2224/Table02/ni.e`,
      fileSubject: `Committe Constition`,
      dateofMeeting: `26/08/2020`,
      backfileno: `228765/Table02/ni.e`,
      status: `Yes`,
      createdon:  `27/08/2020`
    },

      
    ]
  }
  createquestionnarie(){
  this.router.navigate([
    "business-dashboard/committee/create-questionnaire"
  ]);
}
}
