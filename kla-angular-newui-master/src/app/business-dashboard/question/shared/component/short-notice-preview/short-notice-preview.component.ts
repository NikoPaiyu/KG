import { Component, OnInit, Input } from '@angular/core';
import * as moment from "moment";

@Component({
  selector: 'app-short-notice-preview',
  templateUrl: './short-notice-preview.component.html',
  styleUrls: ['./short-notice-preview.component.scss']
})
export class ShortNoticePreviewComponent implements OnInit {
  @Input() previewData;
  @Input() assembly;
  @Input() session;
  @Input() hidePrint;

  clauseNo = ["എ", "ബി", "സി", "ഡി", "ഇ", "എഫ്", "ജി", "എച്ച്"];
  constructor() { }

  ngOnInit() {
    this._setMinisterData(this.previewData);
    this.validQuestionDate();
    let bodyControl = document.getElementsByTagName("body")[0];
    bodyControl.classList.add("questionbooklet");
  }
  _setMinisterData(qDetail) {
    let portfolio = qDetail["portfolio"] ? qDetail["portfolio"] : [];
    if (portfolio.length > 0) {
      portfolio = portfolio.find(
        (o) => o.id === this.previewData.question.respondentMemberId
      );
      this.previewData.question.nameInMalayalam = portfolio.nameInMalayalam;
    }

  }
  validQuestionDate() {
    let date = this.previewData.question.questionDate;
    if (moment(date, 'DD-MM-YYYY', true).isValid()) {
      this.previewData.question.questionDate =
        this.previewData.question.questionDate.split("-").reverse().join("-");
    }
  }
  getFormattedDate(questionDate) {
    var monthArr = [
      "ജനുവരി",
      "ഫെബ്രുവരി",
      "മാർച്ച്",
      "ഏപ്രിൽ",
      "മേയ്",
      "ജൂൺ",
      "ജൂലൈ",
      "ഓഗസ്റ്റ്",
      "സെപ്റ്റംബർ",
      "ഒക്‌ടോബർ",
      "നവംബർ",
      "ഡിസംബർ",
    ];
    var days = ["ഞായർ", "തിങ്കൾ", "ചൊവ്വ", "ബുധൻ", "വ്യാഴം", "വെള്ളി", "ശനി"];
    var todayTime = (questionDate) ? new Date(this.previewData.question.questionDate) : new Date();
    var month = todayTime.getMonth();
    var year = todayTime.getFullYear();
    var day = todayTime.getDay();
    var date = todayTime.getDate();
    return year + " " + monthArr[month] + " " + date + ", " + days[day];
  }
}
