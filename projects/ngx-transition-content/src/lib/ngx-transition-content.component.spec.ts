import { Component, provideZonelessChangeDetection, signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NgxTransitionContentComponent, NgxTransitionContentPage } from "./ngx-transition-content.component";

@Component({
  imports: [NgxTransitionContentComponent, NgxTransitionContentPage],
  template: `
    <ngx-transition-content [slot]="slot()" [durationFade]="10" [durationHeight]="20">
      <ng-template ngx-transition-content-page>
        <p class="page-one">One</p>
      </ng-template>

      <ng-template ngx-transition-content-page>
        <p class="page-two">Two</p>
      </ng-template>
    </ngx-transition-content>
  `,
  standalone: true,
})
class HostComponent {
  slot = signal(0);
}

describe("NgxTransitionContentComponent", () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    vi.useFakeTimers();

    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the active slot", () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector(".page-one")?.textContent).toContain("One");
    expect(compiled.querySelector(".page-two")).toBeNull();
  });

  it("keeps the leaving slot mounted until the transition finishes", () => {
    fixture.componentInstance.slot.set(1);
    fixture.detectChanges();

    let compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector(".page-one")?.textContent).toContain("One");
    expect(compiled.querySelector(".page-two")?.textContent).toContain("Two");

    vi.advanceTimersByTime(40);
    fixture.detectChanges(false);

    compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector(".page-one")).toBeNull();
    expect(compiled.querySelector(".page-two")?.textContent).toContain("Two");
  });
});
