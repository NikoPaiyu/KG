import { Component, OnInit } from '@angular/core';
import { HtmldiffService } from '../../shared/services/htmldiff.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-versions',
  templateUrl: './versions.component.html',
  styleUrls: ['./versions.component.scss']
})
export class VersionsComponent implements OnInit {

  constructor(private htmlDiffService: HtmldiffService, private router: Router,
              private route: ActivatedRoute, private location: Location) {
    this.readDataFromRoute();
  }
  versionsCombo = [];
  selectedVersionV1;
  selectedVersionV2;
  v1 = "";
  v2 = "";
  diff = "";
  noticeDetails: any = {};

  ngOnInit() {
  }

  readDataFromRoute() {
    if (
      this.router.getCurrentNavigation() &&
      this.router.getCurrentNavigation().extras &&
      this.router.getCurrentNavigation().extras.state
    ) {
      this.setData(this.router.getCurrentNavigation().extras.state.data);
    }
  }

  setData(data) {
    this.noticeDetails = data;
    console.log(data);
    this.versionsCombo = this.noticeDetails.versionOptions;
    this.selectedVersionV1 = 1;
    this.selectedVersionV2 = this.noticeDetails.notice.currentVersion;
    this.v1 = this.v2 = this.noticeDetails.versions[this.noticeDetails.notice.currentVersion];
    this.onV1Change(1);
    this.findHtmlDiff();
  }
  GetRoles(roles) {
    if (roles) {
      return roles.map(x => x.roleName).join('/');
    } else {
      return '';
    }
  }
  findHtmlDiff() {
    this.diff = this.htmlDiffService.htmlDiff(this.v1, this.v2);
  }

  onV1Change(event) {
    this.v1 = this.noticeDetails.versions[event];
    this.findHtmlDiff();
  }

  onV2Change(event) {
    this.v2 = this.noticeDetails.versions[event];
    this.findHtmlDiff();
  }
  goBack() {
    this.location.back();
    // this.router.navigate([
    //   '../../../notice/process', this.noticeDetails.notice.noticeId
    // ], {
    //   relativeTo: this.route.parent,
    // });
  }
}
