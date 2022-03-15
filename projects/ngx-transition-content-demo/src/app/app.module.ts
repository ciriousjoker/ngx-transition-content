import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgxTransitionContentModule } from "projects/ngx-transition-content/src/lib/ngx-transition-content.module";

import { AppComponent } from "./app.component";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, BrowserAnimationsModule, NgxTransitionContentModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
