import { Injectable } from '@angular/core';
import { createBillModel } from '../../shared/components/create-bill-content/create-bill-content-model';
@Injectable({
  providedIn: 'root'
})
export class BillBlockService {

  constructor() { }

  listOfHoverButton(event, type) {
    switch (event) {
      case 'MARGINAL_HEADING': {
        let marginalHeadingType = createBillModel.marginalHeading;
        if (type !== 'AMENDING_BILL') {
          marginalHeadingType = marginalHeadingType.filter(f => f.code !== 'SECTION');
        }
        return marginalHeadingType;
        break;
      }
      case 'SECTION': {
        return createBillModel.section;
        break;
      }
      case 'SUB_SECTION': {
        return createBillModel.subSection;
        break;
      }
      case 'CLAUSE': {
        let clauseType = createBillModel.clause;
        if (type !== 'AMENDING_BILL') {
          clauseType = clauseType.filter(f => f.code !== 'SECTION');
        }
        return clauseType;
        break;
      }
      case 'SUB_CLAUSE': {
        return createBillModel.subClause;
        break;
      }
      case 'ITEM': {
        return createBillModel.item;
        break;
      }
      case 'SUB_ITEM': {
        return createBillModel.subItem;
        break;
      }
      case 'PROVISO': {
        return createBillModel.proviso;
        break;
      }
      case 'EXPLANATION': {
        return createBillModel.explanation;
        break;
      }
      case 'NOTE': {
        return createBillModel.note;
        break;
      }
      case 'EXTRACT': {
        return createBillModel.extract;
        break;
      }
    }
  }
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
