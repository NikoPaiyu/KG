import { Component, OnInit, ɵConsole } from "@angular/core";
import { formatDate } from "@angular/common";
import { AodService } from "../shared/service/aod.service";
import { NotificationCustomService } from "src/app/shared/services/notification.service";
import { differenceInCalendarDays } from "date-fns";
import { QuestionService } from "../../question/shared/question.service";
import { AuthService } from "src/app/auth/shared/services/auth.service";
import { ActivatedRoute } from '@angular/router';
import { CalenderofsittingService } from "../../calender-of-sitting/shared/services/calenderofsitting.service";

@Component({
  selector: "app-aod-create",
  templateUrl: "./aod-create.component.html",
  styleUrls: ["./aod-create.component.scss"],
})
export class AodCreateComponent implements OnInit {
  AodDatas: any = [];
  dateRange = [];
  ranges1 = { Today: [new Date(), new Date()], 'This Month': [new Date()] }
  ministerGroups;
  AodData;
  Aoddate;
  AodDataKeys = [];
  dateFormat = "dd / MM / yyyy";
  today = new Date();
  aodId;
  assemblySession: object = [];
  Alloteddates;
  userid;
  // fileId= 0;
  aodDetails = {
    allotmentId: null,
    aodDetail: [],
    assemblyId: null,
    fileId: null,
    fileStatus: null,
    sessionId: null,
    status: null,
    userId: null
  };
  constructor(
    private aodService: AodService,
    private notify: NotificationCustomService,
    private questionService: QuestionService,
    private auth: AuthService,
    private route: ActivatedRoute,
    private cos: CalenderofsittingService
  ) {

    this.userid = this.auth.getCurrentUser().userId;
    // const id = this.route.snapshot.params.id;
    // this.fileId = id;
    // const sessionid = this.route.snapshot.params.sessionId;
    // this.assemblySession["session"].currentsession = sessionid;
    // this.assemblySession["assembly"].currentassembly = assemblyid;
  }

  ngOnInit() {
    this.getAssemblySessionDetails();
  }
  
  getAssemblySessionDetails() {
    this.cos.getAssemblySessionDetails().subscribe(data => {
      this.assemblySession['assembly'] = data.assemblySession;
      this.assemblySession["assembly"].currentassembly = data.activeAssemblySession.assemblyId;
      this.filterAssembly();
      this.assemblySession["session"].currentSession = data.activeAssemblySession.sessionId;
      this.getAoDMinisterGroup();
      this.getAoDList();
    });
  }
  filterAssembly() {
    const assemblyDetail = this.assemblySession['assembly'].find(x => x.id == this.assemblySession["assembly"].currentassembly);
    if (assemblyDetail) {
      this.assemblySession['session'] = assemblyDetail.session;
    }
    this.assemblySession["session"].currentSession = null;
    this.ministerGroups = [];
  }
  // getdates() {

