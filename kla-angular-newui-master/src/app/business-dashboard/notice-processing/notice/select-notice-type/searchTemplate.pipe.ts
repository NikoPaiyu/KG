import { PipeTransform, Pipe } from "@angular/core";

@Pipe({ name: "seacrchTemplate" })
export class SearchTemplatePipe implements PipeTransform {
  transform(array: any[], searchParam: string) {
    let tempStoredCharacters = array;
    return tempStoredCharacters
      ? tempStoredCharacters.filter((element) =>
          element.name.toLowerCase().includes(searchParam.toLowerCase())
        )
      : "";
  }
}
