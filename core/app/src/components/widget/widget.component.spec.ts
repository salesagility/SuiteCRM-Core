import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {WidgetUiComponent} from './widget.component';
import {AngularSvgIconModule} from "angular-svg-icon";
import {ChartUiModule} from '@components/chart/chart.module';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

describe('WidgetUiComponent', () => {
  let component: WidgetUiComponent;
  let fixture: ComponentFixture<WidgetUiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularSvgIconModule,
        ChartUiModule,
        HttpClientTestingModule,
        BrowserAnimationsModule
      ],
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
