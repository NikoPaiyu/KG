import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/auth/shared/services/auth.service';
import { NotificationCustomService } from 'src/app/shared/services/notification.service';
import { Location } from '@angular/common';
import { NoticeProcessService } from '../../shared/services/notice-process.service';
import { NzModalService } from 'ng-zorro-antd'; import { QuestionansPreviewComponent } from '../../shared/components/questionans-preview/questionans-preview.component';
;
@Component({
  selector: 'app-duplicate-check-questions',
  templateUrl: './duplicate-check-questions.component.html',
  styleUrls: ['./duplicate-check-questions.component.scss']
})
export class DuplicateCheckQuestionsComponent implements OnInit {
  @Input() notice;
  qDetail;
  headingKeyCombos = [];
  clauseKeyCombos = [];
  tagKeyCombos = [];
  clauses = [];
  tags = [];
  headings = [];
  newHeadingKeyWord;
  headingkeywords = [];
  newClauseKeyWord;
  clausekeywords = [];
  selectedTags;
  tagkeywords = [];
  tagsCombo = [];
  selectedSubsubjects = [];
  subsubjectkeywords = [];
  subSubjectCombo = [];
  check = false;
  headingid = 0;
  clauseid = 0;
  tagid = 0;
  subsubjectid = 0;
  headingMatchData = { keywords: [], matches: [] };
  clauseMatchData = { keywords: [], matches: [] };
  tagMatchData = { keywords: [], matches: [] };
  subsubjectMatchData = { keywords: [], matches: [] };
  upper = ["A", "B", "C", "D", "E", "F", "G", "H"];

  questionID;
  assemblySession: object = [];
  statusParam = "";
  constructor(
    private question: NoticeProcessService,
    private auth: AuthService,
    private location: Location,
    private notify: NotificationCustomService,
    private modalService: NzModalService
  ) {
  }

  ngOnInit(): void {
    this.qDetail = this.notice;
    this._setSearchData(this.notice);
  }


  isMLA() {
    return this.auth.getCurrentUser().authorities.includes("MLA");
  }

  goBack() {
    this.location.back();
  }

  ToggleHeadingPanel(id, check) {
    this.headingid = id;
    this.check = check;
  }

  ToggleClausePanel(id, check) {
    this.clauseid = id;
    this.check = check;
  }

  ToggleSubsubjectPanel(id, check) {
    this.subsubjectid = id;
    this.check = check;
  }

  ToggleTagPanel(id, check) {
    this.tagid = id;
    this.check = check;
  }

  highlight(content, words: any[]) {
    if (content && words.length > 0) {
      words.forEach(element => {
        content = content.replace(new RegExp(element, "gi"), match => {
          return '<span class="highlightText">' + match + '</span>';
        });
      });

    }
    return content;
  }

  addHeadingKeyWord(word) {
    if (word && !this.headingkeywords.some(ele => ele.word == word)) {
      this.headingkeywords.push({ id: "", word: word });
    }
    this.newHeadingKeyWord = null;
  }
  addCurrentHeadingKeyWord(word, z, add) {
    if (add && word.key) {
      let index = this.headingkeywords.findIndex(ele => ele.word == word.key);
      if (index >= 0) {
        this.headingkeywords[index].id = word.id;
      }
      else {
        this.headingkeywords.push({ id: word.id, word: word.key });
      }

    }
    this.headingKeyCombos[z].show = false;
  }
  removeHeadingKeyWord(index) {
    if (this.headingkeywords[index].id) {
      let clauseIndex = this.headings.findIndex(ele => ele.id == this.headingkeywords[index].id);
      this.headingKeyCombos[clauseIndex].key = this.headings[clauseIndex].key;
      this.headingKeyCombos[clauseIndex].show = true;
    }
    this.headingkeywords.splice(index, 1);

  }
  searchHeadingKeyWord() {
    if (this.headingkeywords.length > 0) {
      this.question.getHeadingDuplicates(this.headingkeywords.map(ele => ele.word)).subscribe((res: any) => {
        this.headingMatchData = res;
        if (res.matches.length <= 0) {
          this.notify.showError("No Match Found.", "")
        }
      });
    }
    else {
      this.notify.showError("Add Keyword to Search.", "")
    }
  }

  addClauseKeyWord(word) {
    if (word && !this.clausekeywords.some(ele => ele.word == word)) {
      this.clausekeywords.push({ id: "", word: word });
    }
    this.newClauseKeyWord = null;
  }

