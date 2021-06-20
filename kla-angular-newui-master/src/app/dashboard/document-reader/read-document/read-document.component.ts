import {
  Component,
  OnInit,
  VERSION,
  ViewChild,
  ElementRef
} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { PDFDocumentProxy } from "pdfjs-dist";
import { BusinessControllerService } from "../../../business-dashboard/lob/shared/services/business-controller.service";
import { AuthService } from "src/app/auth/shared/services/auth.service";
import { UserData } from "src/app/auth/shared/models";
import { DocumentReaderApiService } from "../shared/services/document-reader-api.service";
import { CurrentBusinessService } from "../../current-business/shared/service/current-business.service";
@Component({
  selector: "app-read-document",
  templateUrl: "./read-document.component.html",
  styleUrls: ["./read-document.component.scss"]
})
export class ReadDocumentComponent implements OnInit {
  pdfSrc = "";
  fullScreenMode = false;
  percentDone: number;
  uploadSuccess: boolean;
  totalPages: number;
  page: number = 1;
  version = VERSION;
  public userData: UserData = new UserData();
  fileSpan: any;
  @ViewChild("fileUploadControl", { static: false })
  fileUploadControl: ElementRef;
  constructor(
    private http: HttpClient,
    private controllerservice: BusinessControllerService,
    private authService: AuthService,
    private currentbusinessService: CurrentBusinessService,
    private documentReaderApi: DocumentReaderApiService
  ) {}

  ngOnInit() {
    //this.startTimer();
    this.getCurrentUserDetails();
    this.getFileByRestApi();
  }

  onFileSelected(files: File[]) {
    this.page = 1;
    let $img: any = document.querySelector("#file");
    this.fileSpan = document.getElementById("filenamespan");
    this.fileSpan.innerHTML = $img.files[0].name;
    if (typeof FileReader !== "undefined") {
      let reader = new FileReader();
      reader.onload = (e: any) => {
        this.pdfSrc = e.target.result;
      };
      reader.readAsArrayBuffer($img.files[0]);
    }
    this.uploadAndProgress(files);
  }

  afterLoadComplete(pdf: PDFDocumentProxy): void {
    this.totalPages = pdf.numPages;
  }

  _pageChangeHandler(index) {
    this.documentReaderApi.pageChangeHandler(index).subscribe(res => {});
  }

  nextPage() {
    this._pageChangeHandler(this.page);
    this.page += 1;
  }

  previousPage() {
    this.page -= 1;
  }
  // startTimer() {
  //   setInterval(() => {
  //     this.fullScreenMode = true;
  //   }, 30000);
  // }
  addClass() {
    this.fullScreenMode = !this.fullScreenMode;
  }
  stopBudget() {
    this.controllerservice.currentBusinessStop().subscribe(res => {
      this.clearVariables();
    });
  }

  uploadAndProgress(files: File[]) {
    var formData = new FormData();
    let data = {
      businessCode: this.userData.authorities.includes("governor")
        ? "GOVERNORSPEECH"
        : "BUDGET",
      ownerName: this.userData.fullName,
      ownerImage: this.userData.photoUrl,
      ownerConstituencyName: "",
      ownerConstituencyId: 1,
      ownerId: this.userData.userId,
      businessName: this.userData.authorities.includes("governor")
        ? "Address by The Governor"
        : "Financial Business",
      businessNameMalayalam: this.userData.authorities.includes("governor")
        ? "ഗവർണറുടെ നയപ്രഖ്യാപനം"
        : "ബജറ്റ് അവതരണം"
    };
    formData.append("budgetOwner", JSON.stringify(data));

    Array.from(files).forEach(f => formData.append("budget", f));
    this.uploadBudget(formData);
  }

  uploadBudget(formData) {
    this.documentReaderApi.uploadBudget(formData).subscribe(event => {
      // if (event.type === HttpEventType.UploadProgress) {
      //   this.percentDone = Math.round((100 * event.loaded) / event.total);
      // } else if (event instanceof HttpResponse) {
      //   console.log(event);
      //   this.uploadSuccess = true;
      // }
    });
  }

  getCurrentUserDetails() {
    this.authService.currentUserSubject.subscribe(
      user => (this.userData = user)
    );
  }

  getFileByRestApi() {
    this.currentbusinessService.getStreamingFile().subscribe((res: any) => {
      if (
        res &&
        res.businessCode == "BUDGET" &&
        res.documentUrl &&
        res.ownerId &&
        this.userData.userId
      ) {
        this.pdfSrc = res.documentUrl;
        this.page = res.currentIndex ? res.currentIndex + 1 : 1;
      }
    });
  }
  clearVariables() {
    this.fileUploadControl.nativeElement.value = "";
    this.fullScreenMode = false;
    this.pdfSrc = "";
    this.fileSpan.innerHTML = "Choose a file...";
  }
}
