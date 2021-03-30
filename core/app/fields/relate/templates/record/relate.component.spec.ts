import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RelateRecordFieldsComponent} from './relate.component';

describe('RelateRecordFieldsComponent', () => {
    let component: RelateRecordFieldsComponent;
    let fixture: ComponentFixture<RelateRecordFieldsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RelateRecordFieldsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RelateRecordFieldsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
