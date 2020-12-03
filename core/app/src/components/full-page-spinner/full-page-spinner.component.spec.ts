import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {FullPageSpinnerComponent} from './full-page-spinner.component';

describe('FullPageSpinnerComponent', () => {
    let component: FullPageSpinnerComponent;
    let fixture: ComponentFixture<FullPageSpinnerComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [FullPageSpinnerComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FullPageSpinnerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
