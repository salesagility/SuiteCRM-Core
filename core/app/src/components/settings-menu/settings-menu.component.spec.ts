import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SettingsmenuUiComponent} from './settings-menu.component';
import {ColumnchooserUiModule} from '@components/columnchooser/columnchooser.module';
import {FilterUiModule} from '@components/filter/filter.module';
import {AngularSvgIconModule} from 'angular-svg-icon';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('SettingsmenuUiComponent', () => {
    let component: SettingsmenuUiComponent;
    let fixture: ComponentFixture<SettingsmenuUiComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                ColumnchooserUiModule,
                FilterUiModule,
                AngularSvgIconModule,
                HttpClientTestingModule
            ],
            declarations: [SettingsmenuUiComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SettingsmenuUiComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
});
