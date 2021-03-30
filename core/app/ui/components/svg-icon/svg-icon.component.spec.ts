import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SvgIconComponent} from './svg-icon.component';

describe('SvgiconComponent', () => {
    let component: SvgIconComponent;
    let fixture: ComponentFixture<SvgIconComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SvgIconComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SvgIconComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
