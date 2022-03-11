import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NgxTransitionContentComponent } from "./ngx-transition-content.component";

describe("NgxTransitionContentComponent", () => {
  let component: NgxTransitionContentComponent;
  let fixture: ComponentFixture<NgxTransitionContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NgxTransitionContentComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxTransitionContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
