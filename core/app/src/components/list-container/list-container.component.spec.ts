import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ListcontainerUiComponent} from './list-container.component';
import {TableUiModule} from '@components/table/table.module';
import {WidgetUiModule} from '@components/widget/widget.module';
import {AngularSvgIconModule} from 'angular-svg-icon';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';


describe('ListcontainerUiComponent', () => {
    let component: ListcontainerUiComponent;
    let fixture: ComponentFixture<ListcontainerUiComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                TableUiModule,
                WidgetUiModule,
                AngularSvgIconModule,
                HttpClientTestingModule,
                BrowserAnimationsModule
            ],
            declarations: [ListcontainerUiComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ListcontainerUiComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
});
