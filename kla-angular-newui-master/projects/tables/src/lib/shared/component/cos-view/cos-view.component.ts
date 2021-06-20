import { Component, OnInit, Input } from '@angular/core';
import { TablescommonService } from '../../services/tablescommon.service';

@Component({
  selector: 'tables-cos-view',
  templateUrl: './cos-view.component.html',
  styleUrls: ['./cos-view.component.scss']
})
export class CosViewComponent implements OnInit {

  constructor(private commonService: TablescommonService) { }
  @Input() calendarSittingId;
  tempCos = {
    calendarOfDaysList: []
  };
  ngOnInit() {
    this.showModel();
  }

  showModel(): void {
    this.commonService.getCosById(this.calendarSittingId).subscribe(res => {

      this.processCalendarEvent(res);
    });
  }

  processCalendarEvent(data) {
    if (data && data.calendarOfDaysList) {
      this.tempCos = data;
      let firstData = null;
      data.calendarOfDaysList.forEach((element, i) => {
        if (firstData !== new Date(element.dateList[0]).getMonth()) {
          firstData = new Date(element.dateList[0]).getMonth();
          this.tempCos.calendarOfDaysList[i].month = element.dateList[0];
        }
      });
    }
  }

  ShowBusiness(item) {
    if (item && item.lobBusinessGroupId === 3) {
      return item.descriptionEng;
    }
    return item.lobBusinessGroupName;
  }
}
