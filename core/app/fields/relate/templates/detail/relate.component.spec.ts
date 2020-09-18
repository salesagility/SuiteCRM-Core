import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RelateDetailFieldsComponent} from './relate.component';
import {Component} from '@angular/core';
import {Field} from '@app-common/record/field.model';
import {Record} from '@app-common/record/record.model';
import {RouterTestingModule} from '@angular/router/testing';

@Component({
    selector: 'relate-detail-field-test-host-component',
    template: '<scrm-relate-detail [field]="field" [record]="record"></scrm-relate-detail>'
})
class RelateDetailFieldTestHostComponent {
    field: Field = {
        type: 'relate',
        value: 'Related Contact',
        definition: {
            module: 'Contacts',
            // eslint-disable-next-line camelcase, @typescript-eslint/camelcase
            id_name: 'contact_id'
        }
    };

    record: Record = {
        type: '',
        module: 'Calls',
        attributes: {
            // eslint-disable-next-line camelcase, @typescript-eslint/camelcase
            contact_id: '1'
        }
    };
}

describe('RelateRecordFieldsComponent', () => {
    let testHostComponent: RelateDetailFieldTestHostComponent;
    let testHostFixture: ComponentFixture<RelateDetailFieldTestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                RelateDetailFieldTestHostComponent,
                RelateDetailFieldsComponent
            ],
            imports: [RouterTestingModule],
            providers: [],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        testHostFixture = TestBed.createComponent(RelateDetailFieldTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    });

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
    });
});
