import { animate, AnimationEvent, style, transition, trigger } from "@angular/animations";
import { isPlatformBrowser } from "@angular/common";
import {
  Component,
  ContentChildren,
  Directive,
  ElementRef,
  Inject,
  Input,
  OnChanges,
  PLATFORM_ID,
  SimpleChange,
  SimpleChanges,
  TemplateRef,
  ViewChild,
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
 * - lock current height
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
        params: {
          duration: defaultDurationFade,
          /** The delay after which the fade starts. The element already takes up space before this delay is over! */
          delay: defaultDurationFade + defaultDurationHeight,
        },
      }),
    ]),
    trigger("leave", [
      transition(
        ":leave",
        [
          style({
            opacity: 1,
            // Since the incoming element already takes up space, we need to set the old one to absolute.
            // This prevents layout shift due to both elements taking up space within #content.
            position: "absolute",
          }),
          animate("{{duration}}ms ease-in", style({ opacity: 0 })),
        ],
        {
          params: { duration: defaultDurationFade },
        }
      ),
    ]),
  ],
})
export class NgxTransitionContentComponent implements OnChanges {
  /** A list of templates that should be transitioned between. */
  @ContentChildren(NgxTransitionContentPage, { read: TemplateRef }) templates: TemplateRef<unknown>[] = [];

  /** A wrapper around the content. It's used to measure the height that the content takes up. */
  @ViewChild("wrapperHeight") wrapperHeight?: ElementRef;

  /** A wrapper around the content. It's used to measure the height that the content takes up. */
  @ViewChild("wrapperWidth") wrapperWidth?: ElementRef;

  /** The index of the <ng-template> that's being transitioned to. */
  @Input() slot = 0;

  /** Duration in milliseconds. */
  @Input() durationFade = defaultDurationFade;

  /** Duration in milliseconds. */
  @Input() durationHeight = defaultDurationHeight;

  /** undefined means auto, otherwise number in pixels. */
  public height: number | undefined = undefined;

  /** undefined means auto, otherwise number in pixels. */
  public width: number | undefined = undefined;

  /** We have to use a proxy property here since we need to measure the height before switching the content. */
  public activeSlot = this.slot;

  /** Ignore the first entry animation via this flag. */
  public isLoaded = false;

  public get delayEnter() {
    return this.durationFade + this.durationHeight;
  }

  constructor(@Inject(PLATFORM_ID) private platformId: Record<string, unknown>) {}

  ngOnChanges(changes: SimpleChanges) {
    // We only need to do something here if the slot changes
    const changedSlot = (changes as unknown as NgxTransitionContentComponent).slot as unknown as SimpleChange;
    if (changedSlot === undefined) return;

    // Ignore the first entry animation
    if (changedSlot.firstChange) {
      // We can't use requestAnimationFrame during SSR.
      if (!isPlatformBrowser(this.platformId)) return;

      // This needs to be called delayed so the entry "animation"
      // can complete.
      requestAnimationFrame(() => {
        this.isLoaded = true;
      });
      return;
    }

    // Whenever the slot changes, animate the transition
    this.startTransition();
  }

  public onEnterDone(evt: AnimationEvent) {
    // This fires multiple times, we're only interested in the one where it's in the correct state
    if (evt.toState === ":enter") {
      // New content has completely entered the DOM and is visible.
      // The height also perfectly matches the new content, so we can restore the height to auto.
      this.height = undefined;
      this.width = undefined;
    }
  }
  public onLeaveDone(evt: AnimationEvent) {
    // This fires multiple times, we're only interested in the one where it's in the correct state
    if (evt.toState === "void") {
      // Old content has completely left the DOM and the new content
      // already takes up space in the DOM (even though it's not visible yet due to the animation delay).
      // This transitions the height to the new content's height.
      this.height = this.wrapperHeight?.nativeElement.clientHeight;
      this.width = this.wrapperWidth?.nativeElement.clientWidth;
    }
  }

  /**
   * Save the current height and switch out the content
   */
  async startTransition() {
    // Save the current height of the content element
    // This is necessary to enable a smooth transition between different height values
    this.height = this.wrapperHeight?.nativeElement.clientHeight;
    this.width = this.wrapperWidth?.nativeElement.clientWidth;

    // Change the rendered slot after the height has been measured/saved
    this.activeSlot = this.slot;
  }
}
