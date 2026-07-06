import { Component, signal } from "@angular/core";
import { NgxTransitionContentComponent, NgxTransitionContentPage } from "ngx-transition-content";

@Component({
  selector: "app-root",
  imports: [NgxTransitionContentComponent, NgxTransitionContentPage],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
  standalone: true,
})
export class AppComponent {
  public readonly slot = signal(0);

  public toggleSlot() {
    this.slot.update((slot) => (slot === 1 ? 0 : 1));
  }
}
