import { DatePipe } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { NzNotificationService } from "ng-zorro-antd";
import { TablescommonService } from "../../shared/services/tablescommon.service";
import { SwearingInService } from "../shared/services/swearing-in.service";

@Component({
  selector: "tables-swearing-in-list",
  templateUrl: "./swearing-in-list.component.html",
  styleUrls: ["./swearing-in-list.component.scss"],
})
export class SwearingInListComponent implements OnInit {
  search: any = null;
  swearingInList: any = [];
  electionId: any = null;
  swornInModal = false;
  markSwornInForm: FormGroup;
  oathList = [
    { name: "In the name of God", code: "IN_THE_NAME_OF_GOD", nameMl: 'ദൈവത്തിന്റെ നാമത്തിൽ' },
    { name: "In the name of Allah", code: "IN_THE_NAME_OF_ALLAH", nameMl: 'അല്ലാഹുവിന്റെ നാമത്തിൽ' },
    { name: "Solemnly Affirm", code: "SOLEMNLY_AFFIRM", nameMl: 'സഗൗരവും പ്രതിജ്ഞ' },
  ];
  swornData: any = null;
  formData = {
    constituenyId: null,
    electionId: null,
    formOfOath: null,
    swornInDate: null,
    userId: null,
    purpose: null,
  };
  fullData: any = null;
  tempSwearingList: any = null;
  lobDates: any = null;
  disabledDates: any = null;
  oathModal = false;
  oathUrl: any = null;
  user: any = null;
  permission = {
    submitOath: false,
    addToLOB: false,
    markSwornIn: false,
    markSwearingCompleted: false,
  };
  swornReportModel: any = false;
  swornReportData: any = "";
  finalPrintUrl;
  previewHtml = null;
  constructor(
    private service: SwearingInService,
    private route: ActivatedRoute,
    private notification: NzNotificationService,
    private common: TablescommonService,
    @Inject("authService") private AuthService,
    private datepipe: DatePipe,
    public translate: TranslateService
  ) {
    this.electionId = this.route.snapshot.params.id;
    this.user = AuthService.getCurrentUser();
    this.common.setTablePermissions(this.user.rbsPermissions);
  }

  ngOnInit() {
    this.getRbsPermissionsinList();
    if (this.electionId) {
      this.getSwearingInList();
    }
  }

  getSwearingInList() {
    this.service.getSwearingInList(this.electionId).subscribe((res: any) => {
      this.fullData = res;
      this.swearingInList = this.tempSwearingList = res.swearingDetails;
    });
  }

  searchList() {
    if (this.search) {
      this.swearingInList = this.tempSwearingList.filter(
        (x) =>
          (x.firstName &&
            x.firstName.toLowerCase().includes(this.search.toLowerCase())) ||
          (x.user.details.lastName &&
            x.user.details.lastName
              .toLowerCase()
              .includes(this.search.toLowerCase())) ||
          (x.user.details.fullName &&
            x.user.details.fullName
              .toLowerCase()
              .includes(this.search.toLowerCase())) ||
          (x.constituencyName &&
            x.constituencyName
              .toLowerCase()
              .includes(this.search.toLowerCase())) ||
          (x.partyName &&
            x.partyName.toLowerCase().includes(this.search.toLowerCase()))
      );
    } else {
      this.swearingInList = this.tempSwearingList;
    }
  }

  markAsSwornIn(data) {
    const body = {
      constituenyId: data.constituencyId,
      electionId: this.electionId,
      userId: data.user.userId,
    };
    this.service.markAsSwornIn(body).subscribe((res: any) => {
      this.notification.success("Success", "Marked As Sworn In Successfully!");
      this.getSwearingInList();
    });
  }

  showSwornInModal(data, purpose) {
    this.formData.purpose = purpose;
    if (purpose === "Add To LOB") {
      this.getCurrentAssemblyAndSession();
    } else {
      this.swornInModal = true;
    }
    this.swornData = data;
  }

  cancelSwornInModal() {
    this.swornInModal = false;
    this.swornData = null;
    this.formData = {
      constituenyId: null,
      electionId: null,
      formOfOath: null,
      swornInDate: null,
      userId: null,
      purpose: null,
    };
  }

