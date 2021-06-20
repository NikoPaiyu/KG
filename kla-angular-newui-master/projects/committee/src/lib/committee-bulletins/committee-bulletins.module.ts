import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from "ng-zorro-antd";
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommitteeBulletinsRoutingModule } from './committee-bulletins-routing.module';
import { CommitteeBulletinsComponent } from './committee-bulletins.component';
import { BulletinPart1Component } from './bulletin-part1/bulletin-part1.component';
import { BulletinPart2Component } from './bulletin-part2/bulletin-part2.component';
import { BulletinListComponent } from './bulletin-list/bulletin-list.component';
import { BulletinContentViewModule } from './bulletin-content-view/bulletin-content-view.module';

@NgModule({
  declarations: [CommitteeBulletinsComponent,
    BulletinPart1Component,
    BulletinPart2Component,
    BulletinListComponent
  ],
  imports: [
    CommonModule,
    CommitteeBulletinsRoutingModule,
    NgZorroAntdModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    BulletinContentViewModule
  ]
})
export class CommitteeBulletinsModule { }
