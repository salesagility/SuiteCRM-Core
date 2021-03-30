import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RelateListFieldsComponent} from './relate.component';

describe('RelateListFieldsComponent', () => {
    let component: RelateListFieldsComponent;
    let fixture: ComponentFixture<RelateListFieldsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RelateListFieldsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RelateListFieldsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
});
