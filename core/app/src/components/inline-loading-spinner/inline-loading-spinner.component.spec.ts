import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {InlineLoadingSpinnerComponent} from './inline-loading-spinner.component';

describe('InlineLoadingSpinnerComponent', () => {
    let component: InlineLoadingSpinnerComponent;
    let fixture: ComponentFixture<InlineLoadingSpinnerComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [InlineLoadingSpinnerComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(InlineLoadingSpinnerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
