import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SubmitListFieldsComponent} from './submit.component';

describe('SubmitListFieldsComponent', () => {
    let component: SubmitListFieldsComponent;
    let fixture: ComponentFixture<SubmitListFieldsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SubmitListFieldsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SubmitListFieldsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