  //   this.aodService.getAllDates().subscribe((alldates) => {
  //     this.Alloteddates = alldates;
  //     console.log(this.Alloteddates);
  //   });
  // }
  getAoDMinisterGroup() {
    this.aodService.getAllMinisterGroups().subscribe((allMinisterGrp) => {
      this.ministerGroups = allMinisterGrp; 
      console.log(this.ministerGroups);

    });
  }
  getAoDList() {
    let counter = 0;
    const AoDMinisterGroupArr = [];
    this.aodService
      .getAODList(
        this.assemblySession["assembly"].currentassembly,
        this.assemblySession["session"].currentsession
      )
      .subscribe((AodList) => {
        AodList["klaAllotmentOfDays"].forEach(async (value) => {
          counter++;
          value.allottedDates.forEach(async (item) => {
            item.ministerGroupId = value.ministerGroup;
            item.ministerSubjects = this._filterObjByKey(
              AodList["klaGroupPortfolioDtos"],
              value.ministerGroup
            );
            item.date = item.date;
            AoDMinisterGroupArr.push(item);
            if (counter === AodList["klaAllotmentOfDays"].length) {
              AoDMinisterGroupArr.sort(function (a, b) {
                let dateA: any = [];
                let dateB: any = [];
                (dateA = new Date(a.date)), (dateB = new Date(b.date));
                return dateA - dateB;
              });
              this.AodData = this.groupByMinisterGoup(
                AoDMinisterGroupArr,
                "ministerGroupId"
              );
              this.AodDataKeys = Object.keys(this.AodData);
              console.log(this.AodData)
            }
          });
        });
      });
  }
  calenderOnChange(result: Date): void {
    if (result) {

      const CurrentDate = formatDate(result, "yyyy-MM-dd", "en-US", "+0530");
      const found = this.dateRange.some((dates) => dates.date === CurrentDate);
      !found ? this.dateRange.push({ date: CurrentDate }) : "";
    }
  }
  onSplice(index) {
    this.dateRange.splice(index, 1);
    if (this.dateRange.length == 0) {
      this.Aoddate = null;
    } else {
      this.Aoddate = this.dateRange[this.dateRange.length - 1].date;
    }
  }
  selectGroup(groupId, index) {
    // tslint:disable-next-line: only-arrow-functions
    this.ministerGroups.map(function (obj) {
      obj.selectedGrpId = "";
    });
    if (Array.isArray(this.ministerGroups)) {
      this.ministerGroups.forEach(async (values) => {
        if (groupId === values.groupId) {
          this.ministerGroups[index].selectedGrpId = groupId;
        }
      });
    }
  }
  clearVariables() {
    this.dateRange = [];
    this.ministerGroups.filter(function (item) {
      return (item.selectedGrpId = "");
    });
    this.dateFormat = null;
  }
  saveAod() {
    if (this._validate()) {
      this.aodService.postAod(this._buildAodData()).subscribe((Res) => {
        this.getAoDList();
        this.clearVariables();
        this.notify.showSuccess("Success", "");
      });
    }
  }
  submit() {

    let data = {
      assemblyId: this.assemblySession["assembly"].currentassembly,
      sessionId: this.assemblySession["session"].currentsession,
      fileForm: {
        assemblyId: 14,
        sessionId: 19,
        type: "AOD",
        userId: this.userid,
        currentNumber: 0,
        sectionId: 1,
        subject: "Allotment of days",
        description: "Allotment of days",
        subtype: "AOD",
        workflowEngineCode: "Allotmentofdays",
        priority: "NORMAL"
      }

    };

    this.aodService
      .createfileflow(
        data
      )
      .subscribe((res: any) => {
        // if (res = !"") {
        this.AodData = res;
        //   console.log(this.cosDetailsList)
        //   this.clearVariables();
        this.notify.showSuccess("Success", "SuccessfullyAdded");
        // } else {
        //   this.notify.showError("Error", "Something Went Wrong...");
        // }
      });
  }
  disabledDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, this.today) > 0;
  };
  _filterObjByKey(object, value) {
    // tslint:disable-next-line: prefer-const
    for (var prop in object) {
      if (object.hasOwnProperty(prop)) {
        if (object[prop].groupId === value) {
          return object[prop].portfolioMockNames;
        }
      }
    }
  }
  _validate() {
    if (
      this.ministerGroups.filter((vendor) => vendor.selectedGrpId).length === 0
    ) {
      this.notify.showWarning("Warning", "Please Select Minister Group");
      return false;
    } else if (this.dateRange.length === 0) {
      this.notify.showWarning("Warning", "Please Select a Date");
      return false;
    }
    return true;
  }
  _buildAodData() {
    const selectedGrp = this.ministerGroups.filter(
      (vendor) => vendor.selectedGrpId
    )[0];
    return {
      id: this.aodId ? this.aodId : null,
      assemblyId: this.assemblySession["assembly"].currentassembly,
      sessionId: this.assemblySession["session"].currentsession,
      allottedDates: this.dateRange,
      ministerGroup: selectedGrp.groupId,
    };
  }
  groupByMinisterGoup(OurArray, property) {
    return OurArray.reduce(function (accumulator, object) {
      const key = object[property];
      if (!accumulator[key]) {
        accumulator[key] = [];
      }
      accumulator[key].push(object);
      return accumulator;
    }, {});
  }

  editAOD(edit) {
    const index = this.ministerGroups.findIndex(
      (x) => x.groupId === edit.ministerGroupId
    );
    this.ministerGroups[index].selectedGrpId = edit.ministerGroupId;
    this.Aoddate = edit.date;
    this.dateRange.push({ date: edit.date });
    this.aodId = edit.id;
  }
  deleteAod(e) { }
  isMLA() {
    return this.auth.getCurrentUser().authorities.includes("MLA");
  }
  // getFileByFileId(id) {
  //   this.aodService.getAodListFile(id).subscribe(Response => {
  //     this.AodDatas = Response;
  //     console.log(this.AodData);

  //     // this.aodDetails  = this.AodData.allotmentOfDays;
  //   });
  // }
}
