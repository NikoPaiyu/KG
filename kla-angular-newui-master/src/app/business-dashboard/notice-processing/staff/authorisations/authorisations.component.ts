import { Component, OnInit } from '@angular/core';
import { FileService } from '../../shared/services/file.service';

@Component({
  selector: 'app-authorisations',
  templateUrl: './authorisations.component.html',
  styleUrls: ['./authorisations.component.scss']
})
export class AuthorisationsComponent implements OnInit {
  viewContent: any;
  authorisedNoticeList: any = [];
  searchText = '';
  mockData = [
    {
      key: '1',
      name: 'John Brown',
      date: 22
    },
    {
      key: '2',
      name: 'Jim Green',
      date: 25    },
{
      key: '3',
      name: 'Joe Black',
      date: 27 
    }
  ];
  isVisible = false;
  constructor(
    private file: FileService
  ) { }

  ngOnInit() {
    this.getAuthorisedNoticeList();
  }
  showModal(noticeData) {
    this.isVisible = true;
    if (noticeData) {
      this.viewContent = noticeData;
    } else {
      this.viewContent = "Nothing to preview";
    }
  }
  handleCancel() {
    this.isVisible = false;
  }
  getAuthorisedNoticeList() {
    // tslint:disable-next-line: deprecation
    this.file.getAuthorisedNoticeList().subscribe((Res) => {
      this.authorisedNoticeList = Res;
      console.log(this.authorisedNoticeList);
    });
  }
}
