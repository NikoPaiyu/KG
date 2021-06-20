import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/auth/shared/services/auth.service';
import { FileService } from '../../shared/services/file.service';
import { NoticeService } from '../../shared/services/notice.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NoticeTemplateService } from '../../shared/services/notice-template.service';
import { CalenderofsittingService } from 'src/app/business-dashboard/calender-of-sitting/shared/services/calenderofsitting.service';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss']
})
export class FileListComponent implements OnInit {
  @Input() FileType: any;
  filter = {
    assemblyId: null,
    sessionId: null,
    searchText: '',
    status: ''
  };
  assemblyList = [];
  sessionList = [];
  pendingFileList: any = [];
  allPendingFileList: any = [];
  searchPendingFilesParam = '';
  popupFlag = false;
  checkboxes = [
    { id: 1, label: 'File No', check: true },
    { id: 2, label: 'File Subject', check: true },
    { id: 3, label: 'Priority', check: true },
    { id: 5, label: 'RegDate', check: true },
    { id: 6, label: 'Status', check: true },
  ];
  constructor(private user: AuthService, private file: FileService, public notice: NoticeService,
              private cos: CalenderofsittingService,
              private router: Router, private route: ActivatedRoute, private service: NoticeTemplateService) { }

  ngOnInit() {
    this.getAssemblySessionDetails();
  }
  getAssemblySessionDetails() {
    this.cos.getAssemblySessionDetails().subscribe(data => {
      this.assemblyList = data.assemblySession;
      this.filter.assemblyId = data.activeAssemblySession.assemblyId;
      this.filterFileAssembly();
      this.filter.sessionId = data.activeAssemblySession.sessionId;
    });
  }
  filterFileAssembly() {
    const assemblyDetail = this.assemblyList.find(x => x.id == this.filter.assemblyId);
    if (assemblyDetail) {
      this.sessionList = assemblyDetail.session;
    }
    this.filter.sessionId = null;
  }
  getAssemblyAndSession() {
    this.service.getAllAssembly().subscribe(data => {
      this.assemblyList = data;
      const ids = data.map(x => x.id);
      this.filter.assemblyId = Math.max(...ids);
      this.service.getAllSession().subscribe(sessionData => {
        this.sessionList = sessionData;
        const sessionIds = sessionData.map(x => x.id);
        this.filter.sessionId = Math.max(...sessionIds);
        if (this.FileType == 1) {
          this.getAllFiles();
        } else {
          this.getMyFiles();
        }
      });
    });
  }


  getAllFiles() {
    const Type = 'NOTICE';
    this.file.getAllFiles(this.filter.assemblyId, this.filter.sessionId).subscribe(Response => {
      this.pendingFileList = this.allPendingFileList = Response;
      this.filterPendingFiles();
    });
  }
  getMyFiles() {
    this.file.getFileByOwner(this.user.getCurrentUser().userId).subscribe(Response => {
      this.pendingFileList = this.allPendingFileList = Response;
    });
  }

  openFile(fileId) {
    this.router.navigate(['../../notice/staff/file', fileId], {
      relativeTo: this.route.parent
    });
  }
  
  filterPendingFiles() {
    if (this.searchPendingFilesParam) {
      this.pendingFileList = this.allPendingFileList.filter(
        (element) =>
          (element.fileNumber &&
            element.fileNumber
              .toLowerCase()
              .includes(this.searchPendingFilesParam.toLowerCase())) ||
          (element.subject &&
            element.subject
              .toLowerCase()
              .includes(this.searchPendingFilesParam.toLowerCase()))
      );
    } else {
      this.pendingFileList = this.allPendingFileList;
    }
  }
  showTask(): void {
    this.popupFlag = true;
  }
  Cancel() {
    this.popupFlag = false;
  }
}
