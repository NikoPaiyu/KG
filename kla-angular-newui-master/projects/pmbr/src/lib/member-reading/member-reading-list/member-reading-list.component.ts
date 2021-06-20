import { Component, OnInit } from '@angular/core';
import { PmbrCommonService } from '../../shared/services/pmbr-common.service';

@Component({
  selector: 'pmbr-member-reading-list',
  templateUrl: './member-reading-list.component.html',
  styleUrls: ['./member-reading-list.component.css']
})
export class MemberReadingListComponent implements OnInit {
  memberReadingList: any = [];
  tempMemberList: any = [];
  search;
  colCheckboxes = [
    { id: 0, label: 'bill', check: true, disable: false },
    { id: 1, label: 'date', check: true, disable: false },
    { id: 2, label: 'priority', check: true, disable: false },
    { id: 3, label: 'session', check: true, disable: false },
    { id: 4, label: 'status', check: true, disable: false }

  ];
  constructor(private pmbrCommonService: PmbrCommonService) { }
  disableCheckBox() {
    let count = 0;
    for (const box of this.colCheckboxes) {
      if (box.check) {
        count++;
      }
    }

    if (count === 6) {
      for (const box of this.colCheckboxes) {
        if (!box.check) {
          box.disable = true;
        }
      }
    } else {
      for (const box of this.colCheckboxes) {
        box.disable = false;
      }
    }
  }
  showLinks(id) {
    this.tempMemberList.forEach(element => {
      if (element.billMetaDataDto.id === id) {
        element.viewLinks = true;
      } else {
        element.viewLinks = false;
      }
    });
  }
  ngOnInit() {
    this.getMemberList();
  }
getMemberList()
{
  this.pmbrCommonService.getMemberReadingList().subscribe(res => {
    this.memberReadingList = this.tempMemberList = res;
  });

}
searchList() {
  if (this.search) {
    this.memberReadingList = this.tempMemberList.filter(
      (element) =>
        (element.billMetaDataDto.title &&
          element.billMetaDataDto.title
            .toLowerCase()
            .includes(this.search.toLowerCase())) ||
        (element.billMetaDataDto.createdDate &&
          element.billMetaDataDto.createdDate
            .toLowerCase()
            .includes(this.search.toLowerCase())) ||
        (element.billMetaDataDto.priority &&
          element.billMetaDataDto.priority
            .toLowerCase()
            .includes(this.search.toLowerCase())) ||
        (element.billMetaDataDto.session &&
          element.billMetaDataDto.session
            .toLowerCase()
            .includes(this.search.toLowerCase())) ||
        (element.billMetaDataDto.status &&
          element.billMetaDataDto.status
            .toLowerCase()
            .includes(this.search.toLowerCase()))
    );
  } else {
    this.memberReadingList = this.tempMemberList;
  }
}
}
