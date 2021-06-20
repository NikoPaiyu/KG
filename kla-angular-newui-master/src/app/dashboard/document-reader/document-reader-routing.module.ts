import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DocumentReaderComponent } from "./document-reader.component";
import { ReadDocumentComponent } from "./read-document/read-document.component";
const routes: Routes = [
  {
    path: "",
    component: DocumentReaderComponent,
    children: [{ path: "", component: ReadDocumentComponent }]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentReaderRoutingModule {}
