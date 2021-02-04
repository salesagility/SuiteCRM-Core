import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {HistorySidebarWidgetComponent} from './history-sidebar-widget.component';
import {CollectionViewer, ListRange} from '@angular/cdk/collections';
import {of} from 'rxjs';
import {RecordViewStore} from '@views/record/store/record-view/record-view.store';
import {recordviewStoreMock} from '@views/record/store/record-view/record-view.store.spec.mock';
import {FieldModule} from '@fields/field.module';
import {CommonModule} from '@angular/common';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {ImageModule} from '@components/image/image.module';
import {ThemeImagesStore} from '@store/theme-images/theme-images.store';
import {themeImagesStoreMock} from '@store/theme-images/theme-images.store.spec.mock';
import {Router} from '@angular/router';
import {mockRouter} from '@services/navigation/module-navigation/module-navigation.service.spec.mock';
import {SystemConfigStore} from '@store/system-config/system-config.store';
import {systemConfigStoreMock} from '@store/system-config/system-config.store.spec.mock';
import {RouterTestingModule} from '@angular/router/testing';
import {take} from 'rxjs/operators';
import {LanguageStore} from '@store/language/language.store';
import {languageStoreMock} from '@store/language/language.store.spec.mock';
import {ApolloTestingModule} from 'apollo-angular/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

describe('HistoryTimelineWidgetComponent', () => {
    let component: HistorySidebarWidgetComponent;
    let fixture: ComponentFixture<HistorySidebarWidgetComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                HistorySidebarWidgetComponent
            ],
            providers: [
                {provide: RecordViewStore, useValue: recordviewStoreMock},
                {provide: ThemeImagesStore, useValue: themeImagesStoreMock},
                {provide: SystemConfigStore, useValue: systemConfigStoreMock},
                {provide: LanguageStore, useValue: languageStoreMock},
                {provide: Router, useValue: mockRouter},
            ],
            imports: [
                CommonModule,
                ScrollingModule,
                ImageModule,
                FieldModule,
                ApolloTestingModule,
                RouterTestingModule,
                NoopAnimationsModule
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(HistorySidebarWidgetComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.adapter.connect({
            viewChange: of({start: 1, end: 5} as ListRange)
        } as CollectionViewer).pipe(take(1)).subscribe();
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();

        const timeline = fixture.nativeElement.getElementsByClassName('history-timeline');

        expect(timeline).toBeTruthy();
        expect(timeline.length).toEqual(1);

        const infiniteScroll = timeline.item(0).getElementsByTagName('cdk-virtual-scroll-viewport');

        expect(infiniteScroll).toBeTruthy();
        expect(infiniteScroll.length).toEqual(1);

    });
});
