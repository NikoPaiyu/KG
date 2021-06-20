import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { QuestionService } from "../shared/question.service";
import { Observable } from "rxjs";
import { AuthService } from "src/app/auth/shared/services/auth.service";
import { Location } from "@angular/common";
import { NotificationCustomService } from 'src/app/shared/services/notification.service';
import { NzModalService } from 'ng-zorro-antd';
import { QuestionansPreviewComponent } from '../shared/component/questionans-preview/questionans-preview.component';
import * as _ from "lodash";
@Component({
  selector: 'app-question-check-duplicate',
  templateUrl: './question-check-duplicate.component.html',
  styleUrls: ['./question-check-duplicate.component.scss']
})
export class QuestionCheckDuplicateComponent implements OnInit {
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
  upper = ["A", "B", "C", "D", "E", "F", "G", "H"];
  qDetail;
  headingMatchData = { keywords: [], matches: [] };
  clauseMatchData = { keywords: [], matches: [] };
  tagMatchData = { keywords: [], matches: [] };
  subsubjectMatchData = { keywords: [], matches: [] };
  questionID;
  primaryMember;
  assemblySession: object = [];
  statusParam = "";
  constructor(
    private question: QuestionService,
    private route: ActivatedRoute,
    private auth: AuthService,
    private location: Location,
    private notify: NotificationCustomService,
    private modalService: NzModalService
  ) {
  }

  ngOnInit(): void {
    this.primaryMember = this.auth.getCurrentUser();
    this.route.params.subscribe((params) => {
      if (params["id"]) {
        this.statusParam = params.status;
        this.questionID = params["id"];
        this.getEditQuestion();
      }
    });
  }

  getAssemblySession() {
    this.question.getAllAssemblyAndSession().subscribe((res) => {
      if (res) {
        this.assemblySession = res;
          this.assemblySession["assembly"].currentassemblyLabel =  this.assemblySession["assembly"].find(
            (item) => item.id === this.qDetail.question.assemblyId
          ).assemblyId;
          this.assemblySession["assembly"].currentassembly =  this.assemblySession["assembly"].find(
            (item) => item.id === this.qDetail.question.assemblyId
          ).id;
          this.assemblySession["session"].currentsessionLabel =  this.assemblySession["session"].find(
            (item) => item.id === this.qDetail.question.sessionId
          ).sessionId;
          this.assemblySession["session"].currentsession =  this.assemblySession["session"].find(
            (item) => item.id === this.qDetail.question.sessionId
          ).id;
        }
    });
  }

  getEditQuestion() {
    this.question
      .getView(this.questionID, this.auth.getCurrentUser().userId)
      .subscribe((response) => {
        this.qDetail = response;
        this.getAssemblySession();
        this.getDesignationData().then((value) =>
          new Observable((execute) => {
            execute.next(this._setMinisterData(response));
            execute.next(this._setMinisterSubSubjectData());
            execute.next(this._setClubbedMemberData(response));
            execute.next(this._setSearchData(response));
            execute.complete();
          }).subscribe((res) => { })
        );
      });
  }

