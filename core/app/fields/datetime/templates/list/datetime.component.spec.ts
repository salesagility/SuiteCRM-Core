import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DatetimeListFieldsComponent} from './datetime.component';

describe('DatetimeListFieldsComponent', () => {
    let component: DatetimeListFieldsComponent;
    let fixture: ComponentFixture<DatetimeListFieldsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DatetimeListFieldsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DatetimeListFieldsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
