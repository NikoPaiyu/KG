import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'committee-attendance',
  templateUrl: './attendance-list.component.html',
  styleUrls: ['./attendance-list.component.css']
})
export class AttendanceListComponent implements OnInit {
  isVisible = false;
  isOkLoading = false;
  markattendence = false;
  searchFilter = '';
  newList: any = [];
  constructor() { }
  
  listOfData = [
    {
      key: '1',
      md: '12/10/2020',
      mt: 'Agriculture',
      atten: '3/7'
    },
    {
      key: '2',
      md: '13/10/2020',
      mt: 'bill',
      atten: '3/7'
    },
    {
      key: '3',
      md: '14/10/2020',
      mt: 'party',
      atten: '3/7'
    },
    {
      key: '4',
      md: '15/10/2020',
      mt: 'flood',
      atten: '3/7'
    },
    {
      key: '5',
      md: '16/10/2020',
      mt: 'law and order',
      atten: '3/7'
    }

  ];
  listOfDatas = [
    {
      key: '1',
      nameofmeeting: 'Member Name',
      distance: '20',
     
    },
    {
      key: '2',
      nameofmeeting: 'Member Name',
      distance: '20',
     
    },
    {
      key: '3',
      nameofmeeting: 'Member Name',
      distance: '20',
     
    },
    {
      key: '4',
      nameofmeeting: 'Member Name',
      distance: '20',
     
    },
    {
      key: '5',
      nameofmeeting: 'Member Name',
      distance: '20',
     
    }

  ];
  checkboxes = [
    { id: 1, label: 'Meeting Date', check: true },
    { id: 2, label: 'Meeting Title', check: true },
    { id: 3, label: 'Attendance', check: true },
  ];
  filterList() {
    if (this.searchFilter) {
      this.listOfData = this.listOfData.filter(
        (element) =>
          (element.key &&
            element.key
              .toLowerCase()
              .includes(this.searchFilter.toLowerCase())) ||
          (element.md &&
            element.md
              .toLowerCase()
              .includes(this.searchFilter.toLowerCase())) ||
              (element.mt &&
                element.mt
                  .toLowerCase()
                  .includes(this.searchFilter.toLowerCase())) ||
              (element.atten &&
                element.atten
                  .toLowerCase()
                  .includes(this.searchFilter.toLowerCase()))
              
      );
    } else {
      this.listOfData = this.listOfData;
    }
  }


  ngOnInit() {
  }
 

  showModal(): void {
    this.isVisible = true;
  }
  showMarkAttendence(): void {
    this.markattendence = true;
  }

  handleOk(): void {
      this.isVisible = false;
      this.markattendence = false;
  }

  handleCancel(): void {
    this.isVisible = false;
    this.markattendence = false;
  }
}
