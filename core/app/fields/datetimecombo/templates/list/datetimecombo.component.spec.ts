import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DatetimecomboListFieldsComponent} from './datetimecombo.component';

describe('DatetimecomboListFieldsComponent', () => {
    let component: DatetimecomboListFieldsComponent;
    let fixture: ComponentFixture<DatetimecomboListFieldsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DatetimecomboListFieldsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DatetimecomboListFieldsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
