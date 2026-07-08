import { Component, provideZonelessChangeDetection, signal, Type } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NgxTransitionContentComponent, NgxTransitionContentPage } from "./ngx-transition-content.component";

@Component({
  selector: "test-transition-probe",
  template: "<ng-content />",
  standalone: true,
})
class TransitionProbeComponent {
  static created = 0;
  static destroyed = 0;

  constructor() {
    TransitionProbeComponent.created += 1;
  }

  ngOnDestroy() {
    TransitionProbeComponent.destroyed += 1;
  }
}

@Component({
  template: `
    <ngx-transition-content [slot]="slot()" [durationFade]="10" [durationHeight]="20">
      <ng-template ngx-transition-content-page>
        <test-transition-probe class="page-one">One</test-transition-probe>
      </ng-template>

      <ng-template ngx-transition-content-page>
        <test-transition-probe class="page-two">Two</test-transition-probe>
      </ng-template>
    </ngx-transition-content>
  `,
  imports: [NgxTransitionContentComponent, NgxTransitionContentPage, TransitionProbeComponent],
  standalone: true,
})
class DefaultHostComponent {
  slot = signal(0);
}

@Component({
  template: `
    <ngx-transition-content [slot]="slot()" [durationFade]="10" [durationHeight]="20" keepViewsAlive>
      <ng-template ngx-transition-content-page>
        <test-transition-probe class="page-one">One</test-transition-probe>
      </ng-template>

      <ng-template ngx-transition-content-page>
        <test-transition-probe class="page-two">Two</test-transition-probe>
      </ng-template>
    </ngx-transition-content>
  `,
  imports: [NgxTransitionContentComponent, NgxTransitionContentPage, TransitionProbeComponent],
  standalone: true,
})
class KeepViewsAliveHostComponent {
  slot = signal(0);
}

@Component({
  template: `
    <ngx-transition-content [slot]="slot()" [durationFade]="10" [durationHeight]="20">
      <ng-template ngx-transition-content-page>
        <test-transition-probe class="page-one">One</test-transition-probe>
      </ng-template>

      <ng-template ngx-transition-content-page keepAlive>
        <test-transition-probe class="page-two">Two</test-transition-probe>
      </ng-template>
    </ngx-transition-content>
  `,
  imports: [NgxTransitionContentComponent, NgxTransitionContentPage, TransitionProbeComponent],
  standalone: true,
})
class PageKeepAliveHostComponent {
  slot = signal(0);
}

describe("NgxTransitionContentComponent", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    TransitionProbeComponent.created = 0;
    TransitionProbeComponent.destroyed = 0;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders only the active slot by default", async () => {
    const fixture = await createFixture(DefaultHostComponent);
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector(".page-one")?.textContent).toContain("One");
    expect(compiled.querySelector(".page-two")).toBeNull();
    expect(TransitionProbeComponent.created).toBe(1);
    expect(TransitionProbeComponent.destroyed).toBe(0);
  });

  it("keeps the leaving slot mounted until the default transition finishes", async () => {
    const fixture = await createFixture(DefaultHostComponent);
    const compiled = fixture.nativeElement as HTMLElement;
    const pageOne = compiled.querySelector(".page-one") as HTMLElement;

    fixture.componentInstance.slot.set(1);
    fixture.detectChanges();

    const pageTwo = compiled.querySelector(".page-two") as HTMLElement;
    expect(compiled.querySelector(".page-one")).toBe(pageOne);
    expect(pageTwo.textContent).toContain("Two");
    expect(pageWrapper(pageOne).classList.contains("page--leaving")).toBe(true);
    expect(pageWrapper(pageTwo).classList.contains("page--entering")).toBe(true);

    vi.advanceTimersByTime(40);
    fixture.detectChanges(false);

    expect(compiled.querySelector(".page-one")).toBeNull();
    expect(compiled.querySelector(".page-two")).toBe(pageTwo);
    expect(TransitionProbeComponent.created).toBe(2);
    expect(TransitionProbeComponent.destroyed).toBe(1);
  });

  it("keeps all page views mounted when keepViewsAlive is enabled", async () => {
    const fixture = await createFixture(KeepViewsAliveHostComponent);
    const compiled = fixture.nativeElement as HTMLElement;
    const pageOne = compiled.querySelector(".page-one") as HTMLElement;
    const pageTwo = compiled.querySelector(".page-two") as HTMLElement;

    expect(pageOne.textContent).toContain("One");
    expect(pageTwo.textContent).toContain("Two");
    expect(pageWrapper(pageOne).classList.contains("page--hidden")).toBe(false);
    expect(pageWrapper(pageTwo).classList.contains("page--hidden")).toBe(true);
    expect(pageWrapper(pageTwo).getAttribute("aria-hidden")).toBe("true");

    fixture.componentInstance.slot.set(1);
    fixture.detectChanges();
    vi.advanceTimersByTime(40);
    fixture.detectChanges(false);

    expect(compiled.querySelector(".page-one")).toBe(pageOne);
    expect(compiled.querySelector(".page-two")).toBe(pageTwo);
    expect(pageWrapper(pageOne).classList.contains("page--hidden")).toBe(true);
    expect(pageWrapper(pageTwo).classList.contains("page--hidden")).toBe(false);
    expect(TransitionProbeComponent.created).toBe(2);
    expect(TransitionProbeComponent.destroyed).toBe(0);
  });

  it("keeps only pages marked with keepAlive mounted while inactive", async () => {
    const fixture = await createFixture(PageKeepAliveHostComponent);
    const compiled = fixture.nativeElement as HTMLElement;
    const pageOne = compiled.querySelector(".page-one") as HTMLElement;
    const pageTwo = compiled.querySelector(".page-two") as HTMLElement;

    expect(pageWrapper(pageOne).classList.contains("page--hidden")).toBe(false);
    expect(pageWrapper(pageTwo).classList.contains("page--hidden")).toBe(true);
    expect(TransitionProbeComponent.created).toBe(2);

    fixture.componentInstance.slot.set(1);
    fixture.detectChanges();
    vi.advanceTimersByTime(40);
    fixture.detectChanges(false);

    expect(compiled.querySelector(".page-one")).toBeNull();
    expect(compiled.querySelector(".page-two")).toBe(pageTwo);
    expect(pageWrapper(pageTwo).classList.contains("page--hidden")).toBe(false);
    expect(TransitionProbeComponent.destroyed).toBe(1);
  });
});

async function createFixture<T>(component: Type<T>): Promise<ComponentFixture<T>> {
  await TestBed.configureTestingModule({
    imports: [component],
    providers: [provideZonelessChangeDetection()],
  }).compileComponents();

  const fixture = TestBed.createComponent(component);
  fixture.detectChanges();
  return fixture;
}

function pageWrapper(element: HTMLElement): HTMLElement {
  return element.closest(".page") as HTMLElement;
}
