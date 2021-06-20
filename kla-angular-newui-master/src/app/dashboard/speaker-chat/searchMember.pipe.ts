import { PipeTransform, Pipe } from "@angular/core";

@Pipe({ name: "searchMember" })
export class SearchMemberPipe implements PipeTransform {
  transform(array: any[], searchText: string) {
    let tempStoredCharacters = array;
    return tempStoredCharacters
      ? tempStoredCharacters.filter(
          element =>
            element.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
            element.malayalamFullName
              .toLowerCase()
              .includes(searchText.toLowerCase())
        )
      : "";
  }
}
