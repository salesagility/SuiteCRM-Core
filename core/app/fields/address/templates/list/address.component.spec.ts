import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AddressListFieldsComponent} from './address.component';

describe('AddressListViewComponent', () => {
    let component: AddressListFieldsComponent;
    let fixture: ComponentFixture<AddressListFieldsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AddressListFieldsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AddressListFieldsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
