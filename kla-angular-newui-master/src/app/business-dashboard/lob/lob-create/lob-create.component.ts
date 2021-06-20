import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { LobService } from "../shared/services/lob.service";
import { NotificationCustomService } from "src/app/shared/services/notification.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NzModalService, NzModalRef } from "ng-zorro-antd";
import { CreateQuestionComponent } from "../create-question/create-question.component";
import { UserManagementService } from "../../user-management/shared/services/user-management.service";
import { CalenderofsittingService } from "../../calender-of-sitting/shared/services/calenderofsitting.service";
import { SpeakerNoteService } from "src/app/dashboard/shared/services/speaker-note.service";
import { AuthService } from 'src/app/auth/shared/services/auth.service';
import { userInfo } from 'os';
import { AgendaServiceService } from "../../agenda/shared/services/agenda-service.service";
@Component({
  selector: "app-lob-create",
  templateUrl: "./lob-create.component.html",
  styleUrls: ["./lob-create.component.scss"]
})
export class LobCreateComponent implements OnInit {
  isReordered = false;
  user;
  isVisibleAddBusinessType = false;
  validateForm: FormGroup;
  assembly: "";
  session: "";
  members = [];
  assemblies = [];
  sessions = [];
  listOfControl = [];
  routeData;
  businessList = [];
  saveButtonHide = false;
  public lob = {
    assembly: "",
    session: "",
    date: ""
  };
  obituary = {
    data : null,
    showModal : false
  }

  public selectedBusinessList = [];
  public addtoBusinessList = [];
  public panels;
  public currentBusinessId = "";
  public currentBusinessName = "";
  public descriptionMalayalam = "";

  constructor(
    public fb: FormBuilder,
    public router: Router,
    public lobservice: LobService,
    public notify: NotificationCustomService,
    public modalService: NzModalService,
    private userService: UserManagementService,
    private cosservice: CalenderofsittingService,
    private speakerNoteService: SpeakerNoteService,
    private authService: AuthService
  ) {
    this.setRouterData();
    this.user = this.authService.getCurrentUser();
  }

  ngOnInit() {
    this.setForm();
    this.getAssemblyList();
    this.getSessionList();
    this.getBusinessList();
    this.getAllMembers();
    this.subscribeToChildData();
    this.setDatasFromRoute();
    let polygenControl = document.getElementsByTagName("body")[0];
    polygenControl.classList.add("lobpop");
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
    if (this.lob.date) {
      if (this.currentBusinessId) this.getBusinessDatabyType();
    }
  }

  getAllMembers() {
    this.userService.getAllMembers().subscribe(res => {
      this.members = res;
    });
  }
  getBusinessList() {
    if (this.user)
      this.lobservice.getBusinessTypeListByRole(this.user.roleIds[0]).subscribe((res: any) => {
        if (res) {
          this.businessList = res;
          if (this.businessList.length > 0) {
            this.currentBusinessId = this.businessList[0].id;
            this.currentBusinessName = this.businessList[0].name;
            this.descriptionMalayalam = this.businessList[0].descriptionMalayalam;
          }

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
      this.descriptionMalayalam = business.descriptionMalayalam;
      this.panels = [];
      // this.addtoBusinessList = [];
      this.listOfControl = [];
      this.selectedBusinessList = [];
      // this.moveCurrentBusinessFirst();
    } else {
      this.notify.showWarning("Warning", "Select Date of LOB");
    }
  }
  removeBusinessLineItem(i: { id: number; controlInstance: string }): void {
    const index = this.listOfControl.indexOf(i);
    this.listOfControl.splice(index, 1);
  }

  addNewBusinessLineItem(control) {
    if (this.isReordered) {
      this.notify.showWarning(
        "Warning",
        "Save current order before adding new business."
      );
    } else {
      if (this.lob.date) {
        let datatoPass = {
          assemblyId: this.lob.assembly,
          sessionId: this.lob.session,
          date: this.lob.date,
          roleId: this.user.roleIds[0],
          businessId: this.currentBusinessId,
          businessName: this.currentBusinessName,
          businessNameMalayalam: this.descriptionMalayalam
        };
        this.modalService.create({
          nzTitle: this.currentBusinessName,
          nzContent: CreateQuestionComponent,
          nzClosable: true,
          nzFooter: null,
          nzMaskClosable: false,
          nzComponentParams: {
            item: datatoPass,
            members: this.members
          },
          nzWidth: 800
        });
      } else {
        this.notify.showWarning("Warning", "Select Date of LOB");
      }
    }
  }

  viewItem(control) {
    this.modalService.create({
      nzTitle: null,
      nzContent: CreateQuestionComponent,
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
  OnUpdateClick(data) { }

  getBusinessDatabyType() {
    if (
      this.lob.assembly &&
      this.lob.session &&
      this.lob.date &&
      this.currentBusinessId
    )
      this.lobservice
        .getBusinessListByRole(
          this.lob.assembly,
          this.lob.session,
          this.lob.date,
          this.user.roleIds[0]
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
        "Save current order before deleting any business."
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
      t += element && element.allotedTime ? element.allotedTime : 0;
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

  goToListLobPage() {
    this.router.navigate(["/business-dashboard/lob/listing"], {
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
          "Save current order before edit any business."
        );
      } else {
        let datatoPass = {
          assemblyId: this.lob.assembly,
          sessionId: this.lob.session,
          date: this.lob.date,
          roleId: this.user.roleIds[0],
          businessId: lobAgendaLine.businessId,
          businessName: lobAgendaLine.businessName,
          businessNameMalayalam: lobAgendaLine.businessNameMalayalam,
          sequenceNumber: lobAgendaLine.sequenceNumber
        };
        this.modalService.create({
          nzTitle: lobAgendaLine.businessName,
          nzContent: CreateQuestionComponent,
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
      this.notify.showWarning("Warning", "Select Date of LOB");
    }
  }

  updateLOBAgendaOrder() {
    this.lobservice
      .updatelobAgendaOrder(this.lob, this.addtoBusinessList, this.user.roleIds[0])
      .subscribe(res => {
        this.notify.showSuccess("Success", "LOB Order Updated.");
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
      this.lobservice.getBusinessTypeListByRole(this.user.roleIds[0]).subscribe((res: any) => {
        if (res) {
          this.businessList = res;
        }
      });
    });
  }

  setForm() {
    this.validateForm = this.fb.group({
      id: [0],
      type: ["LOB"],
      roleId: [this.user.roleIds[0]],
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
      type: 'LOB'
    };
    this.lobservice.generateSpeakerNote(body).subscribe(data => {
      this.getBusinessDatabyType();
      this.notify.showSuccess("Success", "Speaker note generated successfully");
    });
  }
  gotoRespondentView(docUrl,subBusinessName){
    if(subBusinessName == 'Obitury Addresses' && docUrl !== null){
      var obj = JSON.parse(docUrl);
      if(obj){
        this.obituary.data = obj;
        this.obituary.showModal = true;
      }
    }else{
      window.open(docUrl,'_blank');
    }
  }
}
