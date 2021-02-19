/**
 * SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.
 * Copyright (C) 2021 SalesAgility Ltd.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by the
 * Free Software Foundation with the addition of the following permission added
 * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
 * IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE
 * WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License
 * version 3, these Appropriate Legal Notices must retain the display of the
 * "Supercharged by SuiteCRM" logo. If the display of the logos is not reasonably
 * feasible for technical reasons, the Appropriate Legal Notices must display
 * the words "Supercharged by SuiteCRM".
 */

import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {RecordListModalComponent} from './record-list-modal.component';
import {Component, OnInit} from '@angular/core';
import {NgbModalRef} from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {LanguageStore} from 'core';
import {languageStoreMock} from 'core';
import {RecordListModalModule} from '@containers/record-list-modal/components/record-list-modal/record-list-modal.module';
import {RecordListModalStoreFactory} from '@containers/record-list-modal/store/record-list-modal/record-list-modal.store.factory';
import {recordlistModalStoreFactoryMock} from '@containers/record-list-modal/store/record-list-modal/record-list-modal.store.spec.mock';
import {ThemeImagesStore} from 'core';
import {themeImagesStoreMock} from 'core';
import {ModuleNavigation} from 'core';
import {
    mockModuleNavigation,
    mockRouter
} from 'core';
import {interval} from 'rxjs';
import {take} from 'rxjs/operators';
import {RouterTestingModule} from '@angular/router/testing';
import {Router} from '@angular/router';

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

    beforeEach(waitForAsync(() => {
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
                {provide: Router, useValue: mockRouter},
                RouterTestingModule
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
        expect(table.length).toBeTruthy();

        component.modal.close();

        await interval(1000).pipe(take(1)).toPromise();

        done();
    });

    it('should have a filter panel', async (done) => {
        expect(component).toBeTruthy();

        fixture.detectChanges();
        await fixture.whenRenderingDone();

        await interval(1000).pipe(take(1)).toPromise();

        const table = document.getElementsByTagName('scrm-list-filter');

        expect(table).toBeTruthy();
        expect(table.length).toBeTruthy();

        component.modal.close();

        await interval(1000).pipe(take(1)).toPromise();

        done();
    });

});
