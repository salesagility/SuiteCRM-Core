import {CommonModule} from '@angular/common';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {Component} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterModule} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {AppManagerModule} from '@base/app-manager/app-manager.module';
import {MetadataStore} from '@base/store/metadata/metadata.store.service';
import {ImageModule} from '@components/image/image.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {LanguageStore} from '@store/language/language.store';
import {languageStoreMock} from '@store/language/language.store.spec.mock';
import {RecordViewStore} from '@store/record-view/record-view.store';
import {recordviewStoreMock} from '@store/record-view/record-view.store.spec.mock';
import {ApolloTestingModule} from 'apollo-angular/testing';
import {ButtonGroupModule} from '../button-group/button-group.module';
import {PanelModule} from '../panel/panel.module';
import {SubpanelComponent} from './subpanel.component';
import {metadataStoreMock} from '@store/metadata/metadata.store.spec.mock';

const store = recordviewStoreMock.getSubpanels().contacts;

@Component({
    selector: 'subpanel-test-host-component',
    template: '<scrm-subpanel [recordStore]="recordStore" [store]="store"></scrm-subpanel>'
})
class SubpanelComponentTestHostComponent {
    recordStore = recordviewStoreMock;
    store = store;
}

describe('SubpanelComponent', () => {
    let testHostComponent: SubpanelComponentTestHostComponent;
    let testHostFixture: ComponentFixture<SubpanelComponentTestHostComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                CommonModule,
                NgbModule,
                ImageModule,
                AppManagerModule.forChild(SubpanelComponent),
                PanelModule,
                RouterModule,
                ButtonGroupModule,
                ApolloTestingModule,
                HttpClientTestingModule,
                RouterTestingModule
            ],
            declarations: [SubpanelComponent, SubpanelComponentTestHostComponent],
            providers: [
                {provide: LanguageStore, useValue: languageStoreMock},
                {provide: RecordViewStore, useValue: recordviewStoreMock},
                {provide: MetadataStore, useValue: metadataStoreMock},
            ],
        })
            .compileComponents();
    });

    beforeEach(() => {
        testHostFixture = TestBed.createComponent(SubpanelComponentTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    });

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
    });
});
