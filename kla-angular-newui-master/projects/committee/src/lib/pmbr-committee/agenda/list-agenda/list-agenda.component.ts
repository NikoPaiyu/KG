import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AgendaServiceService } from '../shared/agenda-service.service';
@Component({
  selector: 'committee-list-agenda',
  templateUrl: './list-agenda.component.html',
  styleUrls: ['./list-agenda.component.css']
})
export class ListAgendaComponent implements OnInit {
  agendaData: any = [];
  // agendaData: any =[{
  //   title: 'committee',
  //   date: '26-07-2021',
  //   Venue: 'New York No.  Lake Park',
  //   session: 'one',
  //   fileNo: 'two',
  //   status: 'SAVED'
  // },
  // {
  //   title: 'committees',
  //   date: 'Jim Green',
  //   session: 'Three',
  //   Venue: 'London No. Lake Park',
  //   fileNo: 'four',
  //   status: 'SAVED'
  // },
  // {
  //   title: 'Commit',
  //   date: 'Joe Black',
  //   session: 'five',
  //   Venue: 'Sidney No. Lake Park',
  //   fileNo: 'six',
  //   status: 'SAVED'
  // }];
  tempAgendaData;
  constructor(private router: Router,
    private agendaService: AgendaServiceService) { }

  ngOnInit() {
    this.getAgendaList();
  }
createagenda(){
  this.router.navigate(['business-dashboard/committee/create-agenda'])
}
searchList(searchText) {
  this.tempAgendaData = this.agendaData;
  if (searchText) {
    this.agendaData = this.tempAgendaData.filter(
      (element) => (element.title && element.title
        .toLowerCase().includes(searchText.toLowerCase())) ||
        (element.date && element.date
          .toLowerCase().includes(searchText.toLowerCase())) ||
        (element.Venue && element.Venue
          .toLowerCase().includes(searchText.toLowerCase())) ||
        (element.session && element.session
          .toLowerCase().includes(searchText.toLowerCase())) ||
        (element.status && element.status
          .toLowerCase().includes(searchText.toLowerCase()) ||
          (element.fileNo && element.fileNo
            .toLowerCase().includes(searchText.toLowerCase()))));
  } else {
    this.agendaData = this.tempAgendaData;
  }
}
getAgendaList(){
  this.agendaService.agendaList().subscribe(res => {
    this.agendaData = res;
  });
}
}
