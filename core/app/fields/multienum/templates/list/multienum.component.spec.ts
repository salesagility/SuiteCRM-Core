import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MultiEnumListFieldsComponent} from './multienum.component';

describe('MultiEnumListFieldsComponent', () => {
    let component: MultiEnumListFieldsComponent;
    let fixture: ComponentFixture<MultiEnumListFieldsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MultiEnumListFieldsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MultiEnumListFieldsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
