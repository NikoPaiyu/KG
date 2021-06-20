import { Component, OnInit } from "@angular/core";
import { QuestionRBSService } from "../../shared/question-rbs.service";
import { AuthService } from "src/app/auth/shared/services/auth.service";
import { Router, ActivatedRoute, RouterModule } from "@angular/router";

@Component({
  selector: "app-assurance-main-list",
  templateUrl: "./assurance-main-list.component.html",
  styleUrls: ["./assurance-main-list.component.scss"],
})
export class AssuranceMainListComponent implements OnInit {
  assemblySession: object = [];
  buttonList: any;
  IsDraftAssureList = false;
  nzSelectedIndex = 0;
  constructor(
    private rbsService: QuestionRBSService,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    if (this.router.url === "/business-dashboard/question/draft-assurance") {
      this.IsDraftAssureList = true;
    }
  }
  ngOnInit() {
    this.loadRBSPermissions();
    this.route.params.subscribe((params) => {
      const type = params.type;
      if (type && type === "LIST") {
        this.nzSelectedIndex = 3;
      }
    });
  }
  loadRBSPermissions() {
    if (this.auth.getCurrentUser().userId) {
      this.rbsService
        .getQuestionPermissions(this.auth.getCurrentUser().userId)
        .subscribe((response) => {});
    }
  }
}
