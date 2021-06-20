import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'selectTemplate'
})
export class SelectTemplatePipe implements PipeTransform {

  transform(array: any[], searchParam: string): any {
    const tempStoredCharacters = array;
    return tempStoredCharacters
      ? tempStoredCharacters.filter((element) =>
          element.name.toLowerCase().includes(searchParam.toLowerCase())
        )
      : '';
  }

}
