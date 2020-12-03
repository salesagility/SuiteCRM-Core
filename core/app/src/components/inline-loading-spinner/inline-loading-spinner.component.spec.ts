import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {InlineLoadingSpinnerComponent} from './inline-loading-spinner.component';

describe('InlineLoadingSpinnerComponent', () => {
    let component: InlineLoadingSpinnerComponent;
    let fixture: ComponentFixture<InlineLoadingSpinnerComponent>;

    beforeEach(waitForAsync(() => {
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
