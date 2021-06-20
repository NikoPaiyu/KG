import { Component, OnInit } from '@angular/core';
import { TablescommonService } from '../shared/services/tablescommon.service';
import { Router, ActivatedRoute } from "@angular/router";
import { NzNotificationService } from 'ng-zorro-antd';
import { FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import { FileServiceService } from '../shared/services/file-service.service';
@Component({
  selector: 'tables-seat-plan-list',
  templateUrl: './seat-plan-list.component.html',
  styleUrls: ['./seat-plan-list.component.css']
})
export class SeatPlanListComponent implements OnInit {
  listOfData: any = [];
  assemblyid;
  assemblyId = null;
  sessionId = null;
  name;
  description;
  assemblyList = [];
  sessionList = [];
  activeSession: any = [];
  validateForm: FormGroup;
  listOfDatas: any = [];
  isCreateVisible = false;
  id;
  tempListofData: any =[];
  search;
  assemblySession: any = null;
  constructor( private common: TablescommonService,
    private router: Router,
    private fb: FormBuilder,
    private tableFileService:FileServiceService,
    private route: ActivatedRoute,private notification: NzNotificationService) { }

  ngOnInit() {
    this.getAllSeats();
    this.getAssemblyList();
    this.formValidation();
  }
  formValidation(): void {
    this.validateForm = this.fb.group({
      assemblyid: [null, [Validators.required]],
      name: [null, [Validators.required]],
      description: [null, [Validators.required]]      
    });
  }
  getAllSeats() {
    this.common.getMappingList().subscribe(res => {
      this.listOfDatas = this.tempListofData = res;
    });
  }
  getIdvalue(id){
    this.id = id;
  }
  seatLayoutpage(){
    this.isCreateVisible = true;
  }
  getallocatonbyId(id) {
    this.common.getAllocationById(id).subscribe(res => {
      this.listOfData = res;
      this.router.navigate([
        "business-dashboard/tables/seat-layout", id
      ]);
    });
  }
  handleCancel(){
    this.isCreateVisible = false;
  }
  createseatAllocation(){
    const body = {
      assemblyId: this.validateForm.value.assemblyid.id,
      assemblyValue: this.validateForm.value.assemblyid.assemblyId,
      description: this.validateForm.value.description,
  fileId: 0,
  fileNumber: "string",
  mapping: [
    {
      member: {
        details: {
          departmentId: 0,
          designationId: 0,
          firstName: "string",
          fullName: "string",
          id: 0,
          keralaConstituencyId: 0,
          keralaConstituencyName: "string",
          keralaConstiturencyName: "string",
          keralaPolicticalPartyName: "string",
          keralaPolicticalPartyid: 0,
          lastName: "string",
          malayalamFullName: "string",
          memberGroup: "string",
          portfolioId: 0,
          profilePhoto: "string",
          sectionId: 0
        },
        roles: [
          {
            roleId: 0,
            roleName: "string"
          }
        ],
        userId: 0,
        userName: "string",
        userType: "string"
      },
      seat: {
        id: 0,
        seatNumber: "string"
      }
    }
  ],
  name: this.validateForm.value.name
    };
    this.common.createSeatAllocation(body).subscribe((Res: any) => {
      this.notification.success(
        "Success",
        "Seat Allocated Successfully"
      );
      this.router.navigate([
        "business-dashboard/tables/seat-layout", Res.id
      ]);
      // setTimeout(() => {
      //   this.router.navigate(["business-dashboard/tables/file-view",Res.fileResponse.fileId]);
      // }, 1500);
    });
    // this.getAllSeats();
    this.isCreateVisible = false;
  }
  getAssemblyList() {
    this.common.getAllAssemblyandSession().subscribe((Res: any) => {
      this.assemblyList = Res.assembly;
      this.assemblySession = Res.assemblySession;
      this.assemblyId = Res.activeAssemblySession.assemblyId;
      this.getSessionForAssembly();
      this.sessionId = Res.activeAssemblySession.sessionId;
      // this.ballotlistforSection();
    });
  }
  getSessionForAssembly() {
    this.sessionList = []; 
      if (this.assemblyId && this.assemblySession.find(x => x.id === this.assemblyId)) {
        this.sessionId = null;
        this.sessionList = this.assemblySession.find(x => x.id === this.assemblyId).session;
      }
  }
  searchSeat() {
    if (this.search) {
      this.listOfDatas = this.tempListofData.filter(
        (element) =>
          (element.assemblyValue && element.assemblyValue.toString().toLowerCase().includes(this.search.toLowerCase())) ||
          (element.name && element.name.toLowerCase().includes(this.search.toLowerCase())) ||
          (element.fileNumber && element.fileNumber.toLowerCase().includes(this.search.toLowerCase())) ||
          (element.description && element.description.toLowerCase().includes(this.search.toLowerCase())) ||
          (element.status && element.status.toLowerCase().includes(this.search.toLowerCase())) 
      );
    } else {
      this.listOfDatas = this.tempListofData;
    }
  }
}
