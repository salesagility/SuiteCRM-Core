import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ApolloTestingModule} from 'apollo-angular/testing';
import {RecordHeaderComponent} from './record-header.component';
import {ModuleTitleModule} from '@components/module-title/module-title.module';
import {ActionMenuModule} from '@components/action-menu/action-menu.module';
import {SettingsMenuModule} from '@components/settings-menu/settings-menu.module';
import {ImageModule} from '@components/image/image.module';
import {RouterTestingModule} from '@angular/router/testing';
import {ButtonModule} from '@components/button/button.module';
import {ListFilterModule} from '@components/list-filter/list-filter.module';
import {RecordViewStore} from '@store/record-view/record-view.store';

@Component({
    selector: 'list-record-test-host-component',
    template: '<scrm-record-header></scrm-record-header>'
})
class RecordHeaderTestHostComponent {
}

describe('RecordHeaderComponent', () => {
    let testHostComponent: RecordHeaderTestHostComponent;
    let testHostFixture: ComponentFixture<RecordHeaderTestHostComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                ModuleTitleModule,
                ActionMenuModule,
                ButtonModule,
                SettingsMenuModule,
                ApolloTestingModule,
                HttpClientTestingModule,
                ImageModule,
                ListFilterModule,
                RouterTestingModule
            ],
            declarations: [RecordHeaderComponent, RecordHeaderTestHostComponent],
            providers: [
                {provide: RecordViewStore},
            ],
        })
            .compileComponents();
    });

    beforeEach(() => {
        testHostFixture = TestBed.createComponent(RecordHeaderTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    });

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
    });
});
