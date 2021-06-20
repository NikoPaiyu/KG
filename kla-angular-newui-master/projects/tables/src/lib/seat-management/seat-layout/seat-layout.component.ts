import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Inject,
  Input,
} from "@angular/core";
import { SeatService } from "../shared/services/seat.service";
import { ActivatedRoute, Router } from "@angular/router";
import { TablescommonService } from "../../shared/services/tablescommon.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NzNotificationService } from "ng-zorro-antd";
import { forkJoin } from "rxjs";
import { FileServiceService } from "../../shared/services/file-service.service";

// import { NotificationCustomService } from "src/app/shared/services/notification.service";
@Component({
  selector: "tables-seat-layout",
  templateUrl: "./seat-layout.component.html",
  styleUrls: ["./seat-layout.component.scss"],
})
export class SeatLayoutComponent implements OnInit {
  @Output() closePopup = new EventEmitter<any>();
  @Input() params_allocationId: any;
  @Input() params_allocationIdLIST: any;
  fgObituary: FormGroup;
  fileId = null;
  radioValue = null;
  searchPending: any;
  fileForPortfolio: any = [];
  filePopup = false;
  userId = 0;
  result;
  allocationId;
  viewseat;
  listOfData: any = [];
  viewSeatlayout = false;
  dropdownHideShow = false;
  savetexthideshow;
  file = {
    subject: "",
    priority: null,
    description: "",
  };
  user: any;
  assemblySessionObj = {
    assembly: [],
    session: [],
    currentAssembly: "",
    currentSession: "",
    currentAssemblyLbl: "",
  };
  attachButton;
  memberView;
  memberValues: any = [];
  public popoverTitle: string = "Remove Confirmation";
  public popoverMessage: string = "Are You Sure?";
  public selectedUser;
  public selectedSeatNumber = "";
  public memberDetails;
  public selectedSeat;
  public seatMappingList;

  constructor(
    @Inject("authService") private AuthService,
    private seatService: SeatService,
    private route: ActivatedRoute,
    private common: TablescommonService,
    private fb: FormBuilder,
    private router: Router,
    private notification: NzNotificationService,
    private tableFileService: FileServiceService
  ) //  private notify: NotificationCustomService
  {
    this.user = AuthService.getCurrentUser();
    this.viewseat = this.route.snapshot.params.purpose;
  }

  ngOnInit() {
    if (this.params_allocationId > 0) {
      this.allocationId = this.params_allocationId;
    } else if (this.params_allocationIdLIST > 0) {
      this.allocationId = this.params_allocationIdLIST;
    } else {
      this.allocationId = this.route.snapshot.params.id;
    }
    this.getAllSeats();
    this.getAllMembers();
    // this.getAllSeats();
    this.initForm();
    this.getAssemblySession();
    // this.getFileId();
  }
  initForm() {
    this.fgObituary = this.fb.group({
      gists: [[]],
      documents: [[]],
      note: [""],
      fileId: [0],
      fileNumber: [""],
      fileSubject: [""],
      id: 0,
      isDecicated: [true],
      sessionDate: [null, Validators.required],
      sessionTime: [null],
    });
  }
  getAssemblySession() {
    forkJoin(
      this.common.getAllAssembly(),
      this.common.getAllSession()
    ).subscribe(([assembly, session]) => {
      this.assemblySessionObj.assembly = assembly as Array<any>;
      const res = this.assemblySessionObj.assembly.map((x) => x.id);
      this.assemblySessionObj.currentAssembly = Math.max.apply(null, res);
      const labels = this.assemblySessionObj.assembly.map((x) => x.assemblyId);
      this.assemblySessionObj.currentAssemblyLbl = Math.max.apply(null, labels);
      this.assemblySessionObj.session = session as Array<any>;
      const response = this.assemblySessionObj.session.map((x) => x.id);
      this.assemblySessionObj.currentSession = Math.max.apply(null, response);
    });
  }
  // getAllMembers() {
  //   this.seatService.getAllUnSeatedMembers().subscribe(res => {
  //     this.memberDetails = res;
  //   });
  // }
  getAllMembers() {
    this.seatService.getUnseatedMembers(this.allocationId).subscribe((res) => {
      this.memberDetails = res;
    });
  }
  getAllSeats() {
    // this.seatService.getAllocationById(this.allocationId).subscribe(res => {
    this.seatService.getAllocationById(this.allocationId).subscribe((res) => {
      this.result = res;
      this.seatMappingList = this.result.mapping;
      this.seatMappingList.forEach((map) => {
        let polygenControl = document.getElementById(map.seat.seatNumber);
        if (map.member) {
          switch (map.member.details.memberGroup) {
            case "RULING_PARTY":
              polygenControl.classList.add("st11");
              break;
            case "OPOSITION_PARTY":
              polygenControl.classList.add("st12");
              break;
            case "TREASURY_BENCH":
              polygenControl.classList.add("st13");
              break;
            default:
              polygenControl.classList.add("st0");
              break;
          }
        }
      });
    });
  }

  selectSeat(event) {
    let filterObject = this.seatMappingList.find(
      (element) =>
        element.seat.seatNumber == event.target.attributes.id.nodeValue
    );
    this.selectedSeatNumber = event.target.attributes.id.nodeValue;
    if (filterObject) {
      this.dropdownHideShow = false;
      this.savetexthideshow = false;
      this.selectedSeat = filterObject;
    } else {
      this.dropdownHideShow = true;
      this.savetexthideshow = true;
      this.clearSelectedSeats();
    }
  }

