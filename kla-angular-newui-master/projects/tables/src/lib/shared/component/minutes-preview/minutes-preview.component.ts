import { Component, OnInit, Input } from '@angular/core';
import { parseISO } from 'date-fns';

@Component({
  selector: 'tables-minutes-preview',
  templateUrl: './minutes-preview.component.html',
  styleUrls: ['./minutes-preview.component.scss']
})
export class MinutesPreviewComponent implements OnInit {
  @Input() minutesData: any = {};

  constructor() { }

  ngOnInit() {
  }

  setDateFormat() {
    const weekday = new Array(7);
    weekday[0] = 'Sunday';
    weekday[1] = 'Monday';
    weekday[2] = 'Tuesday';
    weekday[3] = 'Wednesday';
    weekday[4] = 'Thursday';
    weekday[5] = 'Friday';
    weekday[6] = 'Saturday';
    const month = new Array();
    month[0] = 'January ';
    month[1] = 'February ';
    month[2] = 'March ';
    month[3] = 'April ';
    month[4] = 'May ';
    month[5] = 'June ';
    month[6] = 'July ';
    month[7] = 'August ';
    month[8] = 'September ';
    month[9] = 'October ';
    month[10] = 'November ';
    month[11] = 'December ';
    let minuteDate = null;
    const governorsAddressDate = parseISO(this.minutesData.governorsAddressDTO.governorsAddressDate);
    if (this.minutesData.governorsAddressDTO) {
      const day = weekday[governorsAddressDate.getDay()];
      const monthStr =  month[governorsAddressDate.getMonth()];
      minuteDate = day + ', ' + monthStr +
      governorsAddressDate.getDate() + ', ' +
      governorsAddressDate.getFullYear();
    }
    return minuteDate;
  }

}
