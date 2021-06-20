import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PmbrResolutionContentService {

  constructor() { }
  processBillContent(blocks) {
    const data: [] = blocks;
    let htmlContent = '';
    data.forEach(el => {
      const element = el as any;
      if (element.content) {
        htmlContent = htmlContent + this.replaceCode(element, 0);
      }
      if (element.subBlockDto && element.subBlockDto.length > 0) {
        const secElementCollection = element.subBlockDto;
        secElementCollection.forEach(elsec => {
          if (elsec.content) {
            htmlContent = htmlContent + this.replaceCode(elsec, 10);
          }
          if (elsec.subBlockDto && elsec.subBlockDto.length > 0) {
            const turElementCollection = elsec.subBlockDto;
            turElementCollection.forEach(eltur => {
              if ((eltur as any).content) {
                htmlContent = htmlContent + this.replaceCode(eltur, 20);
              }
              if (eltur.subBlockDto && eltur.subBlockDto.length > 0) {
                const quadElementCollection = eltur.subBlockDto;
                quadElementCollection.forEach(elquad => {
                  if ((elquad as any).content) {
                    htmlContent = htmlContent + this.replaceCode(elquad, 30);
                  }
                  if (elquad.subBlockDto && elquad.subBlockDto.length > 0) {
                    const pentaElementCollection = elquad.subBlockDto;
                    pentaElementCollection.forEach(elpenta => {
                      if ((elpenta as any).content) {
                        htmlContent = htmlContent + this.replaceCode(elpenta, 40);
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
    return htmlContent;
  }

  replaceCode(element, indentCount) {
    const htmlString = element.type.template;
    const elementType = element.type.code;
    let tempHtml = htmlString.replace('[indent-count]', `indent-${indentCount}`);
    if (elementType == "TABLE" || elementType == "SCHEDULE") {
      tempHtml = this.jsonToHtmlTable(element);
    }
    else {
      tempHtml = tempHtml.replace('[Content]', element.content);
    }

    //tempHtml = tempHtml.replace('([Index])', element.indexValue + '.');
    // tempHtml = tempHtml.replace('[Index]', element.indexValue + '.');
    //tempHtml = tempHtml.replace('Section [IndexValue]', `${element.type.name} ${element.indexValue}`);
    //tempHtml = tempHtml.replace('Clause [IndexValue]', `${element.type.name} ${element.indexValue}`);
    // tempHtml = tempHtml.replace('Extract [IndexValue]', `${element.type.name} ${element.indexValue}`);
    // tempHtml = tempHtml.replace('[IndexValue]', `${element.type.name} ${element.indexValue}`);
    // tempHtml = tempHtml.replace('[Heading]', `${element.type.name}`);
    // tempHtml = tempHtml.replace('[Extract Heading]', `Exctract from ${element.referencedBillTitle}`);
    return tempHtml;
  }

  jsonToHtmlTable(element) {
    const convertedJson = JSON.parse(element.content);
    let returnHtml = `<div class="row indent-10 marginbtm-15"><div class="col max-num">[Index]</div><div class="col"> <table class="width-100 custom_tb">`;
    convertedJson.forEach(el => {
      returnHtml = returnHtml.concat(`<tr>`);
      el.columns.forEach(elsec => {
        returnHtml = returnHtml.concat(`<td colspan="${elsec.colSpan}" rowspan="${elsec.rowSpan}">${elsec.content}</td>`)
      });
      returnHtml = returnHtml.concat(`</tr>`);
    });
    returnHtml = returnHtml.concat(`</table></div><div class="col max-clause"><span>[IndexValue]</span></div></div>`);
    return returnHtml;
  }
}
