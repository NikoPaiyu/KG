import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { forkJoin } from 'rxjs';
import { FileServiceService } from '../../services/file-service.service';
import { TablescommonService } from '../../services/tablescommon.service';

@Component({
  selector: 'tables-attach-to-file',
  templateUrl: './attach-to-file.component.html',
  styleUrls: ['./attach-to-file.component.css']
})
export class AttachToFileComponent implements OnInit {
  @Input() resumeData = null;
  @Input() typeOfFile = null;
  @Input() electionDetails = null;
  @Output() closePopup = new EventEmitter<any>();
  @Input() obituaryId;
  @Input() bulletinpart1Data =  null;
  @Input() timeAllocBusinessId;
  file = {
    subject: "",
    priority: null,
    description: "",
  };
  user:any;
  assemblySessionObj = {
    assembly: [],
    session: [],
    currentAssembly: "",
    currentSession: "",
    currentAssemblyLbl: "",
  };
  constructor(
    @Inject("authService") private AuthService,private router:Router,
    public common: TablescommonService, private notification: NzNotificationService,private tableFileService:FileServiceService
  ) {
    this.user = AuthService.getCurrentUser();
   }

  ngOnInit() {
      this.getAssemblySession();
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

  handlePreviewCancel() {
    this.closePopup.emit();
  }
  createObituaryFile(){
    const body = {
      obituaryId: this.obituaryId,
      fileForm: {
        assemblyId: this.assemblySessionObj.currentAssembly,
        currentNumber: null,
        description: this.file.description,
        sessionId: this.assemblySessionObj.currentSession,
        status: "saved",
        subject: this.file.subject,
        activeSubTypes: ["TABLE_OBITUARY"],
        subtype: "TABLE_OBITUARY",
        subTypes:["TABLE_OBITUARY"],
        type: "TABLE",
        userId: this.user.userId,
        priority: this.file.priority,
        activesubtype : "TABLE_OBITUARY"
      },
    };
    this.tableFileService.createFile(body).subscribe((Res: any) => {
      this.notification.success(
        "Success",
        "File Created with file number " + Res.fileResponse.fileNumber 
      );
      this.closePopup.emit();
      this.file = {
        subject: "",
        priority: null,
        description: "",
      };
      setTimeout(() => {
        this.router.navigate(["business-dashboard/tables/file-view",Res.fileResponse.fileId]);
      }, 1500);
    });
  }

  createElectionFile(body) {
    this.tableFileService.createProtemSpeakerFile(body).subscribe((Res: any) => {
      this.notification.success(
        'Success',
        'File Created with file number ' + Res.fileResponse.fileNumber
      );
      this.closePopup.emit();
      this.file = {
        subject: '',
        priority: null,
        description: '',
      };
      setTimeout(() => {
        if (this.typeOfFile === 'PROTEM_SPEAKER') {
          this.router.navigate(['business-dashboard/tables/file-view', 'pro-tem-speaker', Res.fileResponse.fileId]);
        } else if (this.typeOfFile === 'SPEAKER' || this.typeOfFile === 'DEPUTY_SPEAKER') {
          this.router.navigate(['business-dashboard/tables/file-view', 'election', Res.fileResponse.fileId]);
        }
      }, 1500);
    });
  }

  createFile() {
    if (this.typeOfFile === 'PROTEM_SPEAKER') {
      const body = {
        proTemSpeakerId: this.electionDetails.id,
        fileForm: {
          assemblyId: this.assemblySessionObj.currentAssembly,
          currentNumber: null,
          description: this.file.description,
          sessionId: 0,
          status: 'saved',
          subject: this.file.subject,
          activeSubTypes: ['PRO_TEM_SPEAKER'],
          subtype: 'PRO_TEM_SPEAKER',
          type: 'TABLE',
          userId: this.user.userId,
          priority: this.file.priority
        },
      };
      // , 'PRO_TEM_SPEAKER_CABINET_NOTE'
      this.createElectionFile(body);
    } else  if (this.typeOfFile === 'SPEAKER') {
      const body = {
        speakerElectionId: this.electionDetails.id,
        fileForm: {
          assemblyId: this.assemblySessionObj.currentAssembly,
          currentNumber: null,
          description: this.file.description,
          sessionId: 0,
          status: 'saved',
          subject: this.file.subject,
          activeSubTypes: ['SPEAKER_ELECTION'],
          subtype: 'SPEAKER_ELECTION',
          type: 'TABLE',
          userId: this.user.userId,
          priority: this.file.priority
        },
      };
      // , 'SPK_ELN_CABINET_NOTE'
      this.createElectionFile(body);
    } else  if (this.typeOfFile === 'DEPUTY_SPEAKER') {
      const body = {
        speakerElectionId: this.electionDetails.id,
        fileForm: {
          assemblyId: this.assemblySessionObj.currentAssembly,
          currentNumber: null,
          description: this.file.description,
          sessionId: 0,
          status: 'saved',
          subject: this.file.subject,
          activeSubTypes: ['DEPUTY_SPEAKER_ELECTION'],
          subtype: 'DEPUTY_SPEAKER_ELECTION',
          type: 'TABLE',
          userId: this.user.userId,
          priority: this.file.priority
        },
      };
      // , 'DEPUTY_SPKR_ELN_SPEAKER_ORDER'
      this.createElectionFile(body);
    } else  if (this.typeOfFile === 'RESUME') {
      const body = {
        tableResumeId:this.resumeData.id,

        fileForm: {
          assemblyId: this.resumeData.assemblyId,
          currentNumber: null,
          description: this.file.description,
          sessionId: this.resumeData.sessionId,
          status: 'saved',
          subject: this.file.subject,
          activeSubTypes: ['TABLE_RESUME'],
          subtype: 'TABLE_RESUME',
          type: 'TABLE',
          userId: this.user.userId,
          priority: this.file.priority
        },
      };
      this.createResumeandBulletinPart1File(body);
    }
    else  if (this.typeOfFile === 'BULLETIN_PART1') {
      const body = {
        bullettinOneId:this.bulletinpart1Data.id,

        fileForm: {
          assemblyId: this.bulletinpart1Data.assemblyId,
          currentNumber: null,
          description: this.file.description,
          sessionId: this.bulletinpart1Data.sessionId,
          status: 'saved',
          subject: this.file.subject,
          activeSubTypes: ['TABLE_BULLETIN_ONE'],
          subtype: 'TABLE_BULLETIN_ONE',
          type: 'TABLE',
          userId: this.user.userId,
          priority: this.file.priority
        },
      };
      this.createResumeandBulletinPart1File(body);
    }
    else  if (this.typeOfFile === 'TIME_ALLOCATION_FILE') {
      const body = {
        businessId:this.timeAllocBusinessId,
        fileForm: {
          assemblyId: this.assemblySessionObj.currentAssembly,
          currentNumber: null,
          description: this.file.description,
          sessionId: this.assemblySessionObj.currentSession,
          status: 'saved',
          subject: this.file.subject,
          activeSubTypes: ['TABLE_BUSINESS_TIME_ALLOCATION_FLOW'],
          subtype: 'TABLE_BUSINESS_TIME_ALLOCATION_FLOW',
          type: 'TABLE',
          userId: this.user.userId,
          priority: this.file.priority
        },
      };
      this.createTimeAllocationFile(body)
    }
    else {
      this.createObituaryFile();
    }
  }
  createResumeandBulletinPart1File(body){
    this.tableFileService.createResumeAndBulletinPart1File(body).subscribe((Res: any) => {
      this.notification.success(
        'Success',
        'File Created with file number ' + Res.fileResponse.fileNumber
      );
      this.closePopup.emit();
      this.file = {
        subject: '',
        priority: null,
        description: '',
      };
      setTimeout(() => {
        
          this.router.navigate(['business-dashboard/tables/file-view', 'table-diary', Res.fileResponse.fileId]);
        
      }, 1500);
    });
  }
  createTimeAllocationFile(body){
    this.tableFileService.createFile(body).subscribe((Res: any) => {
      this.notification.success(
        "Success",
        "File Created with file number " + Res.fileResponse.fileNumber 
      );
      this.closePopup.emit();
      this.file = {
        subject: "",
        priority: null,
        description: "",
      };
      setTimeout(() => {
        this.router.navigate(["business-dashboard/tables/file-view",Res.fileResponse.fileId]);
      }, 1500);
    });
  }
}

