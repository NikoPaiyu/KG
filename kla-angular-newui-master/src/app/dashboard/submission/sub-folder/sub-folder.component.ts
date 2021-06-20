import { Component, OnInit } from '@angular/core';
import { PdfViewerComponent } from 'src/app/shared/components/pdf-viewer/pdf-viewer.component';
import { FileuploadService } from 'src/app/business-dashboard/fileupload/shared/services/fileupload.service';
import { NzDrawerService, NzEmptyModule } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import {Location} from '@angular/common';

@Component({
  selector: 'app-sub-folder',
  templateUrl: './sub-folder.component.html',
  styleUrls: ['./sub-folder.component.scss']
})
export class SubFolderComponent implements OnInit {

  routeData;
  FileUploadDetails = [];
  constructor(
    private fileuploadservice: FileuploadService,
    private drawerService: NzDrawerService,
    private emptyModule: NzEmptyModule,
    public router: Router,
    private _location: Location
  ) {
    this.setRouterData();
  }

  setRouterData() {
    if (
      this.router.getCurrentNavigation() &&
      this.router.getCurrentNavigation().extras &&
      this.router.getCurrentNavigation().extras.state
    )
      this.routeData = this.router.getCurrentNavigation().extras.state.id;
  }

  ngOnInit() {
    if (this.routeData) {

      this.getFileUploadDetails(this.routeData);
    }
  }

  getFileUploadDetails(id) {
    this.fileuploadservice.getDocUploadDetails(id).subscribe((res: any) => {
      this.FileUploadDetails = res;
    });
  }

  backToSubTemplate() {
    this._location.back();
   // this.router.navigate(["dashboard/submission"])
  }

  openSubFileTemplate(url): void {
    const drawerRef = this.drawerService.create<
      PdfViewerComponent,
      { url: string },
      string
    >({
      nzContent: PdfViewerComponent,
      nzContentParams: {
        url: url
      }
    });
  }


}
