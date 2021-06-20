import { Component, OnInit } from "@angular/core";
import { FileuploadService } from "src/app/business-dashboard/fileupload/shared/services/fileupload.service";
import { NzDrawerService } from "ng-zorro-antd";
import { PdfViewerComponent } from "src/app/shared/components/pdf-viewer/pdf-viewer.component";
import { Router, ActivatedRoute} from "@angular/router";

@Component({
  selector: "app-summary",
  templateUrl: "./summary.component.html",
  styleUrls: ["./summary.component.scss"]
})
export class SummaryComponent implements OnInit {
  FileUpalodDetails;
  constructor(
    private drawerService: NzDrawerService,
    private fileuploadservice: FileuploadService,
    private router:Router,
    private activeroute:ActivatedRoute,
  ) {}

  ngOnInit() {
  }

  openMiscellaneousTemplate(){
   
    this.router.navigate(["../../documents/miscellaneous"],{ relativeTo:this.activeroute})
  }

  openSummaryFolderTemplate(){
   
    this.router.navigate(["../../documents/summary"],{ relativeTo:this.activeroute})
  }

  openCoverTemplate(){
   
    this.router.navigate(["../../documents/cover"],{ relativeTo:this.activeroute})
  }
}
