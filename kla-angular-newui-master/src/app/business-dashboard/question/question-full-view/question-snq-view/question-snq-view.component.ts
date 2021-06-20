import { Component, OnInit } from "@angular/core";
import { QuestionService } from "../../shared/question.service";
import { QuestionMenus } from "../../question.menus";
import { forkJoin } from "rxjs";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from "src/app/auth/shared/services/auth.service";
import { QuestionRBSService } from "../../shared/question-rbs.service";

@Component({
  selector: "app-question-snq-view",
  templateUrl: "./question-snq-view.component.html",
  styleUrls: ["./question-snq-view.component.scss"],
})
export class ShortNoticeViewComponent implements OnInit {
  dashBoardUrl;
  componentParams = { qDetail: {}, assembly: 14, session: 19 };
  assemblySession: object = [];
  questionId;
  constructor(
    private question: QuestionService,
    private questionMenus: QuestionMenus,
    private route: ActivatedRoute,
    private auth: AuthService,
    private router: Router,
    public rbsService: QuestionRBSService
  ) {}

  ngOnInit() {
    this.dashBoardUrl = this.questionMenus.getDashBoardUrl();
    this.route.params.subscribe((params) => {
      this.questionId = params.id;
      this.getAssemblySession();
    });
  }
  getAssemblySession() {
    this.question.getAllAssemblyAndSession().subscribe((res) => {
      if (res) {
        this.assemblySession = res;
        this.getQuestion();
      }
    });
  }
  getQuestion() {
    this.question
      .getView(this.questionId, this.auth.getCurrentUser().userId)
      .subscribe((response) => {
        this.componentParams["qDetail"]  = response;
        this.componentParams["assembly"] = this.assemblySession[
          "assembly"
        ].find(
          (element) =>
            element.id === response["question"].assemblyId
        ).assemblyId;
        this.componentParams["session"] = this.assemblySession["session"].find(
          (element) =>
            element.id === response["question"].sessionId
        ).sessionId;
      });
  }
  isEmpty() {
    if (Object.keys(this.componentParams["qDetail"]).length === 0) {
      return true;
    }
    return false;
  }
  onBack() {
    this.router.navigate(["list-mla-snq"],
    {relativeTo: this.route.parent});
  }
}
