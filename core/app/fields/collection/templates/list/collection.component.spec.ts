import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CollectionListFieldsComponent} from './collection.component';

describe('CollectionListViewComponent', () => {
    let component: CollectionListFieldsComponent;
    let fixture: ComponentFixture<CollectionListFieldsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CollectionListFieldsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CollectionListFieldsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
