import { Injectable } from "@angular/core";
import { NormalPdfViewerComponent } from "../components/normal-pdf-viewer/normal-pdf-viewer.component";
import { NzDrawerService } from "ng-zorro-antd";

@Injectable()
export class NormalPdfviewerService {
  public drawerRef;
  constructor(private drawerService: NzDrawerService) {}

  displayNormalPDFModal(url?: any) {
    if (this.drawerRef) {
      // this.drawerRef.close();
    }
    const drawerRef = this.drawerService.create<
      NormalPdfViewerComponent,
      { url: string },
      string
    >({
      nzContent: NormalPdfViewerComponent,
      nzContentParams: {
        url: url
      }
    });
    this.drawerRef = drawerRef;
  }
}
