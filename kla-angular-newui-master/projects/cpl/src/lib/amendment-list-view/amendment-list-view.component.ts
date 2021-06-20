import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DocumentsService } from '../shared/services/documents.service';

@Component({
  selector: 'cpl-amendment-list-view',
  templateUrl: './amendment-list-view.component.html',
  styleUrls: ['./amendment-list-view.component.scss']
})
export class AmendmentListViewComponent implements OnInit {
  docId: any;
  amendmentView: any = [];
  isVisible = false;
  docUrl: any;

  constructor(private router: Router, private route: ActivatedRoute,
              private docService: DocumentsService) {
    const Id = this.route.snapshot.params.id;
    this.docId = Id;
  }

  ngOnInit() {
    this.getAmendmentView();
  }
  getAmendmentView() {
    const body = {
      documentId: this.docId,
      layingDate: null,
      status: 'LIST_APPROVED'
    }
    // this.docService.getPendingFilter(body).subscribe((res) => {
    //   this.amendmentView = res;
    // });
    this.docService.getAmendmentListById(this.docId).subscribe((res) => {
      this.amendmentView = res;
    });
  }

  viewAmendment(id) {
    this.router.navigate(['amendment-view', id],
    {relativeTo: this.route.parent});
  }

  viewDocument(id) {
    this.router.navigate(['cpl-view', 'view', id],
    {relativeTo: this.route.parent});
  }

  showPdfModal(url) {
    this.isVisible = true;
    this.docUrl = url;
  }

  handleCancel() {
    this.isVisible = false;
  }

  goBack() {
    window.history.back();
  }
}
