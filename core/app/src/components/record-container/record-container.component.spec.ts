import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ApolloTestingModule} from 'apollo-angular/testing';
import {AngularSvgIconModule} from 'angular-svg-icon';
import {RecordContainerComponent} from './record-container.component';
import {TableUiModule} from '@components/table/table.module';
import {WidgetUiModule} from '@components/widget/widget.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RecordViewStore} from '@store/record-view/record-view.store';

describe('RecordContainerComponent', () => {
    let component: RecordContainerComponent;
    let fixture: ComponentFixture<RecordContainerComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                TableUiModule,
                WidgetUiModule,
                AngularSvgIconModule,
                HttpClientTestingModule,
                BrowserAnimationsModule,
                ApolloTestingModule
            ],
            providers: [
                {
                    provide: RecordViewStore
                },
            ],
            declarations: [RecordContainerComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RecordContainerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
