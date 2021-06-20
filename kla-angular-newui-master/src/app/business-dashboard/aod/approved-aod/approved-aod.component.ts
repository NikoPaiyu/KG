import { Component, OnInit } from '@angular/core';
import { AodService } from '../shared/service/aod.service';
import { QuestionMenus } from '../../question/question.menus';
import { QuestionService } from '../../question/shared/question.service';
import { AuthService } from 'src/app/auth/shared/services/auth.service';
import { NotificationCustomService } from 'src/app/shared/services/notification.service';
import { Router, ActivatedRoute } from '@angular/router';
import { QuestionRBSService } from "../../question/shared/question-rbs.service";
import { CalenderofsittingService } from '../../calender-of-sitting/shared/services/calenderofsitting.service';

@Component({
  selector: 'app-approved-aod',
  templateUrl: './approved-aod.component.html',
  styleUrls: ['./approved-aod.component.scss']
})
export class ApprovedAodComponent implements OnInit {
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
    bulletin: {
      fileStatus: null
    }
  };
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
    public rbsService: QuestionRBSService,
    private cos: CalenderofsittingService
  ) { 
    const Id = this.route.snapshot.params.id;
    const fileDetail = this.route.snapshot.params.detail;
    this.fileId = Id;
    if (Id) {
      // this.getFileByFileId(Id);
    }
    if (fileDetail) {
      this.fileDetail = JSON.parse(atob(fileDetail));
    }
  }

  ngOnInit() {
    // this.getAssemblySession();
    this.loadRBSPermissions();
    this.userid = this.auth.getCurrentUser().userId;
    this.getAssemblySessionDetails();
  }
  getAssemblySessionDetails() {
    this.cos.getAssemblySessionDetails().subscribe(data => {
      this.assemblySession['assembly'] = data.assemblySession;
      this.assemblySession['assembly'].currentassemblyLabel = data.activeAssemblySession.assemblyValue;
      this.assemblySession['assembly'].currentassembly = data.activeAssemblySession.assemblyId;
      this.filterSession();
      this.assemblySession['session'].currentsession = data.activeAssemblySession.sessionId;
      if (this.fileDetail.assemblyId) {
        this.assemblySession['assembly'].currentassembly = this.fileDetail.assemblyId;
      }
      if (this.fileDetail.sessionId) {
        this.assemblySession['session'].currentsession = this.fileDetail.sessionId;
      }
      this.getAoDList();
    });
  }
  filterSession() {
    const assemblyDetail = this.assemblySession['assembly'].find(x => x.id === this.assemblySession['assembly'].currentassembly);
    if (assemblyDetail) {
      this.assemblySession['session'] = assemblyDetail.session;
      this.assemblySession['session'].currentsession = null;
      this.allMinisterGroup.aodDetail = [];
    }
  }
  getAssemblySession() {
    this.question.getAllAssembly().subscribe((assembly) => {
      this.question.getAllSession().subscribe((session) => {
        if (Array.isArray(session) && Array.isArray(assembly)) {
          this.assemblySession['assembly'] = assembly;
          this.assemblySession['assembly'].currentassemblyLabel = assembly
            .slice(-1)
            .pop().assemblyId;
          this.assemblySession['assembly'].currentassembly = assembly
            .slice(-1)
            .pop().id;
          this.assemblySession['session'] = session;
          this.assemblySession['session'].currentsession = session
            .slice(-1)
            .pop().id;
          if (this.fileDetail.assemblyId) {
            this.assemblySession['assembly'].currentassembly = this.fileDetail.assemblyId;
          }
          if (this.fileDetail.sessionId) {
            this.assemblySession['session'].currentsession = this.fileDetail.sessionId;
          }
          this.getAoDList();
        }
      });
    });
  }

  getAoDList() {
    const status = 'APPROVED';
    this.aodService
      .getAodApprovedList(
        this.assemblySession['assembly'].currentassembly,
        this.assemblySession['session'].currentsession,
        status
      )
      .subscribe((res) => {
        this.allMinisterGroup = res;
        console.log(this.allMinisterGroup);
        this.assemblySession['session'].currentsession = this.allMinisterGroup.sessionId;
        this.assemblySession['assembly'].currentassembly = this.allMinisterGroup.assemblyId;
        console.log(this.allMinisterGroup);
      });
  }
  loadRBSPermissions() {
    if (this.auth.getCurrentUser().userId) {
      this.rbsService
        .getQuestionPermissions(this.auth.getCurrentUser().userId)
        .subscribe((response) => {});
    }
  }
  sendTOMembers() {
    if (this.assemblySession['assembly'].currentassembly && this.assemblySession['session'].currentsession) {
      this.aodService
        .getAODReportPermission(
    this.assemblySession['assembly'].currentassembly,
    this.assemblySession['session'].currentsession,
        )
        .subscribe((res: any) => {
          if (res.fileId) {
            this.notify.showWarning("Already Sent", "");
            return;
          }
          this.aodService
            .sendTOMembers({allotmentId: this.allMinisterGroup.allotmentId })
            .subscribe((res: any) => {
              this.notify.showSuccess("Add Success", "");
            });
        });
    }
  }

  isMLA() {
    return this.auth.getCurrentUser().authorities.includes('MLA');
  }
}
