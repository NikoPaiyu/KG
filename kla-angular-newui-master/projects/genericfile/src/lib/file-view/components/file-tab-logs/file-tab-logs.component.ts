import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "generic-file-tab-logs",
  templateUrl: "./file-tab-logs.component.html",
  styleUrls: ["./file-tab-logs.component.css"],
})
export class FileTabLogsComponent implements OnInit {
  @Input() logDetails;
  // logDetails: any = [];
  constructor() {}

  ngOnInit() {}
}
