import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusFilter',
  pure: false
})
export class StatusFilterPipe implements PipeTransform {

  transform(items: Array<any>, status: string): Array<any> {
    return items.filter(item => item !== status);
  }

}
