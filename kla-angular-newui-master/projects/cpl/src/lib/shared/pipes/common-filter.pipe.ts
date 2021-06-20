import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'commonFilter',
  pure: false
})
export class CommonFilterPipe implements PipeTransform {

  transform(items: Array<any>, category: string): Array<any> {
    return items.filter(item => item.type === category);
  }

}
