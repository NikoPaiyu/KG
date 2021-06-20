import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "committee-list-assurance",
  templateUrl: "./list-assurance.component.html",
  styleUrls: ["./list-assurance.component.css"],
})
export class ListAssuranceComponent implements OnInit {
  assuranceData: any = [
    {
      no: "No 1",
      date: "26-07-2021",
      honableMember: "Vijayan",
      session: "one",
      fileNo: "two",
      status: "SAVED",
    },
    {
      no: "No 2",
      date: "Jim Green",
      session: "Three",
      honableMember: "BalaKrishnan",
      fileNo: "four",
      status: "SAVED",
    },
    {
      no: "No 3",
      date: "Joe Black",
      session: "five",
      honableMember: "Thomas",
      fileNo: "six",
      status: "SAVED",
    },
  ];
  tempAssuranceData;
  constructor(private router: Router) {}

  ngOnInit() {}
  createAssurance() {
    this.router.navigate(["business-dashboard/committee/create-assurance"]);
  }
  searchList(searchText) {
    this.tempAssuranceData = this.assuranceData;
    if (searchText) {
      this.assuranceData = this.tempAssuranceData.filter(
        (element) =>
          (element.no &&
            element.no.toLowerCase().includes(searchText.toLowerCase())) ||
          (element.date &&
            element.date.toLowerCase().includes(searchText.toLowerCase())) ||
          (element.honableMember &&
            element.honableMember
              .toLowerCase()
              .includes(searchText.toLowerCase())) ||
          (element.session &&
            element.session.toLowerCase().includes(searchText.toLowerCase())) ||
          (element.status &&
            element.status.toLowerCase().includes(searchText.toLowerCase())) ||
          (element.fileNo &&
            element.fileNo.toLowerCase().includes(searchText.toLowerCase()))
      );
    } else {
      this.assuranceData = this.tempAssuranceData;
    }
  }
}
