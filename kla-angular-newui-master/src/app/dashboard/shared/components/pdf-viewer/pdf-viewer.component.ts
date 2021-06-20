import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { map } from "rxjs/operators";
import { NzModalService } from "ng-zorro-antd";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-pdf-viewer",
  templateUrl: "./pdf-viewer.component.html",
  styleUrls: ["./pdf-viewer.component.scss"]
})
export class DashBoardPdfViewerComponent implements OnInit {
  @Input() url = "";
  ngOnInit() {
    this.openPdf();
  }
  constructor(private modalService: NzModalService, private http: HttpClient) {}

  @ViewChild("pdfViewerOnDemand", { static: true }) pdfViewerOnDemand;

  private downloadFile(url: string): any {
    return this.http.get(url, { responseType: "blob" }).pipe(
      map((result: any) => {
        return result;
      })
    );
  }

  public openPdf() {
    this.downloadFile(this.url).subscribe(res => {
      this.pdfViewerOnDemand.pdfSrc = res;
      this.pdfViewerOnDemand.refresh();
    });
  }
}
