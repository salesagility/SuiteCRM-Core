import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ApolloTestingModule} from 'apollo-angular/testing';
import {ImageModule} from '@components/image/image.module';
import {DynamicModule} from 'ng-dynamic-component';
import {FieldModule} from '@fields/field.module';
import {DropdownButtonModule} from '@components/dropdown-button/dropdown-button.module';
import {SortButtonModule} from '@components/sort-button/sort-button.module';
import {RecordViewStore} from '@store/record-view/record-view.store';
import {RecordComponent} from '@views/record/record.component';

@Component({
    selector: 'record-test-host-component',
    template: '<scrm-record></scrm-record>'
})
class RecordTestHostComponent {
}

describe('RecordComponent', () => {
    let testHostComponent: RecordTestHostComponent;
    let testHostFixture: ComponentFixture<RecordTestHostComponent>;

    beforeEach(async(() => {
        /* eslint-disable camelcase, @typescript-eslint/camelcase */
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RouterTestingModule,
                BrowserAnimationsModule,
                ImageModule,
                ApolloTestingModule,
                DynamicModule,
                FieldModule,
                DropdownButtonModule,
                DropdownButtonModule,
                SortButtonModule
            ],
            declarations: [RecordComponent, RecordTestHostComponent],
            providers: [
                {
                    provide: RecordViewStore
                }
            ],
        })
            .compileComponents();
        /* eslint-enable camelcase, @typescript-eslint/camelcase */
    }));

    beforeEach(() => {
        testHostFixture = TestBed.createComponent(RecordTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    });

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
    });
});
