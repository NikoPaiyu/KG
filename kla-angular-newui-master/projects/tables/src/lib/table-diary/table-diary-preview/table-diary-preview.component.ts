import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'tables-table-diary-preview',
  templateUrl: './table-diary-preview.component.html',
  styleUrls: ['./table-diary-preview.component.css']
})
export class TableDiaryPreviewComponent implements OnInit {
  modules: any;
  @Input() diaryData;
  buttonList = [
    { title: "Diary Note", code: "DIARY_NOTE", id: 5, color: "magenta" },
    { title: "Point of Order", code: "POINT_OF_ORDER", id: 11, color: "cyan" },
    { title: "Personal Explanation", code: "EXPLANATION", id: 12, color: "geekblue" },
    { title: "Intervention", code: "INTERVENTION", id: 13, color: "purple" },
    { title: "Supplimentary", code: "SUPPLIMENTARY", id: 14, color: "yellow" }
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
   getTime(diaryTime){
    var time = new Date(diaryTime);
    var hours = time.getHours();
    let minutes = time.getMinutes() as any;
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
   }
}
