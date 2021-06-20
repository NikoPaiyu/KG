import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class BillBlockService {

  constructor() { }

 
  jsonToHtmlTable(element) {
    const convertedJson = JSON.parse(element.content);
    // let returnHtml = `<div class="row indent-10 marginbtm-15"><div class="col max-num">[Index]</div><div class="col"> <table class="width-100 custom_tb">`;
    let returnHtml = `<div class="col"> <table class="width-100 custom_tb">`;
    convertedJson.forEach(el => {
      returnHtml = returnHtml.concat(`<tr>`);
      el.columns.forEach(elsec => {
        returnHtml = returnHtml.concat(`<td colspan="${elsec.colSpan}" rowspan="${elsec.rowSpan}">${elsec.content}</td>`)
      });
      returnHtml = returnHtml.concat(`</tr>`);
    });
    // returnHtml = returnHtml.concat(`</table></div><div class="col max-clause"><span>[IndexValue]</span></div></div>`);
    returnHtml = returnHtml.concat(`</table></div>`);
    return returnHtml;
  }
  
}
