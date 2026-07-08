import { CommonModule, isPlatformBrowser } from "@angular/common";
import {
  booleanAttribute,
  computed,
  Component,
  contentChildren,
  Directive,
  ElementRef,
  effect,
  inject,
  input,
  PLATFORM_ID,
  signal,
  TemplateRef,
  untracked,
  viewChild,
} from "@angular/core";

const defaultDurationFade = 300;
const defaultDurationHeight = 300;

/**
 * Mark each child <ng-template> with this directive to enable transitions.
 */
@Directive({
  selector: "[ngx-transition-content-page]",
  standalone: true,
})
export class NgxTransitionContentPage {
  /** Whether this page should stay mounted while inactive. */
  public readonly keepAlive = input(false, { transform: booleanAttribute });

  public readonly template = inject(TemplateRef<unknown>);
}

interface RenderedPage {
  page: NgxTransitionContentPage;
  slot: number;
}

/**
 * Transition between content elements.
 * Transition:
 * - lock current dimensions
 * - fade out existing content
 * - transition dimensions to the measured dimensions of the new content
 * - fade in new content
 * - restore dimensions to auto
 */
@Component({
  selector: "ngx-transition-content",
  imports: [CommonModule],
  templateUrl: "./ngx-transition-content.component.html",
  styleUrls: ["./ngx-transition-content.component.scss"],
  standalone: true,
})
export class NgxTransitionContentComponent {
  /** A list of templates that should be transitioned between. */
  protected readonly pages = contentChildren(NgxTransitionContentPage);

  /** A wrapper around the content. It is used to measure the height that the content takes up. */
  protected readonly wrapperHeight = viewChild<ElementRef<HTMLElement>>("wrapperHeight");

  /** A wrapper around the content. It is used to measure the width that the content takes up. */
  protected readonly wrapperWidth = viewChild<ElementRef<HTMLElement>>("wrapperWidth");

  /** The index of the <ng-template> that is being transitioned to. */
  public readonly slot = input(0);

  /** Fade duration in milliseconds. */
  public readonly durationFade = input(defaultDurationFade);

  /** Dimension transition duration in milliseconds. */
  public readonly durationHeight = input(defaultDurationHeight);

  /** Whether all views should stay mounted while inactive. */
  public readonly keepViewsAlive = input(false, { transform: booleanAttribute });

  /** undefined means auto, otherwise number in pixels. */
  private readonly heightState = signal<number | undefined>(undefined);
  protected readonly height = this.heightState.asReadonly();

  /** undefined means auto, otherwise number in pixels. */
  private readonly widthState = signal<number | undefined>(undefined);
  protected readonly width = this.widthState.asReadonly();

  /** We use a proxy property because dimensions must be measured before switching content. */
  protected readonly activeSlot = signal(this.slot());

  /** The previous slot stays mounted while it fades out. */
  protected readonly leavingSlot = signal<number | undefined>(undefined);

  private readonly isTransitioningState = signal(false);
  protected readonly isTransitioning = this.isTransitioningState.asReadonly();

  private readonly timers: ReturnType<typeof setTimeout>[] = [];
  private readonly platformId = inject(PLATFORM_ID);
  private hasInitializedSlot = false;

  protected readonly renderedPages = computed<RenderedPage[]>(() => {
    const activeSlot = this.activeSlot();
    const leavingSlot = this.leavingSlot();
    const keepViewsAlive = this.keepViewsAlive();

    return this.pages()
      .map((page, slot) => ({ page, slot }))
      .filter(({ page, slot }) => slot === activeSlot || slot === leavingSlot || keepViewsAlive || page.keepAlive());
  });

  protected readonly delayEnter = computed(() => this.durationFade() + this.durationHeight());

  private readonly syncSlot = effect(
    (onCleanup) => {
      onCleanup(() => this.clearTimers());

      const nextSlot = this.slot();
      untracked(() => {
        if (!this.hasInitializedSlot) {
          this.activeSlot.set(nextSlot);
          this.hasInitializedSlot = true;
          return;
        }

        this.startTransition(nextSlot);
      });
    },
    { debugName: "NgxTransitionContentComponent.syncSlot" },
  );

  public startTransition(nextSlot = this.slot()) {
    if (this.activeSlot() === nextSlot) {
      return;
    }

    if (!isPlatformBrowser(this.platformId)) {
      this.activeSlot.set(nextSlot);
      return;
    }

    this.clearTimers();

    this.heightState.set(this.wrapperHeight()?.nativeElement.clientHeight);
    this.widthState.set(this.wrapperWidth()?.nativeElement.clientWidth);
    this.leavingSlot.set(this.activeSlot());
    this.activeSlot.set(nextSlot);
    this.isTransitioningState.set(true);

    this.schedule(() => {
      this.heightState.set(this.wrapperHeight()?.nativeElement.clientHeight);
      this.widthState.set(this.wrapperWidth()?.nativeElement.clientWidth);
    }, this.durationFade());

    this.schedule(
      () => {
        this.heightState.set(undefined);
        this.widthState.set(undefined);
        this.leavingSlot.set(undefined);
        this.isTransitioningState.set(false);
      },
      this.durationFade() + this.durationHeight() + this.durationFade(),
    );
  }

  private schedule(callback: () => void, delay: number) {
    const timeout = setTimeout(
      () => {
        callback();
      },
      Math.max(0, delay),
    );
    this.timers.push(timeout);
  }

  private clearTimers() {
    for (const timer of this.timers) {
      clearTimeout(timer);
    }

    this.timers.length = 0;
  }
}
