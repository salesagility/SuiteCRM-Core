import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SettingsMenuComponent} from './settings-menu.component';
import {ColumnChooserModule} from '@components/columnchooser/columnchooser.module';
import {FilterUiModule} from '@components/filter/filter.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ApolloTestingModule} from 'apollo-angular/testing';
import {ThemeImagesStore} from '@store/theme-images/theme-images.store';
import {of} from 'rxjs';
import {themeImagesMockData} from '@store/theme-images/theme-images.store.spec.mock';
import {take} from 'rxjs/operators';
import {ImageModule} from '@components/image/image.module';
import {ButtonModule} from '@components/button/button.module';
import {ListViewStore} from '@store/list-view/list-view.store';
import {listviewStoreMock} from '@store/list-view/list-view.store.spec.mock';

describe('SettingsmenuUiComponent', () => {
    let component: SettingsMenuComponent;
    let fixture: ComponentFixture<SettingsMenuComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                ColumnChooserModule,
                FilterUiModule,
                HttpClientTestingModule,
                ApolloTestingModule,
                ImageModule,
                ButtonModule,
            ],
            declarations: [SettingsMenuComponent],
            providers: [
                {provide: ListViewStore, useValue: listviewStoreMock},
                {
                    provide: ThemeImagesStore, useValue: {
                        images$: of(themeImagesMockData).pipe(take(1))
                    }
                },
            ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SettingsMenuComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
