import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'listfilter',
  pure: false
})
export class ListFilterPipe implements PipeTransform {
  transform(items: any[], filter: any): any[] {
    if (!items || !filter) {
      return items;
    }
    // filter items array, items which match and return true will be kept, false will be filtered out
    return items.filter((item: any) => this.applyFilter(item, filter));
  }

  applyFilter(element: any, filter: any): boolean {
    for (const field in filter) {
      if (filter[field]) {
        if (field === 'noticeNumber') {
          element.clubbedMemberDetails.forEach(function (clubbed) {
            if (clubbed[field].indexOf(filter[field]) === -1) {
              return false;
            } else if (typeof filter[field] === 'number') {
              if (clubbed[field] !== filter[field]) {
                return false;
              }
            }
          });
        } else if (field === 'title') {
          if (typeof filter[field] === 'string') {
            if (element[field] && element[field].toLowerCase() !== filter[field].toLowerCase()) {
              return false;
            } else if (!element[field]) {
              return false;
            }
          } else if (typeof filter[field] === 'number') {
            if (element[field] !== filter[field]) {
              return false;
            } else if (!element[field]) {
              return false;
            }
          }
        }
        else if (field === 'name') {
          if (typeof filter[field] === 'string') {
            if (element.ministerSubject &&
              element.ministerSubject[field].toLowerCase() !==
              filter[field].toLowerCase()
            ) {
              return false;
            } else if (!element.ministerSubject) {
              return false;
            }
          } else if (typeof filter[field] === 'number') {
            if (element.ministerSubject[field] !== filter[field]) {
              return false;
            }
          }
        } else {
          if (typeof filter[field] === 'string') {
            if (element[field] &&
              element[field]
                .toLowerCase()
                .indexOf(filter[field].toLowerCase()) === -1
            ) {
              return false;
            } else if (!element[field]) {
              return false;
            }
          } else if (typeof filter[field] === 'number') {
            if (element[field] !== filter[field]) {
              return false;
            }
          }
        }
      }
    }
    return true;
  }
  _returnStatus(filter, element, field) {
    switch (field) {
      case 'noticeNumber':
        element.clubbedMemberDetails.forEach(function (clubbed) {
          if (clubbed[field].indexOf(filter[field]) === -1) {
            return false;
          } else if (typeof filter[field] === 'number') {
            if (clubbed[field] !== filter[field]) {
              return false;
            }
          }
        });
        break;
      case 'title':
        if (typeof filter[field] === 'string') {
          if (element[field] && element[field].toLowerCase() !== filter[field].toLowerCase()) {
            console.log(element);
            return false;
          }
        } else if (typeof filter[field] === 'number') {
          if (element[field] !== filter[field]) {
            return false;
          }
        }

        break;
      case 'name':
        break;
      case 'status':
        break;
      default:
        if (typeof filter[field] === 'string') {
          if (element[field] &&
            element[field]
              .toLowerCase()
              .indexOf(filter[field].toLowerCase()) === -1
          ) {
            return false;
          }
        } else if (typeof filter[field] === 'number') {
          if (element[field] !== filter[field]) {
            return false;
          }
        }
        break;
    }
  }
}
