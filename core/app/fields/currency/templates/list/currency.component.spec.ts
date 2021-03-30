import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CurrencyListFieldsComponent} from './currency.component';

describe('CurrencyListFieldsComponent', () => {
    let component: CurrencyListFieldsComponent;
    let fixture: ComponentFixture<CurrencyListFieldsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CurrencyListFieldsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CurrencyListFieldsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
