import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MultienumListFieldsComponent} from './multienum.component';

describe('MultiEnumListFieldsComponent', () => {
    let component: MultienumListFieldsComponent;
    let fixture: ComponentFixture<MultienumListFieldsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MultienumListFieldsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MultienumListFieldsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
