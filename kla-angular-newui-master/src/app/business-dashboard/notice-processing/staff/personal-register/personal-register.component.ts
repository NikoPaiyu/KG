import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-personal-register',
  templateUrl: './personal-register.component.html',
  styleUrls: ['./personal-register.component.scss']
})
export class PersonalRegisterComponent implements OnInit {

  showDrop = false;
  listOfData = [
    {
        fileNo: '235/table-05/2020',
        fileSubject: 'One file subject here',
        fromWhome: 'from whome',
        regDate: '12/10/2019',
        assignee: 'name here',
        status: 'status'
    },
    {
      fileNo: '235/table-05/2020',
      fileSubject: 'One file subject here',
      fromWhome: 'from whome',
      regDate: '12/10/2019',
      assignee: 'name here',
      status: 'status'
  },
  {
    fileNo: '235/table-05/2020',
    fileSubject: 'One file subject here',
    fromWhome: 'from whome',
    regDate: '12/10/2019',
    assignee: 'name here',
    status: 'status'
  }
  ];

  constructor() { }

  ngOnInit() {
  }
  showDropdown() {
    this.showDrop = true;
  }
}
