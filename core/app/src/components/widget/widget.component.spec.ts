import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {WidgetUiComponent} from './widget.component';

describe('WidgetUiComponent', () => {
  let component: WidgetUiComponent;
  let fixture: ComponentFixture<WidgetUiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WidgetUiComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