  addCurrentClauseKeyWord(word, z, add) {
    if (add && word.key) {
      let index = this.clausekeywords.findIndex(ele => ele.word == word.key);
      if (index >= 0) {
        this.clausekeywords[index].id = word.id;
      }
      else
        this.clausekeywords.push({ id: word.id, word: word.key });
    }
    this.clauseKeyCombos[z].show = false;
  }
  removeClauseKeyWord(index) {
    if (this.clausekeywords[index].id) {
      let clauseIndex = this.clauses.findIndex(ele => ele.id == this.clausekeywords[index].id);
      this.clauseKeyCombos[clauseIndex].key = this.clauses[clauseIndex].key;
      this.clauseKeyCombos[clauseIndex].show = true;
    }
    this.clausekeywords.splice(index, 1);
  }
  searchClauseKeyWord() {
    if (this.clausekeywords.length > 0) {
      this.question.getClauseDuplicates(this.clausekeywords.map(ele => ele.word)).subscribe((res: any) => {
        this.clauseMatchData = res;
        if (res.matches.length <= 0) {
          this.notify.showError("No Match Found.", "")
        }
      });
    }
    else {
      this.notify.showError("Add Keyword to Search.", "")
    }
  }
  addSubsubjectKeyWord(word: any[]) {
    if (word.length > 0) {
      this.subsubjectkeywords = [...this.subsubjectkeywords, ...word];
      this.subSubjectCombo = this.subSubjectCombo.filter(rel => !word.some(w => w == rel));
    }
    this.selectedSubsubjects = [];
  }
  removeSubsubjectKeyWord(index) {
    this.subSubjectCombo.push(this.subsubjectkeywords[index]);
    this.subsubjectkeywords.splice(index, 1);

  }
  searchSubsubjectKeyWord(subsubjectkeywords, subsubjectIds) {
    if (subsubjectkeywords.length > 0) {
      this.question.getSubsubjectDuplicates(this.subsubjectkeywords, subsubjectIds).subscribe((res: any) => {
        this.subsubjectMatchData = res;
      })
    }
  }

  addTagKeyWord(word) {
    if (word && !this.tagkeywords.some(ele => ele.word == word)) {
      this.tagkeywords.push({ id: "", word: word });
    }
    this.selectedTags = null;
  }

  addCurrentTagKeyWord(word, z, add) {
    if (add && word.key) {
      let index = this.tagkeywords.findIndex(ele => ele.word == word.key);
      if (index >= 0) {
        this.tagkeywords[index].id = word.id;
      } else
        this.tagkeywords.push({ id: word.id, word: word.key });
    }
    this.tagKeyCombos[z].show = false;
  }
  removeTagKeyWord(index) {
    if (this.tagkeywords[index].id) {
      let tagIndex = this.tags.findIndex(ele => ele.id == this.tagkeywords[index].id);
      this.tagKeyCombos[tagIndex].key = this.tags[tagIndex].key;
      this.tagKeyCombos[tagIndex].show = true;
    }
    this.tagkeywords.splice(index, 1);
  }
  searchTagKeyWord() {
    if (this.tagkeywords.length > 0) {
      this.question.getTagDuplicates(this.tagkeywords.map(ele => ele.word)).subscribe((res: any) => {
        this.tagMatchData = res;
        if (res.matches.length <= 0) {
          this.notify.showError("No Match Found.", "")
        }
      });
    }
    else {
      this.notify.showError("Add Tags to Search.", "")
    }
  }

  _setSearchData(qDetail) {
    if (qDetail) {
      console.log(qDetail);
      this.headingKeyCombos.push({ id: qDetail.title, key: qDetail.title, show: true });
      this.headings.push({ id: qDetail.title, key: qDetail.title, show: true });
      let clauseDetails = qDetail.formComponents.find(ele => ele.type == 'questionclause');
      this.clauseKeyCombos = (clauseDetails && clauseDetails.value) ? clauseDetails.value.map(clause => { return { id: clause, key: clause, show: true } }) : [];
      this.clauses = (clauseDetails && clauseDetails.value) ? clauseDetails.value.map(clause => { return { id: clause, key: clause, show: true } }) : [];
      this.tagKeyCombos = qDetail.tags ? qDetail.tags.map(tag => { return { id: tag, key: tag, show: true } }) : [];
      this.tags = qDetail.tags ? qDetail.tags.map(tag => { return { id: tag, key: tag, show: true } }) : [];

    }
  }
  resetClause() {
    const qDetail = this.qDetail;
    this.clausekeywords = [];
    let clauseDetails = qDetail.formComponents.find(ele => ele.type == 'questionclause');
    this.clauseKeyCombos = (clauseDetails && clauseDetails.value) ? clauseDetails.value.map(clause => { return { id: clause, key: clause, show: true } }) : [];
    this.clauses = (clauseDetails && clauseDetails.value) ? clauseDetails.value.map(clause => { return { id: clause, key: clause, show: true } }) : [];
  }
  resetHeading() {
    const qDetail = this.qDetail;
    this.headingkeywords = [];
    this.headings = [];
    this.headingKeyCombos = [];
    this.headingKeyCombos.push({ id: qDetail.title, key: qDetail.title, show: true });
    this.headings.push({ id: qDetail.title, key: qDetail.title, show: true });
  }
  resetTags() {
    const qDetail = this.qDetail;
    this.tagkeywords = [];
    this.tagKeyCombos = qDetail.tags ? qDetail.tags.map(tag => { return { id: tag, key: tag, show: true } }) : [];
    this.tags = qDetail.tags ? qDetail.tags.map(tag => { return { id: tag, key: tag, show: true } }) : [];
  }

  viewQuestion(item) {
    this.question
      .getPreViewquestionWithAnswer(item.id)
      .subscribe((response: any) => {
        this.modalService.create({
          nzContent: QuestionansPreviewComponent,
          nzWidth: "800",
          nzFooter: null,
          nzComponentParams: {
            qDetail: response,
            assembly: response.assemblyValue,
            session: response.sessionValue,
            // ministersubject: ministersubject ? ministersubject.titleInMalayalam : "",
            portFolio: response.portfolio ? response.portfolio : "",
          },
        });
      });
  }

}
