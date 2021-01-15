import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RecordListModalComponent} from './record-list-modal.component';
import {Component, OnInit} from '@angular/core';
import {NgbModalRef} from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {LanguageStore} from '@store/language/language.store';
import {languageStoreMock} from '@store/language/language.store.spec.mock';
import {RecordListModalModule} from '@containers/record-list-modal/components/record-list-modal/record-list-modal.module';
import {RecordListModalStoreFactory} from '@containers/record-list-modal/store/record-list-modal/record-list-modal.store.factory';
import {recordlistModalStoreFactoryMock} from '@containers/record-list-modal/store/record-list-modal/record-list-modal.store.spec.mock';
import {ThemeImagesStore} from '@store/theme-images/theme-images.store';
import {themeImagesStoreMock} from '@store/theme-images/theme-images.store.spec.mock';
import {ModuleNavigation} from '@services/navigation/module-navigation/module-navigation.service';
import {mockModuleNavigation} from '@services/navigation/module-navigation/module-navigation.service.spec.mock';
import {interval} from 'rxjs';
import {take} from 'rxjs/operators';

@Component({
    selector: 'record-list-modal-test-host-component',
    template: '<div></div>'
})
class RecordListModalTestHostComponent implements OnInit {
    modal: NgbModalRef;

    constructor(public modalService: NgbModal) {
    }

    ngOnInit(): void {
        this.modal = this.modalService.open(RecordListModalComponent, {size: 'xl', scrollable: true});

        this.modal.componentInstance.module = 'accounts';
    }
}

describe('RecordListModalComponent', () => {
    let component: RecordListModalTestHostComponent;
    let fixture: ComponentFixture<RecordListModalTestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RecordListModalTestHostComponent],
            imports: [
                RecordListModalModule,
            ],
            providers: [
                {provide: LanguageStore, useValue: languageStoreMock},
                {provide: RecordListModalStoreFactory, useValue: recordlistModalStoreFactoryMock},
                {provide: ThemeImagesStore, useValue: themeImagesStoreMock},
                {provide: ModuleNavigation, useValue: mockModuleNavigation},
            ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RecordListModalTestHostComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should have a table', async (done) => {
        expect(component).toBeTruthy();

        fixture.detectChanges();
        await fixture.whenRenderingDone();

        await interval(1000).pipe(take(1)).toPromise();

        const table = document.getElementsByTagName('scrm-table');

        expect(table).toBeTruthy();
        expect(table.length).toEqual(1);

        component.modal.close();

        await interval(1000).pipe(take(1)).toPromise();

        done();
    });

});
