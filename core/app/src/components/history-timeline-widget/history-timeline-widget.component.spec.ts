import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {HistoryTimelineWidgetComponent} from './history-timeline-widget.component';
import {CollectionViewer, ListRange} from '@angular/cdk/collections';
import {of} from 'rxjs';
import {RecordViewStore} from '@store/record-view/record-view.store';
import {recordviewStoreMock} from '@store/record-view/record-view.store.spec.mock';
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

describe('HistoryTimelineWidgetComponent', () => {
    let component: HistoryTimelineWidgetComponent;
    let fixture: ComponentFixture<HistoryTimelineWidgetComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                HistoryTimelineWidgetComponent
            ],
            providers: [
                {provide: RecordViewStore, useValue: recordviewStoreMock},
                {provide: ThemeImagesStore, useValue: themeImagesStoreMock},
                {provide: SystemConfigStore, useValue: systemConfigStoreMock},
                {provide: Router, useValue: mockRouter},
            ],
            imports: [
                CommonModule,
                ScrollingModule,
                ImageModule,
                FieldModule,
                RouterTestingModule
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(HistoryTimelineWidgetComponent);
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