  submitOathForm() {
    const body = {
      constituenyId: this.swornData.constituencyId,
      electionId: this.electionId,
      userId: this.swornData.user.userId,
      formOfOath: this.formData.formOfOath,
    };
    this.service.submitOathForm(body).subscribe((res: any) => {
      this.notification.success("Success", "Oath Form Submitted Successfully!");
      this.getSwearingInList();
      this.cancelSwornInModal();
    });
  }

  addToLob() {
    const body = {
      constituenyId: this.swornData.constituencyId,
      electionId: this.electionId,
      userId: this.swornData.user.userId,
      swornInDate: this.datepipe.transform(this.formData.swornInDate, 'yyyy-MM-dd')
    };
    this.service.addToLOB(body).subscribe((res: any) => {
      this.notification.success("Success", "Added to LOB Successfully!");
      this.getSwearingInList();
      this.cancelSwornInModal();
    });
  }

  swornInCompleted() {
    const temp = this.swearingInList.filter((x) => x.status !== "SWORN_IN");
    if (temp.length === 0 && this.swearingInList.length > 0) {
      const body = {
        electionId: this.electionId,
      };
      this.service.swearingInCompleted(body).subscribe((res: any) => {
        this.notification.success("Success", "Success!");
        this.getSwearingInList();
      });
    } else {
      this.notification.warning("Warning", "All users are not sworn in!");
    }
  }

  getCurrentAssemblyAndSession() {
    this.common.getCurrentAssemblyAndSession().subscribe((res: any) => {
      this.common
        .getDates(res.assemblyId, res.sessionId)
        .subscribe((response: any) => {
          this.lobDates = response;
          this.swornInModal = true;
          this.disabledDates = (current: Date): boolean => {
            const todayDate =
              current.getFullYear() +
              "-" +
              ("0" + (current.getMonth() + 1)).slice(-2) +
              "-" +
              ("0" + current.getDate()).slice(-2);
            return !this.lobDates.find((item) => item === todayDate);
          };
        });
    });
  }
  showOath(formId) {
    this.oathUrl = null;
    const mediaType = 'application/pdf';
    this.service.getPreviewById(formId).subscribe((res: any) => {
      this.previewHtml = res;
      this.getPDF();
    });
  }
  getPDF() {
    if (this.previewHtml) {
      const body = {
          htmlString: this.previewHtml
      };
      const mediaType = 'application/pdf';
      this.service.downloadReport(body).subscribe((response) => {
        if (response) {
          const blob = new Blob([response], { type: mediaType });
          this.oathUrl = URL.createObjectURL(blob);
          if (this.oathUrl) {
           this.oathModal = true;
          }
        } else {
          this.notification.warning('Warning', 'PDF not avilable!');
        }
      });
    }
  }
  cancelOathModal() {
    this.oathModal = false;
  }
  showSwornModel() {
    this.service.swornReport(this.electionId).subscribe((res: any) => {
      this.common.downloadReport(res).subscribe((response: any) => {
        if (response) {
          var blob = new Blob([response], { type: "application/pdf" });

          this.finalPrintUrl = URL.createObjectURL(blob);

          this.swornReportModel = true;
        } else {
          this.notification.info("Info", "PDF not avilable!");
        }
      });
    });
  }
  cancelSwornModel() {
    this.finalPrintUrl = null;
    this.swornReportModel = false;
  }
  getRbsPermissionsinList() {
    if (this.common.doIHaveAnAccess("SUBMIT_OATH", "READ")) {
      this.permission.submitOath = true;
    }
    if (this.common.doIHaveAnAccess("ADD_TO_LOB", "READ")) {
      this.permission.addToLOB = true;
    }
    if (this.common.doIHaveAnAccess("MARK_SWORN_IN", "READ")) {
      this.permission.markSwornIn = true;
    }
    if (this.common.doIHaveAnAccess("MARK_SWEARING_IN_COMPLETED", "READ")) {
      this.permission.markSwearingCompleted = true;
    }
  }
}
