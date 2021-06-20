import { Component, OnInit } from "@angular/core";
import { NzModalService } from "ng-zorro-antd";
import { NotificationCustomService } from "../../../shared/services/notification.service";
import { AgendaServiceService } from "../shared/services/agenda-service.service";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UserManagementService } from "../../user-management/shared/services/user-management.service";
import { CreateItemComponent } from "../create-item/create-item.component";
import { CalenderofsittingService } from "../../calender-of-sitting/shared/services/calenderofsitting.service";
import { SpeakerNoteService } from "src/app/dashboard/shared/services/speaker-note.service";

@Component({
  selector: "app-agenda-create",
  templateUrl: "./agenda-create.component.html",
  styleUrls: ["./agenda-create.component.scss"]
})
export class AgendaCreateComponent implements OnInit {
  isReordered = false;
  isVisibleAddBusinessType = false;
  validateForm: FormGroup;
  members = [];
  listOfControl = [];
  assemblies = [];
  sessions = [];
  routeData;
  businessList = [];
  saveButtonHide = false;
  public lob = {
    assembly: "",
    session: "",
    date: ""
  };

  public selectedBusinessList = [];
  public addtoBusinessList = [];
  public panels;
  public currentBusinessId = "";
  public currentBusinessName = "";
  public currentBusinessNameMalayalam = "";

  constructor(
    public fb: FormBuilder,
    public router: Router,
    public lobservice: AgendaServiceService,
    public notify: NotificationCustomService,
    public modalService: NzModalService,
    private userService: UserManagementService,
    private cosservice: CalenderofsittingService,
    private speakerNoteService: SpeakerNoteService
  ) {
    this.setRouterData();
  }

  ngOnInit() {
    this.setForm();
    this.getBusinessList();
    this.getAssemblyList();
    this.getSessionList();
    this.getAllMembers();
    this.subscribeToChildData();
    this.setDatasFromRoute();
    let polygenControl = document.getElementsByTagName("body")[0];
    polygenControl.classList.add("agendapop");
  }

  setRouterData() {
    if (
      this.router.getCurrentNavigation() &&
      this.router.getCurrentNavigation().extras &&
      this.router.getCurrentNavigation().extras.state
    )
      this.routeData = this.router.getCurrentNavigation().extras.state.data;
  }
  getAssemblyList() {
    this.cosservice.getAllAssembly().subscribe((res: any) => {
      this.assemblies = res;
    });
  }
  getSessionList() {
    this.cosservice.getAllSession().subscribe((res: any) => {
      this.sessions = res;
    });
  }
  setDatasFromRoute() {
    if (this.routeData) {
      this.lob.assembly = this.routeData.assembly;
      this.lob.session = this.routeData.session;
      if (this.routeData.date) {
        this.lob.date = this.routeData.date;
        this.onLobDateChange();
      }
    }
  }

  onLobDateChange() {
    this.listOfControl = [];
    if (this.lob.date) if (this.currentBusinessId) this.getBusinessDatabyType();
  }

  getAllMembers() {
    this.userService.getAllMembers().subscribe(res => {
      this.members = res;
    });
  }
  getBusinessList() {
    this.lobservice.getBusinessTypeList().subscribe((res: any) => {
      if (res) {
        this.businessList = res;
        this.currentBusinessId = this.businessList[0].id;
        this.currentBusinessName = this.businessList[0].name;
        this.currentBusinessNameMalayalam = this.businessList[0].descriptionMalayalam;
        if (this.lob.date) {
          this.onLobDateChange();
        }
      } else {
        this.businessList = [];
      }
    });
  }
  getCurrentBusinessDetails(business) {
    if (this.lob.date) {
      this.currentBusinessId = business.id;
      this.currentBusinessName = business.name;
      this.currentBusinessNameMalayalam = business.descriptionMalayalam;
      this.panels = [];
      // this.addtoBusinessList = [];
      this.listOfControl = [];
      this.selectedBusinessList = [];
      // this.moveCurrentBusinessFirst();
      // this.getBusinessDatabyType();
    } else {
      this.notify.showWarning("Warning", "Select Date of LOB");
    }
  }
  removeBusinessLineItem(i: { id: number; controlInstance: string }): void {
    const index = this.listOfControl.indexOf(i);
    this.listOfControl.splice(index, 1);
  }

  addNewBusinessLineItem(control) {
    if (this.lob.date) {
      if (this.isReordered) {
        this.notify.showWarning(
          "Warning",
          "Save current order before adding new agenda."
        );
      } else {
        let datatoPass = {
          assemblyId: this.lob.assembly,
          sessionId: this.lob.session,
          date: this.lob.date,
          businessId: this.currentBusinessId,
          businessName: this.currentBusinessName,
          businessNameMalayalam: this.currentBusinessNameMalayalam
        };
        this.modalService.create({
          nzTitle: this.currentBusinessName,
          nzContent: CreateItemComponent,
          nzClosable: true,
          nzFooter: null,
          nzMaskClosable: false,
          nzComponentParams: {
            item: datatoPass,
            members: this.members
          }
        });
      }
    } else {
      this.notify.showWarning("Warning", "Select Date of Agenda.");
    }
  }