  async getDesignationData() {
    if (this.qDetail.question.questionDate == null) {
      this.qDetail.portfolio = [];
      return;
    }
    this.question
      .getDesignationList(this.qDetail.question.questionDate)
      .subscribe((designation) => {
        this.qDetail.portfolio = designation ? designation : [];

        let portfolio = this.qDetail.portfolio ? this.qDetail.portfolio : [];
        portfolio.forEach((element) => {
          if (element.name) {
            element.name = element.name.replace(/\s+/g, " ");
          }
        });
        portfolio = portfolio.filter(
          (v, i, a) => a.findIndex((t) => t.name === v.name) === i
        );
        portfolio.sort((a, b) => (a.name > b.name ? 1 : -1));

        if (this.qDetail.question.respondentMemberId) {
          this.qDetail.portfolio = portfolio.find(
            (o) => o.id === this.qDetail.question.respondentMemberId
          );
        }

        if (this.qDetail.question.respondentMemberId == null) {
          this.qDetail.ministerSubject = [];
          return;
        }
        this.question
          .getMinisterSubject(this.qDetail.question.respondentMemberId)
          .subscribe((ministersub) => {
            this.qDetail.ministerSubject = ministersub ? ministersub : [];

            let ministerSubjects = this.qDetail.ministerSubject
              ? this.qDetail.ministerSubject
              : [];
            ministerSubjects.sort((a, b) =>
              a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1
            );

            if (this.qDetail.question.ministerSubjectId) {
              this.qDetail.ministerSubject = ministerSubjects.find(
                (o) => o.id === this.qDetail.question.ministerSubjectId
              );
            }
          });
      });
  }
  _setClubbedMemberData(_qDetail) {
    const newArr = [];
    _qDetail.clubbableMembers = _qDetail.clubbableMembers
      ? _qDetail.clubbableMembers.filter(
        (n) =>
          !this.qDetail.question.clubbingDetails.some(
            (n2) => n.memberIdTo === n2.memberId
          )
      )
      : [];
    _qDetail.clubbableMembers.forEach((element) => {
      newArr.push({
        memberId: element.memberIdTo,
        memberName: element.memberTo.details.fullName,
      });
    });
    _qDetail.clubbableMembers = newArr;
  }
  _setMinisterData(_qDetail) {
    let ministerSubjects = _qDetail.ministerSubjects
      ? _qDetail.ministerSubjects
      : [];
    ministerSubjects.sort((a, b) =>
      a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1
    );
    let portfolio = _qDetail.portfolio ? _qDetail.portfolio : [];
    portfolio.forEach((element) => {
      if (element.name) {
        element.name = element.name.replace(/\s+/g, " ");
      }
    });
    portfolio = portfolio.filter(
      (v, i, a) => a.findIndex((t) => t.name === v.name) === i
    );
    portfolio.sort((a, b) => (a.name > b.name ? 1 : -1));
    if (this.qDetail.question.respondentMemberId) {
      _qDetail.portfolio = portfolio.find(
        (o) => o.id === this.qDetail.question.respondentMemberId
      );
    }
    if (this.qDetail.question.ministerSubjectId) {
      _qDetail.ministerSubjects = ministerSubjects.find(
        (o) => o.id === this.qDetail.question.ministerSubjectId
      );
    }
  }
  _setMinisterSubSubjectData() {
    if (this.qDetail.ministerSubjects && this.qDetail.ministerSubjects.id) {
      let ministerSubSubject = this.qDetail.ministerSubjects.ministerSubSubjects;
      this.subSubjectCombo = ministerSubSubject.map(sub => sub.title);
      let sub = ministerSubSubject.find(element => element.id == this.qDetail.question.ministerSubSubjectId);
      if (sub) {
        this.qDetail.question.ministerSubSubjectName = sub.title;
        this.searchSubsubjectKeyWord([this.qDetail.question.ministerSubSubjectName], [this.qDetail.question.ministerSubSubjectId])
      }
    }
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
      this.question.getHeadingDuplicates(this.headingkeywords.map(ele => ele.word), this.questionID).subscribe((res: any) => {
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
      this.question.getClauseDuplicates(this.clausekeywords.map(ele => ele.word), this.questionID).subscribe((res: any) => {
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
      this.question.getSubsubjectDuplicates(this.subsubjectkeywords, subsubjectIds, this.questionID).subscribe((res: any) => {
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
      this.question.getTagDuplicates(this.tagkeywords.map(ele => ele.word), this.questionID).subscribe((res: any) => {
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
    this.headingKeyCombos.push({ id: qDetail.question.id, key: qDetail.question.heading, show: true });
    this.headings.push({ id: qDetail.question.id, key: qDetail.question.heading, show: true });
    this.clauseKeyCombos = qDetail.question.clauses ? qDetail.question.clauses.map(clause => { return { id: clause.id, key: clause.clause, show: true } }) : [];
    this.clauses = qDetail.question.clauses ? qDetail.question.clauses.map(clause => { return { id: clause.id, key: clause.clause, show: true } }) : [];
    this.tagKeyCombos = qDetail.question.tags ? this.qDetail.question.tags.map(tag => { return { id: tag.tagOrder, key: tag.tag, show: true } }) : [];
    this.tags = qDetail.question.tags ? this.qDetail.question.tags.map(tag => { return { id: tag.tagOrder, key: tag.tag, show: true } }) : [];
  }
  resetClause() {
    const qDetail = this.qDetail;
    this.clausekeywords = [];
    this.clauseKeyCombos = qDetail.question.clauses ? qDetail.question.clauses.map(clause => { return { id: clause.id, key: clause.clause, show: true } }) : [];
    this.clauses = qDetail.question.clauses ? qDetail.question.clauses.map(clause => { return { id: clause.id, key: clause.clause, show: true } }) : [];
    this.clauseMatchData.matches = [];
  }
  resetHeading() {
    const qDetail = this.qDetail;
    this.headingkeywords = [];
    this.headings = [];
    this.headingKeyCombos = [];
    this.headingKeyCombos.push({ id: qDetail.question.id, key: qDetail.question.heading, show: true });
    this.headings.push({ id: qDetail.question.id, key: qDetail.question.heading, show: true });
    this.headingMatchData.matches = [];
  }
  resetTags() {
    const qDetail = this.qDetail;
    this.tagkeywords = [];
    this.tagKeyCombos = qDetail.question.tags ? this.qDetail.question.tags.map(tag => { return { id: tag.tagOrder, key: tag.tag, show: true } }) : [];
    this.tags = qDetail.question.tags ? this.qDetail.question.tags.map(tag => { return { id: tag.tagOrder, key: tag.tag, show: true } }) : [];
    this.tagMatchData.matches = [];
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
