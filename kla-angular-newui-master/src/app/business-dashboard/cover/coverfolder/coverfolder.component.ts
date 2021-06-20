import { Component, OnInit } from '@angular/core';
import { FileuploadService } from 'src/app/business-dashboard/fileupload/shared/services/fileupload.service';
import { NzDrawerService } from 'ng-zorro-antd';
import { PdfViewerComponent } from 'src/app/shared/components/pdf-viewer/pdf-viewer.component';
import { Router } from '@angular/router';
import { NzEmptyModule } from 'ng-zorro-antd/empty';

@Component({
  selector: 'app-coverfolder',
  templateUrl: './coverfolder.component.html',
  styleUrls: ['./coverfolder.component.scss']
})
export class CoverfolderComponent implements OnInit {
  routeData;
  FileUploadDetails=[];
  constructor(
    private fileuploadservice: FileuploadService,
    private drawerService: NzDrawerService,
    private emptyModule:NzEmptyModule,
    public router: Router,
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

  backToCoverTemplate(){
   
    this.router.navigate(["/business-dashboard/home"])
  }

  openCoverTemplate(url): void {
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
