import { PipeTransform, Pipe } from "@angular/core";

@Pipe({ name: "filterMember" })
export class FilterPlayingMember implements PipeTransform {
  transform(array: any[], currentBusiness: any) {
    if (!currentBusiness) return array;
    let tempStoredCharacters = array;
    if (currentBusiness.questionbtn == true) {
      return tempStoredCharacters
        ? tempStoredCharacters.filter(
            element => element.value != currentBusiness.primaryMemberId
          )
        : "";
    } else if (currentBusiness.answerbtn == true) {
      return tempStoredCharacters
        ? tempStoredCharacters.filter(
            element => element.value != currentBusiness.secondaryMemberId
          )
        : "";
    } else return tempStoredCharacters;
  }
}