  viewItem(control) {
    this.modalService.create({
      nzTitle: null,
      nzContent: CreateItemComponent,
      nzClosable: true,
      nzFooter: null,
      nzMaskClosable: false,
      nzComponentParams: {
        item: control
      }
    });
  }
  subscribeToChildData() {
    this.lobservice.addItemData.subscribe(data => {
      if (data) {
        this.notify.clearAll();
        this.notify.showSuccess("Success", "Saved.");
        this.addtoBusinessList = data;
        // this.moveCurrentBusinessFirst();
        this.modalService.closeAll();
      }
    });
  }
  OnUpdateClick(data) {}

  getBusinessDatabyType() {
    if (
      this.lob.assembly &&
      this.lob.session &&
      this.lob.date &&
      this.currentBusinessId
    )
      this.lobservice
        .getBusinessList(
          this.lob.assembly,
          this.lob.session,
          this.lob.date,
          this.currentBusinessId
        )
        .subscribe((res: any) => {
          if (res != "") {
            this.addtoBusinessList = res;
            // this.moveCurrentBusinessFirst();
          } else {
            this.addtoBusinessList = [];
          }
        });
  }

  deleteBusinessLineItem(businessLineItemId) {
    if (this.isReordered) {
      this.notify.showWarning(
        "Warning",
        "Save current order before deleting any agenda."
      );
    } else {
      this.lobservice
        .deleteBusinessLIneItem(businessLineItemId)
        .subscribe((res: any) => {
          this.onLobDateChange();
          this.listOfControl = this.listOfControl.filter(
            element => element.id != businessLineItemId
          );
          this.notify.showSuccess("Success", "Deleted.");
        });
    }
  }

  calculateTotalTime(businessLines) {
    let t = 0;
    businessLines.forEach(element => {
      t += element.allotedTime;
    });
    return t;
  }

  deleteAllByBusinesId() {
    return this.lobservice
      .deleteAllByBusinessId(
        this.lob.assembly,
        this.lob.session,
        this.lob.date,
        this.currentBusinessId
      )
      .subscribe(res => {
        this.notify.showSuccess("Success", "Deleted.");
      });
  }
  //back button

  goToListDetailedAgendaPage() {
    this.router.navigate(["/business-dashboard/agenda/listing"], {
      state: {
        data: { assembly: this.lob.assembly, session: this.lob.session }
      }
    });
  }

  onViewSpeakerNote(url) {
    this.speakerNoteService.displayModal(url);
  }

  moveCurrentBusinessFirst() {
    let index = this.addtoBusinessList
      ? this.addtoBusinessList.findIndex(
          element => element.businessId == this.currentBusinessId
        )
      : null;
    let business = this.addtoBusinessList;
    if (index && index > 0) {
      let member = business.splice(index, 1);
      business.splice(0, 0, member[0]);
      this.addtoBusinessList = business;
    }
  }

  onEditLOBItem(lobAgendaLine) {
    if (this.lob.date) {
      if (this.isReordered) {
        this.notify.showWarning(
          "Warning",
          "Save current order before edit any agenda."
        );
      } else {
        let datatoPass = {
          assemblyId: this.lob.assembly,
          sessionId: this.lob.session,
          date: this.lob.date,
          businessId: lobAgendaLine.businessId,
          businessName: lobAgendaLine.businessName,
          businessNameMalayalam: lobAgendaLine.businessNameMalayalam,
          sequenceNumber: lobAgendaLine.sequenceNumber
        };
        this.modalService.create({
          nzTitle: lobAgendaLine.businessName,
          nzContent: CreateItemComponent,
          nzClosable: true,
          nzFooter: null,
          nzMaskClosable: false,
          nzComponentParams: {
            item: datatoPass,
            members: this.members,
            lobAgendaLine: lobAgendaLine
          }
        });
      }
    } else {
      this.notify.showWarning("Warning", "Select Date of Agenda");
    }
  }

  updateLOBAgendaOrder() {
    this.lobservice
      .updatelobAgendaOrder(this.lob, this.addtoBusinessList)
      .subscribe(res => {
        this.notify.showSuccess("Success", "Agenda Order Updated.");
        this.isReordered = false;
        this.onLobDateChange();
      });
  }

  listSorted($event) {
    this.isReordered = true;
  }

  addNewBusinessType() {
    this.isVisibleAddBusinessType = true;
  }

  handleCancel() {
    this.validateForm.reset();
    this.setForm();
    this.isVisibleAddBusinessType = false;
  }
  handleOk(value: any) {
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
    }
    this.lobservice.saveBusinessType(value).subscribe(res => {
      this.handleCancel();
      this.notify.showSuccess("Success", "Saved.");
      this.lobservice.getBusinessTypeList().subscribe((res: any) => {
        if (res) {
          this.businessList = res;
        }
      });
    });
  }

  setForm() {
    this.validateForm = this.fb.group({
      type: ["AGENDA"],
      name: ["", [Validators.required]],
      descriptionMalayalam: ["", [Validators.required]]
    });
  }
  generateSpeakerNote(businessId) {
    const body = {
      businessId,
      sessionId: this.lob.session, 
      assemblyId: this.lob.assembly,
      date: this.lob.date,
      type: 'AGENDA'
    };
    this.lobservice.generateSpeakerNote(body).subscribe(data => {
      this.getBusinessDatabyType();
      this.notify.showSuccess("Success", "Speaker note generated successfully");
    });
  }
}
