import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NgxTransitionContentPage, NgxTransitionContentComponent } from "./ngx-transition-content.component";

@NgModule({
  declarations: [NgxTransitionContentComponent, NgxTransitionContentPage],
  imports: [CommonModule],
  exports: [NgxTransitionContentComponent, NgxTransitionContentPage],
})
export class NgxTransitionContentModule {}
