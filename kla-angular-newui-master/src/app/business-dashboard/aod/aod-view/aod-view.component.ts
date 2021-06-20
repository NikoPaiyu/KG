import { Component, OnInit } from '@angular/core';
import { AodService } from '../shared/service/aod.service';
import { QuestionMenus } from '../../question/question.menus';
import { QuestionService } from '../../question/shared/question.service';
import { AuthService } from 'src/app/auth/shared/services/auth.service';
import { NotificationCustomService } from 'src/app/shared/services/notification.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CalenderofsittingService } from '../../calender-of-sitting/shared/services/calenderofsitting.service';
@Component({
  selector: 'app-aod-view',
  templateUrl: './aod-view.component.html',
  styleUrls: ['./aod-view.component.scss'],
})
export class AodViewComponent implements OnInit {
  AodData;
  AodDataKeys;
  assemblySession: object = [];
  assemblyId;
  sessionId;
  userid;
  aodList = [];
  selectedMinisters = [];
  existingMinisterGroup: Object;
  allMinisterGroup = {
    allotmentId: null,
    aodDetail: [],
    assemblyId: null,
    fileId: null,
    fileStatus: null,
    sessionId: null,
    status: null,
    userId: null,
    revised: false,
    dateShiftType: null
  };
  dateShiftType = null;
  Alloteddates = [] as any;
  fileId = 0;
  fileDetail = {
    returnUrl: null,
    assemblyId: null,
    sessionId: null
  };
  constructor(
    private aodService: AodService,
    private question: QuestionService,
    private auth: AuthService,
    private notify: NotificationCustomService,
    private router: Router,
    private route: ActivatedRoute,
    private cos: CalenderofsittingService
  ) {
    const Id = this.route.snapshot.params.id;
    const fileDetail = this.route.snapshot.params.detail;
    this.fileId = Id;
    if (Id) {
      this.getFileByFileId(Id);
    }
    if (fileDetail) {
      this.fileDetail = JSON.parse(atob(fileDetail));
    }
   }
  ngOnInit() {
    this.getAssemblySessionDetails();
    this.userid = this.auth.getCurrentUser().userId;
  }
  getAssemblySessionDetails() {
    this.cos.getAssemblySessionDetails().subscribe(data => {
      this.assemblySession['assembly'] = data.assemblySession;
      this.assemblySession['assembly'] = this.assemblySession['assembly'].filter(x => x.assemblyId >=  data.activeAssemblySession.assemblyValue);
      this.assemblySession["assembly"].currentassembly = data.activeAssemblySession.assemblyId;
      this.filterAssembly();
      this.assemblySession["session"].currentsession = data.activeAssemblySession.sessionId;
      this.getAoDList();
    });
  }
  filterAssembly() {
    const assemblyDetail = this.assemblySession['assembly'].find(x => x.id == this.assemblySession["assembly"].currentassembly);
    if (assemblyDetail) {
      this.assemblySession['session'] = assemblyDetail.session;
    }
    this.assemblySession["session"].currentsession = null;
    this.allMinisterGroup.aodDetail = [];
  }
 
  getAoDList() {
    this.aodService
      .getAODList(
        this.assemblySession['assembly'].currentassembly,
        this.assemblySession['session'].currentsession
      )
      .subscribe((res) => {
        this.allMinisterGroup = res;
        this.getDateShiftType();
        this.assemblySession['session'].currentsession = this.allMinisterGroup.sessionId;
        this.assemblySession['assembly'].currentassembly = this.allMinisterGroup.assemblyId;
        console.log(this.allMinisterGroup);
      });
  }
  getDateShiftType() {
    if (this.allMinisterGroup.dateShiftType === 'SERIAL') {
      this.dateShiftType = 'Serially';
    } else {
      this.dateShiftType = 'from one date to another';
    }
  }

  isMLA() {
    return this.auth.getCurrentUser().authorities.includes('MLA');
  }
  cancel(){
    
  }
  refresh() {
    this.assemblyId = this.assemblySession['assembly'].currentassembly,
      this.sessionId = this.assemblySession['session'].currentsession,
      this.aodService
        .refreshAodDates(this.assemblyId, this.sessionId)
        .subscribe((res: any) => {
           this.allMinisterGroup = res;
           console.log(this.allMinisterGroup);
           this.assemblySession['session'].currentsession = this.allMinisterGroup.sessionId;
           this.assemblySession['assembly'].currentassembly = this.allMinisterGroup.assemblyId;
           this.notify.showSuccess('Success', 'refreshed successfully');
        });
  }

  submit() {
    if (this.allMinisterGroup) {
      this.allMinisterGroup.userId = this.userid;
      if (this.allMinisterGroup.revised) {
        this.aodService.resubmitAod(this.allMinisterGroup).subscribe(data => {
          this.notify.showSuccess('Success', 'revised aod submitted successfully');
          this.router.navigate(['/business-dashboard/aod/aod-list']);
        });
      } else {
        this.aodService.postAod(this.allMinisterGroup)
        .subscribe((res: any) => {
          this.notify.showSuccess('Success', 'aod submitted successfully');
          if (this.fileDetail.returnUrl) {
            this.router.navigate([this.fileDetail.returnUrl]);
          } else {
            this.router.navigate(['/business-dashboard/aod/aod-list']);
          }
        });
      }
    }
  }
  getFileByFileId(Id) {
    this.aodService.getAodListFile(Id, this.auth.getCurrentUser().userId).subscribe(Response => {
      this.AodData = Response;
      console.log(this.AodData);
      // this.aodDetails  = this.AodData.allotmentOfDays;
    });
  }
}
