import { Component, OnInit } from '@angular/core';
import { FileuploadService } from 'src/app/business-dashboard/fileupload/shared/services/fileupload.service';
import { NzEmptyModule, NzDrawerService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { PdfViewerComponent } from 'src/app/shared/components/pdf-viewer/pdf-viewer.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-starredfolder',
  templateUrl: './starredfolder.component.html',
  styleUrls: ['./starredfolder.component.scss']
})
export class StarredfolderComponent implements OnInit {
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

  backToStarredTemplate() {

    this._location.back();
  //  this.router.navigate(["dashboard/questions/starred-questions"])
  }

  openStarredFileTemplate(url): void {
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
