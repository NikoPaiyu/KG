import { Component, OnInit } from '@angular/core';
import { PdfViewerComponent } from 'src/app/shared/components/pdf-viewer/pdf-viewer.component';
import { Router } from '@angular/router';
import { NzEmptyModule, NzDrawerService } from 'ng-zorro-antd';
import { FileuploadService } from 'src/app/business-dashboard/fileupload/shared/services/fileupload.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-budgetfolder',
  templateUrl: './budgetfolder.component.html',
  styleUrls: ['./budgetfolder.component.scss']
})
export class BudgetfolderComponent implements OnInit {

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

  backToBudgetTemplate() {
    this._location.back();
  //  this.router.navigate(["dashboard/budget"])
  }

  openBudgetTemplate(url): void {
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
