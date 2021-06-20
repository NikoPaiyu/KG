import { Component, OnInit } from "@angular/core";
import { FileuploadService } from "src/app/business-dashboard/fileupload/shared/services/fileupload.service";
import { NzDrawerService } from "ng-zorro-antd";
import { PdfViewerComponent } from "src/app/shared/components/pdf-viewer/pdf-viewer.component";

@Component({
  selector: "app-rules-and-procedure",
  templateUrl: "./rules-and-procedure.component.html",
  styleUrls: ["./rules-and-procedure.component.scss"]
})
export class RulesAndProcedureComponent implements OnInit {
  FileUpalodDetails;
  constructor(
    private drawerService: NzDrawerService,
    private fileuploadservice: FileuploadService
  ) { }

  ngOnInit() {
    this.getFileUploadDetails();
  }

  getFileUploadDetails() {
    this.fileuploadservice.getUploadedRulesDetails("Rules").subscribe(res => {
      this.FileUpalodDetails = res;
    });
  }
  openBudgetTemplate(url): void {
    const drawerRef = this.drawerService.create<
      PdfViewerComponent,
      { url: string },
      string
    >({
      nzContent: PdfViewerComponent,
      nzContentParams: {
        url: url
      }
    });
  }
}
