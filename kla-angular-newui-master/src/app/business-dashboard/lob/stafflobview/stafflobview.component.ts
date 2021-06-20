import { Component, OnInit } from '@angular/core';
import { LobService } from '../shared/services/lob.service';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';

@Component({
	selector: 'app-stafflobview',
	templateUrl: './stafflobview.component.html',
	styleUrls: [ './stafflobview.component.scss' ]
})
export class StaffLobViewComponent implements OnInit {
	currentDayList = [];
	date = new Date();
	today = new Date();
	constructor(private lobService: LobService) {}

	ngOnInit() {
		this.getLobListOnlyByDate(this.date);
	}

	disabledDate = (current: Date): boolean => {
		// Can not select days before today and today
		return differenceInCalendarDays(current, this.today) > 0;
	  };
	getCurrentDayList() {
		this.lobService.getCurrentDayList().subscribe((res: any) => {
			this.currentDayList = res;
		});
	}

	getLobListOnlyByDate(date) {
		if (date) {
			this.lobService.getLobListOnlyByDatebusiness(date).subscribe((res: any) => {
				this.currentDayList = res;
			});
		} else {
			this.currentDayList = [];
		}
	}
}
