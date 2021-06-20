import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { NgxSpinnerModule } from "ngx-spinner";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import {
  HttpClientModule,
  HTTP_INTERCEPTORS,
  HttpClient
} from "@angular/common/http";
import { AuthService } from "./auth/shared/services/auth.service";
import { RequestInterceptor } from "./auth/shared/services/request-interceptor.service";
import { NgZorroAntdModule, NZ_I18N, en_GB } from "ng-zorro-antd";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AuthGuardService } from "./auth/shared/services/auth-guard.service";
import { PdfViewerComponent } from "./shared/components/pdf-viewer/pdf-viewer.component";
import { PdfJsViewerModule } from "ng2-pdfjs-viewer";
import { ResetPasswordComponent } from "./shared/components/reset-password/reset-password.component";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import {environment} from '../environments/environment';
import { FullCalendarModule } from '@fullcalendar/angular';
import * as Editor from '../assets/ckeditor5/build/ckeditor';
import { NotificationCustomService } from './shared/services/notification.service';
import { DatePipe } from "@angular/common";
import { PdfViewerModule } from "ng2-pdf-viewer";





export const createTranslateLoader = (http: HttpClient) => {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
};

@NgModule({
  declarations: [AppComponent, PdfViewerComponent, ResetPasswordComponent ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgxSpinnerModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    PdfJsViewerModule,
    PdfViewerModule,
    FullCalendarModule,
    TranslateModule.forRoot({
      useDefaultLang: true,
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  entryComponents: [PdfViewerComponent, ResetPasswordComponent],
  providers: [
    AuthService,
    DatePipe,
    AuthGuardService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true
    },
    { provide: NZ_I18N, useValue: en_GB },
    { provide: 'authService', useExisting: AuthService },
    { provide: 'environment', useValue: environment },
    { provide: 'editor', useValue: Editor },
    { provide: 'notify', useValue: NotificationCustomService },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
