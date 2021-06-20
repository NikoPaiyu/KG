import { Component, OnInit } from "@angular/core";
import { BusinessControllerService } from "src/app/business-dashboard/lob/shared/services/business-controller.service";

@Component({
  selector: "app-speaker-live-business-management",
  templateUrl: "./speaker-live-business-management.component.html",
  styleUrls: ["./speaker-live-business-management.component.scss"]
})
export class SpeakerLiveBusinessManagementComponent implements OnInit {
  fullScreenMode = false;
  runningLines = [];
  currentBusinessId;
  currentBusiness;
  pdfSrc;
  currentActiveBusinessLine;
  constructor(private controllerservice: BusinessControllerService) {}

  ngOnInit() {
    this.getRunnigLines();
  }
  getRunnigLines() {
    this.controllerservice.getLiveBusinesses().subscribe((res: any) => {
      this.runningLines = res;
      if (this.runningLines.length > 0) {
        this.currentBusinessId = res[0].businessId;
        this.currentBusiness = res[0];
      }
    });
  }

  onClickBusiness(item) {
    this.currentBusinessId = item.businessId;
    this.currentBusiness = item;
    this.pdfSrc = item.speakerNote ? item.speakerNote : "";
  }

  addClass() {
    this.fullScreenMode = !this.fullScreenMode;
  }
}
