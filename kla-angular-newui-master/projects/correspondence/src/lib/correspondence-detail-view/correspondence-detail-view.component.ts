import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd';
import { ViewCommitteeResponseComponent } from '../shared/components/view-committee-response/view-committee-response.component';
import { CorrespondenceService } from '../shared/services/correspondence.service';

@Component({
  selector: 'correspondence-correspondence-detail-view',
  templateUrl: './correspondence-detail-view.component.html',
  styleUrls: ['./correspondence-detail-view.component.scss']
})
export class CorrespondenceDetailViewComponent implements OnInit {
  currentUser: any;
  currespondenceDetails: any = [];
  currespondenceId;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private correspondenceServices: CorrespondenceService,
    @Inject('authService') private AuthService,
    private modalService: NzModalService,
  ) {
    this.currentUser = AuthService.getCurrentUser();
    this.currespondenceId = this.route.snapshot.params.id;
    this.currespondenceDetailView(
      this.currespondenceId,
      this.currentUser.correspondenceCode.code
    );
  }

  ngOnInit() {}

  currespondenceDetailView(currespondenceId, code) {
    this.correspondenceServices
      .correspondenceDetailView(currespondenceId, code)
      .subscribe((res) => {
        this.currespondenceDetails = res;
      });
  }

  goBack() {
    window.history.back();
  }

  showAttachment(url) {
    window.open(url, '_blank');
  }
  viewSuggestions(businessData){
    this.modalService.create({
      nzTitle: '',
      nzWidth: '800',
      nzContent: ViewCommitteeResponseComponent,
      nzClosable: true,
      nzFooter: null,
      nzMaskClosable: false,
      nzComponentParams: {
        committeeResponse: businessData,
        isEdit : false
      }, 
    })
  }
}
