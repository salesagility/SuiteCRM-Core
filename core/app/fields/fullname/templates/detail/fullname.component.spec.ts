import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FullNameDetailFieldsComponent} from './fullname.component';
import {Component} from '@angular/core';
import {Field} from '@app-common/record/field.model';

@Component({
    selector: 'fullname-detail-field-test-host-component',
    template: '<scrm-fullname-detail [field]="field" [record]="record"></scrm-fullname-detail>'
})
class FullNameDetailFieldTestHostComponent {
    field: Field = {
        type: 'fullname',
        value: 'salutation, first_name, last_name',
    };
    record = {
        type: '',
        module: 'leads',
        fields: {
            // eslint-disable-next-line camelcase, @typescript-eslint/camelcase
            salutation: 'User',
            // eslint-disable-next-line camelcase, @typescript-eslint/camelcase
            first_name: 'Test',
            // eslint-disable-next-line camelcase, @typescript-eslint/camelcase
            last_name: 'Name',
        }
    };
}

describe('FullNameDetailFieldsComponent', () => {
    let testHostComponent: FullNameDetailFieldTestHostComponent;
    let testHostFixture: ComponentFixture<FullNameDetailFieldTestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                FullNameDetailFieldTestHostComponent,
                FullNameDetailFieldsComponent,
            ],
            imports: [],
            providers: [],
        }).compileComponents();
    }));

    beforeEach(() => {
        testHostFixture = TestBed.createComponent(FullNameDetailFieldTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    });

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
    });
});
