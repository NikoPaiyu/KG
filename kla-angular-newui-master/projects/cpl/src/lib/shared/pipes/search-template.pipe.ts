import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchTemplate'
})
export class SearchTemplatePipe implements PipeTransform {

  transform(array: any[], searchParam: string): any {
    const tempStoredCharacters = array;
    return tempStoredCharacters
      ? tempStoredCharacters.filter((element) =>
          element.name.toLowerCase().includes(searchParam.toLowerCase())
        )
      : '';
  }

}
