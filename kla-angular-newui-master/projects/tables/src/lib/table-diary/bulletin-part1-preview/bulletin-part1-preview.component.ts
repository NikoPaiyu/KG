// import { Component, Input OnInit } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'tables-bulletin-part1-preview',
  templateUrl: './bulletin-part1-preview.component.html',
  styleUrls: ['./bulletin-part1-preview.component.css']
})
export class BulletinPart1PreviewComponent implements OnInit {

  modules: any;
  @Input() diaryData;
  buttonList = [
    { title: "Diary Note", code: "DIARY_NOTE", id: 5, color: "magenta" },
    { title: "Point of Order", code: "POINT_OF_ORDER", id: 11, color: "cyan" },
    { title: "Personal Explanation", code: "EXPLANATION", id: 12, color: "geekblue" },
    { title: "Intervention", code: "INTERVENTION", id: 13, color: "purple" }
];

  constructor() { }

  ngOnInit() {
    this.setEditorConfig();
  }

  setEditorConfig() {
    this.modules = {
      toolbar: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline'],
       
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
      ]
    };
  }
  getTagName(code){
    if(code){
      let finded = this.buttonList.find(element=> element.code == code)
      return finded.title
    }
   }
   getTagColor(code){
     if(code){
       let finded = this.buttonList.find(element=> element.code == code)
       return finded.color
     }
   }

   formatDate(dateString) {
    if (dateString) {
      const date = new Date(dateString);
      var day = date.getDay();
      const monthML = [
        'ജനുവരി',
      'ഫെബ്രുവരി',
      'മാർച്ച്' ,
      'ഏപ്രിൽ' ,
      'മെയ്' ,
      'ജൂൺ' ,
      'ജൂലൈ' ,
      'ഓഗസ്റ്റ്' ,
      'സെപ്റ്റംബർ' ,
      'ഒക്ടോബർ' ,
      'നവംബർ' ,
      'ഡിസംബർ'];
      var days = ["ഞായർ", "തിങ്കൾ", "ചൊവ്വ", "ബുധൻ", "വ്യാഴം", "വെള്ളി", "ശനി"];
      return date.getFullYear() + ' ' + monthML[date.getMonth()] + ' ' + date.getDate() + ', ' + days[day];
    }
  }

}




  


