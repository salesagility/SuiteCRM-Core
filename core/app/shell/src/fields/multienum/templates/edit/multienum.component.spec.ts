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
import {Component} from '@angular/core';
import {Field} from 'common';
import {LanguageStore} from 'core';
import {languageStoreMock} from 'core';
import {TagInputModule} from 'ngx-chips';
import {FormsModule} from '@angular/forms';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserDynamicTestingModule} from '@angular/platform-browser-dynamic/testing';
import {MultiEnumEditFieldComponent} from '@fields/multienum/templates/edit/multienum.component';
import {UserPreferenceStore} from 'core';
import {userPreferenceStoreMock} from 'core';
import {NumberFormatter} from 'core';
import {numberFormatterMock} from 'core';
import {DatetimeFormatter} from 'core';
import {datetimeFormatterMock} from 'core';
import {DateFormatter} from 'core';
import {dateFormatterMock} from 'core';
import {CurrencyFormatter} from 'core';
import {waitUntil} from 'common';

@Component({
    selector: 'multienum-edit-field-test-host-component',
    template: '<scrm-multienum-edit [field]="field"></scrm-multienum-edit>'
})
class MultiEnumEditFieldTestHostComponent {
    field: Field = {
        type: 'multienum',
        value: null,
        valueList: [
            '_customer',
            '_reseller'
        ],
        metadata: null,
        definition: {
            options: 'account_type_dom'
        }
    };
}

describe('MultiEnumEditFieldComponent', () => {
    let testHostComponent: MultiEnumEditFieldTestHostComponent;
    let testHostFixture: ComponentFixture<MultiEnumEditFieldTestHostComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                MultiEnumEditFieldTestHostComponent,
                MultiEnumEditFieldComponent,
            ],
            imports: [
                TagInputModule,
                FormsModule,
                BrowserDynamicTestingModule,
                NoopAnimationsModule
            ],
            providers: [
                {provide: LanguageStore, useValue: languageStoreMock},
                {provide: UserPreferenceStore, useValue: userPreferenceStoreMock},
                {provide: NumberFormatter, useValue: numberFormatterMock},
                {provide: DatetimeFormatter, useValue: datetimeFormatterMock},
                {provide: DateFormatter, useValue: dateFormatterMock},
                {
                    provide: CurrencyFormatter,
                    useValue: new CurrencyFormatter(userPreferenceStoreMock, numberFormatterMock, 'en_us')
                },
            ],
        }).compileComponents();

        testHostFixture = TestBed.createComponent(MultiEnumEditFieldTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    }));

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
    });

    it('should have value', async (done) => {
        expect(testHostComponent).toBeTruthy();

        testHostFixture.detectChanges();
        await testHostFixture.whenRenderingDone();

        const field = testHostFixture.nativeElement.getElementsByTagName('scrm-multienum-edit')[0];

        expect(field).toBeTruthy();

        const tagInput = field.getElementsByTagName('tag-input').item(0);

        expect(tagInput).toBeTruthy();

        const tag1 = tagInput.getElementsByTagName('tag').item(0);

        expect(tag1).toBeTruthy();

        const tagText1 = tag1.getElementsByClassName('tag__text').item(0);

        expect(tagText1.textContent).toContain('Customer');
        expect(tagText1.textContent).not.toContain('_customer');

        const deleteIcon1 = tag1.getElementsByTagName('delete-icon').item(0);

        expect(deleteIcon1).toBeTruthy();

        const tag2 = tagInput.getElementsByTagName('tag').item(1);

        expect(tag2).toBeTruthy();

        const tagText2 = tag2.getElementsByClassName('tag__text').item(0);

        expect(tagText2.textContent).toContain('Reseller');
        expect(tagText2.textContent).not.toContain('_reseller');

        const deleteIcon2 = tag1.getElementsByTagName('delete-icon').item(0);

        expect(deleteIcon2).toBeTruthy();

        done();
    });

    it('should allow removing value', async (done) => {
        expect(testHostComponent).toBeTruthy();

        testHostFixture.detectChanges();
        await testHostFixture.whenRenderingDone();

        const element = testHostFixture.nativeElement;

        await waitUntil(() => element.getElementsByTagName('delete-icon').item(0));

        const deleteIcon = element.getElementsByTagName('delete-icon').item(0);

        expect(deleteIcon).toBeTruthy();

        deleteIcon.click();

        testHostFixture.detectChanges();
        await testHostFixture.whenRenderingDone();

        const tag = element.getElementsByTagName('tag');

        expect(tag).toBeTruthy();
        expect(tag.length).toEqual(1);

        done();
    });
});
