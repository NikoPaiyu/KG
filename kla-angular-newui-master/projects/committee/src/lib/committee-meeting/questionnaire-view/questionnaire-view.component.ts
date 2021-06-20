import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommitteeService } from '../../shared/services/committee.service';

@Component({
  selector: 'committee-questionnaire-view',
  templateUrl: './questionnaire-view.component.html',
  styleUrls: ['./questionnaire-view.component.scss']
})
export class QuestionnaireViewComponent implements OnInit {
  questionnaireId: any;
  questionnaire: any;
  @Input() isFileView = false;
  @Input() fileQuestionnaire: any;

  constructor(private route: ActivatedRoute,
              public committeeService: CommitteeService,) {
    this.questionnaireId = this.route.snapshot.params.id;
  }

  ngOnInit() {
    if (this.isFileView) {
      this.questionnaire = this.fileQuestionnaire;
    } else {
      this.getById();
    }
  }

  getById() {
    this.committeeService.getQuestionnaireById(this.questionnaireId).subscribe((res: any) => {
      this.questionnaire = res;
    });
  }

  goBack() {
    window.history.back();
  }

}
