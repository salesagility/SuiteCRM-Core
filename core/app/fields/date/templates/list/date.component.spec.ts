import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DateListFieldsComponent} from './date.component';

describe('DateListFieldsComponent', () => {
    let component: DateListFieldsComponent;
    let fixture: ComponentFixture<DateListFieldsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DateListFieldsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DateListFieldsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
});
