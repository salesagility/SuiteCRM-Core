import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CronscheduleListFieldsComponent} from './cronschedule.component';

describe('CronscheduleListFieldsComponent', () => {
    let component: CronscheduleListFieldsComponent;
    let fixture: ComponentFixture<CronscheduleListFieldsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CronscheduleListFieldsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CronscheduleListFieldsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
