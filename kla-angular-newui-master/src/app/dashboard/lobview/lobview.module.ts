import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NzBreadCrumbModule } from "ng-zorro-antd/breadcrumb";
import { NzDividerModule } from "ng-zorro-antd/divider";
import { NzCardModule } from "ng-zorro-antd/card";
import { NzCollapseModule } from "ng-zorro-antd/collapse";

import { LobviewRoutingModule } from "./lobview-routing.module";
import { LobviewComponent } from "./lobview.component";
import { ViewComponent } from "./view/view.component";
import { LobService } from "src/app/business-dashboard/lob/shared/services/lob.service";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { FormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
@NgModule({
  providers: [LobService],
  declarations: [LobviewComponent, ViewComponent],
  imports: [
    CommonModule,
    FormsModule,
    LobviewRoutingModule,
    NzBreadCrumbModule,
    NzDividerModule,
    NzCardModule,
    NzCollapseModule,
    NgZorroAntdModule,
    TranslateModule
  ]
})
export class LobviewModule {}
