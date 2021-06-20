import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any[], statusText: string,propName: string): any {
    console.log(value);
    if(value.length === 0){
      return value;
    }
    if(!value){
      return [];
    }
    return value.filter(item => {
      if (item && item[propName]) {
        return String(item[propName]).toLowerCase().includes(statusText);
      }
      return false;
    });
  }

}
