import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EnumListFieldsComponent} from './enum.component';

describe('EnumListViewComponent', () => {
    let component: EnumListFieldsComponent;
    let fixture: ComponentFixture<EnumListFieldsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EnumListFieldsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EnumListFieldsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
