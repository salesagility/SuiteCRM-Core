import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EnumListViewComponent} from './enum.component';

describe('EnumListViewComponent', () => {
    let component: EnumListViewComponent;
    let fixture: ComponentFixture<EnumListViewComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EnumListViewComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EnumListViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
