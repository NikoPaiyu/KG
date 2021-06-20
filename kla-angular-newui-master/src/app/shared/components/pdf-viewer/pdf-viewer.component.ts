import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { map } from "rxjs/operators";
import { NzModalService } from "ng-zorro-antd";
import { HttpClient } from "@angular/common/http";
import {
  DomSanitizer,
  SafeResourceUrl,
  SafeUrl
} from "@angular/platform-browser";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-pdf-viewer",
  templateUrl: "./pdf-viewer.component.html",
  styleUrls: ["./pdf-viewer.component.scss"]
})
export class PdfViewerComponent implements OnInit {
  @Input() url = "";
  pdfUrl = "";
  // flipBookUrl:any;
  // finalFlipUrl: any;
  finalUrl: any;

  ngOnInit() {
    this.openPdf(this.url);
  }
  constructor(
    private modalService: NzModalService,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {
    //this.pdfUrl = environment.fileupload_url + '/downloadFile/';
    this.pdfUrl = environment.flow_paper_api;
  }

  @ViewChild("pdfViewerOnDemand", { static: true }) pdfViewerOnDemand;

  public openPdf(fileName) {
    /*this.pdfUrl = this.pdfUrl + encodeURIComponent(fileName);    
    this.flipBookUrl = "../../flip/pdf_text_search.html?fileUrl=" + this.pdfUrl;
    this.finalFlipUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.flipBookUrl);*/
    this.pdfUrl = this.pdfUrl + encodeURIComponent(fileName);
    this.finalUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfUrl);
    //this.pdfViewerOnDemand.pdfSrc = res;
    //this.pdfViewerOnDemand.refresh();
  }
}
