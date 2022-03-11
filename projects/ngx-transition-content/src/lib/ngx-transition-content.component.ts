import { animate, style, transition, trigger } from "@angular/animations";
import {
  Component,
  ContentChildren,
  Directive,
  ElementRef,
  Input,
  OnChanges,
  TemplateRef,
  ViewChild
} from "@angular/core";

const defaultDurationFade = 300;
const defaultDurationHeight = 300;

/**
 * Mark each child <ng-template> with this directive to enable transitions.
 */
@Directive({ selector: "[ngx-transition-content-page]" })
export class NgxTransitionContentPage {}

/**
 * Transition between content elements.
 * Transition:
 * - fix current height
 * - fade out existing content
 * - transition height to the measured height of the new content
 * - fade in new content
 * - restore height to auto
 */
@Component({
  selector: "ngx-transition-content",
  templateUrl: "./ngx-transition-content.component.html",
  styleUrls: ["./ngx-transition-content.component.scss"],
  animations: [
    trigger("enter", [
      transition(":enter", [style({ opacity: 0 }), animate("{{duration}}ms {{delay}}ms ease-out", style({ opacity: 1 }))], {
        params: { duration: defaultDurationFade, delay: defaultDurationFade + defaultDurationHeight },
      }),
    ]),
    trigger("leave", [
      transition(":leave", [style({ opacity: 1 }), animate("{{duration}}ms ease-in", style({ opacity: 0 }))], {
        params: { duration: defaultDurationFade },
      }),
    ]),
  ],
})
export class NgxTransitionContentComponent implements OnChanges {
  @ContentChildren(NgxTransitionContentPage, { read: TemplateRef }) templates: TemplateRef<any>[] = [];

  @ViewChild("content") content?: ElementRef;

  @Input() slot = 0;

  /** Duration in milliseconds. */
  @Input() durationFade = defaultDurationFade;

  /** Duration in milliseconds. */
  @Input() durationHeight = defaultDurationHeight;

  /** undefined means auto, otherwise number in pixels. */
  public height: number | undefined = undefined;

  /** Ignore the first entry animation via this flag. */
  private isLoaded = false;

  public get delayEnter() {
    return this.durationFade + this.durationHeight;
  }

  /** Forcefully hide the entering element until it's ready to be faded in.
   * Otherwise, the element will take up space even though the :enter animation is delayed.
   */
  public isEntering = true;

  constructor() {}

  async updateHeight() {
    this.height = this.content?.nativeElement.clientHeight;

    this.isEntering = false;
    setTimeout(() => {
      this.isEntering = true;
    }, this.durationFade);

    setTimeout(() => {
      this.height = this.content?.nativeElement.clientHeight;
      // Short delay is necessary to wait for the new content and
      // make sure the height measurement is correct.
      // This is hacky af, but it works without adding a dependency.
      // TODO: Find a better way to do this.
    }, this.durationFade + 50);

    setTimeout(() => {
      this.height = undefined;
    }, 2 * this.durationFade + this.durationHeight);
  }

  ngOnChanges() {
    // Ignore the first entry animation
    if (!this.isLoaded) {
      this.isLoaded = true;
      return;
    }
    this.updateHeight();
  }
}
