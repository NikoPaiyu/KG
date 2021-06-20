import { Component, OnInit } from "@angular/core";
import { LobService } from "../../../business-dashboard/lob/shared/services/lob.service";
import { DashBoardPdfViewerComponent } from "../../shared/components/pdf-viewer/pdf-viewer.component";
import { NzDrawerService } from "ng-zorro-antd";
import { AuthService } from "src/app/auth/shared/services/auth.service";
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';

@Component({
  selector: "app-view",
  templateUrl: "./view.component.html",
  styleUrls: ["./view.component.scss"]
})
export class ViewComponent implements OnInit {
  currentDayList = [];
  date = new Date();
  today = new Date();
  currentUserId;
  public drawerRef;
  constructor(
    private lobService: LobService,
    private drawerService: NzDrawerService,
    private authService: AuthService
  ) {
    this.currentUserId = authService.getCurrentUser().userId;
    
  }

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
      this.currentDayList = [];
      this.lobService
        .getLobListOnlyByDatebusiness(date)
        .subscribe((res: any) => {
          this.currentDayList = res;
        });
    } else {
      this.currentDayList = [];
    }
  }

  openTheFile(url) {
    if (this.drawerRef) {
      this.drawerRef.close();
    }
    const drawerRef = this.drawerService.create<
      DashBoardPdfViewerComponent,
      { url: string },
      string
    >({
      nzContent: DashBoardPdfViewerComponent,
      nzContentParams: {
        url: url
      }
    });
    this.drawerRef = drawerRef;
  }
}
