import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ListheaderUiComponent} from './list-header.component';
import {ModuletitleUiModule} from '@components/module-title/module-title.module';
import {ActionmenuUiModule} from '@components/action-menu/action-menu.module';
import {SettingsmenuUiModule} from '@components/settings-menu/settings-menu.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ApolloTestingModule} from 'apollo-angular/testing';
import {ImageModule} from '@components/image/image.module';
import {ThemeImagesFacade} from '@base/facades/theme-images/theme-images.facade';
import {of} from 'rxjs';
import {themeImagesMockData} from '@base/facades/theme-images/theme-images.facade.spec.mock';
import {take} from 'rxjs/operators';

describe('ListheaderUiComponent', () => {
    let component: ListheaderUiComponent;
    let fixture: ComponentFixture<ListheaderUiComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                ModuletitleUiModule,
                ActionmenuUiModule,
                SettingsmenuUiModule,
                ApolloTestingModule,
                HttpClientTestingModule,
                ImageModule
            ],
            declarations: [ListheaderUiComponent],
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
        fixture = TestBed.createComponent(ListheaderUiComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
