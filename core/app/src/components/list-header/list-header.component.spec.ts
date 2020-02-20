import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ListheaderUiComponent} from './list-header.component';
import {ModuletitleUiModule} from '@components/module-title/module-title.module';
import {ActionmenuUiModule} from '@components/action-menu/action-menu.module';
import {SettingsmenuUiModule} from '@components/settings-menu/settings-menu.module';
import {AngularSvgIconModule} from 'angular-svg-icon';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('ListheaderUiComponent', () => {
    let component: ListheaderUiComponent;
    let fixture: ComponentFixture<ListheaderUiComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                ModuletitleUiModule,
                ActionmenuUiModule,
                SettingsmenuUiModule,
                AngularSvgIconModule,
                HttpClientTestingModule
            ],
            declarations: [ListheaderUiComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ListheaderUiComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
});
