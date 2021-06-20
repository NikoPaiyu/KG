import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'committee-mark-attendance',
  templateUrl: './mark-attendance.component.html',
  styleUrls: ['./mark-attendance.component.scss']
})
export class MarkAttendanceComponent implements OnInit {

  constructor() { }
  isVisible= false;
  isOkLoading = false;
  selectedValue="";
  pipe="km";
  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.isOkLoading = true;
    setTimeout(() => {
      this.isVisible = false;
      this.isOkLoading = false;
    }, 3000);
  }

  handleCancel(): void {
    this.isVisible = false;
  }
listOfData = [
    {
      key: '1',
      nom: 'Member Name(20)',
      distance: 'Distance'
    },
    {
      key: '2',
      nom: 'Member Name(20)',
      distance: 'Distance'
    },
    {
      key: '3',
      nom: 'Member Name(20)',
      distance: 'Distance'
    },
    {
      key: '4',
      nom: 'Member Name(20)',
      distance: 'Distance'
    },
    {
      key: '5',
      nom: 'Member Name(20)',
      distance: 'Distance'
    }
  ];
  ngOnInit() {
    this.showModal();
  }

}
