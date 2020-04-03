import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SettingsmenuUiComponent} from './settings-menu.component';
import {ColumnchooserUiModule} from '@components/columnchooser/columnchooser.module';
import {FilterUiModule} from '@components/filter/filter.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ApolloTestingModule} from 'apollo-angular/testing';
import {ThemeImagesFacade} from '@base/facades/theme-images/theme-images.facade';
import {of} from 'rxjs';
import {themeImagesMockData} from '@base/facades/theme-images/theme-images.facade.spec.mock';
import {take} from 'rxjs/operators';
import {ImageModule} from '@components/image/image.module';

describe('SettingsmenuUiComponent', () => {
    let component: SettingsmenuUiComponent;
    let fixture: ComponentFixture<SettingsmenuUiComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                ColumnchooserUiModule,
                FilterUiModule,
                HttpClientTestingModule,
                ApolloTestingModule,
                ImageModule
            ],
            declarations: [SettingsmenuUiComponent],
            providers: [
                {
                    provide: ThemeImagesFacade, useValue: {
                        images$: of(themeImagesMockData).pipe(take(1))
                    }
                },
            ],
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
