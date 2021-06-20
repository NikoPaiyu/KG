import { Component, OnInit, ViewChild } from "@angular/core";
import { AuthService } from "src/app/auth/shared/services/auth.service";
import { Router } from "@angular/router";
import { CurrentSpeakernoteService } from "../shared/services/current-speakernote.service";
import { environment } from "src/environments/environment";
import { UserData } from "src/app/auth/shared/models";
import * as Stomp from "stompjs";
import * as SockJS from "sockjs-client";
import { PDFDocumentProxy } from "pdfjs-dist";
import { PdfViewerComponent } from "ng2-pdf-viewer";
@Component({
  selector: "app-live-speakernote",
  templateUrl: "./live-speakernote.component.html",
  styleUrls: ["./live-speakernote.component.scss"]
})
export class LiveSpeakernoteComponent implements OnInit {
  @ViewChild(PdfViewerComponent, { static: false })
  pdfComponent: PdfViewerComponent;
  webSocketPoint: string = `${environment.document_socket_api_url}/socket`;
  currentFile: string = "/session-socket/speakerNote";
  businessType = null;
  nextDisable = false;
  stompClient: any;
  id: any;
  currentDate: any;
  fullScreenMode = false;
  pdfSrc = "";
  isStreaming = false;
  pageNumber: number = 1;
  totalPages: number = null;
  currentUser: UserData;
  constructor(
    private currentSpeakernoteService: CurrentSpeakernoteService,
    private authService: AuthService,
    public router: Router
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit() {
    this.getFileByRestApi();
    this._initializeSocket();
  }

  getFileByRestApi() {
    this.currentSpeakernoteService
      .getStreamingSpeakerNote()
      .subscribe((res: any) => {
        this.pdfSrc = res.speakerNoteUrl;
        this.isStreaming = res && res.speakerNoteUrl ? true : false;
        this.pageNumber = res.currentIndex > 0 ? res.currentIndex : 1;
        if (this.pdfSrc) {
          this.fullScreenMode = true;
        }
      });
  }
  _initializeSocket() {
    let ws = new SockJS(this.webSocketPoint);
    this.stompClient = Stomp.over(ws);
    const _this = this;
    _this.stompClient.connect(
      {},
      function(frame) {
        _this._connectToLiveFileSocket();
      },
      this.errorCallBack
    );
  }

  errorCallBack(error) {
    setTimeout(() => {
      this._initializeSocket();
    }, 5000);
  }

  disconnect() {
    if (this.stompClient && this.stompClient.connected)
      this.stompClient.disconnect();
  }

  _connectToLiveFileSocket() {
    const _this = this;
    _this.stompClient.subscribe(_this.currentFile, function(sdkEvent) {
      _this.onFilePathTrigger(sdkEvent);
    });
  }

  onFilePathTrigger(message) {
    let activeBusiness = JSON.parse(message.body);
    this.businessType = activeBusiness.businessCode;
    if (!this.fullScreenMode && activeBusiness.documentUrl) {
      this.fullScreenMode = true;
    }
    this.pdfSrc = activeBusiness.documentUrl ? activeBusiness.documentUrl : "";
    this.isStreaming =
      activeBusiness && activeBusiness.documentUrl ? true : false;

    this.pageNumber =
      activeBusiness.currentIndex > 0 ? activeBusiness.currentIndex : 1;
  }

  addClass() {
    this.fullScreenMode = !this.fullScreenMode;
  }

  nextPage() {
    if (this.pageNumber == 0) {
      this.pageNumber = 1;
    }
    this.pageNumber = Number(this.pageNumber) + 1;
    this._pageChangeHandler(this.pageNumber);
  }

  _pageChangeHandler(index) {
    this.currentSpeakernoteService
      .pageChangeHandler(index)
      .subscribe(res => {});
  }

  previousPage() {
    this.pageNumber =
      Number(this.pageNumber) > 1 ? Number(this.pageNumber) - 1 : 1;
    this._pageChangeHandler(this.pageNumber);
  }

  afterLoadComplete(pdf: PDFDocumentProxy): void {
    this.totalPages = pdf.numPages;
  }

  pageChange(currentPageNumber: any) {
    if (
      this.pdfSrc &&
      this.pageNumber != currentPageNumber &&
      !(this.pageNumber > this.totalPages)
    ) {
      this.pdfComponent.pdfViewer.scrollPageIntoView({
        pageNumber: this.pageNumber
      });
    }
  }

  ngOnDestroy() {
    this.disconnect();
  }
}
