import { Component, OnInit, Inject, Input } from '@angular/core';
import { forkJoin } from 'rxjs';
import { BillcommonService } from '../../../shared/services/billcommon.service';
import { Router, Route, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'lib-priority-list-view',
  templateUrl: './priority-list-view.component.html',
  styleUrls: ['./priority-list-view.component.css']
})
export class PriorityListViewComponent implements OnInit {

  @Input() priorityListResponse;
  @Input() currentAssignee;
  ckeConfig: any;
  public Editor: any;
  assemblies = [];
  sessions = [];
  constructor(
    @Inject('editor') public ckEditor,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.Editor = ckEditor;
  }

  ngOnInit() {
    this.setEditorConfig();

  }

  setEditorConfig() {
    this.ckeConfig = {
      toolbar: [
        "bold",
        "italic",
        "underline",
        "bulletedList",
        "numberedList",
        "alignment"
      ],
      placeholder: "Enter Header Here...",
      title: {
        isEnabled: false,
      },
    };
  }

  ReOrderClick() {
    let path = "../bill/view-priority-list";
    this.router.navigate([path, this.priorityListResponse.id], {
      relativeTo: this.route.parent,
      state: { data: { currentAssignee: this.currentAssignee } }
    });
  }
  romanize(num) {
    if (isNaN(num))
        return NaN;
    let digits = String(+num).split(""),
        key = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM",
            "", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC",
            "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"],
        roman = "",
        i = 3;
    while (i--)
        roman = (key[+digits.pop() + (i * 10)] || "") + roman;
    return Array(+digits.join("") + 1).join("M") + roman;
 }

}
