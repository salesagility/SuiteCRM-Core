import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FullnameListFieldsComponent} from './fullname.component';

describe('FullnameListFieldsComponent', () => {
    let component: FullnameListFieldsComponent;
    let fixture: ComponentFixture<FullnameListFieldsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FullnameListFieldsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FullnameListFieldsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
