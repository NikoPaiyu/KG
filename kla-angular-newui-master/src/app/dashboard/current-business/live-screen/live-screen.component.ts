import { Component, OnInit, ViewChild } from "@angular/core";
import * as Stomp from "stompjs";
import * as SockJS from "sockjs-client";
import { CurrentBusinessService } from "../shared/service/current-business.service";
import { environment } from "src/environments/environment";
import { AuthService } from "src/app/auth/shared/services/auth.service";
import { UserData } from "src/app/auth/shared/models";
import { PDFDocumentProxy } from "pdfjs-dist";
import { BusinessControllerService } from "src/app/business-dashboard/lob/shared/services/business-controller.service";
import { UserManagementService } from "../../../business-dashboard/user-management/shared/services/user-management.service";
import { FileuploadService } from "../../../business-dashboard/fileupload/shared/services/fileupload.service";
import { AttentenceDetails } from "src/app/business-dashboard/user-management/shared/models/userDetails";
import { Router } from "@angular/router";
import { PdfViewerComponent } from "ng2-pdf-viewer";
import { CurrentAttendanceService } from "../shared/service/current-attendance.service";
@Component({
  selector: "app-live-screen",
  templateUrl: "./live-screen.component.html",
  styleUrls: ["./live-screen.component.scss"]
})
export class LiveScreenComponent implements OnInit {
  @ViewChild(PdfViewerComponent, { static: false })
  pdfComponent: PdfViewerComponent;
  webSocketPoint: string = `${environment.document_socket_api_url}/socket`;
  currentFile: string = "/session-socket/currentBusiness";
  currentIndex: string = "/session-socket/current-page";
  businessType = null;
  nextDisable = false;
  stompClient: any;
  id: any;
  currentDate: any;
  fullScreenMode = false;
  pdfSrc = "";
  isSpeakerFlag = false;
  documentOwner = false;
  isStreaming = false;
  pageNumber: number = 1;
  totalPages: number = null;
  currentUser: UserData;
  //for current attendenceDetails
  attendenceDetailsList: AttentenceDetails;
  colourCode = "#d88b02";
  pickdate: any;
  FileUpalodDetails: Object;
  fileUploadDetails: Object;
  fetchData: Object;
  hideShowNextPrevButton = false;
  constructor(
    private currentbusiness_service: CurrentBusinessService,
    private controllerservice: BusinessControllerService,
    private authService: AuthService,
    private UserManagementService: UserManagementService,
    private fileUploadService: FileuploadService,
    public router: Router,
    private attendance: CurrentAttendanceService
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit() {
    this.attendenceDetailsList = new AttentenceDetails();
    if (
      this.currentUser.userId &&
      this.currentUser.authorities.includes("speakerNote")
    ) {
      this.router.navigate(["dashboard/current-speakernote/live"]);
    } else {
      let polygenControl = document.getElementsByTagName("body")[0];
      polygenControl.classList.add("home");
      this.isSpeaker();
      this.getFileByRestApi();
      this._initializeSocket();
      this.getCurrentAttendence();
      this.subscribeAttendance();
      this.initializeAttendanceSocket();
    }

    if (this.currentUser.authorities.includes('swearingIn')) {
      this.addClass();
    }
  }

  isSpeaker() {
    this.isSpeakerFlag = this.currentUser.authorities.some(
      role => role.toLowerCase() == "speaker"
    );
  }

  getFileByRestApi() {
    this.currentbusiness_service.getStreamingFile().subscribe((res: any) => {
      this.currentUser = this.authService.getCurrentUser();
      this.pdfSrc = res.documentUrl;
      this.businessType = res.businessCode;
      this.documentOwner =
        res.ownerId == this.currentUser.userId ? true : false;
      this.isStreaming = res && res.documentUrl ? true : false;
      //check whether budget or GOVERNORSPEECH
      this.pageNumber =
        res.currentIndex &&
          this.documentOwner &&
          res.currentIndex != 1 &&
          (res.businessCode == "BUDGET" || res.businessCode == "GOVERNORSPEECH")
          ? res.currentIndex + 1
          : res.currentIndex;
      this.nextPrevButtonValidation(res);
    });
  }
  _initializeSocket() {
    let ws = new SockJS(this.webSocketPoint);
    this.stompClient = Stomp.over(ws);
    const _this = this;
    _this.stompClient.connect(
      {},
      function (frame) {
        _this._connectToCurrentPageSocket();
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
    _this.stompClient.subscribe(_this.currentFile, function (sdkEvent) {
      _this.onFilePathTrigger(sdkEvent);
    });
  }

  _connectToCurrentPageSocket() {
    const _this = this;
    _this.stompClient.subscribe(_this.currentIndex, function (sdkEvent) {
      _this.onCurrentIndexTrigger(sdkEvent);
    });
  }

  onFilePathTrigger(message) {
    this.nextDisable = false;
    let activeBusiness = JSON.parse(message.body);
    this.businessType = activeBusiness.businessCode;
    this.pdfSrc = activeBusiness.documentUrl ? activeBusiness.documentUrl : "";
    this.documentOwner =
      activeBusiness.ownerId == this.currentUser.userId ? true : false;
    this.isStreaming =
      activeBusiness && activeBusiness.documentUrl ? true : false;

    this.pageNumber =
      activeBusiness.currentIndex &&
        this.documentOwner &&
        activeBusiness.currentIndex != 1 &&
        activeBusiness.businessCode == "BUDGET"
        ? activeBusiness.currentIndex + 1
        : activeBusiness.currentIndex;

    if (!this.pdfSrc) {
      this.fullScreenMode = false;
    }
    //check next previuos button validation
    this.nextPrevButtonValidation(activeBusiness);
  }
  nextPrevButtonValidation(data) {
    if (data.businessName == "Address by The Governor" || data.businessName == "Financial Business") {
      this.hideShowNextPrevButton = this.documentOwner;
    }
    else {
      this.hideShowNextPrevButton = true;
    }
  }

  onCurrentIndexTrigger(message) {
    if (!this.documentOwner) {
      this.pageNumber = message.body;
    }
  }

  addClass() {
    this.fullScreenMode = !this.fullScreenMode;
  }

  nextPage() {
    if (this.pageNumber == 0) {
      this.pageNumber = 1;
    }
    if (this.documentOwner) {
      this._pageChangeHandler(this.pageNumber);
    }
    this.pageNumber = Number(this.pageNumber) + 1;
    this.nextButtonDisalbe();
  }

  nextButtonDisalbe() {
    if ((this.businessType == "BUDGET" || this.businessType == "GOVERNORSPEECH") && this.pageNumber > this.totalPages) {
      this.nextDisable = true;
    }
    if (this.businessType != "BUDGET" && this.businessType != "GOVERNORSPEECH" && this.pageNumber >= this.totalPages) {
      this.nextDisable = true;
    }
  }
  _pageChangeHandler(index) {
    this.currentbusiness_service.pageChangeHandler(index).subscribe(res => { });
  }

  previousPage() {
    this.pageNumber =
      Number(this.pageNumber) > 1 ? Number(this.pageNumber) - 1 : 1;
    this.nextDisable = false;
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
  stopStreaming() {
    this.controllerservice.currentBusinessStop().subscribe(res => {
      this.fullScreenMode = false;
      this.pdfSrc = "";
      this.nextDisable = false;
    });
  }

  ngOnDestroy() {
    let polygenControl = document.getElementsByTagName("body")[0];
    polygenControl.classList.remove("home");
    this.disconnect();
  }
  // get attendance data through api
  getCurrentAttendence() {
    this.attendance.getCurrentAttendence().subscribe(data => {
      this.updateAttendanceData(data);
    });
  }
  // get attendance data through web socket
  subscribeAttendance() {
    this.attendance.currentAttendanceSubject.subscribe(data => {
      this.updateAttendanceData(data);
    });
  }
  updateAttendanceData(data) {
    if (data) {
      this.attendenceDetailsList.attendancePercentage = data.attendancePercentage;
      this.attendenceDetailsList.toatalMembers = data.toatalMembers;
      this.attendenceDetailsList.totalAbsent = data.totalAbsent;
      this.attendenceDetailsList.totalPresent = data.totalPresent;
    }
  }
  openCoverFolderTemplate() {
    this.fileUploadService
      .getCurrentDateAndId("Cover")
      .subscribe((res: any) => {
        this.router.navigate(["/dashboard/documents/cover",res.label], {
          state: { id: res.id }
        });
      });
  }

  navigateToLob() {
    this.router.navigate(["/dashboard/lob-view/view"]);
  }
  initializeAttendanceSocket() {
    this.attendance.initializeWebSocketConnection();
  }

  changeButtonLabel() {
    let buttonLabelText = '';
    if (this.pageNumber < this.totalPages) {
      buttonLabelText = 'livescreen.nextpage';
    }
    else if (this.pageNumber == this.totalPages && this.documentOwner) {
      buttonLabelText = 'livescreen.finish'
    }
    else if (this.nextDisable) {
      buttonLabelText = 'livescreen.finished'
    }
    return buttonLabelText;
  }
}
