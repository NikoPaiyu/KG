import { Component, OnInit, ViewChild } from "@angular/core";
import { NzModalService, NzModalRef } from "ng-zorro-antd/modal";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
@Component({
  selector: "app-e-book",
  templateUrl: "./e-book.component.html",
  styleUrls: ["./e-book.component.scss"]
})
export class EBookComponent implements OnInit {
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
    let url = "../assets/pdf/pdf.pdf";
    this.downloadFile(url).subscribe(res => {
      this.pdfViewerOnDemand.pdfSrc = res;
      this.pdfViewerOnDemand.refresh();
    });
  }
}
