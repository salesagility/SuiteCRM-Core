import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CollectionListViewComponent} from './collection.component';

describe('CollectionListViewComponent', () => {
    let component: CollectionListViewComponent;
    let fixture: ComponentFixture<CollectionListViewComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CollectionListViewComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CollectionListViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
