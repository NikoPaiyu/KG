import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sectionName',
  pure: false
})
export class SectionNamePipe implements PipeTransform {

  // transform(value: any, ...args: any[]): any {
  //   return null;
  // }
  transform(items: Array<any>, klaDepartments: string): Array<any> {
    return items.filter(item => item.klaSectionName === klaDepartments);
  }
}
