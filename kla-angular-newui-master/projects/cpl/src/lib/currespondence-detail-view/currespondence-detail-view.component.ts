import { Component, OnInit, Inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CurrespondenceService } from "../shared/services/currespondence.service";

@Component({
  selector: "cpl-currespondence-detail-view",
  templateUrl: "./currespondence-detail-view.component.html",
  styleUrls: ["./currespondence-detail-view.component.css"],
})
export class CurrespondenceDetailViewComponent implements OnInit {
  currentUser: any;
  currespondenceDetails: any = [];
  currespondenceId;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private currespondenceServices: CurrespondenceService,
    @Inject("authService") private AuthService
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
    this.currespondenceServices
      .currespondenceDetailView(currespondenceId, code)
      .subscribe((res) => {
        this.currespondenceDetails = res;
      });
  }
  goBack() {
    window.history.back();
    // this.router.navigate(["business-dashboard/cpl/documents"]);
  }
  showAttachment(url) {
    window.open(url, "_blank");
  }
}
