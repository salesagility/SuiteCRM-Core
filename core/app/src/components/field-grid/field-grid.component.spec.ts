import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FieldGridComponent} from './field-grid.component';
import {Component} from '@angular/core';
import {ButtonModule} from '@components/button/button.module';
import {DropdownButtonModule} from '@components/dropdown-button/dropdown-button.module';
import {BrowserDynamicTestingModule} from '@angular/platform-browser-dynamic/testing';
import {LayoutModule} from '@angular/cdk/layout';
import {FieldModule} from '@fields/field.module';
import {Field} from '@fields/field.model';
import {By} from '@angular/platform-browser';
import {CommonModule} from '@angular/common';

@Component({
    selector: 'field-grid-host-component',
    template: `
        <scrm-field-grid [fieldMode]="mode" [fields]="fields" [actions]="true" [special]="special.length > 0">

            <div class="float-right mt-4" *ngIf="special.length > 0" field-grid-special>
                <div class="d-inline-block form-check mb-2 mr-sm-2" *ngFor="let item of special ">
                    <input class="form-check-input" type="checkbox" [value]="item.value">
                    <label class="form-check-label">{{item.label}}</label>
                </div>
            </div>

            <span class="float-right mt-4" field-grid-actions>
                <scrm-button *ngFor="let button of gridButtons" [config]="button"></scrm-button>
            </span>
        </scrm-field-grid>
    `
})
class FieldGridTestHostComponent {
    mode: 'edit';
    fields = [
        {
            name: 'first_name',
            label: 'First Name',
            type: 'varchar',
            value: '',
        },
        {
            name: 'last_name',
            label: 'Last Name',
            type: 'varchar',
            value: '',
        },
        {
            name: 'phone',
            label: 'Phone',
            type: 'varchar',
            value: '',
        },
    ];
    special = [
        {
            name: 'my_filters_only',
            label: 'My Filters',
            type: 'bool'
        } as Field,
        {
            name: 'favorites_only',
            label: 'Favorites',
            type: 'bool'
        } as Field,
    ];
    gridButtons = [
        {
            label: 'Clear',
            klass: ['clear-filters-button', 'btn', 'btn-outline-danger', 'btn-sm']
        },
        {
            label: 'Search',
            klass: ['filter-button', 'btn', 'btn-danger', 'btn-sm']
        }
    ];
}

describe('FieldGridComponent', () => {
    let testHostComponent: FieldGridTestHostComponent;
    let testHostFixture: ComponentFixture<FieldGridTestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                FieldGridTestHostComponent,
                FieldGridComponent
            ],
            imports: [
                ButtonModule,
                DropdownButtonModule,
                BrowserDynamicTestingModule,
                LayoutModule,
                FieldModule,
                CommonModule
            ],
            providers: [],
        }).compileComponents();

        testHostFixture = TestBed.createComponent(FieldGridTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    }));

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
    });

    it('should have grid list', async(() => {

        expect(testHostComponent).toBeTruthy();
        expect(testHostFixture.debugElement.query(By.css('scrm-field-grid')).nativeElement).toBeTruthy();
        expect(testHostFixture.debugElement.query(By.css('form')).nativeElement).toBeTruthy();
        expect(testHostFixture.debugElement.query(By.css('.clear-filters-button')).nativeElement).toBeTruthy();
        expect(testHostFixture.debugElement.query(By.css('.filter-button')).nativeElement).toBeTruthy();
    }));
});
