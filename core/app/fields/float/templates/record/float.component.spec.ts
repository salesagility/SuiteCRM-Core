import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FloatRecordViewComponent} from './float.component';

describe('FloatRecordViewComponent', () => {
    let component: FloatRecordViewComponent;
    let fixture: ComponentFixture<FloatRecordViewComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FloatRecordViewComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FloatRecordViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
});
