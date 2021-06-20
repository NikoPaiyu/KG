import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { GenericfileService } from "../shared/services/genericfile.service";

@Component({
  selector: "genericfile-file-view",
  templateUrl: "./file-view.component.html",
  styleUrls: ["./file-view.component.scss"],
})
export class FileViewComponent implements OnInit {
  fileDetails: any = [];
  responseAvailable: boolean = false;
  notesInfo: any = [];
  fileId: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private file: GenericfileService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.fileId = params.id;
      this.getGenericFileByFileId(this.fileId);
    });
  }
  getGenericFileByFileId(fileId) {
    this.responseAvailable = false;
    this.file.getGenericFileById(fileId).subscribe((res: any) => {
      this.responseAvailable = true;
      this.fileDetails = res.response;
    });
  }
}
