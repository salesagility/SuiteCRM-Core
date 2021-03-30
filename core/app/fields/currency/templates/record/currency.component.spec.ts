import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CurrencyRecordFieldsComponent} from './currency.component';

describe('CurrencyRecordFieldsComponent', () => {
    let component: CurrencyRecordFieldsComponent;
    let fixture: ComponentFixture<CurrencyRecordFieldsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CurrencyRecordFieldsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CurrencyRecordFieldsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
