import { PipeTransform, Pipe } from "@angular/core";

@Pipe({ name: "filterbusiness" })
export class FilterBusinessLines implements PipeTransform {
  transform(array: any[], searchText: number) {
    if (!searchText) return array;
    let tempStoredCharacters = array;
    return tempStoredCharacters
      ? tempStoredCharacters.filter(element => element.businessId == searchText)
      : "";
  }
}