  saveSeatmapping(allocationId, seatNumber, memberID) {
    if (seatNumber == undefined || seatNumber == "") {
      this.notification.warning("Info", "Please Select Seat..");
    } else {
      if (memberID > 0) {
        this.seatService
          .updateSeatMapping(allocationId, seatNumber, memberID)
          .subscribe((res) => {
            this.getAllSeats();
            this.getAllMembers();
            this.clearSelectedSeats();
            this.selectedSeatNumber = "";
           this.notification.success("Success", "Successfully Inserted..");
          });
      } else {
         this.notification.warning("Info", "Please Select Member..");
      }
    }
  }

  dropdownOnChange(selectedUserId) {
    let users = this.memberDetails.find(
      (filter) => filter.userId == selectedUserId
    );
    this.dropdownHideShow = true;
    this.savetexthideshow = true;
    if (selectedUserId > 0) {
      this.mapMambers(users);
    } else {
      this.clearSelectedSeats();
    }
  }

  removeSeat(allocationId, SeatID, memberG) {
    this.seatService.removeSeat(allocationId, SeatID).subscribe((res: any) => {
      this.seatMappingList = res;
      this.savetexthideshow = true;
      this.getAllMembers();
      this.notification.success("Success", "Seat Removed Successfully");
      this.getAllSeats();
      this.memberView = false;
    });
    // this.seatMappingList.filter(element => element.seat.seatNumber != SeatID);
    let polygenControl = document.getElementById(SeatID);
    if (memberG) {
      switch (memberG) {
        case "RULING_PARTY":
          polygenControl.classList.remove("st11");
          break;
        case "OPOSITION_PARTY":
          polygenControl.classList.remove("st12");
          break;
        case "TREASURY_BENCH":
          polygenControl.classList.remove("st13");
          break;
        default:
          polygenControl.classList.remove("st0");
          break;
      }
    }
    //polygenControl.classList.remove("st12");
    this.dropdownHideShow = true;
    this.clearSelectedSeats();
  }
  mapMambers(users) {
    this.selectedSeat = {
      member: {
        userId: users.userId,
        userName: "",
        details: {
          firstName: users.details.firstName,
          lastName: "",
          fullName: users.details.fullName,
          malayalamFullName: users.details.malayalamFullName,
          profilePhoto: users.details.profilePhoto,
          keralaConstiturencyName: users.details.keralaConstiturencyName,
          keralaPolicticalPartyName: users.details.keralaPolicticalPartyName,
          memberGroup: users.details.memberGroup,
        },
      },
    };
  }
  clearSelectedSeats() {
    this.userId = 0;
    this.selectedSeat = {
      member: {
        userId: 0,
        userName: "",
        details: {
          firstName: "",
          fullName: "",
          malayalamFullName: "",
          lastName: "",
          profilePhoto: "",
          keralaPolicticalPartyName: "",
          keralaConstiturencyName: "",
          memberGroup: "",
        },
      },
    };
  }
  onCancelFilePopup() {
    this.filePopup = false;
    this.viewSeatlayout = false;
  }
  attachToFile() {
    if (this.result.fileNumber !== null) {
      this.attachButton = true;
      this.filePopup = true;
    } else {
      this.attachButton = false;
      this.filePopup = true;
    }
  }
  handlePreviewCancel() {
    this.filePopup = false;
  }
  createFile() {
    const body = {
      seatAllocationId: this.allocationId,
      fileForm: {
        assemblyId: this.result.assemblyId,
        sessionId: 0,
        currentNumber: null,
        description: this.file.description,
        status: "saved",
        subject: this.file.subject,
        activeSubTypes: ["TABLE_SEAT_ALLOCATION"],
        subtype: "TABLE_SEAT_ALLOCATION",
        subTypes: ["TABLE_SEAT_ALLOCATION"],
        type: "TABLE",
        userId: this.user.userId,
        priority: this.file.priority,
        activesubtype: "TABLE_SEAT_ALLOCATION",
      },
    };
    this.tableFileService.createFile(body).subscribe((Res: any) => {
      this.notification.success(
        "Success",
        "File Created with file number :" + Res.fileResponse.fileNumber
      );
      this.closePopup.emit();
      this.file = {
        subject: "",
        priority: null,
        description: "",
      };
      setTimeout(() => {
        this.router.navigate([
          "business-dashboard/tables/file-view",
          Res.fileResponse.fileId,
        ]);
      }, 1500);
    });
  }
  viewFile() {
    this.router.navigate([
      "business-dashboard/tables/file-view",
      this.result.fileId,
    ]);
  }
  getFileId() {
    this.common.getMappingList().subscribe((res) => {
      const listOfDatas: any = res;
      this.fileId = listOfDatas.find(
        (x) => x.assemblyId == this.result.assemblyId && x.fileId != null
      ).fileId;
      this.filePopup = true;
    });
  }
  resubmitFile() {
    const body = {
      seatAllocationId: this.allocationId,
      fileForm: {
        assemblyId: this.result.assemblyId,
        sessionId: 0,
        fileId: this.result.fileId,
        activeSubTypes: ["TABLE_SEAT_ALLOCATION"],
        type: "TABLE",
        userId: this.user.userId,
      },
    };
    this.tableFileService.reSubmitFile(body).subscribe((Res: any) => {
      this.notification.success("Success", "File Resubmitted Successfully");
      this.router.navigate([
        "business-dashboard/tables/file-view",
        this.fileId,
      ]);
    });
  }
  viewFilePopUp() {
    this.viewSeatlayout = true;
  }
  showDetails(members) {
    // this.divisionList();
    this.memberView = true;
    this.memberValues = members;
  }
  divisionList() {
    // this.showDetails(members);
    this.memberView = true;
  }
}
